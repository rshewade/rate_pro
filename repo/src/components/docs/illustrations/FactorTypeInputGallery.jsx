import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { List, Hash, ToggleLeft, ChevronDown } from 'lucide-react'

/**
 * FactorTypeInputGallery - Visual examples of different factor input types
 * Shows Select, Number, and Toggle factor types with examples
 */
export function FactorTypeInputGallery() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select Type */}
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <List className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Select Type</CardTitle>
                <Badge variant="outline" className="text-xs mt-1 bg-blue-100 text-blue-700 border-blue-300">
                  Dropdown
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose one option from a predefined list of values.
            </p>

            {/* Example UI */}
            <div className="bg-white rounded-lg p-3 border">
              <Label className="text-xs text-muted-foreground mb-1 block">Example: Transaction Volume</Label>
              <div className="relative">
                <div className="w-full h-9 px-3 rounded-md border bg-background flex items-center justify-between text-sm">
                  <span>51-200 transactions</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Options: 0-50, 51-200, 201-500, 500+
              </div>
            </div>

            {/* Best For */}
            <div className="bg-blue-100/50 rounded-md p-2">
              <p className="text-xs font-medium text-blue-800">Best for:</p>
              <p className="text-xs text-blue-700">Predefined tiers, categories, or levels with specific pricing</p>
            </div>
          </CardContent>
        </Card>

        {/* Number Type */}
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Hash className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Number Type</CardTitle>
                <Badge variant="outline" className="text-xs mt-1 bg-green-100 text-green-700 border-green-300">
                  Numeric Input
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter a specific numeric value within constraints.
            </p>

            {/* Example UI */}
            <div className="bg-white rounded-lg p-3 border">
              <Label className="text-xs text-muted-foreground mb-1 block">Example: Number of Employees</Label>
              <div className="relative">
                <input
                  type="number"
                  value="25"
                  readOnly
                  className="w-full h-9 px-3 rounded-md border bg-background text-sm"
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Min: 1 | Max: 500 | Step: 1
              </div>
            </div>

            {/* Best For */}
            <div className="bg-green-100/50 rounded-md p-2">
              <p className="text-xs font-medium text-green-800">Best for:</p>
              <p className="text-xs text-green-700">Variable quantities that directly affect pricing calculations</p>
            </div>
          </CardContent>
        </Card>

        {/* Toggle Type */}
        <Card className="border-2 border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <ToggleLeft className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Toggle Type</CardTitle>
                <Badge variant="outline" className="text-xs mt-1 bg-purple-100 text-purple-700 border-purple-300">
                  Yes/No Switch
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Binary on/off choice for optional features.
            </p>

            {/* Example UI */}
            <div className="bg-white rounded-lg p-3 border">
              <Label className="text-xs text-muted-foreground mb-1 block">Example: Multi-state Filing</Label>
              <div className="flex items-center gap-3">
                <div className="w-11 h-6 bg-purple-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
                <span className="text-sm font-medium text-green-600">Yes (+$150)</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                States: On (Yes) or Off (No)
              </div>
            </div>

            {/* Best For */}
            <div className="bg-purple-100/50 rounded-md p-2">
              <p className="text-xs font-medium text-purple-800">Best for:</p>
              <p className="text-xs text-purple-700">Yes/no features, optional services, or binary choices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">When to Use Each Factor Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Factor Type</th>
                  <th className="text-left py-2 px-3 font-medium">Use Case</th>
                  <th className="text-left py-2 px-3 font-medium">Example Factors</th>
                  <th className="text-left py-2 px-3 font-medium">Price Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-blue-50/50">
                  <td className="py-2 px-3">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">Select</Badge>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Fixed set of predefined options</td>
                  <td className="py-2 px-3 text-muted-foreground">
                    Transaction Volume, Complexity Level, Industry Type
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Each option has its own impact</td>
                </tr>
                <tr className="border-b bg-green-50/50">
                  <td className="py-2 px-3">
                    <Badge className="bg-green-100 text-green-700 border-green-300">Number</Badge>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Variable numeric quantities</td>
                  <td className="py-2 px-3 text-muted-foreground">
                    Employee Count, Account Count, Hours Needed
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Calculated per unit/range</td>
                </tr>
                <tr className="bg-purple-50/50">
                  <td className="py-2 px-3">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">Toggle</Badge>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Binary yes/no choices</td>
                  <td className="py-2 px-3 text-muted-foreground">
                    Multi-state Filing, Expedited Service, Audit Support
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">Fixed add/no-add when enabled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FactorTypeInputGallery
