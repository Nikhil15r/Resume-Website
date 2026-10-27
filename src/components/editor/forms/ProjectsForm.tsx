import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { Project } from '../../../types/cv';

export const ProjectsForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { projects } = currentDoc;

  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Global Core Architecture Modernization',
      role: 'Principal Architectural Lead',
      startDate: '2023',
      endDate: '2024',
      description: 'Engineered high-throughput transactional mesh connecting tier-1 liquidity providers.',
      highlights: [
        'Reduced P99 processing latency by 64% under peak enterprise workloads.',
        'Zero unplanned downtime across 18 months of continuous production execution.'
      ],
      techStack: ['Kubernetes', 'Go', 'Distributed Ledger', 'AWS']
    };
    updateField('projects', [...projects, newProj]);
  };

  const handleUpdate = (id: string, updates: Partial<Project>) => {
    updateField(
      'projects',
      projects.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleDelete = (id: string) => {
    updateField('projects', projects.filter(p => p.id !== id));
  };

  const handleAddHighlight = (projId: string) => {
    updateField(
      'projects',
      projects.map(p => {
        if (p.id === projId) {
          return { ...p, highlights: [...p.highlights, 'Delivered quantifiable architecture milestone.'] };
        }
        return p;
      })
    );
  };

  const handleUpdateHighlight = (projId: string, idx: number, val: string) => {
    updateField(
      'projects',
      projects.map(p => {
        if (p.id === projId) {
          const highlights = [...p.highlights];
          highlights[idx] = val;
          return { ...p, highlights };
        }
        return p;
      })
    );
  };

  const handleDeleteHighlight = (projId: string, idx: number) => {
    updateField(
      'projects',
      projects.map(p => {
        if (p.id === projId) {
          return { ...p, highlights: p.highlights.filter((_, i) => i !== idx) };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Strategic Initiatives &amp; Architecture
          </h3>
          <p className="text-xs text-[#807D7A]">
            Selected high-value projects, open-source architectures, or case studies.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-5 bg-white border border-[#E5E3DF] rounded-sm space-y-3.5 shadow-subtle"
          >
            <div className="flex items-center justify-between border-b border-[#E5E3DF] pb-2.5">
              <span className="font-serif text-base font-semibold text-[#0A0A0A]">
                #{idx + 1} {proj.title || 'Initiative'}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(proj.id)}
                className="p-1 text-red-600 hover:text-red-700"
                title="Remove Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Project / Initiative Title
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={e => handleUpdate(proj.id, { title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Role / Sponsorship Scope
                </label>
                <input
                  type="text"
                  value={proj.role}
                  onChange={e => handleUpdate(proj.id, { role: e.target.value })}
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
                    value={proj.startDate}
                    onChange={e => handleUpdate(proj.id, { startDate: e.target.value })}
                    className="w-1/2 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                  />
                  <input
                    type="text"
                    value={proj.endDate}
                    onChange={e => handleUpdate(proj.id, { endDate: e.target.value })}
                    className="w-1/2 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={(proj.techStack || []).join(', ')}
                  onChange={e => handleUpdate(proj.id, { techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="e.g. Rust, gRPC, eBPF, AWS"
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Overview Description
                </label>
                <input
                  type="text"
                  value={proj.description}
                  onChange={e => handleUpdate(proj.id, { description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8172] font-semibold">
                  Key Metrics &amp; Architecture Points
                </span>
                <button
                  type="button"
                  onClick={() => handleAddHighlight(proj.id)}
                  className="text-[11px] text-[#8C8172] hover:text-[#0A0A0A] font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {proj.highlights.map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <span className="text-[#8C8172] font-mono">•</span>
                    <input
                      type="text"
                      value={hl}
                      onChange={e => handleUpdateHighlight(proj.id, hIdx, e.target.value)}
                      className="flex-1 px-3 py-1 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(proj.id, hIdx)}
                      className="p-1 text-[#807D7A] hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
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
