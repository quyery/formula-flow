# Pocket Pathway test

FormulaFlow is a Duolingo-style prototype for practicing **Microsoft Excel formulas** through short lessons and interactive challenges. Users choose an exercise, review a quick intro, submit a formula, and get feedback. If they get stuck, they can request an **AI hint**.

**Live Demo:** https://studio-six-sigma-65.vercel.app

---

## What it does

- Browse a set of recommended Excel skills/exercises
- Start an exercise → short lesson → practice task
- Get instant feedback after submitting a formula

---

## Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Genkit + Gemini** for AI hints (server-side)
- **Vercel** for hosting and deployment
---
src/app/ — Next.js routes/pages (UI + API routes)
src/components/ — UI components
src/lib/ — shared utilities, exercise logic/data, evaluation helpers
src/ai/ — AI configuration + flow(s) for hints
---

## Run locally

### 1) Install dependencies
```bash
npm install