import passportCustom from 'passport-custom';
import passport from 'passport';
import paseto from 'paseto';
import { prisma } from './db/repository';

const CustomStrategy = passportCustom.Strategy;
const { V4: { verify } } = paseto

type AuthToken = {
  user_id: string,
  is_admin: boolean,
}

passport.use('paseto-strategy', new CustomStrategy(
  async function(req, callback) {
    // Do your custom user finding logic here, or set to false based on req object
    if (!req.cookies['rust-auth']) {
      return callback(null, false)
    }
    const authCookie = req.cookies['rust-auth'];
    const publicKey = process.env.RUST_AUTH_PUBLIC_KEY as string;
    const tenantKey = process.env.RUST_AUTH_TENANT_KEY as string;
    try {
      const authToken: AuthToken = await verify(authCookie, publicKey, {
        assertion: tenantKey
      })
      const user = await prisma.user.findFirst({
        where: {
          id: authToken.user_id
        }
      });
      return callback(null, user)
    } catch (e) {
      return callback(e, false)
    }
  }
));

export default passport;