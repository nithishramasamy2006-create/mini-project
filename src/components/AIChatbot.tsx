import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Globe, ChevronDown, Minimize2 } from 'lucide-react';

// ── Language types ──────────────────────────────────────────
type Lang = 'en' | 'ta' | 'hi';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

// ── All platform knowledge base ─────────────────────────────
const KB = {
  projects: {
    en: `We have **2,400+ live projects** from 180+ companies! Categories include:\n• 🤖 AI & ML — up to ₹20,000/mo\n• 💻 Full Stack — up to ₹15,000/mo\n• ☁️ Cloud & DevOps — up to ₹25,000/mo\n• 🎨 UI/UX Design — up to ₹9,000/mo\n• ⚡ IoT & Embedded — up to ₹18,000/mo\n\nAll projects are real industry work with expert mentors. [Browse Projects →](/projects)`,
    ta: `எங்களிடம் **2,400+ நேரடி திட்டங்கள்** உள்ளன! வகைகள்:\n• 🤖 AI & ML — ₹20,000/மாதம் வரை\n• 💻 Full Stack — ₹15,000/மாதம் வரை\n• ☁️ Cloud & DevOps — ₹25,000/மாதம் வரை\n• 🎨 UI/UX வடிவமைப்பு — ₹9,000/மாதம் வரை\n\nஅனைத்து திட்டங்களும் தொழில்துறை நிபுணர்களுடன் இணைந்து செய்யப்படுகின்றன. [திட்டங்களை காண →](/projects)`,
    hi: `हमारे पास **2,400+ लाइव प्रोजेक्ट** हैं! श्रेणियाँ:\n• 🤖 AI & ML — ₹20,000/माह तक\n• 💻 Full Stack — ₹15,000/माह तक\n• ☁️ Cloud & DevOps — ₹25,000/माह तक\n• 🎨 UI/UX डिज़ाइन — ₹9,000/माह तक\n\nसभी प्रोजेक्ट वास्तविक उद्योग कार्य हैं। [प्रोजेक्ट देखें →](/projects)`,
  },
  courses: {
    en: `We offer **6+ free NM-certified courses**:\n• ⚛️ React Developer Bootcamp — 32 hrs, 4.9★\n• 🤖 Python for AI & ML — 48 hrs, 4.8★\n• 📊 Data Analytics with Power BI — 28 hrs, 4.7★\n• 🌐 Full Stack MERN — 60 hrs, 4.9★\n• ☁️ DevOps & AWS — 40 hrs, 4.8★\n• 🎨 UI/UX with Figma — 36 hrs, 4.9★\n\nAll courses are **completely FREE** and govt-certified! [Browse Courses →](/courses)`,
    ta: `நாங்கள் **6+ இலவச NM சான்றிதழ் பாடநெறிகள்** வழங்குகிறோம்:\n• ⚛️ React Developer Bootcamp — 32 மணி, 4.9★\n• 🤖 Python for AI & ML — 48 மணி, 4.8★\n• 📊 Data Analytics — 28 மணி, 4.7★\n• 🌐 Full Stack MERN — 60 மணி, 4.9★\n\nஅனைத்து பாடநெறிகளும் **முற்றிலும் இலவசம்** மற்றும் அரசு சான்றளிக்கப்பட்டவை! [பாடநெறிகளை காண →](/courses)`,
    hi: `हम **6+ मुफ़्त NM प्रमाणित कोर्स** प्रदान करते हैं:\n• ⚛️ React Developer Bootcamp — 32 घंटे, 4.9★\n• 🤖 Python for AI & ML — 48 घंटे, 4.8★\n• 📊 Data Analytics — 28 घंटे, 4.7★\n• 🌐 Full Stack MERN — 60 घंटे, 4.9★\n\nसभी कोर्स **बिल्कुल मुफ़्त** और सरकार प्रमाणित हैं! [कोर्स देखें →](/courses)`,
  },
  stipend: {
    en: `💰 **Stipends on NaanMudhalvan:**\n• Minimum: ₹5,000/month\n• Average: ₹12,000–₹18,000/month\n• Maximum: ₹25,000/month (Cloud/DevOps roles)\n\nStipends are paid **directly to your bank account** at each milestone. 94% of students receive their payment on time!`,
    ta: `💰 **NaanMudhalvan-ல் ஊக்கத்தொகை:**\n• குறைந்தபட்சம்: ₹5,000/மாதம்\n• சராசரி: ₹12,000–₹18,000/மாதம்\n• அதிகபட்சம்: ₹25,000/மாதம்\n\nஊக்கத்தொகை **நேரடியாக உங்கள் வங்கி கணக்கில்** செலுத்தப்படும். 94% மாணவர்கள் சரியான நேரத்தில் பணம் பெறுகின்றனர்!`,
    hi: `💰 **NaanMudhalvan पर स्टाइपेंड:**\n• न्यूनतम: ₹5,000/माह\n• औसत: ₹12,000–₹18,000/माह\n• अधिकतम: ₹25,000/माह\n\nस्टाइपेंड **सीधे आपके बैंक खाते** में भेजा जाता है। 94% छात्रों को समय पर भुगतान मिलता है!`,
  },
  internships: {
    en: `🏢 **Internship Opportunities:**\n• Zoho — Full Stack Intern, ₹15,000/mo, 3 months\n• TCS Innovation Labs — AI/ML Research, ₹18,000/mo, 6 months\n• Freshworks — Cloud Infrastructure, ₹12,000/mo, 4 months\n• Razorpay — Fintech Product, ₹22,000/mo, 6 months\n• ISRO — IoT Systems, ₹10,000/mo, 3 months\n\n[View All Internships →](/internships)`,
    ta: `🏢 **இன்டர்ன்ஷிப் வாய்ப்புகள்:**\n• Zoho — Full Stack Intern, ₹15,000/மாதம், 3 மாதங்கள்\n• TCS — AI/ML Research, ₹18,000/மாதம், 6 மாதங்கள்\n• Freshworks — Cloud, ₹12,000/மாதம், 4 மாதங்கள்\n• Razorpay — Fintech, ₹22,000/மாதம், 6 மாதங்கள்\n\n[அனைத்து இன்டர்ன்ஷிப்களை காண →](/internships)`,
    hi: `🏢 **इंटर्नशिप के अवसर:**\n• Zoho — Full Stack Intern, ₹15,000/माह, 3 माह\n• TCS — AI/ML Research, ₹18,000/माह, 6 माह\n• Freshworks — Cloud, ₹12,000/माह, 4 माह\n• Razorpay — Fintech, ₹22,000/माह, 6 माह\n\n[सभी इंटर्नशिप देखें →](/internships)`,
  },
  mentors: {
    en: `👨‍💼 **500+ Expert Mentors available:**\n• Dr. Ramesh Kumar — AI/ML, TCS (4.9★, 84 mentees)\n• Priya Venkatesh — Full Stack, Zoho (4.8★, 67 mentees)\n• Arjun Ramachandran — Cloud/AWS, Freshworks (4.9★)\n• Kavitha Sundaram — Blockchain, Infosys (4.7★)\n• Divya Rajan — UI/UX, OLA (4.9★, 73 mentees)\n• Vikram Nair — AI/ML, Razorpay (5.0★)\n\n[Find Your Mentor →](/mentors)`,
    ta: `👨‍💼 **500+ நிபுணர் வழிகாட்டிகள்:**\n• Dr. Ramesh Kumar — AI/ML, TCS (4.9★)\n• Priya Venkatesh — Full Stack, Zoho (4.8★)\n• Arjun Ramachandran — Cloud/AWS, Freshworks (4.9★)\n• Divya Rajan — UI/UX, OLA (4.9★)\n\n[உங்கள் வழிகாட்டியை கண்டுபிடி →](/mentors)`,
    hi: `👨‍💼 **500+ विशेषज्ञ मेंटर उपलब्ध:**\n• Dr. Ramesh Kumar — AI/ML, TCS (4.9★)\n• Priya Venkatesh — Full Stack, Zoho (4.8★)\n• Arjun Ramachandran — Cloud/AWS, Freshworks (4.9★)\n• Divya Rajan — UI/UX, OLA (4.9★)\n\n[अपना मेंटर खोजें →](/mentors)`,
  },
  leaderboard: {
    en: `🏆 **Current Leaderboard Top 5:**\n1. 🥇 Aravind K. — Anna University — 9,820 XP\n2. 🥈 Priya M. — NIT Trichy — 9,450 XP\n3. 🥉 Rajesh S. — SRM University — 9,120 XP\n4. Soundarya V. — Amrita College — 8,890 XP\n5. Karthik D. — VIT Chennai — 8,640 XP\n\n**How to earn XP:** Complete project (+500), Finish course (+200), 5-star review (+50), Daily streak (+10/day)\n[View Full Leaderboard →](/leaderboard)`,
    ta: `🏆 **தற்போதைய தரவரிசை முதல் 5:**\n1. 🥇 Aravind K. — Anna University — 9,820 XP\n2. 🥈 Priya M. — NIT Trichy — 9,450 XP\n3. 🥉 Rajesh S. — SRM University — 9,120 XP\n\n**XP சம்பாதிக்க:** திட்டம் முடி (+500), பாடம் முடி (+200), தினசரி தொடர் (+10/நாள்)\n[முழு தரவரிசை காண →](/leaderboard)`,
    hi: `🏆 **वर्तमान लीडरबोर्ड टॉप 5:**\n1. 🥇 Aravind K. — Anna University — 9,820 XP\n2. 🥈 Priya M. — NIT Trichy — 9,450 XP\n3. 🥉 Rajesh S. — SRM University — 9,120 XP\n\n**XP कैसे कमाएं:** प्रोजेक्ट पूरा करें (+500), कोर्स (+200), दैनिक स्ट्रीक (+10/दिन)\n[पूरा लीडरबोर्ड देखें →](/leaderboard)`,
  },
  certificate: {
    en: `🏅 **NaanMudhalvan Certificates:**\n• Issued by the **Government of Tamil Nadu**\n• Blockchain-verified & tamper-proof\n• Recognized by 180+ companies\n• College-credit eligible (up to 4 credits)\n• Issued within **3 business days** of project completion\n• Direct LinkedIn sync available\n\n[View Certificates →](/certificates)`,
    ta: `🏅 **NaanMudhalvan சான்றிதழ்கள்:**\n• **தமிழ்நாடு அரசால்** வழங்கப்படுகின்றன\n• Blockchain சரிபார்க்கப்பட்டவை\n• 180+ நிறுவனங்களால் அங்கீகரிக்கப்பட்டவை\n• கல்லூரி கிரெடிட் தகுதி (4 கிரெடிட் வரை)\n• திட்டம் முடிந்த **3 நாட்களில்** வழங்கப்படும்\n\n[சான்றிதழ்களை காண →](/certificates)`,
    hi: `🏅 **NaanMudhalvan प्रमाणपत्र:**\n• **तमिलनाडु सरकार** द्वारा जारी\n• Blockchain सत्यापित\n• 180+ कंपनियों द्वारा मान्यता प्राप्त\n• कॉलेज क्रेडिट योग्य (4 क्रेडिट तक)\n• प्रोजेक्ट पूरा होने के **3 दिनों में** जारी\n\n[प्रमाणपत्र देखें →](/certificates)`,
  },
  placement: {
    en: `🎯 **Placement Support:**\n• **94% placement rate** across Tamil Nadu\n• Average package: **₹8.4 LPA**\n• Highest package: ₹28 LPA (Amazon)\n• 180+ active hiring partners\n• Services: AI Resume Builder, Mock Interviews, Job Matching, Career Counselling\n• 3,000+ DSA practice problems\n\n[Placement Support →](/placement-support)`,
    ta: `🎯 **வேலைவாய்ப்பு ஆதரவு:**\n• **94% வேலைவாய்ப்பு விகிதம்**\n• சராசரி வேதன: **₹8.4 LPA**\n• AI Resume Builder, Mock Interviews உள்பட\n• 180+ நிறுவனங்கள் ஆட்சேர்ப்பு செய்கின்றன\n\n[வேலைவாய்ப்பு ஆதரவு →](/placement-support)`,
    hi: `🎯 **प्लेसमेंट सपोर्ट:**\n• **94% प्लेसमेंट दर**\n• औसत पैकेज: **₹8.4 LPA**\n• सर्वोच्च पैकेज: ₹28 LPA (Amazon)\n• AI Resume Builder, Mock Interviews शामिल\n• 180+ हायरिंग पार्टनर\n\n[प्लेसमेंट सपोर्ट →](/placement-support)`,
  },
  alumni: {
    en: `🌐 **Alumni Network:**\n• **45,000+ active alumni** across Tamil Nadu\n• 250+ companies represented\n• 38 cities across India\n• Average alumni salary: ₹12 LPA\n\nTop alumni companies: Zoho, TCS, Freshworks, Amazon, BYJU'S, OLA, Wipro\n\nBenefits: Referrals, exclusive job board, monthly meetups, career resources\n[Join Network →](/alumni-network)`,
    ta: `🌐 **பழைய மாணவர் வலைப்பின்னல்:**\n• **45,000+ செயலில் உள்ள பழைய மாணவர்கள்**\n• 250+ நிறுவனங்கள்\n• 38 நகரங்கள்\n• சராசரி சம்பளம்: ₹12 LPA\n\nபலன்கள்: பரிந்துரைகள், இலவச வேலை பலகை, மாதாந்திர சந்திப்புகள்\n[வலைப்பின்னலில் சேர →](/alumni-network)`,
    hi: `🌐 **एलुमनी नेटवर्क:**\n• **45,000+ सक्रिय एलुमनी**\n• 250+ कंपनियाँ\n• 38 शहर\n• औसत वेतन: ₹12 LPA\n\nलाभ: रेफरल, जॉब बोर्ड, मासिक मीटअप\n[नेटवर्क में शामिल हों →](/alumni-network)`,
  },
  register: {
    en: `🚀 **How to Register (Free!):**\n1. Go to [/register](/register)\n2. Enter your college email\n3. Verify your college enrollment\n4. Build your profile (skills, resume)\n5. Get AI-matched to projects!\n\n**It takes just 5 minutes.** No credit card needed. Completely free for students!`,
    ta: `🚀 **பதிவு செய்வது எப்படி (இலவசம்!):**\n1. [/register](/register) க்கு செல்லுங்கள்\n2. உங்கள் கல்லூரி மின்னஞ்சல் உள்ளிடவும்\n3. கல்லூரி சேர்க்கையை சரிபார்க்கவும்\n4. உங்கள் சுயவிவரத்தை உருவாக்கவும்\n5. AI மூலம் திட்டங்களுடன் பொருத்தப்படுவீர்கள்!\n\n**வெறும் 5 நிமிடங்கள் மட்டுமே!** மாணவர்களுக்கு முற்றிலும் இலவசம்!`,
    hi: `🚀 **रजिस्ट्रेशन कैसे करें (मुफ़्त!):**\n1. [/register](/register) पर जाएं\n2. अपनी कॉलेज ईमेल दर्ज करें\n3. कॉलेज नामांकन सत्यापित करें\n4. अपनी प्रोफ़ाइल बनाएं\n5. AI से प्रोजेक्ट मिलान पाएं!\n\n**सिर्फ 5 मिनट लगते हैं।** छात्रों के लिए बिल्कुल मुफ़्त!`,
  },
  howitworks: {
    en: `⚡ **How NaanMudhalvan Works — 4 Steps:**\n\n**Step 1:** Create Profile (5 min) — AI matches you\n**Step 2:** Pick a Project — 2,400+ options, filter by skill/stipend\n**Step 3:** Build & Learn — Weekly mentorship, code reviews\n**Step 4:** Earn & Certify — Get paid + Govt NM certificate\n\n[Learn More →](/how-it-works)`,
    ta: `⚡ **NaanMudhalvan எப்படி செயல்படுகிறது — 4 படிகள்:**\n\n**படி 1:** சுயவிவரம் உருவாக்கு (5 நிமிடம்)\n**படி 2:** திட்டம் தேர்வு செய்\n**படி 3:** கட்டி கற்று — வாராந்திர வழிகாட்டல்\n**படி 4:** சம்பாரி மற்றும் சான்றிதழ் பெறு\n\n[மேலும் அறிய →](/how-it-works)`,
    hi: `⚡ **NaanMudhalvan कैसे काम करता है — 4 चरण:**\n\n**चरण 1:** प्रोफ़ाइल बनाएं (5 मिनट)\n**चरण 2:** प्रोजेक्ट चुनें\n**चरण 3:** बनाएं और सीखें — साप्ताहिक मेंटरशिप\n**चरण 4:** कमाएं और प्रमाणपत्र पाएं\n\n[और जानें →](/how-it-works)`,
  },
  eligibility: {
    en: `✅ **Eligibility Requirements:**\n• Currently enrolled in any Tamil Nadu college/university\n• Any year — 1st year to final year\n• Any branch — CS, IT, ECE, Mechanical, MBA, etc.\n• Valid college email or institution ID required\n• No minimum percentage required\n• **Free for all students** — no fees ever!`,
    ta: `✅ **தகுதி தேவைகள்:**\n• தமிழ்நாட்டில் எந்த கல்லூரியிலும் படிக்கும் மாணவர்கள்\n• எந்த ஆண்டும் — 1 முதல் இறுதி ஆண்டு வரை\n• எந்த பிரிவும் — CS, IT, ECE, Mechanical, MBA\n• கல்லூரி மின்னஞ்சல் அல்லது ID தேவை\n• **அனைத்து மாணவர்களுக்கும் இலவசம்!**`,
    hi: `✅ **पात्रता आवश्यकताएं:**\n• तमिलनाडु के किसी भी कॉलेज में नामांकित\n• कोई भी वर्ष — पहले से अंतिम वर्ष तक\n• कोई भी शाखा — CS, IT, ECE, Mechanical, MBA\n• कॉलेज ईमेल या ID आवश्यक\n• **सभी छात्रों के लिए मुफ़्त!**`,
  },
  companies: {
    en: `🏢 **Partner Companies (180+):**\n\nTop hiring partners:\n• **Zoho** — 12 roles, avg ₹7.5 LPA\n• **TCS** — 34 roles, avg ₹4.5 LPA\n• **Infosys** — 28 roles, avg ₹5.5 LPA\n• **Freshworks** — 8 roles, avg ₹12 LPA\n• **Razorpay** — 5 roles, avg ₹18 LPA\n• **Amazon** — ₹28 LPA highest offer\n• **ISRO, OLA, BYJU'S, Wipro, HCL**`,
    ta: `🏢 **பங்குதாரர் நிறுவனங்கள் (180+):**\n\n• **Zoho** — 12 பதவிகள், சராசரி ₹7.5 LPA\n• **TCS** — 34 பதவிகள், சராசரி ₹4.5 LPA\n• **Infosys** — 28 பதவிகள், சராசரி ₹5.5 LPA\n• **Freshworks** — ₹12 LPA\n• **Razorpay** — ₹18 LPA\n• **Amazon** — ₹28 LPA அதிகபட்சம்`,
    hi: `🏢 **पार्टनर कंपनियाँ (180+):**\n\n• **Zoho** — 12 भूमिकाएं, औसत ₹7.5 LPA\n• **TCS** — 34 भूमिकाएं, औसत ₹4.5 LPA\n• **Freshworks** — ₹12 LPA\n• **Razorpay** — ₹18 LPA\n• **Amazon** — ₹28 LPA सर्वोच्च`,
  },
  greeting: {
    en: `👋 Hello! I'm **NM Assistant** — your guide to NaanMudhalvan Marketplace!\n\nI can help you with:\n• 📋 Projects & Stipends\n• 📚 Courses & Certificates\n• 👨‍💼 Mentors & Internships\n• 🏆 Leaderboard & Rankings\n• 🎯 Placement Support\n• 🌐 Alumni Network\n• 📝 How to Register\n\nWhat would you like to know?`,
    ta: `👋 வணக்கம்! நான் **NM Assistant** — NaanMudhalvan-க்கான உங்கள் வழிகாட்டி!\n\nநான் உதவக்கூடியவை:\n• 📋 திட்டங்கள் & ஊக்கத்தொகை\n• 📚 பாடநெறிகள் & சான்றிதழ்கள்\n• 👨‍💼 வழிகாட்டிகள் & இன்டர்ன்ஷிப்\n• 🏆 தரவரிசை\n• 🎯 வேலைவாய்ப்பு ஆதரவு\n\nநீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`,
    hi: `👋 नमस्ते! मैं **NM Assistant** हूं — NaanMudhalvan का आपका गाइड!\n\nमैं इनमें मदद कर सकता हूं:\n• 📋 प्रोजेक्ट और स्टाइपेंड\n• 📚 कोर्स और प्रमाणपत्र\n• 👨‍💼 मेंटर और इंटर्नशिप\n• 🏆 लीडरबोर्ड\n• 🎯 प्लेसमेंट सपोर्ट\n\nआप क्या जानना चाहते हैं?`,
  },
  default: {
    en: `I'm not sure about that specific query. Here's what I can help with:\n\n• Type **"projects"** — Browse live projects\n• Type **"courses"** — Free NM courses\n• Type **"stipend"** — Payment details\n• Type **"mentors"** — Expert mentors\n• Type **"leaderboard"** — Student rankings\n• Type **"placement"** — Career support\n• Type **"register"** — How to join\n\nOr choose a quick option below! 😊`,
    ta: `அந்த கேள்வியில் என்னால் உறுதியாக பதில் சொல்ல முடியவில்லை. நான் இதில் உதவ முடியும்:\n\n• **"projects"** என்று தட்டச்சு செய்யுங்கள்\n• **"courses"** — இலவச பாடநெறிகள்\n• **"stipend"** — கட்டண விவரங்கள்\n• **"leaderboard"** — தரவரிசை\n\nகீழே உள்ள விரைவு விருப்பங்களை தேர்வு செய்யுங்கள்! 😊`,
    hi: `मुझे उस विशिष्ट प्रश्न के बारे में निश्चित नहीं है। मैं इनमें मदद कर सकता हूं:\n\n• **"projects"** टाइप करें\n• **"courses"** — मुफ़्त कोर्स\n• **"stipend"** — भुगतान विवरण\n• **"leaderboard"** — रैंकिंग\n\nनीचे त्वरित विकल्प चुनें! 😊`,
  },
};

// ── Keyword matcher ─────────────────────────────────────────
function getResponse(input: string, lang: Lang): string {
  const q = input.toLowerCase().trim();
  if (!q) return KB.greeting[lang];
  if (/(hello|hi|hey|வணக்கம்|नमस्|start|help|helo)/i.test(q)) return KB.greeting[lang];
  if (/(project|திட்ட|प्रोजेक्ट|work|browse)/i.test(q)) return KB.projects[lang];
  if (/(course|பாட|कोर्स|learn|study|class|react|python|mern|devops|figma)/i.test(q)) return KB.courses[lang];
  if (/(stipend|salary|pay|money|amount|ஊக்க|वेतन|स्टाइपेंड|₹|cash)/i.test(q)) return KB.stipend[lang];
  if (/(intern|இன்டர்ன்|इंटर्न|training)/i.test(q)) return KB.internships[lang];
  if (/(mentor|guide|வழிகாட்|मेंटर|coach|expert)/i.test(q)) return KB.mentors[lang];
  if (/(leader|rank|score|xp|point|தரவரிசை|लीडरबोर्ड)/i.test(q)) return KB.leaderboard[lang];
  if (/(certif|சான்|प्रमाण|badge|govt|government)/i.test(q)) return KB.certificate[lang];
  if (/(placement|job|career|hire|வேலை|नौकरी|place|offer)/i.test(q)) return KB.placement[lang];
  if (/(alumni|network|former|graduate|பழைய|एलुमनी)/i.test(q)) return KB.alumni[lang];
  if (/(register|sign|join|enroll|how to|start|பதிவு|रजिस्ट्र)/i.test(q)) return KB.register[lang];
  if (/(how.*work|process|step|எப்படி|कैसे)/i.test(q)) return KB.howitworks[lang];
  if (/(eligible|qualify|who|criteria|தகுதி|पात्र|requirement)/i.test(q)) return KB.eligibility[lang];
  if (/(compan|partner|zoho|tcs|infosys|நிறுவன|कंपन|freshworks|razorpay)/i.test(q)) return KB.companies[lang];
  return KB.default[lang];
}

// ── Quick action chips ──────────────────────────────────────
const QUICK: Record<Lang, { label: string; query: string }[]> = {
  en: [
    { label: '📋 Projects', query: 'projects' },
    { label: '📚 Courses', query: 'courses' },
    { label: '💰 Stipend', query: 'stipend' },
    { label: '👨‍💼 Mentors', query: 'mentors' },
    { label: '🏆 Leaderboard', query: 'leaderboard' },
    { label: '🎯 Placement', query: 'placement' },
    { label: '🌐 Alumni', query: 'alumni network' },
    { label: '📝 Register', query: 'how to register' },
  ],
  ta: [
    { label: '📋 திட்டங்கள்', query: 'projects' },
    { label: '📚 பாடங்கள்', query: 'courses' },
    { label: '💰 ஊக்கத்தொகை', query: 'stipend' },
    { label: '👨‍💼 வழிகாட்டிகள்', query: 'mentors' },
    { label: '🏆 தரவரிசை', query: 'leaderboard' },
    { label: '🎯 வேலைவாய்ப்பு', query: 'placement' },
    { label: '🌐 பழைய மாணவர்', query: 'alumni' },
    { label: '📝 பதிவு', query: 'register' },
  ],
  hi: [
    { label: '📋 प्रोजेक्ट', query: 'projects' },
    { label: '📚 कोर्स', query: 'courses' },
    { label: '💰 स्टाइपेंड', query: 'stipend' },
    { label: '👨‍💼 मेंटर', query: 'mentors' },
    { label: '🏆 लीडरबोर्ड', query: 'leaderboard' },
    { label: '🎯 प्लेसमेंट', query: 'placement' },
    { label: '🌐 एलुमनी', query: 'alumni' },
    { label: '📝 रजिस्टर', query: 'register' },
  ],
};

const LANG_LABELS: Record<Lang, string> = { en: '🇬🇧 EN', ta: '🇮🇳 தமிழ்', hi: '🇮🇳 हिंदी' };
const PLACEHOLDERS: Record<Lang, string> = {
  en: 'Ask anything about NaanMudhalvan…',
  ta: 'NaanMudhalvan பற்றி கேளுங்கள்…',
  hi: 'NaanMudhalvan के बारे में पूछें…',
};

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-to-JSX renderer
function MsgText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[.*?\]\(.*?\)|\n)/g);
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((p, i) => {
        if (p === '\n') return <br key={i} />;
        const bold = p.match(/^\*\*(.+)\*\*$/);
        if (bold) return <strong key={i} style={{ color: '#c4b5fd' }}>{bold[1]}</strong>;
        const link = p.match(/^\[(.+?)\]\((.+?)\)$/);
        if (link) return <a key={i} href={link[2]} style={{ color: '#60a5fa', textDecoration: 'underline' }}>{link[1]}</a>;
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Init greeting
  useEffect(() => {
    setMsgs([{ id: 1, role: 'bot', text: KB.greeting[lang], time: now() }]);
  }, []);

  // Update greeting when lang changes
  const changeLang = useCallback((l: Lang) => {
    setLang(l);
    setShowLangMenu(false);
    setMsgs(prev => {
      const updated = [...prev];
      if (updated[0]?.role === 'bot') updated[0] = { ...updated[0], text: KB.greeting[l] };
      return updated;
    });
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  // Focus input on open
  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), time: now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(text, lang);
      setMsgs(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: response, time: now() }]);
      setTyping(false);
    }, 600 + Math.random() * 500);
  }, [lang]);

  return (
    <>
      {/* ── Floating toggle button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9998,
          width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
          transition: 'box-shadow 0.2s',
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={24} color="#fff" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><MessageCircle size={24} color="#fff" /></motion.div>
          }
        </AnimatePresence>
        {/* Unread badge */}
        {!open && unread > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', border: '2px solid #030712' }}>
            {unread}
          </motion.div>
        )}
        {/* Pulse ring */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #7c3aed', pointerEvents: 'none' }}
          />
        )}
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', bottom: 100, right: 28, zIndex: 9999,
              width: 380, height: 580, maxHeight: 'calc(100vh - 140px)',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(7,10,22,0.97)', backdropFilter: 'blur(24px)',
              borderRadius: 24, overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.15))',
              borderBottom: '1px solid rgba(124,58,237,0.2)', flexShrink: 0,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>NM Assistant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <span style={{ fontSize: 11, color: '#10b981' }}>Online · Answers instantly</span>
                </div>
              </div>

              {/* Language selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowLangMenu(m => !m)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', color: '#a78bfa', fontSize: 11, fontWeight: 600 }}
                >
                  <Globe size={12} /> {LANG_LABELS[lang].split(' ')[1] || LANG_LABELS[lang]} <ChevronDown size={10} />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      style={{ position: 'absolute', top: 34, right: 0, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, overflow: 'hidden', zIndex: 10, minWidth: 110 }}>
                      {(['en', 'ta', 'hi'] as Lang[]).map(l => (
                        <button key={l} onClick={() => changeLang(l)}
                          style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'left', background: lang === l ? 'rgba(124,58,237,0.15)' : 'transparent', border: 'none', cursor: 'pointer', color: lang === l ? '#a78bfa' : '#94a3b8', fontSize: 12, fontWeight: lang === l ? 700 : 400 }}>
                          {LANG_LABELS[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 4, borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                <Minimize2 size={16} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12, scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.2) transparent' }}>
              {msgs.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                  style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                  {/* Avatar */}
                  <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'bot' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#10b981,#0891b2)' }}>
                    {msg.role === 'bot' ? <Bot size={13} color="#fff" /> : <User size={13} color="#fff" />}
                  </div>
                  <div style={{ maxWidth: '80%' }}>
                    <div style={{
                      padding: '10px 13px', borderRadius: msg.role === 'bot' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: msg.role === 'bot' ? 'rgba(124,58,237,0.1)' : 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.2))',
                      border: `1px solid ${msg.role === 'bot' ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.3)'}`,
                      fontSize: 13, color: '#e2e8f0', lineHeight: 1.65,
                    }}>
                      <MsgText text={msg.text} />
                    </div>
                    <div style={{ fontSize: 9.5, color: '#334155', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: msg.role === 'bot' ? 4 : 0, paddingRight: msg.role === 'user' ? 4 : 0 }}>{msg.time}</div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={13} color="#fff" /></div>
                  <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick chips ── */}
            <div style={{ padding: '8px 14px 6px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
              {QUICK[lang].map(q => (
                <button key={q.query} onClick={() => sendMessage(q.query)}
                  style={{ fontSize: 11, padding: '5px 10px', borderRadius: 999, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)', color: '#a78bfa', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)'; }}>
                  {q.label}
                </button>
              ))}
            </div>

            {/* ── Input ── */}
            <div style={{ padding: '10px 14px 14px', flexShrink: 0 }}>
              <form onSubmit={e => { e.preventDefault(); sendMessage(input); }}
                style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(124,58,237,0.2)', padding: '6px 6px 6px 14px', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)')}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={PLACEHOLDERS[lang]}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#e2e8f0', '::placeholder': { color: '#475569' } } as any}
                />
                <button type="submit" disabled={!input.trim() || typing}
                  style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', background: input.trim() && !typing ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                  <Send size={14} color={input.trim() && !typing ? '#fff' : '#4a5568'} />
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 10, color: '#1e293b', marginTop: 6 }}>NM Assistant · Powered by NaanMudhalvan AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
