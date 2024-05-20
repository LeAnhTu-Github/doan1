/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "img.clerk.com",
      "images.clerk.dev",
      "other-domain.com",
      "utfs.io",
    ],
  },
};

module.exports = nextConfig;
