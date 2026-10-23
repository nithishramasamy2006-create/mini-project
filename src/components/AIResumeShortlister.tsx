import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, Star, TrendingUp, CheckCircle, ChevronDown,
  ChevronUp, Target, Award, Users, Sparkles, ArrowRight,
  BarChart2, Filter, RefreshCw, Download,
} from 'lucide-react';
import { portalAppGetByAuthor, portalAppUpdateStatus, type PortalApplication } from '../portalApplications';
import { portalGetByAuthor } from '../portalData';

interface AIScore {
  total: number; skillMatch: number; experience: number; education: number; motivation: number;
  breakdown: string[]; strengths: string[]; gaps: string[];
  recommendation: 'strong' | 'good' | 'average' | 'weak';
}

const BRANCH_WEIGHTS: Record<string, number> = {
  'CSE':10,'IT':10,'AIDS':10,'AIML':10,'CSD':9,'ECE':7,'EEE':5,'MECH':4,'CIVIL':3,'MBA':6,'MCA':9,
};
const YEAR_WEIGHTS: Record<string, number> = {
  '4th Year':10,'PG 2nd Year':10,'PG 1st Year':9,'3rd Year':7,'Passout':10,'2nd Year':4,
};
const SKILL_ALIASES: Record<string, string[]> = {
  react:['reactjs','react.js'],node:['nodejs','node.js','express'],python:['django','flask','fastapi'],
  java:['spring','springboot'],typescript:['ts','tsx'],javascript:['js','es6'],
  sql:['mysql','postgresql','postgres'],mongodb:['mongo','nosql'],aws:['amazon web services','ec2'],
  docker:['kubernetes','k8s'],ml:['machine learning','scikit-learn','sklearn'],
  ai:['artificial intelligence','deep learning'],nlp:['bert','gpt','transformers'],
};

function normalizeSkill(s: string): string {
  const lower = s.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (lower === canonical || aliases.some(a => lower.includes(a) || a.includes(lower))) return canonical;
  }
  return lower;
}

function computeAIScore(app: PortalApplication, jobItem: any): AIScore {
  const breakdown: string[] = [], strengths: string[] = [], gaps: string[] = [];
  let skillMatch = 0, experience = 0, education = 0, motivation = 0;

  const jobSkills: string[] = (
    typeof jobItem?.skills === 'string' ? jobItem.skills.split(',') :
    Array.isArray(jobItem?.skills) ? jobItem.skills : []
  ).map((s: string) => normalizeSkill(s));

  const coverText = `${app.coverLetter??''} ${app.studentBranch??''} ${app.studentYear??''}`.toLowerCase();
  const matchedSkills: string[] = [], missingSkills: string[] = [];
  jobSkills.forEach(skill => {
    const aliases = [skill,...(SKILL_ALIASES[skill]??[])];
    (aliases.some(a => coverText.includes(a)) ? matchedSkills : missingSkills).push(skill);
  });
  const skillPct = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0.5;
  skillMatch = Math.round(skillPct * 40);
  breakdown.push(`Skill match: ${matchedSkills.length}/${jobSkills.length} (${Math.round(skillPct*100)}%)`);
  if (matchedSkills.length > 0) strengths.push(`Matched: ${matchedSkills.slice(0,3).join(', ')}`);
  if (missingSkills.length > 0) gaps.push(`Missing: ${missingSkills.slice(0,3).join(', ')}`);

  const expKw = ['intern','project','built','developed','led','deployed','published','contributed','worked on','experience','production'];
  const expMatches = expKw.filter(k => coverText.includes(k)).length;
  experience = Math.min(20, Math.round((expMatches/expKw.length)*20) + (app.resumeLink?4:0));
  breakdown.push(`Experience signals: ${expMatches} keyword hits`);
  if (app.resumeLink) strengths.push('Resume/portfolio provided');
  if (expMatches < 2) gaps.push('Limited experience evidence');

  const branchScore = BRANCH_WEIGHTS[app.studentBranch??'']??3;
  const yearScore   = YEAR_WEIGHTS[app.studentYear??'']??4;
  education = Math.round(((branchScore+yearScore)/20)*20);
  breakdown.push(`Education: ${app.studentBranch??'—'} · ${app.studentYear??'—'}`);
  if (branchScore >= 9) strengths.push(`Strong branch (${app.studentBranch})`);
  else if (branchScore < 5) gaps.push(`Branch ${app.studentBranch??'—'} less aligned`);

  const motivWords = ['passionate','excited','love','keen','eager','motivated','dedicated','contribute','grow','opportunity','believe'];
  const motivCount = motivWords.filter(w => coverText.includes(w)).length;
  const coverLen = (app.coverLetter??'').length;
  motivation = Math.min(20, Math.round((motivCount/motivWords.length)*14) + (coverLen>300?5:coverLen>150?3:0));
  breakdown.push(`Motivation: ${motivCount} positive signals`);
  if (motivation >= 14) strengths.push('Highly motivated cover letter');
  else if (motivation < 6) gaps.push('Cover letter lacks enthusiasm');

  const total = Math.min(100, skillMatch + experience + education + motivation);
  const recommendation: AIScore['recommendation'] =
    total>=75?'strong': total>=55?'good': total>=35?'average':'weak';
  return {total,skillMatch,experience,education,motivation,breakdown,strengths,gaps,recommendation};
}

function scoreColor(s: number) { return s>=75?'#10b981':s>=55?'#3b82f6':s>=35?'#f59e0b':'#ef4444'; }
function recLabel(r: AIScore['recommendation']) {
  return ({
    strong:  {label:'Strongly Recommended',icon:'🏆',color:'#10b981'},
    good:    {label:'Good Candidate',       icon:'⭐',color:'#3b82f6'},
    average: {label:'Average Fit',          icon:'📊',color:'#f59e0b'},
    weak:    {label:'Low Match',            icon:'⚠️',color:'#ef4444'},
  })[r];
}

function CandidateCard({ app, score, rank, onShortlist, onReject, onInterview, isProcessing }:
  { app:PortalApplication; score:AIScore; rank:number; onShortlist:(id:number)=>void; onReject:(id:number)=>void; onInterview:(id:number)=>void; isProcessing:boolean; }) {
  const [expanded, setExpanded] = useState(false);
  const sc = scoreColor(score.total);
  const rec = recLabel(score.recommendation);
  const isShortlisted = ['shortlisted','interview','hired'].includes(app.status);
  const isRejected    = app.status === 'rejected';
  return (
    <motion.div layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:rank*0.04}}
      style={{borderRadius:16,background:'var(--surface)',marginBottom:10,
        border:`1.5px solid ${isShortlisted?`${sc}40`:isRejected?'rgba(239,68,68,0.2)':'var(--border)'}`,
        overflow:'hidden',boxShadow:rank<=2?`0 4px 24px ${sc}18`:'none'}}>
      <div style={{height:3,background:`linear-gradient(90deg,${sc},${sc}40)`}}/>
      {rank<=2&&<div style={{position:'absolute',top:16,right:16,fontSize:20,zIndex:2,pointerEvents:'none'}}>{rank===0?'🥇':rank===1?'🥈':'🥉'}</div>}
      <div style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:28,height:28,borderRadius:'50%',background:`${sc}18`,border:`1.5px solid ${sc}30`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:sc,flexShrink:0}}>#{rank+1}</div>
        <div style={{width:42,height:42,borderRadius:12,background:`${sc}15`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:17,color:sc,flexShrink:0}}>{app.studentName[0]?.toUpperCase()||'?'}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:14,color:'var(--text)',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            {app.studentName}
            <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:999,background:rec.color+'18',color:rec.color}}>{rec.icon} {rec.label}</span>
          </div>
          <div style={{fontSize:11.5,color:'var(--text-3)',marginTop:2}}>
            {app.studentBranch||'—'} · {app.studentYear||'—'} · {app.studentCollege||app.studentEmail}
          </div>
        </div>
        <div style={{textAlign:'center',flexShrink:0}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:`conic-gradient(${sc} ${score.total*3.6}deg,var(--border) 0deg)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:'var(--surface)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
              <div style={{fontSize:14,fontWeight:900,color:sc,lineHeight:1}}>{score.total}</div>
              <div style={{fontSize:8,color:'var(--text-3)',fontWeight:700}}>/100</div>
            </div>
          </div>
          <div style={{fontSize:9,color:'var(--text-3)',fontWeight:700,marginTop:2,textTransform:'uppercase',letterSpacing:'0.05em'}}>AI Score</div>
        </div>
        <button onClick={()=>setExpanded(e=>!e)} style={{padding:6,borderRadius:8,background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text-3)',cursor:'pointer',flexShrink:0}}>
          {expanded?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
        </button>
      </div>
      <div style={{padding:'0 18px 12px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
        {[{l:'Skills',v:score.skillMatch,m:40,c:'#7c3aed'},{l:'Exp.',v:score.experience,m:20,c:'#3b82f6'},{l:'Edu.',v:score.education,m:20,c:'#10b981'},{l:'Motiv.',v:score.motivation,m:20,c:'#f59e0b'}].map(b=>(
          <div key={b.l}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:'var(--text-3)',fontWeight:700,textTransform:'uppercase'}}>{b.l}</span>
              <span style={{fontSize:9,fontWeight:800,color:b.c}}>{b.v}/{b.m}</span>
            </div>
            <div style={{height:5,borderRadius:999,background:'var(--border)',overflow:'hidden'}}>
              <motion.div initial={{width:0}} animate={{width:`${(b.v/b.m)*100}%`}} transition={{duration:0.7,ease:'easeOut'}}
                style={{height:'100%',borderRadius:999,background:b.c}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'0 18px 14px',display:'flex',gap:8,flexWrap:'wrap'}}>
        <button onClick={()=>onShortlist(app.id)} disabled={isShortlisted||isProcessing}
          style={{padding:'8px 16px',borderRadius:10,border:`2px solid ${isShortlisted?'#10b981':'#7c3aed'}`,background:isShortlisted?'#10b981':'rgba(124,58,237,0.1)',color:isShortlisted?'#fff':'#7c3aed',fontWeight:800,fontSize:12.5,cursor:isShortlisted?'default':'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.18s'}}>
          {isShortlisted?<><CheckCircle size={13}/>Shortlisted</>:<><Star size={13}/>Shortlist</>}
        </button>
        <button onClick={()=>onInterview(app.id)} disabled={app.status==='interview'||isProcessing}
          style={{padding:'8px 16px',borderRadius:10,border:'2px solid #06b6d4',background:app.status==='interview'?'#06b6d4':'rgba(6,182,212,0.1)',color:app.status==='interview'?'#fff':'#06b6d4',fontWeight:700,fontSize:12.5,cursor:'pointer',transition:'all 0.18s'}}>
          📞 Interview
        </button>
        <button onClick={()=>onReject(app.id)} disabled={isRejected||isProcessing}
          style={{padding:'8px 14px',borderRadius:10,border:'1.5px solid #ef4444',background:isRejected?'#ef4444':'rgba(239,68,68,0.08)',color:isRejected?'#fff':'#ef4444',fontWeight:700,fontSize:12,cursor:isRejected?'default':'pointer',transition:'all 0.18s'}}>
          ❌ Reject
        </button>
        {app.resumeLink&&<a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
          style={{padding:'8px 14px',borderRadius:10,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text-2)',fontWeight:600,fontSize:12,textDecoration:'none',display:'flex',alignItems:'center',gap:5}}>🔗 Resume</a>}
      </div>
      <AnimatePresence>
        {expanded&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden',borderTop:'1px solid var(--border)'}}>
          <div style={{padding:'16px 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8,display:'flex',alignItems:'center',gap:5}}><Brain size={11}/>AI Breakdown</div>
              {score.breakdown.map((b,i)=><div key={i} style={{fontSize:12,color:'var(--text-2)',padding:'4px 0',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:5}}><span style={{color:'#7c3aed',fontSize:10}}>▸</span>{b}</div>)}
            </div>
            <div>
              {score.strengths.length>0&&<div style={{marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:800,color:'#10b981',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:5}}>✅ Strengths</div>
                {score.strengths.map((s,i)=><div key={i} style={{fontSize:12,color:'var(--text-2)',padding:'3px 0'}}><span style={{color:'#10b981'}}>+</span> {s}</div>)}
              </div>}
              {score.gaps.length>0&&<div>
                <div style={{fontSize:11,fontWeight:800,color:'#f59e0b',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:5}}>⚠️ Gaps</div>
                {score.gaps.map((g,i)=><div key={i} style={{fontSize:12,color:'var(--text-2)',padding:'3px 0'}}><span style={{color:'#f59e0b'}}>−</span> {g}</div>)}
              </div>}
            </div>
            {app.coverLetter&&<div style={{gridColumn:'1/-1',padding:'10px 13px',borderRadius:10,background:'var(--bg)',border:'1px solid var(--border)'}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--text-3)',textTransform:'uppercase',marginBottom:5}}>Cover Letter</div>
              <p style={{fontSize:12.5,color:'var(--text-2)',lineHeight:1.6,margin:0,maxHeight:80,overflow:'hidden'}}>{app.coverLetter}</p>
            </div>}
          </div>
        </motion.div>)}
      </AnimatePresence>
    </motion.div>
  );
}

interface AIShortlisterProps { companyId:string; accentColor?:string; onSwitchTab?:()=>void; }

export default function AIResumeShortlister({ companyId, onSwitchTab }:AIShortlisterProps) {
  const [selectedJob,setSelectedJob]=useState('all');
  const [minScore,setMinScore]=useState(0);
  const [running,setRunning]=useState(false);
  const [analysed,setAnalysed]=useState(false);
  const [tick,setTick]=useState(0);
  const [filterRec,setFilterRec]=useState('all');
  const [isProcessing,setIsProcessing]=useState(false);
  const [bulkDone,setBulkDone]=useState<string|null>(null);
  const reload=()=>setTick(t=>t+1);

  const myJobs=useMemo(()=>[
    ...portalGetByAuthor('job',companyId),
    ...portalGetByAuthor('internship',companyId),
    ...portalGetByAuthor('project',companyId),
  ],[companyId,tick]);

  const allApps=useMemo(()=>portalAppGetByAuthor(companyId),[companyId,tick]);

  const scoredApps=useMemo(()=>{
    if(!analysed) return [];
    return allApps.filter(a=>['job','internship','project'].includes(a.type)).map(app=>{
      const jobItem=myJobs.find((j:any)=>j.id===app.itemId)??null;
      return {app,score:computeAIScore(app,jobItem),jobItem};
    }).sort((a,b)=>b.score.total-a.score.total);
  },[allApps,myJobs,analysed,tick]);

  const filtered=useMemo(()=>{
    let list=scoredApps.filter(s=>s.score.total>=minScore);
    if(selectedJob!=='all') list=list.filter(s=>String(s.app.itemId)===selectedJob);
    if(filterRec!=='all')   list=list.filter(s=>s.score.recommendation===filterRec);
    return list;
  },[scoredApps,minScore,selectedJob,filterRec]);

  const stats=useMemo(()=>({
    total:scoredApps.length,
    strong:scoredApps.filter(s=>s.score.recommendation==='strong').length,
    good:scoredApps.filter(s=>s.score.recommendation==='good').length,
    average:scoredApps.filter(s=>s.score.recommendation==='average').length,
    weak:scoredApps.filter(s=>s.score.recommendation==='weak').length,
    avgScore:scoredApps.length?Math.round(scoredApps.reduce((a,s)=>a+s.score.total,0)/scoredApps.length):0,
  }),[scoredApps]);

  const runAnalysis=async()=>{setRunning(true);setAnalysed(false);await new Promise(r=>setTimeout(r,1800));setAnalysed(true);setRunning(false);};

  const bulkShortlist=async(threshold:number)=>{
    setIsProcessing(true); let count=0;
    for(const {app,score} of scoredApps){
      if(score.total>=threshold&&app.status==='pending'){portalAppUpdateStatus(app.id,'shortlisted');count++;await new Promise(r=>setTimeout(r,50));}
    }
    reload(); setBulkDone(`✅ ${count} candidate${count!==1?'s':''} shortlisted`);
    setTimeout(()=>setBulkDone(null),4000); setIsProcessing(false);
  };

  const handleShortlist=(id:number)=>{portalAppUpdateStatus(id,'shortlisted');reload();};
  const handleInterview=(id:number)=>{portalAppUpdateStatus(id,'interview');reload();};
  const handleReject=(id:number)=>{portalAppUpdateStatus(id,'rejected');reload();};

  const exportCSV=()=>{
    const header='Rank,Name,Email,College,Branch,Role,AI Score,Recommendation,Status';
    const rows=filtered.map((s,i)=>[i+1,s.app.studentName,s.app.studentEmail,s.app.studentCollege,s.app.studentBranch,s.app.itemTitle,s.score.total,s.score.recommendation,s.app.status].map(v=>`"${(String(v||'')).replace(/"/g,'""')}"`).join(','));
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([[header,...rows].join('\n')],{type:'text/csv'}));
    a.download=`ai_shortlist_${Date.now()}.csv`; a.click();
  };

  if(!analysed&&!running) return (
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:44,height:44,borderRadius:13,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(124,58,237,0.35)'}}>
            <Brain size={22} color="#fff"/>
          </div>
          <div>
            <h2 style={{fontWeight:800,fontSize:20,color:'var(--text)',margin:0}}>AI Resume Shortlister</h2>
            <p style={{fontSize:12,color:'var(--text-3)',margin:0}}>Smart candidate scoring & ranking engine</p>
          </div>
        </div>
        {onSwitchTab&&<button onClick={onSwitchTab} style={{padding:'8px 16px',borderRadius:10,background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text-2)',fontSize:12.5,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>View All Applications <ArrowRight size={12}/></button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:12,marginBottom:24}}>
        {[
          {icon:<Target size={20} color="#7c3aed"/>,title:'Skill Matching',desc:'Matches keywords against job requirements',color:'#7c3aed'},
          {icon:<TrendingUp size={20} color="#3b82f6"/>,title:'Experience Analysis',desc:'Detects depth from cover letter signals',color:'#3b82f6'},
          {icon:<Award size={20} color="#10b981"/>,title:'Education Fit',desc:'Scores branch & year relevance',color:'#10b981'},
          {icon:<Sparkles size={20} color="#f59e0b"/>,title:'Motivation Score',desc:'Evaluates enthusiasm & goal orientation',color:'#f59e0b'},
        ].map(f=>(
          <div key={f.title} style={{padding:16,borderRadius:14,background:'var(--surface)',border:`1px solid ${f.color}20`}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${f.color}12`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}>{f.icon}</div>
            <div style={{fontWeight:700,fontSize:13.5,color:'var(--text)',marginBottom:4}}>{f.title}</div>
            <div style={{fontSize:12,color:'var(--text-3)',lineHeight:1.5}}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'18px 22px',borderRadius:14,background:'var(--surface)',border:'1px solid var(--border)',marginBottom:24,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Users size={20} color="#7c3aed"/>
          <div>
            <div style={{fontSize:26,fontWeight:900,color:'#7c3aed'}}>{allApps.filter(a=>['job','internship','project'].includes(a.type)).length}</div>
            <div style={{fontSize:11,color:'var(--text-3)',fontWeight:700,textTransform:'uppercase'}}>Applications Ready</div>
          </div>
        </div>
        <div style={{width:1,height:40,background:'var(--border)'}}/>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <BarChart2 size={20} color="#3b82f6"/>
          <div>
            <div style={{fontSize:26,fontWeight:900,color:'#3b82f6'}}>{myJobs.length}</div>
            <div style={{fontSize:11,color:'var(--text-3)',fontWeight:700,textTransform:'uppercase'}}>Active Listings</div>
          </div>
        </div>
        <div style={{marginLeft:'auto'}}>
          <button onClick={runAnalysis} style={{padding:'13px 28px',borderRadius:13,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',color:'#fff',fontWeight:800,fontSize:14.5,cursor:'pointer',display:'flex',alignItems:'center',gap:10,boxShadow:'0 4px 20px rgba(124,58,237,0.35)',transition:'transform 0.15s'}}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform=''}>
            <Brain size={18}/>Run AI Analysis
          </button>
        </div>
      </div>
      {allApps.length===0&&<div style={{textAlign:'center',padding:'40px 24px',borderRadius:14,background:'var(--surface)',border:'1px dashed var(--border)'}}>
        <div style={{fontSize:48,marginBottom:12}}>📭</div>
        <div style={{fontWeight:700,fontSize:16,color:'var(--text)',marginBottom:6}}>No applications yet</div>
        <div style={{fontSize:13,color:'var(--text-3)'}}>Post job openings so students can apply</div>
      </div>}
    </div>
  );

  if(running) return (
    <div style={{textAlign:'center',padding:'60px 24px'}}>
      <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:2,ease:'linear'}}
        style={{width:64,height:64,borderRadius:'50%',border:'4px solid #7c3aed',borderTopColor:'transparent',margin:'0 auto 24px'}}/>
      <h3 style={{fontWeight:800,fontSize:20,color:'var(--text)',marginBottom:16}}>AI is analysing candidates…</h3>
      <div style={{maxWidth:300,margin:'0 auto'}}>
        {['Parsing applications…','Extracting skill keywords…','Matching requirements…','Scoring experience…','Evaluating education…','Computing motivation…','Ranking candidates…','Generating report…'].map((s,i)=>(
          <motion.div key={s} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.22}}
            style={{fontSize:12.5,color:'var(--text-3)',padding:'5px 0',display:'flex',alignItems:'center',gap:8}}>
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:i*0.22+0.1}}
              style={{width:6,height:6,borderRadius:'50%',background:'#7c3aed',flexShrink:0}}/>
            {s}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center'}}><Brain size={18} color="#fff"/></div>
          <div>
            <h2 style={{fontWeight:800,fontSize:18,color:'var(--text)',margin:0}}>AI Shortlist Results</h2>
            <p style={{fontSize:11.5,color:'var(--text-3)',margin:0}}>{stats.total} candidates ranked · avg score {stats.avgScore}/100</p>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>{setAnalysed(false);setTick(0);}} style={{padding:'8px 12px',borderRadius:9,background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text-3)',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:12.5,fontWeight:600}}><RefreshCw size={13}/>Re-run</button>
          <button onClick={exportCSV} style={{padding:'8px 14px',borderRadius:9,background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.3)',color:'#7c3aed',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:12.5,fontWeight:700}}><Download size={13}/>Export CSV</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:8,marginBottom:18}}>
        {[{l:'Total',v:stats.total,c:'#7c3aed'},{l:'Strong 🏆',v:stats.strong,c:'#10b981'},{l:'Good ⭐',v:stats.good,c:'#3b82f6'},{l:'Average',v:stats.average,c:'#f59e0b'},{l:'Weak',v:stats.weak,c:'#ef4444'},{l:'Avg Score',v:stats.avgScore,c:'#06b6d4'}].map(s=>(
          <div key={s.l} style={{padding:'12px',borderRadius:12,background:'var(--surface)',border:`1px solid ${s.c}20`,textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,fontWeight:700,color:'var(--text-3)',marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      {stats.strong>0&&<div style={{padding:'14px 18px',borderRadius:13,background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.2)',marginBottom:18,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <Zap size={16} color="#10b981"/>
        <span style={{fontSize:13.5,fontWeight:600,color:'var(--text-2)',flex:1}}><strong style={{color:'#10b981'}}>{stats.strong} strong candidates</strong> found · auto-shortlist all above a threshold</span>
        <div style={{display:'flex',gap:8}}>
          {[75,60,50].map(t=><button key={t} onClick={()=>bulkShortlist(t)} disabled={isProcessing}
            style={{padding:'7px 14px',borderRadius:9,background:t===75?'#10b981':t===60?'#3b82f6':'#f59e0b',border:'none',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer',opacity:isProcessing?0.6:1}}>
            ≥{t}
          </button>)}
        </div>
      </div>}
      <AnimatePresence>
        {bulkDone&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          style={{padding:'12px 16px',borderRadius:11,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981',fontWeight:700,fontSize:13,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <CheckCircle size={15}/>{bulkDone}
        </motion.div>}
      </AnimatePresence>
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <Filter size={13} style={{color:'var(--text-3)'}}/>
        <select className="inp" value={selectedJob} onChange={e=>setSelectedJob(e.target.value)} style={{fontSize:12.5,width:'auto'}}>
          <option value="all">All Listings</option>
          {myJobs.map((j:any)=><option key={j.id} value={String(j.id)}>{j.title}</option>)}
        </select>
        <select className="inp" value={filterRec} onChange={e=>setFilterRec(e.target.value)} style={{fontSize:12.5,width:'auto'}}>
          <option value="all">All</option>
          <option value="strong">🏆 Strong</option>
          <option value="good">⭐ Good</option>
          <option value="average">📊 Average</option>
          <option value="weak">⚠️ Weak</option>
        </select>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:12,color:'var(--text-3)',fontWeight:600,whiteSpace:'nowrap'}}>Min: {minScore}</span>
          <input type="range" min={0} max={80} step={5} value={minScore} onChange={e=>setMinScore(+e.target.value)} style={{width:90,accentColor:'#7c3aed'}}/>
        </div>
        <span style={{fontSize:12,color:'var(--text-3)',marginLeft:'auto'}}>{filtered.length} shown</span>
      </div>
      {filtered.length===0?<div style={{textAlign:'center',padding:40,borderRadius:14,background:'var(--surface)',border:'1px dashed var(--border)',color:'var(--text-3)',fontSize:14}}>No candidates match filters</div>:(
        <AnimatePresence>
          {filtered.map(({app,score,jobItem},i)=>(
            <CandidateCard key={app.id} app={app} score={score} rank={i} onShortlist={handleShortlist} onReject={handleReject} onInterview={handleInterview} isProcessing={isProcessing}/>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
