# RatePro Database Schema

This directory contains the Supabase/PostgreSQL database schema for RatePro.

## Directory Structure

```
supabase/
├── migrations/           # SQL migration files (run in order)
│   ├── 001_create_services.sql
│   ├── 002_create_pricing_factors.sql
│   ├── 003_create_entity_types_addons.sql
│   ├── 004_create_quotes_customers.sql
│   └── 005_create_audit_logs.sql
├── seed/                 # Seed data for development
│   └── 001_seed_data.sql
└── README.md
```

## Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `services` | Core services offered (Bookkeeping, Payroll, etc.) |
| `pricing_factors` | Configurable factors affecting price per service |
| `factor_options` | Available options for each pricing factor |
| `business_entity_types` | Business types with pricing modifiers |
| `addons` | Optional add-on services with fixed prices |
| `service_addons` | Junction table for service-specific addons |

### Quote Management Tables

| Table | Description |
|-------|-------------|
| `customers` | Customer information |
| `quotes` | Generated pricing quotes |
| `quote_line_items` | Individual service line items in quotes |
| `quote_status_history` | Status change tracking |

### Audit Tables

| Table | Description |
|-------|-------------|
| `audit_logs` | Comprehensive change tracking |

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────┐
│  services   │──────<│ pricing_factors  │──────<│ factor_options │
└─────────────┘       └──────────────────┘       └────────────────┘
      │
      │ service_addons
      ▼
┌─────────────┐       ┌──────────────────────┐
│   addons    │       │ business_entity_types│
└─────────────┘       └──────────────────────┘
                               │
                               │
┌─────────────┐       ┌────────┴───────┐       ┌──────────────────┐
│  customers  │──────<│     quotes     │──────<│ quote_line_items │
└─────────────┘       └────────────────┘       └──────────────────┘
                               │
                               ▼
                      ┌────────────────────┐
                      │quote_status_history│
                      └────────────────────┘
```

## Custom Types (ENUMs)

- `factor_type`: 'select', 'number', 'boolean', 'text'
- `price_impact_type`: 'fixed', 'percentage', 'multiplier'
- `quote_status`: 'draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled'
- `audit_action`: 'created', 'updated', 'deleted', 'status_changed', 'price_changed'

## Key Features

### Pricing Calculation Order
1. Start with `base_price` from service
2. Add all 'fixed' impacts
3. Add 'percentage' impacts (based on base_price only)
4. Apply 'multiplier' impacts (to running total)
5. Apply entity type modifier
6. Add fixed-price add-ons

### Auto-Generated Quote Numbers
Quotes automatically receive numbers in format: `QT-YYYY-NNNN`

### Automatic Quote Expiration
Quotes automatically transition to 'expired' status when expiration_date passes.

### Audit Trail
All changes to quotes, services, pricing factors, and factor options are automatically logged.

## Running Migrations

### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize (if not done)
supabase init

# Run migrations
supabase db push

# Or run individually
supabase db execute -f supabase/migrations/001_create_services.sql
```

### Direct PostgreSQL

```bash
# Run all migrations in order
psql -d your_database -f supabase/migrations/001_create_services.sql
psql -d your_database -f supabase/migrations/002_create_pricing_factors.sql
psql -d your_database -f supabase/migrations/003_create_entity_types_addons.sql
psql -d your_database -f supabase/migrations/004_create_quotes_customers.sql
psql -d your_database -f supabase/migrations/005_create_audit_logs.sql

# Seed data
psql -d your_database -f supabase/seed/001_seed_data.sql
```

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- Public read access for service catalog data (services, factors, options, addons, entity types)
- Authenticated user access for customer and quote data
- Audit logs are insert-only (immutable)

## Development vs Production

### Phase 1 (MVP)
- Use `db.json` with json-server for local development
- Schema mirrors the db.json structure

### Phase 2 (Production)
- Deploy migrations to Supabase
- Enable authentication
- Connect frontend to Supabase client
