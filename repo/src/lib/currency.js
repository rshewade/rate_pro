/**
 * Centralized Currency Configuration for RatePro
 * Single source of truth for currency formatting across the application
 */

export const CURRENCY_CODE = 'GBP'
export const CURRENCY_SYMBOL = '£'
export const CURRENCY_LOCALE = 'en-GB'

/**
 * Format a number as GBP currency
 * @param {number} amount - The amount to format
 * @param {Object} options - Optional formatting options
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns {string} Formatted currency string (e.g., "£1,234.56")
 */
export function formatCurrency(amount, options = {}) {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options

  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

/**
 * Format currency with consistent 2 decimal places
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyPrecise(amount) {
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format currency as whole numbers (no decimals)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyWhole(amount) {
  return formatCurrency(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Format currency for display in inputs (just the number without symbol)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyInput(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return ''
  return amount.toFixed(2)
}

/**
 * Parse currency input string to number
 * @param {string} input
 * @returns {number}
 */
export function parseCurrencyInput(input) {
  if (!input) return 0
  const cleaned = String(input).replace(/[£$,\s]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export default {
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  CURRENCY_LOCALE,
  formatCurrency,
  formatCurrencyPrecise,
  formatCurrencyWhole,
  formatCurrencyInput,
  parseCurrencyInput,
}
