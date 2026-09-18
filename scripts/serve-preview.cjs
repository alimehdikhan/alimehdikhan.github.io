const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve('out');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf'};
http.createServer((req,res)=>{
  let file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    res.setHeader('Content-Type',types[ext]||'application/octet-stream');
    res.setHeader('Cache-Control',file.includes('_next')?'public, max-age=31536000, immutable':'no-cache');
    res.setHeader('Vary','Accept-Encoding');
    if (/html|js|css|svg/.test(ext) && /gzip/.test(req.headers['accept-encoding']||'')) {
      res.setHeader('Content-Encoding','gzip');res.end(zlib.gzipSync(data));
    } else res.end(data);
  });
}).listen(4173,'127.0.0.1',()=>console.log('Static export: http://127.0.0.1:4173'));
