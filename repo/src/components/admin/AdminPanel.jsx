import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { ServicesTable } from './ServicesTable'
import { EntityTypesTable } from './EntityTypesTable'
import { PricingFactorsTable } from './PricingFactorsTable'
import { FactorOptionsTable } from './FactorOptionsTable'
import { AddonsTable } from './AddonsTable'
import { FactorDependenciesTable } from './FactorDependenciesTable'
import { TestCalculator } from './TestCalculator'
import { AuditLogTable } from './AuditLogTable'
import { RefreshCw, AlertCircle, Package, Building2, Sliders, Puzzle, Link2, Calculator, History } from 'lucide-react'
import api from '@/services'

export function AdminPanel() {
  const [data, setData] = React.useState({
    services: [],
    pricingFactors: [],
    factorOptions: [],
    entityTypes: [],
    addons: [],
    factorDependencies: [],
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [selectedFactor, setSelectedFactor] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState('services')

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [services, pricingFactors, factorOptions, entityTypes, addons, factorDependencies] = await Promise.all([
        api.services.getAll(),
        api.pricingFactors.getAll(),
        api.factorOptions.getAll(),
        api.entityTypes.getAll(),
        api.addons.getAll(),
        api.factorDependencies.getAll(),
      ])
      setData({ services, pricingFactors, factorOptions, entityTypes, addons, factorDependencies })
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const handleSelectFactor = (factor) => {
    setSelectedFactor(factor)
  }

  const handleBackFromOptions = () => {
    setSelectedFactor(null)
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Failed to Load Admin Data</h2>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-100 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  // If a factor is selected, show options table
  if (selectedFactor) {
    const factorOptions = data.factorOptions.filter((o) => o.factor_id === selectedFactor.id)
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FactorOptionsTable
            factor={selectedFactor}
            options={factorOptions}
            onRefresh={fetchData}
            onBack={handleBackFromOptions}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage services, pricing factors, entity types, and add-ons
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="services" className="gap-2">
                <Package className="h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="factors" className="gap-2">
                <Sliders className="h-4 w-4" />
                Factors
              </TabsTrigger>
              <TabsTrigger value="dependencies" className="gap-2">
                <Link2 className="h-4 w-4" />
                Dependencies
              </TabsTrigger>
              <TabsTrigger value="entities" className="gap-2">
                <Building2 className="h-4 w-4" />
                Entities
              </TabsTrigger>
              <TabsTrigger value="addons" className="gap-2">
                <Puzzle className="h-4 w-4" />
                Add-ons
              </TabsTrigger>
              <TabsTrigger value="test" className="gap-2">
                <Calculator className="h-4 w-4" />
                Test
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <History className="h-4 w-4" />
                Audit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <ServicesTable services={data.services} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="factors">
              <PricingFactorsTable
                pricingFactors={data.pricingFactors}
                factorOptions={data.factorOptions}
                services={data.services}
                onRefresh={fetchData}
                onSelectFactor={handleSelectFactor}
              />
            </TabsContent>

            <TabsContent value="dependencies">
              <FactorDependenciesTable
                dependencies={data.factorDependencies}
                pricingFactors={data.pricingFactors}
                factorOptions={data.factorOptions}
                services={data.services}
                onRefresh={fetchData}
              />
            </TabsContent>

            <TabsContent value="entities">
              <EntityTypesTable entityTypes={data.entityTypes} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="addons">
              <AddonsTable addons={data.addons} services={data.services} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="test">
              <TestCalculator
                services={data.services}
                pricingFactors={data.pricingFactors}
                factorOptions={data.factorOptions}
                entityTypes={data.entityTypes}
                addons={data.addons}
                dependencies={data.factorDependencies}
              />
            </TabsContent>

            <TabsContent value="audit">
              <AuditLogTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel
