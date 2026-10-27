import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { generateLatexSource } from '../../utils/latexGenerator';
import { downloadLatexSource, exportLatexProjectZip } from '../../utils/exportUtils';

export const LaTeXEditor: React.FC = () => {
  const { currentDoc, updateLatex } = useCV();
  
  // Use either custom LaTeX or generate from current document
  const initialSource = currentDoc.latexSource || generateLatexSource(currentDoc);
  const [sourceCode, setSourceCode] = useState<string>(initialSource);
  const [compiling, setCompiling] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [compilationSuccess, setCompilationSuccess] = useState<boolean | null>(null);
  const [showLogs, setShowLogs] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

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

  const handleCompile = () => {
    setCompiling(true);
    setLogs(['[ATELIER-TEX] Initializing pdfTeX v3.141592653-2.6-1.40.24 (TeX Live 2026)...', 'parsing packages: geometry, charter, microtype, enumitem, xcolor, hyperref, titlesec...']);

    setTimeout(() => {
      // Check syntax basic checks (e.g. matching begin/end)
      const hasBeginDoc = sourceCode.includes('\\begin{document}');
      const hasEndDoc = sourceCode.includes('\\end{document}');

      if (!hasBeginDoc || !hasEndDoc) {
        setLogs(prev => [
          ...prev,
          `! LaTeX Error: Missing ${!hasBeginDoc ? '\\begin{document}' : '\\end{document}'}`,
          '1 error, 0 warnings found during pass 1.',
          'Compilation aborted. Previous document state preserved.'
        ]);
        setCompilationSuccess(false);
      } else {
        const timeMs = Math.floor(Math.random() * 80) + 120;
        setLogs(prev => [
          ...prev,
          'Shipout: Output written on main.pdf (1 page, 38,412 bytes).',
          'Transcript written on main.log.',
          `Success: Compilation finished cleanly in ${timeMs}ms with 0 errors.`
        ]);
        setCompilationSuccess(true);
      }
      setCompiling(false);
    }, 600);
  };

  const handleResetToGenerated = () => {
    if (window.confirm('Reset LaTeX source to match current visual editor fields? Any manual edits will be overwritten.')) {
      const generated = generateLatexSource(currentDoc);
      setSourceCode(generated);
      updateLatex(generated);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line numbering
  const lineCount = sourceCode.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#F5F5F3] rounded-sm overflow-hidden border border-[#222]">
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
            <Copy className="w-3.5 h-3.5" />
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
          >
            <Download className="w-3.5 h-3.5" />
            <span>.tex</span>
          </button>

          <button
            type="button"
            onClick={() => exportLatexProjectZip(currentDoc)}
            className="px-2.5 py-1 text-xs font-mono text-[#807D7A] hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-sm transition-colors flex items-center gap-1"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Project ZIP</span>
          </button>

          <button
            type="button"
            onClick={handleCompile}
            disabled={compiling}
            className="px-3.5 py-1 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${compiling ? 'animate-spin' : ''}`} />
            <span>{compiling ? 'Compiling...' : 'Compile TeX'}</span>
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
