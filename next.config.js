/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Kompression aktivieren
  compress: true,
  
  // Performance-Optimierungen
  swcMinify: true,
  
  // Trailing Slash für bessere SEO
  trailingSlash: false,
  
  // Strikte Modus für bessere Entwicklung
  reactStrictMode: true,
  
  // Powered by Header entfernen (Sicherheit)
  poweredByHeader: false,
  
  // Headers für SEO und Sicherheit
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
      // Cache-Control für statische Assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects für SEO
  async redirects() {
    return [
      // Alte URLs umleiten (Beispiele)
      {
        source: '/music',
        destination: '/marketplace',
        permanent: true,
      },
      {
        source: '/composers',
        destination: '/directors',
        permanent: true,
      },
      {
        source: '/artists',
        destination: '/for-artists',
        permanent: true,
      },
    ];
  },
  
  // Experimental Features für bessere Performance
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig

