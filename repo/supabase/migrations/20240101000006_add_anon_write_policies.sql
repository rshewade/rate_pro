-- Migration: 006_add_anon_write_policies
-- Description: Add write policies for anonymous users (Phase 1 MVP - no auth)
-- Note: In production with auth, these policies should be replaced with authenticated-only policies

-- Services - allow anon to manage
CREATE POLICY "Allow anon to insert services"
    ON services
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update services"
    ON services
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete services"
    ON services
    FOR DELETE
    TO anon
    USING (true);

-- Pricing Factors - allow anon to manage
CREATE POLICY "Allow anon to insert pricing_factors"
    ON pricing_factors
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update pricing_factors"
    ON pricing_factors
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete pricing_factors"
    ON pricing_factors
    FOR DELETE
    TO anon
    USING (true);

-- Factor Options - allow anon to manage
CREATE POLICY "Allow anon to insert factor_options"
    ON factor_options
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update factor_options"
    ON factor_options
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete factor_options"
    ON factor_options
    FOR DELETE
    TO anon
    USING (true);

-- Business Entity Types - allow anon to manage
CREATE POLICY "Allow anon to insert business_entity_types"
    ON business_entity_types
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update business_entity_types"
    ON business_entity_types
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete business_entity_types"
    ON business_entity_types
    FOR DELETE
    TO anon
    USING (true);

-- Addons - allow anon to manage
CREATE POLICY "Allow anon to insert addons"
    ON addons
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update addons"
    ON addons
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete addons"
    ON addons
    FOR DELETE
    TO anon
    USING (true);

-- Service Addons junction - allow anon to manage
CREATE POLICY "Allow anon to insert service_addons"
    ON service_addons
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete service_addons"
    ON service_addons
    FOR DELETE
    TO anon
    USING (true);

-- Customers - allow anon to manage
CREATE POLICY "Allow anon to insert customers"
    ON customers
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update customers"
    ON customers
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Quotes - allow anon to manage
CREATE POLICY "Allow anon to insert quotes"
    ON quotes
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update quotes"
    ON quotes
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete quotes"
    ON quotes
    FOR DELETE
    TO anon
    USING (true);

-- Quote Line Items - allow anon to manage
CREATE POLICY "Allow anon to insert quote_line_items"
    ON quote_line_items
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anon to update quote_line_items"
    ON quote_line_items
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon to delete quote_line_items"
    ON quote_line_items
    FOR DELETE
    TO anon
    USING (true);

-- Quote Status History - allow anon to insert (read-only for users)
CREATE POLICY "Allow anon to insert quote_status_history"
    ON quote_status_history
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Audit Logs - allow anon to insert (audit trail should be append-only)
CREATE POLICY "Allow anon to insert audit_logs"
    ON audit_logs
    FOR INSERT
    TO anon
    WITH CHECK (true);
