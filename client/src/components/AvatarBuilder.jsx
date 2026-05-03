import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// DiceBear 9.x API - generates real cartoon avatars
function buildUrl(seed, style, bg, size) {
  const s = style || "avataaars";
  const b = bg || "b6e3f4,c0aede";
  return `https://api.dicebear.com/9.x/${s}/svg?seed=${encodeURIComponent(seed || "Scholar")}&size=${size || 200}&backgroundColor=${encodeURIComponent(b)}&backgroundType=gradientLinear`;
}

// Preset seeds - each gives a unique cartoon character
const PRESET_SEEDS = [
  "Iyra","Neeti","Manleen","Eknoor","Scholar","Hero","Wizard","Knight",
  "Archer","Mage","Rogue","Paladin","Druid","Bard","Ranger","Monk",
  "Warrior","Sage","Oracle","Phoenix","Dragon","Tiger","Eagle","Wolf",
  "Star","Moon","Sun","Storm","Fire","Ice","Thunder","Shadow",
  "Crystal","Ember","Frost","Blaze","Nova","Comet","Nebula","Galaxy",
  "Pixel","Cyber","Neon","Glitch","Matrix","Quantum","Fusion","Apex",
];

const STYLES = [
  { id: "avataaars",         label: "Cartoon",  emoji: "🧑" },
  { id: "avataaars-neutral", label: "Neutral",  emoji: "😐" },
  { id: "lorelei",           label: "Lorelei",  emoji: "🧝" },
  { id: "open-peeps",        label: "Peeps",    emoji: "👤" },
  { id: "personas",          label: "Persona",  emoji: "🎭" },
  { id: "pixel-art",         label: "Pixel",    emoji: "👾" },
  { id: "fun-emoji",         label: "Emoji",    emoji: "😄" },
  { id: "bottts",            label: "Robot",    emoji: "🤖" },
  { id: "croodles",          label: "Doodle",   emoji: "✏️" },
  { id: "notionists",        label: "Notion",   emoji: "🎨" },
];

const BG_COLORS = [
  { id: "b6e3f4,c0aede",  label: "Blue",     preview: "linear-gradient(135deg,#b6e3f4,#c0aede)" },
  { id: "ffd5dc,ffdfbf",  label: "Pink",     preview: "linear-gradient(135deg,#ffd5dc,#ffdfbf)" },
  { id: "d1d4f9,c0aede",  label: "Purple",   preview: "linear-gradient(135deg,#d1d4f9,#c0aede)" },
  { id: "c1f0c8,b6e3f4",  label: "Mint",     preview: "linear-gradient(135deg,#c1f0c8,#b6e3f4)" },
  { id: "ffeaa7,fdcb6e",  label: "Gold",     preview: "linear-gradient(135deg,#ffeaa7,#fdcb6e)" },
  { id: "fd79a8,e84393",  label: "Hot Pink", preview: "linear-gradient(135deg,#fd79a8,#e84393)" },
  { id: "55efc4,00b894",  label: "Green",    preview: "linear-gradient(135deg,#55efc4,#00b894)" },
  { id: "74b9ff,0984e3",  label: "Sky",      preview: "linear-gradient(135deg,#74b9ff,#0984e3)" },
  { id: "a29bfe,6c5ce7",  label: "Violet",   preview: "linear-gradient(135deg,#a29bfe,#6c5ce7)" },
  { id: "fab1a0,e17055",  label: "Coral",    preview: "linear-gradient(135deg,#fab1a0,#e17055)" },
  { id: "f9ca24,f0932b",  label: "Orange",   preview: "linear-gradient(135deg,#f9ca24,#f0932b)" },
  { id: "6ab04c,badc58",  label: "Lime",     preview: "linear-gradient(135deg,#6ab04c,#badc58)" },
];

const TABS = [
  { id: "preset",  label: "🎭 Characters" },
  { id: "style",   label: "🎨 Style" },
  { id: "bg",      label: "🌈 Background" },
  { id: "custom",  label: "✏️ Custom" },
];

export function buildAvatarString(parts) {
  return JSON.stringify(parts);
}

export function parseAvatar(str) {
  try { return JSON.parse(str); } catch { return null; }
}

// Fallback SVG avatar when API is unavailable
function FallbackAvatar({ name, size }) {
  const colors = ["#f59e0b","#8b5cf6","#06b6d4","#10b981","#ec4899","#ef4444","#3b82f6"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className="w-full h-full flex items-center justify-center font-black text-white"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, fontSize: size * 0.4 }}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

export function AvatarDisplay({ avatarStr, name = "U", size = "md" }) {
  const parts = parseAvatar(avatarStr);
  const px = { sm: 40, md: 64, lg: 96, xl: 128 }[size] || 64;
  const cls = { sm: "h-10 w-10", md: "h-16 w-16", lg: "h-24 w-24", xl: "h-32 w-32" }[size];
  const [err, setErr] = useState(false);

  useEffect(() => { setErr(false); }, [avatarStr]);

  if (!parts?.seed) {
    return (
      <div className={`${cls} rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]`}>
        <FallbackAvatar name={name} size={px} />
      </div>
    );
  }

  const url = buildUrl(parts.seed, parts.style, parts.bg, px * 2);

  return (
    <div className={`${cls} rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-slate-900`}>
      {!err ? (
        <img src={url} alt="Avatar" className="w-full h-full object-cover"
          onError={() => setErr(true)} />
      ) : (
        <FallbackAvatar name={name} size={px} />
      )}
    </div>
  );
}

export default function AvatarBuilder({ value, onChange }) {
  const initial = parseAvatar(value) || { seed: "Scholar", style: "avataaars", bg: "b6e3f4,c0aede" };
  const [parts, setParts]           = useState(initial);
  const [activeTab, setActiveTab]   = useState("preset");
  const [customSeed, setCustomSeed] = useState(initial.seed || "");
  const [previewErr, setPreviewErr] = useState(false);

  const update = useCallback((key, val) => {
    const next = { ...parts, [key]: val };
    setParts(next);
    onChange(buildAvatarString(next));
    setPreviewErr(false);
  }, [parts, onChange]);

  const randomize = () => {
    const seed  = PRESET_SEEDS[Math.floor(Math.random() * PRESET_SEEDS.length)];
    const style = STYLES[Math.floor(Math.random() * STYLES.length)].id;
    const bg    = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)].id;
    const next  = { seed, style, bg };
    setParts(next);
    setCustomSeed(seed);
    onChange(buildAvatarString(next));
    setPreviewErr(false);
  };

  const previewUrl = buildUrl(parts.seed, parts.style, parts.bg, 300);

  return (
    <div className="space-y-4">
      {/* Preview + Randomize */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <motion.div key={previewUrl}
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-slate-900">
            {!previewErr ? (
              <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover"
                onError={() => setPreviewErr(true)} />
            ) : (
              <FallbackAvatar name={parts.seed} size={112} />
            )}
          </motion.div>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-md -z-10" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-black text-slate-100">Your Character</p>
          <p className="text-xs text-slate-500">Seed: <span className="text-amber-400 font-bold">{parts.seed}</span></p>
          <p className="text-xs text-slate-500">Style: <span className="text-amber-400 font-bold">{parts.style}</span></p>
          <motion.button onClick={randomize} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black text-amber-400 hover:bg-amber-500/20 transition-all">
            �� Random Character
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-950/60 p-1 border border-amber-500/10">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-[10px] font-black transition-all ${
              activeTab === t.id
                ? "bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
          className="rounded-2xl border border-amber-500/10 bg-[#0a0a1a] p-4">

          {/* PRESET TAB */}
          {activeTab === "preset" && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Pick a character</p>
              <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                {PRESET_SEEDS.map(seed => {
                  const url = buildUrl(seed, parts.style, parts.bg, 80);
                  return (
                    <motion.button key={seed} onClick={() => { update("seed", seed); setCustomSeed(seed); }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all aspect-square bg-slate-900 ${
                        parts.seed === seed
                          ? "border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                          : "border-transparent hover:border-amber-500/40"
                      }`}>
                      <img src={url} alt={seed} className="w-full h-full object-cover" />
                      {parts.seed === seed && (
                        <div className="absolute bottom-0 inset-x-0 bg-amber-500/80 py-0.5">
                          <span className="text-[7px] font-black text-white block text-center truncate px-1">{seed}</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === "style" && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Avatar style</p>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                  <motion.button key={s.id} onClick={() => update("style", s.id)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 rounded-xl p-3 border-2 transition-all ${
                      parts.style === s.id
                        ? "border-amber-400 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        : "border-white/5 bg-slate-950/40 hover:border-amber-500/30"
                    }`}>
                    <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                      <img src={buildUrl(parts.seed || "Scholar", s.id, parts.bg, 80)} alt={s.label}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display="none"; e.target.parentElement.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px">${s.emoji}</div>`; }} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs font-black text-slate-200">{s.emoji} {s.label}</p>
                    </div>
                    {parts.style === s.id && <span className="text-amber-400 text-sm font-black">✓</span>}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* BG TAB */}
          {activeTab === "bg" && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Background</p>
              <div className="grid grid-cols-4 gap-2">
                {BG_COLORS.map(bg => (
                  <button key={bg.id} onClick={() => update("bg", bg.id)} title={bg.label}
                    className={`h-12 rounded-xl border-2 transition-all flex items-end justify-center pb-1 ${
                      parts.bg === bg.id
                        ? "border-amber-400 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                        : "border-transparent hover:border-amber-500/40"
                    }`}
                    style={{ background: bg.preview }}>
                    <span className="text-[8px] font-black text-white bg-black/40 px-1 rounded">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM TAB */}
          {activeTab === "custom" && (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Custom seed</p>
              <p className="text-xs text-slate-400">Type any name or word — each generates a unique avatar!</p>
              <div className="flex gap-2">
                <input type="text" value={customSeed} onChange={(e) => setCustomSeed(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && customSeed.trim() && update("seed", customSeed.trim())}
                  placeholder="Type your name..."
                  className="flex-1 rounded-xl border border-amber-500/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-slate-600" />
                <motion.button onClick={() => customSeed.trim() && update("seed", customSeed.trim())}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  disabled={!customSeed.trim()}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-black text-white disabled:opacity-40">
                  Apply
                </motion.button>
              </div>
              {customSeed.trim() && (
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-slate-900">
                    <img src={buildUrl(customSeed.trim(), parts.style, parts.bg, 160)} alt="preview"
                      className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 text-xs text-amber-600">
                💡 Try your name, nickname, or anything creative!
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}