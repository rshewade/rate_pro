-- Seed Data for RatePro
-- This matches the db.json structure for consistency between dev and production

-- Insert Services
INSERT INTO services (id, name, description, base_price, is_active, display_order) VALUES
(1, 'Bookkeeping', 'Monthly bookkeeping and financial record management', 500.00, true, 1),
(2, 'Payroll', 'Employee payroll processing and tax filings', 300.00, true, 2),
(3, 'Year-End Accounting', 'Annual financial statements and reconciliation', 1500.00, true, 3),
(4, 'Tax Preparation', 'Business and individual tax return preparation', 800.00, true, 4),
(5, 'CFO Services', 'Fractional CFO and strategic financial advisory', 2500.00, true, 5);

-- Reset sequence
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- Insert Pricing Factors
INSERT INTO pricing_factors (id, service_id, name, description, factor_type, is_required, display_order) VALUES
-- Bookkeeping factors
(1, 1, 'Monthly Transactions', 'Number of monthly transactions to process', 'select', true, 1),
(2, 1, 'Complexity Level', 'Complexity of bookkeeping requirements', 'select', true, 2),
-- Payroll factors
(3, 2, 'Number of Employees', 'Total employees on payroll', 'select', true, 1),
(4, 2, 'Pay Frequency', 'How often employees are paid', 'select', true, 2),
-- Year-End Accounting factors
(5, 3, 'Revenue Range', 'Annual business revenue', 'select', true, 1),
-- Tax Preparation factors
(6, 4, 'Return Type', 'Type of tax return', 'select', true, 1),
(7, 4, 'Number of Schedules', 'Additional tax schedules required', 'select', false, 2),
-- CFO Services factors
(8, 5, 'Hours Per Month', 'Monthly CFO engagement hours', 'select', true, 1);

-- Reset sequence
SELECT setval('pricing_factors_id_seq', (SELECT MAX(id) FROM pricing_factors));

-- Insert Factor Options
INSERT INTO factor_options (id, factor_id, label, price_impact, price_impact_type, display_order) VALUES
-- Monthly Transactions options (factor_id: 1)
(1, 1, '0-50 transactions', 0, 'fixed', 1),
(2, 1, '51-150 transactions', 150, 'fixed', 2),
(3, 1, '151-300 transactions', 300, 'fixed', 3),
(4, 1, '300+ transactions', 500, 'fixed', 4),
-- Complexity Level options (factor_id: 2)
(5, 2, 'Standard', 1.0, 'multiplier', 1),
(6, 2, 'Moderate', 1.2, 'multiplier', 2),
(7, 2, 'Complex', 1.5, 'multiplier', 3),
-- Number of Employees options (factor_id: 3)
(8, 3, '1-5 employees', 0, 'fixed', 1),
(9, 3, '6-15 employees', 100, 'fixed', 2),
(10, 3, '16-50 employees', 250, 'fixed', 3),
(11, 3, '50+ employees', 500, 'fixed', 4),
-- Pay Frequency options (factor_id: 4)
(12, 4, 'Monthly', 1.0, 'multiplier', 1),
(13, 4, 'Bi-weekly', 1.3, 'multiplier', 2),
(14, 4, 'Weekly', 1.5, 'multiplier', 3),
-- Revenue Range options (factor_id: 5)
(15, 5, 'Under $500K', 0, 'fixed', 1),
(16, 5, '$500K - $1M', 500, 'fixed', 2),
(17, 5, '$1M - $5M', 1000, 'fixed', 3),
(18, 5, 'Over $5M', 2000, 'fixed', 4),
-- Return Type options (factor_id: 6)
(19, 6, 'Individual (1040)', 0, 'fixed', 1),
(20, 6, 'Partnership (1065)', 400, 'fixed', 2),
(21, 6, 'S-Corp (1120S)', 600, 'fixed', 3),
(22, 6, 'C-Corp (1120)', 800, 'fixed', 4),
-- Number of Schedules options (factor_id: 7)
(23, 7, 'None', 0, 'fixed', 1),
(24, 7, '1-3 schedules', 150, 'fixed', 2),
(25, 7, '4-6 schedules', 300, 'fixed', 3),
(26, 7, '7+ schedules', 500, 'fixed', 4),
-- Hours Per Month options (factor_id: 8)
(27, 8, '5 hours/month', 1.0, 'multiplier', 1),
(28, 8, '10 hours/month', 1.8, 'multiplier', 2),
(29, 8, '20 hours/month', 3.2, 'multiplier', 3),
(30, 8, '40 hours/month', 5.5, 'multiplier', 4);

-- Reset sequence
SELECT setval('factor_options_id_seq', (SELECT MAX(id) FROM factor_options));

-- Insert Business Entity Types
INSERT INTO business_entity_types (id, name, description, price_modifier, modifier_type, display_order) VALUES
(1, 'Sole Proprietorship', 'Individual business owner', 1.0, 'multiplier', 1),
(2, 'LLC', 'Limited Liability Company', 1.1, 'multiplier', 2),
(3, 'S-Corporation', 'S-Corp election', 1.2, 'multiplier', 3),
(4, 'C-Corporation', 'Traditional corporation', 1.3, 'multiplier', 4),
(5, 'Partnership', 'Multi-member partnership', 1.15, 'multiplier', 5),
(6, 'Non-Profit', '501(c)(3) organization', 1.25, 'multiplier', 6);

-- Reset sequence
SELECT setval('business_entity_types_id_seq', (SELECT MAX(id) FROM business_entity_types));

-- Insert Add-ons
INSERT INTO addons (id, name, description, price, is_global, display_order) VALUES
(1, 'Expedited Service', 'Priority processing with faster turnaround', 100.00, true, 1),
(2, 'Dedicated Account Manager', 'Single point of contact for all communications', 150.00, true, 2),
(3, 'Multi-State Filing', 'Tax filings for multiple states', 200.00, false, 3),
(4, 'Audit Support', 'Representation and support during audits', 500.00, false, 4),
(5, 'Financial Reporting Package', 'Monthly financial reports and dashboards', 250.00, false, 5),
(6, 'Direct Deposit Setup', 'Setup and management of direct deposits', 75.00, false, 6);

-- Reset sequence
SELECT setval('addons_id_seq', (SELECT MAX(id) FROM addons));

-- Insert Service-Addon associations (for non-global addons)
INSERT INTO service_addons (service_id, addon_id) VALUES
(4, 3), -- Multi-State Filing -> Tax Preparation
(3, 4), -- Audit Support -> Year-End Accounting
(4, 4), -- Audit Support -> Tax Preparation
(1, 5), -- Financial Reporting Package -> Bookkeeping
(5, 5), -- Financial Reporting Package -> CFO Services
(2, 6); -- Direct Deposit Setup -> Payroll

-- Insert Sample Customer
INSERT INTO customers (id, company_name, contact_name, email, phone, entity_type_id) VALUES
(1, 'Acme Corp', 'John Smith', 'john@acmecorp.com', '555-0100', 4);

-- Reset sequence
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- Insert Sample Quote
INSERT INTO quotes (id, quote_number, customer_id, status, total_price, expiration_date, notes) VALUES
(1, 'QT-2024-0001', 1, 'draft', 1850.00, CURRENT_DATE + INTERVAL '30 days', 'Initial quote for bookkeeping services');

-- Reset sequence
SELECT setval('quotes_id_seq', (SELECT MAX(id) FROM quotes));

-- Insert Sample Quote Line Item
INSERT INTO quote_line_items (id, quote_id, service_id, entity_type_id, base_price, calculated_price, selected_factors, selected_addon_ids, price_breakdown) VALUES
(1, 1, 1, 4, 500.00, 1850.00,
 '[{"factor_id": 1, "option_id": 3}, {"factor_id": 2, "option_id": 6}]'::jsonb,
 ARRAY[1, 5],
 '{"base_price": 500, "fixed_impacts": 300, "multiplier_impacts": 1.2, "entity_multiplier": 1.3, "addons": 350, "subtotal": 1850}'::jsonb
);

-- Reset sequence
SELECT setval('quote_line_items_id_seq', (SELECT MAX(id) FROM quote_line_items));

-- Verify data
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Services: %', (SELECT COUNT(*) FROM services);
    RAISE NOTICE 'Pricing Factors: %', (SELECT COUNT(*) FROM pricing_factors);
    RAISE NOTICE 'Factor Options: %', (SELECT COUNT(*) FROM factor_options);
    RAISE NOTICE 'Business Entity Types: %', (SELECT COUNT(*) FROM business_entity_types);
    RAISE NOTICE 'Addons: %', (SELECT COUNT(*) FROM addons);
    RAISE NOTICE 'Customers: %', (SELECT COUNT(*) FROM customers);
    RAISE NOTICE 'Quotes: %', (SELECT COUNT(*) FROM quotes);
END $$;
