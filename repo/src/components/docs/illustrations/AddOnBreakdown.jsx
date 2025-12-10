import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Check, Globe, Briefcase, Plus } from 'lucide-react'

/**
 * AddOnBreakdown - Visual examples of add-ons and their effect on pricing
 * Shows global vs service-specific add-ons and price breakdown
 */
export function AddOnBreakdown() {
  const subtotalBeforeAddons = 812.50

  const globalAddons = [
    { name: 'Expedited Processing', price: 150, description: 'Rush delivery within 48 hours' },
    { name: 'Dedicated Support', price: 200, description: 'Direct phone/email access to your accountant' },
    { name: 'Digital Document Storage', price: 50, description: '1-year secure cloud storage' },
  ]

  const serviceAddons = [
    {
      service: 'Tax Preparation',
      addons: [
        { name: 'Audit Protection', price: 299, description: 'Coverage for IRS audit representation' },
        { name: 'Multi-State Filing', price: 150, description: 'Additional state tax returns' },
      ],
    },
    {
      service: 'Bookkeeping',
      addons: [
        { name: 'Payroll Integration', price: 100, description: 'Sync with payroll provider' },
        { name: 'Inventory Tracking', price: 75, description: 'FIFO/LIFO inventory management' },
      ],
    },
  ]

  const selectedAddons = [
    { name: 'Expedited Processing', price: 150 },
    { name: 'Audit Protection', price: 299 },
  ]

  const totalAddons = selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
  const finalPrice = subtotalBeforeAddons + totalAddons

  return (
    <div className="space-y-6">
      {/* Global vs Service-Specific Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Global Add-ons */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Global Add-ons</CardTitle>
                <p className="text-xs text-muted-foreground">Available for all services</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {globalAddons.map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{addon.name}</p>
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 ml-2">
                    +${addon.price}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                <Globe className="w-3 h-3 inline mr-1" />
                Global add-ons appear in the calculator regardless of which service is selected.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service-Specific Add-ons */}
        <Card className="border-2 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Service-Specific Add-ons</CardTitle>
                <p className="text-xs text-muted-foreground">Only for certain services</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceAddons.map((group) => (
                <div key={group.service}>
                  <p className="text-xs font-medium text-green-700 mb-2">{group.service}</p>
                  <div className="space-y-2">
                    {group.addons.map((addon) => (
                      <div
                        key={addon.name}
                        className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{addon.name}</p>
                          <p className="text-xs text-muted-foreground">{addon.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-300 ml-2">
                          +${addon.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                <Briefcase className="w-3 h-3 inline mr-1" />
                Service-specific add-ons only appear when that service is selected.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Breakdown with Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Add-ons Affect Your Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calculator Selection View */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Add-on Selection in Calculator</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {globalAddons.concat(serviceAddons[0].addons).map((addon) => {
                  const isSelected = selectedAddons.some((s) => s.name === addon.name)
                  return (
                    <label
                      key={addon.name}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#030213] text-white' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-white border-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#030213]" />}
                      </div>
                      <span className="flex-1 text-sm">{addon.name}</span>
                      <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                        +${addon.price}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Price Breakdown</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (before add-ons)</span>
                  <span>${subtotalBeforeAddons.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">SELECTED ADD-ONS</p>
                  {selectedAddons.map((addon) => (
                    <div key={addon.name} className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Plus className="w-3 h-3 text-green-500" />
                        {addon.name}
                      </span>
                      <span className="text-green-600">+${addon.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Add-ons Total</span>
                    <span className="font-medium text-green-600">+${totalAddons}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Final Price</span>
                    <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Configuration Note */}
      <Card className="bg-amber-50/50 border-amber-200">
        <CardContent className="pt-4">
          <p className="text-sm text-amber-800">
            <strong>Admin Tip:</strong> When creating add-ons, mark them as &quot;Global&quot; if they should
            be available across all services, or assign them to specific services for targeted offerings.
            This helps keep the calculator clean and relevant for each service type.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddOnBreakdown
