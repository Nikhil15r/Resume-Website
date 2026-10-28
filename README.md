# Atelier CV Studio 🖋️

> An editorial-grade, minimalist CV and resume creation platform engineered for professionals — developers, engineers, researchers, designers, and executives alike. Built with React, TypeScript, Tailwind CSS, and LaTeX integration.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Nikhil15r/Resume-Website)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-gray)](LICENSE)

---

## ✨ Features

- **Editorial Luxury Design**: Crafted with inspiration from high-end architectural design—warm muted neutrals (`#F5F5F3`), elegant serif headings, monospaced accents, and clean visual hierarchy.
- **6 Production-Ready ATS Templates**:
  - *Corporate Classic*
  - *Modern Professional*
  - *Executive*
  - *Technical Resume*
  - *Consulting*
  - *Academic CV*
- **Universal Resume / CV Parser**:
  - Extract structured information directly in the browser from **PDF**, **Word (.docx)**, **LaTeX (.tex)**, **JSON / JSONResume**, or **Plain Text**.
  - Geometry-aware PDF parsing with small-caps healing and automatic column alignment detection.
  - Zero server uploads required—all processing is 100% private and client-side.
- **Interactive LaTeX Studio**:
  - Full bi-directional synchronization between the visual editor and raw LaTeX code.
  - Draggable, shrinkable split view between the code editor and live preview.
  - Quick save with `Ctrl + S` / `Cmd + S` with instant preview refresh.
- **High-Fidelity PDF Export**:
  - Direct PDF downloads with exact styling, correct margins, and zero watermarks or website tags.
  - Automatic page-break management ensuring section headings and dividers stay intact.
  - "Print / Vector PDF (Recommended)" option for 100% selectable text via browser print engine.
- **Real-Time ATS Health Check**:
  - Diagnostic audit modal scoring Contact, Summary, Work History, Quantifiable Metrics, Skills, and Education.
  - Actionable recommendations for improving ATS compatibility.
- **Workspace Backup & Restore**:
  - Full workspace JSON export/import for cross-browser and cross-device portability.
  - Storage metrics and privacy notice in Dashboard Settings.
- **1-Click Overleaf Integration**:
  - Open your LaTeX source directly in Overleaf for cloud compilation.
- **Multi-Document Management**:
  - Create, clone, customize, and store multiple CVs in local workspace storage.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Extraction**: [PDF.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`)
- **Word Extraction**: [JSZip](https://stuk.github.io/jszip/)
- **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) & [jspdf](https://github.com/parallax/jsPDF)

---

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nikhil15r/Resume-Website.git

# Navigate into the project directory
cd Resume-Website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
```

The production output will be generated in the `dist` folder.

---

## 📖 Development Log

For a detailed changelog and engineering reference of all architectural implementations and bug fixes, refer to [`DEVELOPMENT_REFERENCE.md`](./DEVELOPMENT_REFERENCE.md).

---

## 📄 License

This project is licensed under the MIT License.
