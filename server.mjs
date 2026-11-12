/* PELAYAN TEMPATAN: jalankan fail ini dengan arahan node server.mjs. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// Tetapkan folder laman dan jenis fail yang dihantar kepada pelayar.
const folderLaman = path.resolve('dist');
const jenisFail = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg' };

// Terima permintaan daripada komputer ini sahaja.
http.createServer(function (permintaan, jawapan) {
  const alamat = new URL(permintaan.url, 'http://localhost');
  let fail = path.resolve(folderLaman, '.' + decodeURIComponent(alamat.pathname));

  // Tolak permintaan yang cuba membaca fail di luar folder website.
  if (fail !== folderLaman && !fail.startsWith(folderLaman + path.sep)) {
    jawapan.writeHead(403).end();
    return;
  }
  if (fs.existsSync(fail) && fs.statSync(fail).isDirectory()) fail = path.join(fail, 'index.html');
  if (!fs.existsSync(fail)) {
    jawapan.writeHead(404).end();
    return;
  }

  // Dokumen syarikat tidak disimpan dalam cache pelayar semasa pratonton.
  if (alamat.pathname.startsWith('/assets/documents/')) jawapan.setHeader('Cache-Control', 'private, no-store, max-age=0');
  jawapan.setHeader('Content-Type', jenisFail[path.extname(fail)] || 'application/octet-stream');
  fs.createReadStream(fail).pipe(jawapan);
}).listen(4173, '127.0.0.1', function () {
  console.log('Pratonton website: http://127.0.0.1:4173');
});
