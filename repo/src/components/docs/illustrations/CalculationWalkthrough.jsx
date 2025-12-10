import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowDown, Calculator, DollarSign, Percent, X, Building2, Package } from 'lucide-react'

/**
 * CalculationWalkthrough - Step-by-step visual breakdown of the pricing calculation
 * Shows the complete flow from base price to final price with real numbers
 */
export function CalculationWalkthrough() {
  // Example calculation data
  const calculation = {
    service: 'Tax Preparation',
    basePrice: 500,
    fixedImpacts: [
      { name: 'Expedited Service', impact: 100 },
      { name: 'Prior Year Amendment', impact: 75 },
    ],
    percentageImpacts: [
      { name: 'High Complexity (+20%)', percentage: 0.2, impact: 100 },
    ],
    multiplierImpacts: [
      { name: 'Enterprise Volume (×1.25)', multiplier: 1.25 },
    ],
    entityType: { name: 'S-Corporation', modifier: 1.25 },
    addons: [
      { name: 'Audit Protection', price: 299 },
      { name: 'Multi-State Filing', price: 150 },
    ],
  }

  // Calculate running totals
  const fixedTotal = calculation.fixedImpacts.reduce((sum, i) => sum + i.impact, 0)
  const percentageTotal = calculation.percentageImpacts.reduce((sum, i) => sum + i.impact, 0)
  const subtotalBeforeMultipliers = calculation.basePrice + fixedTotal + percentageTotal
  const combinedMultiplier = calculation.multiplierImpacts.reduce((m, i) => m * i.multiplier, 1)
  const subtotalAfterMultipliers = subtotalBeforeMultipliers * combinedMultiplier
  const subtotalAfterEntity = subtotalAfterMultipliers * calculation.entityType.modifier
  const addonsTotal = calculation.addons.reduce((sum, a) => sum + a.price, 0)
  const finalPrice = subtotalAfterEntity + addonsTotal

  const steps = [
    {
      step: 1,
      title: 'Base Price',
      icon: DollarSign,
      color: 'gray',
      description: 'Starting price for the selected service',
      calculation: null,
      result: calculation.basePrice,
      details: [{ label: calculation.service, value: `$${calculation.basePrice}` }],
    },
    {
      step: 2,
      title: 'Fixed Impacts',
      icon: DollarSign,
      color: 'blue',
      description: 'Add/subtract fixed dollar amounts',
      calculation: `$${calculation.basePrice} + $${fixedTotal}`,
      result: calculation.basePrice + fixedTotal,
      details: calculation.fixedImpacts.map((i) => ({
        label: i.name,
        value: `+$${i.impact}`,
      })),
    },
    {
      step: 3,
      title: 'Percentage Impacts',
      icon: Percent,
      color: 'green',
      description: 'Percentages calculated on base price only',
      calculation: `$${calculation.basePrice + fixedTotal} + $${percentageTotal}`,
      result: subtotalBeforeMultipliers,
      details: calculation.percentageImpacts.map((i) => ({
        label: i.name,
        value: `+$${i.impact}`,
        sublabel: `(${calculation.basePrice} × ${(i.percentage * 100).toFixed(0)}%)`,
      })),
    },
    {
      step: 4,
      title: 'Multiplier Impacts',
      icon: X,
      color: 'purple',
      description: 'Multiply the running total',
      calculation: `$${subtotalBeforeMultipliers} × ${combinedMultiplier}`,
      result: subtotalAfterMultipliers,
      details: calculation.multiplierImpacts.map((i) => ({
        label: i.name,
        value: `×${i.multiplier}`,
      })),
    },
    {
      step: 5,
      title: 'Entity Type Modifier',
      icon: Building2,
      color: 'amber',
      description: 'Business structure complexity adjustment',
      calculation: `$${subtotalAfterMultipliers.toFixed(2)} × ${calculation.entityType.modifier}`,
      result: subtotalAfterEntity,
      details: [
        {
          label: calculation.entityType.name,
          value: `×${calculation.entityType.modifier}`,
        },
      ],
    },
    {
      step: 6,
      title: 'Add-ons',
      icon: Package,
      color: 'pink',
      description: 'Optional services and features',
      calculation: `$${subtotalAfterEntity.toFixed(2)} + $${addonsTotal}`,
      result: finalPrice,
      details: calculation.addons.map((a) => ({
        label: a.name,
        value: `+$${a.price}`,
      })),
    },
  ]

  const colorClasses = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#030213] text-white">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">Pricing Calculation Example</h3>
              <p className="text-sm text-white/70">
                Service: {calculation.service} | Entity: {calculation.entityType.name}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-white/70">Final Price</p>
              <p className="text-2xl font-bold">${finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step breakdown */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const colors = colorClasses[step.color]
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <div key={step.step}>
              <Card className={`border-2 ${colors.border}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    {/* Step Number & Icon */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground mt-1">
                        Step {step.step}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <Badge className={colors.badge}>{step.title.toLowerCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                      {/* Details */}
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <div>
                              <span>{detail.label}</span>
                              {detail.sublabel && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  {detail.sublabel}
                                </span>
                              )}
                            </div>
                            <span className={`font-medium ${colors.text}`}>{detail.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Calculation */}
                      {step.calculation && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-mono">{step.calculation}</span>
                            <span className="font-bold text-lg">= ${step.result.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {!step.calculation && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-end">
                            <span className="font-bold text-lg">= ${step.result.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow connector */}
              {!isLast && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Final Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-base text-green-800">Final Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Base</p>
              <p className="font-medium">${calculation.basePrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">+ Adjustments</p>
              <p className="font-medium">${(fixedTotal + percentageTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">× Multipliers</p>
              <p className="font-medium">{(combinedMultiplier * calculation.entityType.modifier).toFixed(4)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">+ Add-ons</p>
              <p className="font-medium">${addonsTotal}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200 text-center">
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-3xl font-bold text-green-700">${finalPrice.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CalculationWalkthrough
