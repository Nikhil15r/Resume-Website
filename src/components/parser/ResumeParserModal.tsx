import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  FileCode, 
  RefreshCw,
  Copy,
  Layers,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { extractTextFromFile } from '../../utils/fileExtractors';
import { parseResumeText, ParsedResumeResult } from '../../utils/resumeParser';

interface ResumeParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMode?: 'new' | 'current'; // 'new' creates a new doc, 'current' applies to active doc
}

export const ResumeParserModal: React.FC<ResumeParserModalProps> = ({
  isOpen,
  onClose,
  targetMode = 'new'
}) => {
  const navigate = useNavigate();
  const { updateDoc, createNewDoc } = useCV();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedResumeResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setParsedResult(null);

    try {
      setProcessingStep(`Reading ${file.name}...`);
      await new Promise(r => setTimeout(r, 200));

      const { text, format } = await extractTextFromFile(file);

      if (!text || text.trim().length < 20) {
        throw new Error('The file did not contain readable text. If this is a scanned image, please paste the plain text directly.');
      }

      setProcessingStep('Segmenting sections & contact details...');
      await new Promise(r => setTimeout(r, 250));

      setProcessingStep('Structuring work history & achievements...');
      await new Promise(r => setTimeout(r, 200));

      const result = parseResumeText(text, format);
      setParsedResult(result);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err?.message || 'Failed to parse file. Please try pasting the text directly.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handlePasteProcess = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setError('Please paste at least a few lines of resume text to parse.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setParsedResult(null);

    try {
      setProcessingStep('Analyzing text structure...');
      await new Promise(r => setTimeout(r, 250));

      setProcessingStep('Extracting career history & education...');
      await new Promise(r => setTimeout(r, 250));

      const result = parseResumeText(pastedText, 'text');
      setParsedResult(result);
    } catch (err: any) {
      setError('Failed to analyze pasted text.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleCreateNewFromParsed = () => {
    if (!parsedResult) return;
    const doc = parsedResult.document;
    
    // Create new document populated with parsed content directly
    // Pass the parsed document fields as initialContent so the new doc
    // is created with parsed data instead of template mock data
    const newId = createNewDoc(
      doc.settings.templateId,
      doc.title || 'Imported Resume',
      {
        personalInfo: doc.personalInfo,
        summary: doc.summary,
        experience: doc.experience,
        education: doc.education,
        skills: doc.skills,
        projects: doc.projects,
        certifications: doc.certifications,
        publications: doc.publications,
        awards: doc.awards
      }
    );

    onClose();
    navigate(`/editor/${newId}`);
  };

  const handleApplyToCurrent = () => {
    if (!parsedResult) return;
    const doc = parsedResult.document;

    updateDoc(prev => ({
      ...prev,
      personalInfo: doc.personalInfo,
      summary: doc.summary || prev.summary,
      experience: doc.experience.length > 0 ? doc.experience : prev.experience,
      education: doc.education.length > 0 ? doc.education : prev.education,
      skills: doc.skills.length > 0 ? doc.skills : prev.skills,
      projects: doc.projects.length > 0 ? doc.projects : prev.projects,
      certifications: doc.certifications.length > 0 ? doc.certifications : prev.certifications,
      publications: doc.publications && doc.publications.length > 0 ? doc.publications : prev.publications,
      awards: doc.awards && doc.awards.length > 0 ? doc.awards : prev.awards,
      lastModified: new Date().toISOString()
    }));

    onClose();
  };

  const resetParser = () => {
    setParsedResult(null);
    setError(null);
    setPastedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white border border-[#E5E3DF] rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E3DF] flex items-center justify-between bg-[#F5F5F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#0A0A0A] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-[#8C8172]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#0A0A0A]">
                Universal CV &amp; Resume Parser
              </h2>
              <p className="text-xs text-[#807D7A]">
                Extract structured career data from any PDF, Word document, LaTeX, or raw text.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#807D7A] hover:text-[#0A0A0A] hover:bg-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!parsedResult ? (
            <>
              {/* Tab Selector */}
              <div className="flex border-b border-[#E5E3DF] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setActiveTab('upload'); setError(null); }}
                  className={`pb-2.5 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
                    activeTab === 'upload'
                      ? 'border-[#0A0A0A] text-[#0A0A0A]'
                      : 'border-transparent text-[#807D7A] hover:text-[#0A0A0A]'
                  }`}
                >
                  Upload File (.pdf, .docx, .tex, .json)
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('paste'); setError(null); }}
                  className={`pb-2.5 px-4 font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
                    activeTab === 'paste'
                      ? 'border-[#0A0A0A] text-[#0A0A0A]'
                      : 'border-transparent text-[#807D7A] hover:text-[#0A0A0A]'
                  }`}
                >
                  Paste Resume Text
                </button>
              </div>

              {/* Tab 1: Upload File */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileProcess(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 sm:p-10 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#8C8172] bg-[#8C8172]/10 scale-[1.01]'
                        : 'border-[#D1CECA] hover:border-[#8C8172] bg-[#F5F5F3]/60 hover:bg-[#F5F5F3]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.md,.tex,.json"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileProcess(file);
                      }}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#E5E3DF] flex items-center justify-center mx-auto mb-3 text-[#8C8172]">
                      <Upload className="w-5 h-5" />
                    </div>

                    <h4 className="font-serif text-base font-semibold text-[#0A0A0A] mb-1">
                      Drag &amp; Drop your resume file here
                    </h4>
                    <p className="text-xs text-[#807D7A] mb-4">
                      or click to browse your computer files
                    </p>

                    {/* Supported formats pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] text-[#4A4845]">
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3DF]">PDF (.pdf)</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3DF]">Word (.docx)</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3DF]">LaTeX (.tex)</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3DF]">JSON Resume</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-[#E5E3DF]">Text (.txt)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Paste Raw Text */}
              {activeTab === 'paste' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-[#8C8172] mb-1.5 font-semibold">
                      Paste Plain Resume Text
                    </label>
                    <textarea
                      rows={9}
                      value={pastedText}
                      onChange={e => setPastedText(e.target.value)}
                      placeholder="Paste resume text copied from LinkedIn, an email, or another document..."
                      className="w-full p-3.5 bg-[#F5F5F3] border border-[#E5E3DF] rounded text-xs text-[#0A0A0A] font-sans focus:outline-none focus:border-[#8C8172] leading-relaxed resize-none selection:bg-[#8C8172] selection:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasteProcess}
                    disabled={isProcessing || !pastedText.trim()}
                    className="w-full py-2.5 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider font-medium rounded transition-colors flex items-center justify-center gap-2 shadow-subtle disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8C8172]" />
                    <span>Extract &amp; Parse Resume</span>
                  </button>
                </div>
              )}

              {/* Processing Progress Feedback */}
              {isProcessing && (
                <div className="p-4 bg-[#EFEEEA] border border-[#E5E3DF] rounded flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#8C8172] shrink-0" />
                  <div className="text-xs text-[#0A0A0A] font-mono animate-pulse">
                    {processingStep || 'Processing document...'}
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}
            </>
          ) : (
            /* Parsed Result Review Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DF]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#0A0A0A]">
                      Resume Parsed Successfully
                    </h3>
                    <p className="text-xs text-[#807D7A]">
                      Detected format: <strong className="font-mono text-[#0A0A0A]">{parsedResult.stats.detectedFormat}</strong> ({parsedResult.stats.confidenceScore}% confidence)
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetParser}
                  className="text-xs font-mono text-[#8C8172] hover:text-[#0A0A0A] underline"
                >
                  Parse another file
                </button>
              </div>

              {/* Summary Cards */}
              <div className="p-4 bg-[#F5F5F3] border border-[#E5E3DF] rounded space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base font-serif font-bold text-[#0A0A0A]">
                      {parsedResult.document.personalInfo.fullName}
                    </div>
                    <div className="text-xs text-[#8C8172] italic font-serif">
                      {parsedResult.document.personalInfo.title}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#807D7A] font-mono">
                    <div>{parsedResult.document.personalInfo.email}</div>
                    <div>{parsedResult.document.personalInfo.location}</div>
                  </div>
                </div>

                {parsedResult.document.summary && (
                  <p className="text-xs text-[#4A4845] leading-relaxed border-t border-[#E5E3DF] pt-2 line-clamp-2">
                    {parsedResult.document.summary}
                  </p>
                )}

                {/* Badges for extracted sections */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {parsedResult.stats.sectionsFound.map((sec, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-[#E5E3DF] rounded text-[11px] font-mono text-[#0A0A0A]"
                    >
                      ✓ {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions: Apply to current or create new */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateNewFromParsed}
                  className="flex-1 py-3 px-4 bg-[#0A0A0A] hover:bg-[#8C8172] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded shadow-subtle flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Create New CV From This</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleApplyToCurrent}
                  className="py-3 px-4 bg-white hover:bg-[#EFEEEA] border border-[#D1CECA] text-[#0A0A0A] text-xs font-mono uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  Populate Active CV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
