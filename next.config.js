/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // Keep cheerio and undici out of webpack — they run fine in the Node runtime
    // used by Route Handlers, but webpack chokes on their private-class-field syntax.
    serverComponentsExternalPackages: ['cheerio', 'undici'],
  },
};

module.exports = nextConfig;
