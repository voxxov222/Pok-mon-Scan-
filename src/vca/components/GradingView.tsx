import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Upload, Radio, ArrowRight, Package } from 'lucide-react';

export default function GradingView() {
  const [step, setStep] = useState<number>(1);
  const [tier, setTier] = useState<'standard' | 'express' | 'vault'>('standard');
  const [itemType, setItemType] = useState('Pokemon / TCG');
  const [itemTitle, setItemTitle] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center">
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Professional Authentication & Slab Encapsulation
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">VCA Grading Laboratory</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Submit your high-value collectible for dual-authenticator grading and embedded NFC microchip encapsulation.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-8">
          
          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-6">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-cyan-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-xl font-mono font-bold flex items-center justify-center border ${step >= 1 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-950'}`}>1</div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Service Tier</span>
            </div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-cyan-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-xl font-mono font-bold flex items-center justify-center border ${step >= 2 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-950'}`}>2</div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Item Details</span>
            </div>
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-cyan-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-xl font-mono font-bold flex items-center justify-center border ${step >= 3 ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-800 bg-slate-950'}`}>3</div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Secure Dispatch</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold text-white">Select Authentication & Grading Tier</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setTier('standard')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    tier === 'standard' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold uppercase">Standard Vault</span>
                    <h4 className="text-xl font-display font-black text-white mt-2">$150 <span className="text-xs font-normal text-slate-400 font-mono">/ card</span></h4>
                    <p className="text-xs text-slate-400 mt-2">10-14 business days turnaround with NFC cryptographic chip encapsulation.</p>
                  </div>
                  <div className="mt-6 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Dual Grader Audit</span>
                  </div>
                </div>

                <div 
                  onClick={() => setTier('express')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    tier === 'express' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold uppercase">Express Priority</span>
                    <h4 className="text-xl font-display font-black text-white mt-2">$350 <span className="text-xs font-normal text-slate-400 font-mono">/ card</span></h4>
                    <p className="text-xs text-slate-400 mt-2">3-5 business days rush laboratory turnaround with armored secure return shipping.</p>
                  </div>
                  <div className="mt-6 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Priority Laser Scan</span>
                  </div>
                </div>

                <div 
                  onClick={() => setTier('vault')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    tier === 'vault' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold uppercase">Master Vault</span>
                    <h4 className="text-xl font-display font-black text-white mt-2">$750 <span className="text-xs font-normal text-slate-400 font-mono">/ card</span></h4>
                    <p className="text-xs text-slate-400 mt-2">White-glove armored courier pickup, 48-hour lab audit, and permanent vault storage.</p>
                  </div>
                  <div className="mt-6 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Armored Courier</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Item Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold text-white">Collectible Item Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase">Collectible Category</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option>Pokemon / TCG</option>
                    <option>Sports (Baseball / Basketball / Football)</option>
                    <option>Magic: The Gathering</option>
                    <option>Yu-Gi-Oh!</option>
                    <option>One Piece / Lorcana</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase">Item Title & Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 1999 Charizard Holo #4"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase">Declared Insurance Value (CAD)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase">NFC Microchip Encapsulation</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="flex items-center gap-2"><Radio className="w-4 h-4 animate-pulse" /> NTAG 424 DNA Included</span>
                    <span className="text-slate-400">Standard Feature</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <h3 className="text-lg font-display font-bold text-white">Review & Submit Grading Order</h3>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Service Tier:</span>
                  <span className="text-white font-bold uppercase">{tier} Vault</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Category & Item:</span>
                  <span className="text-cyan-400 font-bold">{itemType} — {itemTitle || 'Charizard Holo'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-500">Declared Insurance Value:</span>
                  <span className="text-white font-bold">${declaredValue || '12,500'} CAD</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">NFC Tamper-Seal Chip:</span>
                  <span className="text-emerald-400 font-bold">Activated (Included)</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  type="button"
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
                  id="btn-submit-grading"
                >
                  Confirm & Generate Submission ID
                </button>
              </div>
            </form>
          )}

        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-display font-black text-white">Grading Submission Received!</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your submission tracking ID is <span className="font-mono text-cyan-400 font-bold">VCA-SUB-994182</span>. Please package your item in a top-loader and ship via insured courier to VCA Primary Laboratory.
          </p>

          <div className="pt-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-850 text-cyan-400 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Submit Another Collectible
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
