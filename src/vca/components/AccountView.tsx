import React, { useState } from 'react';
import { Settings, User, ShieldCheck, Bell, CreditCard, Radio, CheckCircle2 } from 'lucide-react';

export default function AccountView() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-4xl mx-auto">
      
      <div>
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          User Security & Preferences
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">Account Settings</h2>
        <p className="text-slate-400 text-sm md:text-base">
          Manage your VCA Master Vault credentials, hardware NFC keys, and billing preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <h3 className="text-lg font-display font-bold text-white">Profile Credentials</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Full Collector Name</label>
            <input type="text" defaultValue="Todd William" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Email Address</label>
            <input type="email" defaultValue="todd.william@vca-authority.io" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Vault Security Level</label>
            <input type="text" disabled defaultValue="Tier 3 — Master Hardware Key" className="w-full bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-xs text-cyan-400 font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Connected NFC Readers</label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono flex items-center justify-between">
              <span className="flex items-center gap-2"><Radio className="w-3.5 h-3.5 animate-pulse" /> iPhone Secure Element Active</span>
              <span className="text-slate-500">Synced</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {saved ? (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved Successfully
            </span>
          ) : <span />}
          <button type="submit" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer">
            Save Changes
          </button>
        </div>
      </form>

    </div>
  );
}
