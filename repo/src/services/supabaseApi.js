/**
 * Supabase API Service - Direct Supabase client integration
 * Provides the same interface as api.js but uses Supabase instead of json-server
 */

import { supabase } from '../lib/supabase'

// Helper to handle Supabase responses
function handleResponse({ data, error, status, statusText }) {
  if (error) {
    // Provide more helpful error messages
    if (error.code === '42501' || error.message.includes('permission denied')) {
      throw new Error('Permission denied. Write operations require authentication. Please check RLS policies in Supabase.')
    }
    if (error.message.includes('Cannot coerce')) {
      throw new Error('Database write failed. This may be due to RLS policies blocking anonymous writes. Please enable public write access in Supabase or authenticate users.')
    }
    throw new Error(error.message)
  }
  return data
}

// Helper for single record operations that handles empty results
function handleSingleResponse({ data, error, status, statusText }) {
  if (error) {
    if (error.code === '42501' || error.message.includes('permission denied')) {
      throw new Error('Permission denied. Write operations require authentication.')
    }
    if (error.code === 'PGRST116' || error.message.includes('Cannot coerce')) {
      throw new Error('No record was returned. This may be due to RLS policies blocking the operation.')
    }
    throw new Error(error.message)
  }
  // Handle case where data is an array (when .single() fails silently)
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('No record was created/updated. Check RLS policies.')
    }
    return data[0]
  }
  return data
}

// Services API
export const servicesApi = {
  getAll: async () => {
    const result = await supabase
      .from('services')
      .select('*')
      .order('display_order')
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('services')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('services')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Pricing Factors API
export const pricingFactorsApi = {
  getAll: async () => {
    const result = await supabase
      .from('pricing_factors')
      .select('*')
      .order('display_order')
    return handleResponse(result)
  },
  getByServiceId: async (serviceId) => {
    const result = await supabase
      .from('pricing_factors')
      .select('*')
      .eq('service_id', serviceId)
      .order('display_order')
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('pricing_factors')
      .select('*')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('pricing_factors')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('pricing_factors')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('pricing_factors')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Factor Options API
export const factorOptionsApi = {
  getAll: async () => {
    const result = await supabase
      .from('factor_options')
      .select('*')
      .order('display_order')
    return handleResponse(result)
  },
  getByFactorId: async (factorId) => {
    const result = await supabase
      .from('factor_options')
      .select('*')
      .eq('factor_id', factorId)
      .order('display_order')
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('factor_options')
      .select('*')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('factor_options')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('factor_options')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('factor_options')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Business Entity Types API
export const entityTypesApi = {
  getAll: async () => {
    const result = await supabase
      .from('business_entity_types')
      .select('*')
      .order('display_order')
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('business_entity_types')
      .select('*')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('business_entity_types')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('business_entity_types')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('business_entity_types')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Add-ons API
export const addonsApi = {
  getAll: async () => {
    const result = await supabase
      .from('addons')
      .select('*')
      .order('display_order')
    return handleResponse(result)
  },
  getGlobal: async () => {
    const result = await supabase
      .from('addons')
      .select('*')
      .eq('is_global', true)
      .order('display_order')
    return handleResponse(result)
  },
  getByServiceId: async (serviceId) => {
    // Get global addons + service-specific addons via junction table
    const [globalResult, serviceResult] = await Promise.all([
      supabase.from('addons').select('*').eq('is_global', true),
      supabase.from('service_addons')
        .select('addon_id, addons(*)')
        .eq('service_id', serviceId)
    ])

    const globalAddons = globalResult.data || []
    const serviceAddons = (serviceResult.data || []).map(sa => sa.addons)

    // Combine and dedupe
    const allAddons = [...globalAddons, ...serviceAddons]
    const uniqueAddons = allAddons.filter((addon, index, self) =>
      index === self.findIndex(a => a.id === addon.id)
    )

    return uniqueAddons
  },
  create: async (data) => {
    const { service_ids, ...addonData } = data
    const result = await supabase
      .from('addons')
      .insert(addonData)
      .select()

    const addon = handleSingleResponse(result)

    // Create service associations if not global
    if (!addonData.is_global && service_ids?.length > 0) {
      await supabase.from('service_addons').insert(
        service_ids.map(serviceId => ({ service_id: serviceId, addon_id: addon.id }))
      )
    }

    return addon
  },
  update: async (id, data) => {
    const { service_ids, ...addonData } = data
    const result = await supabase
      .from('addons')
      .update(addonData)
      .eq('id', id)
      .select()

    const addon = handleSingleResponse(result)

    // Update service associations
    if (service_ids !== undefined) {
      await supabase.from('service_addons').delete().eq('addon_id', id)
      if (!addonData.is_global && service_ids?.length > 0) {
        await supabase.from('service_addons').insert(
          service_ids.map(serviceId => ({ service_id: serviceId, addon_id: id }))
        )
      }
    }

    return addon
  },
  delete: async (id) => {
    const result = await supabase
      .from('addons')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Quotes API
export const quotesApi = {
  getAll: async () => {
    const result = await supabase
      .from('quotes')
      .select('*, customers(company_name, contact_name)')
      .order('created_at', { ascending: false })
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('quotes')
      .select('*, customers(*)')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('quotes')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('quotes')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Customers API
export const customersApi = {
  getAll: async () => {
    const result = await supabase
      .from('customers')
      .select('*')
      .order('company_name')
    return handleResponse(result)
  },
  getById: async (id) => {
    const result = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('customers')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
}

// Quote Line Items API
export const quoteLineItemsApi = {
  getByQuoteId: async (quoteId) => {
    const result = await supabase
      .from('quote_line_items')
      .select('*, services(name)')
      .eq('quote_id', quoteId)
      .order('display_order')
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('quote_line_items')
      .insert(data)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('quote_line_items')
      .update(data)
      .eq('id', id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (id) => {
    const result = await supabase
      .from('quote_line_items')
      .delete()
      .eq('id', id)
    return handleResponse(result)
  },
}

// Factor Dependencies API (stored in pricing_factors table in Supabase)
export const factorDependenciesApi = {
  getAll: async () => {
    const result = await supabase
      .from('pricing_factors')
      .select('id, depends_on_factor_id, depends_on_option_ids')
      .not('depends_on_factor_id', 'is', null)

    const factors = handleResponse(result)
    // Transform to match existing format
    return factors.map(f => ({
      factor_id: f.id,
      depends_on_factor_id: f.depends_on_factor_id,
      condition_value: f.depends_on_option_ids || [],
    }))
  },
  getByFactorId: async (factorId) => {
    const result = await supabase
      .from('pricing_factors')
      .select('id, depends_on_factor_id, depends_on_option_ids')
      .eq('id', factorId)
      .single()

    const factor = handleResponse(result)
    if (!factor.depends_on_factor_id) return []

    return [{
      factor_id: factor.id,
      depends_on_factor_id: factor.depends_on_factor_id,
      condition_value: factor.depends_on_option_ids || [],
    }]
  },
  create: async (data) => {
    // Update the pricing_factor with dependency info
    const result = await supabase
      .from('pricing_factors')
      .update({
        depends_on_factor_id: data.depends_on_factor_id,
        depends_on_option_ids: data.condition_value || [],
      })
      .eq('id', data.factor_id)
      .select()
    return handleSingleResponse(result)
  },
  update: async (id, data) => {
    const result = await supabase
      .from('pricing_factors')
      .update({
        depends_on_factor_id: data.depends_on_factor_id,
        depends_on_option_ids: data.condition_value || [],
      })
      .eq('id', data.factor_id || id)
      .select()
    return handleSingleResponse(result)
  },
  delete: async (factorId) => {
    const result = await supabase
      .from('pricing_factors')
      .update({
        depends_on_factor_id: null,
        depends_on_option_ids: [],
      })
      .eq('id', factorId)
    return handleResponse(result)
  },
}

// Audit Logs API
export const auditLogsApi = {
  getAll: async () => {
    const result = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    return handleResponse(result)
  },
  getByEntityType: async (entityType) => {
    const result = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false })
      .limit(100)
    return handleResponse(result)
  },
  getByEntityId: async (entityType, entityId) => {
    const result = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
    return handleResponse(result)
  },
  create: async (data) => {
    const result = await supabase
      .from('audit_logs')
      .insert({
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        action: data.action,
        changes: data.changes,
      })
      .select()
    return handleSingleResponse(result)
  },
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
  factorDependencies: factorDependenciesApi,
  auditLogs: auditLogsApi,
}
