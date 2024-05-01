import { PrismaClient, type User } from "@prisma/client";
import type { TargetMap } from "../routes/initiate";

export const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async signUp(email: string, name: string, photoHref: string) {
        const createdUser = await prisma.user.create({
          data: {
            email: email,
            name: name,
            password: createPassword(),
            photoHref: photoHref ?? 'https://picsum.photos/512/512'
          },
        });
        return { name: createdUser.name, email: createdUser.email, lives: createdUser.lives, level: createdUser.level }
      },

      async signUpMany(users: { email: string, name: string, photoHref: string }[]) {
        const usersWithPasswords = users.map(user => {
          return {
            email: user.email,
            name: user.name,
            password: createPassword(),
            photoHref: user.photoHref ?? 'https://picsum.photos/512/512'
          }
        })
        return prisma.user.createMany({
          data: usersWithPasswords
        });
      },

      async getName(userId: string) {
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

      async getUser(userId: string) {
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

      async getTargets(userId: string) {
        const userWithTargets: { targets: string[] } = await prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            targets: true
          }
        })
        return userWithTargets.targets
      },

      async levelUp(userId: string) {
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

      async setTargetByIndex(userId: string, targetIndex: | 0 | 1 | 2, targetId: string) {
        const originalTargets: string[] = await prisma.user.getTargets(userId);
        const originalTargetAtIndex = originalTargets[targetIndex];

        const updatedTargets = [...originalTargets];
        updatedTargets[targetIndex] = targetId;

        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            targets: updatedTargets
          }
        })
        return originalTargetAtIndex
      },

      async removeTarget(userId: string, targetIndex: | 0 | 1 | 2) {
        return prisma.user.setTargetByIndex(userId, targetIndex, '')
      },

      async findUserWithTargetAtIndex(targetId: string, targetIndex: | 0 | 1 | 2) {
        const users = await prisma.user.findMany();
        return users.find(user => {
          return user.targets[targetIndex] === targetId
        })
      },

      async claimTarget(winnerId: string, loserId: string) {
        const winnerTargets: string[] = await prisma.user.getTargets(winnerId);
        if (winnerTargets.includes(loserId)) {
          // Her har vi logikk for at utfordreren vant, og overtar taperens mål med samme indeks
          const whichGameLoop = winnerTargets.indexOf(loserId) as 0 | 1 | 2;
          const removedTarget = await prisma.user.removeTarget(loserId, whichGameLoop);

          if (removedTarget === winnerId) {
            // Vinneren har fått seg selv, og løkken er derfor ferdig
            return prisma.user.removeTarget(winnerId, whichGameLoop)
          } else {
            return prisma.user.setTargetByIndex(winnerId, whichGameLoop, removedTarget)
          }
        } else {
          const loserTargets = await prisma.user.getTargets(loserId);
          const whichGameLoop = loserTargets.indexOf(winnerId) as 0 | 1 | 2;
          // Her har vi logikk for at taperen vant, og den som har utfordreren som mål med samme indeks, må nå finne vinneren
          const personWithChallengerAsTarget = await prisma.user.findUserWithTargetAtIndex(loserId, whichGameLoop)
          const removedTarget = await prisma.user.removeTarget(loserId, whichGameLoop);
          return prisma.user.setTargetByIndex(personWithChallengerAsTarget.id, whichGameLoop, removedTarget)
        }
      },

      async loseLife(userId: string) {
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

      async isAlive(userId: string) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId
          },
          select: {
            lives: true
          }
        })
        return user.lives > 0
      },

      async allUserIds() {
        return await prisma.user.findMany({
          select: {
            id: true
          },
          orderBy: {
            id: 'asc'
          }
        })
      },
      async assignTargets(tMap: TargetMap, assassins: string[]) {
        await Promise.all(assassins.map(async (k: string) => {
          await prisma.user.update({
            where: {
              id: k
            },
            data: {
              targets: [tMap[k][0], tMap[k][1], tMap[k][2]]
            }
          })
        }))
      }
    }
  }
})

const createPassword = () => {
  const passComponents = (process.env.PASS_COMPONENTS as string).split(', ');
  const randomPassComponent = passComponents[Math.floor(Math.random() * passComponents.length)]
  const randomInt = Math.floor(Math.random() * 100);
  return `${randomPassComponent}-${randomInt}`
}

export const fetchUser = async (userId: string): Promise<Partial<User>> => {
  return prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      targets: true,
      photoHref: true
    }
  });
}
