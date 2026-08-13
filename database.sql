-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 13 Agu 2026 pada 07.26
-- Versi server: 8.0.30
-- Versi PHP: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `kasir_toko`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaBarang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fotoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hargaModal` int NOT NULL,
  `hargaJual` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`id`, `userId`, `namaBarang`, `fotoUrl`, `hargaModal`, `hargaJual`, `createdAt`, `updatedAt`) VALUES
('cmsr6g9i100027oucab0oo0o8', 'cmsr0u8bg00007ouci9m6kj21', 'Noboo', NULL, 2800, 4000, '2026-08-13 07:08:58.777', '2026-08-13 07:08:58.777');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penjualan`
--

CREATE TABLE `penjualan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalHarga` int NOT NULL,
  `uangDiterima` int NOT NULL,
  `kembalian` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `penjualan`
--

INSERT INTO `penjualan` (`id`, `userId`, `totalHarga`, `uangDiterima`, `kembalian`, `createdAt`) VALUES
('cmsr6mxq700037oucg44vxusx', 'cmsr0u8bg00007ouci9m6kj21', 8000, 10000, 2000, '2026-08-13 07:14:10.111'),
('cmsr6wa8n00057oucid1es1q8', 'cmsr0u8bg00007ouci9m6kj21', 12000, 12000, 0, '2026-08-13 07:21:26.231');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penjualanitem`
--

CREATE TABLE `penjualanitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `penjualanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barangId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaBarangSnapshot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hargaJualSnapshot` int NOT NULL,
  `qty` int NOT NULL,
  `subtotal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `penjualanitem`
--

INSERT INTO `penjualanitem` (`id`, `penjualanId`, `barangId`, `namaBarangSnapshot`, `hargaJualSnapshot`, `qty`, `subtotal`) VALUES
('cmsr6mxqh00047oucg2balt3n', 'cmsr6mxq700037oucg44vxusx', 'cmsr6g9i100027oucab0oo0o8', 'Noboo', 4000, 2, 8000),
('cmsr6wa8r00067ouct4otwd8c', 'cmsr6wa8n00057oucid1es1q8', 'cmsr6g9i100027oucab0oo0o8', 'Noboo', 4000, 3, 12000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaPengguna` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `namaToko` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `namaPengguna`, `namaToko`, `email`, `passwordHash`, `createdAt`) VALUES
('cmsr0u8bg00007ouci9m6kj21', 'Fadhil', 'Jaya Abadi', 'ahmadmldz@gmail.com', '$2b$10$y4kpnRR40LKYVRv8zrxC2u9vNFMXKC4fht1az/l3h0y4QpwwAZ8Ym', '2026-08-13 04:31:52.733');

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('ea1deef1-283c-473c-b7d8-1c0f879dfadf', '8ac9cb3984f26ac6aed759d0c347a71409ee8b11632776f02fba40ec4f3b2ad6', '2026-08-11 03:59:04.974', '20260811035903_create_initial_schema', NULL, NULL, '2026-08-11 03:59:03.957', 1);

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Barang_userId_idx` (`userId`);

--
-- Indeks untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Penjualan_userId_idx` (`userId`);

--
-- Indeks untuk tabel `penjualanitem`
--
ALTER TABLE `penjualanitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PenjualanItem_penjualanId_idx` (`penjualanId`),
  ADD KEY `PenjualanItem_barangId_idx` (`barangId`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `Barang_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  ADD CONSTRAINT `Penjualan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `penjualanitem`
--
ALTER TABLE `penjualanitem`
  ADD CONSTRAINT `PenjualanItem_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `barang` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `PenjualanItem_penjualanId_fkey` FOREIGN KEY (`penjualanId`) REFERENCES `penjualan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
