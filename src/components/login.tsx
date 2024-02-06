import { FormEvent, useState } from 'react';
import { login, resetPassword } from "../api/api.ts";
import { useUserStore } from "../store.ts";

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const fetchUser = useUserStore(state => state.fetchUser);
  const [message, setMessage] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
    fetchUser();
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    resetPassword(email)
      .then(() => setMessage('📧 Hvis e-posten din er registrert skal du snart motta nytt passord.'))
  }

  return (
    <div>
      <h2>Logg inn</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord"/>
        <button type="submit">Logg inn</button>
      </form>
      <form onSubmit={handleResetPassword}>
        <button type="submit">Få tilsendt passord</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
