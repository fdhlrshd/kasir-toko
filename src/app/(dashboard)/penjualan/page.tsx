"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Barang = {
  id: string;
  namaBarang: string;
  fotoUrl: string | null;
  hargaJual: number;
};

type CartItem = {
  barangId: string;
  namaBarang: string;
  hargaJual: number;
  qty: number;
};

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

export default function PenjualanPage() {
  const router = useRouter();
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [uangDiterima, setUangDiterima] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState<{ kembalian: number } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/barang");
      const data = await res.json();
      setBarangList(data);
      setLoading(false);
    }
    load();
  }, []);

  function tambahKeKeranjang(barang: Barang) {
    setCart((prev) => {
      const existing = prev.find((c) => c.barangId === barang.id);
      if (existing) {
        return prev.map((c) =>
          c.barangId === barang.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          barangId: barang.id,
          namaBarang: barang.namaBarang,
          hargaJual: barang.hargaJual,
          qty: 1,
        },
      ];
    });
  }

  function ubahQty(barangId: string, qty: number) {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.barangId !== barangId));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.barangId === barangId ? { ...c, qty } : c))
    );
  }

  const totalHarga = cart.reduce((sum, c) => sum + c.hargaJual * c.qty, 0);
  const uang = parseInt(uangDiterima) || 0;
  const kembalian = uang - totalHarga;

  async function handleBayar() {
    setError("");

    if (cart.length === 0) {
      setError("Pilih minimal satu barang");
      return;
    }
    if (uang < totalHarga) {
      setError("Uang yang diberikan kurang dari total harga");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/penjualan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((c) => ({ barangId: c.barangId, qty: c.qty })),
        uangDiterima: uang,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal menyimpan transaksi");
      setSubmitting(false);
      return;
    }

    setSukses({ kembalian: data.kembalian });
    setCart([]);
    setUangDiterima("");
    setSubmitting(false);
  }

  if (sukses) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center mt-10">
        <div className="w-14 h-14 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center text-[28px] mx-auto mb-4">
          ✓
        </div>
        <h2 className="text-[20px] font-semibold text-[#1E293B] mb-2">
          Transaksi Berhasil
        </h2>
        <p className="text-[14px] text-[#333333] mb-1">Kembalian</p>
        <p className="text-[28px] font-semibold text-[#1A6AFF] mb-6">
          {formatRupiah(sukses.kembalian)}
        </p>
        <button
          onClick={() => setSukses(null)}
          className="bg-[#1A6AFF] text-white text-[14px] font-medium rounded-lg px-6 py-2.5 hover:bg-[#0055CC] transition-colors"
        >
          Transaksi Baru
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[24px] font-semibold text-[#1E293B] mb-6">
        Penjualan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar barang */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-[14px] text-[#333333]">Memuat...</p>
          ) : barangList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
              <p className="text-[14px] text-[#333333]">
                Belum ada barang. Tambahkan barang dulu di menu Barang.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {barangList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => tambahKeKeranjang(item)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-left hover:border-[#1A6AFF] transition-colors"
                >
                  <p className="font-medium text-[#1E293B] text-[14px] mb-1">
                    {item.namaBarang}
                  </p>
                  <p className="text-[13px] text-[#1A6AFF]">
                    {formatRupiah(item.hargaJual)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keranjang & pembayaran */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-fit">
          <h2 className="font-semibold text-[#1E293B] text-[16px] mb-4">
            Keranjang
          </h2>

          {cart.length === 0 ? (
            <p className="text-[13px] text-[#333333]">
              Klik barang di sebelah kiri untuk menambahkan.
            </p>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {cart.map((c) => (
                <div key={c.barangId} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1E293B] truncate">
                      {c.namaBarang}
                    </p>
                    <p className="text-[12px] text-[#333333]">
                      {formatRupiah(c.hargaJual)} x {c.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => ubahQty(c.barangId, c.qty - 1)}
                      className="w-7 h-7 rounded-lg border border-[#E5E7EB] text-[14px] hover:bg-[#F5F5F5]"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-[13px]">{c.qty}</span>
                    <button
                      onClick={() => ubahQty(c.barangId, c.qty + 1)}
                      className="w-7 h-7 rounded-lg border border-[#E5E7EB] text-[14px] hover:bg-[#F5F5F5]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#E5E7EB] pt-3 mb-4">
            <div className="flex justify-between text-[14px] font-semibold text-[#1E293B]">
              <span>Total</span>
              <span>{formatRupiah(totalHarga)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <label className="text-[13px] font-bold text-[#1F2124]">
              Uang Diberikan
            </label>
            <input
              type="number"
              value={uangDiterima}
              onChange={(e) => setUangDiterima(e.target.value)}
              min={0}
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#1A6AFF]"
              placeholder="0"
            />
          </div>

          <div className="flex justify-between text-[14px] mb-4">
            <span className="text-[#333333]">Kembalian</span>
            <span
              className={`font-semibold ${
                kembalian < 0 ? "text-[#CF2E2E]" : "text-[#2E7D32]"
              }`}
            >
              {formatRupiah(kembalian < 0 ? 0 : kembalian)}
            </span>
          </div>

          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-[#CF2E2E]/10 border border-[#CF2E2E] text-[#CF2E2E] text-[13px]">
              {error}
            </div>
          )}

          <button
            onClick={handleBayar}
            disabled={submitting || cart.length === 0}
            className="w-full bg-[#1A6AFF] text-white text-[14px] font-medium rounded-lg py-3 hover:bg-[#0055CC] disabled:opacity-50 transition-colors"
          >
            {submitting ? "Memproses..." : "Bayar"}
          </button>
        </div>
      </div>
    </div>
  );
}