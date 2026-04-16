import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Download, X, FileText, CheckCircle2, Cog } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [scaleFactor, setScaleFactor] = useState(0.8);
  const [activePreset, setActivePreset] = useState<'custom' | 'mobile' | 'tablet' | 'full'>('tablet');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = {
    mobile: { scale: 0.5, label: 'Mobile' },
    tablet: { scale: 0.8, label: 'Tablet' },
    full: { scale: 1.0, label: 'Full' }
  };

  const applyPreset = (presetKey: 'mobile' | 'tablet' | 'full') => {
    setScaleFactor(presets[presetKey].scale);
    setActivePreset(presetKey);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResizedBlob(null);
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.scale(scaleFactor, scaleFactor);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResizedBlob(blob);
    } catch (error) {
      console.error('PDF Resize failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resizedBlob) return;
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_${file?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setResizedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="pdf-resizer" className="geometric-card flex flex-col overflow-hidden">
      <div className="border-b border-border-theme p-4 md:p-6 bg-surface flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-theme/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent-theme" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-primary-theme leading-tight">PDF Resizer</h2>
            <p className="text-[10px] text-text-sub uppercase tracking-widest font-bold">Document Scale</p>
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
              <FileText className="w-8 h-8 text-text-sub group-hover:text-accent-theme" />
            </div>
            <p className="font-bold text-primary-theme">Drop PDF here or click to upload</p>
            <p className="text-sm text-text-sub mt-1">Maximum recommended: 50MB</p>
            <button className="mt-6 px-6 py-2.5 bg-primary-theme text-white text-sm font-bold rounded-lg hover:bg-accent-theme transition-colors shadow-lg shadow-primary-theme/10">
              Select PDF
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-8">
            <div className="relative aspect-video rounded-[var(--radius-theme)] overflow-hidden bg-primary-theme flex items-center justify-center p-10 border border-border-theme">
              <div className="flex flex-col items-center">
                <div className="w-20 h-28 bg-surface rounded-lg shadow-2xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <FileText className="w-10 h-10 text-border-theme" />
                </div>
                <h3 className="text-white font-bold text-base mb-1 truncate max-w-[200px]">{file.name}</h3>
                <p className="text-text-sub text-[10px] font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-accent-theme border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <button
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-bg-theme rounded-[var(--radius-theme)] border border-border-theme">
                <div className="flex items-center gap-2 mb-6 font-bold text-xs text-text-sub uppercase tracking-wider">
                  <Cog className="w-4 h-4" />
                  Scale Level
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                  {(['mobile', 'tablet', 'full'] as const).map((p) => (
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

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-text-main mb-2">
                    <span>PAGE SCALE</span>
                    <span className="text-accent-theme">{Math.round(scaleFactor * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={scaleFactor}
                    onChange={(e) => {
                      setScaleFactor(parseFloat(e.target.value));
                      setActivePreset('custom');
                    }}
                    className="w-full h-1.5 bg-border-theme rounded-lg appearance-none cursor-pointer accent-accent-theme"
                  />
                  <div className="flex justify-between mt-2 text-[8px] font-bold text-gray-300">
                    <span>50%</span>
                    <span>150%</span>
                  </div>
                </div>
              </div>

              {!resizedBlob ? (
                <button
                  disabled={!file || isProcessing}
                  onClick={handleResize}
                  className="w-full py-4 bg-primary-theme text-white rounded-xl font-bold disabled:opacity-50 hover:bg-accent-theme transition-all shadow-xl shadow-primary-theme/5"
                >
                  {isProcessing ? 'Scaling...' : 'Scale PDF'}
                </button>
              ) : (
                <button
                  onClick={downloadPdf}
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
        <span>Standard: ISO 32000</span>
        <span>Secure: Yes</span>
      </div>
    </section>
  );
}
