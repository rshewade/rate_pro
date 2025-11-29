import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { isFactorVisible } from '@/lib/pricing'
import { AlertCircle } from 'lucide-react'

/**
 * PricingFactorForm - Renders dynamic pricing factor inputs
 * @param {Object} props
 * @param {Array} props.pricingFactors - All pricing factors for the service
 * @param {Array} props.factorOptions - All factor options
 * @param {Array} props.selectedFactors - Currently selected factor values [{factor_id, option_id}]
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

  // Get current selection for a factor
  const getSelectedOption = (factorId) => {
    const selection = selectedFactors.find((sf) => sf.factor_id === factorId)
    return selection?.option_id ? String(selection.option_id) : ''
  }

  // Handle selection change
  const handleChange = (factorId, optionId) => {
    onFactorChange(factorId, optionId ? Number(optionId) : null)
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
      return ` (+$${option.price_impact})`
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
          const selectedValue = getSelectedOption(factor.id)
          const hasError = validationErrors.includes(factor.id)

          return (
            <div key={factor.id} className="space-y-2">
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

              {factor.description && (
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              )}

              <Select
                value={selectedValue}
                onValueChange={(value) => handleChange(factor.id, value)}
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
