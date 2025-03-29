/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['thuanbui.me'],
    domains: ['5j0ahd1rzh.ufs.sh'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "other-domain.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

module.exports = nextConfig;
