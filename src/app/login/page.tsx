"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah");
      setLoading(false);
      return;
    }

    router.push("/barang");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-8 border border-[#E5E7EB]">
        <h1 className="text-[28px] font-semibold text-[#1E293B] mb-1">
          Masuk
        </h1>
        <p className="text-[14px] text-[#333333] mb-6">
          Masuk ke akun toko kamu.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#CF2E2E]/10 border border-[#CF2E2E] text-[#CF2E2E] text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[16px] text-[#111827] focus:outline-none focus:border-[#1A6AFF] focus:bg-[#1A6AFF]/[0.02] transition-colors"
              placeholder="Password kamu"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#1A6AFF] text-white font-medium text-[16px] rounded-lg py-3 hover:bg-[#0055CC] active:bg-[#004499] disabled:bg-[#ABB8C3] disabled:opacity-[0.63] transition-colors"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[#333333]">
          Belum punya akun?{" "}
          <a href="/register" className="text-[#0073AA] underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}