import express from 'express';
import { prisma } from '../db/repository';
import cors from "../cors";
import authenticate from "../authenticate";

const router = express.Router();

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, authenticate.verifyAdmin, async (_req, res) => {
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
  const { name, email, photoHref } = req.body;
  // check if either email or name already exists in database. If so, I want to return an error message.

  try {
    const user = await prisma.user.signUp(email, name, photoHref);
    res.status(202).json(user).send();
  } catch (err) {
    console.log(err)
    res.status(403).send("Kunne ikke opprette bruker.")
  }
});

router.post('/signup/many', async (req, res) => {
  const { users } = req.body;
  try {
    const createdUsers = await prisma.user.signUpMany(users);
    const resultString = `Opprettet ${createdUsers.count} brukere`;
    res.status(202).json({ message: resultString });
  } catch (err) {
    console.log(err)
  }
});

export default router;
