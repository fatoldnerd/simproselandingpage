# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SE Central is an internal landing page/hub for Sales Engineers at Simpro. It provides a single canonical URL where SEs and SE managers can access various SE tools (GROW Coaching, Demo Scoring, Quota Attainment Tracker, SE Contribution to Sales). The hub itself does not implement app logic—it links out to separate apps.

## Tech Stack

- **Framework**: React 19 with Vite 7
- **Styling**: Tailwind CSS 3
- **Authentication**: Firebase Auth with Google provider (domain-restricted to Simpro domains)
- **Hosting**: Firebase Hosting
- **Language**: JavaScript (JSX), no TypeScript

## Common Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build (outputs to dist/)
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture

### Single-Page App Structure

The entire app lives in `src/App.jsx` as a single-file component-based architecture:

- **Authentication flow**: `onAuthStateChanged` listener manages auth state; unauthenticated users see `LoginScreen`, authenticated users see `MainApp`
- **Domain restriction**: `allowedDomains` array at top of App.jsx controls which email domains can access (currently `@simprogroup.com`, `@simpro.co.uk`, `@simpro.au`, `@bigchange.com`)
- **App configuration**: `appsConfig` array defines the app tiles (id, name, description, url, icon, category, isEnabled)

### Key Components in App.jsx

- `App` - Root component with auth state management
- `LoginScreen` - Google sign-in UI
- `MainApp` - Authenticated view with nav, hero, app grid, help section, footer
- `AppCard` - Individual app tile with alternating dark/light styling

### Firebase Configuration

`src/firebase.js` exports auth utilities. Firebase project: `simpro-se-central`.

### Styling Conventions

- Primary brand color: `#1A2A4C` (dark navy)
- Accent color: `#FDB813` (gold/yellow)
- Cards alternate between white and dark navy backgrounds based on index
- Uses Tailwind utility classes throughout

## Adding New Apps

To add a new app tile, add an entry to the `appsConfig` array in `src/App.jsx`:

```javascript
{
  id: "unique-id",
  name: "App Name",
  description: "Short description of the app.",
  url: "https://app-url.com",
  icon: <IconComponent />,
  category: "Category Name",
  isEnabled: true,  // false shows "Coming Soon"
}
```

Icons are SVG components defined at the top of App.jsx.

## Deployment

Firebase Hosting serves from `dist/` directory. The `firebase.json` configures SPA routing (all routes redirect to index.html).

```bash
npm run build
firebase deploy --only hosting
```

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
