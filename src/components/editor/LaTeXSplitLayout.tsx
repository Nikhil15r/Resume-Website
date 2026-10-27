import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GripVertical, 
  ChevronLeft, 
  ChevronRight, 
  Columns, 
  Maximize2, 
  FileCode, 
  Eye 
} from 'lucide-react';

interface LaTeXSplitLayoutProps {
  editor: React.ReactNode;
  preview: React.ReactNode;
  defaultSplitPercent?: number; // e.g. 52%
  minPercent?: number; // e.g. 20%
  maxPercent?: number; // e.g. 80%
  className?: string;
  theme?: 'dark' | 'light';
}

const STORAGE_KEY_SPLIT = 'atelier_latex_split_pct';

export const LaTeXSplitLayout: React.FC<LaTeXSplitLayoutProps> = ({
  editor,
  preview,
  defaultSplitPercent = 52,
  minPercent = 20,
  maxPercent = 80,
  className = '',
  theme = 'dark'
}) => {
  // Read saved split percent from localStorage
  const [splitPercent, setSplitPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPLIT);
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= minPercent && val <= maxPercent) {
          return val;
        }
      }
    } catch (e) {}
    return defaultSplitPercent;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [collapsedPane, setCollapsedPane] = useState<'none' | 'editor' | 'preview'>('none');
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move handler during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(minPercent, Math.min(maxPercent, rawPercent));
    setSplitPercent(clamped);
    setCollapsedPane('none');
  }, [minPercent, maxPercent]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Save split percent whenever it changes and not dragging
  useEffect(() => {
    if (!isDragging && collapsedPane === 'none') {
      try {
        localStorage.setItem(STORAGE_KEY_SPLIT, splitPercent.toFixed(1));
      } catch (e) {}
    }
  }, [splitPercent, isDragging, collapsedPane]);

  // Window listeners during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Double click divider to reset to 50/50
  const handleResetToHalf = () => {
    setSplitPercent(50);
    setCollapsedPane('none');
  };

  // Quick preset handlers
  const handleSetRatio = (pct: number) => {
    setSplitPercent(pct);
    setCollapsedPane('none');
  };

  const isDark = theme === 'dark';

  return (
    <div 
      ref={containerRef}
      className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative ${className}`}
    >
      {/* Fullscreen drag overlay to ensure seamless mouse events */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}

      {/* ----------------- LEFT PANE: CODE EDITOR ----------------- */}
      <div
        style={{
          width: collapsedPane === 'editor' ? '0%' : collapsedPane === 'preview' ? '100%' : `${splitPercent}%`,
          display: collapsedPane === 'editor' ? 'none' : 'flex'
        }}
        className="h-full flex-col overflow-hidden transition-[width] duration-75 ease-out relative"
      >
        <div className="flex-1 p-2.5 sm:p-3 overflow-hidden">
          {editor}
        </div>
      </div>

      {/* Floating Expand Editor Button (if editor collapsed) */}
      {collapsedPane === 'editor' && (
        <button
          onClick={() => setCollapsedPane('none')}
          className={`absolute left-3 top-3 z-30 px-3 py-1.5 rounded-sm shadow-xl flex items-center gap-1.5 text-xs font-mono border transition-colors ${
            isDark 
              ? 'bg-[#1A1A1A] text-white border-[#333] hover:bg-[#262626]' 
              : 'bg-white text-[#0A0A0A] border-[#E5E3DF] hover:bg-[#F5F5F3]'
          }`}
          title="Restore Code Editor"
        >
          <FileCode className="w-3.5 h-3.5 text-[#8C8172]" />
          <span>Show Editor</span>
        </button>
      )}

      {/* ----------------- DRAGGABLE RESIZER SPLITTER ----------------- */}
      {collapsedPane === 'none' && (
        <div
          onMouseDown={() => setIsDragging(true)}
          onDoubleClick={handleResetToHalf}
          title="Drag to resize Editor vs Preview (Double-click for 50/50)"
          className={`hidden lg:flex w-3.5 shrink-0 items-center justify-center cursor-col-resize relative select-none z-20 group transition-colors ${
            isDragging 
              ? isDark ? 'bg-[#8C8172]/20' : 'bg-[#8C8172]/30' 
              : 'hover:bg-[#8C8172]/15'
          }`}
        >
          {/* Subtle Vertical Line */}
          <div className={`w-[1px] h-full ${isDark ? 'bg-[#262626] group-hover:bg-[#8C8172]' : 'bg-[#E5E3DF] group-hover:bg-[#8C8172]'} transition-colors`} />

          {/* Centered Pill Grab Handle */}
          <div className={`absolute top-1/2 -translate-y-1/2 w-4 py-2 flex flex-col items-center justify-center rounded-sm transition-all ${
            isDark 
              ? 'bg-[#1A1A1A] border border-[#333] group-hover:border-[#8C8172]' 
              : 'bg-white border border-[#D1CECA] group-hover:border-[#8C8172] shadow-sm'
          }`}>
            <GripVertical className="w-3 h-3 text-[#807D7A] group-hover:text-[#8C8172]" />
          </div>

          {/* Quick Collapse Arrows (appear on hover) */}
          <div className="absolute top-4 hidden group-hover:flex flex-col gap-1 items-center bg-[#141414] border border-[#333] p-0.5 rounded shadow-xl text-[10px] text-[#807D7A]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSetRatio(Math.max(minPercent, splitPercent - 15));
              }}
              title="Shrink Editor"
              className="p-1 hover:text-white hover:bg-[#262626] rounded"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetToHalf();
              }}
              title="50/50 Split"
              className="p-1 hover:text-white hover:bg-[#262626] rounded font-mono text-[9px]"
            >
              =
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSetRatio(Math.min(maxPercent, splitPercent + 15));
              }}
              title="Expand Editor"
              className="p-1 hover:text-white hover:bg-[#262626] rounded"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Expand Preview Button (if preview collapsed) */}
      {collapsedPane === 'preview' && (
        <button
          onClick={() => setCollapsedPane('none')}
          className={`absolute right-3 top-3 z-30 px-3 py-1.5 rounded-sm shadow-xl flex items-center gap-1.5 text-xs font-mono border transition-colors ${
            isDark 
              ? 'bg-[#1A1A1A] text-white border-[#333] hover:bg-[#262626]' 
              : 'bg-white text-[#0A0A0A] border-[#E5E3DF] hover:bg-[#F5F5F3]'
          }`}
          title="Restore CV Preview"
        >
          <Eye className="w-3.5 h-3.5 text-[#8C8172]" />
          <span>Show Preview</span>
        </button>
      )}

      {/* ----------------- RIGHT PANE: CV PREVIEW ----------------- */}
      <div
        style={{
          width: collapsedPane === 'preview' ? '0%' : collapsedPane === 'editor' ? '100%' : `${100 - splitPercent}%`,
          display: collapsedPane === 'preview' ? 'none' : 'flex'
        }}
        className={`h-full flex-col overflow-y-auto transition-[width] duration-75 ease-out relative ${
          isDark 
            ? 'bg-[#121212] border-l border-[#262626]' 
            : 'bg-[#EFEEEA] border-l border-[#E5E3DF]'
        }`}
      >
        {preview}
      </div>
    </div>
  );
};
