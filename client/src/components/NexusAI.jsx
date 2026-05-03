import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiPaperAirplane, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi2';

// ── Knowledge base for NEXUS AI ──────────────────────────────────────────────
// This is a smart rule-based AI that answers study-related questions.
// It uses keyword matching + context to give helpful responses.

const NEXUS_KNOWLEDGE = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hii', 'helo'],
    responses: [
      "⚔️ Greetings, Scholar! I'm **NEXUS AI** — your study companion. Ask me anything about your notes, subjects, or study tips!",
      "🌟 Hey there, Hero! NEXUS AI at your service. What topic shall we conquer today?",
      "🎮 Welcome back! I'm NEXUS, your AI study guide. Ready to level up your knowledge?",
    ]
  },
  help: {
    patterns: ['help', 'what can you do', 'how to use', 'features', 'commands'],
    responses: [
      `🤖 **NEXUS AI can help you with:**\n\n📚 **Study Topics** — Ask about any subject\n🎯 **Exam Tips** — Get preparation strategies\n📖 **Concept Explanations** — Understand difficult topics\n💡 **Study Techniques** — Learn smarter methods\n🔍 **Note Suggestions** — Find relevant notes\n\nJust type your question and I'll help! ⚔️`
    ]
  },
  maths: {
    patterns: ['math', 'maths', 'mathematics', 'calculus', 'algebra', 'geometry', 'trigonometry', 'statistics', 'probability', 'integration', 'differentiation', 'derivative', 'matrix', 'vector', 'equation'],
    responses: [
      "📐 **Mathematics Tips:**\n\n1. **Practice daily** — Math needs consistent practice\n2. **Understand concepts** — Don't just memorize formulas\n3. **Solve previous papers** — Pattern recognition is key\n4. **Use NEXNOTE** — Search for math notes by your department\n\n💡 **Quick Tip:** For calculus, always understand the geometric meaning before solving algebraically!",
      "🔢 **Math Study Strategy:**\n\n• Start with **basics** before advanced topics\n• Create a **formula sheet** for quick revision\n• Practice **10 problems daily** minimum\n• Use **Exam Mode** in NEXNOTE to find exam-important notes\n\nWhat specific math topic do you need help with? 🎯",
    ]
  },
  physics: {
    patterns: ['physics', 'mechanics', 'thermodynamics', 'optics', 'electromagnetism', 'quantum', 'relativity', 'waves', 'force', 'energy', 'motion', 'newton', 'gravity'],
    responses: [
      "⚡ **Physics Study Guide:**\n\n1. **Understand the WHY** — Physics is about understanding nature\n2. **Draw diagrams** — Visual representation helps a lot\n3. **Learn formulas with derivations** — Don't just memorize\n4. **Solve numerical problems** — Theory + Practice = Success\n\n🎯 **Exam Tip:** Focus on units and dimensions — common exam question!\n\nSearch for Physics notes in NEXNOTE using the department filter! 📚",
    ]
  },
  chemistry: {
    patterns: ['chemistry', 'organic', 'inorganic', 'physical chemistry', 'reaction', 'element', 'compound', 'molecule', 'atom', 'periodic table', 'bond', 'acid', 'base'],
    responses: [
      "🧪 **Chemistry Study Tips:**\n\n1. **Memorize periodic table** — Groups and periods matter\n2. **Understand reaction mechanisms** — Don't just memorize products\n3. **Practice naming compounds** — IUPAC nomenclature is important\n4. **Use mnemonics** — For remembering series and groups\n\n💡 **Quick Tip:** For organic chemistry, focus on functional groups first!\n\nFind chemistry notes on NEXNOTE → Filter by your department 🔍",
    ]
  },
  programming: {
    patterns: ['programming', 'coding', 'code', 'python', 'java', 'javascript', 'c++', 'c language', 'data structure', 'algorithm', 'array', 'linked list', 'tree', 'graph', 'sorting', 'searching', 'oop', 'object oriented', 'database', 'sql', 'web development', 'html', 'css'],
    responses: [
      "💻 **Programming Study Guide:**\n\n1. **Code daily** — Even 30 minutes helps\n2. **Build projects** — Apply what you learn\n3. **Debug patiently** — Errors are learning opportunities\n4. **Read documentation** — Official docs are your best friend\n\n🎯 **For CSE Students:**\n• Focus on **Data Structures & Algorithms** for placements\n• Practice on **LeetCode/HackerRank**\n• Understand **OOP concepts** thoroughly\n\nSearch CSE notes on NEXNOTE! ⚔️",
      "🖥️ **Coding Tips:**\n\n• **Pseudocode first** — Plan before coding\n• **Test edge cases** — Always check boundary conditions\n• **Comment your code** — Future you will thank you\n• **Version control** — Learn Git basics\n\nWhat programming topic needs clarification? 🔮",
    ]
  },
  exam: {
    patterns: ['exam', 'test', 'preparation', 'prepare', 'study tips', 'how to study', 'revision', 'last minute', 'marks', 'score', 'pass', 'fail', 'grade'],
    responses: [
      "🎯 **Exam Preparation Strategy:**\n\n**1 Week Before:**\n• Complete all topics\n• Make summary notes\n• Solve previous year papers\n\n**3 Days Before:**\n• Revise important formulas\n• Focus on weak areas\n• Use NEXNOTE's **Exam Mode** 🎯\n\n**Night Before:**\n• Light revision only\n• Sleep 7-8 hours\n• Prepare materials\n\n**Day of Exam:**\n• Eat well, stay hydrated\n• Read questions carefully\n• Attempt easy ones first\n\n💪 You've got this, Hero!",
      "📝 **Smart Study Techniques:**\n\n🔴 **Pomodoro Technique** — 25 min study, 5 min break\n🟡 **Feynman Technique** — Explain concepts simply\n🟢 **Spaced Repetition** — Review at increasing intervals\n🔵 **Mind Mapping** — Visual connections between topics\n\n**Use NEXNOTE's Exam Mode** to filter only exam-important notes! 🎯",
    ]
  },
  notes: {
    patterns: ['notes', 'find notes', 'where are notes', 'download', 'upload', 'pdf', 'study material', 'material'],
    responses: [
      "📚 **Finding Notes on NEXNOTE:**\n\n1. Go to **Note Library** (📚 in sidebar)\n2. Filter by your **Department** (CSE, ECE, etc.)\n3. Filter by your **Semester** (1-8)\n4. Toggle **🎯 Exam Mode** for exam-critical notes\n5. Search by **subject name**\n6. **Download** any note for offline access\n\n💡 **Pro Tip:** Rate and comment on notes to help your classmates! You earn **+3 XP** for rating! ⭐",
    ]
  },
  xp: {
    patterns: ['xp', 'points', 'level up', 'rank', 'badge', 'achievement', 'how to earn', 'earn xp', 'novice', 'scholar', 'master', 'legend'],
    responses: [
      "🏆 **How to Earn XP on NEXNOTE:**\n\n⚔️ **Upload a note** → +10 XP\n⬇️ **Download a note** → +5 XP\n💎 **Add to favorites** → +2 XP\n⭐ **Rate a note** → +3 XP\n💬 **Comment on a note** → +2 XP\n✉️ **Send a message** → +2 XP\n\n**Rank Ladder:**\n🌱 Novice (0 XP)\n📖 Scholar (50 XP)\n⚡ Adept (150 XP)\n🔮 Expert (300 XP)\n👑 Master (500 XP)\n🌟 Legend (999 XP)\n\nKeep grinding, Hero! ⚔️",
    ]
  },
  cse: {
    patterns: ['cse', 'computer science', 'computer engineering', 'software engineering', 'it', 'information technology'],
    responses: [
      "💻 **CSE/IT Study Roadmap:**\n\n**Core Subjects:**\n• Data Structures & Algorithms\n• Operating Systems\n• Database Management\n• Computer Networks\n• Software Engineering\n• Theory of Computation\n\n**For Placements:**\n• DSA (Most Important!)\n• System Design\n• DBMS + SQL\n• OOP Concepts\n\n**Projects to Build:**\n• Web Application (MERN Stack)\n• Mobile App\n• ML Project\n\nFind CSE notes on NEXNOTE → Filter by CSE department! 📚",
    ]
  },
  ece: {
    patterns: ['ece', 'electronics', 'electrical', 'circuit', 'signal', 'communication', 'microprocessor', 'vlsi', 'embedded'],
    responses: [
      "⚡ **ECE Study Guide:**\n\n**Core Subjects:**\n• Electronic Devices & Circuits\n• Digital Electronics\n• Signals & Systems\n• Communication Systems\n• Microprocessors\n• VLSI Design\n\n**Important Topics:**\n• Op-Amp circuits\n• Digital logic gates\n• Modulation techniques\n• Microcontroller programming\n\nSearch ECE notes on NEXNOTE! Filter by ECE department 🔍",
    ]
  },
  stress: {
    patterns: ['stressed', 'stress', 'anxiety', 'worried', 'nervous', 'scared', 'overwhelmed', 'tired', 'exhausted', 'burnout', 'cant study', "can't study", 'no motivation'],
    responses: [
      "💙 **Hey, it's okay to feel this way!**\n\nHere are some tips to manage study stress:\n\n🧘 **Take a break** — 10-15 minutes away from books\n🚶 **Walk outside** — Fresh air clears the mind\n💧 **Stay hydrated** — Dehydration causes fatigue\n😴 **Sleep well** — 7-8 hours is non-negotiable\n🎵 **Listen to music** — Lo-fi beats help focus\n\n**Remember:**\n• One topic at a time\n• Progress > Perfection\n• You've overcome challenges before!\n\nYou've got this, Hero! ⚔️💪",
    ]
  },
  chitkara: {
    patterns: ['chitkara', 'university', 'college', 'campus', 'faculty', 'professor', 'teacher', 'department'],
    responses: [
      "🏛️ **Chitkara University - NEXNOTE:**\n\nNEXNOTE is built specifically for Chitkara University students!\n\n**Available Departments:**\n🖥️ CSE | ⚡ ECE | 🔧 Mechanical\n🏗️ Civil | 💻 IT | ⚡ EEE\n🧪 Chemical | 🧬 Biotechnology\n\n**Features for Chitkara Students:**\n• Notes organized by semester (1-8)\n• Exam-important content tagged\n• Department-specific announcements\n• Teacher-verified notes\n\nUse NEXNOTE to ace your Chitkara exams! 🎯",
    ]
  },
  default: [
    "🤔 Interesting question! Let me think...\n\nI'm NEXUS AI, specialized in helping with:\n📚 Study topics & concepts\n🎯 Exam preparation\n💡 Study techniques\n📖 Finding notes on NEXNOTE\n\nCould you be more specific? I'll give you a better answer! ⚔️",
    "🔮 I'm still learning, but here's what I know:\n\nFor the best help, try asking about:\n• Specific subjects (Math, Physics, CS, etc.)\n• Exam preparation tips\n• How to use NEXNOTE features\n• Study techniques\n\nWhat subject are you studying? 📚",
    "⚡ Great question! I'm NEXUS AI — your study companion.\n\nI can help with subject explanations, exam tips, and NEXNOTE features. Try asking something like:\n• 'How to prepare for exams?'\n• 'Tips for programming?'\n• 'How to earn XP?'\n\nWhat do you need help with? 🎯",
  ]
};

function getNexusResponse(message) {
  const lower = message.toLowerCase().trim();

  for (const [key, data] of Object.entries(NEXUS_KNOWLEDGE)) {
    if (key === 'default') continue;
    if (data.patterns?.some(p => lower.includes(p))) {
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  const defaults = NEXUS_KNOWLEDGE.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

const SUGGESTIONS = [
  '🎯 Exam tips',
  '📚 How to find notes?',
  '🏆 How to earn XP?',
  '💻 Programming tips',
  '📐 Math study guide',
  '😰 I\'m stressed',
];

export default function NexusAI() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai',
      text: "⚔️ Hey Scholar! I'm **NEXUS AI** — your intelligent study companion!\n\nAsk me anything about your subjects, exam prep, or how to use NEXNOTE. I'm here to help you level up! 🚀",
      time: new Date(),
    }
  ]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = getNexusResponse(msg);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response, time: new Date() }]);
  };

  const clearChat = () => {
    setMessages([{
      id: 1, role: 'ai',
      text: "⚔️ Chat cleared! I'm **NEXUS AI** — ready for new questions! What would you like to learn today? 🚀",
      time: new Date(),
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center text-white"
        title="NEXUS AI"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <HiXMark className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              className="flex flex-col items-center">
              <HiOutlineSparkles className="text-xl" />
              <span className="text-[8px] font-black leading-none mt-0.5">NEXUS</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-amber-500" style={{ zIndex: -1 }} />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] rounded-3xl border border-amber-500/20 bg-[#0a0a1a] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            style={{ maxHeight: '70vh', minHeight: '400px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-500/10 bg-gradient-to-r from-amber-500/10 to-orange-500/5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <HiOutlineSparkles className="text-white text-xl" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-[#0a0a1a]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-amber-300">NEXUS AI ✨</p>
                <p className="text-[10px] text-amber-600">Your Study Companion • Always Online</p>
              </div>
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-300" title="Clear chat">
                <HiOutlineTrash className="text-sm" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-300">
                <HiXMark className="text-lg" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'ai' && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 mt-1">
                      <HiOutlineSparkles className="text-white text-xs" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-100 border border-amber-500/20 rounded-tr-sm'
                      : 'bg-[#141428] text-slate-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                    <p className="text-[9px] text-slate-600 mt-1 text-right">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                    <HiOutlineSparkles className="text-white text-xs" />
                  </div>
                  <div className="bg-[#141428] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-amber-700 font-semibold mb-2">💡 Quick Questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-[10px] text-amber-400 hover:bg-amber-500/15 transition-colors font-semibold">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-amber-500/10">
              <div className="flex gap-2">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask NEXUS anything... ✨"
                  className="flex-1 rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder:text-slate-600" />
                <motion.button onClick={() => sendMessage()} disabled={!input.trim() || typing}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <HiPaperAirplane className="text-sm" />
                </motion.button>
              </div>
              <p className="text-[9px] text-slate-700 text-center mt-2">NEXUS AI • Powered by NEXNOTE Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
