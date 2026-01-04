# Luxury Photography & Videography Service Website

Sebuah website profesional untuk jasa fotografi dan videografi dengan sistem booking dan live chat.

## Fitur Utama

### Untuk Klien (User)
1. **Landing Page** yang elegan dengan desain luxury
2. **Sistem Booking** 4 langkah:
   - Pilih paket
   - Isi data diri
   - Pilih tanggal & waktu
   - Konfirmasi
3. **Live Chat** dengan admin
4. **Portfolio** galeri foto & video
5. **Testimonial** slider
6. **Harga** paket layanan

### Untuk Admin
1. **Dashboard** dengan statistik
2. **Manajemen Booking** (lihat, edit, hapus)
3. **Live Chat Interface** dengan daftar pengguna
4. **Manajemen Pengguna**
5. **Pengaturan** sistem

## Cara Menjalankan

1. Download semua file ke dalam satu folder:
   - `index.html` (halaman utama)
   - `admin.html` (dashboard admin)
   - `style.css` (stylesheet utama)
   - `script.js` (JavaScript utama)
   - `chat.js` (sistem live chat)
   - `admin.js` (JavaScript admin)

2. Buka `index.html` di browser untuk mengakses website klien.

3. Untuk mengakses dashboard admin:
   - Klik tombol "Admin" di pojok kiri bawah
   - Login dengan:
     - Username: `admin`
     - Password: `password123`

## Teknologi yang Digunakan

- **HTML5** untuk struktur
- **CSS3** dengan custom properties (variables)
- **Vanilla JavaScript** (tanpa framework)
- **LocalStorage** untuk penyimpanan data
- **Font Awesome** untuk ikon
- **Google Fonts** (Cinzel & Inter)

## Sistem Penyimpanan Data

Website ini menggunakan `localStorage` untuk menyimpan data:
- **Booking data** - informasi pemesanan
- **Chat history** - riwayat percakapan
- **Admin settings** - pengaturan admin
- **User data** - data pengguna chat

## Responsive Design

Website didesain untuk semua perangkat:
- **Desktop** (≥ 1024px)
- **Tablet** (768px - 1023px)
- **Mobile** (≤ 767px)

## Fitur Interaktif

1. **Animasi Scroll** - elemen muncul saat di-scroll
2. **Hover Effects** - efek hover pada tombol dan kartu
3. **Form Validation** - validasi form booking
4. **Real-time Chat** - simulasi chat real-time
5. **Notification System** - sistem notifikasi
6. **Admin Online Status** - status online/offline admin

## Demo Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `password123`

## Customization

Untuk menyesuaikan website dengan bisnis Anda:

1. **Warna**: Ubah variabel CSS di `style.css`
2. **Konten**: Ubah teks di `index.html`
3. **Gambar**: Ganti URL gambar dengan gambar milik Anda
4. **Harga**: Ubah di bagian pricing di `index.html`
5. **Pengaturan**: Ubah di dashboard admin

## Catatan

- Sistem ini menggunakan `localStorage` yang berarti data hanya tersimpan di browser pengguna.
- Untuk penggunaan produksi, disarankan untuk mengintegrasikan dengan backend database.
- Live chat saat ini adalah simulasi. Untuk chat real-time, integrasikan dengan WebSocket.

## Lisensi

Proyek ini dapat digunakan untuk keperluan komersial dan personal.