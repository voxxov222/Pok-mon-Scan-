import PokeVaultApp from '../PokeVaultApp';
import React, { useState } from 'react';
import { TabType, CardItem } from './types';
import { mockCards } from './data/mockData';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import DashboardView from './components/DashboardView';
import PortfolioView from './components/PortfolioView';
import GradingView from './components/GradingView';
import VaultManagerView from './components/VaultManagerView';
import MarketplaceView from './components/MarketplaceView';
import TrackVerifyView from './components/TrackVerifyView';
import SupportView from './components/SupportView';
import AccountView from './components/AccountView';
import BlueprintArtifact from './components/BlueprintArtifact';
import CertificateModal from './components/CertificateModal';
import NfcSimulationModal from './components/NfcSimulationModal';
import AddCardModal from './components/AddCardModal';

export default function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cards, setCards] = useState<CardItem[]>(mockCards);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedCardForCert, setSelectedCardForCert] = useState<CardItem | null>(null);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddCard = (newCard: CardItem) => {
    setCards([newCard, ...cards]);
  };

  if (!hasEnteredApp) {
    return (
      <div className="min-h-screen bg-[#050608] flex flex-col relative selection:bg-cyan-500/30">
        <BlueprintArtifact />
        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center z-50 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-transparent pointer-events-none">
          <button 
            onClick={() => setHasEnteredApp(true)}
            className="pointer-events-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:-translate-y-1 font-mono flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-500"
          >
            <span>Launch Command Center</span>
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Persistent Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }} 
        portfolioCount={cards.length} 
      />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setActiveTab('account')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-900 p-6 space-y-3 z-30 animate-in slide-in-from-top duration-300">
            {[
              { id: 'dashboard' as TabType, label: 'Dashboard' },
              { id: 'pokevault' as TabType, label: 'PokeVault AI Scanner' },
              { id: 'portfolio' as TabType, label: 'My Portfolio' },
              { id: 'grading' as TabType, label: 'VCA Grading' },
              { id: 'vault' as TabType, label: 'Vault Manager' },
              { id: 'marketplace' as TabType, label: 'Marketplace' },
              { id: 'track' as TabType, label: 'Track / Verify' },
              { id: 'support' as TabType, label: 'Support' },
              { id: 'account' as TabType, label: 'Account' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider ${
                  activeTab === tab.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'pokevault' && (
            <div className="bg-[#0a0a0f] rounded-3xl overflow-hidden min-h-[80vh] border border-white/10 relative">
              <PokeVaultApp />
            </div>
          )}
          {activeTab === 'dashboard' && (
            <DashboardView 
              cards={cards}
              onSelectCard={(card) => setSelectedCardForCert(card)}
              onOpenCertificate={(card) => setSelectedCardForCert(card)}
              onOpenNfcModal={() => setIsNfcModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView 
              cards={cards}
              onSelectCard={(card) => setSelectedCardForCert(card)}
              onOpenAddCard={() => setIsAddCardModalOpen(true)}
              onOpenCertificate={(card) => setSelectedCardForCert(card)}
            />
          )}

          {activeTab === 'grading' && <GradingView />}

          {activeTab === 'vault' && (
            <VaultManagerView 
              cards={cards}
              onSelectCard={(card) => setSelectedCardForCert(card)}
              onOpenCertificate={(card) => setSelectedCardForCert(card)}
            />
          )}

          {activeTab === 'marketplace' && <MarketplaceView />}

          {activeTab === 'track' && (
            <TrackVerifyView 
              onOpenCertificate={(card) => setSelectedCardForCert(card)}
            />
          )}

          {activeTab === 'support' && <SupportView />}

          {activeTab === 'account' && <AccountView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 px-8 text-center text-xs font-mono text-slate-500">
          © {new Date().getFullYear()} Verified Card Authority (VCA). Secure NFC Authentication Ledger & Vault.
        </footer>
      </div>

      {/* Modals */}
      <CertificateModal 
        card={selectedCardForCert}
        onClose={() => setSelectedCardForCert(null)}
      />

      <NfcSimulationModal 
        isOpen={isNfcModalOpen}
        onClose={() => setIsNfcModalOpen(false)}
      />

      <AddCardModal 
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddCard={handleAddCard}
      />

      {/* Notifications Drawer Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsNotificationsOpen(false)} />
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full z-10 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="font-display font-bold text-white text-base">System Notifications</h3>
              <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold">NFC Scan Verified</div>
                <div className="text-slate-400 mt-1">Charizard #4 tapped successfully via iOS Secure Element.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-bold">Portfolio Appraisal Updated</div>
                <div className="text-slate-400 mt-1">Your total vault appraisal increased by +6.8% ($12,450 CAD).</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
