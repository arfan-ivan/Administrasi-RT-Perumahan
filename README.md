# Aplikasi Administrasi RT

 Dibangun dengan:

- Laravel 12 (REST API Backend)
- React (Frontend)
- MySQL (Database)


Aplikasi ini merupakan bagian frontend dari sistem manajemen administrasi untuk kompleks perumahan. Sistem ini dirancang untuk membantu mengelola data penghuni, rumah, pembayaran iuran, serta menyediakan laporan pemasukan/pengeluaran per bulan dalam bentuk grafik.

Frontend ini hanya akan berjalan dengan benar jika telah terhubung ke backend Laravel dan database MySQL, karena seluruh data bersumber dari backend API.
Struktur Aplikasi

   Frontend (React):
    Menyediakan antarmuka pengguna seperti input data penghuni, rumah, pembayaran, dan laporan grafik.

  Backend (Laravel):
    Menyediakan API endpoint untuk proses CRUD dan logika bisnis, serta terkoneksi ke database MySQL.

  Database (MySQL):
    Menyimpan seluruh data terkait penghuni, rumah, pembayaran, dan histori.

# Panduan Instalasi Proyek Administrasi RT
Persyarat

Pastikan kamu sudah meng-install:

   PHP 8.1+

   Composer

   Node.js v18+

   npm atau yarn

   MySQL

   Git

## Struktur Repositori

      Administrasi-RT-Perumahan/
      ├── backend/        --> Laravel REST API
      └── frontend/       --> React

### Instalasi Project

1. Clone Repository

       git clone https://github.com/arfan-ivan/Administrasi-RT-Perumahan.git
       cd Administrasi-RT-Perumahan

2. Instalasi Backend (Laravel)
   
       cd backend

   Install dependensi Laravel:

       composer install
   Salin .env dari .env.example
   
       cp .env.example .env

   cari bagian ini

       DB_CONNECTION=sqlite
       DB_HOST=127.0.0.1
       DB_PORT=3306
       DB_DATABASE=laravel
       DB_USERNAME=root
       DB_PASSWORD=

   Ubah jadi seperti ini:
   
       DB_CONNECTION=mysql
       DB_HOST=127.0.0.1
       DB_PORT=3306
       DB_DATABASE=administrasi_rt  # Ganti jadi nama database yang kamu mau
       DB_USERNAME=root
       DB_PASSWORD=                 # kosongkan jika tanpa password
   
   Generate key aplikasi:
   
       php artisan key:generate

   Jalankan migrasi database:

       php artisan migrate

   Jalankan server Laravel:

       php artisan serve

   API backend akan berjalan di: http://localhost:8000

   jangan lupa untuk menjalankan perintah Berikut untuk Mengizinkan Browser bisa Mengakses Gambar dari Laravel
   
       php artisan storage:link
   
   Perintah ini akan membuat folder `public/storage` yang mengarah ke `storage/app/public`
   yang akan menampilkan gambar ktp yang sudah di inputkan


4. Instalasi Frontend
   Masuk ke folder frontend:
   
       cd ../frontend
   
   Install dependensi React:
   
       npm install
   
   Jalankan React dev server:
   
       npm start

   Frontend akan berjalan di: http://localhost:3000
    


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

   # Database Schema - Aplikasi Administrasi RT

Dokumentasi ini menjelaskan struktur tabel dan relasi utama yang digunakan dalam sistem administrasi RT.

---

## 🧍‍♂️ Table: `penghuni`

Menyimpan data penghuni yang tinggal atau pernah tinggal di lingkungan perumahan.

| Kolom           | Tipe Data           | Keterangan                        |
|------------------|----------------------|------------------------------------|
| id               | bigint(20)           | Primary key                        |
| nama_lengkap     | varchar(255)         | Nama lengkap penghuni              |
| foto_ktp         | varchar(255)         | Path/file foto KTP                 |
| status_penghuni  | enum('kontrak', 'tetap') | Status tinggal penghuni        |
| nomor_telepon    | varchar(255)         | Nomor HP aktif                     |
| sudah_menikah    | tinyint(1)           | 1 = sudah menikah, 0 = belum       |
| created_at       | timestamp            |                                   |
| updated_at       | timestamp            |                                   |

---

## 🏠 Table: `rumah`

Menyimpan informasi rumah yang tersedia di lingkungan perumahan.

| Kolom         | Tipe Data     | Keterangan                            |
|----------------|----------------|----------------------------------------|
| id             | bigint(20)     | Primary key                            |
| nomor_rumah    | varchar(255)   | Nomor rumah (unik)                     |
| status         | enum('dihuni', 'tidak dihuni') | Status rumah saat ini     |
| created_at     | timestamp      |                                        |
| updated_at     | timestamp      |                                        |

---

## 🏘️ Table: `histori_penghuni`

Menyimpan riwayat tempat tinggal penghuni, termasuk kapan dan di rumah mana mereka pernah tinggal.

| Kolom           | Tipe Data     | Keterangan                            |
|------------------|----------------|----------------------------------------|
| id               | bigint(20)     | Primary key                            |
| rumah_id         | bigint(20)     | Relasi ke `rumah.id`                   |
| penghuni_id      | bigint(20)     | Relasi ke `penghuni.id`                |
| tanggal_masuk    | date           | Tanggal mulai tinggal                  |
| tanggal_keluar   | date           | Tanggal pindah/selesai tinggal         |
| created_at       | timestamp      |                                        |
| updated_at       | timestamp      |                                        |

📌 **Relasi:**  
- Many-to-Many antara `penghuni` dan `rumah` melalui tabel `histori_penghuni`

---

## 💸 Table: `pembayaran`

Mencatat seluruh transaksi iuran dari penghuni, baik iuran kebersihan maupun satpam.

| Kolom               | Tipe Data        | Keterangan                                      |
|----------------------|------------------|--------------------------------------------------|
| id                   | integer           | Primary key                                      |
| penghuni_id          | bigint(20)        | Relasi ke `penghuni.id`                          |
| rumah_id             | bigint(20)        | Relasi ke `rumah.id`                             |
| tanggal_pembayaran   | timestamp         | Tanggal pembayaran dilakukan                     |
| iuran_kebersihan     | decimal(10,2)     | Nominal iuran kebersihan                         |
| iuran_satpam         | decimal(10,2)     | Nominal iuran satpam                             |
| status               | enum('lunas', 'belum') | Status pembayaran                           |
| bulan_dibayar        | longtext          | Bulan-bulan yang dibayar (bisa multi bulan)      |
| full_year            | tinyint(1)        | 1 = pembayaran setahun penuh, 0 = tidak          |
| title                | varchar           | Judul atau ringkasan pembayaran                  |
| body                 | text              | Keterangan rinci pembayaran                      |
| created_at           | timestamp         |                                                  |
| updated_at           | timestamp         |                                                  |

📌 **Relasi:**  
- One-to-Many dari `penghuni` ke `pembayaran`  
- One-to-Many dari `rumah` ke `pembayaran`

---

## 🧾 Table: `pengeluaran`

Mencatat pengeluaran RT yang digunakan dalam laporan keuangan bulanan.

| Kolom       | Tipe Data        | Keterangan                    |
|--------------|------------------|--------------------------------|
| id           | integer           | Primary key                    |
| tanggal      | date              | Tanggal pengeluaran            |
| deskripsi    | varchar(255)      | Keterangan penggunaan dana     |
| jumlah       | decimal(10,2)     | Nominal pengeluaran            |
| kategori     | varchar(255)      | Kategori (misalnya: kebersihan, keamanan) |
| created_at   | timestamp         |                                |
| updated_at   | timestamp         |                                |

📌 **Catatan:**  
- Tidak berelasi dengan tabel lain. Digunakan secara mandiri untuk laporan bulanan.

---

## 🔗 Ringkasan Relasi

- `histori_penghuni.penghuni_id` ➝ `penghuni.id` (**many-to-many**)  
- `histori_penghuni.rumah_id` ➝ `rumah.id`  
- `pembayaran.penghuni_id` ➝ `penghuni.id` (**one-to-many**)  
- `pembayaran.rumah_id` ➝ `rumah.id` (**one-to-many**)

---

> Untuk kebutuhan ERD visual dan implementasi lebih lanjut (Laravel migration, seeder, dsb), silakan sesuaikan dengan struktur ini.



   ![ERD](https://github.com/user-attachments/assets/6050a874-5ea0-44b4-ac3e-159197aae991)

##  Endpoint Backend Laravel

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


