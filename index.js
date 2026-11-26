const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'UP', timestamp: new Date().toISOString() }));
  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Jenkins CI/CD Node.js Application\n');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Jenkins Node.js App</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f4f6f9; margin: 0; }
          .card { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); text-align: center; max-width: 480px; width: 90%; }
          h1 { color: #1f2937; margin-bottom: 12px; }
          p { color: #4b5563; line-height: 1.5; }
          .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          a { color: #2563eb; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
          .nav { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Pipeline Ready</span>
          <h1>Jenkins Node.js App</h1>
          <p>Application successfully initialized and configured for automated Jenkins build, test, and deployment.</p>
          <div class="nav">
            <a href="/health">Health Check API</a> &bull; <a href="/about">About</a>
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

module.exports = server;
