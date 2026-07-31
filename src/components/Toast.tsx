import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { key?: string; toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.onAction ? 5500 : 3500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.onAction, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-medium backdrop-blur-xl ${
        toast.type === 'success'
          ? 'bg-[#12121a]/95 border-emerald-500/40 text-emerald-300'
          : toast.type === 'error'
          ? 'bg-[#12121a]/95 border-red-500/40 text-red-300'
          : 'bg-[#12121a]/95 border-primary/40 text-white'
      }`}
    >
      {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-primary flex-shrink-0" />}

      <span className="flex-1 leading-snug font-sans">{toast.message}</span>

      {toast.actionText && toast.onAction && (
        <button
          onClick={() => {
            toast.onAction?.();
            onDismiss(toast.id);
          }}
          className="px-2.5 py-1.5 bg-primary text-black font-bold text-[10px] uppercase tracking-wider rounded-lg hover:bg-primary-hover transition-colors flex-shrink-0 flex items-center gap-1 shadow-md shadow-primary/20"
        >
          <Undo2 className="w-3 h-3" />
          {toast.actionText}
        </button>
      )}

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-white/40 hover:text-white rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
