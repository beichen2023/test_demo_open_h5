const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 18683);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

// 只开放三个演示页面和静态资源，避免暴露仓库及运行日志。
const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  if (pathname === '/') pathname = '/html1.html';
  const allowed = /^\/html[123]\.html$/.test(pathname) || /^\/assets\/[a-z0-9-]+\.(css|js)$/.test(pathname);
  if (!allowed) {
    response.writeHead(404).end('Not found');
    return;
  }
  fs.readFile(path.join(root, pathname.slice(1)), (error, content) => {
    if (error) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(pathname)], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});

server.on('error', (error) => {
  console.error(`启动失败：${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '0.0.0.0', () => {
  console.log(`本机访问：http://localhost:${port}/html1.html`);
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) {
        console.log(`局域网候选地址：http://${address.address}:${port}/html1.html`);
      }
    }
  }
});
