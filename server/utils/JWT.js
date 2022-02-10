import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

export default {
  sign: (obj, secret) => jwt.sign(obj, secret, { expiresIn: 86400 }), // returns a new token
  verify: (token, secret) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decode);
    });
  }),
};
