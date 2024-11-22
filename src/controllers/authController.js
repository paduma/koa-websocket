const jwt = require('jsonwebtoken');
const { generateTokens } = require('../utils/tokenUtils');

const users = [{ username: 'user', password: 'password' }];
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const refreshSecret = process.env.REFRESH_SECRET || 'your_refresh_secret';

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const tokens = generateTokens(username);
    ctx.body = {
      success: true,
      ...tokens,
    };
  } else {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Authentication failed' };
  }
};

exports.refreshToken = async (ctx) => {
  const { refreshToken } = ctx.request.body;

  if (!refreshToken) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Refresh token required' };
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, refreshSecret);
    const tokens = generateTokens(payload.username);
    ctx.body = {
      success: true,
      ...tokens,
    };
  } catch (err) {
    ctx.status = 403;
    ctx.body = { success: false, message: 'Invalid refresh token' };
  }
};  