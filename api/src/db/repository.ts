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
      async assignTargets(tMap: TargetMap, assassins: number[]) {
        await Promise.all(assassins.map(async (k: number) => {
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

export const fetchUser = async (userId: number): Promise<Partial<User>> => {
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
