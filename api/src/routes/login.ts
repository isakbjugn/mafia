import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from "../messages/email-service.ts";

const router = express.Router();

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
