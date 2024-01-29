import express, { type NextFunction, type Request, type Response } from 'express';

const router = express.Router();

// Store clients
let clients: { id: number, res: Response }[] = [];

// Middleware for setting SSE headers
const sseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  next();
};

router.use('/', sseMiddleware);

// SSE endpoint
router.get('/', (req, res) => {
  // Send a keep-alive message to prevent the connection from closing
  const keepAlive = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 30000);

  // Add this client to the clients array
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // Remove this client from the array when the connection is closed
  req.on('close', () => {
    clearInterval(keepAlive);
    clients = clients.filter(client => client.id !== clientId);
  });
});

type DuelData = {
  duelResult: string,
}

// Function to send an event to all connected clients
export const sendEventToAllClients = (data: DuelData) => {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

export default router;
