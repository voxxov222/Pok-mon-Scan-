import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Scale, X, Percent, Check, AlertTriangle, HelpCircle } from 'lucide-react';

interface Grade {
  grade: string;
  title: string;
  color: string;
  description: string;
  centering: string;
  corners: string;
  edges: string;
  surface: string;
  centeringVal: number;
  cornersVal: number;
  edgesVal: number;
  surfaceVal: number;
  allowedFlaws: string;
  inspectedHighlight: 'centering' | 'corners' | 'edges' | 'surface' | 'all';
}

const gradesData: Grade[] = [
  {
    grade: '10',
    title: 'PRISTINE',
    color: 'from-cyan-400 to-blue-500 bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    description: 'A virtually flawless card, perfectly preserved. Demands absolute perfection across all inspection aspects under 10x magnification.',
    centering: '50/50 front and back. Perfect symmetrical alignment on horizontal and vertical axes.',
    corners: 'Razor-sharp under magnification. No signs of corner fraying, crushing, or micro-lifting.',
    edges: 'Perfect cut with uniform thickness. Absolutely free of chipping, silvering, or blade indentation.',
    surface: 'Flawless original gloss. Absolutely zero print spots, scratches, roller lines, or dimples.',
    centeringVal: 100,
    cornersVal: 100,
    edgesVal: 100,
    surfaceVal: 100,
    allowedFlaws: 'Zero flaws permitted. Exceptional eye appeal and perfect centering required.',
    inspectedHighlight: 'all'
  },
  {
    grade: '9.5',
    title: 'GEM MINT',
    color: 'from-emerald-400 to-teal-500 bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    description: 'An exceptional card with outstanding eye appeal. Only a single microscopic, nearly imperceptible flaw is allowed under extreme magnification.',
    centering: '55/45 or better on front, 60/40 or better on back. Symmetrical alignment is almost perfect.',
    corners: 'Sharp corners. No wear visible to the naked eye. Only one micro-spot of fuzzing allowed under magnifier.',
    edges: 'Extremely clean cut. May exhibit one miniscule blade vibration mark.',
    surface: 'Full original gloss. One micro print defect or a faint, single hairline print streak is permitted.',
    centeringVal: 95,
    cornersVal: 98,
    edgesVal: 98,
    surfaceVal: 95,
    allowedFlaws: 'One microscopic surface speck or single faint factory print line.',
    inspectedHighlight: 'surface'
  },
  {
    grade: '9.0',
    title: 'MINT',
    color: 'from-green-400 to-emerald-500 bg-green-500/10 border-green-500/30 text-green-400',
    description: 'A superb high-end collector card showing only very minor centering issues or tiny surface anomalies under inspection.',
    centering: '60/40 or better on front, 65/35 or better on back.',
    corners: 'Sharp corners. A tiny speck of corner whitening or slight micro-softness is permitted under 10x.',
    edges: 'Very clean edges. Extremely minor edge whitening on one corner tip may be present.',
    surface: 'High gloss preserved. Up to two minor print spots, slight roller lines, or minor surface dimple allowed.',
    centeringVal: 90,
    cornersVal: 90,
    edgesVal: 92,
    surfaceVal: 88,
    allowedFlaws: 'Up to two minor factory defects, such as off-centering or subtle printer ink specks.',
    inspectedHighlight: 'centering'
  },
  {
    grade: '8.0',
    title: 'NEAR MINT - MINT',
    color: 'from-amber-400 to-yellow-500 bg-amber-500/10 border-amber-500/30 text-amber-400',
    description: 'An outstanding card displaying very slight wear or minor printing imperfections on close inspection.',
    centering: '65/35 or better on front, 70/30 or better on back.',
    corners: 'Slightly soft corners. Faint corner wear or minor white tip is visible to the naked eye.',
    edges: 'Minor edge chipping or micro-whitening visible along one or two borders.',
    surface: 'Minor surface wear. A few light hair scratches or up to three minor dimples/printing lines.',
    centeringVal: 80,
    cornersVal: 82,
    edgesVal: 80,
    surfaceVal: 82,
    allowedFlaws: 'Faint corner wear, a tiny touch of edge chipping, or slight centering drift.',
    inspectedHighlight: 'corners'
  },
  {
    grade: '7.0',
    title: 'NEAR MINT',
    color: 'from-orange-400 to-amber-500 bg-orange-500/10 border-orange-500/30 text-orange-400',
    description: 'A highly desirable item with light, visible wear. Still retains strong overall eye appeal and crisp features.',
    centering: '70/30 or better on front, 75/25 or better on back.',
    corners: 'Visible corner wear. Minor rounding and light fraying present on multiple corners.',
    edges: 'Slightly noticeable edge whitening or chipping present on two borders.',
    surface: 'Moderate surface scratches, wax stains, or light printing dimples. Loss of minor gloss.',
    centeringVal: 70,
    cornersVal: 72,
    edgesVal: 70,
    surfaceVal: 72,
    allowedFlaws: 'Moderate edge chipping, visible corner whitening, or slightly duller surface sheen.',
    inspectedHighlight: 'edges'
  },
  {
    grade: '6.0',
    title: 'EXCELLENT - MINT',
    color: 'from-purple-400 to-pink-500 bg-purple-500/10 border-purple-500/30 text-purple-400',
    description: 'Visible wear under normal light. Possesses multiple minor flaws but retains decent structural integrity.',
    centering: '75/25 or better on front, 80/20 or better on back.',
    corners: 'Soft, rounded corners with minor paper separation or fraying.',
    edges: 'Edges exhibit moderate whitening, small chips, or minor blade roughness.',
    surface: 'Partial loss of original shine. Noticeable scratches, minor wax stains, or faint crease lines.',
    centeringVal: 60,
    cornersVal: 62,
    edgesVal: 60,
    surfaceVal: 58,
    allowedFlaws: 'Minor corner chipping, light surface scratches, or a soft, non-damaging crease.',
    inspectedHighlight: 'surface'
  },
  {
    grade: 'FAIL',
    title: 'ALTERED / REJECTED',
    color: 'from-red-400 to-rose-500 bg-red-500/10 border-red-500/30 text-red-400',
    description: 'Cards that fail VCA authenticity standards. Displays signs of manual restoration, trimming, chemical coloring, or tempering.',
    centering: 'N/A (Not evaluated for centering)',
    corners: 'Fuzzy or re-cut corners. Shows evidence of manual trimming or corner color coloring.',
    edges: 'Sanded edges, added adhesive, or ink touch-ups to mask whitening.',
    surface: 'Evidence of chemical cleaning, glossy wax coating reapplication, or deep structural wrinkles.',
    centeringVal: 0,
    cornersVal: 10,
    edgesVal: 10,
    surfaceVal: 10,
    allowedFlaws: 'None. Any evidence of coloring, cleaning, trimming, or reconstruction results in an automatic rejection.',
    inspectedHighlight: 'all'
  }
];

export default function GradingGuide() {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [activeTab, setActiveTab] = useState<'centering' | 'corners' | 'edges' | 'surface'>('centering');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedGrade) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedGrade]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGrade(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openGradeModal = (grade: Grade) => {
    setSelectedGrade(grade);
    // Initialize active inspection tab based on the grade's highlight or centering
    if (grade.inspectedHighlight !== 'all') {
      setActiveTab(grade.inspectedHighlight);
    } else {
      setActiveTab('centering');
    }
  };

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden" id="grading">
      {/* Subtle Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
            VCA Standard
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
            Official Grading scale
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Our authentication ledger relies on standard-defining metrics. Click any of the grade tiers below to explore the strict visual, structural, and centering requirements.
          </p>
        </div>

        {/* Grade Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gradesData.map((gradeItem, idx) => (
            <motion.div
              key={gradeItem.grade}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              onClick={() => openGradeModal(gradeItem)}
              className="group relative bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/30 p-6 rounded-2xl cursor-pointer transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col justify-between"
              id={`grade-card-${gradeItem.grade.replace('.', '_')}`}
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-2xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-3xl font-black bg-gradient-to-r ${gradeItem.color.split(' ')[0]} ${gradeItem.color.split(' ')[1]} bg-clip-text text-transparent font-display tracking-tight`}>
                    VCA {gradeItem.grade}
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${gradeItem.color.split(' ').slice(2).join(' ')}`}>
                    {gradeItem.title}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  {gradeItem.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-medium group-hover:underline pt-2 border-t border-slate-800/60">
                <span>View Criteria Breakdown</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ box to add trust */}
        <div className="mt-16 bg-slate-950/40 border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="bg-cyan-500/10 p-4 rounded-xl shrink-0">
            <Scale className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Uncompromising Standards</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every card undergoes double-blind testing. Two separate authenticators must grade the card independently before any score is registered on the global registry ledger, eliminating bias and human error.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {selectedGrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGrade(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              id="modal-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-slate-950 border border-slate-800 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row gap-8"
              id="grade-detail-modal"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-blue-600" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedGrade(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
                aria-label="Close modal"
                id="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Card Visualizer & Sub-grades */}
              <div className="flex-1 flex flex-col items-center justify-between gap-6 md:border-r md:border-slate-800 md:pr-8">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1 tracking-wider uppercase">VCA Inspected Card Map</div>
                  <h3 className="text-2xl font-display font-black text-white">Visualizer</h3>
                </div>

                {/* Card Map / Wireframe */}
                <div className="relative w-48 h-68 border-2 border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden flex flex-col items-center justify-between p-4 select-none shadow-inner">
                  {/* Dotted symmetry lines */}
                  <div className="absolute inset-3 border border-dashed border-slate-700/30 rounded-lg pointer-events-none" />

                  {/* Corner Highlight Overlay */}
                  <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border transition-all duration-300 ${activeTab === 'corners' ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)] scale-110' : 'border-transparent'}`} />
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border transition-all duration-300 ${activeTab === 'corners' ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)] scale-110' : 'border-transparent'}`} />
                  <div className={`absolute bottom-2 left-2 w-5 h-5 rounded-full border transition-all duration-300 ${activeTab === 'corners' ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)] scale-110' : 'border-transparent'}`} />
                  <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border transition-all duration-300 ${activeTab === 'corners' ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)] scale-110' : 'border-transparent'}`} />

                  {/* Edge Highlight Overlay */}
                  <div className={`absolute inset-x-3 top-1.5 h-1.5 border-t transition-all duration-300 ${activeTab === 'edges' ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'border-transparent'}`} />
                  <div className={`absolute inset-x-3 bottom-1.5 h-1.5 border-b transition-all duration-300 ${activeTab === 'edges' ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'border-transparent'}`} />
                  <div className={`absolute inset-y-3 left-1.5 w-1.5 border-l transition-all duration-300 ${activeTab === 'edges' ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'border-transparent'}`} />
                  <div className={`absolute inset-y-3 right-1.5 w-1.5 border-r transition-all duration-300 ${activeTab === 'edges' ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'border-transparent'}`} />

                  {/* Centering Highlight Overlay */}
                  <div className={`absolute inset-5 border transition-all duration-300 ${activeTab === 'centering' ? 'border-cyan-400 bg-cyan-500/5 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]' : 'border-slate-800/10'}`} />

                  {/* Surface Highlight Overlay */}
                  <div className={`absolute inset-8 rounded-lg transition-all duration-300 flex items-center justify-center ${activeTab === 'surface' ? 'bg-cyan-500/10 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105' : 'border-transparent'}`}>
                    {activeTab === 'surface' && <div className="absolute w-6 h-6 bg-cyan-400/20 rounded-full blur-sm" />}
                  </div>

                  {/* Visual Layout Mock */}
                  <div className="w-full flex justify-between items-center z-10">
                    <div className="h-1.5 w-12 bg-slate-800 rounded" />
                    <div className="h-2 w-2 bg-slate-800 rounded-full" />
                  </div>
                  
                  <div className="w-full h-28 bg-slate-850/80 rounded-lg border border-slate-800/40 z-10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
                    <ShieldCheck className="w-10 h-10 text-slate-800" />
                  </div>

                  <div className="w-full space-y-1 z-10">
                    <div className="h-1.5 w-full bg-slate-800 rounded" />
                    <div className="h-1.5 w-1/2 bg-slate-800 rounded" />
                  </div>
                </div>

                {/* Sub-grade Bars */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Centering Benchmark</span>
                    <span className="text-white font-bold">{selectedGrade.centeringVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedGrade.color.split(' ')[0]} ${selectedGrade.color.split(' ')[1]}`}
                      style={{ width: `${selectedGrade.centeringVal}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Corners Integrity</span>
                    <span className="text-white font-bold">{selectedGrade.cornersVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedGrade.color.split(' ')[0]} ${selectedGrade.color.split(' ')[1]}`}
                      style={{ width: `${selectedGrade.cornersVal}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Edges Smoothness</span>
                    <span className="text-white font-bold">{selectedGrade.edgesVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedGrade.color.split(' ')[0]} ${selectedGrade.color.split(' ')[1]}`}
                      style={{ width: `${selectedGrade.edgesVal}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Surface Flawlessness</span>
                    <span className="text-white font-bold">{selectedGrade.surfaceVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedGrade.color.split(' ')[0]} ${selectedGrade.color.split(' ')[1]}`}
                      style={{ width: `${selectedGrade.surfaceVal}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Criteria & Breakdown tabs */}
              <div className="flex-[1.3] flex flex-col justify-between">
                <div>
                  {/* Grade Header */}
                  <div className="flex items-center gap-3 mb-2 mt-4 md:mt-0">
                    <span className={`text-3xl font-black bg-gradient-to-r ${selectedGrade.color.split(' ')[0]} ${selectedGrade.color.split(' ')[1]} bg-clip-text text-transparent font-display`}>
                      VCA {selectedGrade.grade}
                    </span>
                    <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full border ${selectedGrade.color.split(' ').slice(2).join(' ')}`}>
                      {selectedGrade.title}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {selectedGrade.description}
                  </p>

                  {/* interactive tabs */}
                  <div className="flex border-b border-slate-800 mb-6">
                    {(['centering', 'corners', 'edges', 'surface'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 pb-3 text-sm font-semibold capitalize border-b-2 transition-colors cursor-pointer text-center ${
                          activeTab === tab
                            ? 'border-cyan-400 text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                        id={`tab-btn-${tab}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Active tab contents */}
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 min-h-[160px]">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2 uppercase font-mono">
                      <Percent className="w-4 h-4" />
                      <span>{activeTab} Standards</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {activeTab === 'centering' && selectedGrade.centering}
                      {activeTab === 'corners' && selectedGrade.corners}
                      {activeTab === 'edges' && selectedGrade.edges}
                      {activeTab === 'surface' && selectedGrade.surface}
                    </p>
                  </div>
                </div>

                {/* Permitted Flaws Box */}
                <div className="mt-6 border-t border-slate-800 pt-6">
                  <div className="flex items-start gap-3 bg-slate-900/20 border border-slate-800 p-4 rounded-xl">
                    <div className="mt-0.5">
                      {selectedGrade.grade === 'FAIL' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      ) : (
                        <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Allowed Imperfections</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {selectedGrade.allowedFlaws}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
