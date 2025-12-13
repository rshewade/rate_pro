import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { isFactorVisible } from '@/lib/pricing'
import { CURRENCY_SYMBOL } from '@/lib/currency'
import { AlertCircle } from 'lucide-react'

/**
 * PricingFactorForm - Renders dynamic pricing factor inputs
 * @param {Object} props
 * @param {Array} props.pricingFactors - All pricing factors for the service
 * @param {Array} props.factorOptions - All factor options
 * @param {Array} props.selectedFactors - Currently selected factor values [{factor_id, option_id?, value?}]
 * @param {Function} props.onFactorChange - Callback when a factor selection changes
 * @param {Array} props.validationErrors - Array of factor IDs with validation errors
 */
export function PricingFactorForm({
  pricingFactors = [],
  factorOptions = [],
  selectedFactors = [],
  onFactorChange,
  validationErrors = [],
}) {
  // Get options for a specific factor
  const getOptionsForFactor = (factorId) => {
    return factorOptions
      .filter((opt) => opt.factor_id === factorId)
      .sort((a, b) => a.display_order - b.display_order)
  }

  // Get current selection for a factor (for select type)
  const getSelectedOption = (factorId) => {
    const selection = selectedFactors.find((sf) => sf.factor_id === factorId)
    return selection?.option_id ? String(selection.option_id) : ''
  }

  // Get current value for a factor (for boolean/number types)
  const getSelectedValue = (factorId) => {
    const selection = selectedFactors.find((sf) => sf.factor_id === factorId)
    return selection?.value
  }

  // Handle selection change for select type
  const handleSelectChange = (factorId, optionId) => {
    onFactorChange(factorId, { option_id: optionId ? Number(optionId) : null })
  }

  // Handle value change for boolean type
  const handleBooleanChange = (factorId, checked) => {
    onFactorChange(factorId, { value: checked })
  }

  // Handle value change for number type
  const handleNumberChange = (factorId, numValue) => {
    const parsed = parseFloat(numValue)
    onFactorChange(factorId, { value: isNaN(parsed) ? null : parsed })
  }

  // Filter visible factors based on dependencies
  const visibleFactors = pricingFactors
    .filter((factor) => isFactorVisible(factor, selectedFactors))
    .sort((a, b) => a.display_order - b.display_order)

  if (!pricingFactors.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a service to see pricing factors
        </CardContent>
      </Card>
    )
  }

  // Format price impact display
  const formatPriceImpact = (option) => {
    if (option.price_impact === 0) return ''
    if (option.price_impact_type === 'fixed') {
      return ` (+${CURRENCY_SYMBOL}${option.price_impact})`
    }
    if (option.price_impact_type === 'multiplier' && option.price_impact !== 1) {
      return ` (×${option.price_impact})`
    }
    if (option.price_impact_type === 'percentage') {
      return ` (+${option.price_impact * 100}%)`
    }
    return ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configure Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleFactors.map((factor) => {
          const options = getOptionsForFactor(factor.id)
          const selectedOptionValue = getSelectedOption(factor.id)
          const selectedValue = getSelectedValue(factor.id)
          const hasError = validationErrors.includes(factor.id)
          const factorType = factor.factor_type || 'select'

          return (
            <div key={factor.id} className="space-y-2">
              {/* Boolean type renders label inline with checkbox */}
              {factorType !== 'boolean' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor={`factor-${factor.id}`} className="text-sm font-medium">
                    {factor.name}
                  </Label>
                  {factor.is_required && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
              )}

              {factor.description && factorType !== 'boolean' && (
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              )}

              {/* Select Type */}
              {factorType === 'select' && (
                <Select
                  value={selectedOptionValue}
                  onValueChange={(value) => handleSelectChange(factor.id, value)}
                >
                  <SelectTrigger
                    id={`factor-${factor.id}`}
                    className={hasError ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder={`Select ${factor.name.toLowerCase()}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.label}
                        {formatPriceImpact(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Boolean Type */}
              {factorType === 'boolean' && (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`factor-${factor.id}`}
                    checked={selectedValue === true}
                    onCheckedChange={(checked) => handleBooleanChange(factor.id, checked)}
                    className={hasError ? 'border-red-500' : ''}
                  />
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`factor-${factor.id}`} className="text-sm font-medium cursor-pointer">
                      {factor.name}
                    </Label>
                    {factor.is_required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  {factor.description && (
                    <span className="text-sm text-muted-foreground">- {factor.description}</span>
                  )}
                </div>
              )}

              {/* Number Type */}
              {factorType === 'number' && (
                <Input
                  id={`factor-${factor.id}`}
                  type="number"
                  min="0"
                  step="any"
                  value={selectedValue ?? ''}
                  onChange={(e) => handleNumberChange(factor.id, e.target.value)}
                  placeholder={`Enter ${factor.name.toLowerCase()}...`}
                  className={hasError ? 'border-red-500' : ''}
                />
              )}

              {hasError && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>This field is required</span>
                </div>
              )}
            </div>
          )
        })}

        {visibleFactors.length === 0 && pricingFactors.length > 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pricing factors available for the current selection
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default PricingFactorForm
