# Sistem Templade Dokumen Akad

Aplikasi web statis untuk **generate dokumen akad nasabah** secara batch dari
sekumpulan template `.docx`. Cukup isi data nasabah satu kali, centang
template yang diinginkan, lalu unduh hasilnya sebagai satu `.docx` (jika
hanya satu template) atau satu paket `.zip` (jika lebih dari satu).

> Repo ini berisi **template publik (dummy)** yang aman dipublikasikan.
> Lihat bagian [Mengganti / Menambah Template](#mengganti--menambah-template)
> bila ingin memakai template internal milik kantor sendiri.

---

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Fitur](#fitur)
- [Stack & Dependencies](#stack--dependencies)
- [Struktur Project](#struktur-project)
- [Cara Menjalankan](#cara-menjalankan)
- [Cara Pakai Aplikasi](#cara-pakai-aplikasi)
- [Daftar Placeholder yang Didukung](#daftar-placeholder-yang-didukung)
- [Mengganti / Menambah Template](#mengganti--menambah-template)
- [Tips Membuat Template `.docx`](#tips-membuat-template-docx)
- [Troubleshooting](#troubleshooting)

---

## Latar Belakang

Project ini merupakan **luaran (deliverable) Laporan Kerja Praktek** yang
disusun selama penulis menjalani Kerja Praktek di **BSI KCP Palembang
Veteran**. Selama masa KP, penulis melakukan observasi terhadap alur
kerja petugas dan berhasil **mengidentifikasi sebuah masalah operasional
nyata** yang kemudian dijadikan fokus laporan.

### Masalah yang Dianalisis

Proses penyiapan **dokumen akad nasabah** di cabang masih dilakukan
secara **manual**: petugas harus membuka **13 file template `.docx`**
satu per satu, lalu mengetik ulang data nasabah yang sama (nama, alamat,
KTP, no. akad, dsb.) di setiap dokumen.

Pola kerja ini menimbulkan beberapa kelemahan:

- **Tidak efisien** — data yang sama diketik berulang kali ke 13 file.
- **Rawan typo & inkonsistensi** — satu salah ketik di salah satu file
  sering baru ketahuan saat akad berlangsung.
- **Memakan waktu** — pengisian manual untuk satu nasabah bisa
  menghabiskan waktu yang seharusnya dapat dipakai untuk pekerjaan lain.

### Solusi yang Diusulkan

Sebagai tindak lanjut dari analisis tersebut, penulis merancang dan
mengimplementasikan sebuah **aplikasi sekali-input berbasis client-side**
yang dijalankan di *localhost*—tanpa server, tanpa upload data ke
manapun. Petugas cukup mengisi data nasabah **satu kali**, memilih
template yang dibutuhkan, dan seluruh dokumen akan ter-generate
sekaligus dalam hitungan detik.

### Tujuan Sistem

- Mempercepat penyiapan berkas akad dari ~puluhan menit menjadi <1 menit.
- Menjamin **konsistensi data** antar dokumen (semuanya bersumber dari
  satu input yang sama).
- Tetap **aman & privasi-aware** — karena seluruh proses terjadi di
  browser pengguna, data nasabah tidak pernah keluar dari komputer
  petugas.

### Status Repo

Repo ini hanya berisi **kerangka aplikasi + template publik (dummy)**
sebagai bukti hasil analisis untuk keperluan laporan KP. **Template dan
data asli** milik BSI KCP Palembang Veteran **tidak disertakan** dan
tidak akan dipublikasikan demi menjaga kerahasiaan data internal bank.

## Fitur

- 13 template akad siap pakai (versi publik / dummy).
- Pilih beberapa template sekaligus → otomatis dipaket jadi `.zip`.
- Form input dinamis: field hanya muncul untuk template yang dicentang.
- Auto-format tanggal dalam 4 bentuk (`hari`, `dd-mm-yyyy`, `d Bulan yyyy`,
  `dd/mm/yyyy`).
- Berjalan **100% di browser** — tidak ada server, data nasabah tidak
  dikirim ke mana-mana.

## Stack & Dependencies

Murni HTML + CSS + JavaScript vanilla. Library di-load via CDN:

| Library | Fungsi |
|---|---|
| [PizZip](https://github.com/open-xml-templating/pizzip) `3.1.5` | Baca & tulis arsip `.docx` (zip). |
| [docxtemplater](https://docxtemplater.com/) `3.37.1` | Substitusi placeholder `{{...}}` di `.docx`. |
| [JSZip](https://stuk.github.io/jszip/) `3.10.1` | Membungkus banyak `.docx` jadi satu `.zip`. |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js) `2.0.5` | Trigger unduhan dari browser. |

Tidak ada `npm install` / build step.

## Struktur Project

```
stda/
├── index.html        # Halaman utama + form input
├── style.css         # Styling
├── script.js         # Logika generate & download
├── assets/
│   └── foto/         # Logo, dll. (mis. logo-bsi.png)
├── templates/        # 13 template .docx (template1.docx … template13.docx)
└── README.md
```

## Cara Menjalankan

Karena script melakukan `fetch()` ke file `.docx`, aplikasi **tidak bisa**
dijalankan dengan dobel-klik `index.html` (akan kena CORS / `file://`).
Jalankan dari HTTP server lokal mana saja.

### Opsi 1 — VS Code Live Server

1. Install ekstensi **Live Server**.
2. Klik kanan `index.html` → **Open with Live Server**.

### Opsi 2 — Python

```bash
python -m http.server 8080
```

Lalu buka <http://localhost:8080>.

### Opsi 3 — Node.js

```bash
npx serve .
```

## Cara Pakai Aplikasi

1. Centang template yang ingin di-generate (default: semua).
2. Form input akan menyesuaikan otomatis — hanya field yang dibutuhkan
   oleh template terpilih yang muncul.
3. Isi data nasabah (nama, alamat, KTP, dll.) dan **Tanggal Dokumen**.
4. Isi **Nama File (Panggilan)** — dipakai untuk menamai file unduhan,
   misal "Budi" → `Surat Pernyataan COVER ASS - Budi.docx`.
5. Klik **Generate Dokumen**.
   - 1 template terpilih → unduh `.docx` langsung.
   - >1 template → unduh `.zip` berisi semua dokumen.

## Daftar Placeholder yang Didukung

Placeholder berikut akan otomatis di-substitusi oleh `script.js` saat
generate. Pakai sintaks `{{namaPlaceholder}}` di file template.

| Placeholder | Sumber Data | Keterangan |
|---|---|---|
| `{{namaN}}`    | Field "Nama Nasabah"               | |
| `{{ttlN}}`     | Field "Tempat Tanggal Lahir Nasabah" | |
| `{{alamatN}}`  | Field "Alamat Nasabah"             | Multi-baris (textarea). |
| `{{noKTPN}}`   | Field "No KTP Nasabah"             | |
| `{{noRekN}}`   | Field "No Rekening Nasabah"        | |
| `{{noTelN}}`   | Field "No Telephone Nasabah"       | |
| `{{namaP}}`    | Field "Nama Pasangan"              | |
| `{{ttlP}}`     | Field "Tempat Tanggal Lahir Pasangan" | |
| `{{alamatP}}`  | Field "Alamat Pasangan"            | |
| `{{noKTPP}}`   | Field "No KTP Pasangan"            | |
| `{{noTelP}}`   | Field "No Telephone Pasangan"      | |
| `{{noAkad}}`   | Field "No Akad"                    | |
| `{{hari}}`     | Otomatis dari Tanggal Dokumen      | mis. "Senin". |
| `{{tgl1}}`     | Otomatis dari Tanggal Dokumen      | `dd-mm-yyyy`. |
| `{{tgl2}}`     | Otomatis dari Tanggal Dokumen      | `d Bulan yyyy` (mis. `2 Mei 2026`). |
| `{{tgl3}}`     | Otomatis dari Tanggal Dokumen      | `dd/mm/yyyy`. |

## Mengganti / Menambah Template

### A. Mengganti isi salah satu template (paling umum)

1. Buka file `.docx` yang mau diubah di Microsoft Word, mis. `templates/template1.docx`.
2. Edit isinya sesuai kebutuhan. Untuk lokasi data nasabah, ketik
   placeholder dengan format `{{namaPlaceholder}}` (lihat tabel di atas).
3. **Save** sebagai `.docx` (bukan `.doc` / `.docm` / `.pdf`) dengan **nama
   file yang sama** dan **timpa** file lama di folder `templates/`.
4. Jalankan ulang aplikasi. Selesai.

### B. Menambah template baru (template ke-14, dst.)

1. Buat file `.docx` baru, taruh di `templates/template14.docx`.
2. Buka `index.html`, tambahkan baris checkbox baru di blok
   `<div class="pilihan-template">`:
   ```html
   <input type="checkbox" class="tpl-check" value="13" checked onchange="updateFields()"> Nama Template Baru<br>
   ```
   Catatan: `value` = index ke-13 karena template ke-14 (0-based).
3. Buka `script.js`, tambahkan entry pada array `allFiles`:
   ```js
   { path: "templates/template14.docx", name: `Nama Template Baru - ${data.namaDoc}.docx` },
   ```
4. (Opsional) Update fungsi `updateFields()` di `script.js` agar field
   input yang relevan ikut tampil saat checkbox baru dicentang. Pola yang
   dipakai: tambahkan variabel `const tpl14 = …`, lalu sertakan ke kondisi
   `display` field yang dibutuhkan template tersebut.
5. Reload aplikasi.

### C. Mengganti seluruh paket template (mis. dari publik ke versi internal)

1. Backup folder `templates/` lama bila perlu.
2. Salin 13 file `.docx` versi baru ke `templates/` dengan **nama file
   tetap** (`template1.docx` … `template13.docx`) dan placeholder yang sama.
3. Tidak perlu mengubah `index.html` / `script.js`.

> **Penting untuk publikasi GitHub**: kalau kamu mau commit template
> internal hanya untuk dipakai lokal, tambahkan ke `.gitignore`:
> ```
> templates/*.docx
> !templates/template-public-*.docx
> ```
> Atau pakai dua folder terpisah (`templates/` untuk publik, `templates_private/`
> untuk internal yang di-`.gitignore`).

## Tips Membuat Template `.docx`

- **Tulis placeholder dalam satu kali ketikan**. Jangan menyalin-tempel
  sebagian, jangan ganti font di tengah-tengah `{{...}}`. Word menyimpan
  perubahan format sebagai *run* terpisah; bila placeholder terpecah jadi
  beberapa run, docxtemplater akan gagal mendeteksinya.
  - Cara aman: ketik utuh `{{namaN}}` lalu seleksi **seluruh** placeholder
    untuk mengubah font/ukuran/bold.
- **Hindari auto-correct** yang mengubah `{{` jadi karakter kurawal cantik
  (`„`, `"`, dst). Matikan AutoCorrect bila perlu.
- **Untuk teks multi-baris** seperti alamat: cukup pakai `{{alamatN}}`,
  newline yang diketik nasabah di textarea akan dirender sebagai `<br>`
  karena option `linebreaks: true` aktif di `script.js`.
- **Jangan rename file** template kecuali kamu juga update `script.js`
  (lihat bagian B di atas).

## Troubleshooting

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| `Gagal load file template` di console | Buka file via `file://` | Jalankan via HTTP server (lihat [Cara Menjalankan](#cara-menjalankan)). |
| Tombol tetap "Pilih Template" | Belum ada checkbox yang dicentang | Centang minimal satu template. |
| Hasil `.docx` tetap berisi `{{namaN}}` (tidak ter-substitusi) | Placeholder terpecah ke beberapa run di Word | Hapus placeholder, ketik ulang utuh tanpa mengubah format di tengahnya. |
| `Multi error` dari docxtemplater | Salah ketik placeholder (mis. `{{ namaN }}` dengan spasi) | Pakai persis `{{namaN}}` tanpa spasi. |
| File `.docx` rusak saat dibuka | Template asli sudah corrupt | Buka di Word, **Save As** ulang sebagai `.docx`. |

---

Lisensi: bebas dipakai untuk keperluan internal. Template publik di
`templates/` adalah dummy dan **bukan** dokumen resmi institusi manapun.
