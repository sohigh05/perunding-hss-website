/* SEMAK WEBSITE: jalankan node semak.mjs sebelum menerbitkan perubahan. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// 1. Gunakan lokasi fail ini supaya semakan boleh dijalankan dari mana-mana folder.
const folderProjek = path.dirname(fileURLToPath(import.meta.url));
const folderLaman = path.join(folderProjek, "dist");
const html = fs.readFileSync(path.join(folderLaman, "index.html"), "utf8");

// 2. Semak sintaks semua fail JavaScript yang digunakan oleh laman.
for (const fail of ["script.js", "animasi.js", "sw.js"]) {
  execFileSync(process.execPath, ["--check", path.join(folderLaman, fail)]);
}

// 3. Pastikan rujukan aset tempatan tidak menghasilkan pautan yang rosak.
const rujukan = [...html.matchAll(/(?:src|href|data-source)="([^"]+)"/g)];
for (const item of rujukan) {
  const alamat = item[1];
  if (!alamat.startsWith("#") && !alamat.includes(":")) {
    assert(
      fs.existsSync(path.join(folderLaman, alamat)),
      "Fail tiada: " + alamat,
    );
  }
}

// 4. Pastikan ID unik dan setiap pautan navigasi mempunyai halaman yang sepadan.
const semuaId = [...html.matchAll(/\bid="([^"]+)"/g)].map((item) => item[1]);
assert.equal(new Set(semuaId).size, semuaId.length, "ID HTML berulang.");
const nav = html.match(/<nav id="nav"[\s\S]*?<\/nav>/)[0];
const pautan = [...nav.matchAll(/href="#([^"]+)"/g)];
assert.equal(pautan.length, 6);
for (const pautanHalaman of pautan) {
  assert(semuaId.includes("halaman-" + pautanHalaman[1]));
}
assert.equal((html.match(/<template /g) || []).length, 6);
assert.equal((html.match(/class="cert"/g) || []).length, 16);
assert.equal(
  fs.readdirSync(path.join(folderLaman, "assets/documents")).length,
  18,
);

// 5. Pastikan fail PDF dan imej asal tanpa tera air tidak termasuk dalam penerbitan.
assert(!fs.existsSync(path.join(folderLaman, "assets/company-profile.pdf")));
assert(
  !fs
    .readdirSync(path.join(folderLaman, "assets"))
    .some((fail) => /^profile-/.test(fail)),
);

// 6. Uji service worker dengan rangkaian simulasi tanpa sambungan luaran.
const acara = {};
const cacheDipadam = [];
const permintaan = [];
const simpanan = [];
const ujian = {
  URL,
  Response,
  self: {
    registration: { scope: "https://ujian.local/" },
    location: { origin: "https://ujian.local" },
    addEventListener: (nama, fungsi) => {
      acara[nama] = fungsi;
    },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  },
  caches: {
    keys: async () => ["hss-v3-motion", "hss-v4-navigation", "cache-lain"],
    delete: async (nama) => {
      cacheDipadam.push(nama);
    },
    open: async () => ({
      put: (...data) => simpanan.push(data),
      addAll: async () => {},
    }),
    match: async () => undefined,
  },
  fetch: async (fail, pilihan) => {
    permintaan.push(pilihan);
    return new Response("Salinan ujian");
  },
};
vm.runInNewContext(
  fs.readFileSync(path.join(folderLaman, "sw.js"), "utf8"),
  ujian,
);
let proses;
acara.activate({
  waitUntil: (janji) => {
    proses = janji;
  },
});
await proses;
assert.deepEqual(cacheDipadam, ["hss-v3-motion"]);
acara.fetch({
  request: {
    method: "GET",
    url: "https://ujian.local/assets/documents/ujian.jpg",
  },
  respondWith: (janji) => {
    proses = janji;
  },
});
await proses;
assert.equal(permintaan[0].cache, "no-store");
assert.equal(simpanan.length, 0);

// 7. Maklumkan keputusan supaya pembangun mengetahui semakan telah selesai.
console.log(
  "LULUS: sintaks JavaScript, aset, ID unik, enam halaman, navigasi, sijil dan cache dokumen.",
);
