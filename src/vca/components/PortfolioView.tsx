import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Grid, 
  List as ListIcon, 
  Share2, 
  Eye,
  Award,
  Radio
} from 'lucide-react';
import { CardItem } from '../types';
import GeneratedTradingCard from './GeneratedTradingCard';

interface PortfolioViewProps {
  cards: CardItem[];
  onSelectCard: (card: CardItem) => void;
  onOpenAddCard: () => void;
  onOpenCertificate: (card: CardItem) => void;
}

export default function PortfolioView({
  cards,
  onSelectCard,
  onOpenAddCard,
  onOpenCertificate
}: PortfolioViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const totalValue = cards.reduce((acc, c) => acc + c.estimatedValue, 0);
  const avgScore = (cards.reduce((acc, c) => acc + c.score, 0) / cards.length).toFixed(1);

  const filteredCards = cards.filter(c => {
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Collector Vault Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">My Portfolio</h2>
          <p className="text-slate-400 text-sm md:text-base">
            Manage, organize, and showcase your authenticated physical card slabs with NFC seal monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share Profile</span>
          </button>
          <button
            onClick={onOpenAddCard}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer"
            id="btn-add-card"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collectible</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Collection Value</span>
          <div className="text-3xl font-display font-black text-white mt-2 mb-1">
            ${totalValue.toLocaleString()} <span className="text-sm font-normal text-slate-400">CAD</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+6.8% this month</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Authenticated Slabs</span>
          <div className="text-3xl font-display font-black text-white mt-2 mb-1">
            {cards.length} <span className="text-sm font-normal text-slate-400">Items</span>
          </div>
          <div className="text-xs text-cyan-400 font-mono font-bold">
            100% NFC Seal Secured
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Average VCA Grade</span>
          <div className="text-3xl font-display font-black text-white mt-2 mb-1">
            {avgScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-xs text-emerald-400 font-mono font-bold">
            Gem Mint / Pristine Tier
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Highest Value Asset</span>
          <div className="text-xl font-display font-black text-cyan-400 mt-2 mb-1 truncate">
            $45,000 <span className="text-xs font-normal text-slate-400">CAD</span>
          </div>
          <div className="text-xs text-slate-400 font-mono truncate">
            Alpha Black Lotus (8.5)
          </div>
        </div>
      </div>

      {/* Filters and Search toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Pokemon', 'Sports', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Lorcana'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-cyan-500 text-slate-950 shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Display (Grid or List) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={card.id}
              onClick={() => onSelectCard(card)}
              className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    {card.id}
                  </span>
                  <span className="font-display font-black text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {card.grade}
                  </span>
                </div>

                {/* Miniature Graded Slab Preview */}
                <div className="w-full h-56 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden my-4 group-hover:border-cyan-500/30 transition-colors p-2">
                  <div className="transform scale-[0.52] origin-center flex items-center justify-center pointer-events-none">
                    <GeneratedTradingCard 
                      title={card.title}
                      set={card.set}
                      year={card.year}
                      category={card.category}
                      grade={card.grade}
                      artwork={card.artwork}
                      imageBg={card.imageBg}
                      imageUrl={card.imageUrl}
                      backImageUrl={card.backImageUrl}
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-950/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-cyan-400 border border-cyan-500/20 z-10">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>NFC ACTIVE</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{card.set} ({card.year})</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Estimated Value</span>
                  <div className="text-base font-bold text-white font-mono">${card.estimatedValue.toLocaleString()} CAD</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCertificate(card);
                  }}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-800 transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Cert</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Collectible Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">VCA Grade</th>
                <th className="px-6 py-4">Estimated Value</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredCards.map((card) => (
                <tr 
                  key={card.id}
                  onClick={() => onSelectCard(card)}
                  className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-cyan-400 font-bold">{card.id}</td>
                  <td className="px-6 py-4 font-sans font-semibold text-white">{card.title}</td>
                  <td className="px-6 py-4 text-slate-400">{card.category}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {card.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-bold">${card.estimatedValue.toLocaleString()} CAD</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCertificate(card);
                      }}
                      className="px-3 py-1 bg-slate-950 text-cyan-400 rounded-lg border border-slate-800 hover:border-cyan-500/30"
                    >
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Share Profile Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full z-10 shadow-2xl space-y-6"
            >
              <h3 className="text-xl font-display font-bold text-white">Public Collector Profile</h3>
              <p className="text-xs text-slate-400 font-mono">
                Share your verified VCA portfolio link with collectors, insurers, and marketplace buyers.
              </p>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-cyan-400 flex items-center justify-between">
                <span>https://vca.authority.io/collector/todd-william</span>
                <button 
                  onClick={() => alert('Portfolio link copied to clipboard!')}
                  className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Copy
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
