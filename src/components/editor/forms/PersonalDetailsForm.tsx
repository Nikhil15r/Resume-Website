import React from 'react';
import { Plus, Trash2, Info, Sparkles } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { PersonalDetailItem } from '../../../types/cv';

const PRESET_LABELS = [
  'Date of Birth',
  'Gender',
  'Nationality',
  'Marital Status',
  'Languages Known',
  'Visa / Work Authorization',
  'Permanent Address'
];

export const PersonalDetailsForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const personalDetails: PersonalDetailItem[] = currentDoc.personalDetails || [];

  const handleAddDetail = (label = '', value = '') => {
    const newDetail: PersonalDetailItem = {
      id: `pd-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      label,
      value
    };
    updateField('personalDetails', [...personalDetails, newDetail]);
  };

  const handleUpdateDetail = (id: string, field: 'label' | 'value', value: string) => {
    updateField(
      'personalDetails',
      personalDetails.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteDetail = (id: string) => {
    updateField(
      'personalDetails',
      personalDetails.filter(item => item.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Personal Details &amp; Additional Information
          </h3>
          <p className="text-xs text-[#807D7A]">
            Demographic, background, and supplementary information (e.g., Date of Birth, Gender, Nationality, Marital Status).
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAddDetail('', '')}
          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Detail</span>
        </button>
      </div>

      {/* Suggested Quick-Add Presets */}
      <div className="p-3.5 bg-white border border-[#E5E3DF] rounded-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#8C8172]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Add Common Fields:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LABELS.map(preset => {
            const alreadyExists = personalDetails.some(
              d => d.label.trim().toLowerCase() === preset.toLowerCase()
            );
            return (
              <button
                key={preset}
                type="button"
                disabled={alreadyExists}
                onClick={() => handleAddDetail(preset, '')}
                className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                  alreadyExists
                    ? 'bg-[#F5F5F3] text-[#A09D99] border-[#E5E3DF] cursor-not-allowed'
                    : 'bg-[#FAF9F7] text-[#0A0A0A] border-[#D1CECA] hover:border-[#8C8172] hover:bg-white'
                }`}
              >
                + {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details List */}
      {personalDetails.length === 0 ? (
        <div className="p-8 text-center bg-white border border-dashed border-[#D1CECA] rounded-sm space-y-2">
          <Info className="w-6 h-6 text-[#8C8172] mx-auto" />
          <h4 className="font-serif text-sm font-semibold text-[#0A0A0A]">
            No Personal Details Added Yet
          </h4>
          <p className="text-xs text-[#807D7A] max-w-md mx-auto">
            Add demographic fields such as Date of Birth, Gender, Nationality, or Marital Status. These will be kept distinct from your professional skills and expertise.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {personalDetails.map((detail, index) => (
            <div
              key={detail.id}
              className="p-4 bg-white border border-[#E5E3DF] rounded-sm shadow-subtle flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <div className="w-6 text-center text-xs font-mono text-[#8C8172] select-none">
                #{index + 1}
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A] mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={detail.label}
                    onChange={e => handleUpdateDetail(detail.id, 'label', e.target.value)}
                    placeholder="e.g. Date of Birth, Gender, Nationality"
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded-sm focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#807D7A] mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={detail.value}
                    onChange={e => handleUpdateDetail(detail.id, 'value', e.target.value)}
                    placeholder="e.g. 16 May 1997, Female, Indian"
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F7] border border-[#E5E3DF] rounded-sm focus:border-[#8C8172] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteDetail(detail.id)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors self-end sm:self-center shrink-0"
                title="Remove Detail"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
