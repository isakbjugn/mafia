import passport from './paseto-strategy'
import type { NextFunction, Request, Response } from 'express';

const verifyUser = passport.authenticate('paseto-strategy', { session: false });

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.admin) {
    next();
  }
  else {
    return res.status(403).send('Du er ikke autorisert for denne handlingen!');
  }
}

export default {
  verifyUser,
  verifyAdmin
}
