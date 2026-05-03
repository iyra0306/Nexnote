import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Avatar parts
const SKINS   = ['🟡','🟤','🟠','⬜','🟣'];
const HAIR    = ['👱','🧑','👩','🧔','👴','👵','🧒','🧑‍🦱','🧑‍🦰','🧑‍🦳','🧑‍🦲'];
const TOPS    = ['👕','👔','🥼','🧥','👗','🎽','🥋','👘','🩱','🧣'];
const ACCS    = ['🎓','👑','🪖','⛑️','🎩','🧢','👒','🪄','🔮','⚔️','🛡️','📚'];
const MOODS   = ['😊','😎','🤓','😤','🥳','😴','🤔','😏','🥸','🤩','😇','🫡'];
const BKGS    = [
  'from-amber-500/30 to-orange-500/20',
  'from-purple-500/30 to-pink-500/20',
  'from-cyan-500/30 to-blue-500/20',
  'from-green-500/30 to-teal-500/20',
  'from-red-500/30 to-rose-500/20',
  'from-indigo-500/30 to-violet-500/20',
];

const TABS = [
  { id: 'mood',  label: '😊 Mood',   items: MOODS },
  { id: 'hair',  label: '💇 Style',  items: HAIR  },
  { id: 'top',   label: '👕 Outfit', items: TOPS  },
  { id: 'acc',   label: '🎓 Gear',   items: ACCS  },
  { id: 'bg',    label: '🎨 BG',     items: BKGS  },
];

export function buildAvatarString(parts) {
  return JSON.stringify(parts);
}

export function parseAvatar(str) {
  try { return JSON.parse(str); } catch { return null; }
}

export function AvatarDisplay({ avatarStr, name = 'U', size = 'md' }) {
  const parts = parseAvatar(avatarStr);
  const sizes = { sm: 'h-10 w-10 text-lg', md: 'h-16 w-16 text-2xl', lg: 'h-24 w-24 text-4xl', xl: 'h-32 w-32 text-5xl' };
  const textSizes = { sm: 'text-[8px]', md: 'text-[10px]', lg: 'text-xs', xl: 'text-sm' };

  if (!parts) {
    return (
      <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]`}>
        {name[0]?.toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${parts.bg || BKGS[0]} border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden`}>
      <span className={`${size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'} leading-none`}>{parts.mood || '😊'}</span>
      {parts.acc && <span className={`absolute top-0.5 right-0.5 ${textSizes[size]}`}>{parts.acc}</span>}
      {parts.top && <span className={`absolute bottom-0.5 ${textSizes[size]}`}>{parts.top}</span>}
    </div>
  );
}

export default function AvatarBuilder({ value, onChange }) {
  const initial = parseAvatar(value) || { mood: '😊', hair: '🧑', top: '👕', acc: '🎓', bg: BKGS[0] };
  const [parts, setParts] = useState(initial);
  const [activeTab, setActiveTab] = useState('mood');

  const update = (key, val) => {
    const next = { ...parts, [key]: val };
    setParts(next);
    onChange(buildAvatarString(next));
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex flex-col items-center gap-3">
        <motion.div key={JSON.stringify(parts)}
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className={`h-28 w-28 rounded-3xl bg-gradient-to-br ${parts.bg} border-2 border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.3)]`}>
          <span className="text-5xl leading-none">{parts.mood}</span>
          {parts.acc && <span className="absolute top-1 right-1 text-lg">{parts.acc}</span>}
          {parts.top && <span className="absolute bottom-1 text-sm">{parts.top}</span>}
        </motion.div>
        <p className="text-xs text-amber-600 font-semibold">Your Avatar Preview</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-950/60 p-1 border border-amber-500/10">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 rounded-lg py-1.5 text-[10px] font-black transition-all ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {activeTab === 'bg' ? (
            <div className="grid grid-cols-6 gap-2">
              {BKGS.map((bg, i) => (
                <button key={i} onClick={() => update('bg', bg)}
                  className={`h-10 w-full rounded-xl bg-gradient-to-br ${bg} border-2 transition-all ${
                    parts.bg === bg ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'border-transparent hover:border-amber-500/40'
                  }`} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
              {TABS.find(t => t.id === activeTab)?.items.map((item, i) => (
                <motion.button key={i} onClick={() => update(activeTab, item)}
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  className={`h-10 w-full rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                    parts[activeTab] === item
                      ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'border-transparent bg-slate-950/40 hover:border-amber-500/30 hover:bg-amber-500/10'
                  }`}>
                  {item}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
