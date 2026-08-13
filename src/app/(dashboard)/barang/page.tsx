"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Barang = {
  id: string;
  namaBarang: string;
  fotoUrl: string | null;
  hargaModal: number;
  hargaJual: number;
};

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

export default function BarangPage() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Barang | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [namaBarang, setNamaBarang] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  async function loadBarang() {
    setLoading(true);
    const res = await fetch("/api/barang");
    const data = await res.json();
    setBarangList(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBarang();
  }, []);

  function openAddForm() {
    setEditing(null);
    setNamaBarang("");
    setHargaModal("");
    setHargaJual("");
    setFoto(null);
    setFotoPreview(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(item: Barang) {
    setEditing(item);
    setNamaBarang(item.namaBarang);
    setHargaModal(String(item.hargaModal));
    setHargaJual(String(item.hargaJual));
    setFoto(null);
    setFotoPreview(item.fotoUrl);
    setError("");
    setShowForm(true);
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFoto(file);
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("namaBarang", namaBarang);
    formData.append("hargaModal", hargaModal);
    formData.append("hargaJual", hargaJual);
    if (foto) formData.append("foto", foto);

    const url = editing ? `/api/barang/${editing.id}` : "/api/barang";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan barang");
      setSubmitting(false);
      return;
    }

    setShowForm(false);
    setSubmitting(false);
    loadBarang();
  }

  async function handleDelete(id: string) {
    setDeleteError("");
    const konfirmasi = confirm("Yakin ingin menghapus barang ini?");
    if (!konfirmasi) return;

    const res = await fetch(`/api/barang/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      setDeleteError(data.error || "Gagal menghapus barang");
      return;
    }

    loadBarang();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold text-[#1E293B]">Barang</h1>
        <button
          onClick={openAddForm}
          className="bg-[#1A6AFF] text-white text-[14px] font-medium rounded-lg px-4 py-2.5 hover:bg-[#0055CC] transition-colors"
        >
          + Tambah Barang
        </button>
      </div>

      {deleteError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#CF2E2E]/10 border border-[#CF2E2E] text-[#CF2E2E] text-[14px]">
          {deleteError}
        </div>
      )}

      {loading ? (
        <p className="text-[14px] text-[#333333]">Memuat...</p>
      ) : barangList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <p className="text-[14px] text-[#333333]">
            Belum ada barang. Klik "Tambah Barang" untuk mulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {barangList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
            >
              <div className="relative w-full h-40 bg-[#F5F5F5]">
                {item.fotoUrl ? (
                  <Image
                    src={item.fotoUrl}
                    alt={item.namaBarang}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ABB8C3] text-[13px]">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1E293B] text-[16px] mb-1">
                  {item.namaBarang}
                </h3>
                <p className="text-[13px] text-[#333333]">
                  Modal: {formatRupiah(item.hargaModal)}
                </p>
                <p className="text-[14px] font-medium text-[#1A6AFF] mb-3">
                  Jual: {formatRupiah(item.hargaJual)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex-1 text-[13px] font-medium border border-[#E5E7EB] rounded-lg py-2 hover:bg-[#F5F5F5] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-[13px] font-medium border border-[#CF2E2E] text-[#CF2E2E] rounded-lg py-2 hover:bg-[#CF2E2E]/5 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-[20px] font-semibold text-[#1E293B] mb-4">
              {editing ? "Edit Barang" : "Tambah Barang"}
            </h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-[#CF2E2E]/10 border border-[#CF2E2E] text-[#CF2E2E] text-[14px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1F2124]">
                  Nama Barang
                </label>
                <input
                  type="text"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  required
                  className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#1A6AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#1F2124]">
                    Harga Modal
                  </label>
                  <input
                    type="number"
                    value={hargaModal}
                    onChange={(e) => setHargaModal(e.target.value)}
                    required
                    min={0}
                    className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#1A6AFF]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#1F2124]">
                    Harga Jual
                  </label>
                  <input
                    type="number"
                    value={hargaJual}
                    onChange={(e) => setHargaJual(e.target.value)}
                    required
                    min={0}
                    className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#1A6AFF]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-[#1F2124]">
                  Foto
                </label>
                <input type="file" accept="image/*" onChange={handleFotoChange} />
                {fotoPreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#E5E7EB]">
                    <Image src={fotoPreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-[#E5E7EB] text-[#333333] text-[14px] font-medium rounded-lg py-2.5 hover:bg-[#F5F5F5] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1A6AFF] text-white text-[14px] font-medium rounded-lg py-2.5 hover:bg-[#0055CC] disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}