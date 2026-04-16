import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // মোবাইল থেকে ডেভ সার্ভার access করার অনুমতি
  allowedDevOrigins: ['10.43.113.225', 'localhost', '127.0.0.1', '10.59.153.225'],
  
  images: {
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  compress: true,
};

export default nextConfig;