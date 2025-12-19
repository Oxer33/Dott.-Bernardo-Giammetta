/** @type {import('next').NextConfig} */
const nextConfig = {
  // =============================================================================
  // CONFIGURAZIONE NEXT.JS PER DOTT. BERNARDO GIAMMETTA
  // Ottimizzata per performance e SEO
  // =============================================================================

  // Immagini: permettiamo domini esterni per Unsplash/Pexels
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Per foto profilo Google
      },
    ],
    // Formati moderni per performance ottimali
    formats: ['image/avif', 'image/webp'],
  },

  // Ottimizzazioni performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },

  // Headers di sicurezza
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
