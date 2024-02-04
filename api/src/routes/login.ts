import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from '../messages/email-service';
import passport from 'passport';
import authenticate from '../authenticate';
import cors from "../cors.ts";

const router = express.Router();

router.route('/')
  .options(cors.corsWithCredentials, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithCredentials, passport.authenticate('local', { session: false }), async (req, res) => {
    const token = authenticate.getToken(req.user!.id);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.cookie('AccessToken', token, { httpOnly: true, signed: true, maxAge: 7200000, secure: true, sameSite: 'none', domain: 'localhost' });
    res.status(204).end();
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

router.route('/logout')
  .options(cors.corsWithCredentials, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithCredentials, (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.clearCookie('AccessToken');
    res.status(204).end();
  });

export default router;