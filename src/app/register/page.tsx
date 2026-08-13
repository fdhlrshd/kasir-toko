"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    namaPengguna: "",
    namaToko: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      const loginResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("Berhasil daftar, tapi gagal login otomatis. Silakan login manual.");
        setLoading(false);
        return;
      }

      router.push("/barang");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-8 border border-[#E5E7EB]">
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-1">
          Daftar Akun
        </h1>
        <p className="text-[14px] text-[#333333] mb-6">
          Buat akun toko kamu untuk mulai menggunakan Kasir Toko.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#CF2E2E]/10 border border-[#CF2E2E] text-[#CF2E2E] text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1F2124]">
              Nama Pengguna
            </label>
            <input
              type="text"
              name="namaPengguna"
              value={form.namaPengguna}
              onChange={handleChange}
              required
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] text-[#111827] focus:outline-none focus:border-[#1A6AFF] focus:bg-[#1A6AFF]/[0.02] transition-colors"
              placeholder="Nama kamu"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1F2124]">
              Nama Toko
            </label>
            <input
              type="text"
              name="namaToko"
              value={form.namaToko}
              onChange={handleChange}
              required
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] text-[#111827] focus:outline-none focus:border-[#1A6AFF] focus:bg-[#1A6AFF]/[0.02] transition-colors"
              placeholder="Nama toko kamu"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1F2124]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] text-[#111827] focus:outline-none focus:border-[#1A6AFF] focus:bg-[#1A6AFF]/[0.02] transition-colors"
              placeholder="email@contoh.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#1F2124]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] text-[#111827] focus:outline-none focus:border-[#1A6AFF] focus:bg-[#1A6AFF]/[0.02] transition-colors"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#1A6AFF] text-white font-medium text-[16px] rounded-lg py-3 hover:bg-[#0055CC] active:bg-[#004499] disabled:bg-[#ABB8C3] disabled:opacity-[0.63] transition-colors"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#333333]">
          Sudah punya akun?{" "}
          <a href="/login" className="text-[#0073AA] underline">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}