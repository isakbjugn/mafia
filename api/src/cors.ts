import cors, { type CorsOptions } from 'cors';
import type { Request } from 'express';

const whiteList = ['http://localhost:5173'];

const corsOptionsDelegate = (req: Request, callback: (err: Error | null, corsOptions?: CorsOptions) => void) => {
  let corsOptions;
  if (whiteList.indexOf(req.header('Origin') as string) !== -1) {
    corsOptions = { origin: true }
  }
  else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions);
};

const corsOptionsDelegateWithCredentials = (req: Request, callback: (err: Error | null, corsOptions?: CorsOptions) => void) => {
  let corsOptions;
  if (whiteList.indexOf(req.header('Origin') as string) !== -1) {
    corsOptions = { origin: true, credentials: true }
  }
  else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions);
};

export default {
  cors: cors(),
  corsWithOptions: cors(corsOptionsDelegate),
  corsWithCredentials: cors(corsOptionsDelegateWithCredentials),
  corsWithSpecifiedOriginAndCredentials: cors(({
    origin: 'http://localhost:5173',
    credentials: true
  }))
}
