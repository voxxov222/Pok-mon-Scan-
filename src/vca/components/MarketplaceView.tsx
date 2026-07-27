import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Search, ShieldCheck, Radio, Tag, Gavel, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MarketplaceListing } from '../types';
import { mockListings } from '../data/mockData';
import GeneratedTradingCard from './GeneratedTradingCard';

export default function MarketplaceView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isBidSuccess, setIsBidSuccess] = useState(false);

  const filteredListings = mockListings.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.cardId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBidSuccess(true);
    setTimeout(() => {
      setIsBidSuccess(false);
      setSelectedListing(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Secure Collectible Marketplace
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">VCA Marketplace</h2>
          <p className="text-slate-400 text-sm md:text-base">
            Trade authenticated physical slabs with cryptographic NFC verification and escrow transfer.
          </p>
        </div>
      </div>

      {/* Category & Search Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Pokemon', 'Sports', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Lorcana'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-cyan-500 text-slate-950 shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={listing.id}
            onClick={() => setSelectedListing(listing)}
            className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {listing.cardId}
                </span>
                <span className="font-display font-black text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {listing.grade}
                </span>
              </div>

              {/* Miniature Graded Slab Preview */}
              <div className="w-full h-56 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden my-4 group-hover:border-cyan-500/30 transition-colors p-2">
                <div className="transform scale-[0.52] origin-center flex items-center justify-center pointer-events-none">
                  <GeneratedTradingCard 
                    title={listing.title}
                    set={listing.set}
                    year={2026}
                    category={listing.category}
                    grade={listing.grade}
                    artwork={listing.artwork}
                    imageBg={listing.imageBg}
                    imageUrl={listing.imageUrl}
                    backImageUrl={listing.backImageUrl}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-slate-950/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-cyan-400 border border-cyan-500/20 z-10 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>NFC VERIFIED</span>
                </div>
              </div>

              <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                {listing.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Seller: {listing.seller}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{listing.isAuction ? 'Current Bid' : 'Buy Now Price'}</span>
                <div className="text-lg font-bold text-white font-mono">
                  ${(listing.isAuction ? listing.currentBid : listing.price)?.toLocaleString()} CAD
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedListing(listing);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
              >
                {listing.isAuction ? 'Place Bid' : 'Buy Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Listing / Bid Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedListing(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full z-10 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-cyan-400 font-bold">{selectedListing.cardId}</span>
                  <h3 className="text-xl font-display font-bold text-white mt-1">{selectedListing.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                  {selectedListing.grade}
                </span>
              </div>

              {!isBidSuccess ? (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Seller:</span>
                      <span className="text-white">{selectedListing.seller}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{selectedListing.isAuction ? 'Current Bid:' : 'Asking Price:'}</span>
                      <span className="text-cyan-400 font-bold">${(selectedListing.isAuction ? selectedListing.currentBid : selectedListing.price)?.toLocaleString()} CAD</span>
                    </div>
                    {selectedListing.isAuction && (
                      <div className="flex justify-between text-slate-400">
                        <span>Auction Ends:</span>
                        <span className="text-amber-400">{selectedListing.auctionEnds}</span>
                      </div>
                    )}
                  </div>

                  {selectedListing.isAuction && (
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase">Your Bid Amount (CAD)</label>
                      <input
                        type="number"
                        placeholder={(selectedListing.currentBid! + 250).toString()}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      className="px-5 py-2.5 bg-slate-900 text-slate-300 rounded-xl font-semibold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
                    >
                      {selectedListing.isAuction ? 'Confirm Bid' : 'Purchase via Escrow'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-white">Bid Placed Successfully!</h4>
                  <p className="text-xs text-slate-400 font-mono">Your cryptographic bid has been recorded on the VCA escrow ledger.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
