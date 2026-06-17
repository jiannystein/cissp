# CISSP Cram

A personal, static CISSP cram app for GitHub Pages. It focuses on the first useful flow:

Open app -> enter exam date -> complete diagnostic -> identify weak domains -> generate today's plan -> study one concept -> answer related questions -> review mistakes -> review flashcards -> save progress locally.

## What It Does

- Dashboard with days until exam, readiness, weak areas, due flashcards, mistakes, and next action.
- Mixed-domain diagnostic assessment.
- Eight CISSP domains using the current ISC2 outline weights effective April 15, 2024.
- Structured concept lessons with simple explanations, technical notes, manager/engineer perspectives, traps, memory hooks, and checks.
- Original practice questions with correct-answer reasoning, distractor explanations, CISSP principle, and perspective.
- Error notebook that resolves a miss only after a different same-concept question is answered correctly.
- Flashcards with a local FSRS-style scheduler.
- Local search across domains, lessons, questions, flashcards, and source references.
- Progress import/export, local reset, and PWA offline support after first load.

The supplied EPUBs stay in `References/` for local study processing. The GitHub Pages workflow publishes only the app files and does not include the EPUB references in the Pages artifact.

## Run Locally

Open `index.html` in a browser. For service worker testing, serve the folder from a local HTTP server or use the deployed GitHub Pages URL.

## GitHub Pages

1. In GitHub, set `Settings -> Pages -> Build and deployment -> Source -> GitHub Actions`.
2. Push to `main` or run the `GitHub Pages` workflow manually.
3. Smoke test:
   - Dashboard loads.
   - Exam date can be saved.
   - Diagnostic can be completed.
   - Practice questions can be answered.
   - Progress view updates.
   - Error notebook records missed questions.
   - Flashcards can be reviewed.
   - Search works.
   - Persistence survives reload.
   - Offline/PWA behavior works after first load.
