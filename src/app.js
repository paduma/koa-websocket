const Koa = require('koa');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
// const authRoutes = require('./routes/authRoutes');
const cacheMiddleware = require('./middlewares/cacheMiddleware');
const loadRoutes = require('./routeLoader'); // 引入路由加载器  

const app = new Koa();

// 使用中间件  
app.use(helmet());
app.use(bodyParser());
app.use(cacheMiddleware);

// 加载路由  
loadRoutes(app);

// // 使用路由  
// app.use(authRoutes.routes()).use(authRoutes.allowedMethods());

module.exports = app;  