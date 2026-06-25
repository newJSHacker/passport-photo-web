import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "passport-photo.online",
        pathname: "/images/**",
      },
    ],
  },
  async rewrites() {
    const apiUrl = (process.env.API_URL ?? "http://localhost:8000").replace(
      /\/+$/,
      "",
    );
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
      {
        source: "/api/backend-health",
        destination: `${apiUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
