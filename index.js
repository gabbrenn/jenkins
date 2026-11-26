const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;
const VERSION = '1.0.0';

// Mathematical utility logic (tested in test.js)
const math = {
  add: (a, b) => Number(a) + Number(b),
  multiply: (a, b) => Number(a) * Number(b)
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
  } else if (pathname === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: 'jenkins-node-app',
      version: VERSION,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }));
  } else if (pathname === '/api/calculate') {
    const { a, b, op } = parsedUrl.query;
    if (a === undefined || b === undefined) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Please provide query parameters a and b' }));
    }
    const result = op === 'multiply' ? math.multiply(a, b) : math.add(a, b);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ operation: op || 'add', a: Number(a), b: Number(b), result }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Jenkins Node.js App v${VERSION}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; color: #f8fafc; margin: 0; }
          .card { background: #1e293b; padding: 36px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; max-width: 500px; width: 90%; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-bottom: 8px; font-size: 26px; }
          .badge { display: inline-block; background: #059669; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          p { color: #94a3b8; line-height: 1.6; margin: 8px 0; }
          .endpoints { text-align: left; background: #0f172a; padding: 14px; border-radius: 8px; margin-top: 20px; font-family: monospace; font-size: 13px; }
          .endpoints a { color: #38bdf8; text-decoration: none; }
          .endpoints a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">CI/CD Deployed v${VERSION}</span>
          <h1>Jenkins Node.js Service</h1>
          <p>Application successfully built, tested, and deployed via Jenkins automated pipeline!</p>
          <div class="endpoints">
            <strong>Active API Endpoints:</strong><br>
            &bull; <a href="/health">GET /health</a> - Health Check Status<br>
            &bull; <a href="/api/info">GET /api/info</a> - Build & Runtime Metadata<br>
            &bull; <a href="/api/calculate?a=15&b=25">GET /api/calculate?a=15&b=25</a> - Calculate API
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

module.exports = { server, math, VERSION };
