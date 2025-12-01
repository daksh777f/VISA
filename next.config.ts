import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' *; style-src 'self' 'unsafe-inline' *; img-src * blob: data:; font-src *; connect-src *; frame-src *; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
