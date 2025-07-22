import { useState, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
import { formatDate, formatCurrency } from '../lib/utils'
import { LIST_ASSETS, LIST_EXPENSES, LIST_FARMS } from '../api/queries'
import { CREATE_EXPENSE, DELETE_EXPENSE } from '../api/mutations'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Label } from '../components/ui/label'


const expenseTypes = [
  { value: 'FEED', label: 'Animal Feed' },
  { value: 'SEEDS', label: 'Seeds' },
  { value: 'FERTILIZER', label: 'Fertilizer' },
  { value: 'LABOR', label: 'Labor' },
  { value: 'VET', label: 'Veterinary' },
  { value: 'EQUIPMENT', label: 'Equipment' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
]

export default function ExpensesPage() {
  const { addToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentExpense, setCurrentExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    expenseType: 'FEED',
    amount: '',
    dateIncurred: new Date().toISOString().split('T')[0],
    description: '',
    assetId: '',
    farmId: '',
  })

  // Fetch expenses
  const { data, loading, error, refetch } = useQuery(LIST_EXPENSES, {
    fetchPolicy: 'cache-and-network',
  })

  // Fetch farms and assets for dropdowns
  const { data: farmsData } = useQuery(LIST_FARMS);

  const { data: assetsData } = useQuery(LIST_ASSETS);

  // Mutations
  const [createExpense] = useMutation(CREATE_EXPENSE, {
    onCompleted: () => {
      addToast({ title: 'Expense recorded successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error recording expense', description: error.message, variant: 'destructive' })
    },
  })

  const [updateExpense] = useMutation(CREATE_EXPENSE, {
    onCompleted: () => {
      addToast({ title: 'Expense updated successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error updating expense', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => {
      addToast({ title: 'Expense deleted successfully' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting expense', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const variables = { 
      input: {
        expenseType: formData.expenseType,
        amount: parseFloat(formData.amount),
        dateIncurred: formData.dateIncurred,
        description: formData.description,
        assetId: formData.assetId || null,
        farmId: formData.farmId,
      }
    }

    if (currentExpense) {
      updateExpense({ variables: { id: currentExpense?.id, ...variables } })
    } else {
      createExpense({ variables })
    }
  }

  const handleEdit = (expense: { expenseType: any; amount: { toString: () => any }; dateIncurred: any; description: any; asset: { id: any }; farm: { id: any } }) => {
    setCurrentExpense(expense)
    setFormData({
      expenseType: expense.expenseType,
      amount: expense.amount.toString(),
      dateIncurred: expense.dateIncurred,
      description: expense.description || '',
      assetId: expense.asset?.id || '',
      farmId: expense.farm.id,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (expenseId: any) => {
    if (confirm('Are you sure you want to delete this expense record?')) {
      deleteExpense({ variables: { id: expenseId } })
    }
  }

  const handleCreateNew = () => {
    setCurrentExpense(null)
    setFormData({
      expenseType: 'FEED',
      amount: '',
      dateIncurred: new Date().toISOString().split('T')[0],
      description: '',
      assetId: '',
      farmId: farmsData?.allFarms[0]?.id || '',
    })
    setIsDialogOpen(true)
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Tracking</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Record Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {currentExpense ? 'Edit Expense' : 'Record New Expense'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expenseType">Expense Type</Label>
                  <select
                    id="expenseType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.expenseType}
                    onChange={(e) => setFormData({...formData, expenseType: e.target.value})}
                    required
                  >
                    {expenseTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateIncurred">Date Incurred</Label>
                  <Input
                    id="dateIncurred"
                    type="date"
                    value={formData.dateIncurred}
                    onChange={(e) => setFormData({...formData, dateIncurred: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmId">Farm</Label>
                  <select
                    id="farmId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.farmId ?? ""}
                    onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                    required
                  >
                    {farmsData?.allFarms?.map((farm: { id: string | number | null | undefined; name: React.ReactNode }) => (
                      <option key={String(farm.id)} value={String(farm.id)}>
                        {farm.name}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetId">Related Asset (Optional)</Label>
                <select
                  id="assetId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.assetId}
                  onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="">Select Asset (Optional)</option>
                  <optgroup label="Livestock">
                    {assetsData?.allLivestock?.map(( asset: { id: string | number | readonly string[] | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } ) => (
                      <option key={`livestock-${asset.id}`} value={asset.id}>
                        {asset.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Crops">
                    {assetsData?.allCrops?.map(( asset: { id: string | number | readonly string[] | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } ) => (
                      <option key={`crop-${asset.id}`} value={asset.id}>
                        {asset.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentExpense ? 'Update Expense' : 'Record Expense'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allExpenses?.map(( expense: { expenseType: any; id?: any; dateIncurred: any; amount: any; farm: any; asset: any; description: any; recordedBy?: any } ) => {
              const expenseType = expenseTypes.find(t => t.value === expense.expenseType)?.label
              
              return (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.dateIncurred)}</TableCell>
                  <TableCell>{expenseType}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{expense.farm.name}</TableCell>
                  <TableCell>{expense.asset?.name || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {expense.description || '-'}
                  </TableCell>
                  <TableCell>{expense.recordedBy.username}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(expense)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}