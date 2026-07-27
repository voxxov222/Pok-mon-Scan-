import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Key, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [view, setView] = useState<'login' | 'register' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate secure network request
    setTimeout(() => {
      setIsSubmitting(false);
      if (view === 'recovery') {
        alert('Password recovery protocol initiated. Check your secure inbox.');
        setView('login');
      } else {
        alert('Authentication simulated. Welcome to VCA.');
      }
    }, 1500);
  };

  return (
    <section className="py-24 bg-[#020617] relative flex items-center justify-center min-h-[80vh]" id="auth">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-display font-bold text-white text-center mb-2">
                {view === 'login' && 'Secure Access'}
                {view === 'register' && 'Create Authority Account'}
                {view === 'recovery' && 'Protocol Recovery'}
              </h2>
              <p className="text-slate-400 text-sm text-center mb-8">
                {view === 'login' && 'Enter your credentials to access the ledger.'}
                {view === 'register' && 'Join the definitive global authentication network.'}
                {view === 'recovery' && 'We will send decryption instructions to your email.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="collector@example.com"
                    />
                  </div>
                </div>

                {view !== 'recovery' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cryptographic Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] mt-8"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      {view === 'login' && 'Authenticate'}
                      {view === 'register' && 'Establish Account'}
                      {view === 'recovery' && 'Send Recovery Protocol'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-3">
                {view === 'login' ? (
                  <>
                    <button onClick={() => setView('recovery')} className="text-sm text-cyan-400 hover:text-cyan-300 block w-full">
                      Forgot encryption key?
                    </button>
                    <p className="text-sm text-slate-500">
                      Not in the registry?{' '}
                      <button onClick={() => setView('register')} className="text-white hover:text-cyan-400 font-medium">
                        Request access
                      </button>
                    </p>
                  </>
                ) : (
                  <button onClick={() => setView('login')} className="text-sm text-slate-400 hover:text-white transition-colors">
                    Return to secure login
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
