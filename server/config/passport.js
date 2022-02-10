import Passport from 'passport-jwt';
import mongoose from 'mongoose';
import keys from './keys';

const { ExtractJwt, JwtStrategy } = Passport;

const User = mongoose.model('users');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

export default (params) => {
  params.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }),
  );
};
