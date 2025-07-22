import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
import { formatDate } from '../lib/utils'
import { ALL_PRODUCTS, LIST_ASSETS, LIST_PRODUCTION } from '../api/queries'
import { CREATE_PRODUCTION, DELETE_PRODUCTION } from '../api/mutations'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'


export default function ProductionPage() {
  const { addToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    assetId: '',
    productId: '',
    quantity: '',
    productionDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  // Fetch production records
  const { data, loading, error, refetch } = useQuery(LIST_PRODUCTION, {
    fetchPolicy: 'cache-and-network',
  })

  // Fetch assets and products
  const { data: assetsData } = useQuery(LIST_ASSETS);

  const { data: productsData } = useQuery(ALL_PRODUCTS);

  // Mutations
  const [createProduction] = useMutation(CREATE_PRODUCTION, {
    onCompleted: () => {
      addToast({ title: 'Production recorded successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error recording production', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteProduction] = useMutation(DELETE_PRODUCTION, {
    onCompleted: () => {
      addToast({ title: 'Production record deleted' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting record', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    createProduction({
      variables: {
        input: {
          assetId: formData.assetId,
          productId: formData.productId,
          quantity: parseFloat(formData.quantity),
          productionDate: formData.productionDate,
          notes: formData.notes,
        }
      }
    })
  }

  const handleDelete = (recordId: any) => {
    if (confirm('Are you sure you want to delete this production record?')) {
      deleteProduction({ variables: { id: recordId } })
    }
  }

  const handleCreateNew = () => {
    setFormData({
      assetId: '',
      productId: '',
      quantity: '',
      productionDate: new Date().toISOString().split('T')[0],
      notes: '',
    })
    setIsDialogOpen(true)
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Production Tracking</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Record Production
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Production</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetId">Source Asset</Label>
                  <select
                    id="assetId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.assetId}
                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                    required
                  >
                    <option value="">Select Asset</option>
                    <optgroup label="Livestock">
                      {assetsData?.allLivestock?.map(( asset: { id: string | number | readonly string[] | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; livestockType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } ) => (
                        <option key={`livestock-${asset.id}`} value={asset.id}>
                          {asset.name} ({asset.livestockType})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Crops">
                      {assetsData?.allCrops?.map(( asset: { id: string | number | readonly string[] | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; cropType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } ) => (
                        <option key={`crop-${asset.id}`} value={asset.id}>
                          {asset.name} ({asset.cropType})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <select
                    id="productId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    required
                  >
                    <option value="">Select Product</option>
                    {productsData?.allProducts?.map(( product: any ) => (
                      <option key={String(product.id)} value={product.id ?? ""}>
                        {product.name} ({product.productType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productionDate">Production Date</Label>
                  <Input
                    id="productionDate"
                    type="date"
                    value={formData.productionDate}
                    onChange={(e) => setFormData({...formData, productionDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                  Record Production
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
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allProductionRecords?.map(( record: { id: Key | null | undefined; productionDate: string; product: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; unit: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; asset: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; assetType: string }; recordedBy: { username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } } ) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.productionDate)}</TableCell>
                <TableCell>
                  {record.product.name} ({record.product.unit})
                </TableCell>
                <TableCell>
                  {record.quantity} {record.product.unit}
                </TableCell>
                <TableCell>{record.asset.name}</TableCell>
                <TableCell>
                  <Badge>
                    {record.asset.assetType === 'LIVESTOCK' ? 'Livestock' : 'Crop'}
                  </Badge>
                </TableCell>
                <TableCell>{record.recordedBy.username}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(record.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}