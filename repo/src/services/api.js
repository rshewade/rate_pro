/**
 * API Service - Abstracts all API calls for the RatePro application
 * In Phase 1, this connects to json-server. In Phase 2, this will connect to Supabase.
 */

const API_BASE_URL = '/api'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Services API
export const servicesApi = {
  getAll: () => fetchApi('/services'),
  getById: (id) => fetchApi(`/services/${id}`),
  create: (data) => fetchApi('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/services/${id}`, { method: 'DELETE' }),
}

// Pricing Factors API
export const pricingFactorsApi = {
  getAll: () => fetchApi('/pricing_factors'),
  getByServiceId: (serviceId) => fetchApi(`/pricing_factors?service_id=${serviceId}`),
  getById: (id) => fetchApi(`/pricing_factors/${id}`),
  create: (data) => fetchApi('/pricing_factors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/pricing_factors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/pricing_factors/${id}`, { method: 'DELETE' }),
}

// Factor Options API
export const factorOptionsApi = {
  getAll: () => fetchApi('/factor_options'),
  getByFactorId: (factorId) => fetchApi(`/factor_options?factor_id=${factorId}`),
  getById: (id) => fetchApi(`/factor_options/${id}`),
  create: (data) => fetchApi('/factor_options', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/factor_options/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/factor_options/${id}`, { method: 'DELETE' }),
}

// Business Entity Types API
export const entityTypesApi = {
  getAll: () => fetchApi('/business_entity_types'),
  getById: (id) => fetchApi(`/business_entity_types/${id}`),
  create: (data) => fetchApi('/business_entity_types', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/business_entity_types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/business_entity_types/${id}`, { method: 'DELETE' }),
}

// Add-ons API
export const addonsApi = {
  getAll: () => fetchApi('/addons'),
  getGlobal: () => fetchApi('/addons?is_global=true'),
  getByServiceId: (serviceId) => fetchApi(`/addons?service_ids_like=${serviceId}`),
  create: (data) => fetchApi('/addons', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/addons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/addons/${id}`, { method: 'DELETE' }),
}

// Quotes API
export const quotesApi = {
  getAll: () => fetchApi('/quotes'),
  getById: (id) => fetchApi(`/quotes/${id}`),
  create: (data) => fetchApi('/quotes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchApi(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/quotes/${id}`, { method: 'DELETE' }),
}

// Customers API
export const customersApi = {
  getAll: () => fetchApi('/customers'),
  getById: (id) => fetchApi(`/customers/${id}`),
  create: (data) => fetchApi('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// Quote Line Items API
export const quoteLineItemsApi = {
  getByQuoteId: (quoteId) => fetchApi(`/quote_line_items?quote_id=${quoteId}`),
  create: (data) => fetchApi('/quote_line_items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchApi(`/quote_line_items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchApi(`/quote_line_items/${id}`, { method: 'DELETE' }),
}

export default {
  services: servicesApi,
  pricingFactors: pricingFactorsApi,
  factorOptions: factorOptionsApi,
  entityTypes: entityTypesApi,
  addons: addonsApi,
  quotes: quotesApi,
  customers: customersApi,
  quoteLineItems: quoteLineItemsApi,
}
