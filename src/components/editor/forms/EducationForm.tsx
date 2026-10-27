import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { Education } from '../../../types/cv';

export const EducationForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { education } = currentDoc;

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Education &amp; Academic Credentials
          </h3>
          <p className="text-xs text-[#807D7A]">
            Degrees, academic institutions, honors, and research distinctions.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Degree</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-5 bg-white border border-[#E5E3DF] rounded-sm space-y-3.5 shadow-subtle"
          >
            <div className="flex items-center justify-between border-b border-[#E5E3DF] pb-2.5">
              <span className="font-serif text-base font-semibold text-[#0A0A0A]">
                #{idx + 1} {edu.school || 'Academic Institution'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(edu.id)}
                className="p-1 text-red-600 hover:text-red-700"
                title="Remove Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

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
                  Location (City, State / Country)
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
                  Timeline (Start – End)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={e => handleUpdate(edu.id, { startDate: e.target.value })}
                    placeholder="2012"
                    className="w-1/2 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                  />
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={e => handleUpdate(edu.id, { endDate: e.target.value })}
                    placeholder="2014"
                    className="w-1/2 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={e => handleUpdate(edu.id, { gpa: e.target.value })}
                  placeholder="3.94 / 4.0"
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Honors, Fellowships, or Thesis
                </label>
                <input
                  type="text"
                  value={edu.honors || ''}
                  onChange={e => handleUpdate(edu.id, { honors: e.target.value })}
                  placeholder="e.g. MIT Presidential Fellow • EECS Departmental Honors"
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
