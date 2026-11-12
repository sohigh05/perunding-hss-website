/* SERVICE WORKER: mengurus fail umum untuk kegunaan di luar talian. */
const NAMA_CACHE = "hss-v4-navigation";

// Fail umum sahaja disimpan. Dokumen syarikat tidak termasuk dalam senarai ini.
const FAIL_UMUM = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./animasi.js",
  "./manifest.webmanifest",
  "./assets/image-1-0.png",
  "./assets/image-1-1.png",
  "./assets/image-12-1.png",
  "./assets/saiful-azzuan.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

// 1. Simpan fail asas semasa pemasangan PWA.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(NAMA_CACHE)
      .then(function (cache) {
        return cache.addAll(FAIL_UMUM);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

// 2. Padam cache HSS yang lama apabila versi baharu diaktifkan.
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (senarai) {
        return Promise.all(
          senarai.map(function (nama) {
            if (nama.startsWith("hss-") && nama !== NAMA_CACHE)
              return caches.delete(nama);
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

// 3. Fail dokumen sentiasa diminta daripada pelayan tanpa cache PWA.
self.addEventListener("fetch", function (event) {
  const alamat = new URL(event.request.url);
  if (event.request.method !== "GET" || alamat.origin !== self.location.origin)
    return;
  if (alamat.pathname.includes("/assets/documents/")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(function () {
        return new Response(
          "Sambungan Internet diperlukan untuk paparan dokumen.",
          {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          },
        );
      }),
    );
    return;
  }

  // 4. Cuba rangkaian dahulu. Simpan semula hanya fail umum yang diluluskan.
  event.respondWith(
    fetch(event.request)
      .then(function (jawapan) {
        const failDibenarkan = FAIL_UMUM.some(function (fail) {
          return (
            new URL(fail, self.registration.scope).pathname === alamat.pathname
          );
        });
        if (jawapan.ok && failDibenarkan) {
          const salinan = jawapan.clone();
          caches.open(NAMA_CACHE).then(function (cache) {
            cache.put(event.request, salinan);
          });
        }
        return jawapan;
      })
      .catch(function () {
        // Gunakan salinan umum apabila sambungan Internet terputus.
        return caches.match(event.request).then(function (salinan) {
          if (salinan) return salinan;
          if (event.request.mode === "navigate")
            return caches.match("./index.html");
          return new Response("Fail tidak tersedia di luar talian.", {
            status: 503,
          });
        });
      }),
  );
});
