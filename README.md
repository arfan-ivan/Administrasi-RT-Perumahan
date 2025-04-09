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

# Relasi Tabel Database
Entitas dan Relasi Utama:

   penghuni
        id, nama_lengkap, foto_ktp, status_penghuni, nomor_telepon, status_pernikahan
   rumah
        id, blok, nomor, status_rumah
   histori_penghuni
        id, rumah_id, penghuni_id, tanggal_mulai, tanggal_selesai
        menyimpan catatan siapa pernah tinggal di rumah mana
   pembayaran
        id, penghuni_id, rumah_id, tanggal_pembayaran, jenis_iuran, jumlah, periode, status_pembayaran
        mencatat semua transaksi iuran (satpam / kebersihan)
   pengeluaran
        id, tanggal, keterangan, jumlah, kategori
        digunakan untuk laporan keuangan bulanan



   Front![ERD](https://github.com/user-attachments/assets/6050a874-5ea0-44b4-ac3e-159197aae991)


