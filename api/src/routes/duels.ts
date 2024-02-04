import express from 'express';
import { sendEventToAllClients, sendEventToClient } from '../clients/clients';

const router = express.Router();

// Example of triggering an event (this could be in response to a duel)
router.post('/all', (req, res) => {
  const { duelResult } = req.body;
  sendEventToAllClients(duelResult);
  res.status(204).end();
});

router.post('/', (req, res) => {
  const { duelResult, clientId } = req.body;
  sendEventToClient(duelResult, clientId);
  res.status(204).end();
});

export default router;
