# Aplikasi Administrasi RT

🛠️ Dibangun dengan:

   React JS (Frontend)

   Laravel (Backend - terpisah)

   MySQL (Database)

Aplikasi ini merupakan bagian frontend dari sistem manajemen administrasi untuk kompleks perumahan. Sistem ini dirancang untuk membantu mengelola data penghuni, rumah, pembayaran iuran, serta menyediakan laporan pemasukan/pengeluaran per bulan dalam bentuk grafik.

Frontend ini hanya akan berjalan dengan benar jika telah terhubung ke backend Laravel dan database MySQL, karena seluruh data bersumber dari backend API.
Struktur Aplikasi

   Frontend (React):
    Menyediakan antarmuka pengguna seperti input data penghuni, rumah, pembayaran, dan laporan grafik.

  Backend (Laravel):
    Menyediakan API endpoint untuk proses CRUD dan logika bisnis, serta terkoneksi ke database MySQL.

  Database (MySQL):
    Menyimpan seluruh data terkait penghuni, rumah, pembayaran, dan histori.


# Deskripsi Alur Sistem
      [ React Frontend ]
            |
            v
      [ Laravel API Backend ]
            |
            v
      [ MySQL Database ]

React akan mengirimkan permintaan (request) HTTP seperti GET, POST, PUT, DELETE ke Laravel menggunakan Axios/fetch. Laravel kemudian memproses request tersebut, berinteraksi dengan database, dan mengembalikan response dalam format JSON.

## Relasi Tabel Database

### Entitas dan Relasi Utama:

1. **penghuni**  
   Kolom: `id`, `nama_lengkap`, `foto_ktp`, `status_penghuni`, `nomor_telepon`, `status_pernikahan`

2. **rumah**  
   Kolom: `id`, `blok`, `nomor`, `status_rumah`

3. **histori_penghuni**  
   Kolom: `id`, `rumah_id`, `penghuni_id`, `tanggal_mulai`, `tanggal_selesai`  
   Keterangan: menyimpan catatan siapa pernah tinggal di rumah mana

4. **pembayaran**  
   Kolom: `id`, `penghuni_id`, `rumah_id`, `tanggal_pembayaran`, `jenis_iuran`, `jumlah`, `periode`, `status_pembayaran`  
   Keterangan: mencatat semua transaksi iuran (satpam / kebersihan)

5. **pengeluaran**  
   Kolom: `id`, `tanggal`, `keterangan`, `jumlah`, `kategori`  
   Keterangan: digunakan untuk laporan keuangan bulanan

   ![ERD](https://github.com/user-attachments/assets/6050a874-5ea0-44b4-ac3e-159197aae991)

## 📌 Endpoint Backend Laravel

Prefix utama: `/api/v1`

### 🔹 Penghuni
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | /penghuni | Ambil semua penghuni |
| GET    | /penghuni/{id} | Detail penghuni |
| POST   | /penghuni | Tambah penghuni |
| PUT    | /penghuni/{id} | Ubah data penghuni |
| DELETE | /penghuni/{id} | Hapus penghuni |

### 🔹 Rumah
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | /rumah | Ambil semua rumah |
| GET    | /rumah/{id} | Detail rumah |
| POST   | /rumah | Tambah rumah |
| PUT    | /rumah/{id} | Ubah data rumah |
| DELETE | /rumah/{id} | Hapus rumah |
| POST   | /rumah/{id}/isi-penghuni | Set penghuni rumah |

### 🔹 Pembayaran
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | /pembayaran | Ambil semua pembayaran |
| POST   | /pembayaran | Tambah pembayaran |
| PUT    | /pembayaran/{id} | Ubah data pembayaran |
| DELETE | /pembayaran/{id} | Hapus pembayaran |

### 🔹 Pengeluaran
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | /pengeluaran | Ambil semua pengeluaran |
| POST   | /pengeluaran | Tambah pengeluaran |
| PUT    | /pengeluaran/{id} | Ubah pengeluaran |
| DELETE | /pengeluaran/{id} | Hapus pengeluaran |

### 🔹 Laporan & Statistik
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | /dashboard/stats | Statistik ringkasan dashboard |
| GET    | /report/summary | Grafik pemasukan & pengeluaran (tahunan) |
| GET    | /report/detail/{bulan} | Detail laporan per bulan |

---

## ⚙️ Tech Stack
- Laravel 12 (REST API Backend)
- React (Frontend)
- MySQL (Database)

