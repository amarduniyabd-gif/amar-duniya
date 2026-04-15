"use client";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";

export default function ClientLayout() {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith('/chat');
  
  if (isChatPage) return null;
  
  return <BottomNav />;
}