/**
 * Quote utility functions
 * Handles quote number generation, expiration dates, and validation
 */

/**
 * Generate a unique quote number
 * Format: QT-YYYY-NNNN (e.g., QT-2025-0001)
 * @param {Array} existingQuotes - Array of existing quotes to check for uniqueness
 * @returns {string} Unique quote number
 */
export function generateQuoteNumber(existingQuotes = []) {
  const year = new Date().getFullYear()
  const prefix = `QT-${year}-`

  // Find the highest existing number for this year
  let maxNumber = 0
  existingQuotes.forEach((quote) => {
    if (quote.quote_number && quote.quote_number.startsWith(prefix)) {
      const numPart = parseInt(quote.quote_number.replace(prefix, ''), 10)
      if (!isNaN(numPart) && numPart > maxNumber) {
        maxNumber = numPart
      }
    }
  })

  // Generate next number, padded to 4 digits
  const nextNumber = String(maxNumber + 1).padStart(4, '0')
  return `${prefix}${nextNumber}`
}

/**
 * Calculate default expiration date
 * @param {number} daysFromNow - Number of days until expiration (default: 30)
 * @returns {string} ISO date string for expiration
 */
export function calculateExpirationDate(daysFromNow = 30) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  // Set to end of day
  date.setHours(23, 59, 59, 999)
  return date.toISOString()
}

/**
 * Format expiration date for display
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date string
 */
export function formatExpirationDate(isoDate) {
  if (!isoDate) return 'N/A'
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Check if a quote has expired
 * @param {string} expirationDate - ISO date string
 * @returns {boolean} True if expired
 */
export function isQuoteExpired(expirationDate) {
  if (!expirationDate) return false
  return new Date(expirationDate) < new Date()
}

/**
 * Validate customer data
 * @param {Object} customer - Customer data object
 * @returns {Object} { isValid: boolean, errors: { field: message } }
 */
export function validateCustomer(customer) {
  const errors = {}

  if (!customer.company_name?.trim()) {
    errors.company_name = 'Company name is required'
  }

  if (!customer.contact_name?.trim()) {
    errors.contact_name = 'Contact name is required'
  }

  if (!customer.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.email = 'Please enter a valid email address'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Create a quote object from calculator state
 * @param {Object} params
 * @param {Object} params.customer - Customer data
 * @param {Object} params.service - Selected service
 * @param {Array} params.selectedFactors - Selected pricing factors
 * @param {Object} params.entityType - Selected entity type
 * @param {Array} params.selectedAddons - Selected add-ons
 * @param {Object} params.calculationResult - Price calculation result
 * @param {Array} params.existingQuotes - Existing quotes for number generation
 * @param {number} params.expirationDays - Days until expiration
 * @returns {Object} Quote and line item data ready for saving
 */
export function createQuoteFromCalculation({
  customer,
  service,
  selectedFactors,
  entityType,
  selectedAddons,
  calculationResult,
  existingQuotes = [],
  expirationDays = 30,
}) {
  const now = new Date().toISOString()
  const quoteNumber = generateQuoteNumber(existingQuotes)
  const expirationDate = calculateExpirationDate(expirationDays)

  // Create quote object
  const quote = {
    quote_number: quoteNumber,
    customer_id: null, // Will be set after customer is created
    status: 'draft',
    total_price: calculationResult.totalPrice,
    expiration_date: expirationDate,
    created_at: now,
    updated_at: now,
    notes: customer.notes || '',
  }

  // Create line item for the selected service
  const lineItem = {
    quote_id: null, // Will be set after quote is created
    service_id: service.id,
    base_price: service.base_price,
    calculated_price: calculationResult.totalPrice,
    entity_type_id: entityType?.id || null,
    selected_factors: selectedFactors.map((sf) => ({
      factor_id: sf.factor_id,
      option_id: sf.option_id,
    })),
    selected_addons: selectedAddons.map((a) => a.id),
  }

  // Customer data for creation
  const customerData = {
    company_name: customer.company_name,
    contact_name: customer.contact_name,
    email: customer.email,
    phone: customer.phone || '',
    entity_type_id: customer.entity_type_id || null,
    created_at: now,
  }

  return {
    quote,
    lineItem,
    customer: customerData,
  }
}

export default {
  generateQuoteNumber,
  calculateExpirationDate,
  formatExpirationDate,
  isQuoteExpired,
  validateCustomer,
  createQuoteFromCalculation,
}
