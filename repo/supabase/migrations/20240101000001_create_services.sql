-- Migration: 001_create_services
-- Description: Create the services table for core service offerings
-- Author: RatePro Team
-- Date: 2024-01-01

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index on name
CREATE UNIQUE INDEX idx_services_name ON services(name);

-- Create index for active services lookup
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;

-- Create index for ordering
CREATE INDEX idx_services_display_order ON services(display_order);

-- Add comment to table
COMMENT ON TABLE services IS 'Core services offered by the financial services company';
COMMENT ON COLUMN services.base_price IS 'Starting price before any factors or modifiers are applied';
COMMENT ON COLUMN services.is_active IS 'Whether the service is currently available for quotes';
COMMENT ON COLUMN services.display_order IS 'Order in which services appear in the UI';

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active services
CREATE POLICY "Allow public read access to active services"
    ON services
    FOR SELECT
    USING (is_active = true);

-- Policy: Allow authenticated users to manage services (for admin)
CREATE POLICY "Allow authenticated users full access"
    ON services
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
