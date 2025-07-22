import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { Badge } from '../components/ui/badge';
import { CREATE_LIVESTOCK, UPDATE_LIVESTOCK } from '../api/mutations';
import { LIST_LIVESTOCK, LIST_FARMS } from '../api/queries';

const DELETE_LIVESTOCK = gql`
  mutation DeleteLivestock($id: ID!) {
    deleteLivestock(id: $id) {
      success
    }
  }
`;

export default function LivestockPage() {
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    livestockType: 'COW',
    breed: '',
    ageAtAcquisition: '',
    gender: 'F',
    isBreedingStock: false,
    acquisitionDate: '',
    initialCost: '',
    notes: '',
    farmId: '',
  });

  // Fetch livestock
  const { data, loading, error, refetch } = useQuery(LIST_LIVESTOCK, {
    fetchPolicy: 'cache-and-network',
  });

  // Fetch farms for dropdown
  const { data: farmsData } = useQuery(LIST_FARMS);

  // Mutations
  const [createLivestock] = useMutation(CREATE_LIVESTOCK, {
    onCompleted: () => {
      addToast({ title: 'Livestock created successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error creating livestock', description: error.message, variant: 'destructive' });
    },
  });

  const [updateLivestock] = useMutation(UPDATE_LIVESTOCK, {
    onCompleted: () => {
      addToast({ title: 'Livestock updated successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error updating livestock', description: error.message, variant: 'destructive' });
    },
  });

  const [deleteLivestock] = useMutation(DELETE_LIVESTOCK, {
    onCompleted: () => {
      addToast({ title: 'Livestock deleted successfully' });
      refetch();
    },
    onError: (error) => {
      addToast({ title: 'Error deleting livestock', description: error.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const variables = { 
      input: {
        name: formData.name,
        livestockType: formData.livestockType,
        breed: formData.breed,
        ageAtAcquisition: parseFloat(formData.ageAtAcquisition),
        gender: formData.gender,
        isBreedingStock: formData.isBreedingStock,
        acquisitionDate: formData.acquisitionDate,
        initialCost: parseFloat(formData.initialCost),
        notes: formData.notes,
        farmId: formData.farmId,
      }
    };

    if (currentLivestock) {
      updateLivestock({ variables: { id: currentLivestock.id, ...variables } });
    } else {
      createLivestock({ variables });
    }
  };

  const handleEdit = (livestock:any) => {
    setCurrentLivestock(livestock);
    setFormData({
      name: livestock?.name,
      livestockType: livestock.livestockType,
      breed: livestock.breed || '',
      ageAtAcquisition: livestock.ageAtAcquisition.toString(),
      gender: livestock.gender,
      isBreedingStock: livestock.isBreedingStock,
      acquisitionDate: livestock.acquisitionDate,
      initialCost: livestock.initialCost.toString(),
      notes: livestock.notes || '',
      farmId: livestock.farm.id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (livestockId: Key | null | undefined) => {
    if (confirm('Are you sure you want to delete this livestock record?')) {
      deleteLivestock({ variables: { id: livestockId } });
    }
  };

  const handleCreateNew = () => {
    setCurrentLivestock(null);
    setFormData({
      name: '',
      livestockType: 'COW',
      breed: '',
      ageAtAcquisition: '',
      gender: 'F',
      isBreedingStock: false,
      acquisitionDate: '',
      initialCost: '',
      notes: '',
      farmId: farmsData?.allFarms[0]?.id || '',
    });
    setIsDialogOpen(true);
  };

  if (loading && !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const livestockTypes = [
    { value: 'COW', label: 'Cow' },
    { value: 'GOAT', label: 'Goat' },
    { value: 'PIG', label: 'Pig' },
    { value: 'CHICKEN', label: 'Chicken' },
    { value: 'SHEEP', label: 'Sheep' },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Livestock Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Livestock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentLivestock ? 'Edit Livestock' : 'Add New Livestock'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name/ID</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livestockType">Type</Label>
                  <select
                    id="livestockType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.livestockType}
                    onChange={(e) => setFormData({...formData, livestockType: e.target.value})}
                    required
                  >
                    {livestockTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    required
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
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
                    {farmsData?.allFarms?.map((farm: any ) => (
                      <option key={String(farm.id)} value={farm.id ?? ""}>{farm.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isBreedingStock"
                  type="checkbox"
                  checked={formData.isBreedingStock}
                  onChange={(e) => setFormData({...formData, isBreedingStock: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="isBreedingStock">Breeding Stock</Label>
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
                  {currentLivestock ? 'Update Livestock' : 'Create Livestock'}
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
              <TableHead>Breed</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Breeding</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allLivestock?.map(( livestock: { livestockType: string; acquisitionDate: string | number | Date; ageAtAcquisition: string; id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; breed: any; gender: string; farm: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; isBreedingStock: any; } ) => {
              const livestockType = livestockTypes.find(t => t.value === livestock.livestockType)?.label;
              const age = new Date().getFullYear() - new Date(livestock.acquisitionDate).getFullYear() + parseFloat(livestock.ageAtAcquisition);
              
              return (
                <TableRow key={livestock.id}>
                  <TableCell className="font-medium">{livestock.name}</TableCell>
                  <TableCell>{livestockType}</TableCell>
                  <TableCell>{livestock.breed || '-'}</TableCell>
                  <TableCell>{livestock.gender === 'F' ? 'Female' : 'Male'}</TableCell>
                  <TableCell>{age.toFixed(1)} years</TableCell>
                  <TableCell>{livestock.farm.name}</TableCell>
                  <TableCell>
                    <Badge variant={livestock.isBreedingStock ? 'default' : 'outline'}>
                      {livestock.isBreedingStock ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(livestock)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(livestock.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}