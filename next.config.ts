import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ডেভেলপমেন্টে নেটওয়ার্ক থেকে access করার অনুমতি
  allowedDevOrigins: ['10.59.153.225', 'localhost', '127.0.0.1'],
  
  // ইমেজ অপটিমাইজেশন সেটিংস
  images: {
    domains: [], // বর্তমানে খালি, কারণ আমরা লোকাল ইমেজ/ইমোজি ব্যবহার করছি
    unoptimized: true, // সুপার ফাস্টের জন্য ইমেজ অপটিমাইজেশন বন্ধ
  },

  // কম্পাইলার অপশন
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // প্রোডাকশনে console.log বাদ
  },

  // গজিপ কম্প্রেশন
  compress: true,
};

export default nextConfig;