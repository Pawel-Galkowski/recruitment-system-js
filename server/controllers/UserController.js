import Promise from 'bluebird';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import validation from '../validation';

export default {
  post: (params, isRaw) => new Promise((resolve, reject) => {
    const { errors, isValid } = validation.register.validateRegisterInput(params);

    if (!isValid) {
      reject(errors);
      return;
    }
    User.findOne({ email: params.email }, (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      if (user) {
        errors.email = 'Email already exists';
        reject(errors);
        return;
      }

      const avatar = gravatar.url(params.email, {
        s: 200, // size
        r: 'pg', // rating
        d: 'mm', // default
      });
      params.avatar = avatar;

      // encrypt password
      const { password } = params;
      params.password = bcrypt.hashSync(password, 10);

      User.create(params, (error, object) => {
        if (error) {
          reject(error);
          return;
        }
        if (isRaw) resolve(object);
        else resolve(object.summary());
      });
    });
  }),
  findOne: (params, isRaw) => new Promise((resolve, reject) => {
    const { errors, isValid } = validation.login.validateLoginInput(params);

    if (!isValid) {
      reject(errors);
      return;
    }
    User.findOne({ email: params.email }, (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      if (!user) {
        errors.email = 'User not found';
        reject(errors);
        return;
      }

      if (!user.confirmed) {
        errors.user = 'User not confirmed';
        reject(errors);
        return;
      }

      // check password
      const passwordCorrect = bcrypt.compareSync(params.password, user.password);
      if (!passwordCorrect) {
        errors.password = 'wrong password provided';
        reject(errors);
        return;
      }
      if (isRaw) resolve(user);
      else resolve(user.summary());
    });
  }),
  getById: (id, isRaw) => new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) {
        reject(err);
        return;
      }
      if (isRaw) resolve(user);
      else resolve(user.summary());
    });
  }),
};
