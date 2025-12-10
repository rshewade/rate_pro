import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Pencil, Trash2, Plus, AlertTriangle, CheckCircle, ArrowRight, Link2 } from 'lucide-react'
import api from '@/services'
import {
  validateDependencyRule,
  findAllCircularDependencies,
} from '@/lib/dependencies'

const CONDITION_TYPES = [
  { value: 'option_selected', label: 'When specific options selected' },
  { value: 'any_selected', label: 'When any option selected' },
  { value: 'option_not_selected', label: 'When specific options NOT selected' },
]

export function FactorDependenciesTable({
  dependencies,
  pricingFactors,
  factorOptions,
  services,
  onRefresh,
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingDep, setEditingDep] = React.useState(null)
  const [formData, setFormData] = React.useState({
    service_id: '',
    factor_id: '',
    depends_on_factor_id: '',
    condition_type: 'option_selected',
    condition_value: [],
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [validationError, setValidationError] = React.useState(null)

  // Calculate circular dependency issues
  const circularIssues = React.useMemo(() => {
    return findAllCircularDependencies(dependencies, pricingFactors)
  }, [dependencies, pricingFactors])

  // Get factors for selected service
  const availableFactors = React.useMemo(() => {
    if (!formData.service_id) return []
    return pricingFactors.filter(f => f.service_id === Number(formData.service_id))
  }, [formData.service_id, pricingFactors])

  // Get options for depends_on_factor
  const dependsOnOptions = React.useMemo(() => {
    if (!formData.depends_on_factor_id) return []
    return factorOptions.filter(o => o.factor_id === Number(formData.depends_on_factor_id))
  }, [formData.depends_on_factor_id, factorOptions])

  const handleAdd = () => {
    setEditingDep(null)
    setFormData({
      service_id: services[0]?.id ? String(services[0].id) : '',
      factor_id: '',
      depends_on_factor_id: '',
      condition_type: 'option_selected',
      condition_value: [],
      description: '',
    })
    setValidationError(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (dep) => {
    const factor = pricingFactors.find(f => f.id === dep.factor_id)
    setEditingDep(dep)
    setFormData({
      service_id: factor ? String(factor.service_id) : '',
      factor_id: String(dep.factor_id),
      depends_on_factor_id: String(dep.depends_on_factor_id),
      condition_type: dep.condition_type,
      condition_value: dep.condition_value || [],
      description: dep.description || '',
    })
    setValidationError(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (dep) => {
    if (!confirm('Are you sure you want to delete this dependency rule?')) return
    try {
      await api.factorDependencies.delete(dep.id)
      onRefresh()
    } catch (err) {
      alert('Failed to delete dependency: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError(null)

    const newDep = {
      factor_id: Number(formData.factor_id),
      depends_on_factor_id: Number(formData.depends_on_factor_id),
      condition_type: formData.condition_type,
      condition_value: formData.condition_value,
      description: formData.description,
    }

    // Validate the rule
    const existingDeps = editingDep
      ? dependencies.filter(d => d.id !== editingDep.id)
      : dependencies
    const validation = validateDependencyRule(newDep, existingDeps, pricingFactors)

    if (!validation.isValid) {
      setValidationError(validation.error)
      return
    }

    setIsSubmitting(true)
    try {
      if (editingDep) {
        await api.factorDependencies.update(editingDep.id, newDep)
      } else {
        await api.factorDependencies.create(newDep)
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err) {
      alert('Failed to save dependency: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionToggle = (optionId) => {
    const optionIdStr = String(optionId)
    setFormData(prev => ({
      ...prev,
      condition_value: prev.condition_value.includes(optionIdStr)
        ? prev.condition_value.filter(id => id !== optionIdStr)
        : [...prev.condition_value, optionIdStr]
    }))
  }

  const getFactorName = (factorId) => {
    const factor = pricingFactors.find(f => f.id === factorId)
    return factor?.name || 'Unknown'
  }

  const getServiceName = (factorId) => {
    const factor = pricingFactors.find(f => f.id === factorId)
    const service = services.find(s => s.id === factor?.service_id)
    return service?.name || 'Unknown'
  }

  const getConditionLabel = (dep) => {
    const type = CONDITION_TYPES.find(t => t.value === dep.condition_type)
    if (dep.condition_type === 'any_selected') {
      return type?.label || dep.condition_type
    }
    const optionLabels = (dep.condition_value || []).map(optId => {
      const opt = factorOptions.find(o => o.id === Number(optId))
      return opt?.label || optId
    })
    return `${type?.label || dep.condition_type}: ${optionLabels.join(', ')}`
  }

  // Group dependencies by service
  const depsByService = React.useMemo(() => {
    const grouped = {}
    dependencies.forEach(dep => {
      const factor = pricingFactors.find(f => f.id === dep.factor_id)
      if (factor) {
        const serviceId = factor.service_id
        if (!grouped[serviceId]) grouped[serviceId] = []
        grouped[serviceId].push(dep)
      }
    })
    return grouped
  }, [dependencies, pricingFactors])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Factor Dependencies ({dependencies.length})</h3>
          <p className="text-sm text-muted-foreground">
            Define conditional display rules between pricing factors
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Dependency
        </Button>
      </div>

      {/* Circular Dependency Warnings */}
      {circularIssues.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Circular Dependencies Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <ul className="text-sm text-red-600 space-y-1">
              {circularIssues.map((issue, i) => (
                <li key={i}>{issue.message}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* No Circular Dependencies */}
      {circularIssues.length === 0 && dependencies.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-3 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            No circular dependencies detected
          </CardContent>
        </Card>
      )}

      {/* Dependencies by Service */}
      {services.map(service => {
        const serviceDeps = depsByService[service.id] || []
        if (serviceDeps.length === 0) return null

        return (
          <div key={service.id} className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-2 font-medium">{service.name}</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dependent Factor</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Depends On</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceDeps.map(dep => (
                  <TableRow key={dep.id}>
                    <TableCell className="font-medium">
                      {getFactorName(dep.factor_id)}
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>{getFactorName(dep.depends_on_factor_id)}</TableCell>
                    <TableCell className="max-w-[250px]">
                      <span className="text-sm text-muted-foreground">
                        {getConditionLabel(dep)}
                      </span>
                      {dep.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {dep.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(dep)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(dep)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      })}

      {dependencies.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Link2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No factor dependencies defined</p>
            <p className="text-sm">
              Dependencies control when factors are shown based on other factor selections
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDep ? 'Edit Dependency Rule' : 'Add Dependency Rule'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {validationError}
              </div>
            )}

            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    service_id: value,
                    factor_id: '',
                    depends_on_factor_id: '',
                    condition_value: [],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dependent Factor</Label>
                <Select
                  value={formData.factor_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, factor_id: value })
                  }
                  disabled={!formData.service_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select factor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFactors
                      .filter(f => String(f.id) !== formData.depends_on_factor_id)
                      .map(factor => (
                        <SelectItem key={factor.id} value={String(factor.id)}>
                          {factor.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This factor will be shown/hidden
                </p>
              </div>

              <div className="space-y-2">
                <Label>Depends On</Label>
                <Select
                  value={formData.depends_on_factor_id}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      depends_on_factor_id: value,
                      condition_value: [],
                    })
                  }
                  disabled={!formData.service_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select factor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFactors
                      .filter(f => String(f.id) !== formData.factor_id)
                      .map(factor => (
                        <SelectItem key={factor.id} value={String(factor.id)}>
                          {factor.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The controlling factor
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Condition Type</Label>
              <Select
                value={formData.condition_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, condition_type: value, condition_value: [] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.condition_type !== 'any_selected' && dependsOnOptions.length > 0 && (
              <div className="space-y-2">
                <Label>
                  {formData.condition_type === 'option_selected'
                    ? 'Show when these options are selected:'
                    : 'Show when these options are NOT selected:'}
                </Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {dependsOnOptions.map(option => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.condition_value.includes(String(option.id))}
                        onChange={() => handleOptionToggle(option.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Only show for business returns"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.factor_id ||
                  !formData.depends_on_factor_id
                }
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FactorDependenciesTable
