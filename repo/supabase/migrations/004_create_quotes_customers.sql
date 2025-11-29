-- Migration: 004_create_quotes_customers
-- Description: Create customers, quotes, quote versions, and quote line items tables
-- Author: RatePro Team
-- Date: 2024-01-01

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    entity_type_id BIGINT REFERENCES business_entity_types(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for customers
CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX idx_customers_entity_type ON customers(entity_type_id) WHERE entity_type_id IS NOT NULL;

-- Add comments
COMMENT ON TABLE customers IS 'Customer information for quote generation';

-- Create trigger for updated_at
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create enum for quote status
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled');

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id BIGSERIAL PRIMARY KEY,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status quote_status NOT NULL DEFAULT 'draft',
    total_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    expiration_date DATE NOT NULL,
    valid_days INTEGER NOT NULL DEFAULT 30,
    notes TEXT,
    internal_notes TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    parent_quote_id BIGINT REFERENCES quotes(id) ON DELETE SET NULL,
    created_by UUID, -- Will link to auth.users in Phase 2
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for quotes
CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_expiration ON quotes(expiration_date);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_parent ON quotes(parent_quote_id) WHERE parent_quote_id IS NOT NULL;

-- Create composite index for common queries
CREATE INDEX idx_quotes_customer_status ON quotes(customer_id, status);

-- Add comments
COMMENT ON TABLE quotes IS 'Generated pricing quotes for customers';
COMMENT ON COLUMN quotes.quote_number IS 'Unique human-readable quote identifier (e.g., QT-2024-0001)';
COMMENT ON COLUMN quotes.version IS 'Version number for tracking quote revisions';
COMMENT ON COLUMN quotes.parent_quote_id IS 'Reference to original quote if this is a revision';

-- Create trigger for updated_at
CREATE TRIGGER trigger_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix VARCHAR(4);
    next_num INTEGER;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YYYY');

    -- Get the next number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 9) AS INTEGER)), 0) + 1
    INTO next_num
    FROM quotes
    WHERE quote_number LIKE 'QT-' || year_prefix || '-%';

    NEW.quote_number := 'QT-' || year_prefix || '-' || LPAD(next_num::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating quote number
CREATE TRIGGER trigger_generate_quote_number
    BEFORE INSERT ON quotes
    FOR EACH ROW
    WHEN (NEW.quote_number IS NULL OR NEW.quote_number = '')
    EXECUTE FUNCTION generate_quote_number();

-- Create function to auto-expire quotes
CREATE OR REPLACE FUNCTION check_quote_expiration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiration_date < CURRENT_DATE AND NEW.status NOT IN ('accepted', 'rejected', 'cancelled', 'expired') THEN
        NEW.status := 'expired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_quote_expiration
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION check_quote_expiration();

-- Create quote_line_items table
CREATE TABLE IF NOT EXISTS quote_line_items (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    entity_type_id BIGINT REFERENCES business_entity_types(id) ON DELETE SET NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    calculated_price DECIMAL(12, 2) NOT NULL,
    -- Store selected factors as JSONB for flexibility
    selected_factors JSONB NOT NULL DEFAULT '[]',
    -- Store selected addon IDs
    selected_addon_ids BIGINT[] DEFAULT '{}',
    -- Price breakdown for transparency
    price_breakdown JSONB NOT NULL DEFAULT '{}',
    notes TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for quote_line_items
CREATE INDEX idx_quote_line_items_quote_id ON quote_line_items(quote_id);
CREATE INDEX idx_quote_line_items_service_id ON quote_line_items(service_id);

-- Add comments
COMMENT ON TABLE quote_line_items IS 'Individual service line items within a quote';
COMMENT ON COLUMN quote_line_items.selected_factors IS 'JSON array of {factor_id, option_id} objects';
COMMENT ON COLUMN quote_line_items.selected_addon_ids IS 'Array of selected addon IDs for this line item';
COMMENT ON COLUMN quote_line_items.price_breakdown IS 'Detailed breakdown of price calculation';

-- Create trigger for updated_at
CREATE TRIGGER trigger_quote_line_items_updated_at
    BEFORE UPDATE ON quote_line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create quote_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS quote_status_history (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    old_status quote_status,
    new_status quote_status NOT NULL,
    changed_by UUID, -- Will link to auth.users in Phase 2
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for status history
CREATE INDEX idx_quote_status_history_quote_id ON quote_status_history(quote_id);
CREATE INDEX idx_quote_status_history_created_at ON quote_status_history(created_at DESC);

-- Add comments
COMMENT ON TABLE quote_status_history IS 'History of quote status changes for audit purposes';

-- Create trigger to automatically track status changes
CREATE OR REPLACE FUNCTION track_quote_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO quote_status_history (quote_id, old_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_quote_status
    AFTER UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION track_quote_status_change();

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_status_history ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Allow authenticated users to read customers"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage customers"
    ON customers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for quotes
CREATE POLICY "Allow authenticated users to read quotes"
    ON quotes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage quotes"
    ON quotes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for quote_line_items
CREATE POLICY "Allow authenticated users to read quote_line_items"
    ON quote_line_items
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage quote_line_items"
    ON quote_line_items
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for quote_status_history
CREATE POLICY "Allow authenticated users to read quote_status_history"
    ON quote_status_history
    FOR SELECT
    TO authenticated
    USING (true);
