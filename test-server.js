const http = require('http');
const PORT = Number(process.env.PORT) || 3000;
const COMMIT = '1cf0711';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    commit: COMMIT,
    port: PORT,
    env_PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    node: process.version,
    url: req.url,
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[test-server] commit=1cf0711 listening on port ' + PORT);
});
