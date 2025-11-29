# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RatePro is a financial services pricing calculator that generates quotes for Bookkeeping, Payroll, Year-End Accounting, Tax Preparation, and CFO Services. The system uses configurable pricing factors (base price, entity type multipliers, volume tiers, add-ons) to calculate dynamic pricing.

**Current Phase:** Phase 1 MVP - Frontend-first development using `json-server` as mock backend before Supabase integration.

## Development Commands

All commands run from the `/repo` directory:

```bash
# Start frontend dev server (Vite)
npm run dev

# Start mock API server (json-server on port 3001)
npm run server

# Run both concurrently for development
npm run dev & npm run server

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend:** React 19 + Vite + Shadcn UI
- **Mock Backend (Phase 1):** json-server with `db.json`
- **Production Backend (Phase 2):** Supabase (PostgreSQL + Edge Functions + Auth)

### Key Architectural Decisions
- **Frontend-First Development:** Build complete UI against `json-server` mock API before integrating real backend
- **Data Schema in db.json:** The `db.json` file defines the contract that Supabase will mirror
- **Pricing Logic:** Currently client-side; will move to Supabase Edge Function (`calculate-price`) in Phase 2
- **API Abstraction:** All API calls should be wrapped in service functions (e.g., `services/api.js`)

### Pricing Calculation Model
Prices are calculated using:
1. **Base Price** - Per service
2. **Factor Multipliers** - e.g., Complexity (1.0x, 1.2x, 1.5x)
3. **Fixed Add-ons** - e.g., Expedited Service (+$100)
4. **Entity Type Modifiers** - Business type multipliers (Sole Prop, LLC, C-Corp, etc.)

## Code Conventions

### Frontend
- Functional components with Hooks only
- PascalCase for component filenames (e.g., `ServiceCard.jsx`)
- Local state (`useState`) for UI-only state; Context/Zustand for global state
- Mobile-first responsive design using MUI tokens

### Backend (Supabase - Phase 2)
- snake_case for table names and columns
- Row Level Security (RLS) enabled on all tables
- Edge Functions for secure business logic (pricing calculations)

### Git
- Feature branches from `main` (e.g., `feature/calculator-ui`, `fix/pricing-logic`)
- Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`)

## Testing Strategy

- **Unit Tests:** Utility functions and pricing calculation logic
- **Integration Tests:** Component + mock API interactions
- **E2E Tests:** Full user flows (Service selection -> Factor input -> Quote generation)
- Tests run against consistent mock data; reset `db.json` before test runs

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
- After every task is complete we should create test scripts and test the development throughly. futher try to build it to see if there are any building error before marking it as complete
- @Design/ folder is for reference purpose only, You can take inspiration about UI Elements and overall design from here