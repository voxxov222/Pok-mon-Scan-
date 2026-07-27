import React from 'react';
import { motion } from 'motion/react';
import infographicImg from '../assets/images/vca_slab_new_1784695503544.jpg';

export default function Infographic() {
  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden" id="infographic">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
            Unbreachable Design
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
            Tamper-Proof Slab Architecture
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            A visual breakdown of the world's first Active NFC Cryptographic Seal and how it guarantees collectible integrity.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(34,211,238,0.1)] bg-slate-900/50"
        >
          <img 
            src={infographicImg} 
            alt="VCA: The Future of Card Security Infographic" 
            className="w-full h-auto object-cover"
          />
          {/* Decorative overlay lines */}
          <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none mix-blend-overlay"></div>
        </motion.div>
      </div>
    </section>
  );
}
