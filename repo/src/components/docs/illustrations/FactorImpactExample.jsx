import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DollarSign, Percent, X } from 'lucide-react'

/**
 * FactorImpactExample - Visual examples of different price impact types
 * Shows Fixed, Percentage, and Multiplier impacts with calculations
 */
export function FactorImpactExample() {
  const basePrice = 500

  const impacts = [
    {
      type: 'fixed',
      label: 'Fixed Impact',
      icon: DollarSign,
      color: 'blue',
      description: 'Adds or subtracts a fixed dollar amount',
      example: {
        factor: 'Expedited Service',
        option: 'Rush Processing',
        impact: '+$100',
        calculation: `$${basePrice} + $100 = $600`,
        result: 600,
      },
    },
    {
      type: 'percentage',
      label: 'Percentage Impact',
      icon: Percent,
      color: 'green',
      description: 'Adds a percentage of the base price',
      example: {
        factor: 'Complexity Level',
        option: 'High Complexity',
        impact: '+20%',
        calculation: `$${basePrice} + ($${basePrice} × 20%) = $${basePrice} + $100 = $600`,
        result: 600,
      },
    },
    {
      type: 'multiplier',
      label: 'Multiplier Impact',
      icon: X,
      color: 'purple',
      description: 'Multiplies the running total by a factor',
      example: {
        factor: 'Volume Tier',
        option: 'Enterprise (500+ txn)',
        impact: '×1.5',
        calculation: `$${basePrice} × 1.5 = $750`,
        result: 750,
      },
    },
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: 'bg-blue-100 text-blue-600',
      highlight: 'bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-700 border-green-300',
      icon: 'bg-green-100 text-green-600',
      highlight: 'bg-green-100',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700 border-purple-300',
      icon: 'bg-purple-100 text-purple-600',
      highlight: 'bg-purple-100',
    },
  }

  return (
    <div className="space-y-6">
      {/* Base Price Reference */}
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Starting Base Price</p>
        <p className="text-3xl font-bold text-foreground">${basePrice}</p>
      </div>

      {/* Impact Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {impacts.map((impact) => {
          const colors = colorClasses[impact.color]
          const Icon = impact.icon

          return (
            <Card key={impact.type} className={`border-2 ${colors.border} ${colors.bg}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{impact.label}</CardTitle>
                    <Badge variant="outline" className={`text-xs mt-1 ${colors.badge}`}>
                      {impact.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{impact.description}</p>

                {/* Example */}
                <div className="bg-white rounded-lg p-3 border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{impact.example.factor}:</span>
                    <span className="font-medium">{impact.example.option}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impact:</span>
                    <Badge className={colors.badge}>{impact.example.impact}</Badge>
                  </div>
                  <div className={`${colors.highlight} rounded p-2 mt-2`}>
                    <p className="text-xs text-muted-foreground mb-1">Calculation:</p>
                    <p className="text-sm font-mono">{impact.example.calculation}</p>
                  </div>
                </div>

                {/* Result */}
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">Result</p>
                  <p className="text-xl font-bold">${impact.example.result}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calculation Order Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Calculation Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="bg-gray-100 px-3 py-1.5 rounded-full font-medium">Base Price</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">+ Fixed</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">+ Percentage</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">× Multiplier</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">× Entity</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full font-medium">+ Add-ons</div>
            <span className="text-muted-foreground">→</span>
            <div className="bg-[#030213] text-white px-3 py-1.5 rounded-full font-medium">Final Price</div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Impacts are applied in a specific order to ensure consistent pricing calculations.
            Percentage impacts are always calculated on the base price, not the running total.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default FactorImpactExample
