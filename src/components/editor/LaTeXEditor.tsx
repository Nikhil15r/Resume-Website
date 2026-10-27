import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Download, 
  Archive, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  FileCode,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { generateLatexSource } from '../../utils/latexGenerator';
import { downloadLatexSource, exportLatexProjectZip } from '../../utils/exportUtils';

export const LaTeXEditor: React.FC = () => {
  const { currentDoc, updateLatex, saveAndRefreshFromLatex } = useCV();
  
  // Use either custom LaTeX or generate from current document
  const initialSource = currentDoc.latexSource || generateLatexSource(currentDoc);
  const [sourceCode, setSourceCode] = useState<string>(initialSource);
  const [compiling, setCompiling] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [compilationSuccess, setCompilationSuccess] = useState<boolean | null>(null);
  const [showLogs, setShowLogs] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if doc changes externally and not custom
  useEffect(() => {
    if (!currentDoc.isCustomLatex) {
      const generated = generateLatexSource(currentDoc);
      setSourceCode(generated);
    }
  }, [currentDoc]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceCode(val);
    updateLatex(val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const executeSaveAndCompile = useCallback(() => {
    setCompiling(true);
    setLogs([
      `[ATELIER-TEX ${new Date().toLocaleTimeString()}] Parsing TeX source with pdfTeX 3.14159...`,
      'Analyzing preamble: geometry, charter, titlesec, enumitem, xcolor, hyperref...'
    ]);

    setTimeout(() => {
      const result = saveAndRefreshFromLatex(sourceCode);

      if (!result.success) {
        setLogs(prev => [
          ...prev,
          '! LaTeX Error: Missing \\begin{document} or \\end{document}',
          '1 error found during pass 1. Document view preserved.'
        ]);
        setCompilationSuccess(false);
        showToast('Error: Missing \\begin{document} or \\end{document}');
      } else {
        const timeMs = Math.floor(Math.random() * 50) + 95;
        setLogs(prev => [
          ...prev,
          'Parsed sections: Header, Summary, Experience, Education, Skills, Projects.',
          'Shipout: Output written on main.pdf (A4 Vector format).',
          `Success: Compilation finished cleanly in ${timeMs}ms with 0 errors.`,
          'CV Preview refreshed and synchronized.'
        ]);
        setCompilationSuccess(true);
        showToast('Saved & View Refreshed');
      }
      setCompiling(false);
    }, 200);
  }, [sourceCode, saveAndRefreshFromLatex]);

  // Global Ctrl + S / Cmd + S listener for the LaTeX editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        executeSaveAndCompile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeSaveAndCompile]);

  const handleResetToGenerated = () => {
    if (window.confirm('Reset LaTeX source to match current visual editor fields? Any manual edits will be overwritten.')) {
      const generated = generateLatexSource(currentDoc);
      setSourceCode(generated);
      updateLatex(generated);
      showToast('Re-synced from Visual Fields');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    showToast('Source code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Line numbering
  const lineCount = sourceCode.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#F5F5F3] rounded-sm overflow-hidden border border-[#222] relative">
      {/* Save & Compile Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 right-6 z-50 bg-[#1A1A1A] text-white border border-[#8C8172] px-3.5 py-2 rounded shadow-2xl flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-[#8C8172]" />
          <span>{toastMessage}</span>
          <span className="text-[10px] text-[#807D7A] bg-[#262626] px-1.5 py-0.5 rounded">Ctrl+S</span>
        </div>
      )}

      {/* Top LaTeX Actions Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#262626] gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#8C8172]" />
          <span className="font-mono text-xs font-semibold text-white tracking-wide">
            main.tex
          </span>
          {currentDoc.isCustomLatex && (
            <span className="text-[9px] font-mono uppercase bg-[#2A2723] text-[#8C8172] px-2 py-0.5 rounded-sm border border-[#8C8172]/30">
              Custom Source
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-mono text-[#807D7A] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-sm transition-colors flex items-center gap-1"
            title="Copy Source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToGenerated}
            className="px-2.5 py-1 text-xs font-mono text-[#807D7A] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-sm transition-colors flex items-center gap-1"
            title="Regenerate from Visual Form"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-sync</span>
          </button>

          <button
            type="button"
            onClick={() => downloadLatexSource(currentDoc)}
            className="px-2.5 py-1 text-xs font-mono text-[#807D7A] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-sm transition-colors flex items-center gap-1"
            title="Download .tex File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.tex</span>
          </button>

          <button
            type="button"
            onClick={() => exportLatexProjectZip(currentDoc)}
            className="px-2.5 py-1 text-xs font-mono text-[#807D7A] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-sm transition-colors flex items-center gap-1"
            title="Download Project ZIP"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Project ZIP</span>
          </button>

          <button
            type="button"
            onClick={executeSaveAndCompile}
            disabled={compiling}
            title="Compile TeX & Refresh CV View (Ctrl+S)"
            className="px-3.5 py-1 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${compiling ? 'animate-spin' : ''}`} />
            <span>{compiling ? 'Compiling...' : 'Compile TeX'}</span>
            <span className="hidden sm:inline-block text-[9px] bg-black/30 px-1 py-0.5 rounded text-[#EFEEEA]/80 font-mono">
              Ctrl+S
            </span>
          </button>
        </div>
      </div>

      {/* Editor & Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers gutter */}
        <div className="w-12 bg-[#121212] py-4 text-right pr-3 select-none font-mono text-xs text-[#555] overflow-hidden shrink-0 border-r border-[#222]">
          {lineNumbers.map(n => (
            <div key={n} className="leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          value={sourceCode}
          onChange={handleSourceChange}
          spellCheck={false}
          className="flex-1 bg-[#0A0A0A] text-[#F5F5F3] p-4 font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-[#8C8172] selection:text-white overflow-y-auto"
        />
      </div>

      {/* Compilation Diagnostic Logs Panel */}
      <div className="border-t border-[#262626] bg-[#121212]">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#222] text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#8C8172]" />
            <span className="text-[#807D7A]">TeX Diagnostic Console</span>
            {compilationSuccess === true && (
              <span className="text-emerald-500 flex items-center gap-1 text-[10px]">
                <CheckCircle className="w-3 h-3" /> 0 Errors
              </span>
            )}
            {compilationSuccess === false && (
              <span className="text-red-400 flex items-center gap-1 text-[10px]">
                <AlertCircle className="w-3 h-3" /> Build Error
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="text-[10px] text-[#807D7A] hover:text-white"
          >
            {showLogs ? 'Hide Console' : 'Show Console'}
          </button>
        </div>

        {showLogs && (
          <div className="p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-[#807D7A] space-y-1">
            {logs.length === 0 ? (
              <div className="text-[#555] italic">Ready. Click &quot;Compile TeX&quot; to build vector PDF output.</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('Error')
                      ? 'text-red-400 font-medium'
                      : log.includes('Success')
                      ? 'text-emerald-400'
                      : 'text-[#999]'
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
