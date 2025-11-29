/**
 * RatePro Pricing Engine
 * Main entry point for the pricing calculation module
 */

export { PriceImpactType } from './types.js'

export {
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
} from './calculator.js'

// Re-export default as named export for convenience
export { default as PricingCalculator } from './calculator.js'
