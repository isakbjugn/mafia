import express from 'express';
import type { User } from '@prisma/client';
import authenticate from "../authenticate.ts";

const router = express.Router();

router.get('/', authenticate.verifyUser, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ id: (req.user as User).id, name: (req.user as User).name }).end();
});

export default router;
