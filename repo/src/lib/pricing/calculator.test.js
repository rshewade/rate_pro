import { describe, it, expect } from 'vitest'
import {
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

// Test fixtures
const mockService = {
  id: 1,
  name: 'Bookkeeping',
  description: 'Monthly bookkeeping services',
  base_price: 500,
  is_active: true,
}

const mockPricingFactors = [
  {
    id: 1,
    service_id: 1,
    name: 'Monthly Transactions',
    factor_type: 'select',
    is_required: true,
    display_order: 1,
    depends_on_factor_id: null,
    depends_on_option_ids: [],
  },
  {
    id: 2,
    service_id: 1,
    name: 'Complexity Level',
    factor_type: 'select',
    is_required: true,
    display_order: 2,
    depends_on_factor_id: null,
    depends_on_option_ids: [],
  },
  {
    id: 3,
    service_id: 1,
    name: 'Advanced Reporting',
    factor_type: 'select',
    is_required: false,
    display_order: 3,
    depends_on_factor_id: 2,
    depends_on_option_ids: [7], // Only visible when "Complex" is selected
  },
]

const mockFactorOptions = [
  // Monthly Transactions options (fixed impacts)
  { id: 1, factor_id: 1, label: '0-50 transactions', price_impact: 0, price_impact_type: 'fixed' },
  {
    id: 2,
    factor_id: 1,
    label: '51-150 transactions',
    price_impact: 150,
    price_impact_type: 'fixed',
  },
  {
    id: 3,
    factor_id: 1,
    label: '151-300 transactions',
    price_impact: 300,
    price_impact_type: 'fixed',
  },
  // Complexity Level options (multipliers)
  { id: 5, factor_id: 2, label: 'Standard', price_impact: 1.0, price_impact_type: 'multiplier' },
  { id: 6, factor_id: 2, label: 'Moderate', price_impact: 1.2, price_impact_type: 'multiplier' },
  { id: 7, factor_id: 2, label: 'Complex', price_impact: 1.5, price_impact_type: 'multiplier' },
  // Advanced Reporting options (percentage)
  {
    id: 8,
    factor_id: 3,
    label: 'Basic Reports',
    price_impact: 0.1,
    price_impact_type: 'percentage',
  },
  {
    id: 9,
    factor_id: 3,
    label: 'Advanced Reports',
    price_impact: 0.2,
    price_impact_type: 'percentage',
  },
]

const mockEntityTypes = [
  { id: 1, name: 'Sole Proprietorship', price_modifier: 1.0, modifier_type: 'multiplier' },
  { id: 2, name: 'LLC', price_modifier: 1.1, modifier_type: 'multiplier' },
  { id: 3, name: 'S-Corporation', price_modifier: 1.2, modifier_type: 'multiplier' },
  { id: 4, name: 'C-Corporation', price_modifier: 1.3, modifier_type: 'multiplier' },
]

const mockAddons = [
  { id: 1, name: 'Expedited Service', price: 100, is_global: true },
  { id: 2, name: 'Dedicated Account Manager', price: 150, is_global: true },
  { id: 5, name: 'Financial Reporting Package', price: 250, is_global: false },
]

describe('Pricing Calculator', () => {
  describe('getBasePrice', () => {
    it('should return the base price from a service', () => {
      expect(getBasePrice(mockService)).toBe(500)
    })

    it('should throw error for invalid service', () => {
      expect(() => getBasePrice(null)).toThrow('Invalid service')
      expect(() => getBasePrice({})).toThrow('Invalid service')
    })
  })

  describe('calculateFixedImpacts', () => {
    it('should calculate total of fixed impacts', () => {
      const selectedFactors = [{ factor_id: 1, option_id: 3 }] // 151-300 transactions = +$300
      const result = calculateFixedImpacts(selectedFactors, mockFactorOptions, mockPricingFactors)
      expect(result.total).toBe(300)
      expect(result.details).toHaveLength(1)
      expect(result.details[0].impact).toBe(300)
    })

    it('should return zero for no fixed impacts', () => {
      const selectedFactors = [{ factor_id: 2, option_id: 6 }] // Multiplier, not fixed
      const result = calculateFixedImpacts(selectedFactors, mockFactorOptions, mockPricingFactors)
      expect(result.total).toBe(0)
    })

    it('should sum multiple fixed impacts', () => {
      const selectedFactors = [
        { factor_id: 1, option_id: 2 }, // +$150
        { factor_id: 1, option_id: 3 }, // +$300 (simulating multiple selections for test)
      ]
      // Note: In practice, only one option per factor, but testing summation
      const result = calculateFixedImpacts(selectedFactors, mockFactorOptions, mockPricingFactors)
      expect(result.total).toBe(450)
    })
  })

  describe('calculatePercentageImpacts', () => {
    it('should calculate percentage of base price', () => {
      const basePrice = 500
      const selectedFactors = [{ factor_id: 3, option_id: 8 }] // 10% = $50
      const result = calculatePercentageImpacts(
        basePrice,
        selectedFactors,
        mockFactorOptions,
        mockPricingFactors
      )
      expect(result.total).toBe(50)
    })

    it('should calculate multiple percentages based on base price only', () => {
      const basePrice = 500
      const selectedFactors = [
        { factor_id: 3, option_id: 8 }, // 10% = $50
        { factor_id: 3, option_id: 9 }, // 20% = $100
      ]
      const result = calculatePercentageImpacts(
        basePrice,
        selectedFactors,
        mockFactorOptions,
        mockPricingFactors
      )
      expect(result.total).toBe(150) // Both based on base $500, not cumulative
    })
  })

  describe('calculateMultiplierImpacts', () => {
    it('should return combined multiplier', () => {
      const selectedFactors = [{ factor_id: 2, option_id: 6 }] // 1.2x
      const result = calculateMultiplierImpacts(
        selectedFactors,
        mockFactorOptions,
        mockPricingFactors
      )
      expect(result.combinedMultiplier).toBe(1.2)
    })

    it('should multiply multiple multipliers together', () => {
      const selectedFactors = [
        { factor_id: 2, option_id: 6 }, // 1.2x
        { factor_id: 2, option_id: 7 }, // 1.5x (simulating for test)
      ]
      const result = calculateMultiplierImpacts(
        selectedFactors,
        mockFactorOptions,
        mockPricingFactors
      )
      expect(result.combinedMultiplier).toBe(1.8) // 1.2 * 1.5
    })

    it('should return 1.0 when no multipliers selected', () => {
      const selectedFactors = [{ factor_id: 1, option_id: 2 }] // Fixed, not multiplier
      const result = calculateMultiplierImpacts(
        selectedFactors,
        mockFactorOptions,
        mockPricingFactors
      )
      expect(result.combinedMultiplier).toBe(1.0)
    })
  })

  describe('applyEntityTypeModifier', () => {
    it('should apply entity type multiplier', () => {
      const result = applyEntityTypeModifier(1000, mockEntityTypes[3]) // C-Corp 1.3x
      expect(result.modifiedPrice).toBe(1300)
      expect(result.multiplier).toBe(1.3)
      expect(result.entityName).toBe('C-Corporation')
    })

    it('should return unchanged price when no entity type', () => {
      const result = applyEntityTypeModifier(1000, null)
      expect(result.modifiedPrice).toBe(1000)
      expect(result.multiplier).toBe(1.0)
    })
  })

  describe('calculateAddonsTotal', () => {
    it('should sum addon prices', () => {
      const result = calculateAddonsTotal(mockAddons)
      expect(result.total).toBe(500) // 100 + 150 + 250
      expect(result.details).toHaveLength(3)
    })

    it('should return zero for no addons', () => {
      const result = calculateAddonsTotal([])
      expect(result.total).toBe(0)
    })
  })

  describe('calculatePrice - Full Integration', () => {
    it('should calculate complete price with all components', () => {
      const input = {
        service: mockService,
        selectedFactors: [
          { factor_id: 1, option_id: 3 }, // 151-300 transactions: +$300 fixed
          { factor_id: 2, option_id: 6 }, // Moderate complexity: 1.2x multiplier
        ],
        factorOptions: mockFactorOptions,
        pricingFactors: mockPricingFactors,
        entityType: mockEntityTypes[1], // LLC: 1.1x
        selectedAddons: [mockAddons[0]], // Expedited: +$100
      }

      const result = calculatePrice(input)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      // Calculation breakdown:
      // Base: $500
      // Fixed: +$300 = $800
      // Percentage: $0
      // Subtotal before multipliers: $800
      // Multiplier (1.2x): $800 * 1.2 = $960
      // Entity type (1.1x): $960 * 1.1 = $1056
      // Addons: +$100 = $1156
      expect(result.breakdown.basePrice).toBe(500)
      expect(result.breakdown.fixedImpactsTotal).toBe(300)
      expect(result.breakdown.subtotalBeforeMultipliers).toBe(800)
      expect(result.breakdown.multiplierEffect).toBe(1.2)
      expect(result.breakdown.subtotalAfterMultipliers).toBe(960)
      expect(result.breakdown.entityTypeMultiplier).toBe(1.1)
      expect(result.breakdown.subtotalAfterEntityType).toBe(1056)
      expect(result.breakdown.addonsTotal).toBe(100)
      expect(result.totalPrice).toBe(1156)
    })

    it('should handle base price only (no factors, no addons)', () => {
      const input = {
        service: mockService,
        selectedFactors: [],
        factorOptions: mockFactorOptions,
        pricingFactors: mockPricingFactors,
        entityType: null,
        selectedAddons: [],
      }

      const result = calculatePrice(input)
      expect(result.totalPrice).toBe(500)
      expect(result.breakdown.basePrice).toBe(500)
    })

    it('should return error for missing service', () => {
      const result = calculatePrice({
        service: null,
        selectedFactors: [],
        factorOptions: [],
        pricingFactors: [],
        entityType: null,
        selectedAddons: [],
      })

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Service is required')
      expect(result.totalPrice).toBe(0)
    })

    it('should calculate correctly with percentage impacts', () => {
      const input = {
        service: mockService, // Base: $500
        selectedFactors: [
          { factor_id: 3, option_id: 9 }, // 20% = $100
        ],
        factorOptions: mockFactorOptions,
        pricingFactors: mockPricingFactors,
        entityType: null,
        selectedAddons: [],
      }

      const result = calculatePrice(input)

      // Base: $500
      // Percentage: +$100 (20% of $500)
      // Total: $600
      expect(result.breakdown.basePrice).toBe(500)
      expect(result.breakdown.percentageImpactsTotal).toBe(100)
      expect(result.totalPrice).toBe(600)
    })
  })

  describe('validateRequiredFactors', () => {
    it('should return valid when all required factors selected', () => {
      const selectedFactors = [
        { factor_id: 1, option_id: 1 },
        { factor_id: 2, option_id: 5 },
      ]
      const result = validateRequiredFactors(mockPricingFactors, selectedFactors)
      expect(result.isValid).toBe(true)
      expect(result.missingFactors).toHaveLength(0)
    })

    it('should return invalid with missing required factors', () => {
      const selectedFactors = [{ factor_id: 1, option_id: 1 }] // Missing factor 2
      const result = validateRequiredFactors(mockPricingFactors, selectedFactors)
      expect(result.isValid).toBe(false)
      expect(result.missingFactors).toContain('Complexity Level')
    })
  })

  describe('detectCircularDependencies', () => {
    it('should detect no circular dependencies in valid factors', () => {
      const result = detectCircularDependencies(mockPricingFactors)
      expect(result.hasCircular).toBe(false)
    })

    it('should detect circular dependency', () => {
      const circularFactors = [
        { id: 1, depends_on_factor_id: 2 },
        { id: 2, depends_on_factor_id: 3 },
        { id: 3, depends_on_factor_id: 1 }, // Creates cycle: 1 -> 2 -> 3 -> 1
      ]
      const result = detectCircularDependencies(circularFactors)
      expect(result.hasCircular).toBe(true)
      expect(result.circularPath.length).toBeGreaterThan(0)
    })
  })

  describe('isFactorVisible', () => {
    it('should return true for factor with no dependency', () => {
      const factor = mockPricingFactors[0] // No dependency
      expect(isFactorVisible(factor, [])).toBe(true)
    })

    it('should return false when dependent factor not selected', () => {
      const factor = mockPricingFactors[2] // Depends on factor 2
      const selectedFactors = [{ factor_id: 1, option_id: 1 }]
      expect(isFactorVisible(factor, selectedFactors)).toBe(false)
    })

    it('should return true when correct dependent option selected', () => {
      const factor = mockPricingFactors[2] // Depends on factor 2, option 7
      const selectedFactors = [{ factor_id: 2, option_id: 7 }]
      expect(isFactorVisible(factor, selectedFactors)).toBe(true)
    })

    it('should return false when wrong dependent option selected', () => {
      const factor = mockPricingFactors[2] // Depends on factor 2, option 7
      const selectedFactors = [{ factor_id: 2, option_id: 5 }] // Wrong option
      expect(isFactorVisible(factor, selectedFactors)).toBe(false)
    })
  })

  describe('getVisibleFactors', () => {
    it('should return only visible factors', () => {
      const selectedFactors = [{ factor_id: 2, option_id: 5 }] // Standard complexity
      const visible = getVisibleFactors(mockPricingFactors, selectedFactors)
      expect(visible).toHaveLength(2) // Factor 1 and 2 visible, not 3
      expect(visible.find((f) => f.id === 3)).toBeUndefined()
    })

    it('should include dependent factor when condition met', () => {
      const selectedFactors = [{ factor_id: 2, option_id: 7 }] // Complex - enables factor 3
      const visible = getVisibleFactors(mockPricingFactors, selectedFactors)
      expect(visible).toHaveLength(3) // All factors visible
      expect(visible.find((f) => f.id === 3)).toBeDefined()
    })
  })
})

describe('Pricing Calculation Edge Cases', () => {
  it('should handle zero base price', () => {
    const result = calculatePrice({
      service: { ...mockService, base_price: 0 },
      selectedFactors: [],
      factorOptions: [],
      pricingFactors: [],
      entityType: null,
      selectedAddons: [mockAddons[0]], // $100 addon
    })
    expect(result.totalPrice).toBe(100)
  })

  it('should handle very large numbers', () => {
    const result = calculatePrice({
      service: { ...mockService, base_price: 1000000 },
      selectedFactors: [{ factor_id: 2, option_id: 7 }], // 1.5x
      factorOptions: mockFactorOptions,
      pricingFactors: mockPricingFactors,
      entityType: mockEntityTypes[3], // 1.3x
      selectedAddons: [],
    })
    expect(result.totalPrice).toBe(1950000) // 1M * 1.5 * 1.3
  })

  it('should round to 2 decimal places', () => {
    const result = calculatePrice({
      service: { ...mockService, base_price: 333.33 },
      selectedFactors: [{ factor_id: 2, option_id: 6 }], // 1.2x
      factorOptions: mockFactorOptions,
      pricingFactors: mockPricingFactors,
      entityType: null,
      selectedAddons: [],
    })
    expect(result.totalPrice).toBe(400) // 333.33 * 1.2 = 399.996 -> 400
  })
})
