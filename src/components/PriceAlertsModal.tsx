import React from 'react';
import { PriceAlert } from '../types';
import { Bell, TrendingUp, TrendingDown, Check, X, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface PriceAlertsModalProps {
  alerts: PriceAlert[];
  onClose: () => void;
  onRequestPush: () => Promise<string>;
  onMarkRead: () => void;
}

export function PriceAlertsModal({ alerts, onClose, onRequestPush, onMarkRead }: PriceAlertsModalProps) {
  const handleEnablePush = async () => {
    const res = await onRequestPush();
    if (res === 'granted') {
      alert("Push notifications enabled for PokéVault market alerts!");
    } else {
      alert("Push notification permission was not granted.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/15 rounded-3xl max-w-md w-full p-6 relative space-y-4 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/20 text-primary border border-primary/30">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Market Price Alerts</h3>
            <p className="text-xs text-white/50">Significant price fluctuations (+/- 10%) detected</p>
          </div>
        </div>

        {/* Push Notification Toggle Button */}
        <div className="bg-primary/10 border border-primary/30 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span className="text-xs text-white font-bold">Push Notifications</span>
          </div>
          <button 
            onClick={handleEnablePush}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-black rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors"
          >
            Enable Push
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="text-center p-6 text-xs text-white/40">
              No recent market price spikes or drops in your collection.
            </div>
          ) : (
            alerts.map(a => (
              <div key={a.id} className="bg-black/40 border border-white/5 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{a.cardName}</span>
                  <span className="text-[10px] text-white/40">Market Shift Detected</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono justify-end">
                    <TrendingUp className="w-3.5 h-3.5" /> +{a.percentageChange}%
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">${a.oldPrice} → ${a.newPrice}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button 
            onClick={onMarkRead}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Mark all as read
          </button>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
