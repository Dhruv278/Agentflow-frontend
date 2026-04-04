export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PRO' | 'BYOK';
  status: 'ACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
  };
}

export interface MessageResponse {
  data: {
    message: string;
  };
}
