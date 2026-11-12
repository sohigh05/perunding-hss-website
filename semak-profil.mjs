/* SEMAK PROFIL: nilai rujukan disalin daripada profil syarikat Oktober 2026. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// 1. Baca teks HTML dan seragamkan ruang serta tanda sempang untuk perbandingan.
const folder = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(folder, 'dist/index.html'), 'utf8');
function seragam(teks) {
  return teks.replace(/<[^>]+>/g, ' ').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
}
const kandungan = seragam(html);

// 2. Semak maklumat korporat dan kelayakan berdasarkan halaman sumber yang dinyatakan.
const fakta = [
  [3, '202501003454 (1604867-M)'],
  [3, '21 Januari 2025'],
  [3, '71102'],
  [3, '42909'],
  [5, 'No. 61, Tingkat 1, Jalan Meru Bestari A8, Bandar Meru Raya, 30020 Ipoh, Perak, Malaysia'],
  [5, '4A, Jalan Jaafar Taha, Rapat Setia, 31350 Ipoh, Perak, Malaysia'],
  [6, '05-525 3283'],
  [6, 'irabdhalim17@gmail.com'],
  [6, 'halimsecretary@yahoo.com'],
  [9, 'Halim Ghazali'],
  [9, 'LS0008654'],
  [11, 'Ir. Ts. Saiful Azzuan Bin Aznam'],
  [11, '019-572 4071'],
  [11, 's_azzuan@outlook.com'],
  [11, 'P119127'],
  [11, 'PT24090190'],
  [11, 'Ir. Abd. Halim Bin Hashim'],
  [11, '019-579 7472'],
  [11, 'C113353'],
  [11, '29691'],
  [11, 'A1-Ir/2025/0011'],
  [11, 'GT25030215'],
  [11, 'MSc Geotechnical Engineering, UiTM (2022)'],
  [11, 'B.Eng. (Hons) Civil, ITM (1998)'],
  [11, 'Ammar Haziq Bin Ahmad Shukri'],
  [11, '012-516 8501'],
  [11, 'ashukri150@gmail.com'],
  [12, '1992'],
  [13, 'Master of Project Management, UTM (2014)'],
  [13, 'Sarjana Muda Kejuruteraan (Awam), UTM (2000), Kepujian Kelas Kedua (Tinggi)']
];
for (const [halaman, nilai] of fakta) {
  assert(kandungan.includes(seragam(nilai)), 'Semak halaman ' + halaman + ': ' + nilai);
}

// 3. Semak pasangan tarikh, projek, jawatan dan organisasi daripada halaman 12.
const projek = [
  ['Mulai Julai 2023', 'Jalan Baharu Pos Tenau - Pos Labu / Senderut', 'Jurutera Residen', 'Perunding Irzi Sdn. Bhd.'],
  ['Sep 2022 - Jun 2023', 'Jalan dan Jambatan Sungai Air Tawar', 'Jurutera Residen', 'GPC Integrated Sdn. Bhd.'],
  ['Nov 2018 - Sep 2022', 'Naik Taraf Lebuhraya Pulau Indah, Fasa 2', 'Jurutera Residen', 'GPC Integrated Sdn. Bhd.'],
  ['Okt 2015 - Okt 2018', 'Naik Taraf FR5, Sabak Bernam - Hutan Melintang', 'Jurutera Residen', 'ZAQ Engineering Services Sdn. Bhd.'],
  ['Nov 2008 - Mac 2013', 'Landasan Berkembar Elektrik Ipoh - Padang Besar', 'Jurutera Kanan', 'Tech Art Sdn. Bhd.']
];
const kadProjek = [...html.matchAll(/<article class="project"[\s\S]*?<\/article>/g)];
assert.equal(kadProjek.length, projek.length);
projek.forEach(function (butiran, nombor) {
  for (const nilai of butiran) assert(seragam(kadProjek[nombor][0]).includes(nilai), 'Projek ' + (nombor + 1) + ': ' + nilai);
});

// 4. Paparkan keputusan. Semakan ini menilai padanan dengan profil, bukan status semasa badan penerbit.
console.log('LULUS: 30 fakta profil dan lima pasangan butiran projek sepadan.');
