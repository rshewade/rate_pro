-- Migration: 003_create_entity_types_addons
-- Description: Create business entity types and add-ons tables
-- Author: RatePro Team
-- Date: 2024-01-01

-- Create business_entity_types table
CREATE TABLE IF NOT EXISTS business_entity_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price_modifier DECIMAL(10, 4) NOT NULL DEFAULT 1.0,
    modifier_type price_impact_type NOT NULL DEFAULT 'multiplier',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_business_entity_types_active ON business_entity_types(is_active) WHERE is_active = true;
CREATE INDEX idx_business_entity_types_display_order ON business_entity_types(display_order);

-- Add comments
COMMENT ON TABLE business_entity_types IS 'Business entity types (LLC, S-Corp, etc.) with pricing modifiers';
COMMENT ON COLUMN business_entity_types.price_modifier IS 'Pricing modifier value applied based on entity type';
COMMENT ON COLUMN business_entity_types.modifier_type IS 'How the modifier is applied (typically multiplier)';

-- Create trigger for updated_at
CREATE TRIGGER trigger_business_entity_types_updated_at
    BEFORE UPDATE ON business_entity_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create addons table
CREATE TABLE IF NOT EXISTS addons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_global BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index on addon name
CREATE UNIQUE INDEX idx_addons_name ON addons(name);

-- Create indexes
CREATE INDEX idx_addons_global ON addons(is_global) WHERE is_global = true;
CREATE INDEX idx_addons_active ON addons(is_active) WHERE is_active = true;

-- Add comments
COMMENT ON TABLE addons IS 'Optional add-on services with fixed prices';
COMMENT ON COLUMN addons.is_global IS 'If true, addon is available for all services; if false, use service_addons junction table';

-- Create trigger for updated_at
CREATE TRIGGER trigger_addons_updated_at
    BEFORE UPDATE ON addons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create junction table for service-specific addons
CREATE TABLE IF NOT EXISTS service_addons (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    addon_id BIGINT NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(service_id, addon_id)
);

-- Create indexes for service_addons
CREATE INDEX idx_service_addons_service_id ON service_addons(service_id);
CREATE INDEX idx_service_addons_addon_id ON service_addons(addon_id);

-- Add comments
COMMENT ON TABLE service_addons IS 'Junction table linking non-global addons to specific services';

-- Enable RLS
ALTER TABLE business_entity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

-- Policies for business_entity_types
CREATE POLICY "Allow public read access to business_entity_types"
    ON business_entity_types
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage business_entity_types"
    ON business_entity_types
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for addons
CREATE POLICY "Allow public read access to addons"
    ON addons
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage addons"
    ON addons
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies for service_addons
CREATE POLICY "Allow public read access to service_addons"
    ON service_addons
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage service_addons"
    ON service_addons
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
