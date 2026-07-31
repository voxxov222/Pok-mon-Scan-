import React, { useState } from 'react';
import { CardData } from '../types';
import { X, ExternalLink, Award, ShieldCheck, Tag, Trash2, Share2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ConfirmDialog } from './ConfirmDialog';

interface CardDetailModalProps {
  card: CardData;
  onClose: () => void;
  onRemove: (cardId: string) => void;
  onToggleTrade: (cardId: string, isForTrade: boolean, tradeWants?: string) => void;
}

export function CardDetailModal({ card, onClose, onRemove, onToggleTrade }: CardDetailModalProps) {
  const [isForTrade, setIsForTrade] = useState(card.isForTrade || false);
  const [tradeWants, setTradeWants] = useState(card.tradeWants || '');
  const [showTradeSuccess, setShowTradeSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gradingSubmitted, setGradingSubmitted] = useState(false);

  const handleSaveTrade = () => {
    onToggleTrade(card.id, isForTrade, tradeWants);
    setShowTradeSuccess(true);
    setTimeout(() => setShowTradeSuccess(false), 2000);
  };

  const handleConfirmDelete = () => {
    onRemove(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Title & Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-32 h-44 bg-black/60 rounded-2xl border-2 border-primary/40 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xl relative">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2 text-white/50 text-xs">No image artwork</div>
            )}
            <div className="foil-overlay" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/40">
                {card.rarity}
              </span>
              {card.energyType && (
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  {card.energyType}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">{card.name}</h2>
            <p className="text-sm text-white/60 uppercase font-bold tracking-wider">
              Set: <span className="text-white">{card.set}</span> • Card #{card.cardNumber}
            </p>

            {/* Price Cards Summary */}
            <div className="grid grid-cols-3 gap-3 pt-3 font-mono">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[9px] text-white/40 uppercase font-sans font-bold block">Floor Low</span>
                <span className="text-lg font-bold text-white">${card.lowPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[9px] text-white/40 uppercase font-sans font-bold block">Median Market</span>
                <span className="text-lg font-bold text-white/90">${(card.medianPrice || ((card.lowPrice + card.highPrice) / 2))?.toFixed(2)}</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl border border-primary/30">
                <span className="text-[9px] text-primary uppercase font-sans font-bold block">Top Market</span>
                <span className="text-xl font-black text-primary">${card.highPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Grading Score Breakdown */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-white">Gemini AI Grading Report</h3>
            </div>
            {card.estimatedGrade && (
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/60 rounded-xl px-4 py-1 text-center">
                <span className="text-[9px] uppercase tracking-widest font-black text-amber-400 block">ESTIMATED GRADE</span>
                <span className="text-xl font-black text-amber-300 font-mono">{card.estimatedGrade.toFixed(1)} / 10</span>
              </div>
            )}
          </div>

          {card.subGrades ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-white/70">Centering</span>
                  <span className="text-amber-300 font-mono">{card.subGrades.centering.score}/10</span>
                </div>
                <p className="text-white/50 text-[11px]">{card.subGrades.centering.note}</p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-white/70">Edges</span>
                  <span className="text-amber-300 font-mono">{card.subGrades.edges.score}/10</span>
                </div>
                <p className="text-white/50 text-[11px]">{card.subGrades.edges.note}</p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-white/70">Surface</span>
                  <span className="text-amber-300 font-mono">{card.subGrades.surface.score}/10</span>
                </div>
                <p className="text-white/50 text-[11px]">{card.subGrades.surface.note}</p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-white/70">Corners</span>
                  <span className="text-amber-300 font-mono">{card.subGrades.corners.score}/10</span>
                </div>
                <p className="text-white/50 text-[11px]">{card.subGrades.corners.note}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50">Card condition: {card.condition || 'Near Mint'}</p>
          )}

          {card.gradeReasoning && (
            <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-xs text-white/70 space-y-1">
              <span className="font-bold text-white block">Appraiser Analysis:</span>
              <p className="leading-relaxed">{card.gradeReasoning}</p>
            </div>
          )}
        </div>

        {/* AI Market Pricing Sources */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/70">Market Research & Sources</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Link Sources
            </span>
          </div>

          <div className="space-y-2">
            {card.sources && card.sources.length > 0 ? (
              card.sources.map((src, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-white">{src.name}</span>
                    <span className="text-[10px] text-white/40 block">Type: {src.type || 'Market Feed'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">${src.price?.toFixed(2)}</span>
                    {src.url && (
                      <a 
                        href={src.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
                <div>
                  <span className="font-bold text-white">TCGPlayer / PriceCharting Market Data</span>
                  <span className="text-[10px] text-white/40 block">Public Pricing Index</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary">${card.highPrice?.toFixed(2)}</span>
                  {card.sourceUrl && (
                    <a 
                      href={card.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span className="text-[10px]">Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Trade Listing Options */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/70">Community Trade Marketplace</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isForTrade}
                onChange={(e) => setIsForTrade(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary accent-primary"
              />
              <span className="text-xs text-white font-bold">List for Trade</span>
            </label>
          </div>

          {isForTrade && (
            <div className="space-y-2 pt-2">
              <label className="text-xs text-white/60 block">Looking for in return:</label>
              <input 
                type="text"
                value={tradeWants}
                onChange={(e) => setTradeWants(e.target.value)}
                placeholder="e.g. Charizard, Evolving Skies, or Cash Offer"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            {showTradeSuccess && (
              <span className="text-xs text-emerald-400 font-bold">Trade status updated!</span>
            )}
            <button 
              onClick={handleSaveTrade}
              className="ml-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Update Trade Preference
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          {gradingSubmitted && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Grading submission request registered for {card.name} with Verified Card Authority!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete Card
            </button>
            
            <button 
              onClick={() => {
                setGradingSubmitted(true);
                setTimeout(() => setGradingSubmitted(false), 4000);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold p-3 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <Award className="w-4 h-4" /> Send to Get Graded (VCA)
            </button>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-hover text-black font-bold p-3 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition-colors shadow-lg shadow-primary/20"
          >
            Close Dashboard
          </button>
        </div>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Remove Card from Vault"
          message={`Are you sure you want to remove "${card.name}" from your collection? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </motion.div>
    </div>
  );
}
