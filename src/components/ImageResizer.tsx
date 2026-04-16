import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Download, X, Image as ImageIcon, CheckCircle2, Sliders } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<Blob | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [quality, setQuality] = useState(0.8);
  const [activePreset, setActivePreset] = useState<'custom' | 'eco' | 'balanced' | 'studio'>('balanced');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = {
    eco: { quality: 0.5, maxWidth: 1024, label: 'Eco' },
    balanced: { quality: 0.75, maxWidth: 1920, label: 'Standard' },
    studio: { quality: 0.9, maxWidth: 3840, label: 'Studio' }
  };

  const applyPreset = (presetKey: 'eco' | 'balanced' | 'studio') => {
    const p = presets[presetKey];
    setQuality(p.quality);
    setMaxWidth(p.maxWidth);
    setActivePreset(presetKey);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      processSelection(selectedFile);
    }
  };

  const processSelection = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
    setResizedImage(null);
    setResizedPreview(null);
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const options = {
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality,
      };
      const compressedFile = await imageCompression(file, options);
      setResizedImage(compressedFile);
      const url = URL.createObjectURL(compressedFile);
      setResizedPreview(url);
    } catch (error) {
      console.error('Resize failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    const url = URL.createObjectURL(resizedImage);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized_${file?.name || 'image.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResizedImage(null);
    setResizedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="image-resizer" className="geometric-card flex flex-col overflow-hidden">
      <div className="border-b border-border-theme p-4 md:p-6 bg-surface flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-theme/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-accent-theme" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-primary-theme leading-tight">Image Resizer</h2>
            <p className="text-[10px] text-text-sub uppercase tracking-widest font-bold">Compress & Scale</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-300">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          LOCAL
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {!file ? (
          <motion.div
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-border-theme rounded-[var(--radius-theme)] bg-bg-theme cursor-pointer hover:border-accent-theme hover:bg-accent-theme/5 transition-all group"
          >
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-accent-theme/10 transition-colors">
              <Upload className="w-8 h-8 text-text-sub group-hover:text-accent-theme" />
            </div>
            <p className="font-bold text-primary-theme">Drop image here or click to upload</p>
            <p className="text-sm text-text-sub mt-1">JPEG, PNG, WEBP and GIF</p>
            <button className="mt-6 px-6 py-2.5 bg-primary-theme text-white text-sm font-bold rounded-lg hover:bg-accent-theme transition-colors shadow-lg shadow-primary-theme/10">
              Select Files
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-8">
            <div className="relative aspect-video rounded-[var(--radius-theme)] overflow-hidden bg-bg-theme border border-border-theme">
              <AnimatePresence mode="wait">
                {resizedPreview ? (
                  <motion.img
                    key="resized"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={resizedPreview}
                    className="w-full h-full object-contain p-4"
                    alt="Resized preview"
                  />
                ) : (
                  <motion.img
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={preview!}
                    className="w-full h-full object-contain p-4 blur-sm opacity-50"
                    alt="Preview"
                  />
                )}
              </AnimatePresence>
              
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-accent-theme border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <button
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full hover:bg-white text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-bg-theme rounded-[var(--radius-theme)] border border-border-theme">
                <div className="flex items-center gap-2 mb-6 font-bold text-xs text-text-sub uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  Compression Level
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                  {(['eco', 'balanced', 'studio'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => applyPreset(p)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                        activePreset === p 
                          ? 'bg-primary-theme text-white border-primary-theme shadow-md' 
                          : 'bg-surface text-text-sub border-border-theme hover:border-accent-theme'
                      }`}
                    >
                      {presets[p].label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-text-main mb-2">
                      <span>WIDTH</span>
                      <span className="text-accent-theme">{maxWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="4000"
                      step="10"
                      value={maxWidth}
                      onChange={(e) => {
                        setMaxWidth(parseInt(e.target.value));
                        setActivePreset('custom');
                      }}
                      className="w-full h-1.5 bg-border-theme rounded-lg appearance-none cursor-pointer accent-accent-theme"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-text-main mb-2">
                      <span>QUALITY</span>
                      <span className="text-accent-theme">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => {
                        setQuality(parseFloat(e.target.value));
                        setActivePreset('custom');
                      }}
                      className="w-full h-1.5 bg-border-theme rounded-lg appearance-none cursor-pointer accent-accent-theme"
                    />
                  </div>
                </div>
              </div>

              {!resizedImage ? (
                <button
                  disabled={!file || isProcessing}
                  onClick={handleResize}
                  className="w-full py-4 bg-primary-theme text-white rounded-xl font-bold disabled:opacity-50 hover:bg-accent-theme transition-all shadow-xl shadow-primary-theme/5"
                >
                  {isProcessing ? 'Processing...' : 'Apply Resize'}
                </button>
              ) : (
                <button
                  onClick={downloadImage}
                  className="w-full py-4 bg-accent-theme text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between px-6 py-4 bg-bg-theme border-t border-border-theme text-[10px] font-bold text-text-sub uppercase tracking-widest">
        <span>Processing: Browser GPU</span>
        <span>Secure: Yes</span>
      </div>
    </section>
  );
}
