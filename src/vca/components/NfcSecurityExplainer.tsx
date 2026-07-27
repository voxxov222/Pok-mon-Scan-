import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Smartphone, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  Unlock, 
  RefreshCw,
  Zap,
  Radio,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';

export default function NfcSecurityExplainer() {
  const [isTampered, setIsTampered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | 'secure' | 'compromised'>(null);
  const [scanCount, setScanCount] = useState(42);

  const handleNfcScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanCount(prev => prev + 1);
      setScanResult(isTampered ? 'compromised' : 'secure');
    }, 1800);
  };

  const toggleTamper = () => {
    setIsTampered(prev => {
      const newVal = !prev;
      setScanResult(null);
      return newVal;
    });
  };

  const handleReset = () => {
    setIsTampered(false);
    setIsScanning(false);
    setScanResult(null);
    setScanCount(42);
  };

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden" id="security-tech">
      {/* Background visual accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
            Tamper-Shield Security
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
            Active NFC Cryptographic Seal
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            VCA cases feature an industry-first passive NFC microchip connected to a perimeter closed-circuit thread. Explore how physical structural breaches trigger immediate digital verification invalidation.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Interactive Simulator (Column Left: 7/12 width) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Case Diagnostics</h3>
                  <p className="text-slate-400 text-xs">Simulate physical tampering or scan the embedded NFC transponder chip.</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono"
                  title="Reset Simulator"
                  id="btn-security-reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Lab Visual Container */}
              <div className="relative bg-slate-950 border border-slate-800/80 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden min-h-[380px]">
                
                {/* Visual scan pulse background */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: 0.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                      className="absolute w-40 h-40 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* 3D-Like Graded Case Wireframe Simulator */}
                <div className="relative w-56 h-80 flex flex-col justify-between items-center p-3 rounded-2xl border-4 transition-all duration-500 select-none shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-slate-900/80"
                  style={{
                    borderColor: isTampered ? '#ef444450' : '#22d3ee20',
                    boxShadow: isTampered 
                      ? '0 0 20px rgba(239, 68, 68, 0.15), inset 0 0 15px rgba(239, 68, 68, 0.05)'
                      : '0 0 30px rgba(34, 211, 238, 0.05), inset 0 0 15px rgba(234, 211, 238, 0.02)'
                  }}
                  id="simulated-case-body"
                >
                  {/* Top Grading Label */}
                  <div className="w-full bg-slate-100 rounded-lg p-2 flex justify-between items-center relative text-slate-900">
                    <div className="flex flex-col">
                      <span className="font-sans font-black text-[7px] leading-none tracking-tight">VERIFIED CARD AUTHORITY</span>
                      <span className="font-mono text-[6px] text-slate-500 font-bold mt-0.5">CERT #9284-77X</span>
                    </div>
                    {/* Micro NFC Chip Graphic embedded in Case lining */}
                    <div className="relative">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isTampered ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 animate-pulse'}`}>
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-slate-100" 
                        style={{ backgroundColor: isTampered ? '#ef4444' : '#22c55e' }}
                      />
                    </div>
                  </div>

                  {/* Card Display Area */}
                  <div className="flex-1 w-full mt-3 bg-slate-950 rounded-xl relative border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Continuous closed circuit tracing wire lining */}
                    <div className={`absolute inset-1.5 rounded-lg border-2 border-dashed transition-colors duration-500 pointer-events-none ${isTampered ? 'border-red-500/20' : 'border-cyan-500/30'}`} />
                    
                    {/* Physical break indicators if tampered */}
                    {isTampered && (
                      <div className="absolute inset-y-0 left-0 flex items-center justify-center w-full">
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse absolute" />
                        <div className="bg-red-950/90 border border-red-500/50 text-red-400 font-mono text-[8px] px-2 py-0.5 rounded-md z-20 font-bold tracking-wider uppercase animate-bounce">
                          Circuit Breached
                        </div>
                      </div>
                    )}

                    {/* VCA Watermark Hologram Label inside the case */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center select-none z-10 pointer-events-none">
                      <motion.div 
                        animate={{ 
                          filter: isTampered ? 'grayscale(1) brightness(0.1)' : 'grayscale(0) brightness(1)',
                        }}
                        transition={{ duration: 0.6 }}
                        className={`font-black text-4xl sm:text-5xl font-display tracking-widest text-center transition-all duration-700 ${
                          isTampered 
                            ? 'text-black opacity-90 drop-shadow-none' 
                            : 'text-cyan-400/25 bg-gradient-to-tr from-cyan-400/20 via-pink-400/20 to-blue-400/20 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse'
                        }`}
                      >
                        VCA
                      </motion.div>
                      <span className={`text-[7px] font-mono font-bold tracking-widest uppercase transition-colors duration-700 ${isTampered ? 'text-slate-800' : 'text-cyan-400/40'}`}>
                        {isTampered ? 'VOID SEAL' : 'SECURE HOLO'}
                      </span>
                    </div>

                    {/* Inner collectible wireframe card visual representation */}
                    <div className="w-24 h-32 border border-slate-800/40 rounded-lg bg-slate-900/40 p-2 flex flex-col justify-between opacity-30">
                      <div className="h-1.5 w-10 bg-slate-800 rounded" />
                      <div className="h-14 w-full bg-slate-850 rounded" />
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-850 rounded" />
                        <div className="h-1 w-2/3 bg-slate-850 rounded" />
                      </div>
                    </div>

                  </div>

                  {/* Tamper trigger latch controls (Visualizing physical separating borders) */}
                  <div className="w-full mt-3 flex justify-between items-center text-[8px] font-mono text-slate-500">
                    <span className="flex items-center gap-0.5"><Lock className="w-2 h-2 text-slate-500" /> Sonic Welded</span>
                    <span className="flex items-center gap-0.5"><Zap className="w-2 h-2 text-cyan-400" /> Loop: {isTampered ? 'Open' : 'Closed'}</span>
                  </div>

                </div>

                {/* NFC Diagnostic Screen (Smartphone Emulator UI) */}
                <div className="w-64 bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-inner flex flex-col justify-between min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">Device Scanner</span>
                    </div>
                    <Radio className={`w-3.5 h-3.5 ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                  </div>

                  {/* Display Center */}
                  <div className="flex-1 flex flex-col justify-center items-center bg-slate-900/60 border border-slate-900 rounded-xl p-4 text-center min-h-[140px] relative">
                    
                    <AnimatePresence mode="wait">
                      {isScanning ? (
                        <motion.div 
                          key="scanning"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3 flex flex-col items-center"
                        >
                          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                          <div className="text-xs text-cyan-400 font-mono tracking-wider animate-pulse">Requesting Ledger Auth...</div>
                          <div className="text-[9px] text-slate-500 font-mono">Pinging VCA blockchain node...</div>
                        </motion.div>
                      ) : scanResult === 'secure' ? (
                        <motion.div 
                          key="secure"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2 text-center"
                        >
                          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Authentication Pass</div>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            All tamper telemetry checks secure. Microcircuit intact. Registry signature valid.
                          </p>
                          <div className="mt-2 pt-2 border-t border-slate-900 text-[8px] text-slate-500 font-mono text-left space-y-0.5">
                            <div>SCANS: {scanCount}</div>
                            <div>TAMPER EVENT RECORDED: 0</div>
                            <div>INTEGRITY PAYLOAD: VALID</div>
                          </div>
                        </motion.div>
                      ) : scanResult === 'compromised' ? (
                        <motion.div 
                          key="compromised"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2 text-center"
                        >
                          <div className="w-9 h-9 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400 animate-bounce">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div className="text-red-400 font-bold text-xs uppercase tracking-wider">Breach Alert</div>
                          <p className="text-[10px] text-red-300 leading-normal font-semibold">
                            TAMPER LOOP INTERRUPTED!
                          </p>
                          <p className="text-[9px] text-slate-400 leading-normal">
                            Chemical hologram black-out verified. Electronic circuit breached.
                          </p>
                          <div className="mt-2 pt-2 border-t border-slate-900 text-[8px] text-red-400/80 font-mono text-left space-y-0.5">
                            <div>ALERT: CIRCUIT OPEN</div>
                            <div>TAMPER EVENT RECORDED: 1</div>
                            <div>LEDGER VERIFICATION: VOIDED</div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="idle"
                          className="space-y-2 flex flex-col items-center"
                        >
                          <Smartphone className="w-8 h-8 text-slate-600" />
                          <div className="text-xs font-semibold text-slate-300">Ready to Scan</div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Hold your physical smartphone near the VCA seal, or click the scan button below.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Scanner Actions */}
                  <div className="mt-4">
                    <button
                      onClick={handleNfcScan}
                      disabled={isScanning}
                      className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      id="btn-scan-simulator"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Simulate smartphone Scan</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Simulation triggers panel */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                
                {/* Physical Separator Trigger */}
                <button
                  onClick={toggleTamper}
                  className={`flex-1 p-4 border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                    isTampered 
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400' 
                      : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-400'
                  }`}
                  id="btn-tamper-toggle"
                >
                  <div className="text-left">
                    <div className="font-bold text-sm">
                      {isTampered ? 'Solder Case back together' : 'Simulate Case pry open'}
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      {isTampered ? 'Restores loop circuit & holo matrix' : 'Breaks security lining wire & voids hologram'}
                    </div>
                  </div>
                  {isTampered ? <Lock className="w-5 h-5 shrink-0" /> : <Unlock className="w-5 h-5 shrink-0" />}
                </button>

              </div>

            </div>

          </div>

          {/* Technical Explanations (Column Right: 5/12 width) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className="space-y-6">
              
              <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">1. NFC microchip loop thread</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1.5">
                    An microscopic continuous loop trace runs inside the sonic-weld lining of the VCA holder. It acts as an electronic tamper indicator. Prying, cutting, or drilling severes this path.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">2. Passive, battery-free energy</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1.5">
                    The security circuit is passive and does not rely on an integrated battery. It harvests RF energy dynamically from the scanner device (smartphone/handheld reader) when placed nearby.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">3. Photochromic VCA black-out foil</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1.5">
                    If the airtight seal is broken, the internal holographic "VCA" watermark undergoes oxygen-induced photochromic oxidation. It changes permanently from shimmering rainbow color to solid carbon black.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 flex gap-4 items-start">
                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">4. Cryptographic ledger record</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1.5">
                    Each successful scan is cross-checked against our global secure public database. Cloned microchips are detected instantly if physical location sequences or scan count signatures clash.
                  </p>
                </div>
              </div>

            </div>

            {/* Why this matters callout */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <LockKeyhole className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs uppercase tracking-widest font-mono">Unclonable Security Ledger</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                By pairing physical airtight chemical sensors with microchip circuits, VCA closes the loop on high-value collectible fraud. Even if card cases are perfectly reconstructed physically, their digital ledger keys are severed permanently upon physical opening.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
