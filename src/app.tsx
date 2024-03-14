import './app.css'
import { Login } from "./components/login.tsx";
import { useUserStore } from "./store.ts";
import { Home } from "./components/home.tsx";
import { useEffect } from "react";
import { publishSubscribe } from './sandkasse/ablyTest.ts'

function App() {
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <h1>🕵🏼‍ Mafia</h1>
      <button onClick={publishSubscribe}>Testknappen</button>
      {user ? <Home /> : <Login />}
    </>
  )
}

export default App
