const http = require('http');
const WebSocket = require('ws');
const app = require('./src/app');
const { port } = require('./src/config');
const { handleWebSocketConnection } = require('./src/controllers/websocketController');

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

wss.on('connection', handleWebSocketConnection);

// 启动服务器  
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});  