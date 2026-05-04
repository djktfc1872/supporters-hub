import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { Vote, Hammer, BookOpen, Users, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [activeTab, setActiveTab] = useState('polls');
  const [feedback, setFeedback] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [pollResults, setPollResults] = useState({ 
    'Online Forum': 0, 'WhatsApp Group': 0, 'Email Updates': 0, 'Face-to-Face': 0 
  });
  const [voted, setVoted] = useState(localStorage.getItem('ktfcsa_voted_comm') === 'true');

  useEffect(() => {
    const q = query(collection(db, "fanwall"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setIdeas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    const pollDocRef = doc(db, "polls", "communication");
    return onSnapshot(pollDocRef, (snapshot) => {
      if (snapshot.exists()) setPollResults(snapshot.data());
    });
  }, []);

  const handlePostIdea = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    await addDoc(collection(db, "fanwall"), { text: feedback, timestamp: Date.now() });
    setFeedback('');
    setTimeout(() => setActiveTab('join'), 800);
  };

  const handleVote = async (opt) => {
    if (voted) return;
    await updateDoc(doc(db, "polls", "communication"), { [opt]: increment(1) });
    setVoted(true);
    localStorage.setItem('ktfcsa_voted_comm', 'true');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col antialiased">
      {/* Header */}
      <div className="relative w-full overflow-hidden border-b-4 border-[#910b0b] bg-[#0a0a0a]">
        <img src="/hero-banner.jpg" className="absolute w-full h-full object-cover opacity-30" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto p-8 md:p-16 pt-24 flex flex-col md:flex-row items-center gap-10">
          <img src="/ktfcsa-logo.png" className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#d4af37] bg-black shadow-2xl object-contain" alt="Logo" />
          <div className="text-center md:text-left">
            <div className="text-[#d4af37] font-bold uppercase tracking-[0.3em] text-[10px] mb-3 flex items-center justify-center md:justify-start gap-2"><Hammer size={14} /> Shaping the Future</div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">Our Supporters' <br/><span className="text-[#d4af37]">Association</span></h1>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 flex-grow w-full">
        <nav className="flex bg-[#141414]/80 backdrop-blur-md border border-white/10 rounded-2xl mb-12 overflow-hidden shadow-2xl">
          {['polls', 'blueprint', 'join'].map((tab, idx) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeTab === tab ? 'bg-[#910b0b]/20 text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {idx === 0 && <Vote size={18} />} {idx === 1 && <BookOpen size={18} />} {idx === 2 && <Users size={18} />}
              <span className="font-black tracking-widest text-[10px] md:text-xs uppercase">{idx + 1}. {tab === 'polls' ? 'The Setup' : tab === 'blueprint' ? 'Fan Views' : 'Get Involved'}</span>
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {activeTab === 'polls' && (
              <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-black uppercase text-[#d4af37] mb-2 tracking-tight">Communication</h2>
                <p className="text-zinc-500 text-sm mb-6 uppercase tracking-wider font-bold">Where should we focus our updates?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(pollResults).map(([opt, count]) => {
                    const total = Object.values(pollResults).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <button key={opt} onClick={() => handleVote(opt)} className={`group w-full text-left p-6 rounded-2xl border transition-all ${voted ? 'border-white/5 cursor-default' : 'border-white/10 hover:border-[#d4af37]/50 bg-white/[0.02]'}`}>
                        <div className="flex justify-between mb-3"><span className="font-black text-sm tracking-tight">{opt}</span>{voted && <span className="text-[#d4af37] font-mono">{pct}%</span>}</div>
                        <div className="h-1.5 bg-black rounded-full overflow-hidden"><div className="h-full bg-[#d4af37] transition-all duration-1000" style={{ width: `${voted ? pct : 0}%` }} /></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'blueprint' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-[#141414] p-8 rounded-3xl border border-white/10 shadow-xl">
                  <h2 className="text-2xl font-black uppercase text-[#d4af37] mb-6 tracking-tight">The Fan Wall</h2>
                  <form onSubmit={handlePostIdea} className="space-y-4">
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-white min-h-[120px] focus:border-[#d4af37] outline-none" placeholder="What should be our first priority as an association?" />
                    <button className="bg-[#d4af37] text-black px-10 py-4 rounded-xl font-black tracking-widest text-xs ml-auto block hover:bg-white transition-all">SUBMIT VIEW</button>
                  </form>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {ideas.map(idea => (
                    <div key={idea.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] p-6 rounded-2xl border border-white/5 flex items-start gap-4 animate-in fade-in slide-in-from-left-4">
                      <div className="w-1 h-12 bg-[#910b0b] rounded-full mt-1"></div>
                      <div><p className="text-zinc-200 text-lg font-bold tracking-tight mb-2">{idea.text}</p><div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#d4af37]/50"></span>Fan Submission</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'join' && (
              <div className="bg-[#141414] p-16 rounded-3xl border border-white/10 text-center shadow-2xl animate-in zoom-in-95">
                <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#d4af37]"><Users size={40} /></div>
                <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">Join the Movement</h2>
                <p className="text-zinc-400 mb-10 max-w-md mx-auto text-lg font-medium leading-relaxed">We are currently forming the working group. If you have skills in legal, planning, or community organising, get in touch.</p>
                <button onClick={() => window.location.href='mailto:hello@ktfcsa.com'} className="bg-[#d4af37] text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all">Email the Working Group</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2"><ShieldCheck size={16} /> Our Foundation</h4>
              <ul className="space-y-6 text-sm font-semibold text-zinc-400 tracking-tight">
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>Totally independent from the club board.</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>Transparent about all association decisions.</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>One member, one vote on all association policy.</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2 shrink-0"></div><span className="text-zinc-300">Resourceful and self-funded; we build it ourselves to keep costs at zero.</span></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#910b0b]/20 to-transparent border border-[#910b0b]/30 rounded-3xl p-8 shadow-xl">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2"><Heart size={16} className="text-[#910b0b]" /> Working Together</h4>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">This hub is a live workspace for the fans of Kettering Town. Your input here directly shapes the foundations and core values of the Association. We don't just talk about change; we build the framework for it right here.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#0a0a0a] border-t-4 border-[#910b0b] mt-20 pb-12">
        <div className="max-w-6xl mx-auto px-8 pt-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/ktfcsa-logo.png" className="w-16 h-16 grayscale opacity-50" alt="Logo" />
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.4em] text-center md:text-left leading-loose">Kettering Town <br className="md:hidden" /> Supporters' Association</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <a href="https://ktfcsa.com" className="flex items-center gap-3 bg-[#d4af37] text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all group shadow-xl">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Main Website
            </a>
            <div className="text-center md:text-right">
              <p className="text-zinc-700 text-[10px] uppercase font-black tracking-[0.2em]">&copy; 2026 Kettering Town Supporters' Association | By the Fans, For the Fans</p>
              <p className="text-[#910b0b] text-[9px] uppercase font-black tracking-[0.3em] mt-1">Poppies Forever</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}