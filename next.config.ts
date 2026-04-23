import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============ Turbopack সাপোর্ট (সুপারসনিক স্পিড) ============
  turbopack: {
    resolveAlias: {
      '@tanstack/react-virtual': 'react',
      'react-virtuoso': 'react',
    },
  },
  
  // ============ ইমেজ অপটিমাইজেশন ============
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // ============ বেসিক কনফিগ ============
  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: false,
  
  // ============ ডেভেলপমেন্ট সেটিংস ============
  allowedDevOrigins: [
    'localhost', 
    '10.59.153.225', 
    '10.43.113.225', 
    '192.168.0.104',
    '192.168.0.103'
  ],
  
  // ============ প্রোডাকশন আউটপুট ============
  output: 'standalone',
  
  // ============ টাইপস্ক্রিপ্ট সেটিংস ============
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ============ HTTP হেডার সেটিংস ============
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  
  // ============ এক্সপেরিমেন্টাল ফিচার ============
  experimental: {
    scrollRestoration: true,
  },
  
  // ============ ক্যাশ কম্পোনেন্টস ============
  cacheComponents: true,
  
  // ============ লগিং সেটিংস ============
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  
  // ============ স্থির অ্যাসেট সেটিংস ============
  distDir: '.next',
  generateEtags: true,
  
  // ============ অন-ডিমান্ড রিডিং ============
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;