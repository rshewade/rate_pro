# Product Requirements Document: RatePro

## 1. Executive Summary
RatePro is a flexible, multi-factor pricing calculator for financial services businesses, enabling dynamic pricing based on configurable factors like business entity type, transaction volume, and service-specific parameters.

**Key Highlights:**
- **Flexible Pricing Model:** Supports a hybrid approach where each factor option has a `price_impact_type` property ('fixed', 'percentage', or 'multiplier') to determine if it is additive or multiplicative. Base pricing can include volume tiers defined at the service level, with further volume-based adjustments handled through pricing factors.
- **Admin-Configurable:** Add new services and pricing factors without code changes.
- **Quote Generation:** Save, track, and export detailed pricing quotes.
- **Extensible Architecture:** Built to scale with growing service offerings.

## 2. Business Objectives
- **Streamline Sales Process:** Enable sales teams to generate accurate quotes in minutes.
- **Ensure Pricing Consistency:** Maintain uniform pricing across all sales channels.
- **Improve Operational Efficiency:** Reduce manual quote creation time by 80%.
- **Enhance Transparency:** Provide clients with clear, itemized pricing breakdowns.

### Success Metrics
- **Quote generation time:** < 3 minutes per quote.
- **Pricing accuracy:** 100% (eliminate manual calculation errors).
- **New service addition time:** < 30 minutes for a new service setup.

## 3. Target Users
- **Primary:** Sales Team / Account Managers who generate and manage quotes.
- **Secondary:**
    - **Admin Users:** Configure services, pricing factors, and business rules.
    - **Finance Team:** Review pricing changes and analyze performance.
- **Future:** Self-Service Clients who can explore pricing options independently.

## 4. Core Features

### 4.1 Calculator Features
- **Multi-Service Quotes:** Allow for multiple, distinct calculations to be included within a single quote.
- Multi-service pricing calculation.
- Dynamic form rendering based on service selection.
- Real-time price calculation with an itemized breakdown.
- Factor dependency handling (conditional fields).
- Business entity type selection with pricing modifiers.
- Add-on/optional service selection.

### 4.2 Quote Management
- Save quotes with unique reference numbers.
- Quote status tracking (Draft, Sent, Accepted, Rejected, Expired).
- Customer information capture.
- Quote versioning to track changes over time.
- PDF export with professional formatting.
- Email delivery integration.

### 4.3 Admin Panel
- Service catalog management (add/edit/deactivate services).
- Configuration of pricing factors, options, and dependencies.
- Business entity type and add-on management.
- Audit trail for pricing history.

### 4.4 Reporting & Analytics (Future)
- Dashboard for quote volume, conversion rates, and pricing trends.

## 5. Functional Requirements

### 5.1 Calculator Interface
- **FR-1:** User selects a service from a dropdown or card grid.
- **FR-2:** System loads pricing factors specific to the selected service.
- **FR-3:** System handles factor dependencies, showing/hiding fields as needed. Dependent values must be reset when a dependency condition is no longer met. The system must prevent circular dependencies.
- **FR-4:** Price is calculated in real-time as the user makes selections.
- **FR-5:** User can select from a list of available global and service-specific add-ons, which have fixed prices.
- **FR-6:** System validates that all required factors are selected before final quote generation.
- **FR-7:** A detailed price breakdown is displayed.

### 5.2 Quote Generation
- **FR-8:** Capture customer information (Company, Contact, Email, etc.).
- **FR-9:** Generate a unique quote number and set a default expiration date (default 30 days, configurable). Quote status automatically changes to "Expired" upon expiration.
- **FR-10:** Provide a professional quote preview with company branding.
- **FR-11:** Allow quote actions: Save as Draft, Mark as Sent, Export to PDF, Send via Email.

### 5.3 Quote Management
- **FR-12:** Quote List View: Display all quotes in table/card view with filtering, sorting, and search functionality.
- **FR-13:** Quote Detail View: View complete quote information, including line items, status history, and notes.
- **FR-14:** Quote Status Management: Update quote status (e.g., Draft → Sent → Accepted/Rejected) and handle expired quotes.
- **FR-15:** Quote Editing: Allow editing of draft quotes and creating new versions of sent quotes.

### 5.4 Admin Panel
- **FR-16:** Full CRUD operations for services.
- **FR-17:** Add/configure pricing factors for each service.
- **FR-18:** Add/edit/delete options for each factor, including price impact.
- **FR-19:** Define and test dependency rules between factors.
- **FR-20:** Full CRUD operations for business entity types and their pricing modifiers.
- **FR-21:** Manage global and service-specific add-ons. The availability of global add-ons can be configured for each service line.
- **FR-22:** "Test Calculator" mode in the admin panel to validate pricing logic.
- **FR-23:** Audit trail logs all final quote price changes (who, what, when).

## 6. Technical Architecture

### 6.1 Technology Stack
- **Frontend:** React 19 with Vite and Shadcn UI. The UI should be clean, modern, and professional with a focus on usability and clarity.
- **Backend (MVP):** Mock backend using `json-server`.
- **Backend (Production):** Supabase (Edge Functions for logic, Auth for user management).
- **Database:** Supabase (PostgreSQL).
- **DevOps:** Docker, ESLint, Prettier.

### 6.2 System Architecture
- **Client Layer:** A React-based single-page application containing the Calculator, Quote Management, and Admin Panel interfaces.
- **Application Layer (MVP):** Business logic is handled client-side, with a mock API provided by `json-server`.
- **Application Layer (Production):** Business logic (e.g., Pricing Engine, Quote Service) will be implemented as Supabase Edge Functions.
- **Data Layer:** A Supabase (PostgreSQL) database will persist all data, including services, factors, quotes, and customers. The MVP will use a `db.json` file as the data source.

### 6.3 API Specifications
- **Base URL:** `http://localhost:3000/api/v1`
- **Authentication:** JWT (Phase 2).
- **Key Endpoints:**
    - `GET /api/v1/services`: Get all active services.
    - `GET /api/v1/services/:id`: Get service details with pricing factors.
    - `POST /api/v1/calculator/calculate`: Calculate a price based on selections.
    - `POST /api/v1/quotes`: Create a new quote.
    - `GET /api/v1/quotes`: Get all quotes with filters.
    - Full admin endpoints for managing services, factors, options, etc.

### 6.4 Data Schema
The data model is designed to support a flexible pricing structure. Key tables include:
- **Services:** Defines the core services offered (e.g., Bookkeeping, Payroll).
- **Pricing Factors:** Defines the variables that can affect the price of a service (e.g., Number of Transactions, Number of Employees).
- **Factor Options:** Defines the specific choices for each factor. Each option has a `price_impact` and a `price_impact_type` ('fixed', 'percentage', or 'multiplier') which determines if the price modification is additive or multiplicative. This is the core of the hybrid pricing model.

The pricing calculation will be executed in the following order:
1. Start with `base_price`.
2. Apply all 'fixed' impacts (additive).
3. Apply all 'percentage' impacts (based on `base_price` only).
4. Apply all 'multiplier' impacts (to the running total).
5. Add fixed-price add-ons.

### 6.5 Local Development Environment
- The Vite dev server will run on **port 3000**.
- The `json-server` mock API will run on **port 3001**.
- To avoid Cross-Origin Resource Sharing (CORS) issues during development, Vite will be configured to proxy requests from `/api` to the `json-server` on port 3001.

## 7. MVP Scope (Phase 1)
- **Core Calculator:** Service selection, dynamic forms, real-time calculation, add-on selection, and basic validation.
- **Quote Generation:** Customer info capture, quote creation/storage, basic preview, and "Save as Draft."
- **Quote Management:** List and detail views, status management, and basic filtering.
- **Admin Panel (Basic):** CRUD for services, factors, options, entity types, and modifiers.
- **Database & Backend:** Supabase schema implementation, migrations, REST API endpoints, and the core pricing calculation engine.
- **Infrastructure:** Docker setup, environment configuration, and basic logging.

## 8. Out of Scope for MVP (Deferred to Phase 2+)
- User authentication & authorization.
- Email integration (SMTP).
- Advanced PDF customization.
- Quote approval workflows.
- Advanced analytics and reporting.
- Full implementation of the dependency engine (MVP will use simple logic).
- CRM integration, payment integration, and a client self-service portal.
