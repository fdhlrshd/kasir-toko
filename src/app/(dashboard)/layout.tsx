import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
