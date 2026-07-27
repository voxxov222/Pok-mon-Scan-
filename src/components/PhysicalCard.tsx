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

export function PhysicalCard({ card, onClick, showGradeBadge = true }: PhysicalCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const isHolo = card.rarity?.toLowerCase().includes('holo') || 
                card.rarity?.toLowerCase().includes('secret') || 
                card.rarity?.toLowerCase().includes('ultra') || 
                card.rarity?.toLowerCase().includes('rare') || 
                (card.estimatedGrade && card.estimatedGrade >= 9);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const energyStyle = card.energyType && energyColors[card.energyType] 
    ? energyColors[card.energyType] 
    : energyColors.Colorless;

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: rotateX === 0 ? 'transform 0.5s ease' : 'none'
      }}
      className={`relative group bg-[#12121a] border border-white/10 rounded-2xl p-4 flex flex-col justify-between cursor-pointer holo-card-effect transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden min-h-[220px]`}
    >
      {/* Foil Shimmer Overlay for Holo Cards */}
      {isHolo && <div className="foil-overlay" />}

      {/* Top Header Row */}
      <div className="flex justify-between items-start gap-2 z-10">
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

        {/* Grade Score Badge */}
        {showGradeBadge && card.estimatedGrade && (
          <div className="flex-shrink-0 flex flex-col items-end">
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-xl px-2.5 py-1 text-center shadow-md">
              <span className="text-[8px] uppercase tracking-widest font-black text-amber-400 block leading-tight">AI GRADE</span>
              <span className="text-sm font-black text-amber-300 font-mono leading-none">{card.estimatedGrade.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Middle Card Art Thumbnail & Rarity Badge */}
      <div className="my-3 flex gap-3 items-center z-10">
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
          <div className="text-[10px] text-white/60">
            <span className="font-bold text-white/80">Rarity:</span> {card.rarity}
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
      <div className="pt-2 border-t border-white/10 flex justify-between items-center z-10 font-mono">
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
