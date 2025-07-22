import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { LIST_USERS} from '../api/queries';

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
import { CREATE_USER, UPDATE_USER } from '../api/mutations';

// Define DELETE_USER mutation if not already in queries.ts
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
    }
  }
`;

export default function UsersPage() {
  const { addToast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'WORKER',
    firstName: '',
    lastName: '',
    dateHired: '',
    salary: '',
  });

  // Fetch users
  const { data, loading, error, refetch } = useQuery(LIST_USERS);

  // Mutations
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      addToast({ title: 'User created successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error creating user', description: error.message, variant: 'destructive' });
    },
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      addToast({ title: 'User updated successfully' });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      addToast({ title: 'Error updating user', description: error.message, variant: 'destructive' });
    },
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      addToast({ title: 'User deleted successfully' });
      refetch();
    },
    onError: (error) => {
      addToast({ title: 'Error deleting user', description: error.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const variables = { 
      input: {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        ...(formData.password && { password: formData.password }),
        ...(formData.firstName && { firstName: formData.firstName }),
        ...(formData.lastName && { lastName: formData.lastName }),
        ...(formData.dateHired && { dateHired: formData.dateHired }),
        ...(formData.salary && { salary: parseFloat(formData.salary) }),
      }
    };

    if (currentUser) {
      updateUser({ variables: { id: currentUser.id, ...variables } });
    } else {
      createUser({ variables });
    }
  };

  const handleEdit = (user:any) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      dateHired: user.dateHired || '',
      salary: user.salary?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: any) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser({ variables: { id: userId } });
    }
  };

  const handleCreateNew = () => {
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'WORKER',
      firstName: '',
      lastName: '',
      dateHired: '',
      salary: '',
    });
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="WORKER">Worker</option>
                    <option value="ACCOUNTANT">Accountant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateHired">Date Hired</Label>
                  <Input
                    id="dateHired"
                    type="date"
                    value={formData.dateHired}
                    onChange={(e) => setFormData({...formData, dateHired: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>

              {!currentUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!currentUser}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentUser ? 'Update User' : 'Create User'}
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
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
{data?.allUsers?.map((user: { id: Key | null | undefined; username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; role: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; isActive: any; }) => (
  <TableRow key={user.id}>
    <TableCell>{user.username}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>{user.phone}</TableCell>
    <TableCell>
      <span className={`px-2 py-1 rounded-full text-xs ${
        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
        user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
        user.role === 'ACCOUNTANT' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {user.role}
      </span>
    </TableCell>
    <TableCell>
      <span className={`px-2 py-1 rounded-full text-xs ${
        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
    </TableCell>
    <TableCell>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(user)}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(user.id)}
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
    </div>
  );
}