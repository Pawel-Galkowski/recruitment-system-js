import jwt from 'jsonwebtoken';
import config from 'config';

export default (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
