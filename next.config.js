/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  // Disable static page caching for development
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig

