import { FormEvent, useState } from 'react';
import { User, useUserStore } from "../store.ts";
import { useNavigate } from "react-router-dom";

const registerUser = async (name: string, email: string): Promise<User> => {
  const res = await fetch('http://localhost:3000/users/signup', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      name: name,
      email: email,
    }),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const CreateUser = () => {
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await registerUser(name, email);

    setUser(user);
    navigate('/hjem');
  };

  return (
    <div>
      <h1>Opprett bruker</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Brukernavn"/>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadresse"/>
        <button type="submit">Opprett bruker</button>
      </form>
    </div>
  );
}
