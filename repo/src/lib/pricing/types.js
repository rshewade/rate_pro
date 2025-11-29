/**
 * Type definitions and constants for the RatePro Pricing Engine
 */

/**
 * Price impact types that determine how a factor option affects the price
 * @readonly
 * @enum {string}
 */
export const PriceImpactType = {
  FIXED: 'fixed', // Add a fixed amount to the price
  PERCENTAGE: 'percentage', // Add a percentage of the base price
  MULTIPLIER: 'multiplier', // Multiply the running total
}

/**
 * @typedef {Object} Service
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} base_price
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} PricingFactor
 * @property {number} id
 * @property {number} service_id
 * @property {string} name
 * @property {string} description
 * @property {string} factor_type
 * @property {boolean} is_required
 * @property {number} display_order
 * @property {number|null} depends_on_factor_id
 * @property {number[]} depends_on_option_ids
 */

/**
 * @typedef {Object} FactorOption
 * @property {number} id
 * @property {number} factor_id
 * @property {string} label
 * @property {number} price_impact
 * @property {string} price_impact_type - 'fixed' | 'percentage' | 'multiplier'
 * @property {number} display_order
 */

/**
 * @typedef {Object} BusinessEntityType
 * @property {number} id
 * @property {string} name
 * @property {number} price_modifier
 * @property {string} modifier_type - typically 'multiplier'
 */

/**
 * @typedef {Object} Addon
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {boolean} is_global
 * @property {number[]} service_ids
 */

/**
 * @typedef {Object} SelectedFactor
 * @property {number} factor_id
 * @property {number} option_id
 */

/**
 * @typedef {Object} PriceBreakdown
 * @property {number} basePrice - Starting base price of the service
 * @property {number} fixedImpactsTotal - Sum of all fixed impacts
 * @property {number} percentageImpactsTotal - Sum of all percentage impacts
 * @property {number} subtotalBeforeMultipliers - Total before multipliers
 * @property {number} multiplierEffect - Combined multiplier value
 * @property {number} subtotalAfterMultipliers - Total after multipliers
 * @property {number} entityTypeMultiplier - Business entity type modifier
 * @property {number} subtotalAfterEntityType - Total after entity type modifier
 * @property {number} addonsTotal - Sum of all selected add-ons
 * @property {number} finalPrice - Final calculated price
 * @property {Array<{name: string, impact: number, type: string}>} factorDetails - Detailed breakdown per factor
 * @property {Array<{name: string, price: number}>} addonDetails - Detailed breakdown per addon
 */

/**
 * @typedef {Object} CalculationInput
 * @property {Service} service - The service being priced
 * @property {SelectedFactor[]} selectedFactors - Array of selected factor options
 * @property {FactorOption[]} factorOptions - All available factor options (for lookup)
 * @property {PricingFactor[]} pricingFactors - All pricing factors (for metadata)
 * @property {BusinessEntityType|null} entityType - Selected business entity type
 * @property {Addon[]} selectedAddons - Array of selected add-ons
 */

/**
 * @typedef {Object} CalculationResult
 * @property {number} totalPrice - Final calculated price
 * @property {PriceBreakdown} breakdown - Detailed price breakdown
 * @property {boolean} isValid - Whether the calculation was valid
 * @property {string[]} errors - Any validation errors
 * @property {string[]} warnings - Any warnings (non-blocking)
 */

export default {
  PriceImpactType,
}
