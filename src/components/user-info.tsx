import { User } from "../store.ts";
import { useState } from "react";

const getUser = async () => {
  const res = await fetch('http://localhost:3000/auth', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const UserInfo = () => {
  const [user, setUser] = useState<User>();

  const handleClick = async () => {
    console.log('Henter bruker...')
    const user = await getUser();
    console.log('Vellykket henting av bruker: ' + user.name)
    setUser(user)
  }

  return (
    <span>
      <h2>{user ? <span>{user.name}</span> : <span>⚠️ Ikke logget inn</span>}</h2>
      <button onClick={handleClick}>Hent bruker</button>
    </span>
  )
}