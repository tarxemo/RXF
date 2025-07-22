import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
import { formatDate } from '../lib/utils'
import { LIST_FARMS, LIST_ASSETS } from '../api/queries'
import { CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET } from '../api/mutations'
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function AssetsPage() {
  const { addToast } = useToast();  // const { removeToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAsset, setCurrentAsset] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    assetType: 'LIVESTOCK',
    farmId: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    initialCost: '',
    notes: '',
    // Livestock specific
    livestockType: 'COW',
    breed: '',
    ageAtAcquisition: '',
    gender: 'M',
    isBreedingStock: false,
    // Crop specific
    cropType: 'MAIZE',
    plantingDate: new Date().toISOString().split('T')[0],
    harvestDate: new Date().toISOString().split('T')[0],
    areaPlanted: '',
    expectedYield: '',
    yieldUnit: 'kg'
  })

  // Fetch assets
  const { data, loading, error, refetch } = useQuery(LIST_ASSETS, {
    fetchPolicy: 'cache-and-network',
  })

  // Fetch farms and products
  const { data: farmsData } = useQuery(LIST_FARMS)

  // Mutations
  const [createAsset] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      addToast({ title: 'Asset created successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error creating asset', description: error.message, variant: 'destructive' })
    },
  })

  const [updateAsset] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
      addToast({ title: 'Asset updated successfully' })
      refetch()
      setIsEditDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error updating asset', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: () => {
      addToast({ title: 'Asset deleted' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting asset', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const input = {
      ...formData,
      initialCost: parseFloat(formData.initialCost),
      ageAtAcquisition: formData.assetType === 'LIVESTOCK' ? parseFloat(formData.ageAtAcquisition) : null,
      areaPlanted: formData.assetType === 'CROP' ? parseFloat(formData.areaPlanted) : null,
      expectedYield: formData.assetType === 'CROP' ? parseFloat(formData.expectedYield) : null,
    }
    
    createAsset({
      variables: { input }
    })
  }

  const handleUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const input = {
      id: currentAsset?.id,
      name: formData.name,
      notes: formData.notes,
      is_active: true,
      ...(currentAsset.assetType === 'LIVESTOCK' ? {
        breed: formData.breed,
        isBreedingStock: formData.isBreedingStock
      } : {
        harvestDate: formData.harvestDate,
        expectedYield: parseFloat(formData.expectedYield)
      })
    }
    
    updateAsset({
      variables: { input }
    })
  }

  const handleDelete = (assetId: any) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteAsset({ variables: { id: assetId } })
    }
  }

  const handleCreateNew = () => {
    setFormData({
      name: '',
      assetType: 'LIVESTOCK',
      farmId: '',
      acquisitionDate: new Date().toISOString().split('T')[0],
      initialCost: '',
      notes: '',
      livestockType: 'COW',
      breed: '',
      ageAtAcquisition: '',
      gender: 'M',
      isBreedingStock: false,
      cropType: 'MAIZE',
      plantingDate: new Date().toISOString().split('T')[0],
      harvestDate: '',
      areaPlanted: '',
      expectedYield: '',
      yieldUnit: 'kg'
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (asset: { name: any; notes: any; farm: { id: any }; assetType: string; livestockType: any; breed: any; ageAtAcquisition: any; gender: any; isBreedingStock: any; acquisitionDate: any; initialCost: any; cropType: any; plantingDate: any; harvestDate: any; areaPlanted: any; expectedYield: any; yieldUnit: any }) => {
    setCurrentAsset(asset)
    const commonData = {
      name: asset.name,
      notes: asset.notes ?? '',
      farmId: asset.farm.id,
    }
    
      if (asset.assetType === 'LIVESTOCK') {
        setFormData({
          ...commonData,
          assetType: 'LIVESTOCK',
          livestockType: asset.livestockType || '',
          breed: asset.breed || '',
          ageAtAcquisition: asset.ageAtAcquisition || '',
          gender: asset.gender || '',
          isBreedingStock: asset.isBreedingStock || false,
          cropType: '',
          plantingDate: '',
          harvestDate: '',
          areaPlanted: '',
          expectedYield: '',
          yieldUnit: '',
          acquisitionDate: asset.acquisitionDate || '',
          initialCost: asset.initialCost || '',
        });
      } else {
        setFormData({
          ...commonData,
          assetType: 'CROP',
          livestockType: '',
          breed: '',
          ageAtAcquisition: '',
          gender: '',
          isBreedingStock: false,
          cropType: asset.cropType || '',
          plantingDate: asset.plantingDate || '',
          harvestDate: asset.harvestDate || '',
          areaPlanted: asset.areaPlanted || '',
          expectedYield: asset.expectedYield || '',
          yieldUnit: asset.yieldUnit || '',
          acquisitionDate: asset.acquisitionDate || '',
          initialCost: asset.initialCost || '',
        });
      }

    setIsEditDialogOpen(true)
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Farm Assets Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => setFormData({...formData, assetType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIVESTOCK">Livestock</SelectItem>
                      <SelectItem value="CROP">Crop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmId">Farm</Label>
                  <Select
                    value={formData.farmId}
                    onValueChange={(value) => setFormData({...formData, farmId: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmsData?.allFarms?.map(( farm: any ) => (
                        <SelectItem key={farm.id} value={farm?.id}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({...formData, acquisitionDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialCost">Initial Cost</Label>
                  <Input
                    id="initialCost"
                    type="number"
                    step="0.01"
                    value={formData.initialCost}
                    onChange={(e) => setFormData({...formData, initialCost: e.target.value})}
                    required
                  />
                </div>
                {formData.assetType === 'LIVESTOCK' ? (
                  <div className="space-y-2">
                    <Label htmlFor="ageAtAcquisition">Age at Acquisition (years)</Label>
                    <Input
                      id="ageAtAcquisition"
                      type="number"
                      step="0.1"
                      value={formData.ageAtAcquisition}
                      onChange={(e) => setFormData({...formData, ageAtAcquisition: e.target.value})}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="areaPlanted">Area Planted (ha)</Label>
                    <Input
                      id="areaPlanted"
                      type="number"
                      step="0.01"
                      value={formData.areaPlanted}
                      onChange={(e) => setFormData({...formData, areaPlanted: e.target.value})}
                      required
                    />
                  </div>
                )}
              </div>

              {formData.assetType === 'LIVESTOCK' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="livestockType">Livestock Type</Label>
                      <Select
                        value={formData.livestockType}
                        onValueChange={(value) => setFormData({...formData, livestockType: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COW">Cow</SelectItem>
                          <SelectItem value="GOAT">Goat</SelectItem>
                          <SelectItem value="PIG">Pig</SelectItem>
                          <SelectItem value="CHICKEN">Chicken</SelectItem>
                          <SelectItem value="SHEEP">Sheep</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({...formData, gender: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={formData.breed}
                        onChange={(e) => setFormData({...formData, breed: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="isBreedingStock"
                        checked={formData.isBreedingStock}
                        onChange={(e) => setFormData({...formData, isBreedingStock: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label htmlFor="isBreedingStock">Breeding Stock</Label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Select
                        value={formData.cropType}
                        onValueChange={(value) => setFormData({...formData, cropType: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAIZE">Maize</SelectItem>
                          <SelectItem value="TOMATO">Tomato</SelectItem>
                          <SelectItem value="WHEAT">Wheat</SelectItem>
                          <SelectItem value="BEANS">Beans</SelectItem>
                          <SelectItem value="RICE">Rice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plantingDate">Planting Date</Label>
                      <Input
                        id="plantingDate"
                        type="date"
                        value={formData.plantingDate}
                        onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="harvestDate">Expected Harvest Date</Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        value={formData.harvestDate}
                        onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedYield">Expected Yield (per ha)</Label>
                      <Input
                        id="expectedYield"
                        type="number"
                        step="0.01"
                        value={formData.expectedYield}
                        onChange={(e) => setFormData({...formData, expectedYield: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yieldUnit">Yield Unit</Label>
                    <Input
                      id="yieldUnit"
                      value={formData.yieldUnit}
                      onChange={(e) => setFormData({...formData, yieldUnit: e.target.value})}
                    />
                  </div>
                </>
              )}

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
                  Save Asset
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name">Name</Label>
                  <Input
                    id="edit_name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Farm</Label>
                  <Input
                    value={currentAsset?.farm?.name || ''}
                    disabled
                  />
                </div>
              </div>

              {currentAsset?.assetType === 'LIVESTOCK' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_breed">Breed</Label>
                    <Input
                      id="edit_breed"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="edit_isBreedingStock"
                      checked={formData.isBreedingStock}
                      onChange={(e) => setFormData({...formData, isBreedingStock: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="edit_isBreedingStock">Breeding Stock</Label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_harvestDate">Harvest Date</Label>
                    <Input
                      id="edit_harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_expectedYield">Expected Yield (per ha)</Label>
                    <Input
                      id="edit_expectedYield"
                      type="number"
                      step="0.01"
                      value={formData.expectedYield}
                      onChange={(e) => setFormData({...formData, expectedYield: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit_notes">Notes</Label>
                <textarea
                  id="edit_notes"
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
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Asset
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Acquisition Date</TableHead>
              <TableHead>Initial Cost</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allLivestock?.map(( asset: any ) => (
              <TableRow key={`livestock-${asset.id}`}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Livestock</Badge>
                </TableCell>
                <TableCell>{asset.farm?.name}</TableCell>
                <TableCell>{formatDate(asset.acquisitionDate)}</TableCell>
                <TableCell>${asset.initialCost}</TableCell>
                <TableCell>
                  {asset.livestockType} • {asset.gender === 'M' ? 'Male' : 'Female'} • {asset.ageAtAcquisition} yrs
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(asset)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.allCrops?.map(( asset: any ) => (
              <TableRow key={`crop-${asset.id}`}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Crop</Badge>
                </TableCell>
                <TableCell>{asset.farm?.name}</TableCell>
                <TableCell>{formatDate(asset.acquisitionDate)}</TableCell>
                <TableCell>${asset.initialCost}</TableCell>
                <TableCell>
                  {asset.cropType} • {asset.areaPlanted} ha
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(asset)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(asset.id)}
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