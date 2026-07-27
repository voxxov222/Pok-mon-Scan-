import React from 'react';
import { motion } from 'motion/react';

export default function InteractiveModels() {
  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden" id="interactive-models">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
            3D Spatial Assets
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
            Interactive VCA Scans
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Explore our tamper-proof secure slabs and graded assets in full 3D spatial view.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Model 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_30px_rgba(34,211,238,0.05)] bg-slate-900/30"
          >
            <div className="lkg-blocks-player" style={{ padding: '216.667% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://blocks.glass/embed/e059f7c3-5b7c-44b5-bb5a-d4b9727aeaca" 
                frameBorder="0" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                allow="autoplay; encrypted-media; xr-spatial-tracking; accelerometer; gyroscope; magnetometer" 
                allowFullScreen 
                mozallowfullscreen="true" 
                webkitallowfullscreen="true" 
                execution-while-out-of-viewport="true" 
                execution-while-not-rendered="true"
              ></iframe>
            </div>
            {/* Decorative overlay lines */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none mix-blend-overlay"></div>
          </motion.div>

          {/* Model 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_30px_rgba(34,211,238,0.05)] bg-slate-900/30"
          >
            <div className="lkg-blocks-player" style={{ padding: '165.741% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://blocks.glass/embed/e3a4a125-2d0e-476d-b61a-f1aa39f6a6f2" 
                frameBorder="0" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                allow="autoplay; encrypted-media; xr-spatial-tracking; accelerometer; gyroscope; magnetometer" 
                allowFullScreen 
                mozallowfullscreen="true" 
                webkitallowfullscreen="true" 
                execution-while-out-of-viewport="true" 
                execution-while-not-rendered="true"
              ></iframe>
            </div>
            {/* Decorative overlay lines */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none mix-blend-overlay"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

