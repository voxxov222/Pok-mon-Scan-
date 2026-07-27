import React, { useState } from 'react';
import JSZip from 'jszip';
import { CardData } from '../types';
import { Download, Upload, FileArchive, CheckCircle2, AlertCircle, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZipUpgradeModalProps {
  cards: CardData[];
  onImportCards: (importedCards: Omit<CardData, 'id' | 'userId' | 'dateScanned'>[]) => Promise<void>;
  onClose: () => void;
}

export function ZipUpgradeModal({ cards, onImportCards, onClose }: ZipUpgradeModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Export Collection into a ZIP package
  const handleExportZip = async () => {
    setIsProcessing(true);
    setError(null);
    setStatusMessage("Packaging PokéVault card database and AI grades into ZIP archive...");

    try {
      const zip = new JSZip();

      // Manifest
      const manifest = {
        app: "PokéVault",
        version: "2.5.0",
        exportDate: new Date().toISOString(),
        totalCards: cards.length,
        formatVersion: 1
      };

      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("collection.json", JSON.stringify(cards, null, 2));

      // Individual Card JSON files folder
      const cardsFolder = zip.folder("cards");
      if (cardsFolder) {
        cards.forEach((card, index) => {
          const fileName = `${card.name.replace(/[^a-zA-Z0-9]/g, '_')}_${card.cardNumber.replace('/', '-')}.json`;
          cardsFolder.file(fileName, JSON.stringify(card, null, 2));
        });
      }

      // Generate Zip blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);

      // Trigger browser download
      const a = document.createElement("a");
      a.href = url;
      a.download = `PokeVault_Backup_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage("ZIP file created and downloaded successfully!");
      setIsProcessing(false);
    } catch (err: any) {
      console.error("Export error:", err);
      setError("Failed to create ZIP package: " + err.message);
      setIsProcessing(false);
    }
  };

  // Import / Install ZIP file archive
  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setError("Please select a valid .zip archive file.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatusMessage("Extracting and verifying ZIP package contents...");

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      // Find collection.json or individual card files
      const collectionFile = loadedZip.file("collection.json");
      let cardListToImport: Omit<CardData, 'id' | 'userId' | 'dateScanned'>[] = [];

      if (collectionFile) {
        const text = await collectionFile.async("text");
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          cardListToImport = parsed.map(c => {
            const { id, userId, dateScanned, ...rest } = c;
            return rest;
          });
        }
      } else {
        // Fallback: Read files inside cards/ folder
        const cardsFolder = loadedZip.folder("cards");
        if (cardsFolder) {
          const files = Object.keys(cardsFolder.files).filter(f => f.endsWith('.json'));
          for (const fileName of files) {
            const fileData = await cardsFolder.files[fileName].async("text");
            const cardObj = JSON.parse(fileData);
            const { id, userId, dateScanned, ...rest } = cardObj;
            cardListToImport.push(rest);
          }
        }
      }

      if (cardListToImport.length === 0) {
        throw new Error("No valid card collection data found in this ZIP file.");
      }

      setStatusMessage(`Importing ${cardListToImport.length} cards into your Vault...`);
      await onImportCards(cardListToImport);

      setImportedCount(cardListToImport.length);
      setStatusMessage(`Successfully imported ${cardListToImport.length} cards into your Vault!`);
      setIsProcessing(false);
    } catch (err: any) {
      console.error("Zip import error:", err);
      setError("Failed to install ZIP file upgrade: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121a] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-white/50 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary border border-primary/30 rounded-2xl">
            <FileArchive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">ZIP Package System</h3>
            <p className="text-xs text-white/50">Export full vault backups or install ZIP collection packages</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest">
          <button 
            onClick={() => { setActiveTab('export'); setError(null); setStatusMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'export' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" /> Export ZIP Backup
          </button>
          <button 
            onClick={() => { setActiveTab('import'); setError(null); setStatusMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'import' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" /> Install ZIP Upgrade
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs text-white/70">
              <div className="flex justify-between font-bold text-white">
                <span>Vault Cards Ready to Export:</span>
                <span className="text-primary font-mono">{cards.length} Cards</span>
              </div>
              <p>
                Generates a compressed `.zip` package containing your complete card database, AI grading score sheets, sub-grade notes, and market price source links.
              </p>
            </div>

            <button 
              onClick={handleExportZip}
              disabled={isProcessing || cards.length === 0}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              {isProcessing ? 'Generating ZIP Archive...' : 'Download Collection (.ZIP)'}
            </button>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-xs text-white/70 space-y-2">
              <span className="font-bold text-white block">Install External ZIP Upgrade File:</span>
              <p>Upload a `.zip` file package containing `collection.json` or card definitions to sync or upgrade your PokéVault collection.</p>
            </div>

            <label className="block w-full border-2 border-dashed border-white/20 hover:border-primary/50 bg-black/30 rounded-2xl p-6 text-center cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-xs font-bold text-white block">Click or Drop ZIP File Here</span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mt-1">Accepts .ZIP archives</span>
              <input 
                type="file" 
                accept=".zip" 
                onChange={handleZipUpload} 
                disabled={isProcessing}
                className="hidden" 
              />
            </label>
          </div>
        )}

        {/* Status or Error Notifications */}
        {statusMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2 text-xs text-red-400 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 text-[10px] text-white/40 uppercase font-bold tracking-widest">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Standard JSZip Core Engine
          </span>
          <button onClick={onClose} className="text-white hover:underline">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
