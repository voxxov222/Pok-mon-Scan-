import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Zap, Minimize2, Maximize2, Settings, Sliders, Sun, Eye, AlertTriangle, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onScanComplete: (result: any) => void;
  onScanStart?: (imageBase64: string) => void;
  onBatchScanStart?: (images: string[]) => void;
  onCancel: () => void;
  onOpenManualSearch?: () => void;
}

interface CameraCapabilities {
  zoom?: { min: number; max: number; step: number };
  torch?: boolean;
  focusDistance?: { min: number; max: number; step: number };
  exposureCompensation?: { min: number; max: number; step: number };
}

// Calculate Laplacian variance on canvas region to detect image sharpness/blur
function calculateBlurScore(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let sum = 0;
    let sumSq = 0;
    const sampleStep = 4;
    let count = 0;

    for (let y = sampleStep; y < height - sampleStep; y += sampleStep) {
      for (let x = sampleStep; x < width - sampleStep; x += sampleStep) {
        const idx = (y * width + x) * 4;
        const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const top = (data[((y - sampleStep) * width + x) * 4] + data[((y - sampleStep) * width + x) * 4 + 1] + data[((y - sampleStep) * width + x) * 4 + 2]) / 3;
        const bottom = (data[((y + sampleStep) * width + x) * 4] + data[((y + sampleStep) * width + x) * 4 + 1] + data[((y + sampleStep) * width + x) * 4 + 2]) / 3;
        const left = (data[(y * width + (x - sampleStep)) * 4] + data[(y * width + (x - sampleStep)) * 4 + 1] + data[(y * width + (x - sampleStep)) * 4 + 2]) / 3;
        const right = (data[(y * width + (x + sampleStep)) * 4] + data[(y * width + (x + sampleStep)) * 4 + 1] + data[(y * width + (x + sampleStep)) * 4 + 2]) / 3;

        const laplacian = top + bottom + left + right - 4 * center;
        sum += laplacian;
        sumSq += laplacian * laplacian;
        count++;
      }
    }

    if (count === 0) return 100;
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;
    return Math.max(0, variance);
  } catch (e) {
    return 100;
  }
}

export function CameraScanner({ onScanComplete, onScanStart, onBatchScanStart, onCancel, onOpenManualSearch }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectCanvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('Capturing frame...');
  const [imageCaptured, setImageCaptured] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState<string[]>([]);
  const [showBatchSuccess, setShowBatchSuccess] = useState(false);

  // Advanced Settings & Capabilities
  const [showSettings, setShowSettings] = useState(false);
  const [capabilities, setCapabilities] = useState<CameraCapabilities>({});
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [focusDistance, setFocusDistance] = useState<number>(0);
  const [exposureComp, setExposureComp] = useState<number>(0);
  const [resolution, setResolution] = useState<'720p' | '1080p' | 'max'>('720p');

  // Auto Card Detection & Guidance States
  const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState(true);
  const [guidanceMessage, setGuidanceMessage] = useState<string>('Align Card in Frame');
  const [detectStatus, setDetectStatus] = useState<'idle' | 'searching' | 'detected' | 'capturing'>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [blurWarning, setBlurWarning] = useState<boolean>(false);

  const stableCountRef = useRef(0);
  const lastCapturedHashRef = useRef<string | null>(null);

  // Load persisted settings
  useEffect(() => {
    const saved = localStorage.getItem('pokevault_camera_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.resolution) setResolution(parsed.resolution);
        if (parsed.zoomLevel) setZoomLevel(parsed.zoomLevel);
      } catch (e) {}
    }
  }, []);

  // Save settings
  const saveSettings = (newSettings: any) => {
    localStorage.setItem('pokevault_camera_settings', JSON.stringify(newSettings));
  };

  // Start camera stream with selected resolution
  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      let targetWidth = 1280;
      let targetHeight = 720;
      if (resolution === '1080p') {
        targetWidth = 1920;
        targetHeight = 1080;
      } else if (resolution === 'max') {
        targetWidth = 3840;
        targetHeight = 2160;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", 
          width: { ideal: targetWidth }, 
          height: { ideal: targetHeight } 
        } 
      });

      setStream(mediaStream);
      const track = mediaStream.getVideoTracks()[0];
      setVideoTrack(track);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Feature Detection
      if (track && typeof track.getCapabilities === 'function') {
        const caps: any = track.getCapabilities();
        const capObj: CameraCapabilities = {};

        if (caps.zoom) {
          capObj.zoom = { min: caps.zoom.min || 1, max: caps.zoom.max || 5, step: caps.zoom.step || 0.1 };
        }
        if ('torch' in caps) {
          capObj.torch = true;
        }
        if (caps.focusDistance) {
          capObj.focusDistance = { min: caps.focusDistance.min || 0, max: caps.focusDistance.max || 10, step: caps.focusDistance.step || 0.5 };
        }
        if (caps.exposureCompensation) {
          capObj.exposureCompensation = { min: caps.exposureCompensation.min || -2, max: caps.exposureCompensation.max || 2, step: caps.exposureCompensation.step || 0.5 };
        }

        setCapabilities(capObj);
      }

      setError(null);
    } catch (err: any) {
      setError("Failed to access live camera stream. Please check browser permissions.");
    }
  }, [resolution]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [resolution]);

  // Apply constraints on capability change
  const applyTrackConstraints = async (constraintObj: any) => {
    if (!videoTrack || typeof videoTrack.applyConstraints !== 'function') return;
    try {
      await videoTrack.applyConstraints({ advanced: [constraintObj] });
    } catch (err) {
      console.warn("Failed to apply camera constraint", constraintObj, err);
    }
  };

  const handleZoomChange = (val: number) => {
    setZoomLevel(val);
    applyTrackConstraints({ zoom: val });
    saveSettings({ resolution, zoomLevel: val });
  };

  const handleTorchToggle = () => {
    const nextTorch = !torchOn;
    setTorchOn(nextTorch);
    applyTrackConstraints({ torch: nextTorch });
  };

  const handleFocusChange = (val: number) => {
    setFocusDistance(val);
    applyTrackConstraints({ focusMode: 'manual', focusDistance: val });
  };

  const handleExposureChange = (val: number) => {
    setExposureComp(val);
    applyTrackConstraints({ exposureCompensation: val });
  };

  // Capture Image function with blur quality check
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Quality check (blur detection)
        const blurScore = calculateBlurScore(ctx, canvas.width, canvas.height);
        if (blurScore < 12) {
          setBlurWarning(true);
        } else {
          setBlurWarning(false);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImageCaptured(dataUrl);

        // Turn off torch if active
        if (torchOn && videoTrack) {
          applyTrackConstraints({ torch: false });
          setTorchOn(false);
        }
      }
    }
  }, [torchOn, videoTrack]);

  // Auto Card Detection Frame Loop (~4 fps)
  useEffect(() => {
    if (!isAutoDetectEnabled || imageCaptured || error || isScanning || !stream) {
      setDetectStatus('idle');
      return;
    }

    const interval = setInterval(() => {
      if (!videoRef.current || !detectCanvasRef.current) return;
      const video = videoRef.current;
      const canvas = detectCanvasRef.current;

      if (video.readyState < 2) return;

      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Analyze card center frame region
      const centerWidth = 160;
      const centerHeight = 200;
      const startX = (320 - centerWidth) / 2;
      const startY = (240 - centerHeight) / 2;

      const blurScore = calculateBlurScore(ctx, 320, 240);

      // Check center intensity structure
      const centerData = ctx.getImageData(startX, startY, centerWidth, centerHeight).data;
      let nonUniformity = 0;
      for (let i = 0; i < centerData.length - 4; i += 16) {
        nonUniformity += Math.abs(centerData[i] - centerData[i + 4]);
      }

      const isCardPresent = nonUniformity > 200;
      const isSharp = blurScore >= 10;

      if (!isCardPresent) {
        setGuidanceMessage('Align Card in Frame');
        setDetectStatus('searching');
        stableCountRef.current = 0;
      } else if (!isSharp) {
        setGuidanceMessage('Hold steady — checking focus...');
        setDetectStatus('searching');
        stableCountRef.current = 0;
      } else {
        setGuidanceMessage('Card detected — hold still!');
        setDetectStatus('detected');
        stableCountRef.current += 1;

        // Auto-capture after 2 stable frames (~800ms)
        if (stableCountRef.current >= 2 && detectStatus !== 'capturing') {
          setDetectStatus('capturing');
          setCountdown(1);

          setTimeout(() => {
            captureImage();
            setCountdown(null);
            setDetectStatus('idle');
            stableCountRef.current = 0;

            // In batch mode, auto add to queue and re-arm
            if (isBatchMode) {
              setTimeout(() => {
                const currentCanvas = canvasRef.current;
                if (currentCanvas) {
                  const dataUrl = currentCanvas.toDataURL('image/jpeg', 0.85);
                  setBatchQueue(prev => [...prev, dataUrl]);
                  setShowBatchSuccess(true);
                  setTimeout(() => setShowBatchSuccess(false), 1500);
                }
                setImageCaptured(null);
              }, 400);
            }
          }, 600);
        }
      }
    }, 350);

    return () => clearInterval(interval);
  }, [isAutoDetectEnabled, imageCaptured, error, isScanning, stream, isBatchMode, captureImage]);

  const retakeImage = () => {
    setImageCaptured(null);
    setBlurWarning(false);
  };

  const analyzeImage = async () => {
    if (!imageCaptured) return;
    
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
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Auto-Detect & Smart Capture Core</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle for Batch Mode */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setIsBatchMode(false)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${!isBatchMode ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
            >Single</button>
            <button 
              onClick={() => setIsBatchMode(true)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${isBatchMode ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
            >Batch {batchQueue.length > 0 && `(${batchQueue.length})`}</button>
          </div>

          {/* Advanced Camera Settings Gear Button */}
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-primary text-black' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
            title="Advanced Camera Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button onClick={() => setIsMinimized(true)} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Advanced Camera Settings Drawer / Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#12121a] border-b border-white/15 p-4 z-20 space-y-4 shadow-xl text-xs"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> Camera Hardware & Optics Controls
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Resolution Selector */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-2">
                <span className="font-bold text-white/80 block text-[10px] uppercase tracking-wider">Stream Resolution</span>
                <div className="flex gap-1">
                  {(['720p', '1080p', 'max'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                        resolution === res ? 'bg-primary text-black' : 'bg-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Torch / Flash Toggle */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white/80 block text-[10px] uppercase tracking-wider">Flash / Torch</span>
                  <span className="text-[9px] text-white/40 block">Eliminate foil card glare</span>
                </div>
                {capabilities.torch ? (
                  <button
                    onClick={handleTorchToggle}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      torchOn ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'bg-white/10 text-white'
                    }`}
                  >
                    {torchOn ? 'ON' : 'OFF'}
                  </button>
                ) : (
                  <span className="text-[10px] text-white/30 italic">Not supported</span>
                )}
              </div>

              {/* Zoom Control */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/80 uppercase tracking-wider">Digital Zoom</span>
                  <span className="text-primary font-mono">{zoomLevel.toFixed(1)}x</span>
                </div>
                {capabilities.zoom ? (
                  <input 
                    type="range"
                    min={capabilities.zoom.min}
                    max={capabilities.zoom.max}
                    step={capabilities.zoom.step}
                    value={zoomLevel}
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-white/20 rounded-lg h-1.5"
                  />
                ) : (
                  <span className="text-[10px] text-white/30 italic block">Not supported</span>
                )}
              </div>

              {/* Exposure Compensation */}
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-white/80 uppercase tracking-wider">Exposure EV</span>
                  <span className="text-primary font-mono">{exposureComp > 0 ? `+${exposureComp}` : exposureComp}</span>
                </div>
                {capabilities.exposureCompensation ? (
                  <input 
                    type="range"
                    min={capabilities.exposureCompensation.min}
                    max={capabilities.exposureCompensation.max}
                    step={capabilities.exposureCompensation.step}
                    value={exposureComp}
                    onChange={(e) => handleExposureChange(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-white/20 rounded-lg h-1.5"
                  />
                ) : (
                  <span className="text-[10px] text-white/30 italic block">Not supported</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewfinder Canvas */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {error ? (
          <div className="p-6 text-center text-red-400 bg-red-500/10 rounded-2xl m-4 border border-red-500/20 max-w-md space-y-4">
            <p className="text-sm font-bold leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button onClick={startCamera} className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 text-xs font-bold uppercase tracking-widest text-white">
                Try Again
              </button>
              {onOpenManualSearch && (
                <button 
                  onClick={() => {
                    onCancel();
                    onOpenManualSearch();
                  }} 
                  className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-primary/20"
                >
                  Search Card Manually
                </button>
              )}
            </div>
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
            {!imageCaptured && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`relative w-64 h-96 sm:w-80 sm:h-[450px] border-2 transition-all duration-300 rounded-2xl flex flex-col justify-between p-4 ${
                  detectStatus === 'detected'
                    ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.4)] scale-102'
                    : 'border-dashed border-primary/50 shadow-[inset_0_0_60px_rgba(255,203,5,0.15)]'
                }`}>
                  {/* Corner Accents */}
                  <div className={`absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl transition-colors ${detectStatus === 'detected' ? 'border-emerald-400' : 'border-primary'}`} />
                  <div className={`absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl transition-colors ${detectStatus === 'detected' ? 'border-emerald-400' : 'border-primary'}`} />
                  <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl transition-colors ${detectStatus === 'detected' ? 'border-emerald-400' : 'border-primary'}`} />
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-xl transition-colors ${detectStatus === 'detected' ? 'border-emerald-400' : 'border-primary'}`} />

                  {/* Animated Scan Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line-anim shadow-[0_0_15px_#FFCB05]" />

                  <div className="text-center pt-2">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur border transition-all ${
                      detectStatus === 'detected' 
                        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 animate-pulse'
                        : 'bg-black/60 border-white/20 text-primary'
                    }`}>
                      {guidanceMessage}
                    </span>
                  </div>

                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-2xl">
                      <span className="text-6xl font-black text-primary animate-ping">{countdown}</span>
                    </div>
                  )}

                  <div className="text-center pb-2 flex justify-between items-center px-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/60">
                      Auto-Detect Enabled
                    </span>
                    {isBatchMode && (
                      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                        {batchQueue.length} Captured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quality Blur Warning Banner */}
            {blurWarning && imageCaptured && (
              <div className="absolute top-4 inset-x-4 z-20 bg-amber-500/90 text-black p-3 rounded-2xl border border-amber-300 shadow-2xl flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>Image may be blurry — retake for best AI grading accuracy?</span>
                </div>
                <button 
                  onClick={retakeImage}
                  className="px-3 py-1 bg-black text-white rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors ml-2 flex-shrink-0"
                >
                  Retake Now
                </button>
              </div>
            )}

            {/* Batch mode quick add feedback toast */}
            {showBatchSuccess && (
              <div className="absolute top-16 z-30 bg-emerald-500 text-black px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-bounce">
                <CheckCircle2 className="w-4 h-4" /> Card Captured & Added to Batch!
              </div>
            )}

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
            <canvas ref={detectCanvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Bottom Controls */}
      {!error && !isScanning && (
        <div className="p-6 bg-[#12121a] border-t border-white/10 flex flex-col justify-center items-center gap-4">
          {!imageCaptured ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <button 
                onClick={captureImage}
                className="w-20 h-20 rounded-full border-4 border-primary/40 flex items-center justify-center p-1 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-primary/20"
                title="Manual Capture Override"
              >
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-black">
                  <Camera className="w-8 h-8" />
                </div>
              </button>

              <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                Auto-Capture active • Tap button to force capture
              </span>
              
              {isBatchMode && batchQueue.length > 0 && (
                <button 
                  onClick={() => {
                    if (onBatchScanStart) onBatchScanStart(batchQueue);
                  }}
                  className="w-full max-w-sm py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover font-bold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 mt-1"
                >
                  <Sparkles className="w-4 h-4" /> Process Batch ({batchQueue.length} Cards)
                </button>
              )}
            </div>
          ) : (
            <div className="flex w-full max-w-md gap-4">
              <button 
                onClick={retakeImage}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-widest transition-colors text-white flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              
              {isBatchMode ? (
                <button 
                  onClick={() => {
                    setBatchQueue(prev => [...prev, imageCaptured]);
                    setImageCaptured(null);
                    setShowBatchSuccess(true);
                    setTimeout(() => setShowBatchSuccess(false), 1500);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 font-bold text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Check className="w-4 h-4" /> Add to Queue
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
