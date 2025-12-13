import * as React from 'react'
import { useApiData } from '@/hooks/useApiData'
import { useCalculator } from '@/hooks/useCalculator'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Label } from '@/components/ui/Label'
import { Separator } from '@/components/ui/Separator'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { SaveQuoteDialog } from '@/components/quote'
import { CURRENCY_SYMBOL } from '@/lib/currency'
import { AlertCircle, RefreshCw, Calculator as CalcIcon, Download, Save, X, Edit } from 'lucide-react'

/**
 * Main Calculator Component
 * Clean, form-based pricing calculator matching the design reference
 */
export function Calculator({ editQuoteData, onCancelEdit, onQuoteUpdated }) {
  const isEditMode = !!editQuoteData
  const { services, pricingFactors, factorOptions, entityTypes, addons, isLoading, error, refetch } =
    useApiData()

  const {
    selectedServiceId,
    selectedService,
    selectedFactors,
    selectedEntityTypeId,
    selectedEntityType,
    selectedAddonIds,
    selectedAddons,
    serviceFactorOptions,
    visibleFactors,
    availableAddons,
    calculationResult,
    validation,
    handleServiceSelect,
    handleFactorChange,
    handleEntityTypeChange,
    handleAddonToggle,
    validateForm,
  } = useCalculator({
    services,
    pricingFactors,
    factorOptions,
    entityTypes,
    addons,
    initialQuoteData: editQuoteData,
  })

  const [showResult, setShowResult] = React.useState(false)
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)

  const handleCalculatePrice = () => {
    if (validateForm()) {
      setShowResult(true)
    }
  }

  const getSelectedOptionId = (factorId) => {
    // Use == for comparison to handle string/number type differences
    const selection = selectedFactors.find((sf) => sf.factor_id == factorId)
    return selection?.option_id ? String(selection.option_id) : ''
  }

  const getSelectedValue = (factorId) => {
    const selection = selectedFactors.find((sf) => sf.factor_id == factorId)
    return selection?.value
  }

  // Helper to get display value for any factor type (select, boolean, number)
  const getFactorDisplayValue = (factor) => {
    const selection = selectedFactors.find((sf) => sf.factor_id == factor.id)
    if (!selection) return 'N/A'

    const factorType = factor.factor_type || 'select'
    const hasValue = selection.value !== null && selection.value !== undefined

    if (factorType === 'select' && !hasValue) {
      // Lookup option label
      const option = serviceFactorOptions.find((o) => o.id == selection.option_id)
      return option?.label || 'N/A'
    } else if (factorType === 'boolean' || (hasValue && typeof selection.value === 'boolean')) {
      // Handle both boolean true/false and string "true"/"false"
      const boolVal = selection.value === true || selection.value === 'true'
      const isFalse = selection.value === false || selection.value === 'false'
      return boolVal ? 'Yes' : isFalse ? 'No' : 'N/A'
    } else if (factorType === 'number' || (hasValue && !isNaN(Number(selection.value)))) {
      return hasValue ? String(selection.value) : 'N/A'
    }

    // Fallback: try option_id lookup
    if (selection.option_id) {
      const option = serviceFactorOptions.find((o) => o.id == selection.option_id)
      return option?.label || 'N/A'
    }
    return 'N/A'
  }

  const exportQuote = () => {
    if (!calculationResult.breakdown) return

    const { breakdown } = calculationResult

    // Build price breakdown lines
    const priceLines = [`  Base Price: ${CURRENCY_SYMBOL}${breakdown.basePrice?.toLocaleString() || '0'}`]

    // Add each factor detail with dollar amount
    breakdown.factorDetails?.forEach((detail) => {
      let dollarAmount = detail.impact
      if (detail.type === 'multiplier') {
        dollarAmount = breakdown.subtotalAfterMultipliers - breakdown.subtotalBeforeMultipliers
      } else if (detail.type === 'entity_multiplier') {
        dollarAmount = breakdown.subtotalAfterEntityType - breakdown.subtotalAfterMultipliers
      }

      // Skip multipliers with no actual impact
      if ((detail.type === 'multiplier' || detail.type === 'entity_multiplier') && detail.impact === 1) {
        return
      }

      priceLines.push(`  ${detail.name}: ${dollarAmount >= 0 ? '+' : ''}${CURRENCY_SYMBOL}${Math.abs(dollarAmount).toLocaleString()}`)
    })

    // Add addon details
    breakdown.addonDetails?.forEach((addon) => {
      priceLines.push(`  ${addon.name}: +${CURRENCY_SYMBOL}${addon.price.toLocaleString()}`)
    })

    const content = `
RATEPRO PRICING QUOTE
======================

Service: ${selectedService?.name || 'N/A'}
Date: ${new Date().toLocaleDateString()}

Configuration:
${visibleFactors
  .map((factor) => {
    const selectedOption = serviceFactorOptions.find(
      (o) => o.id == getSelectedOptionId(factor.id)
    )
    return `  ${factor.name}: ${selectedOption?.label || 'N/A'}`
  })
  .join('\n')}

Price Breakdown:
${priceLines.join('\n')}

TOTAL PRICE: ${CURRENCY_SYMBOL}${calculationResult.totalPrice.toLocaleString()}

---
This is an estimate only. Final pricing may vary based on specific requirements.
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ratepro-quote-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Failed to Load</h2>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
            <CalcIcon className="w-6 h-6" />
            RatePro Pricing Calculator
          </h1>
          <p className="text-muted-foreground text-sm">
            Get instant, transparent pricing for accounting services
          </p>
        </div>

        {/* Loading Card */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-9 bg-gray-100 rounded-md"></div>
            <div className="h-9 bg-gray-100 rounded-md"></div>
            <div className="h-9 bg-gray-100 rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="text-center space-y-2">
        {isEditMode ? (
          <>
            <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
              <Edit className="w-6 h-6" />
              Editing Quote {editQuoteData?.quote?.quote_number}
            </h1>
            <p className="text-muted-foreground text-sm">
              Modify the quote configuration and save your changes
            </p>
          </>
        ) : (
          <>
            <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
              <CalcIcon className="w-6 h-6" />
              RatePro Pricing Calculator
            </h1>
            <p className="text-muted-foreground text-sm">
              Get instant, transparent pricing for accounting services
            </p>
          </>
        )}
      </div>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">
              You are editing an existing quote. Changes will update the original quote.
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancelEdit} className="text-blue-800 hover:text-blue-900">
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}

      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate Your Price</CardTitle>
          <CardDescription>
            Select a service and configure your requirements to get an instant quote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Type */}
          <div className="space-y-2">
            <Label>Select Service Type</Label>
            <Select
              value={selectedServiceId ? String(selectedServiceId) : ''}
              onValueChange={(value) => {
                handleServiceSelect(value ? Number(value) : null)
                setShowResult(false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Configuration */}
          {selectedServiceId && visibleFactors.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-base font-medium">Service Configuration</h3>
                {visibleFactors.map((factor) => {
                  // Use == for comparison to handle string/number type differences from json-server
                  const options = serviceFactorOptions.filter((o) => o.factor_id == factor.id)
                  const factorType = factor.factor_type || 'select'
                  const selectedValue = getSelectedValue(factor.id)

                  return (
                    <div key={factor.id} className="space-y-2">
                      {/* Select Type */}
                      {factorType === 'select' && (
                        <>
                          <Label>{factor.name}</Label>
                          <Select
                            value={getSelectedOptionId(factor.id)}
                            onValueChange={(value) => {
                              handleFactorChange(factor.id, { option_id: value ? Number(value) : null })
                              setShowResult(false)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${factor.name.toLowerCase()}...`} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((option) => (
                                <SelectItem key={option.id} value={String(option.id)}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      )}

                      {/* Boolean Type */}
                      {factorType === 'boolean' && (
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`factor-${factor.id}`}
                            checked={selectedValue === true}
                            onCheckedChange={(checked) => {
                              handleFactorChange(factor.id, { value: checked })
                              setShowResult(false)
                            }}
                          />
                          <Label htmlFor={`factor-${factor.id}`} className="cursor-pointer">
                            {factor.name}
                          </Label>
                        </div>
                      )}

                      {/* Number Type */}
                      {factorType === 'number' && (
                        <>
                          <Label>{factor.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            value={selectedValue ?? ''}
                            onChange={(e) => {
                              const parsed = parseFloat(e.target.value)
                              handleFactorChange(factor.id, { value: isNaN(parsed) ? null : parsed })
                              setShowResult(false)
                            }}
                            placeholder={`Enter ${factor.name.toLowerCase()}...`}
                          />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Entity Type */}
          {selectedServiceId && entityTypes.length > 0 && (
            <div className="space-y-2">
              <Label>Business Entity Type</Label>
              <Select
                value={selectedEntityTypeId ? String(selectedEntityTypeId) : ''}
                onValueChange={(value) => {
                  handleEntityTypeChange(value ? Number(value) : null)
                  setShowResult(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type..." />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((entity) => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Add-ons */}
          {selectedServiceId && availableAddons.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-base font-medium">Optional Add-ons</h3>
                {availableAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-[#f3f3f5] hover:bg-[#e9e9ec] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddonIds.includes(addon.id)}
                      onChange={() => {
                        handleAddonToggle(addon.id)
                        setShowResult(false)
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#030213] focus:ring-[#030213]"
                    />
                    <span className="flex-1 text-sm font-medium">{addon.name}</span>
                    <span className="text-sm text-muted-foreground">
                      +{CURRENCY_SYMBOL}{addon.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Calculate Button */}
          <Button
            className="w-full"
            onClick={handleCalculatePrice}
            disabled={!selectedServiceId || !validation.isValid}
          >
            Calculate Price
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      {showResult && calculationResult.breakdown && (
        <Card className="border-[#030213]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Quote</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportQuote}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setShowSaveDialog(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Quote' : 'Save Quote'}
                </Button>
              </div>
            </div>
            <CardDescription>{new Date().toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service */}
            <div>
              <Label className="text-muted-foreground">Service</Label>
              <p className="font-medium">{selectedService?.name}</p>
            </div>

            <Separator />

            {/* Configuration */}
            <div>
              <Label className="text-muted-foreground">Configuration</Label>
              <div className="mt-2 space-y-1">
                {visibleFactors.map((factor) => (
                  <div key={factor.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{factor.name}:</span>
                    <span>{getFactorDisplayValue(factor)}</span>
                  </div>
                ))}
                {selectedEntityTypeId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entity Type:</span>
                    <span>
                      {entityTypes.find((e) => e.id == selectedEntityTypeId)?.name || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div>
              <Label className="text-muted-foreground">Price Breakdown</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Price</span>
                  <span>{CURRENCY_SYMBOL}{calculationResult.breakdown.basePrice?.toLocaleString() || '0'}</span>
                </div>
                {/* Show each factor detail with its name and dollar amount */}
                {calculationResult.breakdown.factorDetails?.map((detail, index) => {
                  // Calculate dollar impact for multipliers
                  let dollarAmount = detail.impact
                  if (detail.type === 'multiplier') {
                    // For multipliers, show the difference from base
                    const baseBefore = calculationResult.breakdown.subtotalBeforeMultipliers
                    dollarAmount = calculationResult.breakdown.subtotalAfterMultipliers - baseBefore
                  } else if (detail.type === 'entity_multiplier') {
                    const baseBefore = calculationResult.breakdown.subtotalAfterMultipliers
                    dollarAmount = calculationResult.breakdown.subtotalAfterEntityType - baseBefore
                  }

                  // Skip multipliers with no actual impact
                  if ((detail.type === 'multiplier' || detail.type === 'entity_multiplier') && detail.impact === 1) {
                    return null
                  }

                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{detail.name}</span>
                      <span className={dollarAmount < 0 ? 'text-green-600' : ''}>
                        {dollarAmount >= 0 ? '+' : ''}{CURRENCY_SYMBOL}{Math.abs(dollarAmount).toLocaleString()}
                      </span>
                    </div>
                  )
                })}
                {/* Addon details */}
                {calculationResult.breakdown.addonDetails?.map((addon, index) => (
                  <div key={`addon-${index}`} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span>+{CURRENCY_SYMBOL}{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-medium">Total Price</span>
              <Badge className="text-lg px-4 py-2">
                {CURRENCY_SYMBOL}{calculationResult.totalPrice.toLocaleString()}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground text-center pt-2">
              This is an estimate only. Final pricing may vary based on specific requirements.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Save Quote Dialog */}
      <SaveQuoteDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        service={selectedService}
        selectedFactors={selectedFactors}
        entityType={selectedEntityType}
        selectedAddons={selectedAddons}
        calculationResult={calculationResult}
        entityTypes={entityTypes}
        editQuoteData={editQuoteData}
        onQuoteSaved={(quote) => {
          console.log('Quote saved:', quote)
          if (isEditMode && onQuoteUpdated) {
            onQuoteUpdated(quote)
          }
        }}
      />
    </div>
  )
}

export default Calculator
