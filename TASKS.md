# Local Tasks

## Publish GitHub Pages and Start Testing

- Status: Open
- Created: 2026-06-17
- Cloud task reference: "can we publish the work as github page and start testing?"

### Context

The referenced cloud task prepared the app for GitHub Pages publishing and testing:

- Updated the GitHub Actions workflow to build on pull requests, pushes to `main`, and manual `workflow_dispatch` runs.
- Configured pull requests to build only, while non-PR runs upload and deploy the Pages artifact.
- Switched the workflow to `npm install` before `npm run build` until a `package-lock.json` exists.
- Added README guidance for enabling GitHub Pages with GitHub Actions.
- Added a smoke-test checklist for validating the deployed app.

### Local Follow-Up

1. Push the prepared branch to GitHub.
2. Open a pull request and confirm the workflow build passes.
3. Merge to `main`.
4. In GitHub, set `Settings -> Pages -> Build and deployment -> Source -> GitHub Actions`.
5. Run the deployment workflow manually, or let the `main` push trigger it.
6. Run the deployed-app smoke test:
   - Dashboard loads.
   - Exam date can be saved.
   - Practice questions can be answered.
   - Progress view updates.
   - Error notebook records missed questions.
   - Search works.
   - Persistence survives reload.
   - Offline/PWA behavior works.

### Known Blocker

Local `npm install` previously failed in the Codex container with `403 Forbidden` from the environment proxy before packages downloaded. Validate the build in GitHub Actions or another network with npm registry access.
