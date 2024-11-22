exports.handleWebSocketConnection = (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.send('Welcome to the WebSocket server!');
};  