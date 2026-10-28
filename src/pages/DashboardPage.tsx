import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Download, 
  Code, 
  ArrowUpRight, 
  LayoutTemplate,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  Mail,
  Settings,
  Upload
} from 'lucide-react';
import { useCV } from '../context/CVContext';
import { TEMPLATES } from '../data/templates';
import { TemplateId } from '../types/cv';
import { exportToPdfPrint, downloadPdfDirect } from '../utils/exportUtils';
import { CVDocumentRenderer } from '../components/preview/CVDocumentRenderer';
import { ResumeParserModal } from '../components/parser/ResumeParserModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    documents, 
    createNewDoc, 
    duplicateDoc, 
    deleteDoc, 
    setCurrentDocId,
    exportWorkspaceBackup,
    importWorkspaceBackup,
    resetToDefault
  } = useCV();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-cvs' | 'templates' | 'latex' | 'cover-letters' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuOpenDocId, setMenuOpenDocId] = useState<string | null>(null);
  const [isParserModalOpen, setIsParserModalOpen] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = importWorkspaceBackup(text);
      if (res.success) {
        setBackupMessage(`Successfully restored ${res.count} documents from backup!`);
      } else {
        setBackupMessage(`Restore failed: ${res.error}`);
      }
    } catch {
      setBackupMessage('Failed to read the selected backup file.');
    }
    if (backupInputRef.current) backupInputRef.current.value = '';
    setTimeout(() => setBackupMessage(null), 4000);
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.personalInfo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateNew = (templateId: TemplateId = 'corporate-classic') => {
    const newId = createNewDoc(templateId);
    navigate(`/editor/${newId}`);
  };

  const handleOpenDoc = (id: string) => {
    setCurrentDocId(id);
    navigate(`/editor/${id}`);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateDoc(id);
    setMenuOpenDocId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDoc(id);
    }
    setMenuOpenDocId(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#0A0A0A] flex flex-col md:flex-row selection:bg-[#8C8172] selection:text-white">
      {/* 1. Compact Left Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-[#EFEEEA] border-r border-[#E5E3DF] p-6 flex flex-col justify-between shrink-0 no-print">
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#0A0A0A] rounded-sm text-white flex items-center justify-center font-serif font-bold text-xs">
              A
            </div>
            <div>
              <div className="font-serif text-base font-semibold tracking-wider text-[#0A0A0A]">
                ATELIER CV
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#807D7A]">
                Professional Workspace
              </div>
            </div>
          </div>

          {/* Quick Create CTA & Parse CTA */}
          <div className="space-y-2">
            <button
              onClick={() => handleCreateNew()}
              className="w-full py-2.5 px-3 bg-[#0A0A0A] hover:bg-[#8C8172] text-[#F5F5F3] text-xs uppercase tracking-[0.14em] font-medium rounded-sm transition-luxury flex items-center justify-center gap-2 shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Create New CV</span>
            </button>
            <button
              onClick={() => setIsParserModalOpen(true)}
              className="w-full py-2 px-3 bg-white hover:bg-[#F5F5F3] text-[#0A0A0A] border border-[#D1CECA] text-xs uppercase tracking-[0.12em] font-medium rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              title="Parse an existing PDF, Word, LaTeX, or raw text resume"
            >
              <Upload className="w-3.5 h-3.5 text-[#8C8172]" />
              <span>Import / Parse CV</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium transition-luxury ${
                activeTab === 'overview'
                  ? 'bg-white text-[#0A0A0A] shadow-subtle border border-[#E5E3DF]'
                  : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4 text-[#8C8172]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('my-cvs')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium transition-luxury ${
                activeTab === 'my-cvs'
                  ? 'bg-white text-[#0A0A0A] shadow-subtle border border-[#E5E3DF]'
                  : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4 text-[#8C8172]" />
              <span>My CVs</span>
              <span className="ml-auto text-[10px] bg-[#E5E3DF] px-1.5 py-0.2 rounded-full text-[#4A4845]">
                {documents.length}
              </span>
            </button>

            <Link
              to="/templates"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60 transition-luxury"
            >
              <LayoutTemplate className="w-4 h-4 text-[#8C8172]" />
              <span>Templates</span>
            </Link>

            <Link
              to="/latex"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60 transition-luxury"
            >
              <Code className="w-4 h-4 text-[#8C8172]" />
              <span>LaTeX Studio</span>
            </Link>

            <Link
              to="/cover-letters"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60 transition-luxury"
            >
              <Mail className="w-4 h-4 text-[#8C8172]" />
              <span>Cover Letters</span>
            </Link>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm font-medium transition-luxury ${
                activeTab === 'settings'
                  ? 'bg-white text-[#0A0A0A] shadow-subtle border border-[#E5E3DF]'
                  : 'text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white/60'
              }`}
            >
              <Settings className="w-4 h-4 text-[#8C8172]" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Profile Card / User footer */}
        <div className="pt-6 border-t border-[#E5E3DF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8C8172] text-white flex items-center justify-center font-serif font-bold text-xs">
              JT
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-[#0A0A0A] truncate">
                {documents[0]?.personalInfo?.fullName || 'Julian Thorne'}
              </div>
              <div className="text-[10px] text-[#807D7A] truncate">
                Executive Edition
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Dashboard */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-8 border-b border-[#E5E3DF] gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-sans text-[#8C8172] mb-1.5 font-medium">
              Portfolio Overview
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0A0A0A] font-normal tracking-tight">
              Executive Documents
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#807D7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search CVs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-[#E5E3DF] rounded-sm text-xs focus:outline-none focus:border-[#8C8172] w-48 sm:w-64 transition-colors"
              />
            </div>

            <button
              onClick={() => setIsParserModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-[#EFEEEA] border border-[#D1CECA] text-[#0A0A0A] text-xs uppercase tracking-[0.12em] font-medium rounded-sm transition-colors flex items-center gap-2 shadow-subtle shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-[#8C8172]" />
              <span>Import &amp; Parse</span>
            </button>

            <button
              onClick={() => handleCreateNew()}
              className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-[#F5F5F3] text-xs uppercase tracking-[0.12em] font-medium rounded-sm transition-luxury flex items-center gap-2 shadow-subtle shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New CV</span>
            </button>
          </div>
        </div>

        {/* Universal CV Parser Promo Banner (Overview tab) */}
        {activeTab === 'overview' && (
          <div className="mb-10 p-6 bg-gradient-to-r from-[#141414] via-[#1C1A18] to-[#262421] rounded-sm text-white border border-[#333] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#8C8172]/30 text-[#D1CECA] border border-[#8C8172]/40">
                <Sparkles className="w-3 h-3 text-[#8C8172]" />
                Universal CV Parser
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                Have an existing resume? Import it in seconds.
              </h3>
              <p className="text-xs text-[#807D7A] leading-relaxed">
                Accepts PDF, Word (.docx), LaTeX (.tex), JSONResume, or direct text paste. Automatically extracts leadership mandates, career history, education, skills, and metrics.
              </p>
            </div>
            <button
              onClick={() => setIsParserModalOpen(true)}
              className="px-5 py-3 bg-[#8C8172] hover:bg-[#786E60] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-sm shadow-md shrink-0 flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload &amp; Parse Resume</span>
            </button>
          </div>
        )}

        {activeTab === 'settings' ? (
          /* Settings & Workspace Backup Dossier */
          <section className="space-y-8 animate-in fade-in duration-150">
            {backupMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-mono">
                {backupMessage}
              </div>
            )}

            <div className="bg-white border border-[#E5E3DF] rounded-sm p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#0A0A0A] mb-1">
                  Workspace Storage &amp; Data Durability
                </h2>
                <p className="text-xs text-[#807D7A] leading-relaxed max-w-2xl">
                  All CV documents, cover letters, and LaTeX code are stored privately inside your browser&apos;s offline localStorage. No personal data is sent to external databases.
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm">
                  <div className="text-[10px] font-mono uppercase text-[#807D7A]">Stored Documents</div>
                  <div className="font-serif text-2xl font-bold text-[#0A0A0A] mt-1">{documents.length}</div>
                </div>
                <div className="p-4 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm">
                  <div className="text-[10px] font-mono uppercase text-[#807D7A]">Privacy Mode</div>
                  <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">100% Client-Side</div>
                </div>
                <div className="p-4 bg-[#F5F5F3] border border-[#E5E3DF] rounded-sm">
                  <div className="text-[10px] font-mono uppercase text-[#807D7A]">Storage Engine</div>
                  <div className="font-serif text-2xl font-bold text-[#8C8172] mt-1">HTML5 Offline</div>
                </div>
              </div>

              {/* Backup & Restore Controls */}
              <div className="pt-4 border-t border-[#E5E3DF] flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={exportWorkspaceBackup}
                  className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Backup (.json)</span>
                </button>

                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleBackupFile}
                  accept=".json,application/json"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => backupInputRef.current?.click()}
                  className="px-5 py-2.5 bg-white hover:bg-[#EFEEEA] border border-[#D1CECA] text-[#0A0A0A] text-xs font-mono uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-[#8C8172]" />
                  <span>Restore from Backup File</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all documents to the initial demo state? Current CVs will be replaced.')) {
                      resetToDefault();
                    }
                  }}
                  className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-red-600 hover:text-red-800 hover:bg-red-50 rounded-sm transition-colors ml-auto"
                >
                  Reset Workspace
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Recent Documents Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-medium text-[#0A0A0A]">
              Recent Documents
            </h2>
            <span className="text-xs text-[#807D7A]">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'} total
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#E5E3DF] rounded-sm">
              <FileText className="w-8 h-8 text-[#807D7A] mx-auto mb-3" />
              <h3 className="font-serif text-lg text-[#0A0A0A] mb-1">No documents found</h3>
              <p className="text-xs text-[#807D7A] mb-4">Try adjusting your search query or create a new CV.</p>
              <button
                onClick={() => handleCreateNew()}
                className="px-4 py-2 bg-[#0A0A0A] text-white text-xs uppercase tracking-wider rounded-sm font-medium"
              >
                Create New Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map(doc => {
                const isMenuOpen = menuOpenDocId === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc.id)}
                    className="group bg-white border border-[#E5E3DF] hover:border-[#8C8172] rounded-sm p-4 transition-luxury cursor-pointer flex flex-col justify-between shadow-subtle hover:shadow-paper relative"
                  >
                    {/* Realistic Mini Preview Header */}
                    <div className="w-full h-44 bg-[#F5F5F3] rounded-sm overflow-hidden border border-[#E5E3DF] mb-4 relative flex items-center justify-center p-2 group-hover:bg-[#EFEEEA] transition-colors">
                      {/* Scaled Mini Document */}
                      <div className="transform scale-[0.24] origin-top pointer-events-none select-none shadow-sm">
                        <CVDocumentRenderer doc={doc} zoom={1} showPageBorders={false} />
                      </div>

                      {/* Overlay badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm border border-[#E5E3DF] px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase text-[#8C8172]">
                        {doc.settings.templateId.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Document Meta */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif text-lg font-medium text-[#0A0A0A] group-hover:text-[#8C8172] transition-colors line-clamp-1">
                          {doc.title}
                        </h3>

                        {/* Action Menu Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenDocId(isMenuOpen ? null : doc.id);
                            }}
                            className="p-1 hover:bg-[#EFEEEA] rounded text-[#807D7A] hover:text-[#0A0A0A]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E5E3DF] rounded-sm shadow-floating py-1 z-20 text-xs"
                            >
                              <button
                                onClick={() => handleOpenDoc(doc.id)}
                                className="w-full px-3 py-1.5 text-left text-[#0A0A0A] hover:bg-[#EFEEEA] flex items-center gap-2"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#8C8172]" />
                                <span>Edit Document</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadPdfDirect(doc);
                                  setMenuOpenDocId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-[#0A0A0A] hover:bg-[#EFEEEA] flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-[#8C8172]" />
                                <span>Download PDF</span>
                              </button>
                              <button
                                onClick={(e) => handleDuplicate(doc.id, e)}
                                className="w-full px-3 py-1.5 text-left text-[#0A0A0A] hover:bg-[#EFEEEA] flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#8C8172]" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentDocId(doc.id);
                                  navigate(`/latex`);
                                }}
                                className="w-full px-3 py-1.5 text-left text-[#0A0A0A] hover:bg-[#EFEEEA] flex items-center gap-2"
                              >
                                <Code className="w-3.5 h-3.5 text-[#8C8172]" />
                                <span>LaTeX Studio</span>
                              </button>
                              <div className="border-t border-[#E5E3DF] my-1"></div>
                              <button
                                onClick={(e) => handleDelete(doc.id, e)}
                                className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Document</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#807D7A] pt-2 border-t border-[#E5E3DF]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8C8172]" />
                          <span>Modified {new Date(doc.lastModified).toLocaleDateString()}</span>
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#8C8172]">
                          {doc.settings.paperSize.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Template Recommendations Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#0A0A0A]">
                Recommended Templates
              </h2>
              <p className="text-xs text-[#807D7A]">
                Executive layouts curated for multinational leadership and corporate boards.
              </p>
            </div>
            <Link
              to="/templates"
              className="text-xs font-medium text-[#8C8172] hover:text-[#0A0A0A] flex items-center gap-1 transition-colors"
            >
              <span>View All 6 Designs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.slice(0, 3).map(tpl => (
              <div
                key={tpl.id}
                className="bg-white border border-[#E5E3DF] hover:border-[#8C8172] rounded-sm p-5 transition-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="font-mono text-[#8C8172] uppercase tracking-wider bg-[#EFEEEA] px-2 py-0.5 rounded-sm">
                      {tpl.category}
                    </span>
                    <span className="text-emerald-800 font-medium">
                      {tpl.atsScore}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-[#807D7A] leading-relaxed mb-4">
                    {tpl.description}
                  </p>
                </div>

                <button
                  onClick={() => handleCreateNew(tpl.id)}
                  className="w-full py-2 bg-[#EFEEEA] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-white text-xs uppercase tracking-[0.1em] font-medium rounded-sm transition-colors text-center"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    )}
  </main>

      {/* Universal Resume / CV Parser Modal */}
      <ResumeParserModal 
        isOpen={isParserModalOpen} 
        onClose={() => setIsParserModalOpen(false)} 
        targetMode="new" 
      />
    </div>
  );
};
