import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
import { formatDate, formatCurrency } from '../lib/utils'
import { ALL_PRODUCTION_RECORDS, ALL_PRODUCTS, LIST_ASSETS, LIST_SALES } from '../api/queries'
import { CREATE_SALE, DELETE_SALE } from '../api/mutations'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { PlusIcon, TrashIcon } from 'lucide-react'



export default function SalesPage() {
  const { addToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saleType, setSaleType] = useState('PRODUCT')
  const [formData, setFormData] = useState({
    saleType: 'PRODUCT',
    assetId: '',
    productId: '',
    productionRecordId: '',
    quantity: '',
    unitPrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    buyer: '',
    notes: '',
  })

  // Fetch sales
  const { data, loading, error, refetch } = useQuery(LIST_SALES, {
    fetchPolicy: 'cache-and-network',
  })

  // Fetch data for dropdowns
  const { data: assetsData } = useQuery(LIST_ASSETS);

  const { data: productsData } = useQuery(ALL_PRODUCTS);

  const { data: productionData } = useQuery(ALL_PRODUCTION_RECORDS);

  // Mutations
  const [createSale] = useMutation(CREATE_SALE, {
    onCompleted: () => {
      addToast({ title: 'Sale recorded successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error recording sale', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteSale] = useMutation(DELETE_SALE, {
    onCompleted: () => {
      addToast({ title: 'Sale record deleted' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting sale', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    createSale({
      variables: {
        input: {
          saleType: formData.saleType,
          assetId: formData.saleType === 'ASSET' ? formData.assetId : null,
          productId: formData.saleType === 'PRODUCT' ? formData.productId : null,
          productionRecordId: formData.saleType === 'PRODUCT' ? formData.productionRecordId : null,
          quantity: parseFloat(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          saleDate: formData.saleDate,
          buyer: formData.buyer,
          notes: formData.notes,
        }
      }
    })
  }

  const handleDelete = (saleId: any) => {
    if (confirm('Are you sure you want to delete this sale record?')) {
      deleteSale({ variables: { id: saleId } })
    }
  }

  const handleCreateNew = () => {
    setFormData({
      saleType: 'PRODUCT',
      assetId: '',
      productId: '',
      productionRecordId: '',
      quantity: '',
      unitPrice: '',
      saleDate: new Date().toISOString().split('T')[0],
      buyer: '',
      notes: '',
    })
    setIsDialogOpen(true)
  }

  const handleSaleTypeChange = (type: any) => {
    setSaleType(type)
    setFormData({
      ...formData,
      saleType: type,
      assetId: '',
      productId: '',
      productionRecordId: '',
    })
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Sale Type</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={saleType === 'PRODUCT' ? 'default' : 'outline'}
                    onClick={() => handleSaleTypeChange('PRODUCT')}
                  >
                    Product Sale
                  </Button>
                  <Button
                    type="button"
                    variant={saleType === 'ASSET' ? 'default' : 'outline'}
                    onClick={() => handleSaleTypeChange('ASSET')}
                  >
                    Asset Sale
                  </Button>
                </div>
              </div>

              {saleType === 'PRODUCT' ? (
                <>
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
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.productType})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productionRecordId">Production Batch (Optional)</Label>
                    <select
                      id="productionRecordId"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.productionRecordId}
                      onChange={(e) => setFormData({...formData, productionRecordId: e.target.value})}
                    >
                      <option value="">Select Production Batch</option>
                      {productionData?.allProductionRecords?.map(( record:any ) => (
                        <option key={record.id} value={record.id}>
                          {record.quantity} {record.product.unit} of {record.product.name} from {record.asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="assetId">Asset</Label>
                  <select
                    id="assetId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.assetId}
                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                    required
                  >
                    <option value="">Select Asset</option>
                    <optgroup label="Livestock">
                      {assetsData?.allLivestock?.map(( asset:any ) => (
                        <option key={`livestock-${asset.id}`} value={asset.id}>
                          {asset.name} ({asset.livestockType})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Crops">
                      {assetsData?.allCrops?.map(( asset:any ) => (
                        <option key={`crop-${asset.id}`} value={asset.id}>
                          {asset.name} ({asset.cropType})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

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
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saleDate">Sale Date</Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer">Buyer (Optional)</Label>
                  <Input
                    id="buyer"
                    value={formData.buyer}
                    onChange={(e) => setFormData({...formData, buyer: e.target.value})}
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
                  Record Sale
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
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allSales?.map(( sale: { id: Key | null | undefined; saleDate: string; saleType: string; asset: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; product: { name: any }; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; unitPrice: number; totalAmount: number; buyer: any; recordedBy: { username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } } ) => (
              <TableRow key={sale.id}>
                <TableCell>{formatDate(sale.saleDate)}</TableCell>
                <TableCell>
                  <Badge>
                    {sale.saleType === 'ASSET' ? 'Asset' : 'Product'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sale.saleType === 'ASSET' 
                    ? sale.asset?.name 
                    : `${sale.product?.name} (${sale.quantity})`}
                </TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{formatCurrency(sale.unitPrice)}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(sale.totalAmount)}
                </TableCell>
                <TableCell>{sale.buyer || '-'}</TableCell>
                <TableCell>{sale.recordedBy.username}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(sale.id)}
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