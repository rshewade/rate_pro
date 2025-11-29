import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { Calculator, Play, RotateCcw, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { calculatePrice } from '@/lib/pricing/calculator'
import { getVisibleFactors, evaluateDependencyCondition } from '@/lib/dependencies'

export function TestCalculator({
  services,
  pricingFactors,
  factorOptions,
  entityTypes,
  addons,
  dependencies,
}) {
  const [selectedService, setSelectedService] = React.useState(null)
  const [selectedEntityType, setSelectedEntityType] = React.useState(null)
  const [selectedOptions, setSelectedOptions] = React.useState({})
  const [selectedAddons, setSelectedAddons] = React.useState([])
  const [calculationResult, setCalculationResult] = React.useState(null)
  const [showDependencyInfo, setShowDependencyInfo] = React.useState(true)

  // Get factors for selected service
  const serviceFactors = React.useMemo(() => {
    if (!selectedService) return []
    return pricingFactors
      .filter(f => f.service_id === selectedService.id)
      .sort((a, b) => a.display_order - b.display_order)
  }, [selectedService, pricingFactors])

  // Get visible factors based on dependencies
  const visibleFactors = React.useMemo(() => {
    if (!dependencies || dependencies.length === 0) return serviceFactors
    return getVisibleFactors(serviceFactors, dependencies, selectedOptions)
  }, [serviceFactors, dependencies, selectedOptions])

  // Get hidden factors for display
  const hiddenFactors = React.useMemo(() => {
    return serviceFactors.filter(f => !visibleFactors.includes(f))
  }, [serviceFactors, visibleFactors])

  // Get available addons for selected service
  const availableAddons = React.useMemo(() => {
    if (!selectedService) return []
    return addons.filter(
      a => a.is_global || (a.service_ids && a.service_ids.includes(selectedService.id))
    )
  }, [selectedService, addons])

  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === Number(serviceId))
    setSelectedService(service)
    setSelectedOptions({})
    setSelectedAddons([])
    setCalculationResult(null)
  }

  const handleEntityTypeChange = (entityTypeId) => {
    const entityType = entityTypes.find(e => e.id === Number(entityTypeId))
    setSelectedEntityType(entityType)
    setCalculationResult(null)
  }

  const handleOptionChange = (factorId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [factorId]: Number(optionId),
    }))
    setCalculationResult(null)
  }

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
    setCalculationResult(null)
  }

  const handleCalculate = () => {
    if (!selectedService) return

    // Build selected factors array (only visible factors)
    const selectedFactorsArr = visibleFactors
      .filter(f => selectedOptions[f.id])
      .map(f => ({
        factor_id: f.id,
        option_id: selectedOptions[f.id],
      }))

    // Get the selected option objects
    const selectedFactorOptions = selectedFactorsArr.map(sf => {
      const option = factorOptions.find(o => o.id === sf.option_id)
      return option
    }).filter(Boolean)

    // Get selected addon objects
    const selectedAddonObjs = addons.filter(a => selectedAddons.includes(a.id))

    const result = calculatePrice({
      basePrice: selectedService.base_price,
      selectedFactors: selectedFactorOptions,
      entityType: selectedEntityType,
      selectedAddons: selectedAddonObjs,
    })

    setCalculationResult({
      ...result,
      service: selectedService,
      entityType: selectedEntityType,
      factors: selectedFactorsArr.map(sf => {
        const factor = pricingFactors.find(f => f.id === sf.factor_id)
        const option = factorOptions.find(o => o.id === sf.option_id)
        return { factor, option }
      }),
      addons: selectedAddonObjs,
      hiddenFactors: hiddenFactors,
    })
  }

  const handleReset = () => {
    setSelectedService(null)
    setSelectedEntityType(null)
    setSelectedOptions({})
    setSelectedAddons([])
    setCalculationResult(null)
  }

  // Check if required factors are selected
  const missingRequired = visibleFactors.filter(
    f => f.is_required && !selectedOptions[f.id]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Test Calculator
          </h3>
          <p className="text-sm text-muted-foreground">
            Test pricing calculations and dependency rules
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDependencyInfo(!showDependencyInfo)}
            className="gap-2"
          >
            {showDependencyInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDependencyInfo ? 'Hide' : 'Show'} Dependencies
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={selectedService ? String(selectedService.id) : ''}
                onValueChange={handleServiceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {services.filter(s => s.is_active).map(service => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name} (${service.base_price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entity Type Selection */}
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select
                value={selectedEntityType ? String(selectedEntityType.id) : ''}
                onValueChange={handleEntityTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type..." />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map(et => (
                    <SelectItem key={et.id} value={String(et.id)}>
                      {et.name} ({et.price_modifier}x)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Factor Selections */}
            {selectedService && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-base">Pricing Factors</Label>

                  {/* Visible Factors */}
                  {visibleFactors.map(factor => {
                    const options = factorOptions.filter(o => o.factor_id === factor.id)
                    return (
                      <div key={factor.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">
                            {factor.name}
                            {factor.is_required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Visible
                          </Badge>
                        </div>
                        <Select
                          value={selectedOptions[factor.id] ? String(selectedOptions[factor.id]) : ''}
                          onValueChange={(value) => handleOptionChange(factor.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${factor.name.toLowerCase()}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map(option => (
                              <SelectItem key={option.id} value={String(option.id)}>
                                {option.label} ({option.price_impact_type === 'multiplier'
                                  ? `${option.price_impact}x`
                                  : `+$${option.price_impact}`})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}

                  {/* Hidden Factors (dependency info) */}
                  {showDependencyInfo && hiddenFactors.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <Label className="text-sm text-muted-foreground">
                        Hidden by Dependencies
                      </Label>
                      {hiddenFactors.map(factor => {
                        const deps = dependencies.filter(d => d.factor_id === factor.id)
                        return (
                          <div
                            key={factor.id}
                            className="bg-gray-50 rounded-md p-3 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{factor.name}</span>
                            </div>
                            {deps.map(dep => {
                              const depFactor = pricingFactors.find(f => f.id === dep.depends_on_factor_id)
                              return (
                                <p key={dep.id} className="text-xs text-muted-foreground mt-1 ml-6">
                                  Requires: {depFactor?.name} - {dep.description || dep.condition_type}
                                </p>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                {availableAddons.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-base">Add-ons</Label>
                      <div className="space-y-2">
                        {availableAddons.map(addon => (
                          <label
                            key={addon.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAddons.includes(addon.id)}
                              onChange={() => handleAddonToggle(addon.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className="text-sm">
                              {addon.name} (+${addon.price})
                            </span>
                            {addon.is_global && (
                              <Badge variant="secondary" className="text-xs">
                                Global
                              </Badge>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Calculate Button */}
            <div className="pt-4">
              <Button
                onClick={handleCalculate}
                disabled={!selectedService || missingRequired.length > 0}
                className="w-full gap-2"
              >
                <Play className="h-4 w-4" />
                Calculate Price
              </Button>
              {missingRequired.length > 0 && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Missing required: {missingRequired.map(f => f.name).join(', ')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!calculationResult ? (
              <div className="text-center text-muted-foreground py-12">
                <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Configure options and click Calculate</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Price ({calculationResult.service.name})</span>
                    <span>${calculationResult.basePrice.toLocaleString()}</span>
                  </div>

                  {calculationResult.factors.map(({ factor, option }) => (
                    <div key={factor.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {factor.name}: {option.label}
                      </span>
                      <span>
                        {option.price_impact_type === 'multiplier'
                          ? `×${option.price_impact}`
                          : `+$${option.price_impact.toLocaleString()}`}
                      </span>
                    </div>
                  ))}

                  {calculationResult.entityType && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Entity: {calculationResult.entityType.name}
                      </span>
                      <span>×{calculationResult.entityType.price_modifier}</span>
                    </div>
                  )}

                  {calculationResult.addons.map(addon => (
                    <div key={addon.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Add-on: {addon.name}
                      </span>
                      <span>+${addon.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>${calculationResult.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Add-ons Total</span>
                    <span>${calculationResult.addonsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${calculationResult.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Dependency Info */}
                {showDependencyInfo && calculationResult.hiddenFactors.length > 0 && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <p className="font-medium mb-2">Factors Hidden by Dependencies:</p>
                      <ul className="text-muted-foreground space-y-1">
                        {calculationResult.hiddenFactors.map(f => (
                          <li key={f.id} className="flex items-center gap-2">
                            <EyeOff className="h-3 w-3" />
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TestCalculator
