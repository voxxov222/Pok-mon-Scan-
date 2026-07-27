import React, { useState } from 'react';
import { Search, Bell, Menu, X, ShieldCheck, User } from 'lucide-react';
import { TabType } from '../types';

interface TopNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export default function TopNavigation({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
  onToggleMobileMenu,
  isMobileMenuOpen
}: TopNavigationProps) {
  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      
      {/* Left: Brand title on mobile / Page Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-300 hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-bold">
            VCA AUTHENTICATED
          </span>
        </div>
      </div>

      {/* Center: Top Nav items (Home, Portfolio, Services, Track, Account) */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')} 
          className={`transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          Portfolio
        </button>
        <button 
          onClick={() => setActiveTab('grading')} 
          className={`transition-colors cursor-pointer ${activeTab === 'grading' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab('track')} 
          className={`transition-colors cursor-pointer ${activeTab === 'track' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          Track
        </button>
        <button 
          onClick={() => setActiveTab('account')} 
          className={`transition-colors cursor-pointer ${activeTab === 'account' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          Account
        </button>
      </nav>

      {/* Right: Search, Notifications, Profile Avatar */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden xl:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search VCA serial, card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
          />
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="p-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-cyan-400 border border-slate-800 rounded-xl transition-all relative cursor-pointer"
          title="Notifications"
          id="btn-notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
        </button>

        {/* User Profile Dropdown / Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all cursor-pointer group"
          id="user-profile-btn"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs font-mono shadow-inner">
            TW
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Todd W.</div>
            <div className="text-[10px] text-slate-500 font-mono">Master Vault</div>
          </div>
        </button>
      </div>

    </header>
  );
}
