import { useState, useMemo, useEffect } from 'react';
import { Camera, LogIn, TrendingUp, Search, ShieldAlert, Bell, Fingerprint, Sparkles, Filter, Layers, MessageSquare, ExternalLink, Plus, BookOpen, Grid as GridIcon } from 'lucide-react';
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
import { ManualCardSearchModal } from './components/ManualCardSearchModal';
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

import { TrendingCardsWidget } from './components/Dashboard/TrendingCardsWidget';
import { NewsFeedWidget } from './components/Dashboard/NewsFeedWidget';
import { ToastContainer, ToastMessage } from './components/Toast';
import { RefreshCw } from 'lucide-react';

interface BatchProgressItem {
  id: number;
  status: 'pending' | 'processing' | 'done' | 'failed';
  cardName?: string;
  error?: string;
}

export default function App() {
  const { user, loading, cards, addCard, removeCard, toggleTradeStatus, importCards } = useCards();
  const { alerts, unreadCount, requestNotificationPermission, markAllAsRead } = usePriceAlerts(cards);

  const [activeTab, setActiveTab] = useState<'collection' | 'trades' | 'forum'>('collection');
  const [showScanner, setShowScanner] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<CardData | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnergyFilter, setSelectedEnergyFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'binders'>('grid');
  const [expandedBinder, setExpandedBinder] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState('');
  const [batchProgress, setBatchProgress] = useState<BatchProgressItem[]>([]);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Failed Scan Queue (Offline / Retries)
  const [failedScanQueue, setFailedScanQueue] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pokevault_pending_scans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const addToast = (type: 'success' | 'error' | 'info', message: string, actionText?: string, onAction?: () => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, actionText, onAction }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const saveFailedScan = (imageBase64: string) => {
    setFailedScanQueue(prev => {
      const next = [...prev, imageBase64];
      localStorage.setItem('pokevault_pending_scans', JSON.stringify(next));
      return next;
    });
  };

  const clearFailedQueue = () => {
    setFailedScanQueue([]);
    localStorage.removeItem('pokevault_pending_scans');
  };

  // Card Removal with 5-second Undo
  const handleRemoveCardWithUndo = async (cardId: string) => {
    const cardToRemove = cards.find(c => c.id === cardId);
    if (!cardToRemove) return;

    try {
      await removeCard(cardId);
      setSelectedCardForDetail(null);

      addToast('info', `Removed "${cardToRemove.name}" from Vault`, 'Undo', async () => {
        const { id, userId, dateScanned, ...rest } = cardToRemove;
        await addCard(rest);
        addToast('success', `Restored "${cardToRemove.name}" to Vault!`);
      });
    } catch (err: any) {
      addToast('error', `Failed to remove card: ${err?.message || err}`);
    }
  };

  // Batch Processing
  const handleBatchScanStart = async (images: string[]) => {
    setShowScanner(false);
    if (!images || images.length === 0) return;
    
    setIsAnalyzing(true);
    const initialItems: BatchProgressItem[] = images.map((_, idx) => ({
      id: idx + 1,
      status: 'pending'
    }));
    setBatchProgress(initialItems);

    let successCount = 0;
    
    for (let i = 0; i < images.length; i++) {
      setAnalyzeStep(`Processing card ${i + 1} of ${images.length}...`);
      setBatchProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'processing' } : item));
      
      try {
        const response = await fetch('/api/scan-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: images[i] })
        });
        
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 429 || data.code === 'QUOTA_EXCEEDED') {
            setIsAnalyzing(false);
            addToast('error', 'Gemini AI quota reached. Queueing remaining scans.');
            // Queue remaining images
            for (let j = i; j < images.length; j++) {
              saveFailedScan(images[j]);
            }
            setShowManualSearch(true);
            return;
          }
          throw new Error(data.error || "Failed to scan card");
        }
        
        await addCard(data);
        successCount++;
        setBatchProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'done', cardName: data.name } : item));
      } catch (err: any) {
        saveFailedScan(images[i]);
        setBatchProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'failed', error: err.message } : item));
      }
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setBatchProgress([]);
    }, 1500);

    if (successCount > 0) {
      addToast('success', `Batch scan complete! Added ${successCount} cards to Vault.`);
    } else {
      addToast('error', "Batch scan failed. Saved captures to pending queue.");
    }
  };

  // Single Card Processing
  const handleScanStart = async (imageBase64: string) => {
    setShowScanner(false);
    setIsAnalyzing(true);
    setAnalyzeStep('Identifying card name, set & rarity...');

    setTimeout(() => {
      setAnalyzeStep('Assessing centering, edges, surface & corners...');
    }, 1500);

    setTimeout(() => {
      setAnalyzeStep('Researching live prices across TCGPlayer & PriceCharting...');
    }, 3200);

    try {
      const response = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429 || data.code === 'QUOTA_EXCEEDED') {
          setIsAnalyzing(false);
          addToast('error', 'Gemini AI Vision daily quota limit reached.', 'Search TCG', () => {
            setShowManualSearch(true);
          });
          saveFailedScan(imageBase64);
          return;
        }
        throw new Error(data.error || "Failed to scan card");
      }
      
      await addCard(data);
      addToast('success', `Added ${data.name} to your Vault!`);
    } catch (err: any) {
      saveFailedScan(imageBase64);
      addToast('error', err.message || "An error occurred during Gemini AI analysis. Saved to retry queue.", 'Search TCG', () => {
        setShowManualSearch(true);
      });
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

  const groupedCardsBySet = useMemo(() => {
    const groups: Record<string, CardData[]> = {};
    filteredCards.forEach(card => {
      const set = card.set || 'Unknown Set';
      if (!groups[set]) groups[set] = [];
      groups[set].push(card);
    });
    // sort groups by number of cards desc
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filteredCards]);

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
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

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
          {failedScanQueue.length > 0 && (
            <button 
              onClick={async () => {
                const retryItems = [...failedScanQueue];
                clearFailedQueue();
                await handleBatchScanStart(retryItems);
              }}
              className="p-2 text-amber-300 hover:bg-amber-500/20 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold bg-amber-500/10 border border-amber-500/40 px-3 animate-pulse"
              title="Retry queued scans"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest">Retry ({failedScanQueue.length})</span>
            </button>
          )}

          <button 
            onClick={() => setShowScanner(true)}
            className="p-2 text-primary hover:bg-white/10 rounded-full transition-colors flex items-center justify-center border border-primary/50 bg-primary/10 shadow-lg shadow-primary/20"
            title="Scan Pokémon Card with AI Camera"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowManualSearch(true)}
            className="p-2 text-white/80 hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold bg-white/5 rounded-full px-3 border border-white/10"
            title="Manual Card Search"
          >
            <Search className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-white/80">Search TCG</span>
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

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TrendingCardsWidget />
              <NewsFeedWidget />
            </div>

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
                
                <div className="flex bg-[#12121a] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                    title="Grid View"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('binders')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'binders' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                    title="Binder View"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {filteredCards.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] flex flex-col items-center justify-center space-y-4">
                  <Layers className="w-10 h-10 text-white/20 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-white/70">Your Vault is Empty</p>
                    <p className="text-xs text-white/40 mt-1 max-w-sm">Scan a Pokémon card using your camera or search the official Pokémon TCG catalog manually!</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <button 
                      onClick={() => setShowScanner(true)}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                      <Camera className="w-4 h-4" /> Live Camera Scan
                    </button>
                    <button 
                      onClick={() => setShowManualSearch(true)}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
                    >
                      <Search className="w-4 h-4 text-primary" /> Search TCG Catalog
                    </button>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCards.map(card => (
                    <PhysicalCard 
                      key={card.id} 
                      card={card} 
                      onClick={() => setSelectedCardForDetail(card)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedCardsBySet.map(([setName, setCards]) => {
                    const isExpanded = expandedBinder === setName;
                    const totalValue = setCards.reduce((acc, c) => acc + (c.highPrice || c.lowPrice || 0), 0);
                    return (
                      <div key={setName} className="bg-[#12121a] border border-white/10 rounded-3xl overflow-hidden shadow-xl transition-all">
                        {/* Binder Header */}
                        <div 
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                          onClick={() => setExpandedBinder(isExpanded ? null : setName)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-primary">
                              <BookOpen className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] font-bold tracking-widest uppercase">{setCards.length}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg tracking-tight">{setName}</h3>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">Series Binder</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="hidden sm:block">
                              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-0.5">Total Value</span>
                              <span className="text-sm font-mono font-bold text-primary">${totalValue.toFixed(2)}</span>
                            </div>
                            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              <Filter className="w-5 h-5 text-white/30" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Cards Grid */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/10"
                            >
                              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20">
                                {setCards.map(card => (
                                  <PhysicalCard 
                                    key={card.id} 
                                    card={card} 
                                    onClick={() => setSelectedCardForDetail(card)}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#12121a]/95 backdrop-blur-md border border-primary/50 shadow-[0_0_30px_rgba(255,203,5,0.2)] rounded-2xl p-4 flex flex-col gap-3 z-50 w-[90%] max-w-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 border border-primary/30">
                <Camera className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white tracking-tight">Gemini AI Processing</h3>
                <p className="text-[10px] text-primary font-mono mt-0.5 font-bold truncate">{analyzeStep}</p>
              </div>
            </div>

            {/* Batch Progress List */}
            {batchProgress.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border-t border-white/10 pt-2 text-xs">
                {batchProgress.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg font-mono text-[11px]">
                    <span className="text-white/70">Card #{item.id} {item.cardName && `• ${item.cardName}`}</span>
                    <span className={`font-bold ${
                      item.status === 'done' ? 'text-emerald-400' :
                      item.status === 'processing' ? 'text-primary animate-pulse' :
                      item.status === 'failed' ? 'text-red-400' : 'text-white/30'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showScanner && (
          <CameraScanner 
            onCancel={() => setShowScanner(false)}
            onScanStart={handleScanStart}
            onBatchScanStart={handleBatchScanStart}
            onOpenManualSearch={() => setShowManualSearch(true)}
            onScanComplete={async (result) => {
              await addCard(result);
              setShowScanner(false);
            }}
          />
        )}

        {showManualSearch && (
          <ManualCardSearchModal 
            onClose={() => setShowManualSearch(false)}
            onAddCard={async (card) => {
              await addCard(card);
              addToast('success', `Added ${card.name} to Vault!`);
            }}
          />
        )}

        {selectedCardForDetail && (
          <CardDetailModal 
            card={selectedCardForDetail}
            onClose={() => setSelectedCardForDetail(null)}
            onRemove={async (id) => {
              await handleRemoveCardWithUndo(id);
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
              addToast('success', `Imported ${imported.length} cards from backup!`);
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
