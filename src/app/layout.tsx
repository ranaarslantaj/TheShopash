import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Shop Ash | Premium Luxury Watches",
  description: "A curated house of the world's finest timepieces — Rolex, Rado, Patek Philippe, Omega, Cartier and more. For men and women who value the art of time.",
  openGraph: {
    title: "Shop Ash | The Art of Timeless Elegance",
    description: "Curated luxury watches by the world's most revered Maisons.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
