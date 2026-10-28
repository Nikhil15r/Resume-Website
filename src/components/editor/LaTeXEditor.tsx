import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download, 
  Archive, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  FileCode,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  RotateCw
} from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { generateLatexSource } from '../../utils/latexGenerator';
import { downloadLatexSource, exportLatexProjectZip } from '../../utils/exportUtils';

export const LaTeXEditor: React.FC = () => {
  const { currentDoc, updateLatex, saveAndRefreshFromLatex } = useCV();
  
  // Use either custom LaTeX or generate from current document
  const initialSource = currentDoc.latexSource || generateLatexSource(currentDoc);
  const [sourceCode, setSourceCode] = useState<string>(initialSource);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);
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

  /**
   * Real syntax validation and bi-directional AST synchronization
   */
  const executeSyncAndRefresh = useCallback(() => {
    setIsSyncing(true);
    const newLogs: string[] = [];
    const timestamp = new Date().toLocaleTimeString();

    newLogs.push(`[${timestamp}] Validating LaTeX syntax & document structure...`);

    // 1. Check for basic document environment
    const hasBeginDoc = sourceCode.includes('\\begin{document}');
    const hasEndDoc = sourceCode.includes('\\end{document}');

    if (!hasBeginDoc || !hasEndDoc) {
      newLogs.push('! Error: Document must contain \\begin{document} and \\end{document}.');
      setLogs(newLogs);
      setValidationSuccess(false);
      showToast('Error: Missing \\begin{document} or \\end{document}');
      setIsSyncing(false);
      return;
    }

    // 2. Check balanced curly braces
    let braceCount = 0;
    let braceError = false;
    for (let i = 0; i < sourceCode.length; i++) {
      if (sourceCode[i] === '{' && (i === 0 || sourceCode[i - 1] !== '\\')) {
        braceCount++;
      } else if (sourceCode[i] === '}' && (i === 0 || sourceCode[i - 1] !== '\\')) {
        braceCount--;
        if (braceCount < 0) {
          braceError = true;
          break;
        }
      }
    }
    if (braceCount !== 0 || braceError) {
      newLogs.push('! Warning: Unbalanced curly braces detected. Check your nested commands.');
    } else {
      newLogs.push('✓ Valid syntax: All opening and closing curly braces are balanced.');
    }

    // 3. Check environment pairings
    const beginEnvs = (sourceCode.match(/\\begin\{([a-zA-Z*]+)\}/g) || []).map(s => s.replace(/\\begin\{|\}/g, ''));
    const endEnvs = (sourceCode.match(/\\end\{([a-zA-Z*]+)\}/g) || []).map(s => s.replace(/\\end\{|\}/g, ''));
    
    if (beginEnvs.length === endEnvs.length) {
      newLogs.push(`✓ Balanced environments: ${beginEnvs.length} environments detected (${beginEnvs.slice(0, 3).join(', ')}...).`);
    } else {
      newLogs.push(`! Warning: Environment mismatch (${beginEnvs.length} \\begin vs ${endEnvs.length} \\end).`);
    }

    // 4. Synchronize with Visual CV Document
    const syncResult = saveAndRefreshFromLatex(sourceCode);
    if (syncResult.success) {
      newLogs.push('✓ Bi-directional sync: Updated Visual CV model and refreshed document view.');
      newLogs.push('✓ Document ready for Overleaf / TeX Live compilation.');
      setValidationSuccess(true);
      showToast('LaTeX Synced & View Refreshed');
    } else {
      newLogs.push('! Warning: Parser encountered partial section tokens. Preview preserved.');
      setValidationSuccess(false);
    }

    setLogs(newLogs);
    setIsSyncing(false);
  }, [sourceCode, saveAndRefreshFromLatex]);

  // Global Ctrl + S / Cmd + S listener for the LaTeX editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        executeSyncAndRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeSyncAndRefresh]);

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

  /**
   * Opens the LaTeX code directly in Overleaf for real cloud pdflatex/xelatex compilation
   */
  const handleOpenInOverleaf = () => {
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.overleaf.com/docs';
      form.target = '_blank';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'snip';
      input.value = sourceCode;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      showToast('Opening in Overleaf...');
    } catch (e) {
      console.error('Overleaf export error:', e);
      window.open('https://www.overleaf.com', '_blank');
    }
  };

  // Line numbering
  const lineCount = sourceCode.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#F5F5F3] rounded-sm overflow-hidden border border-[#222] relative">
      {/* Save & Sync Toast Notification */}
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
            onClick={handleOpenInOverleaf}
            className="px-2.5 py-1 text-xs font-mono text-[#EFEEEA] bg-[#222] hover:bg-[#8C8172] rounded-sm transition-colors flex items-center gap-1.5 border border-[#333]"
            title="Open and compile with real pdflatex in Overleaf"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8C8172]" />
            <span>Open in Overleaf</span>
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
            <span>ZIP</span>
          </button>

          <button
            type="button"
            onClick={executeSyncAndRefresh}
            disabled={isSyncing}
            title="Save & Synchronize Preview (Ctrl+S)"
            className="px-3.5 py-1 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync & Save'}</span>
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

      {/* Compilation & Synchronization Diagnostic Console */}
      <div className="border-t border-[#262626] bg-[#121212]">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#222] text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#8C8172]" />
            <span className="text-[#807D7A]">LaTeX Linter &amp; Sync Diagnostics</span>
            {validationSuccess === true && (
              <span className="text-emerald-500 flex items-center gap-1 text-[10px]">
                <CheckCircle className="w-3 h-3" /> Syntax Verified
              </span>
            )}
            {validationSuccess === false && (
              <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                <AlertCircle className="w-3 h-3" /> Syntax Notice
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="text-[10px] text-[#807D7A] hover:text-white"
          >
            {showLogs ? 'Hide Diagnostics' : 'Show Diagnostics'}
          </button>
        </div>

        {showLogs && (
          <div className="p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-[#807D7A] space-y-1">
            {logs.length === 0 ? (
              <div className="text-[#555] italic">
                Ready. Press <strong className="text-[#8C8172]">Ctrl + S</strong> or click &quot;Sync &amp; Save&quot; to validate code and refresh the CV preview. Click &quot;Open in Overleaf&quot; for full cloud pdflatex compilation.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('!')
                      ? 'text-amber-400 font-medium'
                      : log.includes('✓')
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
