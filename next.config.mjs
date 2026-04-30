/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Build a self-contained server bundle. The output goes to `.next/standalone/` and includes
   * only the deps actually needed at runtime (typically ~60 MB vs ~870 MB of full
   * node_modules). Used by the Dockerfile to produce a small Cloud Run image with fast cold
   * starts. See https://nextjs.org/docs/app/api-reference/config/next-config-js/output.
   */
  output: 'standalone',

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    /** Inlines imported CSS into HTML in production (App Router), shortening the critical path vs a linked .css chunk. */
    inlineCss: true,
  },

  /*
   * Image optimization on a non-Vercel host (Cloud Run).
   *
   * `loader: 'custom'` + `loaderFile: ./lib/image-loader.mjs` routes srcset generation to
   * Sanity's image CDN. The browser still receives a proper srcset (mobile gets a 750 px
   * hero variant, desktop 1920 px, etc.), but every image variant is served by Sanity's
   * edge — no CPU spent on the Cloud Run container, no `sharp` dep needed.
   *
   * `deviceSizes` / `imageSizes` still control which widths Next requests via the loader.
   * `formats` is irrelevant when using a custom loader (Sanity handles AVIF/WebP via
   *   its `auto=format` query param), but kept for clarity.
   */
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.mjs',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable compression
  compress: true,
  
  // Static generation optimization
  generateEtags: false,
  
  // Headers for performance and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
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
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
