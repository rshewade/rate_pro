import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Label } from '@/components/ui/Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Separator } from '@/components/ui/Separator'
import {
  History,
  RefreshCw,
  Filter,
  Eye,
  FileText,
  User,
  Calendar,
  ArrowRight,
  PlusCircle,
  Edit2,
  Trash2,
  GitBranch,
  DollarSign,
} from 'lucide-react'
import api from '@/services/api'
import { formatAuditEntry, describeChanges, ENTITY_TYPES, AUDIT_ACTIONS } from '@/lib/audit'

const ACTION_ICONS = {
  created: PlusCircle,
  updated: Edit2,
  deleted: Trash2,
  status_changed: ArrowRight,
  price_changed: DollarSign,
  version_created: GitBranch,
}

const ACTION_COLORS = {
  created: 'bg-green-100 text-green-700',
  updated: 'bg-blue-100 text-blue-700',
  deleted: 'bg-red-100 text-red-700',
  status_changed: 'bg-yellow-100 text-yellow-700',
  price_changed: 'bg-purple-100 text-purple-700',
  version_created: 'bg-indigo-100 text-indigo-700',
}

export function AuditLogTable() {
  const [logs, setLogs] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [filterEntityType, setFilterEntityType] = React.useState('all')
  const [filterAction, setFilterAction] = React.useState('all')
  const [selectedLog, setSelectedLog] = React.useState(null)

  const fetchLogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.auditLogs.getAll()
      setLogs(data)
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
      setError(err.message || 'Failed to load audit logs')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLogs()
  }, [])

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (filterEntityType !== 'all' && log.entity_type !== filterEntityType) {
        return false
      }
      if (filterAction !== 'all' && log.action !== filterAction) {
        return false
      }
      return true
    })
  }, [logs, filterEntityType, filterAction])

  // Format logs for display
  const formattedLogs = React.useMemo(() => {
    return filteredLogs.map(formatAuditEntry)
  }, [filteredLogs])

  const handleViewDetails = (log) => {
    setSelectedLog(log)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchLogs} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Trail ({filteredLogs.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            View all changes made to quotes and pricing data
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Label className="text-sm">Entity Type:</Label>
              <Select value={filterEntityType} onValueChange={setFilterEntityType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ENTITY_TYPES.QUOTE}>Quotes</SelectItem>
                  <SelectItem value={ENTITY_TYPES.QUOTE_LINE_ITEM}>Line Items</SelectItem>
                  <SelectItem value={ENTITY_TYPES.CUSTOMER}>Customers</SelectItem>
                  <SelectItem value={ENTITY_TYPES.SERVICE}>Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Action:</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value={AUDIT_ACTIONS.CREATED}>Created</SelectItem>
                  <SelectItem value={AUDIT_ACTIONS.UPDATED}>Updated</SelectItem>
                  <SelectItem value={AUDIT_ACTIONS.STATUS_CHANGED}>Status Changed</SelectItem>
                  <SelectItem value={AUDIT_ACTIONS.PRICE_CHANGED}>Price Changed</SelectItem>
                  <SelectItem value={AUDIT_ACTIONS.VERSION_CREATED}>Version Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(filterEntityType !== 'all' || filterAction !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterEntityType('all')
                  setFilterAction('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      {isLoading ? (
        <Card className="animate-pulse">
          <CardContent className="py-8">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
      ) : formattedLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No audit logs found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Changes to quotes and pricing data will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead className="w-[80px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedLogs.map((log) => {
                const ActionIcon = ACTION_ICONS[log.action] || Edit2
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{log.formattedDate}</div>
                          <div className="text-xs text-muted-foreground">
                            {log.formattedTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.entityLabel}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {log.entity_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`gap-1 ${ACTION_COLORS[log.action] || ''}`}
                      >
                        <ActionIcon className="h-3 w-3" />
                        {log.actionLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground truncate">
                        {describeChanges(log.changes)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Audit Log Details
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Entity Type</Label>
                  <p className="font-medium">{selectedLog.entityLabel}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity ID</Label>
                  <p className="font-medium">{selectedLog.entity_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <Badge
                    variant="secondary"
                    className={ACTION_COLORS[selectedLog.action] || ''}
                  >
                    {selectedLog.actionLabel}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">{selectedLog.formattedTimestamp}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground">Changes</Label>
                <div className="mt-2 bg-muted rounded-lg p-4 space-y-2">
                  {selectedLog.changes &&
                    Object.entries(selectedLog.changes).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>{' '}
                        {typeof value === 'object' && value !== null ? (
                          'from' in value && 'to' in value ? (
                            <span>
                              <span className="text-red-600 line-through">
                                {String(value.from)}
                              </span>
                              {' → '}
                              <span className="text-green-600">{String(value.to)}</span>
                            </span>
                          ) : (
                            JSON.stringify(value)
                          )
                        ) : (
                          String(value)
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {selectedLog.user_id && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-muted-foreground">User ID:</Label>
                    <span>{selectedLog.user_id}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuditLogTable
