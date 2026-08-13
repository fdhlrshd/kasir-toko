"use client";

import { useSession, signOut } from "next-auth/react";

export default function BarangPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-[24px] font-semibold text-[#1E293B]">
        Halaman Barang
      </h1>
      <p className="text-[14px] text-[#333333] mt-2">
        Halo, {session?.user?.name} — toko: {(session?.user as any)?.namaToko}
      </p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 bg-[#CC3366] text-white text-[14px] rounded-lg px-4 py-2"
      >
        Keluar
      </button>
    </div>
  );
}