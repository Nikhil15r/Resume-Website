import React from 'react';
import { useCV } from '../../../context/CVContext';
import { TEMPLATES } from '../../../data/templates';
import { TemplateId, PaperSize } from '../../../types/cv';

export const StyleSettingsForm: React.FC = () => {
  const { currentDoc, updateSettings } = useCV();
  const { settings } = currentDoc;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
          Document Typography &amp; Layout
        </h3>
        <p className="text-xs text-[#807D7A]">
          Calibrated document formatting respecting international corporate standards.
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="block text-[11px] uppercase font-mono tracking-wider text-[#4A4845]">
          Active Template Architecture
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => updateSettings({ templateId: tpl.id })}
              className={`p-3 text-left rounded-sm border transition-luxury flex flex-col justify-between ${
                settings.templateId === tpl.id
                  ? 'bg-white border-[#0A0A0A] shadow-subtle ring-1 ring-[#0A0A0A]'
                  : 'bg-white/60 border-[#E5E3DF] hover:border-[#8C8172]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-sm font-semibold text-[#0A0A0A]">
                  {tpl.name}
                </span>
                <span className="text-[9px] font-mono text-[#8C8172] uppercase">
                  {tpl.category}
                </span>
              </div>
              <p className="text-[11px] text-[#807D7A] line-clamp-1">
                {tpl.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Paper Size & Page Geometry */}
      <div className="space-y-3 pt-6 border-t border-[#E5E3DF]">
        <label className="block text-[11px] uppercase font-mono tracking-wider text-[#4A4845]">
          Standard Paper Size
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateSettings({ paperSize: 'a4' })}
            className={`p-3 rounded-sm border text-left transition-luxury ${
              settings.paperSize === 'a4'
                ? 'bg-white border-[#0A0A0A] shadow-subtle ring-1 ring-[#0A0A0A]'
                : 'bg-white/60 border-[#E5E3DF] hover:border-[#8C8172]'
            }`}
          >
            <div className="font-medium text-xs text-[#0A0A0A] mb-0.5">ISO 216 — A4</div>
            <div className="text-[10px] text-[#807D7A]">210 × 297 mm (Global Standard)</div>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ paperSize: 'letter' })}
            className={`p-3 rounded-sm border text-left transition-luxury ${
              settings.paperSize === 'letter'
                ? 'bg-white border-[#0A0A0A] shadow-subtle ring-1 ring-[#0A0A0A]'
                : 'bg-white/60 border-[#E5E3DF] hover:border-[#8C8172]'
            }`}
          >
            <div className="font-medium text-xs text-[#0A0A0A] mb-0.5">ANSI — US Letter</div>
            <div className="text-[10px] text-[#807D7A]">8.5 × 11 in (US &amp; Canada)</div>
          </button>
        </div>
      </div>

      {/* Margins & Section Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#E5E3DF]">
        <div>
          <label className="block text-[11px] uppercase font-mono tracking-wider text-[#4A4845] mb-2">
            Page Margins
          </label>
          <div className="flex gap-2">
            {(['compact', 'normal', 'generous'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => updateSettings({ margins: m })}
                className={`flex-1 py-1.5 text-xs capitalize rounded-sm border transition-colors ${
                  settings.margins === m
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#4A4845] border-[#E5E3DF] hover:bg-[#EFEEEA]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono tracking-wider text-[#4A4845] mb-2">
            Line &amp; Vertical Rhythm
          </label>
          <div className="flex gap-2">
            {(['tight', 'normal', 'relaxed'] as const).map(ls => (
              <button
                key={ls}
                type="button"
                onClick={() => updateSettings({ lineSpacing: ls })}
                className={`flex-1 py-1.5 text-xs capitalize rounded-sm border transition-colors ${
                  settings.lineSpacing === ls
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#4A4845] border-[#E5E3DF] hover:bg-[#EFEEEA]'
                }`}
              >
                {ls}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
