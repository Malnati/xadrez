import type { ClockPreset, GameMode, GameSnapshot } from '@xadrez/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type SessionUser = { id: string; email: string; name?: string | null; avatarUrl?: string | null };

export function getStoredToken() {
  return localStorage.getItem('xadrez_token');
}

export function storeToken(token: string) {
  localStorage.setItem('xadrez_token', token);
}

export function clearToken() {
  localStorage.removeItem('xadrez_token');
}

export function loginUrl() {
  return `${API_URL}/auth/google/start`;
}

export async function getMe(): Promise<SessionUser | null> {
  const token = getStoredToken();
  if (!token) return null;
  const response = await fetch(`${API_URL}/me`, { headers: authHeaders(token) });
  if (!response.ok) return null;
  const payload = (await response.json()) as { user: SessionUser };
  return payload.user;
}

export async function createRemoteGame(mode: GameMode, clock: ClockPreset): Promise<GameSnapshot | null> {
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authHeaders(getStoredToken()) },
      body: JSON.stringify({ mode, clock }),
    });
    if (!response.ok) return null;
    return (await response.json()) as GameSnapshot;
  } catch {
    return null;
  }
}

export async function fetchHistory(): Promise<GameSnapshot[]> {
  try {
    const response = await fetch(`${API_URL}/games/history`, { headers: authHeaders(getStoredToken()) });
    if (!response.ok) return [];
    return (await response.json()) as GameSnapshot[];
  } catch {
    return [];
  }
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { authorization: `Bearer ${token}` } : {};
}
