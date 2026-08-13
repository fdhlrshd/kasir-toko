import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET — ambil semua barang milik toko yang lagi login
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const barangList = await prisma.barang.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(barangList);
}

// POST — tambah barang baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const formData = await req.formData();
  const namaBarang = formData.get("namaBarang") as string;
  const hargaModal = formData.get("hargaModal") as string;
  const hargaJual = formData.get("hargaJual") as string;
  const foto = formData.get("foto") as File | null;

  if (!namaBarang || !hargaModal || !hargaJual) {
    return NextResponse.json(
      { error: "Nama barang, harga modal, dan harga jual wajib diisi" },
      { status: 400 }
    );
  }

  let fotoUrl: string | null = null;

  if (foto && foto.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = foto.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await foto.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    fotoUrl = `/uploads/${fileName}`;
  }

  const barang = await prisma.barang.create({
    data: {
      userId: (session.user as any).id,
      namaBarang,
      fotoUrl,
      hargaModal: parseInt(hargaModal),
      hargaJual: parseInt(hargaJual),
    },
  });

  return NextResponse.json(barang, { status: 201 });
}