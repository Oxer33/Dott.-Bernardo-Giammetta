/** @type {import('next').NextConfig} */
const nextConfig = {
  // =============================================================================
  // CONFIGURAZIONE NEXT.JS PER DOTT. BERNARDO GIAMMETTA
  // Ottimizzata per performance e SEO
  // =============================================================================

  // Espone variabili d'ambiente server-side (CRITICO per AWS Amplify)
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    // AWS Cognito - DUE POOL SEPARATI per sicurezza
    // Pool ADMIN/STAFF - accesso completo al database
    COGNITO_ADMIN_CLIENT_ID: process.env.COGNITO_ADMIN_CLIENT_ID,
    COGNITO_ADMIN_CLIENT_SECRET: process.env.COGNITO_ADMIN_CLIENT_SECRET,
    COGNITO_ADMIN_USER_POOL_ID: process.env.COGNITO_ADMIN_USER_POOL_ID,
    COGNITO_ADMIN_ISSUER: process.env.COGNITO_ADMIN_ISSUER,
    // Pool PAZIENTI - regole prenotazione limitate
    COGNITO_PATIENTS_CLIENT_ID: process.env.COGNITO_PATIENTS_CLIENT_ID,
    COGNITO_PATIENTS_CLIENT_SECRET: process.env.COGNITO_PATIENTS_CLIENT_SECRET,
    COGNITO_PATIENTS_USER_POOL_ID: process.env.COGNITO_PATIENTS_USER_POOL_ID,
    COGNITO_PATIENTS_ISSUER: process.env.COGNITO_PATIENTS_ISSUER,
  },

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

  // Headers di sicurezza COMPLETI
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // DNS prefetch per performance
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Previene MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Previene clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // XSS protection (legacy browser)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // HSTS - forza HTTPS (1 anno)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Permissions policy - disabilita feature non usate
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Content Security Policy
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://openrouter.ai https://www.google-analytics.com https://accounts.google.com; frame-ancestors 'self';"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
