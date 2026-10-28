# Atelier CV Studio — Development & Engineering Reference Log

This document serves as the comprehensive tracking reference for all features, architectural designs, bug fixes, and system improvements implemented in the **Atelier CV Studio** platform.

---

## 1. Project Overview & Design Philosophy

**Atelier CV Studio** is a luxury, minimalist, high-precision CV & Resume platform engineered for corporate and MNC applications. Inspired by high-end editorial and architectural aesthetics (warm muted neutrals, serif/monospaced typography, precise whitespace, zero decorative clutter), the platform delivers:
- Pixel-perfect, authentic browser and print document rendering.
- Complete bi-directional synchronization between interactive visual editing and raw LaTeX code.
- High-fidelity PDF export without third-party watermarks or branding.
- Universal offline resume parsing from any document format (PDF, DOCX, LaTeX, JSON, Plain Text).

### Visual & Theme Tokens
- **Main Background**: `#F5F5F3`
- **Primary Text**: `#0A0A0A`
- **Secondary Text**: `#807D7A`
- **Accent Bronze**: `#8C8172`
- **Borders & Dividers**: `#E5E3DF`
- **Document Paper**: `#FFFFFF`
- **Muted Surface**: `#EFEEEA`
- **Typography**: Playfair Display / Cormorant Garamond (Serif Headings), Inter (Clean UI Sans), JetBrains Mono (Code & Technical Metas).

---

## 2. Full Development History & Milestones

### Milestone 1: Platform Ground-Up Redesign
- **Editorial Landing Page**: Created modern hero section, live CV preview showcases, interactive template previews, feature matrices, and footer.
- **Calm Document Workspace (Dashboard)**:
  - Document grid & table views with search, filtering, and sort options.
  - Multi-document state persistence in `localStorage`.
  - Quick action toolbar: *New CV*, *Import CV*, *Cover Letters*, *Settings*.
- **Gallery with 6 Tailored ATS Templates**:
  - `corporate-classic`: Traditional corporate layout with subtle horizontal dividers.
  - `modern-professional`: High-impact layout with accented subheaders.
  - `executive`: Comprehensive board-level structure.
  - `technical-resume`: Skills-dense engineering format.
  - `consulting`: Analytical, project-driven layout.
  - `academic-cv`: Multi-page scholarly CV format with research & publications.

### Milestone 2: Professional PDF Export Engine
- **Direct PDF Generation**:
  - Replaced ad-hoc HTML-to-image capture with native browser DOM rendering via `html2pdf.js` / `jspdf`.
  - Removed template labels, watermarks, and website tags from generated PDFs.
- **Section Heading & Divider Alignment Fixes**:
  - Corrected horizontal rule misalignments and negative margin collisions.
  - Standardized compact gap between section headings and their bottom borders.
  - Prevented orphan headings and multi-page bullet clipping via CSS print break controls (`break-inside: avoid`).

### Milestone 3: Interactive LaTeX Studio
- **Shrinkable / Resizable Split-Screen**:
  - Added an interactive draggable splitter between the Monaco-style code editor and the live CV preview.
  - Allows adjusting view proportions from 20% to 80% with real-time DOM reflow.
- **Keyboard Shortcut (`Ctrl + S` / `Cmd + S`)**:
  - Implemented instant save and preview refresh on `Ctrl + S`.
  - Integrated visual notification pill (*"LaTeX Synced & Rendered"*).
- **Collapsible Section Controls**:
  - Added collapsibility to left-hand Document Sections sidebar (expand/collapse individual form cards).
  - Quick navigation shortcuts jump directly to sections within long resumes.

### Milestone 4: Universal Resume / CV Parser
A 100% client-side parser capable of converting resumes into structured `CVDocument` schemas without external server dependencies.

#### Multi-Format Extraction Pipeline (`src/utils/fileExtractors.ts`):
1. **PDF (`.pdf`)**:
   - Integrated `pdfjs-dist` using an offline Vite-bundled web worker (`pdf.worker.min.js?url`).
   - Implemented geometry-aware text extraction (`extractTextFromPdf`).
   - Calculated glyph gaps to resolve small-caps letter-spacing (preventing `P ROFESSIONAL` and `N IKHIL`).
   - Detected column jumps and LaTeX `\hfill` gaps (`gap > 25px`) to insert tab delimiters (`\t`), preserving multi-column alignment.
2. **Word (`.docx`)**:
   - Stream-unpacked XML paragraphs (`word/document.xml`) using `JSZip` without requiring external Node dependencies.
3. **LaTeX (`.tex`)**:
   - Strips preamble, resolves macros, parses tabular and itemize environments directly into structured data.
4. **JSON / JSONResume**:
   - Native parser supporting both official [JSONResume](https://jsonresume.org) schema and Atelier CV schemas.
5. **Plain Text / Markdown / Clipboard Paste**:
   - Regex-driven natural language segmentation.

#### Information Extraction Engine (`src/utils/resumeParser.ts`):
- **Candidate Identification**: Extracts full name, phone number, email address, locations, GitHub, LinkedIn, and personal websites.
- **Intelligent Title Inference**: Resolves professional job titles from summary lead-ins or current employment roles.
- **Work History**:
  - Extracts role, company, location, and date ranges (`Start - End / Present`).
  - Supports promotions and consecutive roles at the same company.
  - Merges multi-line bullet continuations across lines and pages.
- **Education**:
  - Detects institution names, degree titles, field of study, graduation year ranges, and GPA/honors.
- **Categorized Skills**:
  - Groups capabilities by topic (e.g., *Zoho Ecosystem*, *Automation & Scripting*, *Integrations*, *Development*).
- **Projects & Certifications**:
  - Structures standalone projects and professional certifications.

#### Modern Parser UI (`src/components/parser/ResumeParserModal.tsx`):
- Drag-and-drop zone with animated progress indicators.
- Raw text paste tab with real-time character counters.
- Extraction diagnostics card with confidence score (0–99%).
- Two action modes:
  - **Create New CV From This**: Creates a separate, independent CV document and opens it in the editor.
  - **Populate Active CV**: Injects parsed data directly into the active template.

---

## 3. Architecture & File Structure

```
├── .gitignore
├── DEVELOPMENT_REFERENCE.md       # Full engineering tracking log
├── README.md                      # Public documentation & setup guide
├── index.html                     # HTML root with luxury font pairings
├── package.json                   # Dependencies (pdfjs-dist, jszip, lucide-react, etc.)
├── tailwind.config.js             # Custom Atelier luxury palette & tokens
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                    # Root routing (/, /dashboard, /templates, /editor/:id, /latex/:id)
    ├── vite-env.d.ts              # Vite module declarations (?url, client)
    ├── components/
    │   ├── editor/                # CV Editor, Visual Form Sections, Toolbar, Draggable Splitter
    │   ├── landing/               # Editorial Hero, Template Showcase, Features
    │   ├── latex/                 # LaTeX Studio Editor with resizable split pane
    │   ├── parser/
    │   │   └── ResumeParserModal.tsx  # Universal resume upload & review modal
    │   ├── preview/               # Live CV Renderers (Corporate, Modern, Executive, etc.)
    │   └── shared/                # Navigation, Footers, Modals, Buttons
    ├── context/
    │   └── CVContext.tsx          # Centralized CV state, local persistence, multi-doc CRUD
    ├── data/
    │   ├── mockCV.ts              # Initial state schemas & templates
    │   └── templates.ts           # Template metadata & ATS scoring
    ├── types/
    │   └── cv.ts                  # TypeScript models (CVDocument, WorkExperience, Education, etc.)
    └── utils/
        ├── fileExtractors.ts      # PDF (pdfjs-dist), DOCX (JSZip), TXT, JSON extraction
        ├── resumeParser.ts        # Natural language parsing & schema normalization
        ├── latexGenerator.ts      # Bi-directional CV-to-LaTeX serializer
        ├── latexParser.ts         # LaTeX-to-CV AST parser
        └── pdfExport.ts           # High-resolution PDF generation engine
```

---

## 4. Verification & Quality Standards

- **TypeScript Strict Compilation**: Zero type errors (`tsc` passes completely).
- **Vite Bundling**: Fast production build (~25s) with code-split web workers.
- **ATS Compliance**: All CV templates output semantic HTML structures that convert into machine-readable text and clean PDFs.
- **Zero Watermarks**: Exported documents carry no promotional tags or site names.

---

## 5. ChatGPT Architecture Review — Addressed Items

The following items were flagged in an external review of the codebase and have been resolved:

### 5.1 Dynamic Page Flow & Overflow Protection (Critical → Fixed)
- **Problem**: Templates used `height: 297mm; overflow: hidden` which silently clipped long CVs.
- **Fix**: Replaced with `minHeight: ${heightMm}mm; boxSizing: 'border-box'` across all 6 templates.
- Removed hardcoded "Page 1 of 2" / "Page 2 of 2" text.
- Page 2 now renders conditionally only when content exists.
- Added CSS print rules: `break-inside: avoid` for sections, `overflow: visible`, `min-height: 297mm`.
- **Files changed**: `CorporateClassicTemplate.tsx`, `ModernProfessionalTemplate.tsx`, `TechnicalResumeTemplate.tsx`, `ExecutiveTemplate.tsx`, `ConsultingTemplate.tsx`, `AcademicCVTemplate.tsx`, `src/index.css`.

### 5.2 Transparent LaTeX Studio (Critical → Fixed)
- **Problem**: Fake `pdfTeX 3.14159265` compiler simulation with random compile times.
- **Fix**: Removed all fake compiler logs and fabricated PDF messages.
- Added genuine LaTeX syntax linter: validates `\begin{document}`/`\end{document}`, balanced curly braces, environment pairings.
- Added 1-click **"Open in Overleaf"** button using Overleaf's `POST /docs` API.
- Rebranded from "v3.14 TeX Engine" to "LaTeX AST & Source Sync".
- Button text changed from "Compiling PDF..." to "Exporting PDF..." for accuracy.
- **Files changed**: `LaTeXEditor.tsx`, `LatexStudioPage.tsx`.

### 5.3 Workspace Data Durability & Backup/Restore (Medium → Fixed)
- **Problem**: Client-side `localStorage` only, no data portability.
- **Fix**: Added `exportWorkspaceBackup()` and `importWorkspaceBackup()` to `CVContext.tsx`.
- Dashboard Settings tab displays storage usage, privacy notice, and backup/restore controls.
- **Files changed**: `CVContext.tsx`, `DashboardPage.tsx`.

### 5.4 Dynamic ATS Health Check (Medium → Fixed)
- **Problem**: Static gimmicky "99% ATS Compliant" labels.
- **Fix**: Built real-time ATS Audit modal (`ATSHealthCheckModal.tsx`) with diagnostic engine scoring:
  - Contact Completeness (20 pts)
  - Summary Quality (15 pts)
  - Work History (20 pts)
  - Quantifiable Metrics in bullets (20 pts)
  - Categorized Skills (15 pts)
  - Academic Degrees (10 pts)
- Actionable recommendations for each category.
- **Files changed**: `ATSHealthCheckModal.tsx` (new), `EditorToolbar.tsx`.

### 5.5 Broadened Product Positioning (Medium → Fixed)
- **Problem**: Hyper-executive copy ("Fortune 500 boards", "Executive Workspace") excluded most users.
- **Fix**: Updated landing page hero, dashboard labels, and template metadata.
  - Hero: *"The Minimalist Document Studio"* / *"Craft a CV That Reflects Your Best Work"*.
  - Dashboard: *"Professional Workspace"* (was "Executive Workspace").
  - Templates: Replaced "99% ATS Compliant" with objective descriptors.
  - Expanded audiences to include Software Developers, Full Stack Engineers, Designers, Data Scientists, Researchers.
- **Files changed**: `LandingPage.tsx`, `DashboardPage.tsx`, `templates.ts`.

### 5.6 PDF Export — Selectable Text Recommendation (High → Documented)
- **Current state**: Direct PDF download uses image-based capture (`html-to-image` → `jsPDF`). Text is not selectable.
- **Workaround**: The "Print / Vector PDF (Recommended)" option uses the browser's native print engine, producing 100% selectable, vector-quality PDFs.
- The export dropdown now labels this as the recommended option.
- **Future**: Migrate direct download to a vector PDF pipeline (e.g., `react-pdf`, server-side Puppeteer, or Overleaf compilation).
- **Files changed**: `EditorToolbar.tsx`, `exportUtils.ts`.
