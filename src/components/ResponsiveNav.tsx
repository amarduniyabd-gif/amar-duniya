"use client";
import { memo, useEffect, useState } from "react";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";

// মেমোইজড কম্পোনেন্ট
const MemoizedTopNavbar = memo(TopNavbar);
const MemoizedBottomNav = memo(BottomNav);

export default function ResponsiveNav() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // মোবাইল ডিটেক্ট
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // হাইড্রেশন এড়াতে
  if (!mounted) {
    return (
      <>
        <header className="h-14 bg-white border-b border-gray-100" />
        <div className="md:hidden h-16" />
      </>
    );
  }

  return (
    <>
      <MemoizedTopNavbar />
      <MemoizedBottomNav />
    </>
  );
}

// ============ ইউটিলিটি ============
export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    width: windowSize.width,
    height: windowSize.height,
  };
}