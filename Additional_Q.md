1. Pricing Calculation Logic - Use hybrid approach. THere woudl some factors which will be additive and some will be multiplicative.
2. Factor Dependencies (FR-3) - Yes dependent values should reset. Also we need ot try and avoid circular dependencies by not allowing a factor to depend on another factor that directly or indirectly depends on it.
What happens when a dependency condition is no longer met? Are dependent values reset?
How are circular dependencies prevented?
Simple logic refers to "Instead of building the complete, fully configurable engine in the first phase, the plan is to start with a more straightforward, likely hard-coded, version. This "simple logic" would handle only the most essential dependencies, deferring the more complex and dynamic capabilities to a future release"
3. Volume Tiers - There would be certain volumnes as per base price and and incremental pricing for additional which will be covered via factors.
4. Quote Expiration (FR-9) - 30 Days by default but configurable. Auto status change to "Expired" upon expiration.
5. Tech Stack Inconsistency - Consider below
CLAUDE.md says: React 19 + Vite (no TypeScript mentioned), and Phase 1 uses json-server not Express
7. Add-ons - There would be certain add-ons which are application for all services like premium support, training etc. and some would be service specific like extra monthly reporting. Addons will come with fixed price.
8. Multi-Service Quotes - Yes. It would be more like multiple calculations in a single quote.
9. Audit Trail Scope (FR-23) Only final quote price changes tracked



  npm run dev        # Vite dev server (port 3000)
  npm run dev:all    # Run both frontend + json-server
  npm run server     # json-server only (port 3001)
  npm run build      # Production build
  npm run lint       # ESLint check
  npm run lint:fix   # Auto-fix lint issues
  npm run format     # Prettier format