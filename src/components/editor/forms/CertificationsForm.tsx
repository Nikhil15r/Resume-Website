import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { Certification, Publication, Award } from '../../../types/cv';

export const CertificationsForm: React.FC = () => {
  const { currentDoc, updateField } = useCV();
  const { certifications, publications, awards } = currentDoc;

  // Certifications
  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Executive Leadership Program',
      issuer: 'Harvard Business School',
      date: '2024'
    };
    updateField('certifications', [...certifications, newCert]);
  };

  const handleUpdateCert = (id: string, updates: Partial<Certification>) => {
    updateField('certifications', certifications.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCert = (id: string) => {
    updateField('certifications', certifications.filter(c => c.id !== id));
  };

  // Publications
  const handleAddPub = () => {
    const newPub: Publication = {
      id: `pub-${Date.now()}`,
      title: 'Scalable Distributed Architectures for Global Financial Infrastructure',
      publisher: 'IEEE Software',
      date: '2023',
      authors: 'J. Thorne'
    };
    updateField('publications', [...publications, newPub]);
  };

  const handleUpdatePub = (id: string, updates: Partial<Publication>) => {
    updateField('publications', publications.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePub = (id: string) => {
    updateField('publications', publications.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
              Certifications &amp; Accreditations
            </h3>
            <p className="text-xs text-[#807D7A]">
              Industry certifications, licenses, and professional memberships.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map(c => (
            <div key={c.id} className="p-4 bg-white border border-[#E5E3DF] rounded-sm flex items-center gap-3">
              <input
                type="text"
                value={c.name}
                onChange={e => handleUpdateCert(c.id, { name: e.target.value })}
                placeholder="Certification Name"
                className="flex-1 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
              />
              <input
                type="text"
                value={c.issuer}
                onChange={e => handleUpdateCert(c.id, { issuer: e.target.value })}
                placeholder="Issuing Body"
                className="w-48 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
              />
              <input
                type="text"
                value={c.date}
                onChange={e => handleUpdateCert(c.id, { date: e.target.value })}
                placeholder="Year"
                className="w-24 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
              />
              <button
                type="button"
                onClick={() => handleDeleteCert(c.id)}
                className="p-1.5 text-[#807D7A] hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Publications Section */}
      <div className="space-y-4 pt-6 border-t border-[#E5E3DF]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
              Publications &amp; Patents
            </h3>
            <p className="text-xs text-[#807D7A]">
              Scholarly papers, books, patents, or keynote transcripts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddPub}
            className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Publication</span>
          </button>
        </div>

        <div className="space-y-3">
          {publications.map(p => (
            <div key={p.id} className="p-4 bg-white border border-[#E5E3DF] rounded-sm space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={p.title}
                  onChange={e => handleUpdatePub(p.id, { title: e.target.value })}
                  placeholder="Paper Title"
                  className="flex-1 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePub(p.id)}
                  className="p-1.5 text-[#807D7A] hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={p.publisher}
                  onChange={e => handleUpdatePub(p.id, { publisher: e.target.value })}
                  placeholder="Journal / Conference / Publisher"
                  className="flex-1 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                />
                <input
                  type="text"
                  value={p.authors}
                  onChange={e => handleUpdatePub(p.id, { authors: e.target.value })}
                  placeholder="Authors"
                  className="w-48 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                />
                <input
                  type="text"
                  value={p.date}
                  onChange={e => handleUpdatePub(p.id, { date: e.target.value })}
                  placeholder="Year"
                  className="w-24 px-3 py-1.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
