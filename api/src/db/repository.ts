import {PrismaClient, type User} from "@prisma/client";

export const fetchUser = async (userId: number): User => {
  const prisma = new PrismaClient();
  const dbUser: User = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })
  return dbUser
}