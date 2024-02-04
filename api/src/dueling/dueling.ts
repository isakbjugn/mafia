import { notifyAboutDefeat, notifyAboutVictory } from "../messages/duel-results.ts";
import { prisma } from "../db/repository.ts";

export const initiateDuel = async (challengerId: number, targetId: number) => {
  const duelOutcome = resolveDuel(challengerId, targetId);
  await prisma.user.levelUp(duelOutcome.winner);
  await prisma.user.loseLife(duelOutcome.loser);
  await prisma.user.removeTarget(challengerId, targetId);

  notifyAboutVictory(duelOutcome.winner, duelOutcome.loser)
  notifyAboutDefeat(duelOutcome.winner, duelOutcome.loser)
}

type DuelOutcome = {
  winner: number;
  loser: number;
}

const resolveDuel = (challengerId: number, targetId: number): DuelOutcome => {
  // each player has a 50% chance of winning
  return Math.random() > 0.5
    ? { winner: challengerId, loser: targetId }
    : { winner: targetId, loser: challengerId };
}