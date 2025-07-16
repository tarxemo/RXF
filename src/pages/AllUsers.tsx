import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_USERS } from '../api/queries';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  dateJoined: string;
  dateHired: string;
}

const AllUsers: React.FC = () => {
  const { loading, error, data } = useQuery<{ allUsers: User[] }>(ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {data?.allUsers.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong> - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
