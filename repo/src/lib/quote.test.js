import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateQuoteNumber,
  calculateExpirationDate,
  formatExpirationDate,
  isQuoteExpired,
  validateCustomer,
  createQuoteFromCalculation,
} from './quote'

describe('Quote Utilities', () => {
  describe('generateQuoteNumber', () => {
    it('should generate first quote number for empty list', () => {
      const result = generateQuoteNumber([])
      const year = new Date().getFullYear()
      expect(result).toBe(`QT-${year}-0001`)
    })

    it('should generate sequential quote numbers', () => {
      const year = new Date().getFullYear()
      const existingQuotes = [
        { quote_number: `QT-${year}-0001` },
        { quote_number: `QT-${year}-0002` },
        { quote_number: `QT-${year}-0003` },
      ]
      const result = generateQuoteNumber(existingQuotes)
      expect(result).toBe(`QT-${year}-0004`)
    })

    it('should handle quotes from different years', () => {
      const year = new Date().getFullYear()
      const existingQuotes = [
        { quote_number: 'QT-2023-0050' },
        { quote_number: `QT-${year}-0005` },
      ]
      const result = generateQuoteNumber(existingQuotes)
      expect(result).toBe(`QT-${year}-0006`)
    })

    it('should handle quotes without quote_number', () => {
      const year = new Date().getFullYear()
      const existingQuotes = [
        { id: 1 },
        { quote_number: `QT-${year}-0002` },
      ]
      const result = generateQuoteNumber(existingQuotes)
      expect(result).toBe(`QT-${year}-0003`)
    })
  })

  describe('calculateExpirationDate', () => {
    it('should calculate default 30 day expiration', () => {
      const result = calculateExpirationDate()
      const expected = new Date()
      expected.setDate(expected.getDate() + 30)

      const resultDate = new Date(result)
      expect(resultDate.getDate()).toBe(expected.getDate())
      expect(resultDate.getMonth()).toBe(expected.getMonth())
    })

    it('should calculate custom expiration days', () => {
      const result = calculateExpirationDate(7)
      const expected = new Date()
      expected.setDate(expected.getDate() + 7)

      const resultDate = new Date(result)
      expect(resultDate.getDate()).toBe(expected.getDate())
    })
  })

  describe('formatExpirationDate', () => {
    it('should format date correctly', () => {
      const result = formatExpirationDate('2025-01-15T00:00:00Z')
      expect(result).toContain('January')
      expect(result).toContain('15')
      expect(result).toContain('2025')
    })

    it('should return N/A for null date', () => {
      expect(formatExpirationDate(null)).toBe('N/A')
    })

    it('should return N/A for undefined date', () => {
      expect(formatExpirationDate(undefined)).toBe('N/A')
    })
  })

  describe('isQuoteExpired', () => {
    it('should return true for past date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isQuoteExpired(pastDate.toISOString())).toBe(true)
    })

    it('should return false for future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isQuoteExpired(futureDate.toISOString())).toBe(false)
    })

    it('should return false for null date', () => {
      expect(isQuoteExpired(null)).toBe(false)
    })
  })

  describe('validateCustomer', () => {
    it('should pass validation for valid customer', () => {
      const customer = {
        company_name: 'Test Corp',
        contact_name: 'John Doe',
        email: 'john@test.com',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should fail validation for missing company name', () => {
      const customer = {
        company_name: '',
        contact_name: 'John Doe',
        email: 'john@test.com',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(false)
      expect(result.errors.company_name).toBeDefined()
    })

    it('should fail validation for missing contact name', () => {
      const customer = {
        company_name: 'Test Corp',
        contact_name: '',
        email: 'john@test.com',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(false)
      expect(result.errors.contact_name).toBeDefined()
    })

    it('should fail validation for missing email', () => {
      const customer = {
        company_name: 'Test Corp',
        contact_name: 'John Doe',
        email: '',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should fail validation for invalid email format', () => {
      const customer = {
        company_name: 'Test Corp',
        contact_name: 'John Doe',
        email: 'invalid-email',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toContain('valid email')
    })

    it('should fail validation for whitespace-only values', () => {
      const customer = {
        company_name: '   ',
        contact_name: '   ',
        email: '   ',
      }
      const result = validateCustomer(customer)
      expect(result.isValid).toBe(false)
      expect(result.errors.company_name).toBeDefined()
      expect(result.errors.contact_name).toBeDefined()
      expect(result.errors.email).toBeDefined()
    })
  })

  describe('createQuoteFromCalculation', () => {
    it('should create quote data structure', () => {
      const params = {
        customer: {
          company_name: 'Test Corp',
          contact_name: 'John',
          email: 'john@test.com',
          phone: '555-1234',
          notes: 'Test note',
        },
        service: { id: 1, base_price: 500, name: 'Bookkeeping' },
        selectedFactors: [{ factor_id: 1, option_id: 2 }],
        entityType: { id: 2, name: 'LLC' },
        selectedAddons: [{ id: 1, name: 'Expedited' }],
        calculationResult: { totalPrice: 750 },
        existingQuotes: [],
        expirationDays: 30,
      }

      const result = createQuoteFromCalculation(params)

      expect(result.quote.status).toBe('draft')
      expect(result.quote.total_price).toBe(750)
      expect(result.quote.quote_number).toMatch(/^QT-\d{4}-\d{4}$/)

      expect(result.lineItem.service_id).toBe(1)
      expect(result.lineItem.base_price).toBe(500)
      expect(result.lineItem.calculated_price).toBe(750)
      expect(result.lineItem.selected_factors).toHaveLength(1)
      expect(result.lineItem.selected_addons).toEqual([1])

      expect(result.customer.company_name).toBe('Test Corp')
      expect(result.customer.email).toBe('john@test.com')
    })
  })
})
