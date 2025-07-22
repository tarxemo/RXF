import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
// import { formatDate } from '../lib/utils'
import { ALL_PRODUCTS, LIST_ASSETS } from '../api/queries'
import { CREATE_UPDATE_PRODUCT, DELETE_PRODUCT, MANAGE_PRODUCT_PRODUCTION, DELETE_PRODUCT_PRODUCTION } from '../api/mutations'
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'

export default function ProductsPage() {
  const { addToast } = useToast()
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [currentProduction, setCurrentProduction] = useState<any>(null)
  
  const [productForm, setProductForm] = useState({
    name: '',
    productType: 'MILK',
    description: '',
    unit: 'kg'
  })
  
  const [productionForm, setProductionForm] = useState({
    product_id: '',
    asset_id: '',
    production_rate: '',
    notes: ''
  })

  // Fetch products and assets
  const { data, loading, error, refetch } = useQuery(ALL_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
  })
  
  const { data: assetsData } = useQuery(LIST_ASSETS)

  // Mutations
  const [createUpdateProduct] = useMutation(CREATE_UPDATE_PRODUCT, {
    onCompleted: () => {
      addToast({ title: 'Product saved successfully' })
      refetch()
      setIsProductDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error saving product', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      addToast({ title: 'Product deleted' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting product', description: error.message, variant: 'destructive' })
    },
  })

  const [manageProduction] = useMutation(MANAGE_PRODUCT_PRODUCTION, {
    onCompleted: () => {
      addToast({ title: 'Production info saved' })
      refetch()
      setIsProductionDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error saving production info', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteProduction] = useMutation(DELETE_PRODUCT_PRODUCTION, {
    onCompleted: () => {
      addToast({ title: 'Production info deleted' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting production info', description: error.message, variant: 'destructive' })
    },
  })

  const handleProductSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    createUpdateProduct({
      variables: {
        input: {
          id: currentProduct?.id || null,
          ...productForm
        }
      }
    })
  }

  const handleProductionSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    manageProduction({
      variables: {
        input: {
          id: currentProduction?.id || null,
          ...productionForm,
          production_rate: parseFloat(productionForm.production_rate)
        }
      }
    })
  }

  const handleDeleteProduct = (productId: any) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ variables: { id: productId } })
    }
  }

  const handleDeleteProduction = (productionId: any) => {
    if (confirm('Are you sure you want to delete this production information?')) {
      deleteProduction({ variables: { id: productionId } })
    }
  }

  const handleCreateNewProduct = () => {
    setCurrentProduct(null)
    setProductForm({
      name: '',
      productType: 'MILK',
      description: '',
      unit: 'kg'
    })
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: { name: any; productType: any; description: any; unit: any }) => {
    setCurrentProduct(product)
    setProductForm({
      name: product.name,
      productType: product.productType,
      description: product.description,
      unit: product.unit
    })
    setIsProductDialogOpen(true)
  }

  const handleAddProduction = (product: { id: any }) => {
    setCurrentProduction(null)
    setProductionForm({
      product_id: product.id,
      asset_id: '',
      production_rate: '',
      notes: ''
    })
    setIsProductionDialogOpen(true)
  }

  const handleEditProduction = (production: any) => {
    setCurrentProduction(production)
    setProductionForm({
      product_id: production.product.id,
      asset_id: production.asset.id,
      production_rate: production.productionRate.toString(),
      notes: production.notes
    })
    setIsProductionDialogOpen(true)
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button onClick={handleCreateNewProduct}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="rounded-md border mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Production Sources</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allProducts?.map(( product: any ) => (
              <>
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.productType}</Badge>
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    {product.productionInfo?.length || 0} sources
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddProduction(product)}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                
                {/* Production details for each product */}
                {product.productionInfo?.map(( production: any) => (
                  <TableRow key={`prod-${production.id}`} className="bg-gray-50">
                    <TableCell colSpan={3} className="pl-12">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2">←</span>
                        {production.asset.name} ({production.asset.assetType})
                      </div>
                    </TableCell>
                    <TableCell>
                      {production.productionRate} {product.unit}/day
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProduction(production)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduction(production.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select
                  value={productForm.productType}
                  onValueChange={(value) => setProductForm({...productForm, productType: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILK">Milk</SelectItem>
                    <SelectItem value="MEAT">Meat</SelectItem>
                    <SelectItem value="EGGS">Eggs</SelectItem>
                    <SelectItem value="GRAIN">Grain</SelectItem>
                    <SelectItem value="VEGETABLE">Vegetable</SelectItem>
                    <SelectItem value="FRUIT">Fruit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={productForm.unit}
                  onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProductDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentProduct ? 'Update' : 'Create'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Production Dialog */}
      <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentProduction ? 'Edit Production Info' : 'Add Production Source'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductionSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">Source Asset</Label>
              <Select
                value={productionForm.asset_id}
                onValueChange={(value) => setProductionForm({...productionForm, asset_id: value})}
                required
                disabled={!!currentProduction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <optgroup label="Livestock">
                    {assetsData?.allLivestock?.map(( asset: any ) => (
                      <SelectItem key={`livestock-${asset.id}`} value={asset.id}>
                        {asset.name} ({asset.livestockType})
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="Crops">
                    {assetsData?.allCrops?.map(( asset: any ) => (
                      <SelectItem key={`crop-${asset.id}`} value={asset.id}>
                        {asset.name} ({asset.cropType})
                      </SelectItem>
                    ))}
                  </optgroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="production_rate">Production Rate</Label>
              <div className="flex items-center">
                <Input
                  id="production_rate"
                  type="number"
                  step="0.01"
                  value={productionForm.production_rate}
                  onChange={(e) => setProductionForm({...productionForm, production_rate: e.target.value})}
                  required
                  className="flex-1"
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  {data?.allProducts?.find((p: { id: string }) => p.id === productionForm.product_id)?.unit || 'unit'}/day
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={productionForm.notes}
                onChange={(e) => setProductionForm({...productionForm, notes: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProductionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentProduction ? 'Update' : 'Add'} Production
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}