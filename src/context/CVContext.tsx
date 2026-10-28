import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CVDocument, CoverLetterDocument, TemplateId, CVStyleSettings } from '../types/cv';
import { INITIAL_CV, INITIAL_COVER_LETTER } from '../data/mockCV';
import { generateLatexSource } from '../utils/latexGenerator';
import { parseLatexSource } from '../utils/latexParser';

interface CVContextType {
  documents: CVDocument[];
  currentDoc: CVDocument;
  coverLetters: CoverLetterDocument[];
  currentCoverLetter: CoverLetterDocument;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  canUndo: boolean;
  canRedo: boolean;
  activeMode: 'visual' | 'latex' | 'preview';
  setActiveMode: (mode: 'visual' | 'latex' | 'preview') => void;
  setCurrentDocId: (id: string) => void;
  updateDoc: (updater: (prev: CVDocument) => CVDocument) => void;
  updateField: <K extends keyof CVDocument>(key: K, value: CVDocument[K]) => void;
  updateSettings: (settings: Partial<CVStyleSettings>) => void;
  setTemplate: (templateId: TemplateId) => void;
  updateLatex: (source: string) => void;
  saveAndRefreshFromLatex: (source: string) => { success: boolean; errorCount: number };
  createNewDoc: (templateId?: TemplateId, title?: string, initialContent?: Partial<CVDocument>) => string;
  duplicateDoc: (id: string) => string;
  deleteDoc: (id: string) => void;
  undo: () => void;
  redo: () => void;
  resetToDefault: () => void;
  updateCoverLetter: (updater: (prev: CoverLetterDocument) => CoverLetterDocument) => void;
  createNewCoverLetter: (title?: string) => string;
  exportWorkspaceBackup: () => void;
  importWorkspaceBackup: (jsonString: string) => { success: boolean; count: number; error?: string };
}

const STORAGE_KEY_DOCS = 'atelier_cv_documents_v2';
const STORAGE_KEY_ACTIVE = 'atelier_active_cv_id_v2';
const STORAGE_KEY_CLS = 'atelier_cover_letters_v2';

const CVContext = createContext<CVContextType | null>(null);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load documents
  const [documents, setDocuments] = useState<CVDocument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DOCS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored CV documents', e);
    }
    return [INITIAL_CV];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (stored) return stored;
    } catch (e) {}
    return INITIAL_CV.id;
  });

  // Cover Letters
  const [coverLetters, setCoverLetters] = useState<CoverLetterDocument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_COVER_LETTER];
  });

  const [activeCoverLetterId, setActiveCoverLetterId] = useState<string>(INITIAL_COVER_LETTER.id);

  const [activeMode, setActiveMode] = useState<'visual' | 'latex' | 'preview'>('visual');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // History stack for Undo/Redo
  const [history, setHistory] = useState<CVDocument[]>([]);
  const [future, setFuture] = useState<CVDocument[]>([]);

  // Find current document
  const currentDoc = documents.find(d => d.id === activeDocId) || documents[0] || INITIAL_CV;
  const currentCoverLetter = coverLetters.find(cl => cl.id === activeCoverLetterId) || coverLetters[0] || INITIAL_COVER_LETTER;

  // Persist to local storage
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeDocId);
        localStorage.setItem(STORAGE_KEY_CLS, JSON.stringify(coverLetters));
        setSaveStatus('saved');
      } catch (e) {
        console.error('Storage quota exceeded or error saving documents', e);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [documents, activeDocId, coverLetters]);

  // Update current doc with history tracking
  const updateDoc = useCallback((updater: (prev: CVDocument) => CVDocument) => {
    setDocuments(prevDocs => {
      const targetIdx = prevDocs.findIndex(d => d.id === activeDocId);
      if (targetIdx === -1) return prevDocs;

      const oldDoc = prevDocs[targetIdx];
      // Push previous state to history
      setHistory(h => [...h.slice(-30), oldDoc]);
      setFuture([]); // clear redo stack

      const updated = updater({
        ...oldDoc,
        lastModified: new Date().toISOString()
      });

      // Synchronize LaTeX source if not marked as custom
      if (!updated.isCustomLatex) {
        updated.latexSource = generateLatexSource(updated);
      }

      const nextDocs = [...prevDocs];
      nextDocs[targetIdx] = updated;
      return nextDocs;
    });
  }, [activeDocId]);

  const updateField = useCallback(<K extends keyof CVDocument>(key: K, value: CVDocument[K]) => {
    updateDoc(prev => ({
      ...prev,
      [key]: value
    }));
  }, [updateDoc]);

  const updateSettings = useCallback((newSettings: Partial<CVStyleSettings>) => {
    updateDoc(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  }, [updateDoc]);

  const setTemplate = useCallback((templateId: TemplateId) => {
    updateDoc(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        templateId
      }
    }));
  }, [updateDoc]);

  const updateLatex = useCallback((source: string) => {
    updateDoc(prev => ({
      ...prev,
      latexSource: source,
      isCustomLatex: true
    }));
  }, [updateDoc]);

  const saveAndRefreshFromLatex = useCallback((source: string) => {
    // 1. Basic syntax checks
    const hasBeginDoc = source.includes('\\begin{document}');
    const hasEndDoc = source.includes('\\end{document}');

    if (!hasBeginDoc || !hasEndDoc) {
      // Still persist source so edits are not lost
      updateDoc(prev => ({
        ...prev,
        latexSource: source,
        isCustomLatex: true
      }));
      return { success: false, errorCount: 1 };
    }

    // 2. Parse LaTeX source back into structured CVDocument model
    const parsedDoc = parseLatexSource(source, currentDoc);

    // 3. Immediately persist to documents state and localStorage
    setDocuments(prevDocs => {
      const idx = prevDocs.findIndex(d => d.id === activeDocId);
      if (idx === -1) return prevDocs;
      const nextDocs = [...prevDocs];
      nextDocs[idx] = parsedDoc;
      try {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(nextDocs));
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeDocId);
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return nextDocs;
    });

    setSaveStatus('saved');
    return { success: true, errorCount: 0 };
  }, [currentDoc, activeDocId, updateDoc]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(h => h.slice(0, h.length - 1));
    setFuture(f => [currentDoc, ...f]);

    setDocuments(prevDocs => {
      const idx = prevDocs.findIndex(d => d.id === activeDocId);
      if (idx === -1) return prevDocs;
      const nextDocs = [...prevDocs];
      nextDocs[idx] = previous;
      return nextDocs;
    });
  }, [history, currentDoc, activeDocId]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(f => f.slice(1));
    setHistory(h => [...h, currentDoc]);

    setDocuments(prevDocs => {
      const idx = prevDocs.findIndex(d => d.id === activeDocId);
      if (idx === -1) return prevDocs;
      const nextDocs = [...prevDocs];
      nextDocs[idx] = next;
      return nextDocs;
    });
  }, [future, currentDoc, activeDocId]);

  const createNewDoc = useCallback((templateId: TemplateId = 'corporate-classic', title = 'Executive Resume', initialContent?: Partial<CVDocument>): string => {
    const newId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const baseDoc: CVDocument = {
      ...INITIAL_CV,
      ...initialContent,
      id: newId,
      title: initialContent?.title || `${title} (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      settings: {
        ...INITIAL_CV.settings,
        ...(initialContent?.settings || {}),
        templateId
      }
    };
    baseDoc.latexSource = generateLatexSource(baseDoc);

    setDocuments(prev => [baseDoc, ...prev]);
    setActiveDocId(newId);
    setHistory([]);
    setFuture([]);
    return newId;
  }, []);

  const duplicateDoc = useCallback((id: string): string => {
    const source = documents.find(d => d.id === id);
    if (!source) return id;

    const newId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duplicated: CVDocument = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setDocuments(prev => [duplicated, ...prev]);
    setActiveDocId(newId);
    return newId;
  }, [documents]);

  const deleteDoc = useCallback((id: string) => {
    setDocuments(prev => {
      if (prev.length <= 1) {
        // Prevent deleting the last document; reset to initial
        return [INITIAL_CV];
      }
      const filtered = prev.filter(d => d.id !== id);
      if (activeDocId === id) {
        setActiveDocId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeDocId]);

  const resetToDefault = useCallback(() => {
    setDocuments([INITIAL_CV]);
    setActiveDocId(INITIAL_CV.id);
    setHistory([]);
    setFuture([]);
  }, []);

  const updateCoverLetter = useCallback((updater: (prev: CoverLetterDocument) => CoverLetterDocument) => {
    setCoverLetters(prevList => {
      const idx = prevList.findIndex(cl => cl.id === activeCoverLetterId);
      if (idx === -1) return prevList;
      const updated = updater({
        ...prevList[idx],
        lastModified: new Date().toISOString()
      });
      const nextList = [...prevList];
      nextList[idx] = updated;
      return nextList;
    });
  }, [activeCoverLetterId]);

  const createNewCoverLetter = useCallback((title = 'Strategic Cover Letter'): string => {
    const newId = `cl-${Date.now()}`;
    const newCl: CoverLetterDocument = {
      ...INITIAL_COVER_LETTER,
      id: newId,
      title,
      lastModified: new Date().toISOString()
    };
    setCoverLetters(prev => [newCl, ...prev]);
    setActiveCoverLetterId(newId);
    return newId;
  }, []);

  const exportWorkspaceBackup = useCallback(() => {
    const backupData = {
      app: 'atelier-cv',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      documents,
      coverLetters,
      activeDocId
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8' });
    const filename = `atelier_cv_backup_${new Date().toISOString().slice(0, 10)}.json`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [documents, coverLetters, activeDocId]);

  const importWorkspaceBackup = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || (!data.documents && !Array.isArray(data))) {
        return { success: false, count: 0, error: 'Invalid backup format. Expected a JSON file with documents.' };
      }
      const importedDocs: CVDocument[] = Array.isArray(data) ? data : (data.documents || []);
      const importedCls: CoverLetterDocument[] = data.coverLetters || [];

      if (importedDocs.length === 0) {
        return { success: false, count: 0, error: 'No CV documents found in backup file.' };
      }

      setDocuments(importedDocs);
      if (importedCls.length > 0) setCoverLetters(importedCls);
      if (importedDocs[0]?.id) setActiveDocId(importedDocs[0].id);

      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(importedDocs));
      if (importedCls.length > 0) localStorage.setItem(STORAGE_KEY_CLS, JSON.stringify(importedCls));
      if (importedDocs[0]?.id) localStorage.setItem(STORAGE_KEY_ACTIVE, importedDocs[0].id);

      return { success: true, count: importedDocs.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e?.message || 'Failed to parse JSON backup.' };
    }
  }, []);

  return (
    <CVContext.Provider
      value={{
        documents,
        currentDoc,
        coverLetters,
        currentCoverLetter,
        saveStatus,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        activeMode,
        setActiveMode,
        setCurrentDocId: setActiveDocId,
        updateDoc,
        updateField,
        updateSettings,
        setTemplate,
        updateLatex,
        saveAndRefreshFromLatex,
        createNewDoc,
        duplicateDoc,
        deleteDoc,
        undo,
        redo,
        resetToDefault,
        updateCoverLetter,
        createNewCoverLetter,
        exportWorkspaceBackup,
        importWorkspaceBackup
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
