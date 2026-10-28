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
- **Vite Bundling**: Fast production build (~12s) with code-split web workers.
- **ATS Compliance**: All CV templates output semantic HTML structures that convert into machine-readable text and clean PDFs.
- **Zero Watermarks**: Exported documents carry no promotional tags or site names.
