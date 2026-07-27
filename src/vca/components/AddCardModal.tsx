import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CardItem } from '../types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CardItem) => void;
}

export default function AddCardModal({ isOpen, onClose, onAddCard }: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [set, setSet] = useState('');
  const [category, setCategory] = useState<'Pokemon' | 'Sports' | 'Magic: The Gathering' | 'Yu-Gi-Oh!' | 'One Piece' | 'Lorcana'>('Pokemon');
  const [grade, setGrade] = useState('10 GEM MINT');
  const [value, setValue] = useState('5000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: CardItem = {
      id: `VCA-${Math.floor(100000 + Math.random() * 900000)}`,
      title: title || 'Custom Graded Collectible',
      set: set || 'Base Edition',
      year: 2024,
      category,
      grade,
      score: 10,
      condition: 'Gem Mint',
      nfcStatus: 'ACTIVE',
      tamperStatus: 'SECURE',
      authStatus: 'PASSED',
      owner: 'Todd William',
      lastScan: '24 JUL 2026',
      estimatedValue: Number(value) || 5000,
      valueChange30d: 5.0,
      imageBg: 'from-blue-600 via-indigo-700 to-slate-900',
      artwork: '✨ Collector Slab',
      subgrades: { centering: 10, corners: 10, edges: 10, surface: 10 },
      history: [
        { date: '24 JUL 2026 — 14:00', event: 'Added to Vault Portfolio', status: 'verified' }
      ]
    };
    onAddCard(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full z-10 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 className="text-lg font-display font-bold text-white">Add Collectible to Portfolio</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase">Collectible Title</label>
            <input type="text" required placeholder="e.g. 2000 Pokémon Neo Genesis Lugia" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase">Set Name</label>
            <input type="text" required placeholder="e.g. Neo Genesis 1st Edition" value={set} onChange={(e) => setSet(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500">
              <option value="Pokemon">Pokemon</option>
              <option value="Sports">Sports</option>
              <option value="Magic: The Gathering">Magic: The Gathering</option>
              <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
              <option value="One Piece">One Piece</option>
              <option value="Lorcana">Lorcana</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">VCA Grade</label>
              <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">Value (CAD)</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-900 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Add to Vault</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
