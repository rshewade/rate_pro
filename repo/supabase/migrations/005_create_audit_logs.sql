-- Migration: 005_create_audit_logs
-- Description: Create audit logs table for tracking all changes
-- Author: RatePro Team
-- Date: 2024-01-01

-- Create enum for audit action types
CREATE TYPE audit_action AS ENUM ('created', 'updated', 'deleted', 'status_changed', 'price_changed');

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action audit_action NOT NULL,
    user_id UUID, -- Will link to auth.users in Phase 2
    user_email VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    changes JSONB, -- Summary of what changed
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create composite index for common queries
CREATE INDEX idx_audit_logs_entity_created ON audit_logs(entity_type, entity_id, created_at DESC);

-- Add comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all entity changes';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity (quote, service, customer, etc.)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN audit_logs.old_values IS 'Previous state of the entity';
COMMENT ON COLUMN audit_logs.new_values IS 'New state of the entity';
COMMENT ON COLUMN audit_logs.changes IS 'Summary of changed fields';

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs (read-only for most users)
CREATE POLICY "Allow authenticated users to read audit_logs"
    ON audit_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Only allow inserts, no updates or deletes (immutable audit trail)
CREATE POLICY "Allow system inserts to audit_logs"
    ON audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create helper function for logging audit entries
CREATE OR REPLACE FUNCTION log_audit_entry(
    p_entity_type VARCHAR(50),
    p_entity_id BIGINT,
    p_action audit_action,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_changes JSONB DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_audit_id BIGINT;
BEGIN
    INSERT INTO audit_logs (
        entity_type,
        entity_id,
        action,
        old_values,
        new_values,
        changes
    ) VALUES (
        p_entity_type,
        p_entity_id,
        p_action,
        p_old_values,
        p_new_values,
        p_changes
    )
    RETURNING id INTO v_audit_id;

    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_old_values JSONB;
    v_new_values JSONB;
    v_action audit_action;
    v_changes JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_action := 'created';
        v_new_values := to_jsonb(NEW);
        v_old_values := NULL;
        v_changes := jsonb_build_object('action', 'Record created');
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'updated';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);

        -- Calculate changes
        SELECT jsonb_object_agg(key, value)
        INTO v_changes
        FROM (
            SELECT key, jsonb_build_object('old', v_old_values->key, 'new', value) AS value
            FROM jsonb_each(v_new_values)
            WHERE v_old_values->key IS DISTINCT FROM value
              AND key NOT IN ('updated_at', 'created_at')
        ) AS changed_fields;

    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'deleted';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
        v_changes := jsonb_build_object('action', 'Record deleted');
    END IF;

    -- Only log if there are actual changes (for updates)
    IF TG_OP != 'UPDATE' OR v_changes IS NOT NULL THEN
        INSERT INTO audit_logs (
            entity_type,
            entity_id,
            action,
            old_values,
            new_values,
            changes
        ) VALUES (
            TG_TABLE_NAME,
            CASE
                WHEN TG_OP = 'DELETE' THEN OLD.id
                ELSE NEW.id
            END,
            v_action,
            v_old_values,
            v_new_values,
            v_changes
        );
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for quotes table (most critical for auditing)
CREATE TRIGGER audit_quotes
    AFTER INSERT OR UPDATE OR DELETE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- Create audit trigger for services (admin changes)
CREATE TRIGGER audit_services
    AFTER INSERT OR UPDATE OR DELETE ON services
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- Create audit trigger for pricing factors (admin changes)
CREATE TRIGGER audit_pricing_factors
    AFTER INSERT OR UPDATE OR DELETE ON pricing_factors
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- Create audit trigger for factor options (admin changes)
CREATE TRIGGER audit_factor_options
    AFTER INSERT OR UPDATE OR DELETE ON factor_options
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();

-- Create view for easy audit log querying
CREATE OR REPLACE VIEW audit_log_view AS
SELECT
    al.id,
    al.entity_type,
    al.entity_id,
    al.action,
    al.user_id,
    al.user_email,
    al.changes,
    al.created_at,
    CASE
        WHEN al.entity_type = 'quotes' THEN (SELECT quote_number FROM quotes WHERE id = al.entity_id)
        WHEN al.entity_type = 'services' THEN (SELECT name FROM services WHERE id = al.entity_id)
        ELSE NULL
    END AS entity_reference
FROM audit_logs al
ORDER BY al.created_at DESC;

COMMENT ON VIEW audit_log_view IS 'Convenience view for audit logs with entity references';
