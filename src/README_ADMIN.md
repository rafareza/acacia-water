# Admin Panel - Acacia Water E-Commerce

## Overview

Admin panel untuk mengelola website Acacia Water dengan fitur lengkap untuk manajemen produk dan laporan penjualan.

## Fitur Admin Panel

### 1. **Manajemen Produk (CRUD)**
- ✅ **Create**: Tambah produk baru dengan detail lengkap
- ✅ **Read**: Lihat semua produk dalam tabel terstruktur
- ✅ **Update**: Edit informasi produk yang sudah ada
- ✅ **Delete**: Hapus produk dari katalog

**Detail Produk:**
- Nama produk
- Deskripsi
- Harga (Rupiah)
- URL gambar
- Kategori (Galon / Gas)
- Status stok (Tersedia / Habis)
- Badge popular

### 2. **Laporan Penjualan**
- 📊 **Dashboard Summary**:
  - Total pesanan
  - Total pendapatan
  - Rata-rata per pesanan
  
- 📅 **Filter Tanggal**:
  - Filter berdasarkan rentang tanggal
  - Lihat data harian, mingguan, atau bulanan
  
- 📈 **Ringkasan Harian**:
  - Jumlah pesanan per hari
  - Total pendapatan per hari
  
- 📋 **Daftar Pesanan Lengkap**:
  - Info pelanggan (nama, telepon)
  - Detail item yang dipesan
  - Metode pembayaran
  - Status pesanan
  - Total pembayaran
  
- 💾 **Export Data**:
  - Export laporan ke CSV
  - Untuk analisis lebih lanjut di Excel/Google Sheets

## Setup Awal

### Langkah 1: Buat Admin User

1. Buka **Supabase Dashboard**: https://supabase.com/dashboard
2. Pilih project Acacia Water Anda
3. Klik **Authentication** → **Users**
4. Klik **Add user** → **Create new user**
5. Isi data:
   ```
   Email: admin@acaciawater.com
   Password: [password-kuat-anda]
   Auto Confirm User: ✓ (centang)
   ```
6. Klik **Create user**

### Langkah 2: Login ke Admin Panel

1. Buka website Acacia Water
2. Scroll ke **footer**
3. Klik link **"Admin Login"**
4. Atau akses langsung: `https://your-domain.com/admin`
5. Masukkan email dan password admin
6. Klik **Login**

## Cara Menggunakan

### Mengelola Produk

#### Tambah Produk Baru:
1. Login ke admin panel
2. Tab **"Produk"** (default)
3. Klik tombol **"Tambah Produk"**
4. Isi form:
   - Nama Produk
   - Deskripsi
   - Harga (dalam Rupiah, tanpa titik/koma)
   - Kategori (Galon / Gas)
   - URL Gambar (https://...)
   - Toggle "Tersedia" (centang jika stok ada)
   - Toggle "Popular" (centang untuk badge popular)
5. Klik **"Tambah Produk"**

#### Edit Produk:
1. Cari produk di tabel
2. Klik tombol **✏️ (Pencil icon)**
3. Update informasi yang diperlukan
4. Klik **"Simpan Perubahan"**

#### Hapus Produk:
1. Cari produk di tabel
2. Klik tombol **🗑️ (Trash icon)**
3. Konfirmasi penghapusan
4. Produk akan terhapus permanen

### Melihat Laporan Penjualan

#### Dashboard Overview:
1. Login ke admin panel
2. Klik tab **"Laporan Penjualan"**
3. Lihat summary cards di atas:
   - Total Pesanan
   - Total Pendapatan
   - Rata-rata per Pesanan

#### Filter by Date:
1. Di bagian "Filter Tanggal"
2. Pilih **"Dari Tanggal"** (start date)
3. Pilih **"Sampai Tanggal"** (end date)
4. Klik **"Terapkan"**
5. Data akan difilter sesuai rentang tanggal
6. Klik **"Reset"** untuk melihat semua data

#### Export to CSV:
1. Setelah filter data (opsional)
2. Klik tombol **"Export CSV"**
3. File CSV akan otomatis terdownload
4. Buka dengan Excel atau Google Sheets

#### Lihat Detail Pesanan:
- Scroll ke bagian "Daftar Pesanan"
- Semua pesanan ditampilkan dalam tabel
- Info yang ditampilkan:
  - Tanggal & waktu pesanan
  - Nama pelanggan
  - Nomor telepon
  - Jumlah item
  - Metode pembayaran (Transfer / COD)
  - Status pesanan
  - Total pembayaran

## Integrasi dengan Website

### Products Display:
- Website akan otomatis fetch produk dari database
- Jika database kosong, akan tampil produk default
- Setelah admin menambah produk, website akan menampilkan produk dari database
- Refresh halaman website untuk melihat perubahan

### Orders:
- Setiap customer melakukan checkout, data otomatis tersimpan
- Admin dapat melihat semua pesanan di laporan penjualan
- Info kontak customer tersedia untuk follow-up

## Tips & Best Practices

### Manajemen Produk:
- ✅ Gunakan gambar berkualitas tinggi untuk produk
- ✅ Tulis deskripsi yang jelas dan informatif
- ✅ Update status stok secara berkala
- ✅ Tandai produk populer untuk meningkatkan penjualan
- ✅ Hapus produk yang sudah tidak dijual

### Laporan Penjualan:
- 📊 Review laporan setiap hari/minggu
- 📈 Gunakan data untuk analisis tren penjualan
- 💾 Export data secara berkala untuk backup
- 📞 Follow-up pesanan pending via WhatsApp/telepon

### Keamanan:
- 🔒 Gunakan password yang kuat (min. 8 karakter)
- 🔒 Jangan share credentials admin
- 🔒 Logout setelah selesai menggunakan
- 🔒 Akses admin hanya dari perangkat terpercaya

## Troubleshooting

### Tidak bisa login?
- Pastikan email dan password benar
- Cek di Supabase Dashboard apakah user sudah dibuat
- Pastikan "Auto Confirm User" sudah dicentang

### Produk tidak muncul di website?
- Refresh halaman website
- Cek apakah produk sudah disimpan di admin panel
- Pastikan koneksi internet stabil

### Laporan penjualan kosong?
- Pastikan ada transaksi dari customer
- Cek filter tanggal, mungkin perlu direset
- Refresh halaman

### Error saat menyimpan data?
- Cek koneksi internet
- Pastikan semua field required sudah diisi
- Coba refresh dan login ulang

## Data Structure

### Product:
```json
{
  "id": "product:uuid",
  "name": "Galon Air Mineral 19L",
  "description": "Air mineral berkualitas tinggi...",
  "price": 21000,
  "image": "https://...",
  "category": "galon",
  "inStock": true,
  "popular": true,
  "createdAt": "2025-01-22T10:00:00Z",
  "updatedAt": "2025-01-22T10:00:00Z"
}
```

### Order:
```json
{
  "id": "order:uuid",
  "items": [...],
  "total": 21000,
  "deliveryFee": 5000,
  "paymentMethod": "transfer",
  "customerInfo": {
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. ...",
    "notes": "..."
  },
  "status": "pending",
  "createdAt": "2025-01-22T10:00:00Z"
}
```

## Support

Untuk bantuan lebih lanjut:
- 📧 Email: admin@acaciawater.com
- 📱 WhatsApp: 0858-9410-9114
- 📖 Dokumentasi: Lihat file ADMIN_SETUP.md

---

**Acacia Water Admin Panel v1.0**
© 2025 Acacia Water. All rights reserved.
