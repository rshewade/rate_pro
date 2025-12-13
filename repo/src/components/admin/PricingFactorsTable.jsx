import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Pencil, Trash2, Plus, ChevronRight } from 'lucide-react'
import { CURRENCY_SYMBOL } from '@/lib/currency'
import api from '@/services'

export function PricingFactorsTable({ pricingFactors, factorOptions, services, onRefresh, onSelectFactor }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingFactor, setEditingFactor] = React.useState(null)
  const [formData, setFormData] = React.useState({
    service_id: '',
    name: '',
    description: '',
    factor_type: 'select',
    is_required: true,
    display_order: '1',
    price_impact: '0', // For boolean factors: price to add when checked
    unit_price: '0', // For number factors: price per unit
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Service filter state with localStorage persistence
  const [selectedServiceFilter, setSelectedServiceFilter] = React.useState(() => {
    const saved = localStorage.getItem('pricingFactors_serviceFilter')
    return saved || 'all'
  })

  // Persist service filter selection
  React.useEffect(() => {
    localStorage.setItem('pricingFactors_serviceFilter', selectedServiceFilter)
  }, [selectedServiceFilter])

  const handleAdd = () => {
    setEditingFactor(null)
    setFormData({
      service_id: services[0]?.id ? String(services[0].id) : '',
      name: '',
      description: '',
      factor_type: 'select',
      is_required: true,
      display_order: '1',
      price_impact: '0',
      unit_price: '0',
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (factor) => {
    setEditingFactor(factor)
    // For boolean factors, get price_impact from the "Enabled" option
    // For number factors, get unit_price from the "Unit" option
    let priceImpact = 0
    let unitPrice = 0
    if (factor.factor_type === 'boolean') {
      const enabledOption = factorOptions.find(
        (o) => o.factor_id == factor.id && o.label === 'Enabled'
      )
      priceImpact = enabledOption?.price_impact || 0
    } else if (factor.factor_type === 'number') {
      const unitOption = factorOptions.find(
        (o) => o.factor_id == factor.id && o.label === 'Unit'
      )
      unitPrice = unitOption?.price_impact || 0
    }
    setFormData({
      service_id: String(factor.service_id),
      name: factor.name,
      description: factor.description || '',
      factor_type: factor.factor_type || 'select',
      is_required: factor.is_required !== false,
      display_order: String(factor.display_order || 1),
      price_impact: String(priceImpact),
      unit_price: String(unitPrice),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (factor) => {
    const optionCount = factorOptions.filter((o) => o.factor_id == factor.id).length
    if (optionCount > 0) {
      if (!confirm(`This factor has ${optionCount} options. Deleting it will also delete all options. Continue?`)) return
      // Delete all options first
      const options = factorOptions.filter((o) => o.factor_id == factor.id)
      for (const option of options) {
        await api.factorOptions.delete(option.id)
      }
    } else {
      if (!confirm(`Are you sure you want to delete "${factor.name}"?`)) return
    }
    try {
      await api.pricingFactors.delete(factor.id)
      onRefresh()
    } catch (err) {
      alert('Failed to delete factor: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = {
        service_id: Number(formData.service_id),
        name: formData.name,
        description: formData.description,
        factor_type: formData.factor_type,
        is_required: formData.is_required,
        display_order: Number(formData.display_order),
      }

      let factorId = editingFactor?.id
      if (editingFactor) {
        await api.pricingFactors.update(editingFactor.id, data)
      } else {
        const created = await api.pricingFactors.create(data)
        factorId = created.id
      }

      // For boolean factors, manage the "Enabled" option in factor_options
      if (formData.factor_type === 'boolean' && factorId) {
        const priceImpact = Number(formData.price_impact) || 0
        const existingOptions = factorOptions.filter((o) => o.factor_id == factorId)
        const enabledOption = existingOptions.find((o) => o.label === 'Enabled')

        if (priceImpact > 0) {
          // Create or update the "Enabled" option
          if (enabledOption) {
            await api.factorOptions.update(enabledOption.id, {
              price_impact: priceImpact,
              price_impact_type: 'fixed',
            })
          } else {
            await api.factorOptions.create({
              factor_id: factorId,
              label: 'Enabled',
              price_impact: priceImpact,
              price_impact_type: 'fixed',
              display_order: 1,
            })
          }
        } else if (enabledOption) {
          // Remove the option if price impact is 0
          await api.factorOptions.delete(enabledOption.id)
        }
      }

      // For number factors, manage the "Unit" option in factor_options
      if (formData.factor_type === 'number' && factorId) {
        const unitPrice = Number(formData.unit_price) || 0
        const existingOptions = factorOptions.filter((o) => o.factor_id == factorId)
        const unitOption = existingOptions.find((o) => o.label === 'Unit')

        if (unitPrice > 0) {
          // Create or update the "Unit" option (used as multiplier for quantity)
          if (unitOption) {
            await api.factorOptions.update(unitOption.id, {
              price_impact: unitPrice,
              price_impact_type: 'fixed', // Will be multiplied by quantity in calculator
            })
          } else {
            await api.factorOptions.create({
              factor_id: factorId,
              label: 'Unit',
              price_impact: unitPrice,
              price_impact_type: 'fixed',
              display_order: 1,
            })
          }
        } else if (unitOption) {
          // Remove the option if unit price is 0
          await api.factorOptions.delete(unitOption.id)
        }
      }

      setIsDialogOpen(false)
      onRefresh()
    } catch (err) {
      alert('Failed to save factor: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.id == serviceId)
    return service?.name || 'Unknown'
  }

  const getOptionCount = (factorId) => {
    return factorOptions.filter((o) => o.factor_id == factorId).length
  }

  // Group factors by service
  const factorsByService = React.useMemo(() => {
    const grouped = {}
    services.forEach((service) => {
      grouped[service.id] = pricingFactors.filter((f) => f.service_id == service.id)
    })
    return grouped
  }, [pricingFactors, services])

  // Filter services based on selection
  const filteredServices = React.useMemo(() => {
    if (selectedServiceFilter === 'all') {
      return services
    }
    return services.filter((s) => String(s.id) === selectedServiceFilter)
  }, [services, selectedServiceFilter])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pricing Factors ({pricingFactors.length})</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="service-filter" className="text-sm whitespace-nowrap">Filter by Service:</Label>
            <Select
              value={selectedServiceFilter}
              onValueChange={setSelectedServiceFilter}
            >
              <SelectTrigger id="service-filter" className="w-[200px]">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Factor
          </Button>
        </div>
      </div>

      {filteredServices.map((service) => (
        <div key={service.id} className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium">{service.name}</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead className="text-center">Options</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factorsByService[service.id]?.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell className="font-medium">{factor.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {factor.description}
                  </TableCell>
                  <TableCell>{factor.factor_type}</TableCell>
                  <TableCell>
                    <Badge variant={factor.is_required ? 'default' : 'secondary'}>
                      {factor.is_required ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {factor.factor_type === 'select' || !factor.factor_type ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectFactor(factor)}
                        className="gap-1"
                      >
                        {getOptionCount(factor.id)} options
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : factor.factor_type === 'boolean' ? (
                      <span className="text-sm text-muted-foreground">
                        {(() => {
                          const enabledOption = factorOptions.find(
                            (o) => o.factor_id == factor.id && o.label === 'Enabled'
                          )
                          return enabledOption?.price_impact
                            ? `+${CURRENCY_SYMBOL}${enabledOption.price_impact}`
                            : 'No impact'
                        })()}
                      </span>
                    ) : factor.factor_type === 'number' ? (
                      <span className="text-sm text-muted-foreground">
                        {(() => {
                          const unitOption = factorOptions.find(
                            (o) => o.factor_id == factor.id && o.label === 'Unit'
                          )
                          return unitOption?.price_impact
                            ? `${CURRENCY_SYMBOL}${unitOption.price_impact}/unit`
                            : 'No unit price'
                        })()}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(factor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(factor)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!factorsByService[service.id] || factorsByService[service.id].length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    No pricing factors for this service
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFactor ? 'Edit Pricing Factor' : 'Add Pricing Factor'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service_id">Service</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
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
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly Transactions, Complexity Level"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="factor_type">Type</Label>
                <Select
                  value={formData.factor_type}
                  onValueChange={(value) => setFormData({ ...formData, factor_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Toggle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                />
              </div>
            </div>
            {formData.factor_type === 'boolean' && (
              <div className="space-y-2">
                <Label htmlFor="price_impact">Price Impact (when checked)</Label>
                <Input
                  id="price_impact"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_impact}
                  onChange={(e) => setFormData({ ...formData, price_impact: e.target.value })}
                  placeholder="e.g., 50 for +$50"
                />
                <p className="text-xs text-muted-foreground">
                  Amount to add to the price when this option is enabled
                </p>
              </div>
            )}
            {formData.factor_type === 'number' && (
              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price (per unit entered)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  placeholder="e.g., 25 for $25 per unit"
                />
                <p className="text-xs text-muted-foreground">
                  Price per unit - will be multiplied by the quantity entered
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_required"
                checked={formData.is_required}
                onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_required">Required</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PricingFactorsTable
