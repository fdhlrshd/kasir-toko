import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// PUT — edit barang
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.barang.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
  }

  if (existing.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const formData = await req.formData();
  const namaBarang = formData.get("namaBarang") as string;
  const hargaModal = formData.get("hargaModal") as string;
  const hargaJual = formData.get("hargaJual") as string;
  const foto = formData.get("foto") as File | null;

  let fotoUrl = existing.fotoUrl;

  if (foto && foto.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = foto.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await foto.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    if (existing.fotoUrl) {
      const oldPath = path.join(process.cwd(), "public", existing.fotoUrl);
      await unlink(oldPath).catch(() => {});
    }

    fotoUrl = `/uploads/${fileName}`;
  }

  const updated = await prisma.barang.update({
    where: { id },
    data: {
      namaBarang,
      hargaModal: parseInt(hargaModal),
      hargaJual: parseInt(hargaJual),
      fotoUrl,
    },
  });

  return NextResponse.json(updated);
}

// DELETE — hapus barang
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.barang.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 });
  }

  if (existing.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  try {
    await prisma.barang.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Barang ini sudah pernah terjual, tidak bisa dihapus" },
        { status: 409 }
      );
    }
    throw error;
  }

  if (existing.fotoUrl) {
    const filePath = path.join(process.cwd(), "public", existing.fotoUrl);
    await unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ success: true });
}