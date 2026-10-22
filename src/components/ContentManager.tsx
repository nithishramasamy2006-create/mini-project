import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, ToggleLeft, ToggleRight, Search, X, Save, ChevronDown } from 'lucide-react';
import type { ContentType, FieldDef } from '../portalData';
import {
  FORM_FIELDS, TYPE_META, blankForm,
  portalGetAll, portalGetByAuthor, portalCreate, portalUpdate,
  portalDelete, portalToggleStatus,
} from '../portalData';
import { portalAppCountByItem } from '../portalApplications';

// ── Props ─────────────────────────────────────────────────────────
interface ContentManagerProps {
  type: ContentType;
  author?: string;          // if set, only shows items by this author
  authorLabel?: string;     // display label for author column
  allowedFields?: string[]; // restrict visible/editable fields
  accentColor?: string;
  readOnly?: boolean;
  onDataChange?: () => void; // called after create/edit/delete/toggle
}

// ── Reusable form renderer ────────────────────────────────────────
function FormFields({
  fields, form, setForm,
}: { fields: FieldDef[]; form: Record<string, any>; setForm: (f: Record<string, any>) => void }) {
  const update = (key: string, val: any) => setForm({ ...form, [key]: val });

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
      {fields.map(f => {
        const style: React.CSSProperties = { gridColumn: f.span ? '1/-1' : undefined };
        return (
          <div key={f.key} style={style}>
            <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>
              {f.label}{f.required && <span style={{ color:'#ef4444' }}> *</span>}
            </label>

            {f.type === 'textarea' && (
              <textarea
                className="inp" rows={3}
                value={form[f.key] || ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ fontSize:13, resize:'vertical' }}
              />
            )}

            {f.type === 'select' && (
              <select
                className="inp"
                value={form[f.key] || f.options?.[0] || ''}
                onChange={e => update(f.key, e.target.value)}
                style={{ fontSize:13 }}>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}

            {f.type === 'checkbox' && (
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'8px 0', fontSize:13, color:'var(--text-2)' }}>
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={e => update(f.key, e.target.checked)}
                  style={{ width:16, height:16, accentColor:'var(--accent)' }}
                />
                {f.placeholder || f.label}
              </label>
            )}

            {(!f.type || f.type === 'text' || f.type === 'number' || f.type === 'date') && (
              <input
                className="inp"
                type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                value={form[f.key] || ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ fontSize:13 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Side Panel ─────────────────────────────────────────────────────
function SidePanel({
  open, onClose, title, children, accentColor,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; accentColor: string }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:900 }}
          />
          {/* Panel */}
          <motion.div
            initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
            transition={{ type:'spring', stiffness:320, damping:30 }}
            style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(560px,100vw)', background:'var(--surface)', borderLeft:'1px solid var(--border)', zIndex:901, display:'flex', flexDirection:'column', overflowY:'auto' }}>
            {/* Panel header */}
            <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'var(--surface)', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:6, height:24, borderRadius:3, background:accentColor }}/>
                <span style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>{title}</span>
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:4 }}>
                <X size={18}/>
              </button>
            </div>
            <div style={{ padding:'22px', flex:1 }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Status badge ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:isActive?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.1)', color:isActive?'#10b981':'#ef4444' }}>
      {isActive ? '● Active' : '◌ Paused'}
    </span>
  );
}

// ── Main ContentManager ────────────────────────────────────────────
export default function ContentManager({
  type, author, allowedFields, accentColor, readOnly = false, onDataChange,
}: ContentManagerProps) {
  const meta    = TYPE_META[type];
  const color   = accentColor || meta.color;
  const allFields = FORM_FIELDS[type];
  const fields  = allowedFields ? allFields.filter(f => allowedFields.includes(f.key)) : allFields;

  const [items,      setItems]     = useState<any[]>(() => author ? portalGetByAuthor(type, author) : portalGetAll(type));
  const [panelOpen,  setPanelOpen] = useState(false);
  const [editItem,   setEditItem]  = useState<any | null>(null);
  const [form,       setForm]      = useState<Record<string, any>>(blankForm(type));
  const [q,          setQ]         = useState('');
  const [msg,        setMsg]       = useState('');
  const [saving,     setSaving]    = useState(false);
  const [expandedId, setExpandedId]= useState<number | null>(null);

  const reload = useCallback(() => {
    setItems(author ? portalGetByAuthor(type, author) : portalGetAll(type));
  }, [type, author]);

  const openCreate = () => {
    setEditItem(null);
    setForm(blankForm(type));
    setMsg('');
    setPanelOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ ...blankForm(type), ...item });
    setMsg('');
    setPanelOpen(true);
  };

  const handleSave = async () => {
    const required = fields.filter(f => f.required);
    const missing  = required.find(f => !form[f.key]);
    if (missing) { setMsg(`${missing.label} is required.`); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    if (editItem) {
      portalUpdate(type, editItem.id, form);
      setMsg('✅ Updated successfully!');
    } else {
      portalCreate(type, form, author || 'admin');
      setMsg('✅ Created successfully!');
    }

    reload();
    onDataChange?.();
    setSaving(false);
    setTimeout(() => { setMsg(''); setPanelOpen(false); }, 1200);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    portalDelete(type, id);
    reload();
    onDataChange?.();
  };

  const handleToggle = (id: number) => {
    portalToggleStatus(type, id);
    reload();
    onDataChange?.();
  };

  const filtered = useMemo(() => items.filter(i => {
    if (!q) return true;
    return JSON.stringify(i).toLowerCase().includes(q.toLowerCase());
  }), [items, q]);

  // Title field key (first required or first field)
  const titleKey = fields.find(f => f.required)?.key || fields[0]?.key || 'title';
  const subtitleKey = fields[1]?.key || '';

  return (
    <>
      {/* Toolbar */}
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:320 }}>
          <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
          <input className="inp" value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${meta.label.toLowerCase()}s…`} style={{ paddingLeft:34, fontSize:13 }}/>
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-3)', marginLeft:'auto' }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        {!readOnly && (
          <button onClick={openCreate}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:10, background:color, border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            <PlusCircle size={14}/> New {meta.label}
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', borderRadius:14, background:'var(--surface)', border:'1px dashed var(--border)' }}>
          <div style={{ fontSize:36, marginBottom:10 }}>{meta.icon}</div>
          <div style={{ fontWeight:700, fontSize:15, color:'var(--text-2)', marginBottom:6 }}>No {meta.label.toLowerCase()}s yet</div>
          {!readOnly && (
            <button onClick={openCreate} style={{ marginTop:10, padding:'8px 18px', borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, color, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              + Create First {meta.label}
            </button>
          )}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
              {/* Row */}
              <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${color}14`, border:`1px solid ${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                  {meta.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item[titleKey] || '(Untitled)'}
                  </div>
                  <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:1 }}>
                    {item[subtitleKey] && <span style={{ marginRight:8 }}>{item[subtitleKey]}</span>}
                    <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
                    {item._author && item._author !== 'admin' && <span style={{ marginLeft:8, color:'var(--accent)' }}>by {item._author}</span>}
                  </div>
                </div>

                <StatusBadge status={item.status || 'active'} />

                {/* App count badge */}
                {(() => { const cnt = portalAppCountByItem(item.id); return cnt > 0 ? (
                  <span style={{ fontSize:10.5, fontWeight:800, padding:'3px 9px', borderRadius:999, background:'rgba(124,58,237,0.12)', color:'var(--accent)', flexShrink:0 }}>
                    {cnt} applied
                  </span>
                ) : null; })()}

                {/* Actions */}
                <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    style={{ padding:'6px 8px', borderRadius:7, background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--text-3)', cursor:'pointer' }}>
                    <ChevronDown size={13} style={{ transform:expandedId===item.id?'rotate(180deg)':'none', transition:'0.2s' }}/>
                  </button>
                  {!readOnly && (<>
                    <button onClick={() => handleToggle(item.id)} title={item.status==='active'?'Pause':'Activate'}
                      style={{ padding:'6px 8px', borderRadius:7, background:'var(--bg-2)', border:'1px solid var(--border)', color:item.status==='active'?'#f59e0b':'#10b981', cursor:'pointer' }}>
                      {item.status==='active' ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>}
                    </button>
                    <button onClick={() => openEdit(item)}
                      style={{ padding:'6px 8px', borderRadius:7, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#3b82f6', cursor:'pointer' }}>
                      <Edit3 size={13}/>
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      style={{ padding:'6px 8px', borderRadius:7, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer' }}>
                      <Trash2 size={13}/>
                    </button>
                  </>)}
                </div>
              </div>

              {/* Expanded detail row */}
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                    style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
                    <div style={{ padding:'12px 16px 14px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:8 }}>
                      {fields.filter(f => f.type !== 'textarea' && f.type !== 'checkbox').map(f => item[f.key] ? (
                        <div key={f.key} style={{ padding:'7px 10px', borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)' }}>
                          <div style={{ fontSize:9.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{f.label}</div>
                          <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)' }}>{item[f.key]}</div>
                        </div>
                      ) : null)}
                      {fields.filter(f => f.type === 'textarea').map(f => item[f.key] ? (
                        <div key={f.key} style={{ gridColumn:'1/-1', padding:'8px 10px', borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)' }}>
                          <div style={{ fontSize:9.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{f.label}</div>
                          <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.55 }}>{item[f.key]}</div>
                        </div>
                      ) : null)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Side Panel */}
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editItem ? `Edit ${meta.label}` : `New ${meta.label}`} accentColor={color}>
        <FormFields fields={fields} form={form} setForm={setForm}/>

        {msg && (
          <div style={{ marginTop:14, padding:'10px 14px', borderRadius:9, background:msg.startsWith('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#10b981':'#ef4444', fontSize:13, fontWeight:600 }}>
            {msg}
          </div>
        )}

        <div style={{ display:'flex', gap:9, marginTop:20 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ flex:1, padding:'11px', borderRadius:10, background:color, border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
            <Save size={14}/> {saving ? 'Saving…' : editItem ? 'Update' : 'Create'}
          </button>
          <button onClick={() => setPanelOpen(false)}
            style={{ padding:'11px 16px', borderRadius:10, background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--text-2)', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            Cancel
          </button>
        </div>
      </SidePanel>
    </>
  );
}
