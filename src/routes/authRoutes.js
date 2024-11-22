const Router = require('koa-router');
const { login, refreshToken } = require('../controllers/authController');

const router = new Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);

module.exports = router;  