import express from 'express';
import authenticate from "../authenticate.ts";
import cors from "../cors.ts";

const router = express.Router();

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      email: req.user!.email,
      name: req.user!.name,
      lives: req.user!.lives,
      level: req.user!.level
    }).end();
  });

export default router;
