import React, { useState } from 'react';
import { Vote, Hammer, BookOpen, Users, Send, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('polls');
  const [feedback, setFeedback] = useState('');
  
  // Starting with an empty wall for a true blank slate
  const [ideas, setIdeas] = useState([]);
  
  const [polls, setPolls] = useState({
    communication: { 'Online Forum': 15, 'WhatsApp Group': 10, 'Email Updates': 5, 'Face-to-Face': 20 }
  });
  
  const [voted, setVoted] = useState({ communication: false });

  const handlePostIdea = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setIdeas([{ id: Date.now(), text: feedback, userId: "YOU", timestamp: Date.now() }, ...ideas]);
    setFeedback('');
    // Progress to next tab after posting
    setTimeout(() => setActiveTab('join'), 800);
  };

  const handleVote = (cat, opt) => {
    if (voted[cat]) return;
    setPolls(prev => ({ ...prev, [cat]: { ...prev[cat], [opt]: prev[cat][opt] + 1 } }));
    setVoted(prev => ({ ...prev, [cat]: true }));
    
    // Auto-progress to 'Fan Views' after a small delay
    setTimeout(() => {
      setActiveTab('blueprint');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d4af37] selection:text-black flex flex-col antialiased">
      
      {/* HEADER SECTION */}
      <div className="relative w-full overflow-hidden border-b-4 border-[#910b0b] bg-[#0a0a0a]">
        <img src="/hero-banner.jpg" className="absolute w-full h-full object-cover opacity-30" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto p-8 md:p-16 pt-24">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <img 
              src="/ktfcsa-logo.png" 
              className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#d4af37] bg-black shadow-2xl object-contain" 
              alt="KTFCSA Logo" 
            />
            
            <div className="text-center md:text-left">
              <div className="text-[#d4af37] font-bold uppercase tracking-[0.3em] text-[10px] mb-3 flex items-center justify-center md:justify-start gap-2">
                <Hammer size={14} /> Shaping the Future
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                Our Supporters' <br/><span className="text-[#d4af37]">Association</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 flex-grow w-full">
        {/* NAVIGATION */}
        <nav className="flex bg-[#141414]/80 backdrop-blur-md border border-white/10 rounded-2xl mb-12 overflow-hidden shadow-2xl">
          <button onClick={() => setActiveTab('polls')} className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeTab === 'polls' ? 'bg-[#910b0b]/20 text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Vote size={18} /> <span className="font-black tracking-widest text-xs uppercase">1. The Setup</span>
          </button>
          <button onClick={() => setActiveTab('blueprint')} className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeTab === 'blueprint' ? 'bg-[#910b0b]/20 text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <BookOpen size={18} /> <span className="font-black tracking-widest text-xs uppercase">2. Fan Views</span>
          </button>
          <button onClick={() => setActiveTab('join')} className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all ${activeTab === 'join' ? 'bg-[#910b0b]/20 text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Users size={18} /> <span className="font-black tracking-widest text-xs uppercase">3. Get Involved</span>
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* POLLS SECTION */}
            {activeTab === 'polls' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-black uppercase text-[#d4af37] mb-2 tracking-tight">Communication</h2>
                  <p className="text-zinc-500 text-sm mb-6 uppercase tracking-wider font-bold">Where should we focus our updates?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(polls.communication).map(([opt, count]) => {
                      const total = Object.values(polls.communication).reduce((a, b) => a + b, 0);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <button key={opt} onClick={() => handleVote('communication', opt)} className="group w-full text-left p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4af37]/50 transition-all">
                          <div className="flex justify-between mb-3"><span className="font-black text-sm tracking-tight">{opt}</span><span className="text-[#d4af37] font-mono">{pct}%</span></div>
                          <div className="h-1.5 bg-black rounded-full overflow-hidden"><div className="h-full bg-[#d4af37] transition-all duration-1000" style={{ width: `${voted.communication ? pct : 0}%` }} /></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* FAN WALL SECTION */}
            {activeTab === 'blueprint' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#141414] p-8 rounded-3xl border border-white/10 shadow-xl">
                  <h2 className="text-2xl font-black uppercase text-[#d4af37] mb-6 tracking-tight">The Fan Wall</h2>
                  <form onSubmit={handlePostIdea} className="space-y-4">
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 text-white min-h-[150px] focus:border-[#d4af37] outline-none transition-all placeholder:text-zinc-700 font-medium tracking-tight" placeholder="What should be our first priority as an association?" />
                    <button className="bg-[#d4af37] text-black px-10 py-4 rounded-xl font-black tracking-widest text-xs ml-auto block hover:bg-white transition-all shadow-lg shadow-[#d4af37]/20">SUBMIT VIEW</button>
                  </form>
                </div>
                {ideas.map(idea => (
                  <div key={idea.id} className="bg-[#141414]/60 p-8 rounded-3xl border border-white/5 italic text-zinc-100 text-lg shadow-inner font-medium tracking-tight">
                    "{idea.text}"
                  </div>
                ))}
              </div>
            )}

            {/* JOIN SECTION */}
            {activeTab === 'join' && (
              <div className="bg-[#141414] p-16 rounded-3xl border border-white/10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#d4af37]">
                   <Users size={40} />
                </div>
                <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">Join the Movement</h2>
                <p className="text-zinc-400 mb-10 max-w-md mx-auto text-lg leading-relaxed font-medium tracking-tight">We are currently forming the working group. If you have skills in legal, planning, or community organising, get in touch.</p>
                <button 
                  onClick={() => window.location.href='mailto:hello@ktfcsa.com'}
                  className="bg-[#d4af37] text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-lg shadow-[#d4af37]/10"
                >
                  Email the Working Group
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-xl">
              <h4 className="text-[#d4af37] font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2">
                <ShieldCheck size={16} /> Our Foundation
              </h4>
              <ul className="space-y-6 text-sm font-semibold text-zinc-400 tracking-tight">
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>Totally independent from the club board.</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>Transparent about all association decisions.</span></li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 bg-[#910b0b] rounded-full mt-2 shrink-0"></div><span>One member, one vote on all association policy.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-zinc-500 text-[11px] uppercase font-black tracking-[0.3em]">
              Kettering Town Supporters' Association
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <a 
              href="https://ktfcsa.com" 
              className="flex items-center gap-2 text-[#d4af37] text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Main Website
            </a>
            <p className="text-zinc-800 text-[10px] uppercase font-black tracking-[0.2em]">
              &copy; 2026 KTFCSA | Established by the Fans
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}