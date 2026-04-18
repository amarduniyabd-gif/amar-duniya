import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://amarduniya.com'),
  title: {
    default: 'আমার দুনিয়া',
    template: '%s | আমার দুনিয়া'
  },
  description: 'বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস - পণ্য কিনুন ও বিক্রি করুন',
  keywords: ['মার্কেটপ্লেস', 'অনলাইন শপিং', 'পণ্য কেনাকাটা', 'বাংলাদেশ'],
  authors: [{ name: 'আমার দুনিয়া' }],
  robots: 'index, follow',
  openGraph: {
    title: 'আমার দুনিয়া',
    description: 'বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস',
    url: 'https://amarduniya.com',
    siteName: 'আমার দুনিয়া',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আমার দুনিয়া',
    description: 'বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস',
  },
};

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="bg-gray-50 transition-colors duration-300">
        <TopNavbar />
        <main className="pb-20 md:pb-0 md:pt-16">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}