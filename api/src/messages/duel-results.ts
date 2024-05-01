import { prisma } from "../db/repository";
import { sendEventToClient } from "../clients/clients";

export const notifyAboutVictory = async (winnerId: string, loserId: string) => {
  const loserName = await prisma.user.getName(loserId);
  const winner = await prisma.user.getUser(winnerId);
  const winnerMessage = `Du vant mot ${loserName}, og er nå level ${winner.level}!`
  sendEventToClient({ message: winnerMessage }, winnerId);
}

export const notifyAboutDefeat = async (winnerId: string, loserId: string) => {
  const winnerName = await prisma.user.getName(winnerId);
  const loser = await prisma.user.getUser(loserId);
  const loserMessage = getLoserMessage(winnerName, loser.lives)
  sendEventToClient({ message: loserMessage }, loserId);
}

const getLoserMessage = (winnerName: string, loserLives: number) => {
  switch (loserLives) {
    case 0:
      return `Du tapte mot ${winnerName}, og har ingen liv igjen!`;
    case 1:
      return `Du tapte mot ${winnerName}, og har 1 liv igjen!`;
    default:
      return `Du tapte mot ${winnerName}, og har ${loserLives} liv igjen!`;
  }
}