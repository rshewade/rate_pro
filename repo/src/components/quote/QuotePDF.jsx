import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register a clean font (using default for now)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#030213',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#030213',
  },
  logoSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  quoteInfo: {
    textAlign: 'right',
  },
  quoteNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#030213',
  },
  quoteDate: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#030213',
    padding: '4 8',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#030213',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 120,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#030213',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCol1: {
    flex: 2,
  },
  tableCol2: {
    flex: 1,
    textAlign: 'right',
  },
  tableCol3: {
    flex: 1,
    textAlign: 'right',
  },
  lineItemDetails: {
    marginTop: 4,
    paddingLeft: 10,
    fontSize: 9,
    color: '#666',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#030213',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    width: 150,
    textAlign: 'right',
    paddingRight: 20,
    color: '#666',
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#030213',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 9,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  notes: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 10,
    fontSize: 9,
  },
  expirationWarning: {
    color: '#c00',
    fontWeight: 'bold',
  },
})

/**
 * QuotePDF - PDF document for quote export
 */
export function QuotePDF({
  quote,
  customer,
  lineItems,
  services,
  entityTypes,
  pricingFactors,
  factorOptions,
  addons,
}) {
  const getServiceName = (serviceId) => {
    const service = services?.find((s) => s.id === serviceId)
    return service?.name || 'Unknown Service'
  }

  const getEntityTypeName = (entityTypeId) => {
    const entity = entityTypes?.find((e) => e.id === entityTypeId)
    return entity?.name || 'N/A'
  }

  const getFactorName = (factorId) => {
    const factor = pricingFactors?.find((f) => f.id === factorId)
    return factor?.name || 'Unknown'
  }

  const getFactorOptionLabel = (optionId) => {
    const option = factorOptions?.find((o) => o.id === optionId)
    return option?.label || 'N/A'
  }

  // Get display value for a selected factor (handles select, boolean, number types)
  const getFactorDisplayValue = (sf) => {
    // Use == for comparison to handle string/number type differences
    const factor = pricingFactors?.find((f) => f.id == sf.factor_id)
    const factorType = factor?.factor_type || 'select'

    // Check if this is a value-based factor (has 'value' property instead of 'option_id')
    const hasValue = sf.value !== null && sf.value !== undefined

    if (factorType === 'select' && !hasValue) {
      return getFactorOptionLabel(sf.option_id)
    } else if (factorType === 'boolean' || (hasValue && typeof sf.value === 'boolean')) {
      // Handle both boolean true/false and string "true"/"false"
      const boolVal = sf.value === true || sf.value === 'true'
      const isFalse = sf.value === false || sf.value === 'false'
      return boolVal ? 'Yes' : isFalse ? 'No' : 'N/A'
    } else if (factorType === 'number' || (hasValue && !isNaN(Number(sf.value)))) {
      return hasValue ? String(sf.value) : 'N/A'
    }
    // Fallback: try option_id lookup
    if (sf.option_id) {
      return getFactorOptionLabel(sf.option_id)
    }
    return 'N/A'
  }

  const getAddonName = (addonId) => {
    const addon = addons?.find((a) => a.id === addonId)
    return addon?.name || 'Unknown'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isExpired = quote?.expiration_date && new Date(quote.expiration_date) < new Date()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>RatePro</Text>
            <Text style={styles.logoSubtitle}>Professional Pricing Solutions</Text>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteNumber}>{quote?.quote_number || 'DRAFT'}</Text>
            <Text style={styles.quoteDate}>Date: {formatDate(quote?.created_at)}</Text>
            <Text style={styles.status}>
              {(quote?.status || 'draft').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Company:</Text>
            <Text style={styles.value}>{customer?.company_name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{customer?.contact_name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{customer?.email || 'N/A'}</Text>
          </View>
          {customer?.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{customer.phone}</Text>
            </View>
          )}
          {customer?.entity_type_id && (
            <View style={styles.row}>
              <Text style={styles.label}>Entity Type:</Text>
              <Text style={styles.value}>{getEntityTypeName(customer.entity_type_id)}</Text>
            </View>
          )}
        </View>

        {/* Quote Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Valid Until:</Text>
            <Text style={[styles.value, isExpired && styles.expirationWarning]}>
              {formatDate(quote?.expiration_date)} {isExpired && '(EXPIRED)'}
            </Text>
          </View>
        </View>

        {/* Line Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services & Pricing</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCol1}>Service</Text>
              <Text style={styles.tableCol2}>Base Price</Text>
              <Text style={styles.tableCol3}>Total</Text>
            </View>
            {lineItems?.map((item, index) => (
              <View key={index}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCol1}>{getServiceName(item.service_id)}</Text>
                  <Text style={styles.tableCol2}>£{item.base_price?.toLocaleString()}</Text>
                  <Text style={styles.tableCol3}>£{item.calculated_price?.toLocaleString()}</Text>
                </View>
                {/* Factor Details */}
                {item.selected_factors?.length > 0 && (
                  <View style={styles.lineItemDetails}>
                    {item.selected_factors.map((sf, i) => (
                      <Text key={i}>
                        • {getFactorName(sf.factor_id)}: {getFactorDisplayValue(sf)}
                      </Text>
                    ))}
                  </View>
                )}
                {/* Addon Details */}
                {item.selected_addon_ids?.length > 0 && (
                  <View style={styles.lineItemDetails}>
                    <Text>Add-ons: {item.selected_addon_ids.map(id => getAddonName(id)).join(', ')}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>TOTAL:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              £{quote?.total_price?.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {quote?.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notes}>
              <Text>{quote.notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This quote is valid until {formatDate(quote?.expiration_date)}.</Text>
          <Text>Prices are estimates and may vary based on specific requirements.</Text>
          <Text style={{ marginTop: 5 }}>© {new Date().getFullYear()} RatePro - Professional Pricing Solutions</Text>
        </View>
      </Page>
    </Document>
  )
}

export default QuotePDF
