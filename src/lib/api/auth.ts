import api from './axios';
import type { AuthResponse, MessageResponse, User } from '@/types/auth.types';

export async function apiRegister(
  name: string,
  email: string,
): Promise<string> {
  const res = await api.post<MessageResponse>('/auth/register', {
    name,
    email,
  });
  return res.data.data.message;
}

export async function apiSetPassword(
  token: string,
  password: string,
): Promise<User> {
  const res = await api.post<AuthResponse>('/auth/set-password', {
    token,
    password,
  });
  return res.data.data.user;
}

export async function apiResendVerification(email: string): Promise<string> {
  const res = await api.post<MessageResponse>('/auth/resend-verification', {
    email,
  });
  return res.data.data.message;
}

export async function apiForgotPassword(email: string): Promise<string> {
  const res = await api.post<MessageResponse>('/auth/forgot-password', {
    email,
  });
  return res.data.data.message;
}

export async function apiResetPassword(
  token: string,
  password: string,
): Promise<string> {
  const res = await api.post<MessageResponse>('/auth/reset-password', {
    token,
    password,
  });
  return res.data.data.message;
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<User> {
  const res = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return res.data.data.user;
}

export async function apiLogout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function apiGetMe(): Promise<User> {
  const res = await api.get<AuthResponse>('/auth/me');
  return res.data.data.user;
}

export async function apiRefresh(): Promise<User> {
  const res = await api.post<AuthResponse>('/auth/refresh');
  return res.data.data.user;
}
