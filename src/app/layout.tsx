import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import InteractiveProvider from "@/components/InteractiveProvider";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: 'KDP Press | Publish Your Story Globally',
  description: 'The ultimate platform for authors to publish, market, and sell their books. High-quality publishing services and a curated bookstore.',
  keywords: 'book publishing, self-publishing, ebook, bookstore, author services, KDP Press',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          <InteractiveProvider>
            {children}
            <CartDrawer />
          </InteractiveProvider>
        </CartProvider>
        
        {/* Global jQuery and form handler */}
        <Script
          strategy="beforeInteractive"
          src="https://code.jquery.com/jquery-3.6.0.min.js"
        />
        <Script strategy="afterInteractive" src="/assets/js/custom.new.js" />
      </body>
    </html>
  );
}
