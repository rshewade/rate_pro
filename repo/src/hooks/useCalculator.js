import { useState, useMemo, useCallback } from 'react'
import { calculatePrice, validateRequiredFactors, getVisibleFactors } from '@/lib/pricing'

/**
 * Custom hook for managing calculator state and calculations
 * @param {Object} params
 * @param {Array} params.services - Available services
 * @param {Array} params.pricingFactors - All pricing factors
 * @param {Array} params.factorOptions - All factor options
 * @param {Array} params.entityTypes - Business entity types
 * @param {Array} params.addons - Available add-ons
 */
export function useCalculator({
  services = [],
  pricingFactors = [],
  factorOptions = [],
  entityTypes = [],
  addons = [],
}) {
  // State
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [selectedFactors, setSelectedFactors] = useState([])
  const [selectedEntityTypeId, setSelectedEntityTypeId] = useState(null)
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [validationErrors, setValidationErrors] = useState([])

  // Derived data
  const selectedService = useMemo(() => {
    // Use == for comparison to handle string/number type differences from json-server
    return services.find((s) => s.id == selectedServiceId) || null
  }, [services, selectedServiceId])

  const serviceFactors = useMemo(() => {
    // Use == for comparison to handle string/number type differences from json-server
    return pricingFactors.filter((f) => f.service_id == selectedServiceId)
  }, [pricingFactors, selectedServiceId])

  const serviceFactorOptions = useMemo(() => {
    const factorIds = serviceFactors.map((f) => String(f.id))
    // Use String comparison to handle type differences from json-server
    return factorOptions.filter((o) => factorIds.includes(String(o.factor_id)))
  }, [factorOptions, serviceFactors])

  const selectedEntityType = useMemo(() => {
    // Use == for comparison to handle string/number type differences from json-server
    return entityTypes.find((e) => e.id == selectedEntityTypeId) || null
  }, [entityTypes, selectedEntityTypeId])

  // Filter addons to show only global ones and service-specific ones for selected service
  const availableAddons = useMemo(() => {
    if (!selectedServiceId) return []
    return addons.filter((addon) => {
      // Global addons are available for all services
      if (addon.is_global) return true
      // Service-specific addons must include the selected service
      if (addon.service_ids && addon.service_ids.includes(selectedServiceId)) return true
      return false
    })
  }, [addons, selectedServiceId])

  const selectedAddons = useMemo(() => {
    return addons.filter((a) => selectedAddonIds.includes(a.id))
  }, [addons, selectedAddonIds])

  // Visible factors based on dependencies
  const visibleFactors = useMemo(() => {
    return getVisibleFactors(serviceFactors, selectedFactors)
  }, [serviceFactors, selectedFactors])

  // Calculate price
  const calculationResult = useMemo(() => {
    if (!selectedService) {
      return {
        totalPrice: 0,
        breakdown: null,
        isValid: false,
        errors: [],
        warnings: [],
      }
    }

    return calculatePrice({
      service: selectedService,
      selectedFactors,
      factorOptions: serviceFactorOptions,
      pricingFactors: serviceFactors,
      entityType: selectedEntityType,
      selectedAddons,
    })
  }, [
    selectedService,
    selectedFactors,
    serviceFactorOptions,
    serviceFactors,
    selectedEntityType,
    selectedAddons,
  ])

  // Validate required factors
  const validation = useMemo(() => {
    if (!selectedService) {
      return { isValid: false, missingFactors: [] }
    }
    return validateRequiredFactors(visibleFactors, selectedFactors)
  }, [selectedService, visibleFactors, selectedFactors])

  // Handle service selection
  const handleServiceSelect = useCallback((serviceId) => {
    setSelectedServiceId(serviceId)
    // Reset factors when service changes
    setSelectedFactors([])
    setSelectedAddonIds([])
    setValidationErrors([])
  }, [])

  // Handle factor change with dependency reset
  const handleFactorChange = useCallback(
    (factorId, optionId) => {
      setSelectedFactors((prev) => {
        // Remove existing selection for this factor
        const filtered = prev.filter((sf) => sf.factor_id !== factorId)

        // Add new selection if optionId is provided
        if (optionId !== null) {
          return [...filtered, { factor_id: factorId, option_id: optionId }]
        }

        return filtered
      })

      // Find factors that depend on this one and reset them
      const dependentFactors = serviceFactors.filter((f) => f.depends_on_factor_id === factorId)

      if (dependentFactors.length > 0) {
        setSelectedFactors((prev) => {
          const dependentIds = dependentFactors.map((f) => f.id)
          return prev.filter((sf) => !dependentIds.includes(sf.factor_id))
        })
      }

      // Clear validation error for this factor
      setValidationErrors((prev) => prev.filter((id) => id !== factorId))
    },
    [serviceFactors]
  )

  // Handle entity type change
  const handleEntityTypeChange = useCallback((entityTypeId) => {
    setSelectedEntityTypeId(entityTypeId)
  }, [])

  // Handle addon toggle
  const handleAddonToggle = useCallback((addonId) => {
    setSelectedAddonIds((prev) => {
      if (prev.includes(addonId)) {
        return prev.filter((id) => id !== addonId)
      }
      return [...prev, addonId]
    })
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    const missingFactorIds = visibleFactors
      .filter((f) => f.is_required && !selectedFactors.find((sf) => sf.factor_id === f.id))
      .map((f) => f.id)

    setValidationErrors(missingFactorIds)
    return missingFactorIds.length === 0
  }, [visibleFactors, selectedFactors])

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setSelectedServiceId(null)
    setSelectedFactors([])
    setSelectedEntityTypeId(null)
    setSelectedAddonIds([])
    setValidationErrors([])
  }, [])

  return {
    // State
    selectedServiceId,
    selectedService,
    selectedFactors,
    selectedEntityTypeId,
    selectedEntityType,
    selectedAddonIds,
    selectedAddons,
    validationErrors,

    // Derived data
    serviceFactors,
    serviceFactorOptions,
    visibleFactors,
    availableAddons,
    calculationResult,
    validation,

    // Actions
    handleServiceSelect,
    handleFactorChange,
    handleEntityTypeChange,
    handleAddonToggle,
    validateForm,
    resetCalculator,
  }
}

export default useCalculator
