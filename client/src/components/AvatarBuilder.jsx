import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── DiceBear Avataaars style (Snapchat/Bitmoji-like cartoon avatars) ──────────
// Uses the free DiceBear API to generate real cartoon character avatars

const SKIN_TONES = [
  { id: 'tanned',   label: 'Tanned',    hex: '#FD9841' },
  { id: 'yellow',   label: 'Yellow',    hex: '#F8D25C' },
  { id: 'pale',     label: 'Pale',      hex: '#FDDBB4' },
  { id: 'light',    label: 'Light',     hex: '#EDB98A' },
  { id: 'brown',    label: 'Brown',     hex: '#D08B5B' },
  { id: 'darkBrown',label: 'Dark',      hex: '#AE5D29' },
  { id: 'black',    label: 'Deep',      hex: '#614335' },
];

const HAIR_COLORS = [
  { id: 'Auburn',       hex: '#A55728' },
  { id: 'Black',        hex: '#2C1B18' },
  { id: 'Blonde',       hex: '#B58143' },
  { id: 'BlondeGolden', hex: '#D6B370' },
  { id: 'Brown',        hex: '#724133' },
  { id: 'BrownDark',    hex: '#4A312C' },
  { id: 'PastelPink',   hex: '#F59797' },
  { id: 'Platinum',     hex: '#ECDCBF' },
  { id: 'Red',          hex: '#C93305' },
  { id: 'SilverGray',   hex: '#E8E1E1' },
];

const TOP_STYLES = [
  { id: 'NoHair',           label: 'Bald' },
  { id: 'ShortHairShortFlat', label: 'Short Flat' },
  { id: 'ShortHairShortWaved', label: 'Short Wavy' },
  { id: 'ShortHairSides',   label: 'Sides' },
  { id: 'ShortHairDreads01', label: 'Dreads' },
  { id: 'LongHairBigHair',  label: 'Big Hair' },
  { id: 'LongHairBob',      label: 'Bob' },
  { id: 'LongHairCurly',    label: 'Curly' },
  { id: 'LongHairStraight', label: 'Straight' },
  { id: 'LongHairStraight2', label: 'Straight 2' },
  { id: 'LongHairFro',      label: 'Afro' },
  { id: 'LongHairBun',      label: 'Bun' },
  { id: 'Hat',              label: 'Hat' },
  { id: 'Hijab',            label: 'Hijab' },
  { id: 'Turban',           label: 'Turban' },
  { id: 'WinterHat1',       label: 'Winter Hat' },
];

const FACIAL_HAIR = [
  { id: 'Blank',            label: 'None' },
  { id: 'BeardLight',       label: 'Light Beard' },
  { id: 'BeardMedium',      label: 'Medium Beard' },
  { id: 'BeardMajestic',    label: 'Full Beard' },
  { id: 'MoustacheFancy',   label: 'Moustache' },
  { id: 'MoustacheMagnum',  label: 'Magnum' },
];

const EYES = [
  { id: 'Default',     label: 'Default' },
  { id: 'Happy',       label: 'Happy' },
  { id: 'Wink',        label: 'Wink' },
  { id: 'Hearts',      label: 'Hearts' },
  { id: 'Side',        label: 'Side' },
  { id: 'Squint',      label: 'Squint' },
  { id: 'Surprised',   label: 'Surprised' },
  { id: 'Dizzy',       label: 'Dizzy' },
  { id: 'EyeRoll',     label: 'Eye Roll' },
  { id: 'Cry',         label: 'Cry' },
];

const EYEBROWS = [
  { id: 'Default',           label: 'Default' },
  { id: 'DefaultNatural',    label: 'Natural' },
  { id: 'FlatNatural',       label: 'Flat' },
  { id: 'RaisedExcited',     label: 'Raised' },
  { id: 'SadConcerned',      label: 'Sad' },
  { id: 'UnibrowNatural',    label: 'Unibrow' },
  { id: 'UpDown',            label: 'Up Down' },
  { id: 'Angry',             label: 'Angry' },
];

const MOUTHS = [
  { id: 'Default',     label: 'Default' },
  { id: 'Smile',       label: 'Smile' },
  { id: 'Tongue',      label: 'Tongue' },
  { id: 'Twinkle',     label: 'Twinkle' },
  { id: 'Serious',     label: 'Serious' },
  { id: 'Sad',         label: 'Sad' },
  { id: 'ScreamOpen',  label: 'Scream' },
  { id: 'Grimace',     label: 'Grimace' },
  { id: 'Eating',      label: 'Eating' },
  { id: 'Disbelief',   label: 'Disbelief' },
];

const CLOTHES = [
  { id: 'BlazerShirt',      label: 'Blazer' },
  { id: 'BlazerSweater',    label: 'Blazer Sweater' },
  { id: 'CollarSweater',    label: 'Collar Sweater' },
  { id: 'GraphicShirt',     label: 'Graphic Shirt' },
  { id: 'Hoodie',           label: 'Hoodie' },
  { id: 'Overall',          label: 'Overall' },
  { id: 'ShirtCrewNeck',    label: 'Crew Neck' },
  { id: 'ShirtScoopNeck',   label: 'Scoop Neck' },
  { id: 'ShirtVNeck',       label: 'V Neck' },
];

const CLOTHES_COLORS = [
  { id: 'Black',      hex: '#262E33' },
  { id: 'Blue01',     hex: '#65C9FF' },
  { id: 'Blue02',     hex: '#5199E4' },
  { id: 'Blue03',     hex: '#25557C' },
  { id: 'Gray01',     hex: '#E6E6E6' },
  { id: 'Gray02',     hex: '#929598' },
  { id: 'Heather',    hex: '#3C4F5C' },
  { id: 'PastelBlue', hex: '#B1E2FF' },
  { id: 'PastelGreen',hex: '#A7FFC4' },
  { id: 'PastelOrange',hex:'#FFDEB5' },
  { id: 'PastelRed',  hex: '#FFAFB9' },
  { id: 'PastelYellow',hex:'#FFFFB1' },
  { id: 'Pink',       hex: '#FF488E' },
  { id: 'Red',        hex: '#FF5C5C' },
  { id: 'White',      hex: '#FFFFFF' },
];

const ACCESSORIES = [
  { id: 'Blank',          label: 'None' },
  { id: 'Kurt',           label: 'Round Glasses' },
  { id: 'Prescription01', label: 'Prescription' },
  { id: 'Prescription02', label: 'Prescription 2' },
  { id: 'Round',          label: 'Round' },
  { id: 'Sunglasses',     label: 'Sunglasses' },
  { id: 'Wayfarers',      label: 'Wayfarers' },
];

const BG_COLORS = [
  '#1a1200', '#0d0d20', '#1a0a1a', '#0a1a0a',
  '#1a0a0a', '#0a0a1a', '#1a1a0a', '#0d1a1a',
  '#2d1b00', '#001b2d', '#1b002d', '#002d1b',
];

const TABS = [
  { id: 'skin',      label: '🎨 Skin',     icon: '🎨' },
  { id: 'hair',      label: '💇 Hair',     icon: '💇' },
  { id: 'hairColor', label: '🎨 Hair Color', icon: '🎨' },
  { id: 'facial',    label: '🧔 Facial',   icon: '🧔' },
  { id: 'eyes',      label: '👁️ Eyes',    icon: '👁️' },
  { id: 'eyebrows',  label: '🤨 Brows',   icon: '🤨' },
  { id: 'mouth',     label: '👄 Mouth',   icon: '👄' },
  { id: 'clothes',   label: '👕 Clothes', icon: '👕' },
  { id: 'clothesColor', label: '🎨 Color', icon: '🎨' },
  { id: 'accessories', label: '👓 Extras', icon: '👓' },
  { id: 'bg',        label: '🌈 BG',      icon: '🌈' },
];

const DEFAULT_AVATAR = {
  skinColor:      'light',
  topType:        'ShortHairShortFlat',
  hairColor:      'Brown',
  facialHairType: 'Blank',
  eyeType:        'Default',
  eyebrowType:    'Default',
  mouthType:      'Smile',
  clotheType:     'Hoodie',
  clotheColor:    'Blue03',
  accessoriesType:'Blank',
  bgColor:        '#0d0d20',
};

export function buildAvatarString(parts) {
  return JSON.stringify(parts);
}

export function parseAvatar(str) {
  try { return JSON.parse(str); } catch { return null; }
}

// Build DiceBear Avataaars URL
function buildAvatarUrl(parts, size = 200) {
  const p = { ...DEFAULT_AVATAR, ...parts };
  const params = new URLSearchParams({
    skinColor:       p.skinColor,
    top:             p.topType,
    hairColor:       p.hairColor,
    facialHair:      p.facialHairType,
    eyes:            p.eyeType,
    eyebrows:        p.eyebrowType,
    mouth:           p.mouthType,
    clothing:        p.clotheType,
    clothingColor:   p.clotheColor,
    accessories:     p.accessoriesType,
    backgroundColor: p.bgColor.replace('#', ''),
    size:            size,
  });
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}

export function AvatarDisplay({ avatarStr, name = 'U', size = 'md' }) {
  const parts = parseAvatar(avatarStr);
  const px = { sm: 40, md: 64, lg: 96, xl: 128 }[size] || 64;
  const cls = { sm: 'h-10 w-10', md: 'h-16 w-16', lg: 'h-24 w-24', xl: 'h-32 w-32' }[size];

  if (!parts) {
    return (
      <div className={`${cls} rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] text-xl`}>
        {name[0]?.toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${cls} rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]`}
      style={{ background: parts.bgColor || '#0d0d20' }}>
      <img
        src={buildAvatarUrl(parts, px * 2)}
        alt="Avatar"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:${px * 0.4}px;font-weight:900;color:white">${name[0]?.toUpperCase()}</div>`;
        }}
      />
    </div>
  );
}

export default function AvatarBuilder({ value, onChange }) {
  const initial = parseAvatar(value) || { ...DEFAULT_AVATAR };
  const [parts, setParts]       = useState(initial);
  const [activeTab, setActiveTab] = useState('skin');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = buildAvatarUrl(parts, 300);
    setPreviewUrl(url);
  }, [parts]);

  const update = (key, val) => {
    const next = { ...parts, [key]: val };
    setParts(next);
    onChange(buildAvatarString(next));
  };

  const randomize = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const next = {
      skinColor:       rand(SKIN_TONES).id,
      topType:         rand(TOP_STYLES).id,
      hairColor:       rand(HAIR_COLORS).id,
      facialHairType:  rand(FACIAL_HAIR).id,
      eyeType:         rand(EYES).id,
      eyebrowType:     rand(EYEBROWS).id,
      mouthType:       rand(MOUTHS).id,
      clotheType:      rand(CLOTHES).id,
      clotheColor:     rand(CLOTHES_COLORS).id,
      accessoriesType: rand(ACCESSORIES).id,
      bgColor:         rand(BG_COLORS),
    };
    setParts(next);
    onChange(buildAvatarString(next));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'skin':
        return (
          <div className="grid grid-cols-7 gap-2">
            {SKIN_TONES.map(s => (
              <button key={s.id} onClick={() => update('skinColor', s.id)} title={s.label}
                className={`h-9 w-full rounded-xl border-2 transition-all ${parts.skinColor === s.id ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-transparent hover:border-amber-500/40'}`}
                style={{ background: s.hex }} />
            ))}
          </div>
        );
      case 'hairColor':
        return (
          <div className="grid grid-cols-5 gap-2">
            {HAIR_COLORS.map(h => (
              <button key={h.id} onClick={() => update('hairColor', h.id)} title={h.id}
                className={`h-9 w-full rounded-xl border-2 transition-all ${parts.hairColor === h.id ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-transparent hover:border-amber-500/40'}`}
                style={{ background: h.hex }} />
            ))}
          </div>
        );
      case 'clothesColor':
        return (
          <div className="grid grid-cols-5 gap-2">
            {CLOTHES_COLORS.map(c => (
              <button key={c.id} onClick={() => update('clotheColor', c.id)} title={c.id}
                className={`h-9 w-full rounded-xl border-2 transition-all ${parts.clotheColor === c.id ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-transparent hover:border-amber-500/40'}`}
                style={{ background: c.hex }} />
            ))}
          </div>
        );
      case 'bg':
        return (
          <div className="grid grid-cols-6 gap-2">
            {BG_COLORS.map(bg => (
              <button key={bg} onClick={() => update('bgColor', bg)}
                className={`h-9 w-full rounded-xl border-2 transition-all ${parts.bgColor === bg ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-transparent hover:border-amber-500/40'}`}
                style={{ background: bg }} />
            ))}
          </div>
        );
      case 'hair':
        return (
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {TOP_STYLES.map(t => (
              <button key={t.id} onClick={() => update('topType', t.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.topType === t.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
        );
      case 'facial':
        return (
          <div className="grid grid-cols-3 gap-2">
            {FACIAL_HAIR.map(f => (
              <button key={f.id} onClick={() => update('facialHairType', f.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.facialHairType === f.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        );
      case 'eyes':
        return (
          <div className="grid grid-cols-3 gap-2">
            {EYES.map(e => (
              <button key={e.id} onClick={() => update('eyeType', e.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.eyeType === e.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {e.label}
              </button>
            ))}
          </div>
        );
      case 'eyebrows':
        return (
          <div className="grid grid-cols-3 gap-2">
            {EYEBROWS.map(e => (
              <button key={e.id} onClick={() => update('eyebrowType', e.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.eyebrowType === e.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {e.label}
              </button>
            ))}
          </div>
        );
      case 'mouth':
        return (
          <div className="grid grid-cols-3 gap-2">
            {MOUTHS.map(m => (
              <button key={m.id} onClick={() => update('mouthType', m.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.mouthType === m.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {m.label}
              </button>
            ))}
          </div>
        );
      case 'clothes':
        return (
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {CLOTHES.map(c => (
              <button key={c.id} onClick={() => update('clotheType', c.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.clotheType === c.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {c.label}
              </button>
            ))}
          </div>
        );
      case 'accessories':
        return (
          <div className="grid grid-cols-3 gap-2">
            {ACCESSORIES.map(a => (
              <button key={a.id} onClick={() => update('accessoriesType', a.id)}
                className={`rounded-xl px-2 py-2 text-[10px] font-bold transition-all border ${parts.accessoriesType === a.id ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-amber-500/30 hover:text-slate-200'}`}>
                {a.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview + Randomize */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <motion.div key={previewUrl}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            style={{ background: parts.bgColor }}>
            <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)} />
          </motion.div>
          {loading && (
            <div className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-2xl">⚡</motion.div>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-black text-slate-200">Your Character</p>
          <p className="text-xs text-slate-500">Customize every detail below</p>
          <motion.button onClick={randomize} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black text-amber-400 hover:bg-amber-500/20 transition-all">
            🎲 Randomize
          </motion.button>
        </div>
      </div>

      {/* Tab bar - scrollable */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-shrink-0 rounded-xl px-3 py-2 text-[10px] font-black whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
          className="rounded-2xl border border-amber-500/10 bg-[#0a0a1a] p-4 min-h-[80px]">
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

