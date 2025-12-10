import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, Check, X, Eye, EyeOff, AlertTriangle } from 'lucide-react'

/**
 * DependencyFlowDiagram - Visual examples of factor dependencies
 * Shows how dependencies work, circular dependency prevention, and before/after examples
 */
export function DependencyFlowDiagram() {
  return (
    <div className="space-y-6">
      {/* How Dependencies Work */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How Factor Dependencies Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Controlling Factor */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 min-w-[200px]">
              <p className="text-xs text-blue-600 font-medium mb-2">CONTROLLING FACTOR</p>
              <p className="font-medium">Business Type</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded border border-blue-300 bg-blue-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Corporation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded border border-gray-200" />
                  <span>Sole Proprietor</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded border border-gray-200" />
                  <span>Partnership</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <ArrowRight className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" />
              <span className="text-xs text-muted-foreground mt-1">triggers</span>
            </div>

            {/* Dependent Factor */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">NOW VISIBLE</p>
              </div>
              <p className="font-medium">Corporate Structure</p>
              <p className="text-sm text-muted-foreground mt-1">
                Only shown when &quot;Corporation&quot; is selected
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                Options: S-Corp, C-Corp, B-Corp
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Dependencies allow you to show or hide pricing factors based on other factor selections,
            creating dynamic forms that adapt to user choices.
          </p>
        </CardContent>
      </Card>

      {/* Before/After Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before - Factor Hidden */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-red-500" />
              <CardTitle className="text-base">Before: Condition Not Met</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3 border">
                <label className="text-sm font-medium">Business Type</label>
                <div className="mt-1 h-9 px-3 rounded-md border bg-white flex items-center text-sm">
                  Sole Proprietor
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200 border-dashed opacity-50">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-red-400" />
                  <label className="text-sm font-medium text-red-400">Corporate Structure</label>
                </div>
                <p className="text-xs text-red-400 mt-1">Hidden - only visible for Corporations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* After - Factor Visible */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              <CardTitle className="text-base">After: Condition Met</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <label className="text-sm font-medium">Business Type</label>
                <div className="mt-1 h-9 px-3 rounded-md border bg-white flex items-center text-sm">
                  Corporation ✓
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium text-green-700">Corporate Structure</label>
                </div>
                <div className="mt-1 h-9 px-3 rounded-md border bg-white flex items-center text-sm">
                  Select structure...
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circular Dependency Prevention */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-base">Circular Dependency Prevention</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invalid - Circular */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <X className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-700">Invalid: Circular Dependency</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border">Factor A</div>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                  <div className="bg-white px-2 py-1 rounded border">Factor B</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border">Factor B</div>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                  <div className="bg-white px-2 py-1 rounded border">Factor C</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border">Factor C</div>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                  <div className="bg-white px-2 py-1 rounded border text-red-600 border-red-300">Factor A</div>
                </div>
              </div>
              <p className="text-xs text-red-600 mt-3">
                This creates an infinite loop where no factor can be displayed.
              </p>
            </div>

            {/* Valid - Tree Structure */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Valid: Tree Structure</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border border-green-300">Factor A</div>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <div className="bg-white px-2 py-1 rounded border">Factor B</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border border-green-300">Factor A</div>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <div className="bg-white px-2 py-1 rounded border">Factor C</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white px-2 py-1 rounded border">Factor B</div>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <div className="bg-white px-2 py-1 rounded border">Factor D</div>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-3">
                Dependencies flow in one direction without loops.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            The system automatically detects and prevents circular dependencies when you create dependency rules.
            If a circular dependency is detected, you&apos;ll see a warning and the rule won&apos;t be saved.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DependencyFlowDiagram
