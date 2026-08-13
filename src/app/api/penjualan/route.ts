import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ItemInput = {
  barangId: string;
  qty: number;
};

// GET — ambil riwayat transaksi (dipakai juga di Step 6)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const penjualanList = await prisma.penjualan.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return NextResponse.json(penjualanList);
}

// POST — buat transaksi penjualan baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await req.json();
  const { items, uangDiterima } = body as {
    items: ItemInput[];
    uangDiterima: number;
  };

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "Pilih minimal satu barang" },
      { status: 400 }
    );
  }

  // Ambil data barang asli dari database — JANGAN percaya harga yang dikirim dari browser
  const barangIds = items.map((i) => i.barangId);
  const barangData = await prisma.barang.findMany({
    where: { id: { in: barangIds }, userId },
  });

  if (barangData.length !== items.length) {
    return NextResponse.json(
      { error: "Ada barang yang tidak valid atau bukan milik toko ini" },
      { status: 400 }
    );
  }

  // Hitung total pakai harga ASLI dari database, bukan dari input browser
  let totalHarga = 0;
  const itemsWithDetail = items.map((item) => {
    const barang = barangData.find((b) => b.id === item.barangId)!;
    const subtotal = barang.hargaJual * item.qty;
    totalHarga += subtotal;
    return {
      barangId: barang.id,
      namaBarangSnapshot: barang.namaBarang,
      hargaJualSnapshot: barang.hargaJual,
      qty: item.qty,
      subtotal,
    };
  });

  if (uangDiterima < totalHarga) {
    return NextResponse.json(
      { error: "Uang yang diberikan kurang dari total harga" },
      { status: 400 }
    );
  }

  const kembalian = uangDiterima - totalHarga;

  const penjualan = await prisma.penjualan.create({
    data: {
      userId,
      totalHarga,
      uangDiterima,
      kembalian,
      items: {
        create: itemsWithDetail,
      },
    },
    include: { items: true },
  });

  return NextResponse.json(penjualan, { status: 201 });
}