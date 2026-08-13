"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/barang", label: "Barang" },
  { href: "/penjualan", label: "Penjualan" },
  { href: "/riwayat", label: "Riwayat" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-[#E5E7EB] px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-[#1E293B] text-[18px]">
            {(session?.user as any)?.namaToko || "Kasir Toko"}
          </span>
          <div className="flex gap-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                  pathname?.startsWith(item.href)
                    ? "bg-[#1A6AFF]/10 text-[#1A6AFF]"
                    : "text-[#333333] hover:bg-[#F5F5F5]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-[14px] font-medium text-[#CC3366] hover:underline"
        >
          Keluar
        </button>
      </div>
    </nav>
  );
}