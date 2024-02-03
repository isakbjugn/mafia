import { FormEvent, useState } from 'react';
import { login } from "../api/api.ts";
import { useUserStore } from "../store.ts";

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const fetchUser = useUserStore(state => state.fetchUser);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
    fetchUser();
  };

  return (
    <div>
      <h2>Logg inn</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord"/>
        <button type="submit">Logg inn</button>
      </form>
    </div>
  );
};
