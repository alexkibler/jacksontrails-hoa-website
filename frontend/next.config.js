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
    ],
  },
}

module.exports = nextConfig
