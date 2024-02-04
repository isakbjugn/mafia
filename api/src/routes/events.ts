import express, { type NextFunction, type Request, type Response } from 'express';
import authenticate from "../authenticate.ts";
import cors from "../cors.ts";
import { addClient, removeClient, sendEventToAllClients, sendEventToClient } from "../clients/clients.ts";

const router = express.Router();

// Middleware for setting SSE headers
const sseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  next();
};

router.use('/', sseMiddleware);

// SSE endpoint
router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, (req, res) => {
    // Send a keep-alive message to prevent the connection from closing
    const keepAlive = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 30000);

    addClient(req.user!.id, res);

    // Remove this client from the array when the connection is closed
    req.on('close', () => {
      clearInterval(keepAlive);
      removeClient(req.user!.id);
    });
  })
  .post((req, res) => {
    const { duelResult, clientId } = req.body;
    sendEventToClient(duelResult, clientId);
    res.status(204).end();
  });

router.route('/all')
  .post((req, res) => {
    const { duelResult } = req.body;
    sendEventToAllClients(duelResult);
    res.status(204).end();
  });

export default router;
