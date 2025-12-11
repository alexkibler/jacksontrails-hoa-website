/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'hoa-backend',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'hoa-backend-dev',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/api/files/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/pb/_/:path*',
        destination: 'http://hoa-backend:8090/_/:path*',
      },
      {
        source: '/pb/api/:path*',
        destination: 'http://hoa-backend:8090/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
