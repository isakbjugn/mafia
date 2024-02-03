import express from 'express';
import authenticate from "../authenticate.ts";
import cors from "../cors.ts";

const router = express.Router();

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email
    }).end();
  });

export default router;
