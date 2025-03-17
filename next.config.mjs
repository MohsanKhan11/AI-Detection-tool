/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  distDir: '.next'
};

export default nextConfig;
