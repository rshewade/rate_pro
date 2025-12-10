-- Migration: 008_add_anon_read_policies
-- Description: Add SELECT policies for anonymous users on quote-related tables
-- The original migration 004 only added SELECT policies for 'authenticated' role
-- This adds SELECT for 'anon' role to support Phase 1 MVP (no auth)

-- Customers - allow anon to read
CREATE POLICY "Allow anon to read customers"
    ON customers
    FOR SELECT
    TO anon
    USING (true);

-- Quotes - allow anon to read
CREATE POLICY "Allow anon to read quotes"
    ON quotes
    FOR SELECT
    TO anon
    USING (true);

-- Quote Line Items - allow anon to read
CREATE POLICY "Allow anon to read quote_line_items"
    ON quote_line_items
    FOR SELECT
    TO anon
    USING (true);

-- Quote Status History - allow anon to read
CREATE POLICY "Allow anon to read quote_status_history"
    ON quote_status_history
    FOR SELECT
    TO anon
    USING (true);
