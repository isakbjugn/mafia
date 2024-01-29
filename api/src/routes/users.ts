import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.set('Content-Type', 'application/json');
    res.json(users)
    res.end();
  } catch(err) {
    console.log(err)
  }
})

export default router;
