# Meeting Tracker - Codebase Architecture Guide

## Project Overview

Meeting Tracker is a React + Vite web application. It's a starter template for building modern web experiences with fast development and build cycles.

**Status**: Early-stage development (v0.0.0)
**Type**: Single Page Application (SPA)
**Framework**: React 19 + Vite

## Technology Stack

### Core Technologies
- **React**: v19.1.1 (UI framework)
- **React DOM**: v19.1.1 (DOM rendering)
- **Vite**: rolldown-vite v7.1.14 (Build tool and dev server)
- **Node.js**: ES Module support
- **Package Manager**: npm

### Development & Quality Tools
- **ESLint**: v9.36.0 (Code linting)
  - eslint-plugin-react-hooks: v5.2.0
  - eslint-plugin-react-refresh: v0.4.22
  - @eslint/js: v9.36.0
- **Globals**: v16.4.0 (Browser globals)
- **Type Definitions**: @types/react, @types/react-dom (optional types)

## Project Structure

```
meeting-tracker/
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── package-lock.json          # Locked versions
├── vite.config.js             # Vite build configuration
├── eslint.config.js           # ESLint configuration
├── .gitignore                 # Git ignore patterns
│
├── src/                       # Source code
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component
│   ├── App.css                # Component styles
│   ├── index.css              # Global styles
│   └── assets/
│       └── react.svg          # Logo asset
│
├── public/                    # Static assets
│   └── vite.svg               # Vite logo
│
├── node_modules/              # Dependencies (git ignored)
└── dist/                      # Build output (git ignored)
```

## Key Files Explained

### index.html
- Root HTML document
- Single div with id="root" for React mounting
- Loads src/main.jsx as ES module

### src/main.jsx
- Application entry point
- Creates React root and renders App component
- Uses StrictMode for development checks

### src/App.jsx
- Root React component
- Implements counter example using useState
- Demonstrates HMR and React Hooks

### vite.config.js
- Enables @vitejs/plugin-react for JSX support
- Uses Babel/oxc for transpilation
- All other settings are Vite defaults

### eslint.config.js
- Modern flat config format (ESLint v9+)
- Targets: **/*.{js,jsx}
- Ignores: dist/
- Rules: React Hooks, React Refresh, base JS recommended
- Custom rule: unused variables (ignoring uppercase/underscore patterns)

### package.json Scripts
- **dev**: Start dev server with HMR (localhost:5173)
- **build**: Build production bundle to dist/
- **lint**: Run ESLint checks
- **preview**: Preview production build locally

## Dependencies

### Production (2)
- react@19.1.1
- react-dom@19.1.1

### Development (10 direct)
- Vite and related packages
- ESLint and plugins
- Type definitions
- Utilities (globals)

### Total
- 100+ packages (including transitive deps)
- Lock file ensures consistency

## Architecture & Patterns

### Component Hierarchy
- Single root App component
- Functional components with Hooks
- CSS co-located with components

### Styling Approach
- CSS files (no preprocessor)
- Global styles in index.css
- Component styles in App.css
- Media queries for responsiveness

### Build Pipeline
1. Development: npm run dev -> Vite dev server with HMR
2. Linting: npm run lint -> ESLint static analysis
3. Production: npm run build -> Optimized bundle
4. Testing: npm run preview -> Local production test

### React Features Used
- useState Hook for state management
- Functional components
- Strict Mode for development
- Fast Refresh via HMR

## Development Workflow

### Getting Started
```bash
npm install       # Install dependencies
npm run dev       # Start dev server
npm run lint      # Check code quality
```

### Making Changes
1. Edit files in src/
2. Browser auto-refreshes via HMR
3. No manual build needed during development

### Before Deployment
```bash
npm run lint      # Check for issues
npm run build     # Create production build
npm run preview   # Test production locally
```

## Features Currently Implemented
- React + Vite boilerplate
- Counter component example
- Global and local styling
- ESLint configuration
- HMR for development

## Features NOT Currently Implemented
- Meeting tracking functionality
- State management (Redux, Context, etc.)
- API integration
- Testing (Vitest, Jest, etc.)
- TypeScript (types available but not enforced)
- Routing
- Database integration
- Authentication
- Accessibility features

## Recommended Next Steps

### For Feature Development
1. Create component structure (src/components/)
2. Add routing (React Router)
3. Implement state management (Context or Zustand)
4. Create API integration layer
5. Add meeting tracking features

### For Code Quality
1. Add Vitest for unit testing
2. Add React Testing Library
3. Add E2E testing (Playwright/Cypress)
4. Set up pre-commit hooks

### For Scaling
1. Move to TypeScript
2. Implement design system
3. Add environment variables
4. Set up CI/CD pipeline
5. Add performance monitoring

## Common Commands Reference

```bash
npm run dev       # Development server (HMR enabled)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Lint all JS/JSX files
npm install       # Install dependencies
```

## Notes for Claude Code

When working in this repository:
1. This is a React + Vite template project
2. No TypeScript - uses JavaScript with JSDoc types available
3. No testing framework yet - consider Vitest if adding tests
4. Single component (App.jsx) - will need to be split for real features
5. HMR is enabled - changes reflect immediately during development
6. Modern ESLint v9 flat config format
7. React 19 with latest features available
8. No state management or routing - will need to be added

## Additional Resources
- React Docs: https://react.dev
- Vite Guide: https://vite.dev/guide/
- ESLint: https://eslint.org/docs/latest/
