const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const loadRoutes = (app) => {
  const router = new Router();

  // 获取 routes 目录的路径  
  const routesDir = path.join(__dirname, 'routes');

  // 读取 routes 目录下的所有文件  
  fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('.js')) {
      const route = require(path.join(routesDir, file));
      router.use(route.routes()).use(route.allowedMethods());
    }
  });

  // 将所有路由挂载到 app 上  
  app.use(router.routes()).use(router.allowedMethods());
};

module.exports = loadRoutes;