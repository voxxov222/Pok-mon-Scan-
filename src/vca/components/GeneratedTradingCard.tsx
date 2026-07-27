import React, { useRef, useState, MouseEvent } from 'react';
import { Sparkles, Zap, Flame, Shield, Award, Star } from 'lucide-react';

interface GeneratedTradingCardProps {
  title: string;
  set: string;
  year: number;
  category: 'Pokemon' | 'Sports' | 'Magic: The Gathering' | 'Yu-Gi-Oh!' | 'One Piece' | 'Lorcana' | 'Other';
  grade: string;
  artwork: string;
  imageBg?: string;
  className?: string;
  side?: 'front' | 'back';
  imageUrl?: string;
  backImageUrl?: string;
}

export default function GeneratedTradingCard({
  title,
  set,
  year,
  category,
  grade,
  artwork,
  imageBg = 'from-amber-400 via-yellow-300 to-amber-500',
  className = '',
  side = 'front',
  imageUrl,
  backImageUrl
}: GeneratedTradingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || side === 'back') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const px = x / width;
    const py = y / height;

    const rx = (py - 0.5) * -20;
    const ry = (px - 0.5) * 20;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.05s ease-out',
    });

    setShineStyle({
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 35%, transparent 75%)`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out',
    });
    setShineStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out',
    });
  };

  const isPokemon = category === 'Pokemon';
  const isSports = category === 'Sports';

  // BACK SIDE RENDERING (Authentic Pokémon Card Back Style)
  if (side === 'back') {
    if (backImageUrl) {
      return (
        <div
          ref={cardRef}
          className={`relative w-[280px] h-[390px] sm:w-[300px] sm:h-[420px] rounded-[18px] overflow-hidden shadow-2xl select-none cursor-pointer ${className}`}
        >
          <img src={backImageUrl} alt="Card Back" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      );
    }
    
    return (
      <div
        ref={cardRef}
        className={`relative w-[280px] h-[390px] sm:w-[300px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl select-none cursor-pointer bg-[#0e2a5c] border-[6px] border-[#1b3e80] flex flex-col items-center justify-between p-4 ${className}`}
      >
        {/* Outer dark blue border frame */}
        <div className="absolute inset-1.5 rounded-xl border-2 border-[#3b6fc2] pointer-events-none" />
        
        {/* Swirling Vortex Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600 via-blue-900 to-[#081a38] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,191,255,0.2),transparent_70%)] pointer-events-none" />

        {/* Top Pokémon Logo */}
        <div className="relative z-10 pt-2 flex flex-col items-center">
          <span className="font-black text-2xl tracking-wider text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_#1e3a8a,_-2px_-2px_0_#1e3a8a,_2px_-2px_0_#1e3a8a,_-2px_2px_0_#1e3a8a,0_4px_8px_rgba(0,0,0,0.6)] font-sans uppercase">
            POKÉMON
          </span>
          <span className="text-[8px] font-bold text-yellow-200/80 tracking-widest mt-[-2px]">TRADING CARD GAME</span>
        </div>

        {/* Center Metallic Pokéball Emblem */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-slate-800 via-slate-600 to-slate-900 border-4 border-yellow-400/90 shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center p-1.5">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-red-600 via-red-500 to-slate-900 relative overflow-hidden border-2 border-slate-900 flex flex-col items-center justify-center">
            {/* Top red half reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />
            
            {/* Center black band & button */}
            <div className="w-full h-3.5 bg-slate-950 border-y border-yellow-400/60 flex items-center justify-center relative z-20">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-900 shadow-md flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-400 to-white border border-slate-700 animate-pulse" />
              </div>
            </div>

            {/* Bottom dark half */}
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950" />
          </div>
        </div>

        {/* Bottom Upside-Down Pokémon Logo */}
        <div className="relative z-10 pb-2 rotate-180 flex flex-col items-center">
          <span className="font-black text-2xl tracking-wider text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_#1e3a8a,_-2px_-2px_0_#1e3a8a,_2px_-2px_0_#1e3a8a,_-2px_2px_0_#1e3a8a,0_4px_8px_rgba(0,0,0,0.6)] font-sans uppercase">
            POKÉMON
          </span>
        </div>
      </div>
    );
  }

  const frontImage = imageUrl;

  // FRONT SIDE RENDERING (Authentic Pikachu V / High-End TCG Style)
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-[280px] h-[390px] sm:w-[300px] sm:h-[420px] rounded-[18px] overflow-hidden shadow-2xl select-none cursor-pointer font-sans text-slate-900 border-[5px] ${
        frontImage ? 'border-transparent p-0 bg-black/20' :
        isPokemon ? 'border-amber-300 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-300 p-2' :
        isSports ? 'border-cyan-400 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-2 text-white' :
        'border-amber-700 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-2 text-stone-100'
      } ${className}`}
      style={transformStyle}
    >
      {/* Holographic / Shiny Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge transition-opacity duration-300"
        style={shineStyle}
      />
      
      {frontImage ? (
        <img src={frontImage} alt={title} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
      ) : (
        <>
          {/* Rainbow Foil Sheen Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.3),transparent_60%)] pointer-events-none z-20 opacity-80" />

          {/* POKEMON FRONT LAYOUT (Pikachu V Style) */}
          {isPokemon && (
        <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-200 rounded-xl p-2.5 border border-amber-400/80 shadow-inner relative justify-between">
          
          {/* Top Banner Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 rounded-t-lg px-2 py-1 border-b-2 border-amber-500 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-900 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                BASIC
              </span>
              <span className="font-black text-sm tracking-tight text-slate-900 font-display drop-shadow-xs">
                {title} V
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase text-slate-800">HP</span>
              <span className="text-base font-black text-red-600 tracking-tighter">190</span>
              <div className="w-4 h-4 rounded-full bg-yellow-400 border border-amber-600 text-amber-950 flex items-center justify-center text-[9px] shadow-sm font-bold">
                ⚡
              </div>
            </div>
          </div>

          {/* Subheader / Evolves note */}
          <div className="flex justify-between items-center px-1 py-0.5 bg-amber-200/50 text-[8px] font-mono text-slate-700 border-b border-amber-300">
            <span>Evolves from Pikachu</span>
            <span className="font-bold">{year} Edition</span>
          </div>

          {/* Artwork Window */}
          <div className={`my-1.5 flex-1 rounded-lg bg-gradient-to-br ${imageBg} relative overflow-hidden border-4 border-amber-400 shadow-inner flex flex-col items-center justify-center p-4 text-center`}>
            {/* Background lighting / electric sparks effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_70%)] animate-pulse" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.6)_50%,transparent_60%)] animate-shimmer" />

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-4xl shadow-2xl backdrop-blur-md">
                ⚡🐭
              </div>
              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/50 shadow-lg">
                <span className="font-mono text-[10px] font-bold text-amber-200 tracking-wider uppercase">{artwork}</span>
              </div>
            </div>

            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-amber-100 font-bold drop-shadow">
              VCA Ultra Rare Holo
            </div>
          </div>

          {/* Attacks Box */}
          <div className="bg-amber-50/95 rounded-lg p-2 border border-amber-300 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⚡</span>
                <span className="font-bold text-xs text-slate-900">Charge</span>
              </div>
              <span className="font-black text-xs text-slate-900">20</span>
            </div>
            <div className="flex items-center justify-between border-b border-amber-200 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⚡⚡⚪</span>
                <span className="font-bold text-xs text-slate-900">Thunderbolt</span>
              </div>
              <span className="font-black text-xs text-red-600">200</span>
            </div>
            <p className="text-[8px] text-slate-600 leading-tight">
              Discard all Energy attached to this Pokémon. V rule: Opponent takes 2 Prize cards when Pokémon V is knocked out.
            </p>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center px-1 text-[8px] font-mono font-bold text-slate-600 border-t border-amber-300 pt-1">
            <span>illus. PLANETA Touji</span>
            <span>SET: {set}</span>
            <span>SWSH061 ©2026</span>
          </div>

        </div>
      )}

      {/* SPORTS CARD FRONT LAYOUT */}
      {isSports && (
        <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-xl p-2.5 border border-cyan-400/80 shadow-inner relative justify-between text-white">
          <div className="flex justify-between items-center border-b border-cyan-500/40 pb-1.5">
            <span className="bg-cyan-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded uppercase">ROOKIE CARD</span>
            <span className="font-mono text-[10px] text-cyan-400 font-bold">{year}</span>
          </div>

          <div className="px-1">
            <h3 className="font-black text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 font-display">
              {title}
            </h3>
            <div className="text-[9px] text-cyan-400 font-mono">{set} • VCA Graded {grade}</div>
          </div>

          <div className={`my-1.5 flex-1 rounded-lg bg-gradient-to-br ${imageBg} relative overflow-hidden border-2 border-cyan-400/60 shadow-inner flex flex-col items-center justify-center p-4 text-center`}>
            <div className="w-20 h-20 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-xl backdrop-blur-md">
              🏆
            </div>
            <span className="font-mono text-[10px] text-cyan-200 mt-2 bg-black/60 px-3 py-1 rounded border border-cyan-500/40">
              {artwork}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-900/90 rounded-lg p-1.5 border border-cyan-500/30 text-center font-mono text-[9px]">
            <div><div className="text-slate-400">AVG</div><div className="font-bold text-cyan-400">.342</div></div>
            <div className="border-x border-cyan-500/20"><div className="text-slate-400">HR</div><div className="font-bold text-cyan-400">48</div></div>
            <div><div className="text-slate-400">WAR</div><div className="font-bold text-cyan-400">11.2</div></div>
          </div>

          <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 border-t border-slate-800 pt-1">
            <span>VCA SECURE AUTH</span>
            <span>SN: 2026-VCA-PROD</span>
          </div>
        </div>
      )}

      {/* OTHER TCG FRONT LAYOUT */}
      {!isPokemon && !isSports && (
        <div className="h-full flex flex-col bg-gradient-to-b from-stone-900 via-zinc-900 to-black rounded-xl p-2.5 border border-amber-600/50 shadow-inner relative justify-between text-stone-100">
          <div className="flex justify-between items-center border-b border-amber-600/30 pb-1.5">
            <span className="font-display font-bold text-xs text-amber-400">{title}</span>
            <span className="font-mono text-[10px] text-amber-200">{category}</span>
          </div>

          <div className="my-2 flex-1 rounded-lg bg-gradient-to-br ${imageBg} relative overflow-hidden border-2 border-amber-500/60 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-black/40 border border-amber-400/50 flex items-center justify-center text-3xl shadow-xl">
              ✨
            </div>
            <span className="font-mono text-[10px] text-amber-200 mt-2 bg-black/60 px-3 py-1 rounded border border-amber-500/30">
              {artwork}
            </span>
          </div>

          <div className="bg-stone-950/80 rounded-lg p-2 border border-amber-700/40 text-[9px] text-stone-300 font-mono leading-tight">
            Legendary Artifact. Encapsulated in optical-grade VCA tamperproof casing with NFC UID verification.
          </div>

          <div className="flex justify-between items-center text-[8px] font-mono text-amber-500/80 border-t border-stone-800 pt-1">
            <span>VCA GRADE: {grade}</span>
            <span>AUTHENTICATED</span>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
