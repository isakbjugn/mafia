import { FormEvent, useState } from 'react';

const login = async (email: string, password: string) => {
  const res = await fetch('http://localhost:3000/login', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
};

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div>
      <h1>Logg inn</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord"/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
