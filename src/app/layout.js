import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "FreshCart - Your One-Stop Shop for Fresh Products",
  description: "Shop the best products at competitive prices. Electronics, Fashion, Groceries & more. Free shipping on orders over 500 EGP.",
  icons: {
    icon: "/cart-favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: { borderRadius: "12px", background: "#1e293b", color: "#fff", fontSize: "0.88rem", fontWeight: 500 }
              }} />
              <Navbar />
              <main style={{ minHeight: "calc(100vh - 200px)" }}>
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
