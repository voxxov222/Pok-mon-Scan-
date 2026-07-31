import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendingCard {
  id: string;
  name: string;
  set: string;
  price: number;
  changePercent: number;
  isSpiking: boolean;
}

const MOCK_TRENDING: TrendingCard[] = [
  { id: '1', name: 'Charizard ex', set: 'Obsidian Flames', price: 112.50, changePercent: 14.5, isSpiking: true },
  { id: '2', name: 'Gengar VMAX (Alt Art)', set: 'Fusion Strike', price: 285.00, changePercent: 8.2, isSpiking: true },
  { id: '3', name: 'Umbreon VMAX', set: 'Evolving Skies', price: 650.00, changePercent: 5.1, isSpiking: true },
  { id: '4', name: 'Iono (SIR)', set: 'Paldea Evolved', price: 85.00, changePercent: -2.3, isSpiking: false },
];

export function TrendingCardsWidget() {
  return (
    <div className="bg-[#12121a] rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending Cards</h3>
            <p className="text-[9px] text-white/50 uppercase tracking-widest">Community Aggregate</p>
          </div>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {MOCK_TRENDING.map((card, i) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{card.name}</h4>
              <p className="text-[10px] text-white/40 truncate">{card.set}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-white">${card.price.toFixed(2)}</p>
              <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${card.isSpiking ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.isSpiking ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(card.changePercent)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
