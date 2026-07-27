import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Cpu, Zap, Lock, RefreshCw, Smartphone, CheckCircle2, 
  AlertTriangle, Terminal, Layers, Search, Bell, ChevronRight, 
  ExternalLink, Eye, Database, BarChart3, Award
} from 'lucide-react';

export default function BlueprintArtifact() {
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'tamper' | 'dashboard' | 'market'>('overview');
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [rotation, setRotation] = useState({ x: -14, y: 22 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [isBreached, setIsBreached] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; text: string; type?: 'ok' | 'warn'; time: string }>>([
    { id: 1, text: 'SESSION INIT — VCA READER ONLINE', time: '02:00:10' },
    { id: 2, text: 'SLAB SN VCA-000482-EDM DETECTED', time: '02:00:11' },
    { id: 3, text: 'CONTINUITY LOOP CHECK … PASS', type: 'ok', time: '02:00:12' },
    { id: 4, text: 'TAMPER FLAG READ … 0 (UNSET)', type: 'ok', time: '02:00:13' },
    { id: 5, text: 'LEDGER MATCH … CLEAN RECORD', type: 'ok', time: '02:00:14' }
  ]);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  // Auto-cycle exploded view in overview tab
  useEffect(() => {
    if (!isAutoCycle || activeTab !== 'overview') return;
    const interval = setInterval(() => {
      setIsExploded((prev) => !prev);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoCycle, activeTab]);

  // Auto-rotate 3D rig
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({ ...prev, y: prev.y + 0.6 }));
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const showToastMsg = (title: string, body: string) => {
    setToast({ title, body });
    setTimeout(() => {
      setToast(null);
    }, 4200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation((prev) => ({
      x: Math.max(-70, Math.min(70, prev.x - dy * 0.4)),
      y: prev.y + dx * 0.4
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSimulateTamper = () => {
    const nextBreached = !isBreached;
    setIsBreached(nextBreached);
    const now = new Date().toLocaleTimeString();

    if (nextBreached) {
      showToastMsg('TAMPER EVENT SYNCED', 'Ledger record flagged compromised');
      setTerminalLogs((prev) => [
        { id: Date.now(), text: 'SEAM BREACH DETECTED AT EDGE TRACE', type: 'warn', time: now },
        { id: Date.now() + 1, text: 'CONTINUITY LOOP … 0% — OPEN CIRCUIT', type: 'warn', time: now },
        { id: Date.now() + 2, text: 'WRITING TAMPER FLAG … NTAG TT PINS', type: 'warn', time: now },
        { id: Date.now() + 3, text: 'ONCE-OPENED FLAG SET — IRREVERSIBLE', type: 'warn', time: now },
        { id: Date.now() + 4, text: 'RECORD UPDATED: SLAB MARKED COMPROMISED', type: 'warn', time: now },
        ...prev
      ]);
    } else {
      showToastMsg('SYSTEM RESEALED', 'Demo reset and recalibrated.');
      setTerminalLogs((prev) => [
        { id: Date.now(), text: 'NEW SLAB PROVISIONED — DEMO RESET', type: 'ok', time: now },
        ...prev
      ]);
    }
  };

  return (
    <section className="bg-[#050608] text-[#dff6f8] font-['Rajdhani',sans-serif] relative overflow-hidden py-16" id="blueprint-artifact">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(157,92,255,0.08),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(63,240,255,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(63,240,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(63,240,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] pointer-events-none opacity-40" />

      {/* Glow sweep top */}
      <div className="fixed top-0 left-[-30%] w-[30%] h-[2px] z-40 pointer-events-none bg-gradient-to-r from-transparent via-[#3ff0ff] to-transparent shadow-[0_0_12px_2px_rgba(63,240,255,0.6)] animate-[sweepAcross_7s_linear_infinite] opacity-70" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex gap-3 items-start bg-gradient-to-br from-[#14080a]/95 to-[#0a0506]/95 border border-red-500/50 rounded-lg p-4 max-w-sm shadow-[0_0_30px_rgba(255,107,122,0.25)] animate-in fade-in slide-in-from-top-5">
          <span className="text-xl text-[#ff6b7a] drop-shadow-[0_0_10px_rgba(255,107,122,0.6)]">⚠</span>
          <div>
            <div className="font-['Orbitron',sans-serif] text-[11px] tracking-[1.5px] text-[#ff6b7a] mb-1 font-bold">{toast.title}</div>
            <div className="text-[12.5px] text-[#7fa3a8] leading-relaxed">{toast.body}</div>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-7 relative z-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-end flex-wrap gap-[18px] border-b border-[#3ff0ff]/25 pb-5 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-[74px] h-[74px] shrink-0 relative filter drop-shadow-[0_0_10px_rgba(63,240,255,0.35)]">
              <svg viewBox="0 0 100 100" className="w-full h-full block animate-[holoShift_5s_ease-in-out_infinite]">
                <defs>
                  <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3ff0ff"/>
                    <stop offset="45%" stopColor="#9d5cff"/>
                    <stop offset="100%" stopColor="#ffcf6b"/>
                  </linearGradient>
                  <linearGradient id="holoGradSoft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3ff0ff" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#9d5cff" stopOpacity="0.15"/>
                  </linearGradient>
                </defs>
                <polygon points="50,3 90,25 90,72 50,97 10,72 10,25" fill="url(#holoGradSoft)" stroke="url(#holoGrad)" strokeWidth="2"/>
                <polygon points="50,13 82,31 82,68 50,87 18,68 18,31" fill="none" stroke="url(#holoGrad)" strokeWidth="0.75" opacity="0.6"/>
                <circle cx="50" cy="50" r="14" fill="none" stroke="#ffcf6b" strokeWidth="1.4" opacity="0.9"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="#ffcf6b" strokeWidth="1" opacity="0.55"/>
                <circle cx="50" cy="50" r="26" fill="none" stroke="#ffcf6b" strokeWidth="0.7" opacity="0.3"/>
                <text x="50" y="55" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="15" fill="#eafeff">VCA</text>
                <line x1="50" y1="3" x2="50" y2="13" stroke="url(#holoGrad)" strokeWidth="1"/>
                <line x1="50" y1="87" x2="50" y2="97" stroke="url(#holoGrad)" strokeWidth="1"/>
              </svg>
            </div>
            <div>
              <div className="font-['Orbitron',sans-serif] text-[11px] tracking-[6px] text-[#ffcf6b] uppercase flex items-center gap-[10px] mb-2 before:content-[''] before:w-[22px] before:h-[1px] before:bg-[#ffcf6b]">
                Verified Card Authority
              </div>
              <h2 className="font-['Orbitron',sans-serif] font-black text-3xl lg:text-[42px] tracking-[2px] leading-[1.05] bg-gradient-to-r from-[#eafeff] via-[#3ff0ff] to-[#9d5cff] bg-clip-text text-transparent">
                VCA NFC SLAB — SYSTEM BLUEPRINT
              </h2>
              <p className="text-[#7fa3a8] text-[15px] tracking-[1px] mt-2 max-w-[560px]">
                NFC-authenticated trading card slab prototype — physical grading meets on-chip digital provenance.
              </p>
            </div>
          </div>
          <div className="text-right font-['Orbitron',sans-serif] text-[10px] text-[#7fa3a8] tracking-[2px] space-y-1">
            <div className={`inline-flex items-center px-3 py-1 rounded-[20px] border transition-all duration-300 ${isBreached ? 'border-[#ff6b7a]/45 bg-[#ff6b7a]/10 text-[#ff6b7a]' : 'border-[#3ff0ff]/35 bg-[#3ff0ff]/5 text-[#3ff0ff]'}`}>
              <span className={`w-[7px] h-[7px] rounded-full mr-1.5 animate-pulse ${isBreached ? 'bg-[#ff6b7a] shadow-[0_0_8px_#ff6b7a]' : 'bg-[#3ff0ff] shadow-[0_0_8px_#3ff0ff]'}`} />
              {isBreached ? 'SYSTEM STATUS: BREACHED' : 'SYSTEM STATUS: SEALED'}
            </div>
            <div>EDMONTON, AB · CANADA</div>
            <div>DOC — VCA-SLAB-BLUEPRINT-001</div>
          </div>
        </header>

        {/* TABS */}
        <div className="flex gap-0.5 mb-7 border border-[#3ff0ff]/25 w-fit rounded-[3px] overflow-hidden bg-[#0a0d12]">
          {[
            { id: 'overview', label: 'Assembly' },
            { id: 'flow', label: 'Auth Flow' },
            { id: 'tamper', label: 'Tamper Shield' },
            { id: 'dashboard', label: 'Ledger Sync' },
            { id: 'market', label: 'Market Case' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-['Orbitron',sans-serif] text-[11px] tracking-[2px] uppercase bg-transparent border-none px-6 py-3 cursor-pointer transition-all border-r border-[#3ff0ff]/25 last:border-r-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-b from-[#3ff0ff]/14 to-[#3ff0ff]/2 text-[#3ff0ff] shadow-[inset_0_-2px_0_#3ff0ff]'
                  : 'text-[#7fa3a8] hover:text-[#3ff0ff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: OVERVIEW / 3D ASSEMBLY ================= */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[30px] mb-10">
              {/* Stage Card */}
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[26px] relative overflow-hidden min-h-[520px] flex flex-col">
                <div className="absolute top-[14px] right-[18px] font-['Orbitron',sans-serif] text-[9px] tracking-[3px] text-[#8a6f2e]">FIG.01 — ASSEMBLY</div>
                <div className="absolute top-[10px] left-[10px] w-4 h-4 border border-[#3ff0ff] border-r-0 border-b-0 opacity-60" />
                <div className="absolute top-[10px] right-[10px] w-4 h-4 border border-[#3ff0ff] border-l-0 border-b-0 opacity-60" />
                <div className="absolute bottom-[10px] left-[10px] w-4 h-4 border border-[#3ff0ff] border-r-0 border-t-0 opacity-60" />
                <div className="absolute bottom-[10px] right-[10px] w-4 h-4 border border-[#3ff0ff] border-l-0 border-t-0 opacity-60" />

                <div 
                  className="flex-1 flex items-center justify-center [perspective:1400px] relative py-8 select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="absolute w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(63,240,255,0.22),transparent_70%)] blur-[6px] animate-[ambientGlow_3.4s_ease-in-out_infinite] pointer-events-none z-0" />

                  {/* Slab Rig */}
                  <div
                    className={`w-[260px] h-[370px] relative transition-transform duration-150 ease-out cursor-grab ${isExploded ? 'exploded' : ''}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    }}
                  >
                    {/* Layer 1: Front shell */}
                    <div 
                      className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[#3ff0ff]/14 via-[#9d5cff]/4 to-[#3ff0ff]/18 border-[1.5px] border-[#3ff0ff]/75 backdrop-blur-[0.5px] transition-all duration-700 ease-[cubic-bezier(.2,.9,.25,1)]"
                      style={{
                        transform: isExploded ? 'translateZ(160px) translateY(-40px)' : 'translateZ(30px)',
                        boxShadow: '0 0 6px rgba(63,240,255,0.9), 0 0 26px rgba(63,240,255,0.45), 0 0 60px rgba(63,240,255,0.2), inset 0 0 50px rgba(63,240,255,0.1), inset 0 0 2px rgba(255,255,255,0.4)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="absolute top-[10px] right-[10px] w-[34px] h-[34px] opacity-85 filter drop-shadow-[0_0_4px_rgba(63,240,255,0.5)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <polygon points="50,3 90,25 90,72 50,97 10,72 10,25" fill="rgba(10,13,18,0.4)" stroke="url(#holoGrad)" strokeWidth="3"/>
                          <text x="50" y="58" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="22" fill="#eafeff">VCA</text>
                        </svg>
                      </div>
                    </div>

                    {/* Layer 2: Card */}
                    <div 
                      className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[#1c2430]/55 to-[#0c1015]/70 border border-[#ffcf6b]/35 flex items-center justify-center p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-[0.5px] transition-all duration-700 ease-[cubic-bezier(.2,.9,.25,1)]"
                      style={{
                        transform: isExploded ? 'translateZ(80px) translateY(-14px)' : 'translateZ(15px)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="w-[78%] h-[88%] border border-[#9d5cff]/40 rounded-[6px] bg-[repeating-linear-gradient(45deg,rgba(157,92,255,0.05)_0_6px,transparent_6px_12px),linear-gradient(160deg,#151b24,#090b0e)] flex items-center justify-center font-['Orbitron',sans-serif] text-[#9d5cff] text-[11px] tracking-[2px] text-center p-2.5">
                        HOLO-ID CARD WINDOW<br/>· TAMPER SEAL ·
                      </div>
                    </div>

                    {/* Layer 3: NFC Module */}
                    <div 
                      className="absolute inset-0 rounded-[10px] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(.2,.9,.25,1)]"
                      style={{
                        transform: isExploded ? 'translateZ(15px)' : 'translateZ(0px)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="w-[64px] h-[64px] rounded-full border-2 border-dashed border-[#ffcf6b] flex items-center justify-center shadow-[0_0_22px_rgba(255,207,107,0.5)] animate-[spin_6s_linear_infinite] relative">
                        <div className="absolute inset-[10px] rounded-full border border-[#ffcf6b] opacity-60" />
                        <div className="w-[16px] h-[16px] bg-[#ffcf6b] rounded-[3px] shadow-[0_0_14px_#ffcf6b]" />
                      </div>
                    </div>

                    {/* Layer 4: Cradle */}
                    <div 
                      className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[#9d5cff]/8 to-[#0a0d12]/90 border border-[#9d5cff]/30 transition-all duration-700 ease-[cubic-bezier(.2,.9,.25,1)]"
                      style={{
                        transform: isExploded ? 'translateZ(-60px) translateY(14px)' : 'translateZ(-15px)',
                        transformStyle: 'preserve-3d'
                      }}
                    />

                    {/* Layer 5: Back Shell */}
                    <div 
                      className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-[#0a0d12]/98 to-[#140a1e]/90 border border-[#3ff0ff]/20 transition-all duration-700 ease-[cubic-bezier(.2,.9,.25,1)] relative"
                      style={{
                        transform: isExploded ? 'translateZ(-140px) translateY(40px)' : 'translateZ(-30px)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="absolute bottom-[14px] left-0 right-0 text-center font-['Orbitron',sans-serif] text-[8px] tracking-[2px] text-[#7fa3a8]">
                        SN · VCA-000482-EDM
                      </div>
                    </div>

                    {/* Leaders */}
                    {isExploded && (
                      <>
                        <div className="absolute top-[-6%] left-[104%] font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/60 border border-[#3ff0ff]/35 rounded-[3px] px-3 py-1.5 backdrop-blur-[2px] shadow-[0_0_12px_rgba(63,240,255,0.15)] flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffcf6b] shadow-[0_0_6px_#ffcf6b]" /> 01 — CLEAR ACRYLIC SHELL
                        </div>
                        <div className="absolute top-[16%] left-[104%] font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/60 border border-[#3ff0ff]/35 rounded-[3px] px-3 py-1.5 backdrop-blur-[2px] shadow-[0_0_12px_rgba(63,240,255,0.15)] flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffcf6b] shadow-[0_0_6px_#ffcf6b]" /> 02 — GRADED CARD + WINDOW
                        </div>
                        <div className="absolute top-[44%] left-[104%] font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/60 border border-[#3ff0ff]/35 rounded-[3px] px-3 py-1.5 backdrop-blur-[2px] shadow-[0_0_12px_rgba(63,240,255,0.15)] flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffcf6b] shadow-[0_0_6px_#ffcf6b]" /> 03 — NTAG 424 DNA TT TAMPER CHIP
                        </div>
                        <div className="absolute top-[68%] left-[104%] font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/60 border border-[#3ff0ff]/35 rounded-[3px] px-3 py-1.5 backdrop-blur-[2px] shadow-[0_0_12px_rgba(63,240,255,0.15)] flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffcf6b] shadow-[0_0_6px_#ffcf6b]" /> 04 — MOLDED CRADLE / SPACER
                        </div>
                        <div className="absolute top-[92%] left-[104%] font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/60 border border-[#3ff0ff]/35 rounded-[3px] px-3 py-1.5 backdrop-blur-[2px] shadow-[0_0_12px_rgba(63,240,255,0.15)] flex items-center gap-2 whitespace-nowrap animate-in fade-in duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffcf6b] shadow-[0_0_6px_#ffcf6b]" /> 05 — BACK SHELL + LASER SERIAL
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 justify-center mt-5 flex-wrap">
                  <button 
                    onClick={() => { setIsAutoCycle(!isAutoCycle); }} 
                    className="font-['Orbitron',sans-serif] text-[10px] tracking-[2px] uppercase bg-[#3ff0ff]/6 border border-[#3ff0ff]/25 text-[#3ff0ff] px-4 py-2.5 rounded-[3px] cursor-pointer transition-all hover:bg-[#3ff0ff]/16 hover:shadow-[0_0_18px_rgba(63,240,255,0.35)]"
                  >
                    {isAutoCycle ? 'Auto-Cycle: On' : 'Auto-Cycle: Off'}
                  </button>
                  <button 
                    onClick={() => setIsAutoRotate(!isAutoRotate)} 
                    className="font-['Orbitron',sans-serif] text-[10px] tracking-[2px] uppercase bg-[#3ff0ff]/6 border border-[#3ff0ff]/25 text-[#3ff0ff] px-4 py-2.5 rounded-[3px] cursor-pointer transition-all hover:bg-[#3ff0ff]/16 hover:shadow-[0_0_18px_rgba(63,240,255,0.35)]"
                  >
                    {isAutoRotate ? 'Stop Rotate' : 'Auto-Rotate'}
                  </button>
                  <button 
                    onClick={() => { setRotation({ x: -14, y: 22 }); setIsAutoRotate(false); setIsExploded(false); }} 
                    className="font-['Orbitron',sans-serif] text-[10px] tracking-[2px] uppercase bg-[#3ff0ff]/6 border border-[#3ff0ff]/25 text-[#3ff0ff] px-4 py-2.5 rounded-[3px] cursor-pointer transition-all hover:bg-[#3ff0ff]/16"
                  >
                    Reset
                  </button>
                </div>
                <div className="text-center text-[11px] text-[#7fa3a8] mt-2.5 tracking-[1px]">Layers auto-explode & reassemble on a loop · drag to rotate · toggle auto-cycle to inspect manually</div>
              </div>

              {/* Info Stack */}
              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px] transition-all hover:shadow-[0_0_24px_rgba(63,240,255,0.10)] hover:border-[#3ff0ff]/40">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2 before:content-['◆'] before:text-[9px] before:text-[#3ff0ff]">
                    Concept Summary
                  </h3>
                  <div className="text-[14px] leading-[1.6] text-[#7fa3a8]">
                    The VCA slab pairs a traditional <b className="text-[#3ff0ff]">tamper-evident graded card holder</b> with an embedded <b className="text-[#3ff0ff]">NFC authentication chip</b>. Tapping a phone against the slab instantly verifies the card's grade, serial, and chain of custody — no login, no app lookup, no guesswork.
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px] transition-all hover:shadow-[0_0_24px_rgba(63,240,255,0.10)] hover:border-[#3ff0ff]/40">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2 before:content-['◆'] before:text-[9px] before:text-[#3ff0ff]">
                    Physical Spec
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Shell Material</span><span className="text-[#dff6f8] font-semibold">Optical-grade acrylic</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Dimensions</span><span className="text-[#dff6f8] font-semibold">85mm × 130mm × 8mm</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Chip</span><span className="text-[#dff6f8] font-semibold">NXP NTAG 424 DNA TT</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Budget Option</span><span className="text-[#dff6f8] font-semibold">NXP NTAG 213 TT</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Security</span><span className="text-[#dff6f8] font-semibold">AES-128 · SUN messaging</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Tamper Loop</span><span className="text-[#dff6f8] font-semibold">Dedicated pins, off-antenna</span></div>
                    <div className="flex justify-between py-[7px] border-b border-[#3ff0ff]/15 text-[13.5px]"><span className="text-[#7fa3a8]">Seal</span><span className="text-[#dff6f8] font-semibold">Conductive trace across seam</span></div>
                    <div className="flex justify-between py-[7px] text-[13.5px]"><span className="text-[#7fa3a8]">Read Range</span><span className="text-[#dff6f8] font-semibold">~2–4cm (phone tap)</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Layer Legend
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-10">
              {[
                { num: '01', title: 'OUTER SHELL', desc: 'Crystal-clear injection-molded acrylic, scratch-resistant coating, holographic edge etching to signal authenticity at a glance.' },
                { num: '02', title: 'CARD WINDOW', desc: 'Static-safe inner sleeve holds the graded card centered and immobile; UV-stable window prevents fading.' },
                { num: '03', title: 'NTAG TAMPER CHIP', desc: 'NXP NTAG 424 DNA TT with dedicated conductive tamper loop separate from antenna pins.' },
                { num: '04', title: 'CRADLE / SPACER', desc: 'Precision-molded internal frame that locks card position and routes the NFC coil without contact stress.' },
                { num: '05', title: 'BACK SHELL + SERIAL', desc: 'Laser-etched serial number and QR fallback, plus a one-way tamper seam.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[18px] relative overflow-hidden transition-all hover:border-[#9d5cff]/50 hover:shadow-[0_0_22px_rgba(157,92,255,0.12)] hover:-translate-y-0.5">
                  <div className="absolute top-[12px] right-[14px] font-['Orbitron',sans-serif] text-[26px] font-black text-[#3ff0ff]/10">{item.num}</div>
                  <h4 className="font-['Orbitron',sans-serif] text-[12px] tracking-[1.5px] text-[#9d5cff] mb-2">{item.title}</h4>
                  <p className="text-[12.5px] text-[#7fa3a8] leading-[1.55]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: AUTH FLOW ================= */}
        {activeTab === 'flow' && (
          <div className="animate-in fade-in duration-500">
            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Consumer Authentication Flow
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-stretch mb-7">
              {[
                { icon: '📱', num: '01', title: 'TAP PHONE', desc: 'Buyer taps any NFC-enabled phone to the slab — no app required to trigger the read.' },
                { icon: '🔒', num: '02', title: 'CHIP RESPONDS', desc: 'Secure element returns an encrypted UID + signed record hash — unclonable, read-only.' },
                { icon: '🗄️', num: '03', title: 'VCA LOOKUP', desc: 'UID is matched against the VCA ledger: grade, photos, grader ID, and custody history.' },
                { icon: '✅', num: '04', title: 'INSTANT RESULT', desc: 'Phone displays a pass/fail authenticity badge plus the full graded record in under a second.' },
                { icon: '🔁', num: '05', title: 'RESALE PROOF', desc: 'Same tap works for the next buyer, forever — resale trust travels with the physical slab.' }
              ].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 p-[20px_16px] relative text-center flex flex-col items-center gap-2.5">
                    <div className="w-[44px] h-[44px] flex items-center justify-center text-xl">{step.icon}</div>
                    <div className="font-['Orbitron',sans-serif] text-[22px] font-black text-transparent [-webkit-text-stroke:1px_#ffcf6b] leading-none">{step.num}</div>
                    <h4 className="font-['Orbitron',sans-serif] text-[11px] tracking-[1.5px] text-[#dff6f8]">{step.title}</h4>
                    <p className="text-[12.5px] text-[#7fa3a8] leading-[1.5]">{step.desc}</p>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-[#3ff0ff] text-lg bg-[#0a0d12] border-t border-b border-[#3ff0ff]/25">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-9">
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[22px]">
                <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2px] text-[#ffcf6b] mb-2">WHY IT BEATS A STICKER OR HOLOGRAM</h3>
                <ul className="list-none flex flex-col gap-2.5 mt-2">
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Sticker holograms can be photographed and reproduced; the NFC secure element cannot be cloned.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">No barcode scanning app or account login needed — works with the phone's native NFC reader.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Grade and custody data live on the chip's linked record, not on a label that can be swapped.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Tamper seam physically ties the chip's presence to the card's specific slab.</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[22px]">
                <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2px] text-[#ffcf6b] mb-2">DATA ON THE VCA RECORD</h3>
                <ul className="list-none flex flex-col gap-2.5 mt-2">
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Card identity: set, year, player/character, grader, numeric grade.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Slab serial number and manufacture batch.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Custody trail: grading date, prior sale events (opt-in).</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Signed hash so the record itself can't be silently edited after grading.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TAMPER SHIELD ================= */}
        {activeTab === 'tamper' && (
          <div className="animate-in fade-in duration-500">
            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Tamper-Proof NFC System
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-[30px] mb-10">
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[26px] relative overflow-hidden min-h-[520px] flex flex-col items-center">
                <div className="absolute top-[14px] right-[18px] font-['Orbitron',sans-serif] text-[9px] tracking-[3px] text-[#8a6f2e]">FIG.02 — CONTINUITY LOOP</div>
                <div className="absolute top-[10px] left-[10px] w-4 h-4 border border-[#3ff0ff] border-r-0 border-b-0 opacity-60" />
                <div className="absolute top-[10px] right-[10px] w-4 h-4 border border-[#3ff0ff] border-l-0 border-b-0 opacity-60" />
                <div className="absolute bottom-[10px] left-[10px] w-4 h-4 border border-[#3ff0ff] border-r-0 border-t-0 opacity-60" />
                <div className="absolute bottom-[10px] right-[10px] w-4 h-4 border border-[#3ff0ff] border-l-0 border-t-0 opacity-60" />

                <div className="flex-1 flex items-center justify-center w-full py-6">
                  <svg viewBox="0 0 220 300" className={`w-36 max-w-[260px] overflow-visible ${isBreached ? 'breached' : ''}`} id="tamperSvg">
                    <rect x="10" y="10" width="200" height="280" rx="16" fill="rgba(63,240,255,0.03)" stroke="rgba(63,240,255,0.2)" strokeWidth="1"/>
                    <path 
                      d="M22,22 H198 V278 H22 Z" 
                      fill="none" 
                      stroke={isBreached ? '#ff6b7a' : '#3ff0ff'} 
                      strokeWidth="2.2" 
                      strokeLinejoin="round" 
                      strokeDasharray={isBreached ? 'none' : '10 7'} 
                      className={isBreached ? 'opacity-20' : 'animate-[flowDash_2.4s_linear_infinite]'}
                    />
                    {isBreached && (
                      <path d="M22,145 L58,133 L46,168 L92,150 L80,190 L120,172" fill="none" stroke="#ff6b7a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    <rect x="88" y="128" width="46" height="46" rx="7" fill="#0d1219" stroke="#ffcf6b" strokeWidth="2"/>
                    <text x="111" y="156" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="700" fontSize="10" fill="#ffcf6b">CHIP</text>
                    <text x="111" y="255" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontSize="8" letterSpacing="2" fill="#7fa3a8">EDGE CONTINUITY TRACE</text>
                  </svg>
                </div>

                <div className="w-full max-w-[280px] my-3.5 flex flex-col gap-1.5 font-['Orbitron',sans-serif] text-[10.5px] tracking-[1px]">
                  <div className={`flex justify-between p-[8px_12px] border rounded-[3px] transition-all duration-400 ${isBreached ? 'border-[#ff6b7a]/50 bg-[#ff6b7a]/10 text-[#ff6b7a]' : 'border-[#3ff0ff]/25 bg-[#3ff0ff]/4 text-[#7fa3a8]'}`}>
                    <span>LOOP CONTINUITY</span><span>{isBreached ? '0%' : '100%'}</span>
                  </div>
                  <div className={`flex justify-between p-[8px_12px] border rounded-[3px] transition-all duration-400 ${isBreached ? 'border-[#ff6b7a]/50 bg-[#ff6b7a]/10 text-[#ff6b7a]' : 'border-[#3ff0ff]/25 bg-[#3ff0ff]/4 text-[#7fa3a8]'}`}>
                    <span>TAMPER FLAG (NTAG)</span><span>{isBreached ? '1 · SET (PERMANENT)' : '0 · UNSET'}</span>
                  </div>
                  <div className={`flex justify-between p-[8px_12px] border rounded-[3px] transition-all duration-400 ${isBreached ? 'border-[#ff6b7a]/50 bg-[#ff6b7a]/10 text-[#ff6b7a]' : 'border-[#3ff0ff]/25 bg-[#3ff0ff]/4 text-[#7fa3a8]'}`}>
                    <span>LEDGER STATE</span><span>{isBreached ? 'FLAGGED' : 'CLEAN'}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-center mt-3 flex-wrap">
                  <button 
                    onClick={handleSimulateTamper} 
                    className={`font-['Orbitron',sans-serif] text-[10px] tracking-[2px] uppercase border px-4 py-2.5 rounded-[3px] cursor-pointer transition-all ${
                      isBreached 
                        ? 'bg-[#3ff0ff]/6 border-[#3ff0ff]/25 text-[#3ff0ff] hover:bg-[#3ff0ff]/16' 
                        : 'bg-[#ff6b7a]/12 border-[#ff6b7a]/40 text-[#ff6b7a] hover:bg-[#ff6b7a]/25 shadow-[0_0_18px_rgba(255,107,122,0.3)]'
                    }`}
                  >
                    {isBreached ? 'Reseal / Reset' : 'Simulate Tamper Event'}
                  </button>
                </div>
                <div className="text-center text-[11px] text-[#7fa3a8] mt-2.5 tracking-[1px]">A hair-thin conductive trace rings the inner shell seam and terminates at the chip's tamper pin</div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px]">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#3ff0ff]" /> Live Verification Log
                  </h3>
                  <div className="bg-[#04070a] border border-[#3ff0ff]/20 rounded-[4px] p-[12px_14px] h-[190px] overflow-y-auto font-['Consolas','Courier_New',monospace] text-[11.5px] leading-[1.7] text-[#3ff0ff] space-y-1">
                    {terminalLogs.map((log) => (
                      <div key={log.id} className={`animate-[logIn_.35s_forwards] ${log.type === 'warn' ? 'text-[#ff6b7a]' : log.type === 'ok' ? 'text-[#7effa0]' : 'text-[#3ff0ff]'}`}>
                        <span className="text-[#7fa3a8] mr-2">[{log.time}]</span>{log.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px]">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2 before:content-['◆'] before:text-[9px] before:text-[#3ff0ff]">
                    Why It Can't Be Undone
                  </h3>
                  <div className="text-[14px] leading-[1.6] text-[#7fa3a8]">
                    The tamper flag lives on <b className="text-[#3ff0ff]">dedicated tamper-loop pins</b> — separate from the main NFC antenna — inside an NXP NTAG TagTamper chip. Once the conductive trace across the seam breaks, the chip permanently records a <b className="text-[#ff6b7a]">"once-opened"</b> flag. No re-seal or replacement shell resets it without a serial mismatch against the VCA ledger.
                  </div>
                </div>
              </div>
            </div>

            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Shield Mechanics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
              {[
                { num: 'A', title: 'DEDICATED TAMPER LOOP', desc: 'A thin wire, conductive trace, or flex circuit runs across the case seam/hinge and lands on tamper-loop pins separate from antenna pins.' },
                { num: 'B', title: 'ONE-TIME TAMPER FLAG', desc: 'Opening the case breaks continuity — the chip permanently records "once-opened" and reports live loop status on subsequent taps.' },
                { num: 'C', title: 'AES-128 AUTHENTICATED READS', desc: 'The NTAG 424 DNA TT variant adds AES-128 encryption, secure messaging, and digital signatures for verified authenticity.' },
                { num: 'D', title: 'LEDGER BROADCAST', desc: 'The next tap after a breach pushes the permanent flag to the VCA record, instantly visible to all future buyers.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[18px] relative overflow-hidden transition-all hover:border-[#9d5cff]/50 hover:shadow-[0_0_22px_rgba(157,92,255,0.12)]">
                  <div className="absolute top-[12px] right-[14px] font-['Orbitron',sans-serif] text-[26px] font-black text-[#3ff0ff]/10">{item.num}</div>
                  <h4 className="font-['Orbitron',sans-serif] text-[12px] tracking-[1.5px] text-[#9d5cff] mb-2">{item.title}</h4>
                  <p className="text-[12.5px] text-[#7fa3a8] leading-[1.55]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: LEDGER SYNC ================= */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              VCA Platform — Setting the Standard of Authenticity
            </div>
            <div className="inline-flex items-center gap-2 font-['Orbitron',sans-serif] text-[10px] tracking-[2px] text-[#ffcf6b] border border-[#ffcf6b]/35 rounded-[20px] px-4 py-[7px] mb-4 bg-[#ffcf6b]/5">
              <span className="text-[#3ff0ff]">◆</span> NFC-VERIFIED · LEDGER-SYNCED · TAMPER-PROOF
            </div>

            {/* Platform Window FIG.03 */}
            <div className="bg-gradient-to-br from-[#0b0f14] to-[#050708] border border-[#3ff0ff]/25 rounded-[14px] overflow-hidden mb-5 shadow-[0_0_44px_rgba(63,240,255,0.08)]">
              <div className="flex items-center justify-between p-[14px_22px] border-b border-[#3ff0ff]/25 gap-5 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0">
                    <polygon points="50,3 90,25 90,72 50,97 10,72 10,25" fill="rgba(63,240,255,0.08)" stroke="#3ff0ff" strokeWidth="4"/>
                    <text x="50" y="60" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="26" fill="#eafeff">VCA</text>
                  </svg>
                  <div>
                    <div className="font-['Orbitron',sans-serif] text-[12.5px] tracking-[1.5px] text-[#dff6f8]">VERIFIED CARD AUTHORITY</div>
                    <div className="text-[7.5px] tracking-[2px] text-[#7fa3a8]">AUTHENTICATION · GRADING · VAULT</div>
                  </div>
                </div>
                <div className="hidden md:flex gap-6 text-[12.5px] text-[#7fa3a8]">
                  <span className="text-[#3ff0ff] relative pb-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3ff0ff] after:shadow-[0_0_6px_#3ff0ff]">Home</span>
                  <span>Portfolio</span><span>Services</span><span>Track</span><span>Account</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="bg-white/4 border border-[#3ff0ff]/25 rounded-[14px] px-3.5 py-1.5 text-[11px] text-[#7fa3a8] flex items-center gap-1.5">⌕ Search</div>
                  <div className="relative text-[#7fa3a8] text-sm">🔔</div>
                  <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#9d5cff] to-[#3ff0ff] flex items-center justify-center text-[10px] font-['Orbitron',sans-serif] text-[#04070a] font-extrabold">EN</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[190px_1fr]">
                <div className="border-r border-[#3ff0ff]/25 p-[18px_10px] hidden md:flex flex-col gap-1">
                  <div className="flex items-center gap-2.5 p-[9px_12px] rounded-[6px] text-[12px] text-[#3ff0ff] bg-[#3ff0ff]/9 border-l-2 border-[#3ff0ff] shadow-[inset_0_0_14px_rgba(63,240,255,0.08)]"><span className="text-cyan-400 w-3.5 text-center">▦</span>Dashboard</div>
                  <div className="flex items-center gap-2.5 p-[9px_12px] rounded-[6px] text-[12px] text-[#7fa3a8]"><span className="text-[#3ff0ff]/80 w-3.5 text-center">◧</span>My Portfolio</div>
                  <div className="flex items-center gap-2.5 p-[9px_12px] rounded-[6px] text-[12px] text-[#7fa3a8]"><span className="text-[#3ff0ff]/80 w-3.5 text-center">◈</span>VCA Grading</div>
                  <div className="flex items-center gap-2.5 p-[9px_12px] rounded-[6px] text-[12px] text-[#7fa3a8]"><span className="text-[#3ff0ff]/80 w-3.5 text-center">▣</span>Vault Manager</div>
                  <div className="flex items-center gap-2.5 p-[9px_12px] rounded-[6px] text-[12px] text-[#7fa3a8]"><span className="text-[#3ff0ff]/80 w-3.5 text-center">⇄</span>Marketplace</div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-2.5">
                    <h4 className="font-['Orbitron',sans-serif] text-base tracking-[1px] text-[#dff6f8]">VCA CERTIFIED GRADING DASHBOARD</h4>
                    <div className="text-[11px] text-[#7fa3a8] border border-[#3ff0ff]/25 rounded-[14px] px-3 py-1 font-['Orbitron',sans-serif] tracking-[0.5px]">My Profile ▾</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr_1fr] gap-4 items-start">
                    <div>
                      <div className="bg-white/[0.015] border border-[#3ff0ff]/25 rounded-[8px] p-4 mb-4">
                        <h5 className="font-['Orbitron',sans-serif] text-[10px] tracking-[1.5px] text-[#ffcf6b] mb-2.5">CARD DETAILS</h5>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">Series</span><span className="text-[#dff6f8] font-semibold">1998 Holo Series</span></div>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">Card</span><span className="text-[#dff6f8] font-semibold">#04/102 Flame Drake</span></div>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">Grade</span><span className="text-[#dff6f8] font-semibold">10 · Gem Mint</span></div>
                        <div className={`flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12 ${isBreached ? 'text-[#ff6b7a]' : 'text-[#7effa0]'}`}>
                          <span className="text-[#7fa3a8]">Status</span><span className="font-semibold">{isBreached ? 'COMPROMISED' : 'VERIFIED & VAULTED'}</span>
                        </div>
                        <div className="flex justify-between text-[12.5px] py-1.5"><span className="text-[#7fa3a8]">Certification</span><span className="text-[#dff6f8] font-semibold">#VCA882194</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={`w-full max-w-[200px] aspect-[3/4.2] rounded-[12px] relative overflow-hidden border-[1.5px] bg-gradient-to-br from-[#3ff0ff]/14 to-[#0a0d12]/90 shadow-[0_0_30px_rgba(63,240,255,0.4)] ${isBreached ? 'border-[#ff6b7a]/80 shadow-[0_0_30px_rgba(255,107,122,0.4)]' : 'border-[#3ff0ff]/75'}`}>
                        <div className="absolute inset-[12%_12%_22%] rounded-[8px] overflow-hidden border border-[#ffcf6b]/30 bg-[radial-gradient(circle_at_32%_22%,rgba(255,150,70,0.55),transparent_55%),radial-gradient(circle_at_70%_75%,rgba(157,92,255,0.3),transparent_60%),linear-gradient(160deg,#241407,#0d0805_75%)]" />
                        <div className={`absolute top-[9px] right-[9px] bg-[#05080a]/82 border rounded-[8px] p-[5px_9px] text-center font-['Orbitron',sans-serif] ${isBreached ? 'border-[#ff6b7a]' : 'border-[#ffcf6b]'}`}>
                          <div className={`text-[18px] font-black leading-none ${isBreached ? 'text-[#ff6b7a]' : 'text-[#ffcf6b]'}`}>10</div>
                          <div className="text-[6px] tracking-[1px] text-[#7fa3a8]">HOLO GRADE</div>
                        </div>
                        <div className="absolute bottom-[9px] left-1/2 -translate-x-1/2 font-['Orbitron',sans-serif] text-[7.5px] tracking-[1.5px] text-[#3ff0ff] bg-[#05080a]/78 border border-[#3ff0ff]/40 rounded-[10px] px-2.5 py-1 flex items-center gap-1 whitespace-nowrap">
                          <span className={`w-[5px] h-[5px] rounded-full animate-pulse ${isBreached ? 'bg-[#ff6b7a]' : 'bg-[#3ff0ff]'}`} /> NFC ENABLED
                        </div>
                      </div>
                      <div className="w-full max-w-[200px] mt-3.5">
                        <div className="h-[7px] rounded-[5px] bg-[#3ff0ff]/10 overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${isBreached ? 'w-[4%]' : 'w-[96%]'}`} style={{ background: isBreached ? '#ff6b7a' : 'linear-gradient(90deg,#7effa0,#3ff0ff)' }} />
                        </div>
                        <div className={`text-[9.5px] mt-1.5 tracking-[0.5px] font-['Orbitron',sans-serif] ${isBreached ? 'text-[#ff6b7a]' : 'text-[#7effa0]'}`}>
                          {isBreached ? 'FLAGGED · DO NOT TRUST' : 'CERTIFIED · GEM MINT 10'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white/[0.015] border border-[#3ff0ff]/25 rounded-[8px] p-4 mb-4">
                        <h5 className="font-['Orbitron',sans-serif] text-[10px] tracking-[1.5px] text-[#ffcf6b] mb-2.5">AUTHENTICATION SUMMARY</h5>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">NFC</span><span className={isBreached ? 'text-[#ff6b7a]' : 'text-[#7effa0]'}>{isBreached ? 'TAMPERED' : 'ACTIVE'}</span></div>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">Authentication</span><span className={isBreached ? 'text-[#ff6b7a]' : 'text-[#7effa0]'}>{isBreached ? 'FAILED' : 'PASSED'}</span></div>
                        <div className="flex justify-between text-[12.5px] py-1.5 border-b border-[#3ff0ff]/12"><span className="text-[#7fa3a8]">Grade</span><span className="text-[#dff6f8] font-semibold">10 GM</span></div>
                        <div className="flex justify-between text-[12.5px] py-1.5"><span className="text-[#7fa3a8]">Last Scan</span><span className="text-[#3ff0ff] font-semibold">JUST NOW</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[13px] text-[#7fa3a8] leading-[1.6] max-w-[760px] mx-auto mb-8 text-center">
              The same signed record that lives on the chip powers this dashboard — <b className="text-[#3ff0ff]">grade, certification, and NFC status update the instant a slab is tapped</b>, so the portfolio view, the vault, and the marketplace listing are always looking at one single source of truth.
            </div>

            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Card ↔ Ledger Sync Dashboard
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-[26px] items-start">
              {/* Phone Mockup Frame */}
              <div className="bg-gradient-to-br from-[#111823] to-[#080b10] border border-[#3ff0ff]/30 rounded-[32px] p-4 shadow-[0_0_40px_rgba(63,240,255,0.08)]">
                <div className="w-[70px] h-1.5 bg-[#3ff0ff]/15 rounded-[4px] mx-auto mb-3" />
                <div className="bg-[radial-gradient(ellipse_at_top,rgba(63,240,255,0.05),#0a0d12_60%)] border border-[#3ff0ff]/15 rounded-[22px] p-[18px_16px_20px] min-h-[520px]">
                  <div className="flex justify-between items-center mb-3.5">
                    <svg viewBox="0 0 100 100" className="w-[26px] h-[26px]">
                      <polygon points="50,3 90,25 90,72 50,97 10,72 10,25" fill="rgba(63,240,255,0.08)" stroke="#3ff0ff" strokeWidth="4"/>
                      <text x="50" y="60" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="26" fill="#eafeff">VCA</text>
                    </svg>
                    <div className={`flex items-center gap-1.5 font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] border rounded-[12px] px-2.5 py-1 ${isBreached ? 'border-[#ff6b7a]/40 bg-[#ff6b7a]/10 text-[#ff6b7a]' : 'border-[#3ff0ff]/3 bg-[#3ff0ff]/5 text-[#3ff0ff]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBreached ? 'bg-[#ff6b7a]' : 'bg-[#3ff0ff]'}`} />
                      {isBreached ? 'SYNCED · ALERT' : 'SYNCED'}
                    </div>
                  </div>

                  <div className="relative h-[150px] rounded-[12px] mb-3.5 overflow-hidden border border-[#3ff0ff]/25 bg-[repeating-linear-gradient(120deg,rgba(63,240,255,0.1)_0_8px,rgba(157,92,255,0.08)_8px_16px,rgba(255,207,107,0.08)_16px_24px)] flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#05080a]/15 to-[#05080a]/75" />
                    <div className={`relative z-2 m-3 font-['Orbitron',sans-serif] text-[11px] tracking-[1.5px] border rounded-[16px] px-3 py-1.5 ${isBreached ? 'text-[#ff6b7a] bg-[#1e080a]/80 border-[#ff6b7a]/50' : 'text-[#7effa0] bg-[#0a140e]/75 border-[#7effa0]/40'}`}>
                      {isBreached ? '✕ COMPROMISED' : '✓ VERIFIED'}
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between py-1.5 border-b border-[#3ff0ff]/14 text-[12.5px]"><span className="font-['Orbitron',sans-serif] text-[9.5px] text-[#7fa3a8]">GRADE</span><span className="text-[#dff6f8] font-semibold">PSA 10 · GEM MINT</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#3ff0ff]/14 text-[12.5px]"><span className="font-['Orbitron',sans-serif] text-[9.5px] text-[#7fa3a8]">SERIAL</span><span className="text-[#dff6f8] font-semibold">VCA-000482-EDM</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#3ff0ff]/14 text-[12.5px]"><span className="font-['Orbitron',sans-serif] text-[9.5px] text-[#7fa3a8]">OWNER</span><span className="text-[#dff6f8] font-semibold">●●●● 7734</span></div>
                    <div className="flex justify-between py-1.5 border-b border-[#3ff0ff]/14 text-[12.5px]"><span className="font-['Orbitron',sans-serif] text-[9.5px] text-[#7fa3a8]">CERT HASH</span><span className="text-[#3ff0ff] font-semibold">0x8f2a…c91d</span></div>
                    <div className={`flex justify-between py-1.5 text-[12.5px] ${isBreached ? 'text-[#ff6b7a]' : ''}`}><span className="font-['Orbitron',sans-serif] text-[9.5px] text-[#7fa3a8]">TAMPER STATUS</span><span className="font-semibold">{isBreached ? 'BREACH DETECTED' : 'NONE DETECTED'}</span></div>
                  </div>

                  <div className="mb-4">
                    <span className="font-['Orbitron',sans-serif] text-[9px] tracking-[1.5px] text-[#7fa3a8]">AUTHENTICITY CONFIDENCE</span>
                    <div className="h-[6px] rounded-[4px] bg-[#3ff0ff]/10 mt-1.5 overflow-hidden">
                      <div className={`h-full transition-all duration-600 ${isBreached ? 'w-[4%] bg-gradient-to-r from-[#ff6b7a] to-[#ff3b4e]' : 'w-[99%] bg-gradient-to-r from-[#3ff0ff] to-[#7effa0]'}`} />
                    </div>
                  </div>

                  <div>
                    <h5 className="font-['Orbitron',sans-serif] text-[10px] tracking-[2px] text-[#ffcf6b] mb-2">SCAN ACTIVITY</h5>
                    <ul className="list-none flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                      {isBreached && (
                        <li className="text-[12px] text-[#ffb3ba] flex justify-between items-center gap-2 border-l-2 border-[#ff6b7a] pl-2.5 py-1">
                          <span><span className="font-['Orbitron',sans-serif] text-[9px] text-[#7fa3a8] mr-1.5">JUST NOW</span>Tamper breach detected</span>
                          <span className="font-['Orbitron',sans-serif] text-[8.5px] text-[#ff6b7a] border border-[#ff6b7a]/40 rounded-[3px] px-1.5 py-0.5">ALERT</span>
                        </li>
                      )}
                      <li className="text-[12px] text-[#7fa3a8] flex justify-between items-center gap-2 border-l-2 border-[#3ff0ff]/30 pl-2.5 py-1">
                        <span><span className="font-['Orbitron',sans-serif] text-[9px] text-[#7fa3a8] mr-1.5">JUL 22</span>Verified tap — Edmonton, AB</span>
                        <span className="font-['Orbitron',sans-serif] text-[8.5px] text-[#7effa0] border border-[#7effa0]/40 rounded-[3px] px-1.5 py-0.5">OK</span>
                      </li>
                      <li className="text-[12px] text-[#7fa3a8] flex justify-between items-center gap-2 border-l-2 border-[#3ff0ff]/30 pl-2.5 py-1">
                        <span><span className="font-['Orbitron',sans-serif] text-[9px] text-[#7fa3a8] mr-1.5">JUN 02</span>Ownership transfer confirmed</span>
                        <span className="font-['Orbitron',sans-serif] text-[8.5px] text-[#7effa0] border border-[#7effa0]/40 rounded-[3px] px-1.5 py-0.5">OK</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px]">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2 before:content-['◆'] before:text-[9px] before:text-[#3ff0ff]">
                    How Sync Works
                  </h3>
                  <div className="text-[14px] leading-[1.6] text-[#7fa3a8]">
                    Every tap — verify, transfer, or breach — writes a signed event to the VCA ledger and pushes it to the owner's dashboard in real time. The physical slab and the digital record never drift out of sync: <b className="text-[#3ff0ff]">what the chip reports is what the dashboard shows</b>, instantly.
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[20px_22px]">
                  <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2.5px] text-[#ffcf6b] mb-3 uppercase flex items-center gap-2 before:content-['◆'] before:text-[9px] before:text-[#3ff0ff]">
                    Trigger It Live
                  </h3>
                  <div className="text-[14px] leading-[1.6] text-[#7fa3a8]">
                    Head to the <b className="text-[#3ff0ff]">Tamper Shield</b> tab and run "Simulate Tamper Event" — watch this dashboard flip to a compromised state and log the breach in the scan activity feed automatically.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: MARKET CASE ================= */}
        {activeTab === 'market' && (
          <div className="animate-in fade-in duration-500">
            <div className="font-['Orbitron',sans-serif] text-[13px] tracking-[4px] text-[#3ff0ff] uppercase mb-[18px] flex items-center gap-[14px] after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-[#3ff0ff]/25 after:to-transparent">
              Why Investors Should Care
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
              {[
                { val: '$14B+', lbl: 'Global trading card market' },
                { val: '2–4cm', lbl: 'NFC read range, tap & done' },
                { val: '0', lbl: 'Apps or logins required to verify' },
                { val: '1-way', lbl: 'Tamper seal, breaks on entry' }
              ].map((m, idx) => (
                <div key={idx} className="bg-gradient-to-br from-[#3ff0ff]/5 to-[#0a0d12] border border-[#3ff0ff]/25 p-[18px] text-center rounded-[6px] transition-all hover:border-[#3ff0ff] hover:shadow-[0_0_20px_rgba(63,240,255,0.15)]">
                  <div className="font-['Orbitron',sans-serif] text-[26px] font-extrabold text-[#3ff0ff]">{m.val}</div>
                  <div className="text-[11px] text-[#7fa3a8] tracking-[1px] mt-1">{m.lbl}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9">
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[22px]">
                <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2px] text-[#ffcf6b] mb-2">THE PROBLEM</h3>
                <ul className="list-none flex flex-col gap-2.5 mt-2">
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Counterfeit slabs and re-labeled grades are a growing problem as card values climb.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Buyers on marketplaces have no fast way to confirm a slab is genuine before paying.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Existing anti-counterfeit stickers and holograms are visual-only and reproducible.</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[22px]">
                <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2px] text-[#ffcf6b] mb-2">THE VCA ANSWER</h3>
                <ul className="list-none flex flex-col gap-2.5 mt-2">
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Every slab ships with an embedded, unclonable NFC identity tied to a signed grading record.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Consumers verify with a tap — zero friction, zero new app to download.</li>
                  <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]">Positions VCA as the trust layer for grading, resale, and marketplace integrations.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0d1219] to-[#0a0d12] border border-[#3ff0ff]/25 rounded-[6px] p-[22px]">
              <h3 className="font-['Orbitron',sans-serif] text-[12px] tracking-[2px] text-[#ffcf6b] mb-2.5">PROTOTYPE-TO-PRODUCT PATH</h3>
              <ul className="list-none flex flex-col gap-2.5">
                <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]"><b className="text-[#3ff0ff]">Phase 1 —</b> Home-based grading + manual slab assembly (Edmonton), validate NFC read reliability at consumer scale.</li>
                <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]"><b className="text-[#3ff0ff]">Phase 2 —</b> Contract-manufacture the 5-layer shell at volume; establish signed-record ledger infrastructure.</li>
                <li className="text-[13.5px] text-[#7fa3a8] pl-[18px] relative before:content-['▸'] before:absolute before:left-0 before:text-[#ffcf6b]"><b className="text-[#3ff0ff]">Phase 3 —</b> Marketplace API integrations so listings show live "Tap to Verify" status automatically.</li>
              </ul>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center mt-12 pt-5 border-t border-[#3ff0ff]/25 font-['Orbitron',sans-serif] text-[10px] tracking-[3px] text-[#7fa3a8]">
          VCA — VERIFIED CARD AUTHORITY · CONCEPT BLUEPRINT · NOT FOR PRODUCTION USE
        </footer>
      </div>
    </section>
  );
}
