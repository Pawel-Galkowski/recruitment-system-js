import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { check, validationResult } from 'express-validator';
import keys from '../../config/keys';
import activationMailer from '../../middleware/mailer';
import recoveryMailer from '../../middleware/reMailer';
import validateLoginImput from '../../validation/login';
import User from '../../models/User';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a stronger password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name, email, password, role,
    } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User exist' }] });
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const salty = await bcrypt.genSalt(10);
      const secretKey = await bcrypt.hash(email, salty);
      const confirmed = false;
      const salt = await bcrypt.genSalt(10);
      const confirmedKey = false;

      user = new User({
        name,
        email,
        avatar,
        password,
        confirmed,
        confirmedKey,
        role,
      });

      const resEmail = activationMailer(user, secretKey);
      const finChecker = await resEmail.then((value) => value);

      user.confirmedKey = await bcrypt.hash(user.id, secretKey);
      user.password = await bcrypt.hash(password, salt);

      if (finChecker === true) {
        await user.save();
        return res.redirect('/login');
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
    return 'Registration finished';
  },
);

// @route   Users api/users/login
// @desc    POST Login form
// @access  Private

router.post('/login', (req, res) => {
  const { errors } = validateLoginImput(req.body);
  const { email } = req.body;
  const password = req.body.passowrd;

  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    const { confirmed } = User;
    bcrypt.compare(password, user.passowrd).then((isMatch) => {
      if (isMatch) {
        if (confirmed !== true) {
          errors.user = 'Please confirm email first';
          return res.status(404).json(errors);
        }
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        jwt.sign(payload, keys.secretOrKey, { expiresIn: 360000 }, (err, token) => {
          res.json({
            sucess: true,
            token,
          });
        });
      } else {
        errors.password = 'Password inccorect';
        return res.status(400).json(errors);
      }
      return 'Process finished';
    });
    return 'Log in process finished';
  });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }, (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  }),
);

router.post('/confirmation/:token', async (req, res) => {
  try {
    const { email } = req.body;
    const { token } = req.params;
    const verifyuser = await User.findOne({ email });
    const secretToken = await bcrypt.hash(verifyuser.id, verifyuser.confirmedKey);
    const { user } = jwt.verify(token, secretToken);
    if (verifyuser._id === user) {
      await verifyuser.updateOne({ confirmed: true });
      await verifyuser.updateOne({ $unset: { confirmedKey: 1 } });
    } else {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: 'Cannot confirm user' }] });
  }
  return 'Confirmation process finished';
});

router.post('/recovery', async (req, res) => {
  try {
    const { email } = req.body;
    const recoveryUser = await User.findOne({ email });
    const salty = await bcrypt.genSalt(10);
    const secretToken = await bcrypt.hash(email, salty);
    const newRecoveryToken = await bcrypt.hash(email, secretToken);
    const cleanToken = newRecoveryToken.replace(/[/]/g, '');
    if (recoveryUser === '') {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const resEmail = recoveryMailer(recoveryUser, cleanToken);
    const finChecker = await resEmail.then((value) => value);
    if (finChecker) {
      await recoveryUser.updateOne({
        recoveryToken: cleanToken,
      });
    }
    return true;
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: 'Invalid  Email' }] });
  }
});

router.post('/recovery/:token', async (req, res) => {
  try {
    const { email } = req.body;
    const newPassword = req.body.password;
    const { token } = req.params;
    const recoveryUser = await User.findOne({ email });
    if (recoveryUser.recoveryToken === token) {
      const salt = await bcrypt.genSalt(10);
      const cryptPassword = await bcrypt.hash(newPassword, salt);
      await recoveryUser.updateOne({ password: cryptPassword });
      await recoveryUser.updateOne({ $unset: { recoveryToken: 1 } });
    } else {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: 'Cannot update user' }] });
  }
  return 'Recovery process finished';
});

export default router;
