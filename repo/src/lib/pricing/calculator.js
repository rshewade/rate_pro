/**
 * RatePro Pricing Calculation Engine
 *
 * Implements the hybrid pricing model with the following calculation order:
 * 1. Start with base_price from service
 * 2. Add all 'fixed' impacts
 * 3. Add 'percentage' impacts (based on base_price only)
 * 4. Apply 'multiplier' impacts (to the running total)
 * 5. Apply entity type modifier (multiplier)
 * 6. Add fixed-price add-ons
 */

import { PriceImpactType } from './types.js'

/**
 * Round to 2 decimal places for currency
 * @param {number} value
 * @returns {number}
 */
function roundCurrency(value) {
  return Math.round(value * 100) / 100
}

/**
 * Get the base price from a service
 * @param {import('./types.js').Service} service
 * @returns {number}
 */
export function getBasePrice(service) {
  if (!service || typeof service.base_price !== 'number') {
    throw new Error('Invalid service: base_price is required')
  }
  return service.base_price
}

/**
 * Calculate the sum of all fixed impacts from selected factor options
 * Also handles boolean factors (value-based) with fixed price impact
 * @param {import('./types.js').SelectedFactor[]} selectedFactors
 * @param {import('./types.js').FactorOption[]} factorOptions
 * @param {import('./types.js').PricingFactor[]} pricingFactors
 * @returns {{total: number, details: Array<{factorId: number, factorName: string, optionLabel: string, impact: number}>}}
 */
export function calculateFixedImpacts(selectedFactors, factorOptions, pricingFactors) {
  let total = 0
  const details = []

  for (const selected of selectedFactors) {
    const factor = pricingFactors.find((f) => f.id == selected.factor_id)
    const factorType = factor?.factor_type || 'select'

    // Handle select type factors (option-based)
    if (factorType === 'select' && selected.option_id) {
      // Use == for comparison to handle string/number type differences from json-server
      const option = factorOptions.find((o) => o.id == selected.option_id)
      if (!option) continue

      if (option.price_impact_type === PriceImpactType.FIXED) {
        total += option.price_impact
        details.push({
          factorId: selected.factor_id,
          factorName: factor?.name || 'Unknown',
          optionLabel: option.label,
          impact: option.price_impact,
        })
      }
    }

    // Handle boolean type factors (value-based)
    // If checked (value === true), look for an "Enabled" option with price_impact
    if (factorType === 'boolean' && selected.value === true) {
      const enabledOption = factorOptions.find(
        (o) => o.factor_id == selected.factor_id && o.label === 'Enabled'
      )
      if (enabledOption && enabledOption.price_impact_type === PriceImpactType.FIXED) {
        const impact = enabledOption.price_impact || 0
        if (impact !== 0) {
          total += impact
          details.push({
            factorId: selected.factor_id,
            factorName: factor?.name || 'Unknown',
            optionLabel: 'Yes',
            impact: impact,
          })
        }
      }
    }

    // Handle number type factors (value × unit_price from "Unit" option)
    if (factorType === 'number' && selected.value !== null && selected.value !== undefined) {
      const unitOption = factorOptions.find(
        (o) => o.factor_id == selected.factor_id && o.label === 'Unit'
      )
      if (unitOption && unitOption.price_impact) {
        const quantity = Number(selected.value) || 0
        const impact = quantity * unitOption.price_impact
        if (impact !== 0) {
          total += impact
          details.push({
            factorId: selected.factor_id,
            factorName: factor?.name || 'Unknown',
            optionLabel: `${quantity} × £${unitOption.price_impact}`,
            impact: roundCurrency(impact),
          })
        }
      }
    }
  }

  return { total: roundCurrency(total), details }
}

/**
 * Calculate the sum of all percentage impacts based on the base price
 * Only applies to select-type factors with option_id
 * @param {number} basePrice
 * @param {import('./types.js').SelectedFactor[]} selectedFactors
 * @param {import('./types.js').FactorOption[]} factorOptions
 * @param {import('./types.js').PricingFactor[]} pricingFactors
 * @returns {{total: number, details: Array<{factorId: number, factorName: string, optionLabel: string, percentage: number, impact: number}>}}
 */
export function calculatePercentageImpacts(
  basePrice,
  selectedFactors,
  factorOptions,
  pricingFactors
) {
  let total = 0
  const details = []

  for (const selected of selectedFactors) {
    // Skip non-select factors (boolean/number don't use percentage impacts from options)
    if (!selected.option_id) continue

    // Use == for comparison to handle string/number type differences from json-server
    const option = factorOptions.find((o) => o.id == selected.option_id)
    if (!option) continue

    if (option.price_impact_type === PriceImpactType.PERCENTAGE) {
      const factor = pricingFactors.find((f) => f.id == selected.factor_id)
      // price_impact is stored as a decimal (e.g., 0.1 for 10%)
      const impact = basePrice * option.price_impact
      total += impact
      details.push({
        factorId: selected.factor_id,
        factorName: factor?.name || 'Unknown',
        optionLabel: option.label,
        percentage: option.price_impact * 100,
        impact: roundCurrency(impact),
      })
    }
  }

  return { total: roundCurrency(total), details }
}

/**
 * Calculate the combined multiplier from all multiplier impacts
 * Multipliers are applied sequentially (multiplied together)
 * Only applies to select-type factors with option_id
 * @param {import('./types.js').SelectedFactor[]} selectedFactors
 * @param {import('./types.js').FactorOption[]} factorOptions
 * @param {import('./types.js').PricingFactor[]} pricingFactors
 * @returns {{combinedMultiplier: number, details: Array<{factorId: number, factorName: string, optionLabel: string, multiplier: number}>}}
 */
export function calculateMultiplierImpacts(selectedFactors, factorOptions, pricingFactors) {
  let combinedMultiplier = 1.0
  const details = []

  for (const selected of selectedFactors) {
    // Skip non-select factors (boolean/number don't use multiplier impacts from options)
    if (!selected.option_id) continue

    // Use == for comparison to handle string/number type differences from json-server
    const option = factorOptions.find((o) => o.id == selected.option_id)
    if (!option) continue

    if (option.price_impact_type === PriceImpactType.MULTIPLIER) {
      const factor = pricingFactors.find((f) => f.id == selected.factor_id)
      combinedMultiplier *= option.price_impact
      details.push({
        factorId: selected.factor_id,
        factorName: factor?.name || 'Unknown',
        optionLabel: option.label,
        multiplier: option.price_impact,
      })
    }
  }

  return { combinedMultiplier: roundCurrency(combinedMultiplier * 1000) / 1000, details }
}

/**
 * Apply entity type modifier to the price
 * @param {number} price
 * @param {import('./types.js').BusinessEntityType|null} entityType
 * @returns {{modifiedPrice: number, multiplier: number, entityName: string|null}}
 */
export function applyEntityTypeModifier(price, entityType) {
  if (!entityType) {
    return {
      modifiedPrice: price,
      multiplier: 1.0,
      entityName: null,
    }
  }

  const multiplier = entityType.price_modifier || 1.0
  return {
    modifiedPrice: roundCurrency(price * multiplier),
    multiplier,
    entityName: entityType.name,
  }
}

/**
 * Calculate the total price of selected add-ons
 * @param {import('./types.js').Addon[]} selectedAddons
 * @returns {{total: number, details: Array<{addonId: number, name: string, price: number}>}}
 */
export function calculateAddonsTotal(selectedAddons) {
  let total = 0
  const details = []

  for (const addon of selectedAddons) {
    total += addon.price
    details.push({
      addonId: addon.id,
      name: addon.name,
      price: addon.price,
    })
  }

  return { total: roundCurrency(total), details }
}

/**
 * Main pricing calculation function
 * Executes the full pricing calculation pipeline
 *
 * @param {import('./types.js').CalculationInput} input
 * @returns {import('./types.js').CalculationResult}
 */
export function calculatePrice(input) {
  const {
    service,
    selectedFactors = [],
    factorOptions = [],
    pricingFactors = [],
    entityType = null,
    selectedAddons = [],
  } = input

  const errors = []
  const warnings = []
  const factorDetails = []
  const addonDetails = []

  // Validate input
  if (!service) {
    errors.push('Service is required')
    return {
      totalPrice: 0,
      breakdown: createEmptyBreakdown(),
      isValid: false,
      errors,
      warnings,
    }
  }

  try {
    // Step 1: Get base price
    const basePrice = getBasePrice(service)

    // Step 2: Calculate fixed impacts
    const fixedResult = calculateFixedImpacts(selectedFactors, factorOptions, pricingFactors)
    fixedResult.details.forEach((d) => {
      factorDetails.push({
        name: `${d.factorName}: ${d.optionLabel}`,
        impact: d.impact,
        type: 'fixed',
      })
    })

    // Step 3: Calculate percentage impacts (based on base price only)
    const percentageResult = calculatePercentageImpacts(
      basePrice,
      selectedFactors,
      factorOptions,
      pricingFactors
    )
    percentageResult.details.forEach((d) => {
      factorDetails.push({
        name: `${d.factorName}: ${d.optionLabel} (${d.percentage}%)`,
        impact: d.impact,
        type: 'percentage',
      })
    })

    // Subtotal before multipliers
    const subtotalBeforeMultipliers = roundCurrency(
      basePrice + fixedResult.total + percentageResult.total
    )

    // Step 4: Calculate and apply multiplier impacts
    const multiplierResult = calculateMultiplierImpacts(
      selectedFactors,
      factorOptions,
      pricingFactors
    )
    multiplierResult.details.forEach((d) => {
      factorDetails.push({
        name: `${d.factorName}: ${d.optionLabel} (×${d.multiplier})`,
        impact: d.multiplier,
        type: 'multiplier',
      })
    })

    const subtotalAfterMultipliers = roundCurrency(
      subtotalBeforeMultipliers * multiplierResult.combinedMultiplier
    )

    // Step 5: Apply entity type modifier
    const entityResult = applyEntityTypeModifier(subtotalAfterMultipliers, entityType)
    const subtotalAfterEntityType = entityResult.modifiedPrice

    if (entityResult.entityName) {
      factorDetails.push({
        name: `Entity Type: ${entityResult.entityName} (×${entityResult.multiplier})`,
        impact: entityResult.multiplier,
        type: 'entity_multiplier',
      })
    }

    // Step 6: Add fixed-price add-ons
    const addonsResult = calculateAddonsTotal(selectedAddons)
    addonsResult.details.forEach((d) => {
      addonDetails.push({
        name: d.name,
        price: d.price,
      })
    })

    const finalPrice = roundCurrency(subtotalAfterEntityType + addonsResult.total)

    // Build breakdown
    const breakdown = {
      basePrice,
      fixedImpactsTotal: fixedResult.total,
      percentageImpactsTotal: percentageResult.total,
      subtotalBeforeMultipliers,
      multiplierEffect: multiplierResult.combinedMultiplier,
      subtotalAfterMultipliers,
      entityTypeMultiplier: entityResult.multiplier,
      subtotalAfterEntityType,
      addonsTotal: addonsResult.total,
      finalPrice,
      factorDetails,
      addonDetails,
    }

    return {
      totalPrice: finalPrice,
      breakdown,
      isValid: true,
      errors,
      warnings,
    }
  } catch (error) {
    errors.push(error.message)
    return {
      totalPrice: 0,
      breakdown: createEmptyBreakdown(),
      isValid: false,
      errors,
      warnings,
    }
  }
}

/**
 * Create an empty breakdown object for error cases
 * @returns {import('./types.js').PriceBreakdown}
 */
function createEmptyBreakdown() {
  return {
    basePrice: 0,
    fixedImpactsTotal: 0,
    percentageImpactsTotal: 0,
    subtotalBeforeMultipliers: 0,
    multiplierEffect: 1,
    subtotalAfterMultipliers: 0,
    entityTypeMultiplier: 1,
    subtotalAfterEntityType: 0,
    addonsTotal: 0,
    finalPrice: 0,
    factorDetails: [],
    addonDetails: [],
  }
}

/**
 * Validate that all required factors have been selected
 * @param {import('./types.js').PricingFactor[]} pricingFactors - All factors for the service
 * @param {import('./types.js').SelectedFactor[]} selectedFactors - User's selections
 * @returns {{isValid: boolean, missingFactors: string[]}}
 */
export function validateRequiredFactors(pricingFactors, selectedFactors) {
  // Use String for comparison to handle type differences from json-server
  const selectedFactorIds = new Set(selectedFactors.map((sf) => String(sf.factor_id)))
  const missingFactors = []

  for (const factor of pricingFactors) {
    if (factor.is_required && !selectedFactorIds.has(String(factor.id))) {
      missingFactors.push(factor.name)
    }
  }

  return {
    isValid: missingFactors.length === 0,
    missingFactors,
  }
}

/**
 * Check for circular dependencies in factor dependencies
 * @param {import('./types.js').PricingFactor[]} pricingFactors
 * @returns {{hasCircular: boolean, circularPath: number[]}}
 */
export function detectCircularDependencies(pricingFactors) {
  const visited = new Set()
  const recursionStack = new Set()

  function dfs(factorId, path) {
    if (recursionStack.has(factorId)) {
      return { hasCircular: true, circularPath: [...path, factorId] }
    }

    if (visited.has(factorId)) {
      return { hasCircular: false, circularPath: [] }
    }

    visited.add(factorId)
    recursionStack.add(factorId)

    const factor = pricingFactors.find((f) => f.id == factorId)
    if (factor?.depends_on_factor_id) {
      const result = dfs(factor.depends_on_factor_id, [...path, factorId])
      if (result.hasCircular) {
        return result
      }
    }

    recursionStack.delete(factorId)
    return { hasCircular: false, circularPath: [] }
  }

  for (const factor of pricingFactors) {
    const result = dfs(factor.id, [])
    if (result.hasCircular) {
      return result
    }
  }

  return { hasCircular: false, circularPath: [] }
}

/**
 * Check if a factor should be visible based on its dependencies
 * @param {import('./types.js').PricingFactor} factor
 * @param {import('./types.js').SelectedFactor[]} selectedFactors
 * @returns {boolean}
 */
export function isFactorVisible(factor, selectedFactors) {
  // No dependency means always visible
  if (!factor.depends_on_factor_id) {
    return true
  }

  // Check if the dependent factor has one of the required options selected
  const dependentSelection = selectedFactors.find(
    (sf) => sf.factor_id === factor.depends_on_factor_id
  )

  if (!dependentSelection) {
    return false
  }

  // If no specific options are required, just check if the factor is selected
  if (!factor.depends_on_option_ids || factor.depends_on_option_ids.length === 0) {
    return true
  }

  // Check if one of the required options is selected
  return factor.depends_on_option_ids.includes(dependentSelection.option_id)
}

/**
 * Get visible factors based on current selections
 * @param {import('./types.js').PricingFactor[]} pricingFactors
 * @param {import('./types.js').SelectedFactor[]} selectedFactors
 * @returns {import('./types.js').PricingFactor[]}
 */
export function getVisibleFactors(pricingFactors, selectedFactors) {
  return pricingFactors.filter((factor) => isFactorVisible(factor, selectedFactors))
}

export default {
  calculatePrice,
  getBasePrice,
  calculateFixedImpacts,
  calculatePercentageImpacts,
  calculateMultiplierImpacts,
  applyEntityTypeModifier,
  calculateAddonsTotal,
  validateRequiredFactors,
  detectCircularDependencies,
  isFactorVisible,
  getVisibleFactors,
}
