import api from './axios';
import type {
  OrKeyStatus,
  OrKeyStatusResponse,
  SaveOrKeyResponse,
} from '@/types/settings.types';

export async function apiGetOrKeyStatus(): Promise<OrKeyStatus> {
  const res = await api.get<OrKeyStatusResponse>('/settings/or-key/status');
  return res.data.data;
}

export async function apiSaveOrKey(key: string): Promise<string> {
  const res = await api.patch<SaveOrKeyResponse>('/settings/or-key', { key });
  return res.data.data.message;
}

export async function apiDeleteOrKey(): Promise<void> {
  await api.delete('/settings/or-key');
}
