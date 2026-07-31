import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/15 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${
            isDestructive 
              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
              : 'bg-primary/20 text-primary border-primary/30'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        </div>

        <p className="text-xs text-white/70 leading-relaxed font-sans">{message}</p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                : 'bg-primary hover:bg-primary-hover text-black shadow-primary/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
