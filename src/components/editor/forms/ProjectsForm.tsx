import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { Project } from '../../../types/cv';

export const ProjectsForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { projects } = currentDoc;

  // Track collapsed status of individual project entries
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const areAllCollapsed = projects.length > 0 && projects.every(p => collapsedMap[p.id]);

  const toggleAll = () => {
    if (areAllCollapsed) {
      setCollapsedMap({});
    } else {
      const next: Record<string, boolean> = {};
      projects.forEach(p => { next[p.id] = true; });
      setCollapsedMap(next);
    }
  };

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
    setCollapsedMap(prev => ({ ...prev, [newProj.id]: false }));
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
            Strategic Projects &amp; Initiatives
          </h3>
          <p className="text-xs text-[#807D7A]">
            Significant technical transformations, commercial architectures, and key programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {projects.length > 1 && (
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
            onClick={handleAddProject}
            className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const isCollapsed = Boolean(collapsedMap[proj.id]);

          return (
            <div
              key={proj.id}
              className="bg-white border border-[#E5E3DF] rounded-sm overflow-hidden shadow-subtle transition-all"
            >
              {/* Header */}
              <div 
                onClick={() => toggleCollapse(proj.id)}
                className="px-4 py-3 bg-white hover:bg-[#F5F5F3]/60 cursor-pointer flex items-center justify-between border-b border-[#E5E3DF] transition-colors select-none"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="p-1 text-[#8C8172] hover:bg-[#EFEEEA] rounded transition-colors">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>

                  <div className="flex flex-wrap items-baseline gap-2 truncate">
                    <span className="font-serif text-sm font-semibold text-[#0A0A0A]">
                      #{idx + 1} {proj.title || 'Untitled Project'}
                    </span>
                    <span className="text-xs text-[#807D7A] font-sans">
                      • {proj.role} ({proj.startDate} – {proj.endDate})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              {!isCollapsed && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Project / Program Title
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
                        Your Leadership Mandate / Role
                      </label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={e => handleUpdate(proj.id, { role: e.target.value })}
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
                          value={proj.startDate}
                          onChange={e => handleUpdate(proj.id, { startDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={proj.endDate}
                          onChange={e => handleUpdate(proj.id, { endDate: e.target.value })}
                          className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Tech Stack / Architectural Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={proj.techStack ? proj.techStack.join(', ') : ''}
                        onChange={e =>
                          handleUpdate(proj.id, {
                            techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })
                        }
                        placeholder="e.g. Rust, gRPC, Kafka, AWS Outposts"
                        className="w-full px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                        Executive Summary of Initiative
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
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C8172] font-semibold">
                        Key Outcomes &amp; Technical Highlights
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddHighlight(proj.id)}
                        className="text-[11px] text-[#8C8172] hover:text-[#0A0A0A] font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Highlight</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {proj.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2">
                          <span className="text-[#8C8172] mt-1.5 text-xs font-mono">•</span>
                          <input
                            type="text"
                            value={hl}
                            onChange={e => handleUpdateHighlight(proj.id, hIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteHighlight(proj.id, hIdx)}
                            className="p-1 text-[#807D7A] hover:text-red-600"
                            title="Remove Highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
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
