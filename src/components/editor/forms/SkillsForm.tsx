import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { SkillCategory } from '../../../types/cv';

export const SkillsForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { skills } = currentDoc;
  const [newSkillInput, setNewSkillInput] = useState<{ [categoryId: string]: string }>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `sk-${Date.now()}`,
      category: 'Strategic Capabilities',
      items: ['Executive Leadership', 'Corporate Strategy', 'Cross-Functional Governance']
    };
    updateField('skills', [...skills, newCat]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    updateField(
      'skills',
      skills.map(s => (s.id === id ? { ...s, category: name } : s))
    );
  };

  const handleDeleteCategory = (id: string) => {
    updateField('skills', skills.filter(s => s.id !== id));
  };

  const handleAddItem = (catId: string) => {
    const text = (newSkillInput[catId] || '').trim();
    if (!text) return;

    updateField(
      'skills',
      skills.map(s => {
        if (s.id === catId && !s.items.includes(text)) {
          return { ...s, items: [...s.items, text] };
        }
        return s;
      })
    );

    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const handleRemoveItem = (catId: string, itemIdx: number) => {
    updateField(
      'skills',
      skills.map(s => {
        if (s.id === catId) {
          return { ...s, items: s.items.filter((_, i) => i !== itemIdx) };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Core Competencies &amp; Expertise
          </h3>
          <p className="text-xs text-[#807D7A]">
            Group competencies logically to strengthen ATS match without visual clutter.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((category) => (
          <div
            key={category.id}
            className="p-5 bg-white border border-[#E5E3DF] rounded-sm space-y-3 shadow-subtle"
          >
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={category.category}
                onChange={e => handleUpdateCategoryName(category.id, e.target.value)}
                className="font-serif text-base font-semibold text-[#0A0A0A] bg-transparent border-b border-transparent hover:border-[#E5E3DF] focus:border-[#8C8172] focus:outline-none px-1 py-0.5 w-full max-w-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteCategory(category.id)}
                className="p-1 text-red-600 hover:text-red-700"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Tags Container */}
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm">
              {category.items.map((item, iIdx) => (
                <span
                  key={iIdx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(category.id, iIdx)}
                    className="text-[#807D7A] hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type competency and press Enter or click Add..."
                value={newSkillInput[category.id] || ''}
                onChange={e => setNewSkillInput({ ...newSkillInput, [category.id]: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(category.id);
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
              />
              <button
                type="button"
                onClick={() => handleAddItem(category.id)}
                className="px-3 py-1.5 bg-[#EFEEEA] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-white border border-[#E5E3DF] text-xs font-medium rounded-sm transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
