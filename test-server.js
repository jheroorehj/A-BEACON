const http = require('http');
const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    port: PORT,
    env_PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    node: process.version,
    cwd: process.cwd(),
    url: req.url,
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[test-server] listening on port ${PORT}`);
});
