-- Schema Validation Script for RatePro
-- Run this after migrations to verify schema integrity

-- Check all tables exist
DO $$
DECLARE
    tables_expected TEXT[] := ARRAY[
        'services',
        'pricing_factors',
        'factor_options',
        'business_entity_types',
        'addons',
        'service_addons',
        'customers',
        'quotes',
        'quote_line_items',
        'quote_status_history',
        'audit_logs'
    ];
    tbl TEXT;
    missing_tables TEXT[] := '{}';
BEGIN
    FOREACH tbl IN ARRAY tables_expected LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = tbl
        ) THEN
            missing_tables := array_append(missing_tables, tbl);
        END IF;
    END LOOP;

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Missing tables: %', missing_tables;
    ELSE
        RAISE NOTICE 'All % expected tables exist', array_length(tables_expected, 1);
    END IF;
END $$;

-- Check all enums exist
DO $$
DECLARE
    enums_expected TEXT[] := ARRAY[
        'factor_type',
        'price_impact_type',
        'quote_status',
        'audit_action'
    ];
    enum_name TEXT;
    missing_enums TEXT[] := '{}';
BEGIN
    FOREACH enum_name IN ARRAY enums_expected LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = enum_name
        ) THEN
            missing_enums := array_append(missing_enums, enum_name);
        END IF;
    END LOOP;

    IF array_length(missing_enums, 1) > 0 THEN
        RAISE EXCEPTION 'Missing enums: %', missing_enums;
    ELSE
        RAISE NOTICE 'All % expected enums exist', array_length(enums_expected, 1);
    END IF;
END $$;

-- Verify foreign key constraints
DO $$
DECLARE
    fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
      AND table_schema = 'public';

    RAISE NOTICE 'Foreign key constraints found: %', fk_count;

    IF fk_count < 10 THEN
        RAISE WARNING 'Expected at least 10 foreign key constraints, found %', fk_count;
    END IF;
END $$;

-- Verify RLS is enabled on all tables
DO $$
DECLARE
    tables_without_rls TEXT[] := '{}';
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename NOT LIKE 'pg_%'
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_class
            WHERE relname = rec.tablename
              AND relrowsecurity = true
        ) THEN
            tables_without_rls := array_append(tables_without_rls, rec.tablename);
        END IF;
    END LOOP;

    IF array_length(tables_without_rls, 1) > 0 THEN
        RAISE WARNING 'Tables without RLS: %', tables_without_rls;
    ELSE
        RAISE NOTICE 'RLS enabled on all tables';
    END IF;
END $$;

-- Verify triggers exist
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers
    WHERE trigger_schema = 'public';

    RAISE NOTICE 'Triggers found: %', trigger_count;

    IF trigger_count < 5 THEN
        RAISE WARNING 'Expected at least 5 triggers, found %', trigger_count;
    END IF;
END $$;

-- Test data integrity with sample insert/select
DO $$
DECLARE
    test_service_id BIGINT;
BEGIN
    -- Test service insert
    INSERT INTO services (name, description, base_price)
    VALUES ('Test Service', 'Validation test', 100.00)
    RETURNING id INTO test_service_id;

    -- Test factor insert with FK
    INSERT INTO pricing_factors (service_id, name, factor_type)
    VALUES (test_service_id, 'Test Factor', 'select');

    -- Clean up
    DELETE FROM services WHERE id = test_service_id;

    RAISE NOTICE 'Data integrity test passed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Data integrity test failed: %', SQLERRM;
END $$;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Schema validation completed successfully';
    RAISE NOTICE '========================================';
END $$;
