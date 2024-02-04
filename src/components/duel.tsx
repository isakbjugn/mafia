import { duel } from "../api/api.ts";

export const Duel = () => (
  <button onClick={() => duel(2)}>Dueller Frid!</button>
)