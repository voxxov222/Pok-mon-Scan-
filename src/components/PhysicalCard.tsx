import React, { useState } from 'react';
import { CardData, EnergyType } from '../types';
import { Award, ExternalLink, RefreshCw, Zap } from 'lucide-react';

interface PhysicalCardProps {
  card: CardData;
  onClick?: () => void;
  showGradeBadge?: boolean;
  key?: string | number;
}

const energyColors: Record<EnergyType, { bg: string; text: string; border: string }> = {
  Fire: { bg: 'bg-[var(--color-energy-fire)]/20', text: 'text-[var(--color-energy-fire)]', border: 'border-[var(--color-energy-fire)]/40' },
  Water: { bg: 'bg-[var(--color-energy-water)]/20', text: 'text-[var(--color-energy-water)]', border: 'border-[var(--color-energy-water)]/40' },
  Grass: { bg: 'bg-[var(--color-energy-grass)]/20', text: 'text-[var(--color-energy-grass)]', border: 'border-[var(--color-energy-grass)]/40' },
  Lightning: { bg: 'bg-[var(--color-energy-lightning)]/20', text: 'text-[var(--color-energy-lightning)]', border: 'border-[var(--color-energy-lightning)]/40' },
  Psychic: { bg: 'bg-[var(--color-energy-psychic)]/20', text: 'text-[var(--color-energy-psychic)]', border: 'border-[var(--color-energy-psychic)]/40' },
  Fighting: { bg: 'bg-[var(--color-energy-fighting)]/20', text: 'text-[var(--color-energy-fighting)]', border: 'border-[var(--color-energy-fighting)]/40' },
  Darkness: { bg: 'bg-[var(--color-energy-darkness)]/20', text: 'text-[var(--color-energy-darkness)]', border: 'border-[var(--color-energy-darkness)]/40' },
  Metal: { bg: 'bg-[var(--color-energy-metal)]/20', text: 'text-[var(--color-energy-metal)]', border: 'border-[var(--color-energy-metal)]/40' },
  Dragon: { bg: 'bg-[var(--color-energy-dragon)]/20', text: 'text-[var(--color-energy-dragon)]', border: 'border-[var(--color-energy-dragon)]/40' },
  Colorless: { bg: 'bg-[var(--color-energy-colorless)]/20', text: 'text-[var(--color-energy-colorless)]', border: 'border-[var(--color-energy-colorless)]/40' }
};

const getGradeColor = (grade: number) => {
  if (grade >= 9.5) return { stroke: 'stroke-amber-400', fill: 'text-amber-400', bg: 'text-amber-400/20' }; // Gold
  if (grade >= 8.0) return { stroke: 'stroke-gray-300', fill: 'text-gray-300', bg: 'text-gray-300/20' };   // Silver
  if (grade >= 6.0) return { stroke: 'stroke-orange-500', fill: 'text-orange-500', bg: 'text-orange-500/20' }; // Bronze
  return { stroke: 'stroke-red-500', fill: 'text-red-500', bg: 'text-red-500/20' }; // Red
};

export function PhysicalCard({ card, onClick, showGradeBadge = true }: PhysicalCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cssVars, setCssVars] = useState<React.CSSProperties>({});

  const isShiny = (card.rarity || "").toLowerCase().includes('shiny') || (card.name || "").toLowerCase().includes('shiny');
  const isHolo = (card.rarity || "").toLowerCase().includes('holo') || 
                (card.rarity || "").toLowerCase().includes('secret') || 
                (card.rarity || "").toLowerCase().includes('ultra') || 
                (card.rarity || "").toLowerCase().includes('rare') || 
                isShiny ||
                (card.estimatedGrade && card.estimatedGrade >= 9);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -15; // Max 15deg
    const rotY = ((x - centerX) / centerX) * 15;
    
    setRotateX(rotX);
    setRotateY(rotY);

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    
    setCssVars({
      '--pointer-x': `${px}%`,
      '--pointer-y': `${py}%`,
      '--pointer-from-left': (x / rect.width).toString(),
      '--pointer-from-top': (y / rect.height).toString(),
    } as React.CSSProperties);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
    setCssVars({});
  };

  const energyStyle = card.energyType && energyColors[card.energyType] 
    ? energyColors[card.energyType] 
    : energyColors.Colorless;

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
        ...cssVars
      }}
      className={`relative group bg-[#12121a] border border-white/10 rounded-2xl p-4 flex flex-col justify-between cursor-pointer holo-card-effect overflow-hidden min-h-[220px] ${isHolo ? 'is-holo' : ''} ${isShiny ? 'is-shiny' : ''}`}
    >
      {/* Glare and Foil Overlays */}
      <div className="card-glare" />
      {isHolo && <div className="card-foil" />}

      {/* Top Header Row */}
      <div className="relative flex justify-between items-start gap-2 z-10">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${energyStyle.bg} ${energyStyle.text} ${energyStyle.border}`}>
              {card.energyType || 'Colorless'}
            </span>
            {card.isForTrade && (
              <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                For Trade
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-white truncate group-hover:text-primary transition-colors">
            {card.name}
          </h3>
          <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest truncate">
            {card.set} • #{card.cardNumber}
          </p>
        </div>

        {/* Grade Score Badge (Progress Ring) */}
        {showGradeBadge && card.estimatedGrade && (
          <div className="flex-shrink-0 flex flex-col items-center justify-center relative w-11 h-11 -mt-1 -mr-1 drop-shadow-md">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`${getGradeColor(card.estimatedGrade).bg} stroke-current`}
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`${getGradeColor(card.estimatedGrade).stroke}`}
                strokeWidth="2.5"
                strokeDasharray="100"
                strokeDashoffset={100 - (card.estimatedGrade / 10) * 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
               <span className={`text-[6px] uppercase tracking-widest font-black ${getGradeColor(card.estimatedGrade).fill} leading-none mb-0.5`}>AI</span>
               <span className={`text-xs font-black ${getGradeColor(card.estimatedGrade).fill} font-mono leading-none`}>{card.estimatedGrade.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Middle Card Art Thumbnail & Rarity Badge */}
      <div className="relative my-3 flex gap-3 items-center z-10">
        <div className="w-16 h-20 bg-black/60 rounded-xl border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary/30 to-purple-600/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="mb-1">
            <span className={`inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${isShiny ? 'bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 text-black border-transparent shadow-[0_0_10px_rgba(255,203,5,0.5)]' : `${energyStyle.bg} ${energyStyle.text} ${energyStyle.border}`}`}>
              {isShiny && <Zap className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5 animate-pulse" />}
              {card.rarity || 'Common'}
            </span>
          </div>
          {card.condition && (
            <div className="text-[10px] text-white/60">
              <span className="font-bold text-white/80">Condition:</span> {card.condition}
            </div>
          )}
          {card.subGrades && (
            <div className="grid grid-cols-2 gap-1 pt-1 text-[9px] text-white/50 font-mono">
              <div>Cen: <span className="text-white font-bold">{card.subGrades.centering.score}</span></div>
              <div>Edg: <span className="text-white font-bold">{card.subGrades.edges.score}</span></div>
              <div>Surf: <span className="text-white font-bold">{card.subGrades.surface.score}</span></div>
              <div>Corn: <span className="text-white font-bold">{card.subGrades.corners.score}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pricing Row */}
      <div className="relative pt-2 border-t border-white/10 flex justify-between items-center z-10 font-mono">
        <div>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-sans font-bold block">Top Market</span>
          <span className="text-lg font-bold text-primary">${card.highPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-sans font-bold block">Floor Low</span>
          <span className="text-xs text-white/70">${card.lowPrice?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  );
}
