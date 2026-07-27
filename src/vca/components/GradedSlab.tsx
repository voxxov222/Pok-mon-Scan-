import React from 'react';
import GeneratedTradingCard from './GeneratedTradingCard';
import { ShieldCheck, QrCode } from 'lucide-react';

interface GradedSlabProps {
  cardImageUrl?: string;
  cardName: string;
  cardSet: string;
  cardNumber: string;
  grade: string;
  gradeNumber: string | number;
  certId: string;
  type: 'pokemon' | 'sports';
  className?: string;
  year?: number;
  artwork?: string;
  side?: 'front' | 'back';
}

export default function GradedSlab({ 
  cardImageUrl, 
  cardName, 
  cardSet, 
  cardNumber, 
  grade, 
  gradeNumber, 
  certId, 
  type, 
  className = '',
  year = 1999,
  artwork = type === 'pokemon' ? '🔥 Pikachu V Electric' : '🏆 MVP Rookie',
  side = 'front'
}: GradedSlabProps) {
  return (
    <div className={`relative w-[340px] sm:w-[380px] h-[580px] sm:h-[640px] bg-slate-200/5 border-[6px] sm:border-8 border-white/10 rounded-[28px] sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] flex flex-col items-center gap-3 sm:gap-4 group ${className}`}>
      
      {/* Glare/reflection on the plastic case */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
      <div className="absolute inset-0 shadow-[inset_0_0_2px_rgba(255,255,255,0.4)] rounded-2xl pointer-events-none" />

      {/* Label Area */}
      <div className="w-full bg-gradient-to-b from-slate-100 to-slate-200 rounded-xl p-3 pb-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-slate-300 relative overflow-hidden text-slate-900 flex flex-col z-10">
        
        {/* Holographic foil effect on label background */}
        <div className="absolute inset-0 bg-[url('https://simeydotme.github.io/PokemonCards/assets/img/foils/holo.webp')] opacity-10 mix-blend-color-dodge pointer-events-none" />
        
        <div className="flex justify-between items-start border-b border-slate-300 pb-1.5 mb-1.5 relative">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-cyan-700" />
            <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-slate-900">VERIFIED CARD AUTHORITY</span>
          </div>
          <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800" />
        </div>

        <div className="flex justify-between items-stretch relative">
          <div className="flex-1 pr-2">
            <div className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 leading-tight">{cardSet}</div>
            <div className="font-black text-sm sm:text-lg leading-tight text-slate-900 mt-0.5">{cardName}</div>
            <div className="font-semibold text-[9px] sm:text-[10px] text-slate-600 mt-1">{type === 'pokemon' ? `CARD #${cardNumber}` : cardNumber}</div>
          </div>
          <div className="flex flex-col items-center justify-center border-l-2 border-slate-300 pl-2 min-w-[60px] sm:min-w-[70px]">
            <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase text-center leading-none mb-1">{grade}</div>
            <div className="text-2xl sm:text-4xl font-black text-slate-900 leading-none tracking-tighter">{gradeNumber}</div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2 pt-1 border-t border-slate-300 relative">
           <div className="font-mono text-[9px] sm:text-[10px] font-bold text-slate-700 tracking-wider">{certId}</div>
           {/* Fake Barcode */}
           <div className="flex items-end gap-[1px] h-3 sm:h-4 opacity-80">
              <div className="w-[1px] sm:w-[2px] h-full bg-slate-900"></div>
              <div className="w-[1px] h-2 sm:h-3 bg-slate-900"></div>
              <div className="w-[2px] sm:w-[3px] h-full bg-slate-900"></div>
              <div className="w-[1px] h-full bg-slate-900"></div>
              <div className="w-[1px] sm:w-[2px] h-2 sm:h-3 bg-slate-900"></div>
              <div className="w-[1px] h-full bg-slate-900"></div>
              <div className="w-[1px] sm:w-[2px] h-full bg-slate-900"></div>
              <div className="w-[1px] h-2 sm:h-3 bg-slate-900"></div>
              <div className="w-[2px] sm:w-[3px] h-full bg-slate-900"></div>
              <div className="w-[1px] h-full bg-slate-900"></div>
              <div className="w-[1px] sm:w-[2px] h-2 sm:h-3 bg-slate-900"></div>
              <div className="w-[1px] h-full bg-slate-900"></div>
           </div>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 w-full bg-black/60 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden shadow-inner">
         {/* Inner bumper/rails holding the card */}
         <div className="absolute inset-2 sm:inset-3 border-2 border-white/5 rounded-lg pointer-events-none" />
         <div className="absolute inset-3 sm:inset-4 border border-white/5 rounded-lg pointer-events-none" />
         
         <div className="transform scale-[0.85] sm:scale-[0.95] flex items-center justify-center">
           <GeneratedTradingCard 
             title={cardName}
             set={cardSet}
             year={year}
             category={type === 'pokemon' ? 'Pokemon' : 'Sports'}
             grade={grade}
             artwork={artwork}
             side={side}
             imageUrl={cardImageUrl}
           />
         </div>
      </div>
    </div>
  );
}
