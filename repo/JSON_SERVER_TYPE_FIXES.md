# JSON Server Type Mismatch Fixes

## Overview

json-server version 1.x returns primary keys (`id`) as **strings** (e.g., `"1"`) while foreign keys (`service_id`, `factor_id`, etc.) remain **numbers** (e.g., `1`). This causes strict equality (`===`) comparisons to fail.

**When migrating to Supabase**, these fixes should be reviewed and potentially reverted to use strict equality (`===`) if Supabase returns consistent types.

---

## Files Modified

### 1. `src/hooks/useCalculator.js`

| Line | Original | Fixed | Description |
|------|----------|-------|-------------|
| ~29 | `s.id === selectedServiceId` | `s.id == selectedServiceId` | Find selected service |
| ~35 | `f.service_id === selectedServiceId` | `f.service_id == selectedServiceId` | Filter pricing factors by service |
| ~38-41 | `factorIds.includes(o.factor_id)` | `factorIds.includes(String(o.factor_id))` | Filter factor options (uses String conversion) |
| ~46 | `e.id === selectedEntityTypeId` | `e.id == selectedEntityTypeId` | Find selected entity type |

### 2. `src/components/calculator/Calculator.jsx`

| Line | Original | Fixed | Description |
|------|----------|-------|-------------|
| ~58 | `sf.factor_id === factorId` | `sf.factor_id == factorId` | getSelectedOptionId function |
| ~103 | `o.id === Number(...)` | `o.id == getSelectedOptionId(...)` | Export quote template |
| ~229 | `o.factor_id === factor.id` | `o.factor_id == factor.id` | Filter options for factor dropdown |
| ~359 | `o.id === Number(...)` | `o.id == getSelectedOptionId(...)` | Configuration display |
| ~372 | `e.id === selectedEntityTypeId` | `e.id == selectedEntityTypeId` | Entity type display |

### 3. `src/lib/pricing/calculator.js`

| Line | Original | Fixed | Description |
|------|----------|-------|-------------|
| ~49 | `o.id === selected.option_id` | `o.id == selected.option_id` | calculateFixedImpacts |
| ~53 | `f.id === selected.factor_id` | `f.id == selected.factor_id` | calculateFixedImpacts |
| ~85 | `o.id === selected.option_id` | `o.id == selected.option_id` | calculatePercentageImpacts |
| ~89 | `f.id === selected.factor_id` | `f.id == selected.factor_id` | calculatePercentageImpacts |
| ~119 | `o.id === selected.option_id` | `o.id == selected.option_id` | calculateMultiplierImpacts |
| ~123 | `f.id === selected.factor_id` | `f.id == selected.factor_id` | calculateMultiplierImpacts |
| ~353 | `selectedFactorIds.has(factor.id)` | `selectedFactorIds.has(String(factor.id))` | validateRequiredFactors |
| ~388 | `f.id === factorId` | `f.id == factorId` | detectCircularDependencies |

---

## Search Patterns

To find all these changes, search for:
```bash
# Find loose equality comparisons with ID fields
grep -rn "\.id ==" src/
grep -rn "factor_id ==" src/
grep -rn "service_id ==" src/

# Find String() conversions for IDs
grep -rn "String(.*\.id)" src/
grep -rn "String(.*factor_id)" src/
```

---

## Reverting for Supabase

When migrating to Supabase:

1. **Test first** - Supabase should return consistent integer types for IDs
2. **Replace `==` with `===`** for type safety
3. **Remove `String()` conversions** where used for ID comparisons
4. **Run tests** to ensure everything still works

### Quick Revert Commands

```bash
# Find and review all loose equality with IDs
grep -rn "\.id ==" src/ --include="*.js" --include="*.jsx"
grep -rn "_id ==" src/ --include="*.js" --include="*.jsx"
```

---

## Related Commits

- `5d69832` - fix: Handle type mismatch in pricing factor filtering
- `a2873d7` - fix: Handle type mismatch in pricing calculator validations
- `249bc9a` - fix: Fix selectedService lookup with loose equality
- (next commit) - fix: Fix remaining type mismatches in Calculator display

---

## Root Cause

json-server 1.0.0-beta.3 (auto-installed via `npx`) returns:
- Primary keys (`id`): as **strings** (e.g., `"1"`, `"2"`)
- Foreign keys (`service_id`, `factor_id`): as **numbers** (e.g., `1`, `2`)

This inconsistency breaks strict equality checks like `factor.id === selectedFactor.factor_id`.

---

**Last Updated:** November 29, 2025
