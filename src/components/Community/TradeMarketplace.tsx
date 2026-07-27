import React, { useState } from 'react';
import { useCommunity } from '../../hooks/useCommunity';
import { useCards } from '../../hooks/useCards';
import { TradeListing, TradeMessage } from '../../types';
import { PhysicalCard } from '../PhysicalCard';
import { MessageSquare, Plus, Search, Send, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TradeMarketplace() {
  const { trades, activeChatTrade, setActiveChatTrade, chatMessages, createTradeListing, sendTradeMessage } = useCommunity();
  const { cards } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [lookingForText, setLookingForText] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const filteredTrades = trades.filter(t => 
    t.card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.lookingFor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePostTrade = async () => {
    const card = cards.find(c => c.id === selectedCardId);
    if (!card) return;
    await createTradeListing(card, lookingForText || 'Open to offers');
    setShowCreateModal(false);
    setSelectedCardId('');
    setLookingForText('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatTrade || !messageInput.trim()) return;
    await sendTradeMessage(activeChatTrade.id, messageInput);
    setMessageInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Community Trade Marketplace
          </h2>
          <p className="text-xs text-white/50">Browse listed Pokémon cards and negotiate trades securely.</p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-hover text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> List Card for Trade
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search trade listings by Pokémon name, set, or wish list..."
          className="w-full bg-[#12121a] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Trade Listings Grid */}
      {filteredTrades.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-sm font-bold text-white/60">No trade listings found</p>
          <p className="text-xs text-white/40 mt-1">Be the first trainer to list a card for trade!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrades.map(trade => (
            <div key={trade.id} className="bg-[#12121a] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group">
              <div className="flex justify-between items-center text-[10px] text-white/50 font-bold uppercase tracking-widest">
                <span>Trainer: {trade.userDisplayName}</span>
                <span className="text-emerald-400">Listed</span>
              </div>

              <PhysicalCard card={trade.card} showGradeBadge={true} />

              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest block">Looking For:</span>
                <p className="text-white font-medium truncate">{trade.lookingFor || 'Open to all offers'}</p>
              </div>

              <button 
                onClick={() => setActiveChatTrade(trade)}
                className="w-full bg-white/10 hover:bg-primary hover:text-black text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Negotiate Trade
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Trade Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#12121a] border border-white/15 rounded-3xl max-w-lg w-full p-6 relative space-y-4 shadow-2xl"
            >
              <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white">List Card for Trade</h3>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-bold">Select Card from Collection:</label>
                <select 
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="">-- Choose a Card --</option>
                  {cards.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.set} • Grade: {c.estimatedGrade || 'N/A'}) - ${c.highPrice?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/70 block font-bold">Looking for in return:</label>
                <input 
                  type="text"
                  value={lookingForText}
                  onChange={(e) => setLookingForText(e.target.value)}
                  placeholder="e.g., Charizard VMAX, Rayquaza, or cash offer"
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePostTrade}
                  disabled={!selectedCardId}
                  className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Post Trade
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time In-App Trade Chat Drawer */}
      <AnimatePresence>
        {activeChatTrade && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#12121a] border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-xl w-full h-[80vh] flex flex-col relative overflow-hidden shadow-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div>
                  <h3 className="font-bold text-white text-sm">Trade Negotiation with {activeChatTrade.userDisplayName}</h3>
                  <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                    Card: {activeChatTrade.card.name} (${activeChatTrade.card.highPrice?.toFixed(2)})
                  </p>
                </div>
                <button onClick={() => setActiveChatTrade(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/20">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-white/40 text-xs my-8">
                    Start negotiating! Offer a trade or ask a question.
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className="space-y-1">
                      <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest block">{msg.senderName}</span>
                      <div className="bg-white/10 border border-white/10 p-3 rounded-2xl text-xs text-white max-w-[85%] font-sans leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2 bg-[#0a0a0f]">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type trade offer or message..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-hover text-black p-2.5 rounded-xl font-bold flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
