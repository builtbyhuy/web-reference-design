'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.md':'text/plain; charset=utf-8'};
const server = http.createServer((request,response) => {
  const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
  fs.readFile(file,(error,body)=>{ if(error){response.writeHead(404);response.end('Not found');return;}response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});response.end(body); });
});
if(require.main === module) server.listen(4179,'127.0.0.1',()=>console.log('Spoke Workshop: http://127.0.0.1:4179'));
module.exports = server;
