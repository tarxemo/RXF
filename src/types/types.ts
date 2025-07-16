// src/types.ts

export interface User {
  username: string;
  email: string;
  phone?: string;
  role?: string;
  salary?: number;
}

export interface LoginUserData {
  loginUser: {
    user: User;
  };
}

export interface LoginUserVars {
  username: string;
  password: string;
}
