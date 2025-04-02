/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for development
  output: 'standalone', // Enable standalone output mode for Docker optimization
};

module.exports = nextConfig;