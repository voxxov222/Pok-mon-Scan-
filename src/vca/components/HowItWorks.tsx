import { motion } from 'motion/react';
import { Camera, FileSearch, ShieldAlert, Cpu } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: '1. Secure Submission',
    description: 'Submit high-resolution images and metadata of your collector item through our encrypted portal.',
  },
  {
    icon: Cpu,
    title: '2. AI & Expert Analysis',
    description: 'Our proprietary AI scans for inconsistencies while senior authenticators perform micron-level visual inspection.',
  },
  {
    icon: FileSearch,
    title: '3. Provenance Verification',
    description: 'We cross-reference global ledgers and databases to establish a clear, immutable chain of custody.',
  },
  {
    icon: ShieldAlert,
    title: '4. Cryptographic Certification',
    description: 'Upon approval, your item is logged onto our public ledger and issued a tamper-proof digital certificate.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="services">
      {/* Decorative background lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full flex justify-between pointer-events-none opacity-20">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent hidden md:block"></div>
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent hidden lg:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Verification Protocol
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            A meticulous, multi-layered approach to authentication. We combine cutting-edge technology with decades of expert knowledge.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl h-full flex flex-col hover:border-cyan-500/30 transition-all z-10 relative backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-cyan-500/20">
                  <step.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
