/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost','www.google.com'], // Add domains for external images if needed
  },
  reactStrictMode: true,
};

module.exports = nextConfig;