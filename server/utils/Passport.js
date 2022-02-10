import Passport from 'passport';
import controllers from '../controllers';

const { ExtractJwt, JwtStrategy } = Passport;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      controllers.user
        .getById(jwtPayload.id, false)
        .then((user) => {
          if (!user) return done(null, false);
          return done(null, user);
        })
        .catch((err) => {
          console.log(`passport authentication Error: ${err}`);
        });
    }),
  );
};
