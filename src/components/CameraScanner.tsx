import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Zap, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onScanComplete: (result: any) => void;
  onScanStart?: (imageBase64: string) => void;
  onBatchScanStart?: (images: string[]) => void;
  onCancel: () => void;
}

export function CameraScanner({ onScanComplete, onScanStart, onBatchScanStart, onCancel }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('Capturing frame...');
  const [imageCaptured, setImageCaptured] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState<string[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err: any) {
      setError("Failed to access live camera stream. Please check browser permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImageCaptured(dataUrl);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  };

  const retakeImage = () => {
    setImageCaptured(null);
    startCamera();
  };

  const analyzeImage = async () => {
    if (!imageCaptured) return;
    
    // If onScanStart is provided, hand off to parent immediately
    if (onScanStart) {
      onScanStart(imageCaptured);
      return;
    }

    setIsScanning(true);
    setScanStep('Identifying card name, set & rarity...');

    setTimeout(() => {
      setScanStep('Assessing centering, edges, surface & corners...');
    }, 1500);

    setTimeout(() => {
      setScanStep('Researching live prices across TCGPlayer, PriceCharting & eBay...');
    }, 3200);

    try {
      const response = await fetch('/api/scan-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: imageCaptured })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to scan card");
      }
      
      onScanComplete(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during Gemini AI analysis.");
      setIsScanning(false);
    }
  };

  if (isMinimized) {
    return (
      <motion.div 
        drag 
        dragConstraints={{ left: 0, right: window.innerWidth - 150, top: 0, bottom: window.innerHeight - 200 }}
        dragMomentum={false}
        className="fixed z-50 top-20 right-4 w-36 h-48 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/50 flex flex-col cursor-move"
      >
        <div className="absolute top-0 inset-x-0 p-2 flex justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
           <button 
             onClick={() => setIsMinimized(false)} 
             className="pointer-events-auto p-1 bg-black/50 rounded hover:text-primary transition-colors text-white"
             title="Maximize"
           >
             <Maximize2 className="w-4 h-4" />
           </button>
           <button 
             onClick={onCancel} 
             className="pointer-events-auto p-1 bg-black/50 rounded hover:text-red-400 transition-colors text-white"
             title="Close"
           >
             <X className="w-4 h-4" />
           </button>
        </div>
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {!imageCaptured && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}
          {imageCaptured && (
            <img 
              src={imageCaptured} 
              alt="Captured" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
            />
          )}
          <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-2 rounded-xl pointer-events-none" />
        </div>
        <div className="p-2 bg-[#12121a] flex justify-center">
          {!imageCaptured ? (
            <button onClick={captureImage} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform pointer-events-auto">
              <Camera className="w-4 h-4" />
            </button>
          ) : (
             <div className="flex gap-1 w-full pointer-events-auto">
               <button onClick={retakeImage} className="flex-1 py-1 bg-white/10 rounded text-[10px] font-bold text-white hover:bg-white/20">↻</button>
               <button onClick={analyzeImage} className="flex-1 py-1 bg-primary rounded text-[10px] font-bold text-black hover:bg-primary-hover"><Sparkles className="w-3 h-3 mx-auto" /></button>
             </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] text-white flex flex-col">
      {/* Top Header */}
      <div className="p-4 flex justify-between items-center bg-[#12121a]/90 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">AI Live Camera Scanner</h2>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">PokéVault Vision Core v2.5</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle for Batch Mode */}
          <div className="hidden sm:flex bg-black/50 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setIsBatchMode(false)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${!isBatchMode ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
            >Single</button>
            <button 
              onClick={() => setIsBatchMode(true)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${isBatchMode ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
            >Batch</button>
          </div>
          <button onClick={() => setIsMinimized(true)} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Canvas */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {error ? (
          <div className="p-6 text-center text-red-400 bg-red-500/10 rounded-2xl m-4 border border-red-500/20 max-w-md space-y-3">
            <p className="text-sm font-bold">{error}</p>
            <button onClick={startCamera} className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 text-xs font-bold uppercase tracking-widest text-white">
              Try Again
            </button>
          </div>
        ) : (
          <>
            {!imageCaptured && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {imageCaptured && (
              <img 
                src={imageCaptured} 
                alt="Captured Pokémon Card" 
                className="absolute inset-0 w-full h-full object-contain bg-[#0a0a0f]" 
              />
            )}
            
            {/* Card-Shaped Viewfinder Guide Frame */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-64 h-96 sm:w-80 sm:h-[450px] border-2 border-dashed border-primary/50 rounded-2xl shadow-[inset_0_0_60px_rgba(255,203,5,0.15)] flex flex-col justify-between p-4">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Animated Scan Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line-anim shadow-[0_0_15px_#FFCB05]" />

                <div className="text-center pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/20 text-primary">
                    Align Card in Frame
                  </span>
                </div>

                <div className="text-center pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-white/50">
                    Auto-Detects Card ID & AI Grade
                  </span>
                </div>
              </div>
            </div>
            
            {/* Analyzing Overlay State */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-xl">
                    <Zap className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Gemini AI Processing</h3>
                    <p className="text-xs text-primary font-mono mt-1 font-bold">{scanStep}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Bottom Controls */}
      {!error && !isScanning && (
        <div className="p-6 bg-[#12121a] border-t border-white/10 flex flex-col justify-center items-center gap-4">
          {!imageCaptured ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <button 
                onClick={captureImage}
                className="w-20 h-20 rounded-full border-4 border-primary/40 flex items-center justify-center p-1 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-primary/20"
              >
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-black">
                  <Camera className="w-8 h-8" />
                </div>
              </button>
              
              {isBatchMode && batchQueue.length > 0 && (
                <button 
                  onClick={() => {
                    if (onBatchScanStart) onBatchScanStart(batchQueue);
                  }}
                  className="w-full max-w-sm py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover font-bold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" /> Process Batch ({batchQueue.length} Cards)
                </button>
              )}
            </div>
          ) : (
            <div className="flex w-full max-w-md gap-4">
              <button 
                onClick={retakeImage}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-widest transition-colors text-white"
              >
                Retake
              </button>
              
              {isBatchMode ? (
                <button 
                  onClick={() => {
                    setBatchQueue(prev => [...prev, imageCaptured]);
                    setImageCaptured(null);
                    startCamera();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 font-bold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Add to Queue
                </button>
              ) : (
                <button 
                  onClick={analyzeImage}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover font-bold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                  <Sparkles className="w-4 h-4" /> Appraise Card
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
