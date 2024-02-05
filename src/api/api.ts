import { User } from "../store.ts";

// Utility function for making API requests
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

  const response = await fetch(url, config);

  if (response.ok) {
    return response.json();
  }

  return Promise.reject({ message: response.statusText, status: response.status });
};

export const login = async (email: string, password: string) => {
  await fetchWithCredentials('http://localhost:3000/login', 'POST', { email, password });
};

export const getUser = async (): Promise<User> => {
  return fetchWithCredentials<User>('http://localhost:3000/auth', 'GET');
};

export const duel = async (targetId: number) => {
  await fetchWithCredentials('http://localhost:3000/duels', 'POST', { attemptedTargetId: targetId })
}

export const logout = async () => {
  await fetchWithCredentials('http://localhost:3000/login/logout', 'POST');
}