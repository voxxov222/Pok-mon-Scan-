import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  Truck, 
  Package, 
  Eye, 
  Barcode, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Subgrades {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
}

interface VerificationItem {
  id: string;
  item: string;
  category: string;
  grade: string;
  score: string;
  status: 'verified' | 'pending' | 'flagged';
  deliveryStatus: 'processing' | 'intransit' | 'delivered';
  time: string;
  subgrades: Subgrades;
  tracking: string;
  carrier: string;
  estDelivery: string;
  frontColor: string;
  backColor: string;
  cardArtwork: string;
  vaultLocation: string;
  description: string;
}

const mockVerifications: VerificationItem[] = [
  { 
    id: 'VCA-9284-77X', 
    item: '1999 Base Set Charizard #4 Shadowless', 
    category: 'TCG / Pokémon',
    grade: '9.5 GEM MINT', 
    score: '9.5',
    status: 'verified', 
    deliveryStatus: 'delivered',
    time: '2m ago',
    subgrades: { centering: 9.5, corners: 9.8, edges: 9.5, surface: 9.5 },
    tracking: 'VCA-TRK-771822',
    carrier: 'VCA Insured Expedited Priority',
    estDelivery: 'Delivered on July 19, 2026',
    frontColor: 'from-orange-600 via-amber-500 to-red-650',
    backColor: 'from-blue-700 via-indigo-800 to-blue-900',
    cardArtwork: '🔥 Winged Flame Dragon',
    vaultLocation: 'Recipient Private Home Vault (Signature On File)',
    description: 'Outstanding eye appeal with minimal factory print line on the rear holographic border. Highly preserved.'
  },
  { 
    id: 'VCA-1102-4BQ', 
    item: '2009 Bowman Chrome Mike Trout Rookie Autograph', 
    category: 'Sports / Baseball',
    grade: '10 PRISTINE', 
    score: '10',
    status: 'verified', 
    deliveryStatus: 'intransit',
    time: '14m ago',
    subgrades: { centering: 10, corners: 10, edges: 10, surface: 10 },
    tracking: 'VCA-TRK-110944',
    carrier: 'Secure Armored Escort Vault Shipping',
    estDelivery: 'Estimated Tuesday, July 21, 2026',
    frontColor: 'from-sky-400 via-slate-100 to-blue-500',
    backColor: 'from-slate-800 via-slate-900 to-zinc-950',
    cardArtwork: '⚾ Swing Autograph Blue Refractor',
    vaultLocation: 'In-Transit to Calgary Secure Vault Hub B',
    description: 'A virtually flawless modern specimen. Symmetrical border alignment measures exactly 50/50 under precision infrared laser inspection.'
  },
  { 
    id: 'VCA-8472-9PL', 
    item: '1993 Magic: The Gathering Alpha Black Lotus', 
    category: 'TCG / Magic',
    grade: '8.0 NM-MT', 
    score: '8.0',
    status: 'pending', 
    deliveryStatus: 'processing',
    time: '45m ago',
    subgrades: { centering: 8.5, corners: 8.0, edges: 8.0, surface: 8.0 },
    tracking: 'VCA-TRK-847229',
    carrier: 'Scheduled Secure Air Courier',
    estDelivery: 'Awaiting Final Sealed Lab Phase',
    frontColor: 'from-purple-900 via-stone-800 to-neutral-900',
    backColor: 'from-amber-950 via-amber-900 to-stone-900',
    cardArtwork: '🪷 Black Lotus Dark Flora',
    vaultLocation: 'VCA Primary Laboratory, Station 04',
    description: 'Slight corner rounding and trace edge whitening on top bezel. Still an incredibly strong card representing the holy grail of Magic TCG.'
  },
  { 
    id: 'VCA-5519-2MK', 
    item: '1986 Fleer Michael Jordan #57 Rookie Card', 
    category: 'Sports / Basketball',
    grade: 'FAIL - ALTERED', 
    score: 'FAIL',
    status: 'flagged', 
    deliveryStatus: 'processing',
    time: '1h ago',
    subgrades: { centering: 0, corners: 0, edges: 0, surface: 0 },
    tracking: 'N/A',
    carrier: 'To Be Returned to Submitter via Insured Air',
    estDelivery: 'Review Complete. Dispatched pending billing check.',
    frontColor: 'from-red-600 via-white to-blue-800',
    backColor: 'from-slate-700 via-zinc-800 to-slate-900',
    cardArtwork: '🏀 High-Flying Air Dunk',
    vaultLocation: 'Safe Retention Hold - Lab Counter 1A',
    description: 'Automatic rejection. Physical microscopic tests revealed evidence of added red pigment ink along the top left corner to mask edge whitening.'
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [slabSide, setSlabSide] = useState<'front' | 'back'>('front');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const filteredItems = mockVerifications.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openItemDetails = (item: VerificationItem) => {
    setSelectedItem(item);
    setSlabSide('front');
  };

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900" id="dashboard">
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full">
              Immutable Registry
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mt-4 mb-3">Real-Time Ledger</h2>
            <p className="text-slate-400 text-sm md:text-base">
              Live database tracking authenticated collectibles, finished slab images, and current delivery states.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search ID or Asset (e.g. Charizard)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm shadow-inner"
            />
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-900/60 font-mono">
                  <th className="px-6 py-5">Certification ID</th>
                  <th className="px-6 py-5">Collectible Asset</th>
                  <th className="px-6 py-5">VCA Grade</th>
                  <th className="px-6 py-5">Transit Status</th>
                  <th className="px-6 py-5 text-center">Interactive Slab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      key={item.id}
                      onClick={() => openItemDetails(item)}
                      className="hover:bg-slate-900/60 cursor-pointer transition-all group"
                      id={`ledger-row-${item.id}`}
                    >
                      {/* Cert ID */}
                      <td className="px-6 py-5 font-mono text-cyan-400 font-bold text-sm">
                        <span className="group-hover:underline">{item.id}</span>
                      </td>

                      {/* Collectible Description */}
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {item.item}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">{item.category}</div>
                      </td>

                      {/* VCA Grade Badge */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          item.grade.includes('FAIL') 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                        }`}>
                          {item.grade}
                        </span>
                      </td>

                      {/* Delivery Status Badge */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5">
                          {item.deliveryStatus === 'delivered' && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Delivered</span>
                            </span>
                          )}
                          {item.deliveryStatus === 'intransit' && (
                            <span className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/5 px-2.5 py-1 rounded-lg border border-cyan-500/10 font-medium animate-pulse">
                              <Truck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>In Transit</span>
                            </span>
                          )}
                          {item.deliveryStatus === 'processing' && (
                            <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Processing</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action trigger button */}
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-bold group-hover:text-cyan-400 transition-colors border border-slate-800 bg-slate-900/60 px-3 py-1.5 rounded-xl group-hover:border-cyan-500/30">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Slab</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-500 text-sm font-mono">
                      No matching registered assets located on VCA ledger database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <span>Real-time sync verified via active SHA-256 cryptographic headers.</span>
            </div>
            <div>Showing {filteredItems.length} of {mockVerifications.length} verified listings</div>
          </div>
        </div>

      </div>

      {/* DETAILED INTERACTIVE VERIFICATION MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              id="ledger-modal-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: "spring", damping: 26, stiffness: 360 }}
              className="relative bg-slate-950 border border-slate-800 w-full max-w-5xl rounded-3xl p-6 md:p-8 shadow-2xl z-10 flex flex-col lg:flex-row gap-8 overflow-hidden max-h-[90vh] overflow-y-auto"
              id="ledger-detail-modal"
            >
              {/* Highlight strip top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
                aria-label="Close details"
                id="ledger-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT HALF: THE SLAB IMAGES VISUALIZER */}
              <div className="flex-1 flex flex-col justify-between items-center gap-6 min-h-[420px] lg:border-r lg:border-slate-800 lg:pr-8">
                <div className="text-center">
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
                    Graded slab view
                  </div>
                  <h3 className="text-xl font-display font-black text-white">{selectedItem.item}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Cert ID: {selectedItem.id}</p>
                </div>

                {/* 3D Glass Graded Slab Graphic */}
                <div className="relative w-64 h-96 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden select-none">
                  {/* Glass sheen reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
                  
                  {/* VCA Label Area (Physical Top Box of Graded Holder) */}
                  <div className="bg-slate-100 rounded-lg p-2.5 flex flex-col justify-between relative text-slate-900 border-2 border-slate-300 shadow-sm z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-sans font-black text-[7px] leading-none tracking-tight">VERIFIED CARD AUTHORITY</span>
                        <span className="text-[5px] text-slate-500 font-bold mt-0.5">ESTABLISHED SECURE REGISTRY</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-[12px] font-black leading-none text-cyan-600 font-display">{selectedItem.score}</span>
                        <span className="text-[5px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">VCA GRADE</span>
                      </div>
                    </div>

                    <div className="mt-1.5 flex justify-between items-end border-t border-slate-200 pt-1 text-[5px] font-mono font-semibold">
                      <div>
                        <div>CARD: {selectedItem.item.slice(0, 24)}...</div>
                        <div className="text-slate-500 mt-0.5">CAT: {selectedItem.category}</div>
                      </div>
                      <div className="text-right">
                        <div>CERT: {selectedItem.id}</div>
                        <div className="text-cyan-600 font-bold mt-0.5">{selectedItem.grade}</div>
                      </div>
                    </div>
                  </div>

                  {/* Slab Card Window */}
                  <div className="flex-1 w-full my-3 bg-slate-900 rounded-xl relative border border-slate-800/80 flex flex-col items-center justify-between p-3 overflow-hidden">
                    {/* Inner bezel border */}
                    <div className="absolute inset-1 rounded-lg border border-dashed border-slate-700/40 pointer-events-none" />

                    {/* VCA Watermark Hologram overlay inside case */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none z-10 pointer-events-none">
                      <div className={`font-black text-4xl font-display tracking-widest text-center ${
                        selectedItem.grade.includes('FAIL') 
                          ? 'text-black/80 drop-shadow-none' 
                          : 'text-cyan-400/10 bg-gradient-to-tr from-cyan-400/15 via-pink-400/15 to-blue-400/15 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      }`}>
                        VCA
                      </div>
                      <span className="text-[6px] font-mono font-bold tracking-widest text-slate-500">AUTHENTIC</span>
                    </div>

                    {/* Front side Card Layout representation */}
                    <AnimatePresence mode="wait">
                      {slabSide === 'front' ? (
                        <motion.div 
                          key="front-card"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full h-full flex flex-col justify-between"
                        >
                          {/* Card Title */}
                          <div className="flex justify-between items-center">
                            <span className="text-[6px] font-bold text-slate-400 uppercase tracking-wide">VCA Collector Edition</span>
                            <span className="text-[6px] font-mono text-cyan-400 bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-500/20 font-bold">LTD</span>
                          </div>

                          {/* Card Art Box */}
                          <div className={`flex-1 w-full my-1.5 rounded-lg bg-gradient-to-tr ${selectedItem.frontColor} border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner`}>
                            {/* Radial shine overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
                            <span className="text-white font-bold text-xs font-display tracking-wider z-10 drop-shadow-md">
                              {selectedItem.cardArtwork}
                            </span>
                            {/* holographic sparkles */}
                            {!selectedItem.grade.includes('FAIL') && (
                              <Sparkles className="absolute bottom-2 right-2 w-3.5 h-3.5 text-yellow-300/40 animate-pulse" />
                            )}
                          </div>

                          {/* Card stats / details bar */}
                          <div className="space-y-1 text-left">
                            <div className="h-1 w-full bg-slate-800 rounded" />
                            <div className="flex justify-between items-center text-[5px] font-mono text-slate-500">
                              <span>HP: 120 / POWER: 99</span>
                              <span>©1999 VCA Co.</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        // Back Side of Card representation
                        <motion.div 
                          key="back-card"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full h-full flex flex-col justify-between"
                        >
                          <div className="text-[6px] font-bold text-slate-500 uppercase tracking-widest text-center mt-1">Official Back Face</div>

                          {/* Ornate back graphic representing the card's rear border */}
                          <div className={`flex-1 w-full my-2 rounded-lg bg-gradient-to-bl ${selectedItem.backColor} border border-slate-800/60 flex items-center justify-center relative p-2`}>
                            <div className="absolute inset-1 border border-white/5 rounded flex items-center justify-center">
                              <div className="w-10 h-10 border-2 border-cyan-400/20 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-cyan-400/30" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 text-center font-mono text-[5px] text-slate-500">
                            <div>VERIFIED SECURITY LEDGER</div>
                            <div>ENCRYPTED SECURE RFID TRANSPONDER EMBEDDED</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  {/* Slab Bottom (Sonic welded lock text) */}
                  <div className="flex justify-between items-center text-[6px] font-mono text-slate-500 border-t border-slate-900 pt-2">
                    <span className="flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5 text-cyan-500" /> SECURE CASE</span>
                    <span className="flex items-center gap-0.5"><Barcode className="w-2.5 h-2.5" /> ID #928</span>
                  </div>
                </div>

                {/* Flip slab buttons */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setSlabSide('front')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      slabSide === 'front' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                    id="btn-slab-front"
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setSlabSide('back')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      slabSide === 'back' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                    id="btn-slab-back"
                  >
                    Back View
                  </button>
                </div>
              </div>

              {/* RIGHT HALF: TRANSIT TIMELINE & SUBGRADE MEASUREMENTS */}
              <div className="flex-[1.2] flex flex-col justify-between">
                <div>
                  
                  {/* Header details */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 mt-4 lg:mt-0">
                    <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      {selectedItem.category}
                    </span>
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                      Registry Sealed
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-black text-white">{selectedItem.item}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* ACTIVE DELIVERY STATUS TIMELINE */}
                  <div className="mt-8 border-t border-slate-800 pt-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Shipment & Delivery Timeline</span>
                    </h4>

                    {/* Elegant delivery visual stepper */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                      
                      {/* Step 1: Processing */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-slate-950 transition-colors ${
                          selectedItem.deliveryStatus === 'processing'
                            ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-110'
                            : 'border-emerald-500 bg-emerald-950'
                        }`}>
                          {selectedItem.deliveryStatus !== 'processing' ? (
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          ) : (
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">1. Core Verification & Encapsulation</span>
                            <span className="text-[10px] text-slate-500 font-mono">Completed</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">Dual-authenticator evaluation audit logged, physical slab microchip loop activated, and sonic sealing completed.</p>
                        </div>
                      </div>

                      {/* Step 2: In Transit */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-slate-950 transition-colors ${
                          selectedItem.deliveryStatus === 'intransit'
                            ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-110'
                            : selectedItem.deliveryStatus === 'delivered'
                            ? 'border-emerald-500 bg-emerald-950'
                            : 'border-slate-800 bg-slate-950'
                        }`}>
                          {selectedItem.deliveryStatus === 'delivered' ? (
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          ) : selectedItem.deliveryStatus === 'intransit' ? (
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                          ) : null}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${selectedItem.deliveryStatus === 'processing' ? 'text-slate-600' : 'text-white'}`}>
                              2. Secured Armored Escort Dispatch
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {selectedItem.deliveryStatus === 'processing' ? 'Awaiting Dispatch' : selectedItem.deliveryStatus === 'intransit' ? 'Active' : 'Completed'}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${selectedItem.deliveryStatus === 'processing' ? 'text-slate-600' : 'text-slate-400'}`}>
                            Package handed off to secure courier partner. Full declared value vault-insurance coverage locked in transit.
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="relative">
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-slate-950 transition-colors ${
                          selectedItem.deliveryStatus === 'delivered'
                            ? 'border-emerald-500 bg-emerald-950 shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-110'
                            : 'border-slate-800 bg-slate-950'
                        }`}>
                          {selectedItem.deliveryStatus === 'delivered' && (
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${selectedItem.deliveryStatus !== 'delivered' ? 'text-slate-600' : 'text-white'}`}>
                              3. Delivery Vault Handover & Active Seal Guard
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {selectedItem.deliveryStatus === 'delivered' ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 ${selectedItem.deliveryStatus !== 'delivered' ? 'text-slate-600' : 'text-slate-400'}`}>
                            Sign-off authentication complete. Item logged in physical owner custody with continuous RFID tamper-seal protection enabled.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* VCA Inspection Subgrade Details */}
                  {!selectedItem.grade.includes('FAIL') && (
                    <div className="mt-8 border-t border-slate-800 pt-6">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Slab Subgrade Scorecard</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-mono">Centering</span>
                          <span className="text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedItem.subgrades.centering}</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-mono">Corners</span>
                          <span className="text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedItem.subgrades.corners}</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-mono">Edges</span>
                          <span className="text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedItem.subgrades.edges}</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-mono">Surface</span>
                          <span className="text-sm font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{selectedItem.subgrades.surface}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vault Manifest Info Box */}
                  <div className="mt-6 bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tracking Reference:</span>
                      <span className="text-slate-300 font-bold">{selectedItem.tracking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Transit Carrier:</span>
                      <span className="text-slate-300">{selectedItem.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Vault Delivery:</span>
                      <span className="text-cyan-400 font-bold">{selectedItem.estDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Security Vault:</span>
                      <span className="text-slate-300">{selectedItem.vaultLocation}</span>
                    </div>
                  </div>

                </div>

                {/* Footer close button */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all border border-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Close Inspector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
