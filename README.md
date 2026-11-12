# Website Korporat Perunding HSS

Versi terkini menggunakan HTML, CSS dan JavaScript biasa tanpa rangka kerja tambahan.
Kod disusun mengikut bahagian dan disertakan komen Bahasa Melayu untuk memudahkan pembelajaran serta penyelenggaraan.

## Fail yang boleh disunting

- `dist/index.html`: struktur laman dan kandungan enam halaman dalam elemen template.
- `dist/style.css`: warna, tipografi, susun atur, paparan responsif dan kesan interaksi.
- `dist/script.js`: navigasi, penapis, kotak dialog, kawalan dokumen dan pemasangan PWA.
- `dist/animasi.js`: animasi tajuk, kemunculan semasa tatal, penapisan dan penunjuk tatal.
- `dist/sw.js`: pengurusan cache untuk fail umum PWA.
- `dist/manifest.webmanifest`: nama, ikon dan tetapan aplikasi.
- `dist/assets/`: logo, gambar dan salinan dokumen bertera air yang digunakan oleh laman.

## Membuka website

Buka `dist/index.html` untuk melihat laman secara terus.
Untuk menguji PWA, jalankan `node server.mjs` dari folder ini, kemudian buka http://127.0.0.1:4173.
Pemasangan PWA memerlukan localhost atau HTTPS. Google Maps memerlukan sambungan Internet.
Untuk pengehosan statik, gunakan kandungan folder `dist`.

## Kandungan syarikat

Maklumat disusun daripada profil syarikat bertarikh 30 Oktober 2026.
Lima projek yang dipaparkan merupakan pengalaman profesional pengarah bersama organisasi yang dinyatakan.
Kesemua 16 sijil dan dokumen dikekalkan dalam bentuk salinan bertera air.
PDF asal disimpan secara berasingan dalam folder Rujukan dan tidak dimasukkan ke dalam fail penerbitan.

## Animasi dan kebolehcapaian

Animasi menggunakan CSS dan fungsi pelayar yang tersedia, tanpa perpustakaan tambahan.
Tetapan pengurangan gerakan pengguna dihormati. Animasi tatal dipaparkan sekali untuk setiap halaman.
Kandungan masih boleh dibaca jika fungsi animasi tidak disokong.

## Privasi dokumen

Tera air hak cipta dicantumkan terus pada imej. Pautan PDF asal dan imej tanpa tera air tidak disediakan.
Paparan dokumen menghalang tindakan biasa klik kanan, seret, salin dan pintasan simpan atau cetak.
Dokumen dikecualikan daripada cache PWA; cache HSS terdahulu dibuang apabila versi baharu dibuka.
Fail `_headers` menyediakan arahan no-store pada hos yang menyokongnya.
Website tidak dapat menjamin sekatan tangkapan skrin, rakaman kamera atau penyimpanan melalui alat pelayar.
Salinan yang pernah dimuat turun tidak boleh ditarik balik. Hak cipta dokumen asal kekal pada penerbit masing-masing.

## Fail pengurusan

Folder tersembunyi `.git` digunakan untuk sejarah kod dan penyegerakan GitHub.
Workflow dalam `.github` mengurus semakan dan penerbitan GitHub Pages.

## Navigasi telefon dan tablet

Gambar Saiful Azzuan yang dibekalkan oleh pihak syarikat digunakan pada halaman Korporat.
Telefon menggunakan bar ikon bawah dengan enam pautan; tablet dan iPad menggunakan bar sisi.
Ruang selamat tepi skrin dan home indicator diambil kira melalui tetapan CSS.
Pada desktop, pautan kekal pada bahagian atas halaman.
Susunan dipilih mengikut keluasan skrin dan keupayaan sentuhan pelayar.

## Semakan sebelum penerbitan

Jalankan `node semak.mjs` untuk menyemak sintaks, rujukan aset, ID HTML, halaman, dokumen dan cache PWA.
Ujian pelayar telah merangkumi enam halaman, semua 16 kotak dokumen, penapis projek dan sijil,
panduan pemasangan PWA, navigasi kembali/maju, gambar baharu dan paparan 320, 390, 768, 820,
1024 serta 1440 piksel. Isu limpahan mendatar semasa animasi gambar utama telah dibetulkan.
Ujian ini menggunakan pelayar desktop dengan saiz skrin simulasi; pemasangan PWA dan fungsi
aplikasi telefon/e-mel masih tertakluk kepada pelayar serta peranti sebenar.

## Penerbitan GitHub Pages

Repositori awam: https://github.com/sohigh05/perunding-hss-website
Alamat website: https://sohigh05.github.io/perunding-hss-website/

Workflow `.github/workflows/pages.yml` menjalankan `node semak.mjs` dan `node semak-profil.mjs`
sebelum menerbitkan folder `dist`. Perubahan pada cabang `main` diterbitkan secara automatik.
Semakan terakhir pada 12 November 2026 memadankan 30 fakta korporat, hubungan dan kelayakan,
serta tarikh, jawatan dan organisasi bagi kelima-lima projek dengan profil sumber.
Dokumen dan sijil pada halaman 15 hingga 30 dikekalkan sebagai salinan bertera air.
Rekod bank dan PDF asal tidak termasuk dalam repositori awam.

GitHub Pages tidak menggunakan fail `_headers` untuk menetapkan pengepala HTTP.
Dokumen masih dikecualikan daripada cache service worker, tetapi salinan yang dipaparkan
secara awam boleh disimpan atau dirakam oleh pengunjung. Tera air bukan kawalan akses.

Sejarah penerbitan Sites yang terdahulu disimpan secara tempatan dalam folder Rujukan
untuk rujukan pemilik sahaja. Repositori GitHub bermula daripada salinan versi terkini.
