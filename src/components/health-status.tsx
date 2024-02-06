import { useUserStore } from "../store.ts";

export const HealthStatus = () => {
  const user = useUserStore(state => state.user);
  if(!user) {
    return(
      <div>Laster..</div>
    )
  }
  return(
    <div>
      {user.lives !== 0 ?
        <h2>Antall liv: {"💓 ".repeat(user.lives)}</h2>
        :
        <div>
            <h2>💀💀 Du er død 💀💀</h2>
            <div>Bedre lykke neste år!🤞🤞</div>
        </div>
      }
      <h3>🎖 Level {user.level} 🎖</h3>
    </div>
  )
}