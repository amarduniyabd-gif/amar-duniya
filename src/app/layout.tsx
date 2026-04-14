import type { Metadata } from "next";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "আমার দুনিয়া",
  description: "মার্কেটপ্লেস + লাইভ বিড + চ্যাট",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className="bg-gray-50">
        <TopNavbar />
        <main className="pb-20 md:pb-0 md:pt-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}