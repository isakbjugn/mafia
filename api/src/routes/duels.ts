import express from 'express';
import { sendEventToAllClients } from "./events.ts";

const router = express.Router();

// Example of triggering an event (this could be in response to a duel)
router.post('/', (req, res) => {
  const { duelResult } = req.body;
  sendEventToAllClients(duelResult);
  res.status(204).end();
});

export default router;
