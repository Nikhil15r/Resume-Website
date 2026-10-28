import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { Education } from '../../../types/cv';

export const EducationForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { education } = currentDoc;

  // Track collapsed status of individual education entries
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const areAllCollapsed = education.length > 0 && education.every(e => collapsedMap[e.id]);

  const toggleAll = () => {
    if (areAllCollapsed) {
      setCollapsedMap({});
    } else {
      const next: Record<string, boolean> = {};
      education.forEach(e => { next[e.id] = true; });
      setCollapsedMap(next);
    }
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'Master of Business Administration (MBA)',
      field: 'Finance & Strategy',
      school: 'Columbia Business School',
      location: 'New York, NY',
      startDate: '2016',
      endDate: '2018',
      gpa: '3.9 / 4.0',
      honors: 'Dean\'s Honors List'
    };
    updateField('education', [...education, newEdu]);
    setCollapsedMap(prev => ({ ...prev, [newEdu.id]: false }));
  };

  const handleUpdate = (id: string, updates: Partial<Education>) => {
    updateField(
      'education',
      education.map(edu => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  const handleDelete = (id: string) => {
    updateField('education', education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Education &amp; Academic Credentials
          </h3>
          <p className="text-xs text-[#807D7A]">
            Degrees, academic institutions, honors, and research distinctions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {education.length > 1 && (
            <button
              type="button"
              onClick={toggleAll}
              className="px-2.5 py-1.5 text-xs text-[#4A4845] hover:text-[#0A0A0A] bg-white border border-[#E5E3DF] hover:bg-[#F5F5F3] rounded-sm transition-colors flex items-center gap-1 font-mono"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{areAllCollapsed ? 'Expand All' : 'Collapse All'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddEducation}
            className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => {
          const isCollapsed = Boolean(collapsedMap[edu.id]);

          return (
            <div
              key={edu.id}
              className="bg-white border border-[#E5E3DF] rounded-sm overflow-hidden shadow-subtle transition-all"
            >
              {/* Header */}
              <div 
                onClick={() => toggleCollapse(edu.id)}
                className="px-4 py-3 bg-white hover:bg-[#F5F5F3]/60 cursor-pointer flex items-center justify-between border-b border-[#E5E3DF] transition-colors select-none"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="p-1 text-[#8C8172] hover:bg-[#EFEEEA] rounded transition-colors">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>

                  <div className="flex flex-wrap items-baseline gap-2 truncate">
                    <span className="font-serif text-sm font-semibold text-[#0A0A0A]">
                      #{idx + 1} {edu.school || 'Academic Institution'}
                    </span>
                    <span className="text-xs text-[#807D7A] font-sans">
                      • {edu.degree} {edu.field ? `, ${edu.field}` : ''} ({edu.startDate} – {edu.endDate})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove Education"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              {!isCollapsed && (
                <div className="p-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={e => handleUpdate(edu.id, { school: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Degree (e.g. B.S., M.S., Ph.D.)
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => handleUpdate(edu.id, { degree: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Field of Study / Major
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={e => handleUpdate(edu.id, { field: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={e => handleUpdate(edu.id, { location: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Start Year
                      </label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={e => handleUpdate(edu.id, { startDate: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={e => handleUpdate(edu.id, { endDate: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                      Honors, Societies &amp; Research Awards (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.honors || ''}
                      onChange={e => handleUpdate(edu.id, { honors: e.target.value })}
                      placeholder="e.g. Summa Cum Laude, Tau Beta Pi Honor Society"
                      className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
