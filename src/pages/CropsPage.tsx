import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useToast } from '../components/ui/use-toast'
import { formatDate } from '../lib/utils'
import { CREATE_CROP, UPDATE_CROP, DELETE_CROP } from '../api/mutations'
import { LIST_CROPS } from '../api/queries'
import { CalendarIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'


const cropTypes = [
  { value: 'MAIZE', label: 'Maize' },
  { value: 'TOMATO', label: 'Tomato' },
  { value: 'WHEAT', label: 'Wheat' },
  { value: 'BEANS', label: 'Beans' },
  { value: 'RICE', label: 'Rice' },
]

export default function CropsPage() {
  const { addToast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCrop, setCurrentCrop] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    cropType: 'MAIZE',
    plantingDate: '',
    harvestDate: '',
    areaPlanted: '',
    expectedYield: '',
    yieldUnit: 'kg',
    farmId: '',
  })

  // Fetch crops
  const { data, loading, error, refetch } = useQuery(LIST_CROPS, {
    fetchPolicy: 'cache-and-network',
  })

  // Fetch farms for dropdown
  const { data: farmsData } = useQuery(gql`
    query ListFarms {
      allFarms {
            id
            name
      }
    }
  `)

  // Mutations
  const [createCrop] = useMutation(CREATE_CROP, {
    onCompleted: () => {
      addToast({ title: 'Crop created successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error creating crop', description: error.message, variant: 'destructive' })
    },
  })

  const [updateCrop] = useMutation(UPDATE_CROP, {
    onCompleted: () => {
      addToast({ title: 'Crop updated successfully' })
      refetch()
      setIsDialogOpen(false)
    },
    onError: (error) => {
      addToast({ title: 'Error updating crop', description: error.message, variant: 'destructive' })
    },
  })

  const [deleteCrop] = useMutation(DELETE_CROP, {
    onCompleted: () => {
      addToast({ title: 'Crop deleted successfully' })
      refetch()
    },
    onError: (error) => {
      addToast({ title: 'Error deleting crop', description: error.message, variant: 'destructive' })
    },
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const variables = { 
      input: {
        name: formData.name,
        cropType: formData.cropType,
        plantingDate: formData.plantingDate,
        harvestDate: formData.harvestDate || null,
        areaPlanted: parseFloat(formData.areaPlanted),
        expectedYield: parseFloat(formData.expectedYield),
        yieldUnit: formData.yieldUnit,
        farmId: formData.farmId,
      }
    }

    if (currentCrop) {
      updateCrop({ variables: { id: currentCrop.id, ...variables } })
    } else {
      createCrop({ variables })
    }
  }

  const handleEdit = (crop: any) => {
    setCurrentCrop(crop)
    setFormData({
      name: crop.name,
      cropType: crop.cropType,
      plantingDate: crop.plantingDate,
      harvestDate: crop.harvestDate || '',
      areaPlanted: crop.areaPlanted.toString(),
      expectedYield: crop.expectedYield.toString(),
      yieldUnit: crop.yieldUnit,
      farmId: crop.farm.id,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (cropId: any) => {
    if (confirm('Are you sure you want to delete this crop record?')) {
      deleteCrop({ variables: { id: cropId } })
    }
  }

  const handleCreateNew = () => {
    setCurrentCrop(null)
    setFormData({
      name: '',
      cropType: 'MAIZE',
      plantingDate: '',
      harvestDate: '',
      areaPlanted: '',
      expectedYield: '',
      yieldUnit: 'kg',
      farmId: farmsData?.allFarms[0]?.id || '',
    })
    setIsDialogOpen(true)
  }

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crop Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name/ID</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <select
                    id="cropType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.cropType}
                    onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                    required
                  >
                    {cropTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <div className="relative">
                    <Input
                      id="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    />
                    <CalendarIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="expectedYield">Expected Yield</Label>
                  <div className="flex">
                    <Input
                      id="expectedYield"
                      type="number"
                      step="0.1"
                      value={formData.expectedYield}
                      onChange={(e) => setFormData({...formData, expectedYield: e.target.value})}
                      required
                      className="rounded-r-none"
                    />
                    <select
                      className="flex h-10 w-20 rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-l-0"
                      value={formData.yieldUnit}
                      onChange={(e) => setFormData({...formData, yieldUnit: e.target.value})}
                    >
                      <option value="kg">kg</option>
                      <option value="tons">tons</option>
                      <option value="bags">bags</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmId">Farm</Label>
                <select
                  id="farmId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.farmId}
                  onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                  required
                >
                  {farmsData?.allFarms?.map(( farm: any ) => (
                    <option key={farm.id} value={farm.id}>{farm.name}</option>
                  ))}
                </select>
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
                  {currentCrop ? 'Update Crop' : 'Create Crop'}
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
              <TableHead>Name/ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Planted</TableHead>
              <TableHead>Harvest</TableHead>
              <TableHead>Area (ha)</TableHead>
              <TableHead>Expected Yield</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allCrops?.map(( crop:any ) => {
              const cropType = cropTypes.find(t => t.value === crop.cropType)?.label
              const isHarvested = crop.harvestDate && new Date(crop.harvestDate) <= new Date()
              
              return (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>{cropType}</TableCell>
                  <TableCell>{formatDate(crop.plantingDate)}</TableCell>
                  <TableCell>
                    {crop.harvestDate ? formatDate(crop.harvestDate) : '-'}
                  </TableCell>
                  <TableCell>{crop.areaPlanted}</TableCell>
                  <TableCell>
                    {crop.expectedYield} {crop.yieldUnit}
                  </TableCell>
                  <TableCell>{crop.farm.name}</TableCell>
                  <TableCell>
                    <Badge variant={isHarvested ? 'default' : 'secondary'}>
                      {isHarvested ? 'Harvested' : 'Growing'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(crop)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(crop.id)}
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