import React, { useState } from 'react';
import { QrCode, ShieldCheck, Radio, Search, CheckCircle2 } from 'lucide-react';
import { mockCards } from '../data/mockData';
import { CardItem } from '../types';

interface TrackVerifyViewProps {
  onOpenCertificate: (card: CardItem) => void;
}

export default function TrackVerifyView({ onOpenCertificate }: TrackVerifyViewProps) {
  const [serialInput, setSerialInput] = useState('');
  const [searchedCard, setSearchedCard] = useState<CardItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = mockCards.find(c => c.id.toLowerCase().includes(serialInput.toLowerCase()) || c.title.toLowerCase().includes(serialInput.toLowerCase()));
    setSearchedCard(found || null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-3xl mx-auto">
      
      <div className="text-center">
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Public Authentication Portal
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">Track & Verify Slab</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Verify the immutable grading record, NFC chip status, and certification authenticity of any VCA-slabbed collectible.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <form onSubmit={handleVerify} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Enter VCA Serial (e.g. VCA-882194) or Card Name..."
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 cursor-pointer"
          >
            Verify Record
          </button>
        </form>

        {hasSearched && (
          <div className="pt-6 border-t border-slate-800">
            {searchedCard ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold">{searchedCard.id}</span>
                    <h3 className="text-xl font-display font-bold text-white mt-1">{searchedCard.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{searchedCard.set} ({searchedCard.year})</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                    {searchedCard.grade}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs bg-slate-900/60 p-4 rounded-xl">
                  <div>
                    <div className="text-slate-500">NFC Status</div>
                    <div className="text-cyan-400 font-bold mt-1 flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      {searchedCard.nfcStatus}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Tamper Seal</div>
                    <div className="text-emerald-400 font-bold mt-1">SECURE</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Centering</div>
                    <div className="text-white font-bold mt-1">{searchedCard.subgrades.centering} / 10</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Surface</div>
                    <div className="text-white font-bold mt-1">{searchedCard.subgrades.surface} / 10</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onOpenCertificate(searchedCard)}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Official Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-display font-bold text-white">No Record Found</h4>
                <p className="text-xs text-slate-400 font-mono">No matching VCA serial number was found in the global verification ledger.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
