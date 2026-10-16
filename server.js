const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Chuyển hướng nhanh sang Admin Portal nếu truy cập /admin hoặc /login
  if (reqUrl === '/admin' || reqUrl.startsWith('/admin/') || reqUrl === '/login' || reqUrl.startsWith('/login/')) {
    res.writeHead(302, { Location: `http://localhost:5173${req.url}` });
    res.end();
    return;
  }

  if (reqUrl === '/' || reqUrl === '/en' || reqUrl === '/en/') {
    reqUrl = '/index.html';
  } else if (reqUrl.startsWith('/en/')) {
    reqUrl = reqUrl.replace('/en/', '/');
  }

  const filePath = path.join(__dirname, decodeURIComponent(reqUrl));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - VNIT Website');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` VNIT Website Server is running!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
