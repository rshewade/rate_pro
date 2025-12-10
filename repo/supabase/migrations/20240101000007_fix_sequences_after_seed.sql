-- Migration: 007_fix_sequences_after_seed
-- Description: Reset all table sequences to match highest existing IDs
-- This fixes "duplicate key" errors after seeding with explicit IDs
-- Author: RatePro Team
-- Date: 2024-01-01

-- Fix all table sequences to start after the highest existing ID
SELECT setval('services_id_seq', COALESCE((SELECT MAX(id) FROM services), 1));
SELECT setval('pricing_factors_id_seq', COALESCE((SELECT MAX(id) FROM pricing_factors), 1));
SELECT setval('factor_options_id_seq', COALESCE((SELECT MAX(id) FROM factor_options), 1));
SELECT setval('business_entity_types_id_seq', COALESCE((SELECT MAX(id) FROM business_entity_types), 1));
SELECT setval('addons_id_seq', COALESCE((SELECT MAX(id) FROM addons), 1));
SELECT setval('customers_id_seq', COALESCE((SELECT MAX(id) FROM customers), 1));
SELECT setval('quotes_id_seq', COALESCE((SELECT MAX(id) FROM quotes), 1));
SELECT setval('quote_line_items_id_seq', COALESCE((SELECT MAX(id) FROM quote_line_items), 1));
SELECT setval('audit_logs_id_seq', COALESCE((SELECT MAX(id) FROM audit_logs), 1));
