import { useState, useMemo } from 'react';
import { Camera, LogIn, TrendingUp, Search, ShieldAlert, Bell, Fingerprint, Sparkles, Filter, Layers, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { auth, googleProvider } from './firebase';
import { useCards } from './hooks/useCards';
import { usePriceAlerts } from './hooks/usePriceAlerts';
import { CameraScanner } from './components/CameraScanner';
import { PhysicalCard } from './components/PhysicalCard';
import { CardDetailModal } from './components/CardDetailModal';
import { TradeMarketplace } from './components/Community/TradeMarketplace';
import { CommunityForum } from './components/Community/CommunityForum';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { ZipUpgradeModal } from './components/ZipUpgradeModal';
import { FileArchive } from 'lucide-react';
import { CardData, EnergyType } from './types';

function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login error:", e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Foil Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-purple-600/10 to-red-600/10 pointer-events-none" />

      <div className="w-20 h-20 bg-primary/20 border border-primary/30 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative z-10">
        <Camera className="w-10 h-10 text-primary animate-pulse" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 z-10">
        POKÉ<span className="text-primary">SCAN</span> AI
      </h1>
      <p className="text-white/60 mb-8 max-w-sm text-xs sm:text-sm z-10 leading-relaxed font-sans">
        Live camera Pokémon card scanner, 4-point AI grading analysis, live pricing research, and community trading.
      </p>
      
      <button 
        onClick={handleLogin}
        disabled={loading}
        className="z-10 w-full max-w-xs bg-primary hover:bg-primary-hover text-black py-3.5 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 hover:scale-105 disabled:opacity-70"
      >
        <LogIn className="w-4 h-4" />
        {loading ? 'Authenticating...' : 'Sign in with Google'}
      </button>

      <div className="mt-8 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/40 z-10">
        <ShieldAlert className="w-4 h-4 text-emerald-400" />
        <p>Firebase Realtime Sync & Offline Cache</p>
      </div>
    </div>
  );
}

function PortfolioChart({ cards }: { cards: CardData[] }) {
  const data = useMemo(() => {
    const sorted = [...cards].sort((a, b) => a.dateScanned - b.dateScanned);
    let cumulativeValue = 0;
    return sorted.map(card => {
      cumulativeValue += card.highPrice || 0;
      return {
        date: format(new Date(card.dateScanned), 'MMM dd'),
        value: cumulativeValue,
        name: card.name
      };
    });
  }, [cards]);

  const totalValue = data.length > 0 ? data[data.length - 1].value : 0;

  if (cards.length === 0) {
    return (
      <div className="bg-[#12121a] rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center min-h-[180px] text-center">
        <p className="text-sm font-bold text-white/50">Your Vault is Empty</p>
        <p className="text-xs text-white/40 mt-1">Tap the camera icon to scan and appraise your first Pokémon card!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">
            Total Vault Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            ${totalValue.toFixed(2)}
          </h2>
        </div>
        <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live Index</span>
        </div>
      </div>
      
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFCB05" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#FFCB05" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#FFCB05', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke="#FFCB05" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading, cards, addCard, removeCard, toggleTradeStatus, importCards } = useCards();
  const { alerts, unreadCount, requestNotificationPermission, markAllAsRead } = usePriceAlerts(cards);

  const [activeTab, setActiveTab] = useState<'collection' | 'trades' | 'forum'>('collection');
  const [showScanner, setShowScanner] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<CardData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnergyFilter, setSelectedEnergyFilter] = useState<string>('ALL');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState('');

  const handleScanStart = async (imageBase64: string) => {
    setShowScanner(false);
    setIsAnalyzing(true);
    setAnalyzeStep('Identifying card name, set & rarity...');

    setTimeout(() => {
      setAnalyzeStep('Assessing centering, edges, surface & corners...');
    }, 2000);

    setTimeout(() => {
      setAnalyzeStep('Researching live prices across TCGPlayer, PriceCharting & eBay...');
    }, 4500);

    try {
      const response = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to scan card");
      }
      
      await addCard(data);
    } catch (err: any) {
      alert(err.message || "An error occurred during Gemini AI analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = (card.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (card.set || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEnergy = selectedEnergyFilter === 'ALL' || card.energyType === selectedEnergyFilter;
      return matchesSearch && matchesEnergy;
    });
  }, [cards, searchTerm, selectedEnergyFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center font-bold text-sm tracking-widest uppercase">
        Initializing PokéVault Core...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-[#12121a] sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-black rounded-xl flex items-center justify-center font-black italic text-sm shadow-md">
            PK
          </div>
          <span className="text-lg font-black tracking-tight hidden sm:inline">
            POKÉ<span className="text-primary">VAULT</span>
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest">
          <button 
            onClick={() => setActiveTab('collection')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'collection' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
          >
            Vault
          </button>
          <button 
            onClick={() => setActiveTab('trades')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'trades' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
          >
            Trades
          </button>
          <button 
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'forum' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
          >
            Forum
          </button>
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setShowScanner(true)}
            className="p-2 text-primary hover:bg-white/10 rounded-full transition-colors flex items-center justify-center border border-primary/50 bg-primary/10 shadow-lg shadow-primary/20"
            title="Scan Pokémon Card"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowZipModal(true)}
            className="p-2 text-white/70 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="ZIP Upgrade & Backup System"
          >
            <FileArchive className="w-5 h-5 text-primary" />
            <span className="hidden md:inline uppercase text-[10px] tracking-widest text-primary">ZIP System</span>
          </button>

          <button 
            onClick={() => setShowAlertsModal(true)}
            className="p-2 text-white/70 hover:text-primary transition-colors relative"
            title="Price Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button 
            onClick={() => setShowBiometricModal(true)}
            className="p-2 text-white/70 hover:text-primary transition-colors"
            title="Biometric Protection"
          >
            <Fingerprint className="w-5 h-5" />
          </button>

          <button 
            onClick={() => auth.signOut()}
            className="text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors ml-2"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-24">
        {activeTab === 'collection' && (
          <>
            <PortfolioChart cards={cards} />

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter collection by card name or set..."
                  className="w-full bg-[#12121a] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-widest">
                {['ALL', 'Fire', 'Water', 'Grass', 'Lightning', 'Psychic', 'Darkness'].map(energy => (
                  <button
                    key={energy}
                    onClick={() => setSelectedEnergyFilter(energy)}
                    className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap border ${
                      selectedEnergyFilter === energy 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-[#12121a] text-white/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {energy}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Grid */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Collection Cards ({filteredCards.length})
                </span>
              </div>

              {filteredCards.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                  <Layers className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white/60">No matching cards found</p>
                  <p className="text-xs text-white/40 mt-1">Scan a Pokémon card using the camera scanner below!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.map(card => (
                    <PhysicalCard 
                      key={card.id} 
                      card={card} 
                      onClick={() => setSelectedCardForDetail(card)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'trades' && <TradeMarketplace />}
        {activeTab === 'forum' && <CommunityForum />}
      </main>

      {/* Analyzing Overlay State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#12121a]/90 backdrop-blur-md border border-primary/50 shadow-[0_0_30px_rgba(255,203,5,0.2)] rounded-2xl p-4 flex items-center gap-4 z-50 w-[90%] max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-white tracking-tight">AI Processing</h3>
              <p className="text-[10px] text-primary font-mono mt-0.5 font-bold truncate">{analyzeStep}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showScanner && (
          <CameraScanner 
            onCancel={() => setShowScanner(false)}
            onScanStart={handleScanStart}
            onScanComplete={async (result) => {
              await addCard(result);
              setShowScanner(false);
            }}
          />
        )}

        {selectedCardForDetail && (
          <CardDetailModal 
            card={selectedCardForDetail}
            onClose={() => setSelectedCardForDetail(null)}
            onRemove={async (id) => {
              await removeCard(id);
              setSelectedCardForDetail(null);
            }}
            onToggleTrade={async (id, isForTrade, tradeWants) => {
              await toggleTradeStatus(id, isForTrade, tradeWants);
            }}
          />
        )}

        {showAlertsModal && (
          <PriceAlertsModal 
            alerts={alerts}
            onClose={() => setShowAlertsModal(false)}
            onRequestPush={requestNotificationPermission}
            onMarkRead={markAllAsRead}
          />
        )}

        {showBiometricModal && (
          <BiometricAuthModal 
            onUnlocked={() => setShowBiometricModal(false)}
            onClose={() => setShowBiometricModal(false)}
          />
        )}

        {showZipModal && (
          <ZipUpgradeModal 
            cards={cards}
            onImportCards={async (imported) => {
              await importCards(imported);
            }}
            onClose={() => setShowZipModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <footer className="h-8 bg-[#12121a] border-t border-white/10 px-6 flex items-center justify-between text-[9px] text-white/30 tracking-widest uppercase font-bold flex-shrink-0 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex gap-4">
          <span>Database: Offline Persistent</span>
          <span className="hidden sm:inline">• Sync: Realtime</span>
        </div>
        <div>
          <span className="text-primary font-bold">Biometric Security Enabled</span>
        </div>
      </footer>
    </div>
  );
}
