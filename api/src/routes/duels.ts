import express from 'express';
import cors from "../cors.ts";
import authenticate from "../authenticate.ts";
import { initiateDuel } from "../dueling/dueling.ts";

const router = express.Router();

// Example of triggering an event (this could be in response to a duel)
router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .post(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, (req, res) => {
    const { attemptedTargetId } = req.body;
    if (req.user!.targets.includes(attemptedTargetId)) {
      initiateDuel(req.user!.id, attemptedTargetId);
      res.status(200).send('Duell startet!');
    } else {
      res.status(403).send('Du kan ikke utfordre denne spilleren');
    }
  });

export default router;
