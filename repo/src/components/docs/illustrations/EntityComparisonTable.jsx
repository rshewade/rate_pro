import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building, Building2, Briefcase, User, Users, Landmark } from 'lucide-react'

/**
 * EntityComparisonTable - Visual comparison of entity type pricing modifiers
 * Shows how different business entity types affect the final price
 */
export function EntityComparisonTable() {
  const basePrice = 500
  const subtotalAfterFactors = 650 // After factors applied

  const entityTypes = [
    {
      name: 'Sole Proprietor',
      icon: User,
      modifier: 1.0,
      color: 'gray',
      description: 'Simple tax filing, minimal complexity',
    },
    {
      name: 'LLC',
      icon: Building,
      modifier: 1.1,
      color: 'blue',
      description: 'Pass-through taxation, operating agreement',
    },
    {
      name: 'S-Corporation',
      icon: Building2,
      modifier: 1.25,
      color: 'green',
      description: 'Shareholder requirements, payroll considerations',
    },
    {
      name: 'C-Corporation',
      icon: Landmark,
      modifier: 1.5,
      color: 'purple',
      description: 'Double taxation, complex structure',
    },
    {
      name: 'Partnership',
      icon: Users,
      modifier: 1.15,
      color: 'amber',
      description: 'Multiple owners, K-1 requirements',
    },
    {
      name: 'Non-Profit',
      icon: Briefcase,
      modifier: 1.3,
      color: 'pink',
      description: 'Tax-exempt status, compliance requirements',
    },
  ]

  const colorClasses = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  }

  return (
    <div className="space-y-6">
      {/* Price Reference */}
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Subtotal Before Entity Modifier</p>
        <p className="text-2xl font-bold text-foreground">${subtotalAfterFactors}</p>
        <p className="text-xs text-muted-foreground mt-1">(Base: ${basePrice} + Factor Adjustments: $150)</p>
      </div>

      {/* Entity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entityTypes.map((entity) => {
          const colors = colorClasses[entity.color]
          const Icon = entity.icon
          const finalPrice = Math.round(subtotalAfterFactors * entity.modifier)
          const difference = finalPrice - subtotalAfterFactors

          return (
            <Card key={entity.name} className={`${colors.border} border-2`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground">{entity.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{entity.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modifier:</span>
                    <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                      ×{entity.modifier}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Calculation:</span>
                    <span className="font-mono text-xs">${subtotalAfterFactors} × {entity.modifier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Final Price:</span>
                    <div className="text-right">
                      <span className="text-lg font-bold">${finalPrice}</span>
                      {difference > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">(+${difference})</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entity Type Pricing Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Entity Type</th>
                  <th className="text-center py-2 px-3 font-medium">Modifier</th>
                  <th className="text-right py-2 px-3 font-medium">Subtotal</th>
                  <th className="text-right py-2 px-3 font-medium">Final Price</th>
                  <th className="text-right py-2 px-3 font-medium">Difference</th>
                </tr>
              </thead>
              <tbody>
                {entityTypes.map((entity) => {
                  const colors = colorClasses[entity.color]
                  const finalPrice = Math.round(subtotalAfterFactors * entity.modifier)
                  const difference = finalPrice - subtotalAfterFactors

                  return (
                    <tr key={entity.name} className={`border-b ${colors.bg}/30`}>
                      <td className="py-2 px-3 font-medium">{entity.name}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant="outline" className={`${colors.bg} ${colors.text}`}>
                          ×{entity.modifier}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">${subtotalAfterFactors}</td>
                      <td className="py-2 px-3 text-right font-bold">${finalPrice}</td>
                      <td className="py-2 px-3 text-right">
                        {difference > 0 ? (
                          <span className="text-amber-600">+${difference}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Entity type modifiers account for the additional complexity involved in handling different
            business structures. More complex entities require more specialized knowledge and compliance requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default EntityComparisonTable
