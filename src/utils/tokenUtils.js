const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const refreshSecret = process.env.REFRESH_SECRET || 'your_refresh_secret';

exports.generateTokens = (username) => {
  const accessToken = jwt.sign({ username }, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username }, refreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};  