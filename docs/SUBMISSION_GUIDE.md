# PocketSmartAI — Submission Guide

Everything you need to run, demonstrate and submit the project.

## 1. How to run (no Java / no Python needed)

**Prerequisite:** Node.js (already installed on your machine). Nothing else.

- **Easiest:** double-click `run.bat` in the `PocketSmartAI` folder.
  It installs dependencies the first time, starts the app and opens your browser.
- **Manual:**
  ```bash
  npm install
  npm run dev
  ```
  Open the printed URL (default `http://localhost:5173`).

## 2. Build a shareable version

```bash
npm run build      # creates the dist/ folder
npm run preview    # locally previews the production build
```
The `dist/` folder is a static site — it can be uploaded to any static host
(Netlify, Vercel, GitHub Pages, or the hosting offered by Bolt/Replit).

## 3. What to submit

| Deliverable | Where |
| :--- | :--- |
| Source code | the `PocketSmartAI/` folder |
| Run instructions | `README.md`, this file |
| Project report | `docs/PROJECT_REPORT.md` |
| Demo script | `docs/DEMO_SCRIPT.md` |
| Live link (optional) | publish `dist/` or host the dev app |

## 4. Suggested mapping to NM phase folders

The parent `Thanu` folder already contains the phase folders. You can place these
new documents alongside the existing deliverables:

- `1. Brainstorming & Ideation` → problem statement & idea (see report §2–3).
- `2. Requirement Analysis` → features & technology stack (report §5, §8).
- `3. Project Design Phase` → architecture & algorithms (report §6–7).
- `4. Project Planning Phase` → feature list & mock schedule (report §8).
- `5. Project Development Phase` → source code + code structure (this app).
- `6. Project Testing` → testing section (report §9) + demo checklist.
- `7. Project Documentation` → `docs/PROJECT_REPORT.md`.
- `8. Project Demonstration` → `docs/DEMO_SCRIPT.md`.

## 5. Key talking points for evaluators

- Built with a modern, in-demand web stack (React + TypeScript + Tailwind).
- Real, working calculations — no fake buttons or placeholder screens.
- One connected data model: a single change updates the whole app.
- Explainable, rule-based recommendation engine (no paid AI API).
- Fully in Indian Rupees, offline-capable, with data backup/restore.

## 6. Final checklist

- [ ] `npm install` completes without errors.
- [ ] `npm run dev` starts and the dashboard loads with demo data.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Demo script rehearsed once end-to-end.

> Disclaimer to mention during the demo: PocketSmartAI offers general, rule-based
> guidance and is not professional financial advice.
