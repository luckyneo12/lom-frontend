import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Header/Header";
import Footer from "./Footer/Footer";

export const metadata: Metadata = {
  title: "Legend Of Marketing(LOM)",
  description: "Marketing That Moves. Legends That Inspire",
  generator: "Tech Branzzo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
    <div className="flex flex-col min-h-screen justify-between">
    <Navbar />
        {children}
        <Footer />
    </div>
      </body>
    </html>
  );
}
