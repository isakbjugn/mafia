import { PrismaClient, type User } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async getName(userId: number) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            name: true
          }
        })
        return user.name
      },

      async getUser(userId: number) {
        return prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            name: true,
            email: true,
            lives: true,
            level: true
          }
        })
      },

      async getTargets(userId: number) {
        const userWithTargets: { targets: number[] } = await prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            targets: true
          }
        })
        return userWithTargets.targets
      },

      async levelUp(userId: number) {
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            level: {
              increment: 1
            }
          }
        })
      },

      async removeTarget(userId: number, targetId: number) {
        const originalTargets: number[] = await prisma.user.getTargets(userId);
        const updatedTargets = originalTargets.filter(id => id !== targetId);
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            targets: updatedTargets
          }
        })
        return prisma.user.getTargets(userId)
      },

      async loseLife(userId: number) {
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            lives: {
              decrement: 1
            }
          }
        })
      },

      async isAlive(userId: number) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            lives: true
          }
        })
        return user.lives > 0
      }
    }
  }
})

export const fetchUser = async (userId: number): User => {
  return prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      targets: true
    }
  });
}
