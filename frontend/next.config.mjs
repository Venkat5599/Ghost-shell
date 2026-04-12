/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable type checking during builds
    ignoreBuildErrors: false,
  },
}

export default nextConfig
