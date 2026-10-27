import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Archive, RefreshCw, ZoomIn, ZoomOut, Check, ChevronDown } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { LaTeXEditor } from '../components/editor/LaTeXEditor';
import { LaTeXSplitLayout } from '../components/editor/LaTeXSplitLayout';
import { CVDocumentRenderer } from '../components/preview/CVDocumentRenderer';
import { exportToPdfPrint, downloadLatexSource, exportLatexProjectZip, downloadPdfDirect } from '../utils/exportUtils';
import { TEMPLATES } from '../data/templates';

export const LatexStudioPage: React.FC = () => {
  const { currentDoc, documents, setCurrentDocId, setTemplate } = useCV();
  const [zoom, setZoom] = useState<number>(0.78);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDirectDownload = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadPdfDirect(currentDoc);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F3] overflow-hidden selection:bg-[#8C8172] selection:text-white">
      {/* Top LaTeX Header */}
      <header className="h-14 bg-[#141414] border-b border-[#262626] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 no-print">
        {/* Left branding & document select */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-1.5 hover:bg-[#222] rounded-sm text-[#807D7A] hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold tracking-wider text-white">
              ATELIER LATEX STUDIO
            </span>
            <span className="text-[10px] font-mono text-[#8C8172] bg-[#222] px-2 py-0.5 rounded-sm">
              v3.14 TeX Engine
            </span>
          </div>

          {/* Document Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setDocDropdownOpen(!docDropdownOpen)}
              className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-sm text-xs font-mono text-[#D1CECA] flex items-center gap-2 transition-colors"
            >
              <span className="truncate max-w-[160px]">{currentDoc.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#807D7A]" />
            </button>

            {docDropdownOpen && (
              <div
                onClick={() => setDocDropdownOpen(false)}
                className="absolute left-0 top-full mt-1 w-64 bg-[#141414] border border-[#333] rounded-sm shadow-2xl py-1 z-50 text-xs font-mono"
              >
                {documents.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setCurrentDocId(d.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-[#222] flex items-center justify-between ${
                      d.id === currentDoc.id ? 'text-[#8C8172] font-semibold' : 'text-[#D1CECA]'
                    }`}
                  >
                    <span className="truncate">{d.title}</span>
                    {d.id === currentDoc.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-[#807D7A] pr-3 border-r border-[#262626]">
            <button
              onClick={() => setZoom(Math.max(0.4, Number((zoom - 0.1).toFixed(2))))}
              className="p-1 hover:bg-[#222] rounded text-[#807D7A] hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] w-10 text-center text-[#D1CECA]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(2))))}
              className="p-1 hover:bg-[#222] rounded text-[#807D7A] hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            to={`/editor/${currentDoc.id}`}
            className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-white text-xs font-mono rounded-sm transition-colors"
          >
            Switch to Visual Editor
          </Link>

          <button
            onClick={handleDirectDownload}
            disabled={isDownloadingPdf}
            className="px-3.5 py-1.5 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs font-mono uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            {isDownloadingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloadingPdf ? 'Compiling PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Area: Resizable / Shrinkable Split View */}
      <LaTeXSplitLayout
        theme="dark"
        editor={<LaTeXEditor />}
        preview={
          <div className="w-full flex flex-col items-center p-6">
            <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-[#262626] text-xs font-mono text-[#807D7A]">
              <span className="text-[#8C8172] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Typeset Preview (A4 Vector)
              </span>
              <span className="bg-[#1A1A1A] px-2 py-0.5 rounded text-[#D1CECA] border border-[#333]">
                {currentDoc.settings.templateId.toUpperCase()}
              </span>
            </div>

            <div className="w-full flex justify-center py-2">
              <CVDocumentRenderer doc={currentDoc} zoom={zoom} />
            </div>
          </div>
        }
      />
    </div>
  );
};
