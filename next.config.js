/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All site imagery is local in /public/images. Re-add remotePatterns
  // only if an external host (e.g. Supabase Storage) feeds next/image.
};

module.exports = nextConfig;
