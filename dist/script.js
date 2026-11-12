/* =============================================================
   PERUNDING HSS - FUNGSI UTAMA WEBSITE
   Kod menggunakan JavaScript biasa tanpa rangka kerja tambahan.
   Kandungan halaman disimpan dalam elemen template di index.html.
   ============================================================= */

// 1. Simpan elemen yang sering digunakan supaya kod lebih mudah dibaca.
const ruangKandungan = document.querySelector("#main");
const skrinMemuatkan = document.querySelector("#loader");
const menuNavigasi = document.querySelector("#nav");
const paparanDokumen = document.querySelector("#viewer");
const imejDokumen = document.querySelector("#viewer-image");
const maklumatPemasangan = document.querySelector("#install-info");
let masaPertukaran;
let cadanganPemasangan;

// 2. Nama halaman digunakan pada tajuk tab pelayar.
const tajukHalaman = {
  utama: "Utama",
  korporat: "Korporat",
  kepakaran: "Kepakaran",
  projek: "Pengalaman Projek",
  sijil: "Sijil dan Dokumen",
  hubungi: "Hubungi Kami",
};

// 3. Paparkan kandungan daripada template berdasarkan alamat halaman.
function paparHalaman() {
  let namaHalaman = window.location.hash.substring(1) || "utama";
  if (!tajukHalaman[namaHalaman]) namaHalaman = "utama";
  const templat = document.querySelector("#halaman-" + namaHalaman);
  ruangKandungan.replaceChildren(templat.content.cloneNode(true));
  document.title = tajukHalaman[namaHalaman] + " | Perunding HSS";

  // Tandakan pautan aktif untuk membantu pengguna mengenal pasti halaman.
  menuNavigasi.querySelectorAll("a").forEach(function (pautan) {
    const sedangAktif = pautan.hash === "#" + namaHalaman;
    pautan.classList.toggle("current", sedangAktif);
    if (sedangAktif) pautan.setAttribute("aria-current", "page");
    else pautan.removeAttribute("aria-current");
  });

  // Maklumkan fail animasi tentang kandungan halaman yang baharu.
  menuNavigasi.classList.remove("open");
  document.dispatchEvent(new Event("hss:render"));
}

// 4. Sembunyikan skrin memuatkan selepas kandungan awal bersedia.
function tutupSkrinMemuatkan() {
  skrinMemuatkan.classList.add("done");
}
paparHalaman();
window.addEventListener("load", function () {
  window.setTimeout(tutupSkrinMemuatkan, 450);
});
window.setTimeout(tutupSkrinMemuatkan, 2200);

// 5. Gunakan peralihan ringkas apabila pengguna menukar halaman.
window.addEventListener("hashchange", function () {
  window.clearTimeout(masaPertukaran);
  skrinMemuatkan.classList.remove("done");
  masaPertukaran = window.setTimeout(function () {
    paparHalaman();
    window.scrollTo(0, 0);
    ruangKandungan.focus({ preventScroll: true });
    tutupSkrinMemuatkan();
  }, 240);
});

// 6. Navigasi sisi dan bar bawah menggunakan pautan yang sama dengan menu desktop.
document.querySelector("#year").textContent = new Date().getFullYear();

// 7. Tapis senarai mengikut pilihan pengguna tanpa memuat semula halaman.
function tapisSenarai(butang, jenisData, pemilih, kategoriData) {
  const pilihan = butang.dataset[jenisData];
  butang.parentElement.querySelectorAll("button").forEach(function (item) {
    item.classList.toggle("active", item === butang);
    item.setAttribute("aria-pressed", item === butang);
  });
  document.querySelectorAll(pemilih).forEach(function (item) {
    item.hidden = pilihan !== "Semua" && item.dataset[kategoriData] !== pilihan;
  });
  document.dispatchEvent(new Event("hss:filter"));
}

// 8. Urus butang dokumen dan penapis melalui satu pendengar klik.
document.addEventListener("click", function (event) {
  const butangDokumen = event.target.closest("[data-view]");
  if (butangDokumen) {
    imejDokumen.src = butangDokumen.dataset.source;
    imejDokumen.alt = butangDokumen.dataset.title;
    imejDokumen.draggable = false;
    document.querySelector("#viewer-title").textContent =
      butangDokumen.dataset.title;
    paparanDokumen.showModal();
  }
  const tapisProjek = event.target.closest("[data-project-filter]");
  if (tapisProjek)
    tapisSenarai(tapisProjek, "projectFilter", ".project", "category");
  const tapisSijil = event.target.closest("[data-cert-filter]");
  if (tapisSijil) tapisSenarai(tapisSijil, "certFilter", ".cert", "owner");
});

// 9. Tutup kotak dialog melalui butang atau bahagian latar di luar kandungan.
document.querySelector("#close-viewer").addEventListener("click", function () {
  paparanDokumen.close();
});
document.querySelector(".close-info").addEventListener("click", function () {
  maklumatPemasangan.close();
});
document.querySelectorAll("dialog").forEach(function (dialog) {
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });
});
paparanDokumen.addEventListener("close", function () {
  imejDokumen.removeAttribute("src");
});

// 10. Kurangkan tindakan menyalin dokumen melalui kawalan pelayar biasa.
// Kawalan ini tidak boleh menyekat tangkapan skrin atau salinan secara mutlak.
function kawasanDokumen(event) {
  return (
    paparanDokumen.open ||
    Boolean(event.target.closest(".cert, .protected-document"))
  );
}
["contextmenu", "dragstart", "copy", "cut"].forEach(function (namaAcara) {
  document.addEventListener(namaAcara, function (event) {
    if (kawasanDokumen(event)) event.preventDefault();
  });
});
document.addEventListener("keydown", function (event) {
  const pintasan = ["s", "p", "c"].includes(event.key.toLowerCase());
  if (paparanDokumen.open && (event.ctrlKey || event.metaKey) && pintasan) {
    event.preventDefault();
  }
});
document.addEventListener("visibilitychange", function () {
  if (document.hidden && paparanDokumen.open) paparanDokumen.close();
});

// 11. Sediakan pemasangan PWA apabila fungsi ini disokong oleh pelayar.
window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  cadanganPemasangan = event;
});
document.querySelector("#install").addEventListener("click", async function () {
  if (cadanganPemasangan) {
    await cadanganPemasangan.prompt();
    cadanganPemasangan = null;
  } else {
    maklumatPemasangan.showModal();
  }
});

// 12. Daftarkan service worker dan buang cache aplikasi versi terdahulu.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(function (ralat) {
    console.error("Pendaftaran PWA tidak berjaya:", ralat);
  });
}
if ("caches" in window) {
  caches.keys().then(function (namaCache) {
    namaCache.forEach(function (nama) {
      if (nama.startsWith("hss-") && nama !== "hss-v4-navigation")
        caches.delete(nama);
    });
  });
}

// 13. Pautan khas membolehkan pengguna papan kekunci terus ke kandungan.
document.querySelector(".skip").addEventListener("click", function (event) {
  event.preventDefault();
  ruangKandungan.focus();
  ruangKandungan.scrollIntoView();
});
