import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { Pencil, Trash2, Plus } from 'lucide-react'
import api from '@/services'

export function AddonsTable({ addons, services, onRefresh }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingAddon, setEditingAddon] = React.useState(null)
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    is_global: true,
    service_ids: [],
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAdd = () => {
    setEditingAddon(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      is_global: true,
      service_ids: [],
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (addon) => {
    setEditingAddon(addon)
    setFormData({
      name: addon.name,
      description: addon.description || '',
      price: String(addon.price),
      is_global: addon.is_global,
      service_ids: addon.service_ids || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (addon) => {
    if (!confirm(`Are you sure you want to delete "${addon.name}"?`)) return
    try {
      await api.addons.delete(addon.id)
      onRefresh()
    } catch (err) {
      alert('Failed to delete addon: ' + err.message)
    }
  }

  const handleServiceToggle = (serviceId) => {
    const newServiceIds = formData.service_ids.includes(serviceId)
      ? formData.service_ids.filter((id) => id !== serviceId)
      : [...formData.service_ids, serviceId]
    setFormData({ ...formData, service_ids: newServiceIds })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        is_global: formData.is_global,
        service_ids: formData.is_global ? [] : formData.service_ids,
      }
      if (editingAddon) {
        await api.addons.update(editingAddon.id, data)
      } else {
        await api.addons.create(data)
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err) {
      alert('Failed to save addon: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServiceNames = (addon) => {
    if (addon.is_global) return 'All Services'
    if (!addon.service_ids || addon.service_ids.length === 0) return 'None'
    return addon.service_ids
      .map((id) => services.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add-ons ({addons.length})</h3>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Add-on
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addons.map((addon) => (
            <TableRow key={addon.id}>
              <TableCell className="font-medium">{addon.name}</TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {addon.description}
              </TableCell>
              <TableCell className="text-right">${addon.price.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={addon.is_global ? 'default' : 'secondary'}>
                  {addon.is_global ? 'Global' : 'Specific'}
                </Badge>
                {!addon.is_global && addon.service_ids?.length > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({addon.service_ids.length} services)
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(addon)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(addon)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {addons.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No add-ons found. Add your first add-on.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddon ? 'Edit Add-on' : 'Add Add-on'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Expedited Service"
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
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_global"
                  checked={formData.is_global}
                  onChange={(e) => setFormData({ ...formData, is_global: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_global">Available for all services (Global)</Label>
              </div>
              {!formData.is_global && (
                <div className="space-y-2 pl-6">
                  <Label>Select Services</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                    {services.map((service) => (
                      <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.service_ids.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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

export default AddonsTable
