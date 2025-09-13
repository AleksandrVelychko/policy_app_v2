# Expense Policy Version History Prototype

A lightweight React + Vite + Tailwind CSS prototype demonstrating versioned expense policy viewing, visual diffs between policy versions, and employee acknowledgements with an admin dashboard.

## Features
- Policy version switcher with inline diff highlighting (word-level additions/removals)
- Changelog display per version
- User switching to simulate multiple employees
- Acknowledge button (per user, per policy) with timestamp tracking (local state only)
- Admin dashboard summarizing acknowledgements (hover checkmark for timestamp)
- Tailwind CSS styling for a clean demo

## Tech Stack
- React (Vite bundler)
- Tailwind CSS 3.x
- diff (npm package) for text diffs

## Getting Started
### Prerequisites
- Node.js v20.x (Working with 20.11.0 here; recommended >=20.19.0 due to Vite engine requirement.)

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open http://localhost:5173/ in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure (selected)
```
src/
  App.js
  main.jsx
  mockData.js
  components/
    PolicyViewer.js
    PolicyDiff.js
    AdminDashboard.js
  index.css
```

## How It Works
- `mockData.js`: Hard-coded arrays for policies and employees.
- `App.js`: Holds state for employees, current user, and acknowledgements with timestamps.
- `PolicyViewer`: Displays a selected policy version and diff vs previous version using the `diff` library.
- `AdminDashboard`: Matrix view of employee acknowledgements with timestamp tooltips.

## Future Enhancements
- Persistence (localStorage or backend API)
- Authentication & RBAC (employee vs admin view separation)
- Richer diffing (section-level, highlighting changed numeric limits separately)
- Notifications (email/Slack) when new version published
- Export audit log (CSV / JSON)
- Draft → Review → Publish workflow
- Filtering: show employees who haven't acknowledged the latest version

## Limitations
- All data is in-memory only (refresh loses state)
- No real auth
- Word diff can appear noisy on major rearrangements

## License
Prototype example – add a license if distributing.
