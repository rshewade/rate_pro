import { useState, useEffect } from 'react'
import api from '@/services'

/**
 * Custom hook for fetching all calculator data from API
 */
export function useApiData() {
  const [data, setData] = useState({
    services: [],
    pricingFactors: [],
    factorOptions: [],
    entityTypes: [],
    addons: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch all data in parallel
        const [services, pricingFactors, factorOptions, entityTypes, addons] = await Promise.all([
          api.services.getAll(),
          api.pricingFactors.getAll(),
          api.factorOptions.getAll(),
          api.entityTypes.getAll(),
          api.addons.getAll(),
        ])

        setData({
          services: services.filter((s) => s.is_active !== false),
          pricingFactors,
          factorOptions,
          entityTypes: entityTypes.filter((e) => e.is_active !== false),
          addons: addons.filter((a) => a.is_active !== false),
        })
      } catch (err) {
        console.error('Failed to fetch calculator data:', err)
        setError(err.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    try {
      const [services, pricingFactors, factorOptions, entityTypes, addons] = await Promise.all([
        api.services.getAll(),
        api.pricingFactors.getAll(),
        api.factorOptions.getAll(),
        api.entityTypes.getAll(),
        api.addons.getAll(),
      ])

      setData({
        services: services.filter((s) => s.is_active !== false),
        pricingFactors,
        factorOptions,
        entityTypes: entityTypes.filter((e) => e.is_active !== false),
        addons: addons.filter((a) => a.is_active !== false),
      })
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ...data,
    isLoading,
    error,
    refetch,
  }
}

export default useApiData
