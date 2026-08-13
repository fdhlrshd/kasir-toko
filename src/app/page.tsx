import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1A6AFF] text-white flex items-center justify-center text-[28px] font-semibold mx-auto mb-6">
          K
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#1E293B] mb-3">
          Kasir Toko
        </h1>
        <p className="text-[16px] text-[#333333] mb-8">
          Kelola barang, catat penjualan, dan pantau riwayat transaksi
          tokomu dalam satu aplikasi sederhana.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="bg-[#1A6AFF] text-white font-medium text-[16px] rounded-lg py-3 px-6 hover:bg-[#0055CC] transition-colors"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/login"
            className="border border-[#E5E7EB] text-[#1E293B] font-medium text-[16px] rounded-lg py-3 px-6 hover:bg-[#F5F5F5] transition-colors"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}