/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // Prevents clickjacking attacks
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Prevents MIME type sniffing
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Controls referrer information
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Enables XSS protection in older browsers
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            // Controls browser features and APIs
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
          },
          {
            // Enforce HTTPS
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        // API routes - additional security
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
