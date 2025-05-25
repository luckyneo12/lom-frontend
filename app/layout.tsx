import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Header/Header";
import Footer from "./Footer/Footer";

export const metadata: Metadata = {
  title: {
    default: "Legend Of Marketing(LOM)",
    template: "%s | Legend Of Marketing"
  },
  description: "Marketing That Moves. Legends That Inspire",
  generator: "Tech Branzzo",
  applicationName: "Legend Of Marketing",
  authors: [{ name: "Legend Of Marketing" }],
  creator: "Tech Branzzo",
  publisher: "Legend Of Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofmarketing.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://legendofmarketing.com',
    siteName: 'Legend Of Marketing',
    title: 'Legend Of Marketing(LOM)',
    description: 'Marketing That Moves. Legends That Inspire',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Legend Of Marketing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legend Of Marketing(LOM)',
    description: 'Marketing That Moves. Legends That Inspire',
    creator: '@legendofmktg',
    site: '@legendofmktg',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
  category: 'marketing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
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
