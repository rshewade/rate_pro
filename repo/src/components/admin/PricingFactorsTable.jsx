import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Pencil, Trash2, Plus, ChevronRight } from 'lucide-react'
import api from '@/services/api'

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
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAdd = () => {
    setEditingFactor(null)
    setFormData({
      service_id: services[0]?.id ? String(services[0].id) : '',
      name: '',
      description: '',
      factor_type: 'select',
      is_required: true,
      display_order: '1',
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (factor) => {
    setEditingFactor(factor)
    setFormData({
      service_id: String(factor.service_id),
      name: factor.name,
      description: factor.description || '',
      factor_type: factor.factor_type || 'select',
      is_required: factor.is_required !== false,
      display_order: String(factor.display_order || 1),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (factor) => {
    const optionCount = factorOptions.filter((o) => o.factor_id === factor.id).length
    if (optionCount > 0) {
      if (!confirm(`This factor has ${optionCount} options. Deleting it will also delete all options. Continue?`)) return
      // Delete all options first
      const options = factorOptions.filter((o) => o.factor_id === factor.id)
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
        ...formData,
        service_id: Number(formData.service_id),
        display_order: Number(formData.display_order),
      }
      if (editingFactor) {
        await api.pricingFactors.update(editingFactor.id, data)
      } else {
        await api.pricingFactors.create(data)
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
    const service = services.find((s) => s.id === serviceId)
    return service?.name || 'Unknown'
  }

  const getOptionCount = (factorId) => {
    return factorOptions.filter((o) => o.factor_id === factorId).length
  }

  // Group factors by service
  const factorsByService = React.useMemo(() => {
    const grouped = {}
    services.forEach((service) => {
      grouped[service.id] = pricingFactors.filter((f) => f.service_id === service.id)
    })
    return grouped
  }, [pricingFactors, services])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pricing Factors ({pricingFactors.length})</h3>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Factor
        </Button>
      </div>

      {services.map((service) => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectFactor(factor)}
                      className="gap-1"
                    >
                      {getOptionCount(factor.id)} options
                      <ChevronRight className="h-4 w-4" />
                    </Button>
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
                    <SelectItem value="toggle">Toggle</SelectItem>
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
