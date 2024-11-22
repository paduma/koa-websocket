require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  refreshSecret: process.env.REFRESH_SECRET || 'your_refresh_secret',
}; 