/**
 * Unified API Service
 * Automatically switches between Supabase (production) and json-server (development)
 * based on environment configuration.
 */

import { isSupabaseConfigured } from '../lib/supabase'
import * as jsonServerApi from './api'
import * as supabaseApiModule from './supabaseApi'

// Determine which API to use
const useSupabase = isSupabaseConfigured()

// Log which backend is being used (development only)
if (import.meta.env.DEV) {
  console.log(`🔌 API Backend: ${useSupabase ? 'Supabase' : 'json-server'}`)
}

// Export the appropriate API based on configuration
export const servicesApi = useSupabase
  ? supabaseApiModule.servicesApi
  : jsonServerApi.servicesApi

export const pricingFactorsApi = useSupabase
  ? supabaseApiModule.pricingFactorsApi
  : jsonServerApi.pricingFactorsApi

export const factorOptionsApi = useSupabase
  ? supabaseApiModule.factorOptionsApi
  : jsonServerApi.factorOptionsApi

export const entityTypesApi = useSupabase
  ? supabaseApiModule.entityTypesApi
  : jsonServerApi.entityTypesApi

export const addonsApi = useSupabase
  ? supabaseApiModule.addonsApi
  : jsonServerApi.addonsApi

export const quotesApi = useSupabase
  ? supabaseApiModule.quotesApi
  : jsonServerApi.quotesApi

export const customersApi = useSupabase
  ? supabaseApiModule.customersApi
  : jsonServerApi.customersApi

export const quoteLineItemsApi = useSupabase
  ? supabaseApiModule.quoteLineItemsApi
  : jsonServerApi.quoteLineItemsApi

export const factorDependenciesApi = useSupabase
  ? supabaseApiModule.factorDependenciesApi
  : jsonServerApi.factorDependenciesApi

export const auditLogsApi = useSupabase
  ? supabaseApiModule.auditLogsApi
  : jsonServerApi.auditLogsApi

// Default export
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

// Export utility to check backend type
export const getBackendType = () => useSupabase ? 'supabase' : 'json-server'
