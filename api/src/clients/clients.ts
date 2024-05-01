import type { Response} from "express";
// Store clients
let clients: { id: string, res: Response }[] = [];

export const addClient = (id: string, res: Response) => {
  const newClient = { id, res };
  clients.push(newClient);
  console.log('New client connected:', id);
  console.log('Current clients:', clients.map(client => client.id));
}

export const removeClient = (id: string) => {
  clients = clients.filter(client => client.id !== id);
  console.log('Client disconnected:', id);
  console.log('Current clients:', clients.map(client => client.id));
}

type EventData = {
  message: string,
}

// Function to send an event to all connected clients
export const sendEventToAllClients = (data: EventData) => {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

// Function to send an event to all connected clients
export const sendEventToClient = (data: EventData, clientId: string) => {
  clients.find(client => client.id === clientId)
    ?.res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Function to send an event to all connected clients
export const sendEventToSeveralClients = (data: EventData, clientIds: string[]) => {
  clients.find(client => clientIds.includes(client.id))
    ?.res.write(`data: ${JSON.stringify(data)}\n\n`);
}
