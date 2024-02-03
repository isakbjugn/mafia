import { User as PrismaDefinedUser } from '@prisma/client';

export {};

declare global {
  namespace Express {
    interface User {
      id: PrismaDefinedUser['id'];
      name: PrismaDefinedUser['name'];
      email: PrismaDefinedUser['email'];
      admin: PrismaDefinedUser['admin'];
    }
  }
  interface Array<T> {
    dance(): T[];
  }
}