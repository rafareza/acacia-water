# Setup Admin User - Acacia Water

## Cara Membuat Admin User Pertama

Untuk membuat admin user pertama, Anda perlu menggunakan Supabase Dashboard:

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Kunjungi: https://supabase.com/dashboard
   - Login dengan akun Supabase Anda

2. **Pilih Project**
   - Pilih project Acacia Water Anda

3. **Buat User Admin**
   - Klik menu "Authentication" di sidebar
   - Klik "Users" tab
   - Klik tombol "Add user" → "Create new user"
   - Masukkan:
     - Email: admin@acaciawater.com (atau email admin Anda)
     - Password: [Pilih password yang kuat]
     - Auto Confirm User: ✓ (centang)
   - Klik "Create user"

4. **Login ke Admin Panel**
   - Kunjungi website Anda
   - Scroll ke bagian footer
   - Klik "Admin Login"
   - Masukkan email dan password yang sudah dibuat
   - Klik "Login"

## Akses Admin Panel

- URL: `/admin`
- Atau klik link "Admin Login" di footer website

## Fitur Admin Panel

### 1. Manajemen Produk (CRUD)
- Tambah produk baru
- Edit produk yang ada
- Hapus produk
- Update stok (tersedia/habis)
- Tandai produk popular

### 2. Laporan Penjualan
- Lihat semua pesanan
- Filter berdasarkan tanggal
- Ringkasan harian
- Total pesanan dan pendapatan
- Export ke CSV

## Catatan Penting

- **Keamanan**: Jangan share credentials admin dengan sembarangan
- **Password**: Gunakan password yang kuat (minimal 8 karakter, kombinasi huruf, angka, simbol)
- **Backup**: Pastikan untuk backup data secara berkala

## Troubleshooting

### Tidak bisa login?
- Pastikan email dan password benar
- Cek apakah user sudah dibuat di Supabase Dashboard
- Pastikan "Auto Confirm User" sudah dicentang saat membuat user

### Lupa password?
- Gunakan fitur "Reset Password" di Supabase Dashboard
- Atau buat user baru dari Dashboard

## Default Data

Saat ini aplikasi masih menggunakan data dummy di frontend. Untuk menggunakan data dari database:
1. Login ke admin panel
2. Tambahkan produk melalui menu "Manajemen Produk"
3. Data produk akan tersimpan di database Supabase
4. (Future update: Frontend akan fetch produk dari database)
