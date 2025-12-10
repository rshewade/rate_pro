-- Migration: 002_create_pricing_factors
-- Description: Create pricing factors and factor options tables
-- Author: RatePro Team
-- Date: 2024-01-01

-- Create enum for factor types
CREATE TYPE factor_type AS ENUM ('select', 'number', 'boolean', 'text');

-- Create pricing_factors table
CREATE TABLE IF NOT EXISTS pricing_factors (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    factor_type factor_type NOT NULL DEFAULT 'select',
    is_required BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- Dependency configuration (JSON for flexibility)
    depends_on_factor_id BIGINT REFERENCES pricing_factors(id) ON DELETE SET NULL,
    depends_on_option_ids BIGINT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for pricing_factors
CREATE INDEX idx_pricing_factors_service_id ON pricing_factors(service_id);
CREATE INDEX idx_pricing_factors_display_order ON pricing_factors(service_id, display_order);
CREATE INDEX idx_pricing_factors_depends_on ON pricing_factors(depends_on_factor_id) WHERE depends_on_factor_id IS NOT NULL;

-- Create unique constraint for factor name within a service
CREATE UNIQUE INDEX idx_pricing_factors_service_name ON pricing_factors(service_id, name);

-- Add comments
COMMENT ON TABLE pricing_factors IS 'Configurable pricing factors that affect the final price of a service';
COMMENT ON COLUMN pricing_factors.factor_type IS 'Type of input: select (dropdown), number, boolean (checkbox), text';
COMMENT ON COLUMN pricing_factors.depends_on_factor_id IS 'Factor ID this factor depends on (conditional visibility)';
COMMENT ON COLUMN pricing_factors.depends_on_option_ids IS 'Array of option IDs that must be selected for this factor to appear';

-- Create trigger for updated_at
CREATE TRIGGER trigger_pricing_factors_updated_at
    BEFORE UPDATE ON pricing_factors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create enum for price impact types
CREATE TYPE price_impact_type AS ENUM ('fixed', 'percentage', 'multiplier');

-- Create factor_options table
CREATE TABLE IF NOT EXISTS factor_options (
    id BIGSERIAL PRIMARY KEY,
    factor_id BIGINT NOT NULL REFERENCES pricing_factors(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(100), -- Optional value different from label
    price_impact DECIMAL(10, 4) NOT NULL DEFAULT 0,
    price_impact_type price_impact_type NOT NULL DEFAULT 'fixed',
    display_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for factor_options
CREATE INDEX idx_factor_options_factor_id ON factor_options(factor_id);
CREATE INDEX idx_factor_options_display_order ON factor_options(factor_id, display_order);

-- Create unique constraint for option label within a factor
CREATE UNIQUE INDEX idx_factor_options_factor_label ON factor_options(factor_id, label);

-- Add comments
COMMENT ON TABLE factor_options IS 'Available options for each pricing factor';
COMMENT ON COLUMN factor_options.price_impact IS 'Numeric value for price impact (amount, percentage as decimal, or multiplier)';
COMMENT ON COLUMN factor_options.price_impact_type IS 'How the price impact is applied: fixed (add), percentage (of base), multiplier (multiply total)';
COMMENT ON COLUMN factor_options.is_default IS 'Whether this option is pre-selected by default';

-- Create trigger for updated_at
CREATE TRIGGER trigger_factor_options_updated_at
    BEFORE UPDATE ON factor_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE pricing_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE factor_options ENABLE ROW LEVEL SECURITY;

-- Policies for pricing_factors
CREATE POLICY "Allow public read access to pricing_factors"
    ON pricing_factors
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage pricing_factors"
    ON pricing_factors
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for factor_options
CREATE POLICY "Allow public read access to factor_options"
    ON factor_options
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage factor_options"
    ON factor_options
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
