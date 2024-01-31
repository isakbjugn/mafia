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
});

router.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;
  // check if either email or name already exists in database. If so, I want to return an error message.

  if (await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { name: name }
      ]
    }
  })) {
    res.setHeader('Content-Type', 'application/json');
    const err = new Error('Brukernavn eller epost er allerede i bruk.')
    res.statusCode = 403;
    res.json(err)
    res.end();
  }

  try {
    const user = await prisma.user.create({
      data: { email, name, password }
    })
    res.set('Content-Type', 'application/json');
    res.cookie('session', { id: user.id }, { httpOnly: true, secure: true, sameSite: 'none' })
    res.json(user)
    res.end();
  } catch(err) {
    console.log(err)
  }
});

export default router;
