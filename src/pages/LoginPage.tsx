// src/components/Login.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../api/mutations';
import type { LoginUserData, LoginUserVars, User } from '../types/types';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loginUser, { loading }] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER, {
    onCompleted: (data) => {
      setUser(data.loginUser.user);
      setError(null);
      // Tokens are set by backend as HTTP-only cookies, no need to save here
    },
    onError: (err) => {
      setError(err.message);
      setUser(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ variables: { username, password } });
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          required
          autoComplete="username"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
