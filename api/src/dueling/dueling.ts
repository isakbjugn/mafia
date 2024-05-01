import { notifyAboutDefeat, notifyAboutVictory } from "../messages/duel-results";
import { prisma } from "../db/repository";

export const initiateDuel = async (challengerId: string, targetId: string) => {
  const challenger = await prisma.user.getUser(challengerId);
  const target = await prisma.user.getUser(targetId);
  const duelOutcome = resolveDuel(challengerId, challenger.level, targetId, target.level);

  await prisma.user.levelUp(duelOutcome.winner);
  await prisma.user.loseLife(duelOutcome.loser);
  await prisma.user.claimTarget(duelOutcome.winner, duelOutcome.loser);

  notifyAboutVictory(duelOutcome.winner, duelOutcome.loser)
  notifyAboutDefeat(duelOutcome.winner, duelOutcome.loser)
}

type DuelOutcome = {
  winner: string;
  loser: string;
}

const resolveDuel = (challengerId: string, challengerLevel: number, targetId: string, targetLevel: number): DuelOutcome => {
  // Calculate level difference
  const levelDifference = challengerLevel - targetLevel;

  // Calculate win probability modifier using a sigmoid function
  // This function should ideally give a value between 0.5 and 1 for positive level differences,
  // and between 0 and 0.5 for negative level differences.
  // Adjust the steepness and midpoint of the sigmoid to control how much levels affect the outcome.
  const steepness = 0.05; // Controls how quickly the probability changes with level difference
  const winProbabilityModifier = 1 / (1 + Math.exp(-steepness * levelDifference));

  // Base win probability for the challenger
  const baseWinProbability = 0.5;

  // Adjusted win probability for the challenger
  const adjustedWinProbability = baseWinProbability + (winProbabilityModifier - 0.5);

  // Determine winner based on adjusted win probability
  const isChallengerWinner = Math.random() < adjustedWinProbability;

  return isChallengerWinner
    ? { winner: challengerId, loser: targetId }
    : { winner: targetId, loser: challengerId };
}