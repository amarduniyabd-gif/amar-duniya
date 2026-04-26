import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f85606',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://amarduniya.vercel.app'),
  title: {
    default: 'আমার দুনিয়া - বাংলাদেশের সেরা মার্কেটপ্লেস',
    template: '%s | আমার দুনিয়া'
  },
  description: 'বাংলাদেশের সর্ববৃহৎ অনলাইন মার্কেটপ্লেস - নতুন ও পুরাতন পণ্য কিনুন, বিক্রি করুন, নিলামে অংশ নিন। সম্পূর্ণ নিরাপদ ও বিশ্বস্ত।',
  keywords: ['মার্কেটপ্লেস', 'অনলাইন শপিং', 'পণ্য কেনাকাটা', 'বাংলাদেশ', 'নিলাম', 'পাত্র-পাত্রী', 'amar duniya', 'amarduniya'],
  authors: [{ name: 'আমার দুনিয়া', url: 'https://amarduniya.vercel.app' }],
  creator: 'আমার দুনিয়া',
  publisher: 'আমার দুনিয়া',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    title: 'আমার দুনিয়া - বাংলাদেশের সেরা মার্কেটপ্লেস',
    description: 'পণ্য কিনুন, বিক্রি করুন, নিলামে অংশ নিন। সম্পূর্ণ নিরাপদ ও বিশ্বস্ত।',
    url: 'https://amarduniya.vercel.app',
    siteName: 'আমার দুনিয়া',
    locale: 'bn_BD',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'আমার দুনিয়া',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আমার দুনিয়া',
    description: 'বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস',
    creator: '@amarduniya',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'ecommerce',
};

// লোডিং কম্পোনেন্ট
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full blur-xl opacity-40 animate-pulse" />
          <div className="relative w-full h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#f85606] border-t-transparent" />
          </div>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">আমার দুনিয়া লোড হচ্ছে...</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://nryqoyqdwxqdydifatzb.supabase.co" />
        <link rel="dns-prefetch" href="https://nryqoyqdwxqdydifatzb.supabase.co" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#f85606" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-300 antialiased">
        <ClientLayout>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ClientLayout>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}