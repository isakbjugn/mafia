import type { Response} from "express";
// Store clients
let clients: { id: number, res: Response }[] = [];

export const addClient = (id: number, res: Response) => {
  const newClient = { id, res };
  clients.push(newClient);
  console.log('New client connected:', id);
  console.log('Current clients:', clients.map(client => client.id));
}

export const removeClient = (id: number) => {
  clients = clients.filter(client => client.id !== id);
  console.log('Client disconnected:', id);
  console.log('Current clients:', clients.map(client => client.id));
}

type DuelData = {
  duelResult: string,
}

// Function to send an event to all connected clients
export const sendEventToAllClients = (data: DuelData) => {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

// Function to send an event to all connected clients
export const sendEventToClient = (data: DuelData, clientId: number) => {
  clients.find(client => client.id === clientId)
    ?.res.write(`data: ${JSON.stringify(data)}\n\n`);
}
