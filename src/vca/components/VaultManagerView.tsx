import React from 'react';
import { ShieldAlert, ShieldCheck, Radio, Lock, Eye, ArrowRight } from 'lucide-react';
import { CardItem } from '../types';

interface VaultManagerViewProps {
  cards: CardItem[];
  onSelectCard: (card: CardItem) => void;
  onOpenCertificate: (card: CardItem) => void;
}

export default function VaultManagerView({ cards, onSelectCard, onOpenCertificate }: VaultManagerViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Secure Hardware Vault Node
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">Vault Manager</h2>
          <p className="text-slate-400 text-sm md:text-base">
            Continuous cryptographic tamper detection and physical NFC seal monitoring for stored graded slabs.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs text-slate-300">Vault Security: <strong className="text-emerald-400">ARMORED & SECURE</strong></span>
        </div>
      </div>

      {/* Vault Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">NFC Loop Sensors</span>
            <div className="text-xl font-display font-bold text-white mt-1">100% Intact</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Tamper Breaches</span>
            <div className="text-xl font-display font-bold text-emerald-400 mt-1">0 Detected</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Vault Location</span>
            <div className="text-xl font-display font-bold text-white mt-1">Primary Node #01</div>
          </div>
        </div>
      </div>

      {/* Vault Inventory Table */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-white">Vault Encapsulation Inventory</h3>
          <span className="text-xs font-mono text-cyan-400">{cards.length} Slabs Secured</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60">
              <th className="px-6 py-4">VCA Serial</th>
              <th className="px-6 py-4">Collectible Item</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">NFC Status</th>
              <th className="px-6 py-4">Tamper Seal</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {cards.map((card) => (
              <tr 
                key={card.id}
                onClick={() => onSelectCard(card)}
                className="hover:bg-slate-900/60 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-cyan-400 font-bold">{card.id}</td>
                <td className="px-6 py-4 font-sans font-semibold text-white">{card.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {card.grade}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    {card.nfcStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {card.tamperStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCertificate(card);
                    }}
                    className="px-3 py-1 bg-slate-950 text-cyan-400 rounded-lg border border-slate-800 hover:border-cyan-500/30"
                  >
                    View Record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
