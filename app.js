const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = new Koa();
const router = new Router();

app.use(helmet()); // 安全性中间件  
app.use(bodyParser());

const users = [{ username: 'user', password: 'password' }]; // 示例用户  
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const refreshSecret = process.env.REFRESH_SECRET || 'your_refresh_secret';

// 生成 token 和 refresh token  
const generateTokens = (username) => {
  const accessToken = jwt.sign({ username }, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username }, refreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};


// 登录接口  
router.post('/login', async (ctx) => {
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
});

// 刷新 token 接口  
router.post('/refresh-token', async (ctx) => {
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
});

// 强制缓存和协商缓存设置  
app.use(async (ctx, next) => {
  // 强制缓存  
  ctx.set('Cache-Control', 'max-age=3600'); // 1小时  
  // 协商缓存  
  const lastModified = new Date().toUTCString(); // 你可以使用实际的内容最后修改时间  
  ctx.set('Last-Modified', lastModified);
  if (ctx.request.headers['if-modified-since'] === lastModified) {
    ctx.status = 304; // Not Modified  
    return;
  }

  await next();
});

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

// 处理 WebSocket 连接  
wss.on('connection', (ws) => {
  console.log('Client connected');

  // 监听消息  
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // 可以在这里进行处理并回应  
    ws.send(`Server received: ${message}`);
  });

  // 客户端连接时发送欢迎消息  
  ws.send('Welcome to the WebSocket server!');
});

// Koa 中间件示例  
app.use((ctx) => {
  ctx.body = 'Hello, this is a Koa server with WebSocket support!';
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});