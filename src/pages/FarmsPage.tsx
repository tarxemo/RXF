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
import { PlusIcon, PencilIcon, TrashIcon, BarChart2 } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { Badge } from '../components/ui/badge';
import { LIST_FARMS } from '../api/queries';
import { CREATE_FARM, UPDATE_FARM } from '../api/mutations';

// Define DELETE_FARM mutation if not already in queries.ts
const DELETE_FARM = gql`
  mutation DeleteFarm($id: ID!) {
    deleteFarm(id: $id) {
      success
    }
  }
`;

export default function FarmsPage() {
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [currentFarm, setCurrentFarm] = useState<any>(null);
  const [performanceData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalHectares: '',
    establishedDate: '',
    description: '',
    managerId: '',
  });

  // Fetch farms
  const { data, loading, error, refetch } = useQuery(LIST_FARMS, {
    fetchPolicy: 'cache-and-network',
  });

  // Fetch managers for dropdown
  const { data: managersData } = useQuery(gql`
    query ListManagers {
      allUsers(filter: { role: "MANAGER" }) {
            id
            username
      }
    }
  `);

  // Mutations
  const [createFarm] = useMutation(CREATE_FARM, {
    onCompleted: () => {
      addToast({ title: 'Farm created successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error creating farm', description: error.message, variant: 'destructive' });
    },
  });

  const [updateFarm] = useMutation(UPDATE_FARM, {
    onCompleted: () => {
      addToast({ title: 'Farm updated successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error updating farm', description: error.message, variant: 'destructive' });
    },
  });

  const [deleteFarm] = useMutation(DELETE_FARM, {
    onCompleted: () => {
      addToast({ title: 'Farm deleted successfully' });
      refetch();
    },
    onError: (error) => {
      addToast({ title: 'Error deleting farm', description: error.message, variant: 'destructive' });
    },
  });

//   const [getFarmPerformance] = useMutation(FARM_PERFORMANCE, {
//     onCompleted: (data) => {
//       setPerformanceData(data.farmPerformance);
//     },
//     onError: (error) => {
//       addToast({ title: 'Error fetching farm performance', description: error.message, variant: 'destructive' });
//     },
//   });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const variables = { 
      input: {
        name: formData.name,
        location: formData.location,
        totalHectares: parseFloat(formData.totalHectares),
        establishedDate: formData.establishedDate,
        description: formData.description,
        ...(formData.managerId && { managerId: formData.managerId }),
      }
    };

    if (currentFarm) {
      updateFarm({ variables: { id: currentFarm?.id, ...variables } });
    } else {
      createFarm({ variables });
    }
  };

  const handleEdit = (farm: { id?: Key | null | undefined; name: any; location: any; totalHectares: any; manager: any; isActive?: any; establishedDate?: any; description?: any; }) => {
    setCurrentFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      totalHectares: farm.totalHectares.toString(),
      establishedDate: farm.establishedDate,
      description: farm.description || '',
      managerId: farm.manager?.id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (farmId: Key | null | undefined) => {
    if (confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      deleteFarm({ variables: { id: farmId } });
    }
  };

  const handleCreateNew = () => {
    setCurrentFarm(null);
    setFormData({
      name: '',
      location: '',
      totalHectares: '',
      establishedDate: '',
      description: '',
      managerId: '',
    });
    setIsDialogOpen(true);
  };

  const handleViewPerformance = (farmId: Key | null | undefined) => {
    getFarmPerformance({ variables: { farmId } });
    setIsPerformanceDialogOpen(true);
  };

  if (loading && !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Farm Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Farm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentFarm ? 'Edit Farm' : 'Add New Farm'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Farm Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalHectares">Total Hectares</Label>
                  <Input
                    id="totalHectares"
                    type="number"
                    step="0.01"
                    value={formData.totalHectares}
                    onChange={(e) => setFormData({...formData, totalHectares: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedDate">Established Date</Label>
                  <Input
                    id="establishedDate"
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData({...formData, establishedDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerId">Manager</Label>
                <select
                  id="managerId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.managerId}
                  onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                >
                  <option value="">Select Manager</option>
                    {managersData?.allUsers?.map((manager: { id: string | number | null | undefined; username: string }) => (
                      <option key={String(manager.id)} value={manager.id ?? ''}>{manager.username}</option>
                    ))}
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
                  {currentFarm ? 'Update Farm' : 'Create Farm'}
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
              <TableHead>Location</TableHead>
              <TableHead>Size (ha)</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.allFarms?.map((farm: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; totalHectares: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; manager: { username: any; }; isActive: any; } ) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">{farm.name}</TableCell>
                <TableCell>{farm.location}</TableCell>
                <TableCell>{farm.totalHectares}</TableCell>
                <TableCell>{farm.manager?.username || 'Unassigned'}</TableCell>
                <TableCell>
                  <Badge variant={farm.isActive ? 'default' : 'destructive'}>
                    {farm.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(farm)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPerformance(farm.id)}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(farm.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Performance Dialog */}
      <Dialog open={isPerformanceDialogOpen} onOpenChange={setIsPerformanceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Farm Performance</DialogTitle>
          </DialogHeader>
          {performanceData ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Assets</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Assets:</span>
                    <span className="font-medium">{performanceData?.totalAssets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livestock:</span>
                    <span className="font-medium">{performanceData?.totalLivestock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crops:</span>
                    <span className="font-medium">{performanceData?.totalCrops}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Financials</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-medium">${performanceData?.totalExpenses?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sales:</span>
                    <span className="font-medium">${performanceData?.totalSales?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profitability:</span>
                    <span className={`font-medium ${
                      performanceData?.profitability >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${performanceData?.profitability?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg col-span-2">
                <h3 className="font-semibold text-lg mb-2">Production Yield</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#4CAF50]">
                      {performanceData?.productionYield?.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500">Efficiency Rating</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getFarmPerformance(_arg0: { variables: { farmId: any; }; }) {
  throw new Error('Function not implemented.');
}
