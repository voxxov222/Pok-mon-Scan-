import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ShieldCheck, X, CheckCircle2, Loader2 } from 'lucide-react';

interface NfcSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NfcSimulationModal({ isOpen, onClose }: NfcSimulationModalProps) {
  const [step, setStep] = useState<'scanning' | 'handshake' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setStep('scanning');
      const t1 = setTimeout(() => setStep('handshake'), 1500);
      const t2 = setTimeout(() => setStep('success'), 3200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        className="relative bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-md w-full z-10 shadow-2xl text-center space-y-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">NFC Hardware Simulator</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'scanning' && (
          <div className="py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse">
              <Radio className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">Approaching NFC Slab...</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">Reading NTAG 424 DNA Secure Element</p>
            </div>
          </div>
        )}

        {step === 'handshake' && (
          <div className="py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">Cryptographic Handshake...</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">Verifying SHA-256 Signature & Tamper Loop</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">NFC Verification Passed!</h3>
              <p className="text-xs font-mono text-emerald-400 mt-1">Slab VCA-882194 is 100% Authentic & Secure</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
