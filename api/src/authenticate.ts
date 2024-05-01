import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import type { NextFunction, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const getToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.PASSPORT_KEY as string, {
    expiresIn: '36h'
  });
};

const localOptions = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};

passport.use(new LocalStrategy(localOptions, async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: username,
        password: password
      }
    });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies['AccessToken']; // Replace with your cookie name
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.PASSPORT_KEY as string,
  session: false
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id
      }
    });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

const verifyUser = passport.authenticate('jwt', { session: false });

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.admin) {
    next();
  }
  else {
    return res.status(403).send('Du er ikke autorisert for denne operasjonen!');
  }
}

export default {
  getToken,
  verifyUser,
  verifyAdmin
}
