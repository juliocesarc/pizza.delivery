import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        //destination: 'https://api.pizzarianapole.com.br/:path*'
        destination: 'http://localhost:3333/:path*'
      },
    ]
  }
}

/* images: {
  domains: ["res.cloudinary.com"]
} */

export default nextConfig;