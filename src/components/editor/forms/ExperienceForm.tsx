import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { WorkExperience } from '../../../types/cv';

export const ExperienceForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { experience } = currentDoc;

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      role: 'Senior Director of Engineering',
      company: 'Enterprise Corp',
      location: 'New York, NY',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: 'Lead engineering execution and strategic system modernization.',
      achievements: [
        'Orchestrated strategic modernization initiative resulting in 28% latency improvement.',
        'Managed cross-functional team of 40+ senior staff and engineers.'
      ]
    };
    updateField('experience', [newExp, ...experience]);
  };

  const handleUpdateItem = (id: string, updates: Partial<WorkExperience>) => {
    updateField(
      'experience',
      experience.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const handleDeleteItem = (id: string) => {
    updateField('experience', experience.filter(exp => exp.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experience.length) return;
    const items = [...experience];
    const [moved] = items.splice(index, 1);
    items.splice(targetIdx, 0, moved);
    updateField('experience', items);
  };

  const handleAddBullet = (expId: string) => {
    updateField(
      'experience',
      experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            achievements: [...exp.achievements, 'Drove strategic program resulting in measurable impact across operations.']
          };
        }
        return exp;
      })
    );
  };

  const handleUpdateBullet = (expId: string, bulletIdx: number, val: string) => {
    updateField(
      'experience',
      experience.map(exp => {
        if (exp.id === expId) {
          const achievements = [...exp.achievements];
          achievements[bulletIdx] = val;
          return { ...exp, achievements };
        }
        return exp;
      })
    );
  };

  const handleDeleteBullet = (expId: string, bulletIdx: number) => {
    updateField(
      'experience',
      experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            achievements: exp.achievements.filter((_, i) => i !== bulletIdx)
          };
        }
        return exp;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Professional Experience
          </h3>
          <p className="text-xs text-[#807D7A]">
            Focus on leadership mandates, quantifiable business metrics, and strategic outcomes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Role</span>
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, idx) => (
          <div
            key={exp.id}
            className="p-5 bg-white border border-[#E5E3DF] rounded-sm relative space-y-4 shadow-subtle"
          >
            {/* Item Header & Controls */}
            <div className="flex items-center justify-between border-b border-[#E5E3DF] pb-3">
              <span className="font-serif text-base font-semibold text-[#0A0A0A]">
                #{idx + 1} {exp.role || 'New Experience'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 text-[#807D7A] hover:text-[#0A0A0A] disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === experience.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 text-[#807D7A] hover:text-[#0A0A0A] disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(exp.id)}
                  className="p-1 text-red-600 hover:text-red-700 ml-2"
                  title="Delete Role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Executive Role / Title
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={e => handleUpdateItem(exp.id, { role: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Organization / Firm
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={e => handleUpdateItem(exp.id, { company: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Location (City, State / Country)
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={e => handleUpdateItem(exp.id, { location: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={e => handleUpdateItem(exp.id, { startDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                    placeholder="e.g. 2022"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? 'Present' : exp.endDate}
                    onChange={e => handleUpdateItem(exp.id, { endDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`curr-${exp.id}`}
                checked={exp.current}
                onChange={e => handleUpdateItem(exp.id, { current: e.target.checked })}
                className="rounded border-[#E5E3DF] text-[#0A0A0A] focus:ring-0"
              />
              <label htmlFor={`curr-${exp.id}`} className="text-xs text-[#4A4845] cursor-pointer">
                I currently hold this role
              </label>
            </div>

            {/* Scope / Summary */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                Executive Mandate Scope (1 sentence overview)
              </label>
              <input
                type="text"
                value={exp.description || ''}
                onChange={e => handleUpdateItem(exp.id, { description: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                placeholder="e.g. Lead global platform engineering, infrastructure, and developer velocity across 4 centers."
              />
            </div>

            {/* Achievements Bullet Points */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8172] font-semibold">
                  Quantified Impact &amp; Deliverables
                </span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(exp.id)}
                  className="text-[11px] text-[#8C8172] hover:text-[#0A0A0A] font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Achievement Bullet</span>
                </button>
              </div>

              <div className="space-y-2">
                {exp.achievements.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <span className="text-[#8C8172] mt-1.5 text-xs font-mono">•</span>
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={e => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                      className="flex-1 p-2 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172] leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteBullet(exp.id, bIdx)}
                      className="p-1 text-[#807D7A] hover:text-red-600 mt-1"
                      title="Remove Bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
