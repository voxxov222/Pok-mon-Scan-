import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  ShieldAlert, 
  Store, 
  QrCode, 
  HelpCircle, 
  Settings,
  Cpu,
  Sparkles,
  Camera
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  portfolioCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, portfolioCount }: SidebarProps) {
  const navItems: Array<{ id: TabType; label: string; icon: any; badge?: string }> = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pokevault' as TabType, label: 'PokeVault AI Scanner', icon: Camera },
    { id: 'portfolio' as TabType, label: `My Portfolio (${portfolioCount})`, icon: FolderKanban },
    { id: 'grading' as TabType, label: 'VCA Grading', icon: Award },
    { id: 'vault' as TabType, label: 'Vault Manager', icon: ShieldAlert },
    { id: 'marketplace' as TabType, label: 'Marketplace', icon: Store },
    { id: 'track' as TabType, label: 'Track / Verify', icon: QrCode },
    { id: 'support' as TabType, label: 'Support', icon: HelpCircle },
    { id: 'account' as TabType, label: 'Account', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900/80 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-900/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-wider text-white">VCA</h1>
            <p className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Verified Card Auth</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
                id={`sidebar-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {/* @ts-ignore */}
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status footer widget */}
      <div className="p-4 m-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">NFC Node:</span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Ledger Sync:</span>
          <span className="text-cyan-400 font-bold">BLOCK #88219</span>
        </div>
      </div>
    </aside>
  );
}
