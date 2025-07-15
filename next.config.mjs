import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  // add your other Next.js config here
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false, // Enable PWA in development
  }
});

export default nextConfig;
