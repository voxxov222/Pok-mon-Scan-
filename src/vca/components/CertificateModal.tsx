import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, QrCode, Radio, Download } from 'lucide-react';
import { CardItem } from '../types';

interface CertificateModalProps {
  card: CardItem | null;
  onClose: () => void;
}

export default function CertificateModal({ card, onClose }: CertificateModalProps) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full z-10 shadow-2xl space-y-6 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Official Certificate of Authentication</h3>
              <p className="text-xs font-mono text-cyan-400">VCA CERTIFICATION #{card.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 relative z-10 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <div className="text-slate-500">Collectible Item</div>
              <div className="text-white font-bold font-sans text-base mt-1">{card.title}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Official Grade</div>
              <div className="text-emerald-400 font-bold text-lg">{card.grade}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500">Centering:</span> <strong className="text-white">{card.subgrades.centering} / 10</strong>
            </div>
            <div>
              <span className="text-slate-500">Corners:</span> <strong className="text-white">{card.subgrades.corners} / 10</strong>
            </div>
            <div>
              <span className="text-slate-500">Edges:</span> <strong className="text-white">{card.subgrades.edges} / 10</strong>
            </div>
            <div>
              <span className="text-slate-500">Surface:</span> <strong className="text-white">{card.subgrades.surface} / 10</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>NFC Microchip UID: 0x44F991B</span>
            </div>
            <div className="text-slate-500">Verified: {card.lastScan}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 relative z-10 pt-2">
          <button
            onClick={() => alert('Certificate PDF downloaded successfully.')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold rounded-xl border border-slate-800 flex items-center gap-2 cursor-pointer text-xs"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
