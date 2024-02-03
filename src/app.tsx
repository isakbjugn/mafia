import './app.css'
import { Login } from "./components/login.tsx";
import { useUserStore } from "./store.ts";
import { Home } from "./components/home.tsx";

function App() {
  const user = useUserStore(state => state.user);

  return (
    <>
      <h1>🕵🏼‍ Mafia</h1>
      {user ? <Home /> : <Login />}
    </>
  )
}

export default App
