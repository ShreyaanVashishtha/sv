import { withBotId } from 'botid/next/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com", "assets.sv7.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/CV-Shreyaan-Vashishtha.pdf',
        destination: 'https://www.linkedin.com/in/shreyaanv/',
        permanent: false,
      },
      {
        source: '/cv',
        destination: 'https://www.linkedin.com/in/shreyaanv/',
        permanent: false,
      },
      {
        source: '/resume',
        destination: 'https://www.linkedin.com/in/shreyaanv/',
        permanent: false,
      },
    ];
  },
};

export default withBotId(nextConfig);
