import express from 'express';
import { PrismaClient, type User } from '@prisma/client';
import { sendOtpEmail } from '../messages/email-service';
import passport from 'passport';
import authenticate from '../authenticate';

const router = express.Router();

router.post('/', passport.authenticate('local', { session: false }), async (req, res) => {
  const token = authenticate.getToken((req.user as User).id);
  res.cookie('AccessToken', token, { httpOnly: true, secure: true, signed: true });
  res.send();
});

router.post('/otp', async (req, res) => {
  const { email } = req.body;
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    })
    if (user) {
      await sendOtpEmail(user);
      res.status(204).end();
    } else {
      res.status(404).send('E-posten er ikke knyttet til en eksisterende bruker.');
    }
  } catch(err) {
    console.log(err)
  }
});

export default router;
