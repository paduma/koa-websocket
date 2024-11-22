module.exports = async (ctx, next) => {
  ctx.set('Cache-Control', 'max-age=3600'); // 1小时  
  const lastModified = new Date().toUTCString();
  ctx.set('Last-Modified', lastModified);
  if (ctx.request.headers['if-modified-since'] === lastModified) {
    ctx.status = 304; // Not Modified  
    return;
  }

  await next();
}; 