import { User } from "../store.ts";

// Utility function for making API requests
const fetchWithCredentials = async (url: string, method: string, body?: any): Promise<Response> => {
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

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response;
};

export const login = async (email: string, password: string) => {
  await fetchWithCredentials('http://localhost:3000/login', 'POST', { email, password });
};

export const getUser = async (): Promise<User> => {
  const response = await fetchWithCredentials('http://localhost:3000/auth', 'GET');
  return await response.json();
};

export const logout = async () => {
  await fetchWithCredentials('http://localhost:3000/login/logout', 'POST');
}
