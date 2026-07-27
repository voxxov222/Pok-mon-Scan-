import { motion } from 'motion/react';
import { ScanSearch, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import GradedSlab from './GradedSlab';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden" id="authentication">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase">Active Verification Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl"
          >
            The Global Standard for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Card Authentication
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
          >
            Verified Card Authority (VCA) utilizes advanced cryptographic grading and real-time ledger verification to ensure the absolute integrity of high-value collector items.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
          >
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              Submit for Verification
            </button>
            <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 rounded-xl font-semibold transition-all w-full sm:w-auto">
              View Verified Ledger
            </button>
          </motion.div>
        </div>
        
        <div className="flex-1 flex justify-center lg:justify-end perspective-1000 mt-12 lg:mt-0 relative h-[640px] w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -100, rotateZ: -12, rotateY: -15, scale: 0.9 }}
            animate={{ opacity: 1, x: -60, rotateZ: -12, rotateY: -15, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="absolute left-0 lg:right-32 lg:left-auto top-10 z-0 origin-bottom-left"
          >
            <GradedSlab 
              cardImageUrl="https://images.unsplash.com/photo-1508344928928-7137b29de216?q=80&w=340&h=480&auto=format&fit=crop" 
              cardName="ROOKIE PROSPECT"
              cardSet="2024 ELITE BASEBALL"
              cardNumber="#57"
              grade="PRISTINE"
              gradeNumber="10"
              certId="VCA-5519-2MK"
              type="sports"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 100, rotateZ: 8, rotateY: 15 }}
            animate={{ opacity: 1, x: 20, rotateZ: 8, rotateY: 15 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="absolute right-0 lg:-right-10 top-0 z-10 origin-bottom-right"
          >
            <GradedSlab 
              cardImageUrl="https://images.pokemontcg.io/swsh4/43_hires.png" 
              cardName="Pikachu V - Holo"
              cardSet="2021 POKEMON SWSH"
              cardNumber="061/185"
              grade="GEM MINT"
              gradeNumber="10"
              certId="VCA-9284-77X"
              type="pokemon"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
