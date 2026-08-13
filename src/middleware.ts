import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/barang/:path*", "/penjualan/:path*", "/riwayat/:path*"],
};