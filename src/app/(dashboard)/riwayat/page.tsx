"use client";

import { useEffect, useState } from "react";

type PenjualanItem = {
  id: string;
  namaBarangSnapshot: string;
  hargaJualSnapshot: number;
  qty: number;
  subtotal: number;
};

type Penjualan = {
  id: string;
  totalHarga: number;
  uangDiterima: number;
  kembalian: number;
  createdAt: string;
  items: PenjualanItem[];
};

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<Penjualan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/penjualan");
      const data = await res.json();
      setRiwayat(data);
      setLoading(false);
    }
    load();
  }, []);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <h1 className="text-[24px] font-semibold text-[#1E293B] mb-6">
        Riwayat Penjualan
      </h1>

      {loading ? (
        <p className="text-[14px] text-[#333333]">Memuat...</p>
      ) : riwayat.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <p className="text-[14px] text-[#333333]">
            Belum ada transaksi penjualan.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {riwayat.map((trx) => (
            <div
              key={trx.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(trx.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F5F5] transition-colors"
              >
                <div>
                  <p className="text-[14px] font-medium text-[#1E293B]">
                    {formatTanggal(trx.createdAt)}
                  </p>
                  <p className="text-[13px] text-[#333333]">
                    {trx.items.length} jenis barang
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-[#1A6AFF]">
                    {formatRupiah(trx.totalHarga)}
                  </span>
                  <span className="text-[#ABB8C3] text-[14px]">
                    {expandedId === trx.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {expandedId === trx.id && (
                <div className="border-t border-[#E5E7EB] p-4 bg-[#F5F5F5]/50">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-left text-[#333333]">
                        <th className="pb-2 font-medium">Barang</th>
                        <th className="pb-2 font-medium text-center">Qty</th>
                        <th className="pb-2 font-medium text-right">Harga</th>
                        <th className="pb-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trx.items.map((item) => (
                        <tr key={item.id} className="border-t border-[#E5E7EB]">
                          <td className="py-2 text-[#1E293B]">
                            {item.namaBarangSnapshot}
                          </td>
                          <td className="py-2 text-center">{item.qty}</td>
                          <td className="py-2 text-right">
                            {formatRupiah(item.hargaJualSnapshot)}
                          </td>
                          <td className="py-2 text-right font-medium">
                            {formatRupiah(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-t border-[#E5E7EB] mt-3 pt-3 flex flex-col gap-1 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#333333]">Uang Diberikan</span>
                      <span>{formatRupiah(trx.uangDiterima)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-[#333333]">Kembalian</span>
                      <span>{formatRupiah(trx.kembalian)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}