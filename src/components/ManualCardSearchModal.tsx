import React, { useState } from 'react';
import { Search, X, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CardData } from '../types';

interface ManualCardSearchModalProps {
  onClose: () => void;
  onAddCard: (card: Omit<CardData, 'id' | 'userId' | 'dateScanned'>) => Promise<void>;
  initialQuery?: string;
}

export function ManualCardSearchModal({ onClose, onAddCard, initialQuery = '' }: ManualCardSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search-cards?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search cards');
      }

      setResults(data.data || []);
      if ((data.data || []).length === 0) {
        setError(`No Pokémon cards found matching "${query}". Try searching by Pokémon name (e.g., Charizard, Pikachu, Mewtwo) or set name.`);
      }
    } catch (err: any) {
      setError(err.message || 'Error searching cards');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (card: any, idx: number) => {
    try {
      await onAddCard(card);
      setAddedIds(prev => ({ ...prev, [idx]: true }));
    } catch (err: any) {
      setError("Failed to add card to Vault: " + (err?.message || err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#181824]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Manual Pokémon Card Search</h2>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Search official TCG database & live market prices</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="p-4 border-b border-white/10 bg-[#0a0a0f] flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Pokémon name or set (e.g. Charizard 151, Pikachu, Rayquaza)..."
              className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="text-center py-12 text-white/50 space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono uppercase tracking-widest font-bold">Querying Pokémon TCG Catalog & Market Prices...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="text-center py-12 text-white/40 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-primary/40" />
              <p className="text-xs font-bold text-white/60">Type a Pokémon name above to search</p>
              <p className="text-[11px] text-white/40">You can add any card with official images and live TCGPlayer prices directly to your Vault!</p>
            </div>
          )}

          {!loading && results.map((card, idx) => (
            <div 
              key={idx}
              className="bg-[#181824] border border-white/10 hover:border-primary/50 rounded-2xl p-3 flex items-center gap-4 transition-all"
            >
              <img 
                src={card.imageUrl || 'https://images.pokemontcg.io/base1/4_hires.png'} 
                alt={card.name} 
                className="w-14 h-20 object-contain rounded-lg bg-black/40 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{card.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-primary font-bold">#{card.cardNumber}</span>
                </div>
                <p className="text-xs text-white/60 font-medium truncate mt-0.5">{card.set} • <span className="text-primary">{card.rarity}</span></p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono font-bold">
                  <span className="text-emerald-400">Low: ${card.lowPrice.toFixed(2)}</span>
                  <span className="text-primary">Mid: ${card.medianPrice.toFixed(2)}</span>
                  <span className="text-white/60">High: ${card.highPrice.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => handleAdd(card, idx)}
                disabled={addedIds[idx]}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all flex-shrink-0 ${
                  addedIds[idx] 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-primary hover:bg-primary-hover text-black shadow-lg shadow-primary/20'
                }`}
              >
                {addedIds[idx] ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
