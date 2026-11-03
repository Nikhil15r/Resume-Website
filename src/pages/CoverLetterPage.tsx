import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Plus, Trash2, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { downloadCoverLetterPdfDirect, exportToPdfPrint } from '../utils/exportUtils';
import { CoverLetterDocument } from '../types/cv';

export const CoverLetterPage: React.FC = () => {
  const { currentCoverLetter, updateCoverLetter, createNewCoverLetter, currentDoc } = useCV();
  const [zoom, setZoom] = useState<number>(0.85);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const handleDirectDownload = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadCoverLetterPdfDirect(currentCoverLetter);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleUpdate = (field: keyof CoverLetterDocument, value: any) => {
    updateCoverLetter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateParagraph = (idx: number, val: string) => {
    const updated = [...currentCoverLetter.bodyParagraphs];
    updated[idx] = val;
    handleUpdate('bodyParagraphs', updated);
  };

  const handleAddParagraph = () => {
    handleUpdate('bodyParagraphs', [
      ...currentCoverLetter.bodyParagraphs,
      'Furthermore, my experience aligns directly with the strategic imperatives of this mandate.'
    ]);
  };

  const handleDeleteParagraph = (idx: number) => {
    handleUpdate(
      'bodyParagraphs',
      currentCoverLetter.bodyParagraphs.filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F3] overflow-hidden selection:bg-[#8C8172] selection:text-white">
      {/* Top Header */}
      <header className="h-14 sm:h-16 bg-white border-b border-[#E5E3DF] px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 no-print gap-2">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden min-w-0">
          <Link
            to="/dashboard"
            className="p-1 sm:p-1.5 hover:bg-[#EFEEEA] rounded-sm text-[#807D7A] hover:text-[#0A0A0A] transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-serif text-sm sm:text-base font-semibold text-[#0A0A0A] truncate">
              Cover Letter Studio
            </h1>
            <p className="text-[10px] text-[#807D7A] uppercase tracking-wider truncate hidden sm:block">
              {currentCoverLetter.title}
            </p>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden items-center bg-[#EFEEEA] p-0.5 rounded-sm border border-[#E5E3DF] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${
              activeTab === 'editor'
                ? 'bg-white text-[#0A0A0A] shadow-xs font-semibold'
                : 'text-[#807D7A]'
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-[#0A0A0A] shadow-xs font-semibold'
                : 'text-[#807D7A]'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => createNewCoverLetter()}
            className="hidden sm:inline-block px-3 py-1.5 bg-[#EFEEEA] hover:bg-[#E5E3DF] text-[#0A0A0A] text-xs font-medium rounded-sm border border-[#E5E3DF] transition-colors"
          >
            New
          </button>
          <button
            onClick={handleDirectDownload}
            disabled={isDownloadingPdf}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-[11px] sm:text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5 sm:gap-2 shadow-subtle disabled:opacity-60"
          >
            {isDownloadingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8C8172]" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isDownloadingPdf ? 'Generating...' : 'Download PDF'}</span>
            <span className="inline sm:hidden">PDF</span>
          </button>
          <button
            onClick={exportToPdfPrint}
            className="p-1.5 sm:p-2 border border-[#E5E3DF] hover:bg-[#EFEEEA] rounded-sm text-[#807D7A] hover:text-[#0A0A0A] transition-colors"
            title="Print Dialog"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Input Form Panel */}
        <main className={`overflow-y-auto p-4 sm:p-8 lg:p-10 border-r border-[#E5E3DF] bg-[#F5F5F3] space-y-6 ${
          activeTab === 'editor' ? 'flex-1 block' : 'hidden lg:block lg:w-[480px] xl:w-[540px]'
        }`}>
          <div>
            <h2 className="font-serif text-xl font-medium text-[#0A0A0A] mb-1">
              Letter Details &amp; Addressee
            </h2>
            <p className="text-xs text-[#807D7A]">
              Formal executive letterhead credentials matching your CV styling.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.recipientName}
                  onChange={e => handleUpdate('recipientName', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Recipient Title
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.recipientTitle}
                  onChange={e => handleUpdate('recipientTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.companyName}
                  onChange={e => handleUpdate('companyName', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.date}
                  onChange={e => handleUpdate('date', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                Formal Salutation
              </label>
              <input
                type="text"
                value={currentCoverLetter.salutation}
                onChange={e => handleUpdate('salutation', e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] focus:outline-none focus:border-[#8C8172]"
              />
            </div>

            {/* Opening Paragraph */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                Opening Statement / Mandate Alignment
              </label>
              <textarea
                rows={3}
                value={currentCoverLetter.openingParagraph}
                onChange={e => handleUpdate('openingParagraph', e.target.value)}
                className="w-full p-3 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] leading-relaxed focus:outline-none focus:border-[#8C8172]"
              />
            </div>

            {/* Body Paragraphs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8C8172] font-semibold">
                  Core Argument &amp; Impact Paragraphs
                </label>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="text-xs text-[#8C8172] hover:text-[#0A0A0A] flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentCoverLetter.bodyParagraphs.map((para, pIdx) => (
                  <div key={pIdx} className="flex gap-2">
                    <textarea
                      rows={4}
                      value={para}
                      onChange={e => handleUpdateParagraph(pIdx, e.target.value)}
                      className="flex-1 p-3 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] leading-relaxed focus:outline-none focus:border-[#8C8172]"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteParagraph(pIdx)}
                      className="p-1 text-[#807D7A] hover:text-red-600 self-start mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing Paragraph */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                Closing Paragraph &amp; Next Steps
              </label>
              <textarea
                rows={3}
                value={currentCoverLetter.closingParagraph}
                onChange={e => handleUpdate('closingParagraph', e.target.value)}
                className="w-full p-3 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A] leading-relaxed focus:outline-none focus:border-[#8C8172]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Sign-off Phrase
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.signoff}
                  onChange={e => handleUpdate('signoff', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#4A4845] mb-1">
                  Signatory Name
                </label>
                <input
                  type="text"
                  value={currentCoverLetter.senderName}
                  onChange={e => handleUpdate('senderName', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E5E3DF] rounded-sm text-xs text-[#0A0A0A]"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Right: Rendered Letter Preview Sheet */}
        <aside className={`flex-1 bg-[#EFEEEA] p-3 sm:p-6 lg:p-8 overflow-y-auto justify-center items-start ${
          activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="w-full flex justify-center overflow-x-auto">
            <div
              id="cv-printable-document"
              className="cv-document-sheet bg-white border border-[#E5E3DF] shadow-paper p-6 sm:p-10 md:p-[48pt] text-[#0A0A0A] font-serif text-[10.5pt] leading-[1.6] max-w-full"
              style={{ width: '210mm', minHeight: '297mm' }}
            >
            {/* Letterhead */}
            <header className="pb-4 mb-6 border-b border-[#0A0A0A]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[20pt] font-semibold text-[#0A0A0A] tracking-tight">
                    {currentCoverLetter.senderName}
                  </h2>
                  <div className="text-[9.5pt] font-sans text-[#8C8172] italic">
                    {currentCoverLetter.senderTitle}
                  </div>
                </div>
                <div className="text-right text-[8.5pt] font-sans text-[#4A4845] space-y-0.5">
                  <div>{currentCoverLetter.senderLocation}</div>
                  <div>{currentCoverLetter.senderEmail}</div>
                  <div>{currentCoverLetter.senderPhone}</div>
                </div>
              </div>
            </header>

            {/* Date & Recipient Details */}
            <div className="font-sans text-[9pt] text-[#4A4845] space-y-1 mb-6">
              <div className="text-[#0A0A0A] font-medium">{currentCoverLetter.date}</div>
              <div className="pt-2 font-semibold text-[#0A0A0A]">{currentCoverLetter.recipientName}</div>
              <div>{currentCoverLetter.recipientTitle}</div>
              <div className="font-medium text-[#0A0A0A]">{currentCoverLetter.companyName}</div>
              <div>{currentCoverLetter.companyAddress}</div>
            </div>

            {/* Salutation */}
            <div className="mb-4 text-[#0A0A0A] font-medium">
              {currentCoverLetter.salutation}
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-justify text-[10pt] text-[#1A1A1A]">
              <p>{currentCoverLetter.openingParagraph}</p>
              {currentCoverLetter.bodyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p>{currentCoverLetter.closingParagraph}</p>
            </div>

            {/* Sign-off */}
            <div className="mt-8 font-sans text-[9.5pt] space-y-4">
              <div>{currentCoverLetter.signoff}</div>
              <div className="font-serif text-[12pt] font-semibold text-[#0A0A0A]">
                {currentCoverLetter.senderName}
              </div>
            </div>
          </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
