/**
 * Audit Trail Utilities
 * Handles logging of changes to quotes, pricing, and other entities
 */

import api from '@/services/api'

/**
 * Action types for audit logging
 */
export const AUDIT_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  STATUS_CHANGED: 'status_changed',
  DELETED: 'deleted',
  PRICE_CHANGED: 'price_changed',
  VERSION_CREATED: 'version_created',
}

/**
 * Entity types for audit logging
 */
export const ENTITY_TYPES = {
  QUOTE: 'quote',
  QUOTE_LINE_ITEM: 'quote_line_item',
  CUSTOMER: 'customer',
  SERVICE: 'service',
  PRICING_FACTOR: 'pricing_factor',
  FACTOR_OPTION: 'factor_option',
  ADDON: 'addon',
  ENTITY_TYPE: 'entity_type',
}

/**
 * Create an audit log entry
 * @param {Object} params - Audit log parameters
 * @param {string} params.entityType - Type of entity (quote, service, etc.)
 * @param {number|string} params.entityId - ID of the entity
 * @param {string} params.action - Action performed (created, updated, etc.)
 * @param {Object} params.changes - Object describing what changed
 * @param {string|null} params.userId - User ID (null for anonymous/system)
 * @param {Object|null} params.metadata - Additional metadata
 * @returns {Promise<Object>} Created audit log entry
 */
export async function createAuditLog({
  entityType,
  entityId,
  action,
  changes,
  userId = null,
  metadata = null,
}) {
  const entry = {
    entity_type: entityType,
    entity_id: entityId,
    action,
    changes,
    user_id: userId,
    metadata,
    timestamp: new Date().toISOString(),
  }

  try {
    return await api.auditLogs.create(entry)
  } catch (err) {
    console.error('Failed to create audit log:', err)
    // Don't throw - audit logging failure shouldn't break the main operation
    return null
  }
}

/**
 * Log quote creation
 * @param {Object} quote - The created quote
 * @param {string|null} userId - User ID
 */
export async function logQuoteCreated(quote, userId = null) {
  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quote.id,
    action: AUDIT_ACTIONS.CREATED,
    changes: {
      quote_number: quote.quote_number,
      customer_id: quote.customer_id,
      status: quote.status,
      total_price: quote.total_price,
    },
    userId,
  })
}

/**
 * Log quote status change
 * @param {Object} quote - The quote
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {string|null} userId - User ID
 */
export async function logQuoteStatusChange(quote, oldStatus, newStatus, userId = null) {
  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quote.id,
    action: AUDIT_ACTIONS.STATUS_CHANGED,
    changes: {
      status: { from: oldStatus, to: newStatus },
    },
    userId,
  })
}

/**
 * Log quote price change
 * @param {Object} quote - The quote
 * @param {number} oldPrice - Previous price
 * @param {number} newPrice - New price
 * @param {string|null} userId - User ID
 */
export async function logQuotePriceChange(quote, oldPrice, newPrice, userId = null) {
  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quote.id,
    action: AUDIT_ACTIONS.PRICE_CHANGED,
    changes: {
      total_price: { from: oldPrice, to: newPrice },
    },
    userId,
  })
}

/**
 * Log quote update with detailed changes
 * @param {Object} quote - The updated quote
 * @param {Object} oldQuote - The previous quote state
 * @param {string|null} userId - User ID
 */
export async function logQuoteUpdated(quote, oldQuote, userId = null) {
  const changes = {}

  // Track what changed
  if (oldQuote.status !== quote.status) {
    changes.status = { from: oldQuote.status, to: quote.status }
  }
  if (oldQuote.total_price !== quote.total_price) {
    changes.total_price = { from: oldQuote.total_price, to: quote.total_price }
  }
  if (oldQuote.expiration_date !== quote.expiration_date) {
    changes.expiration_date = { from: oldQuote.expiration_date, to: quote.expiration_date }
  }
  if (oldQuote.notes !== quote.notes) {
    changes.notes = { from: oldQuote.notes, to: quote.notes }
  }

  // Only log if there are actual changes
  if (Object.keys(changes).length === 0) {
    return null
  }

  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE,
    entityId: quote.id,
    action: AUDIT_ACTIONS.UPDATED,
    changes,
    userId,
  })
}

/**
 * Log quote version creation
 * @param {Object} newQuote - The new version quote
 * @param {Object} originalQuote - The original quote
 * @param {string|null} userId - User ID
 */
export async function logQuoteVersionCreated(newQuote, originalQuote, userId = null) {
  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE,
    entityId: newQuote.id,
    action: AUDIT_ACTIONS.VERSION_CREATED,
    changes: {
      quote_number: newQuote.quote_number,
      parent_quote_id: originalQuote.id,
      parent_quote_number: originalQuote.quote_number,
    },
    userId,
  })
}

/**
 * Log line item changes
 * @param {number} quoteId - Quote ID
 * @param {Object} lineItem - The line item
 * @param {string} action - Action performed
 * @param {Object} changes - What changed
 * @param {string|null} userId - User ID
 */
export async function logLineItemChange(quoteId, lineItem, action, changes, userId = null) {
  return createAuditLog({
    entityType: ENTITY_TYPES.QUOTE_LINE_ITEM,
    entityId: lineItem.id,
    action,
    changes: {
      ...changes,
      quote_id: quoteId,
    },
    userId,
  })
}

/**
 * Format audit log entry for display
 * @param {Object} entry - Audit log entry
 * @returns {Object} Formatted entry with display-friendly fields
 */
export function formatAuditEntry(entry) {
  const actionLabels = {
    [AUDIT_ACTIONS.CREATED]: 'Created',
    [AUDIT_ACTIONS.UPDATED]: 'Updated',
    [AUDIT_ACTIONS.STATUS_CHANGED]: 'Status Changed',
    [AUDIT_ACTIONS.DELETED]: 'Deleted',
    [AUDIT_ACTIONS.PRICE_CHANGED]: 'Price Changed',
    [AUDIT_ACTIONS.VERSION_CREATED]: 'Version Created',
  }

  const entityLabels = {
    [ENTITY_TYPES.QUOTE]: 'Quote',
    [ENTITY_TYPES.QUOTE_LINE_ITEM]: 'Line Item',
    [ENTITY_TYPES.CUSTOMER]: 'Customer',
    [ENTITY_TYPES.SERVICE]: 'Service',
    [ENTITY_TYPES.PRICING_FACTOR]: 'Pricing Factor',
    [ENTITY_TYPES.FACTOR_OPTION]: 'Factor Option',
    [ENTITY_TYPES.ADDON]: 'Add-on',
    [ENTITY_TYPES.ENTITY_TYPE]: 'Entity Type',
  }

  return {
    ...entry,
    actionLabel: actionLabels[entry.action] || entry.action,
    entityLabel: entityLabels[entry.entity_type] || entry.entity_type,
    formattedTimestamp: new Date(entry.timestamp).toLocaleString(),
    formattedDate: new Date(entry.timestamp).toLocaleDateString(),
    formattedTime: new Date(entry.timestamp).toLocaleTimeString(),
  }
}

/**
 * Get a human-readable description of changes
 * @param {Object} changes - The changes object
 * @returns {string} Human-readable description
 */
export function describeChanges(changes) {
  if (!changes || typeof changes !== 'object') {
    return 'No details available'
  }

  const descriptions = []

  for (const [key, value] of Object.entries(changes)) {
    const fieldName = key.replace(/_/g, ' ')

    if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
      // Change with from/to
      const fromVal = formatValue(value.from)
      const toVal = formatValue(value.to)
      descriptions.push(`${fieldName}: ${fromVal} → ${toVal}`)
    } else {
      // Simple value
      descriptions.push(`${fieldName}: ${formatValue(value)}`)
    }
  }

  return descriptions.join(', ')
}

/**
 * Format a value for display
 * @param {any} value - Value to format
 * @returns {string} Formatted value
 */
function formatValue(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}
