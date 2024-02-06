import { User } from '../store.ts';
import { Target } from '../components/duel.tsx'

// Utility function for making API requests
const BACKEND_HOST = 'http://localhost:3000'

const fetchWithCredentials = async <T>(url: string, method: string, body?: any): Promise<T> => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: method,
    headers: headers,
    credentials: 'include', // Include credentials for cross-origin requests
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_HOST}${url}`, config);

  if (response.status == 204) {
    return { } as T;
  }

  if (response.ok) {
    return response.json();
  }

  return Promise.reject({ message: response.statusText, status: response.status });
};

export const login = async (email: string, password: string) => {
  await fetchWithCredentials('/login', 'POST', { email, password });
};

export const getUser = async (): Promise<User> => {
  return fetchWithCredentials<User>('/auth', 'GET');
};

export const duel = async (targetId: number) => {
  await fetchWithCredentials('/duels', 'POST', { attemptedTargetId: targetId });
}

export const logout = async () => {
  await fetchWithCredentials('/login/logout', 'POST');
}

export const getTargets = async (): Promise<{ targets: Target[] }> => {
  return fetchWithCredentials<{ targets: Target[] }>('/targets', 'GET')
}