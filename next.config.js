/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "thuanbui.me",
      "img.clerk.com",
      "images.clerk.dev",
      "utfs.io",
      "5j0ahd1rzh.ufs.sh",
      'lh3.googleusercontent.com'// Add this line
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thuanbui.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      }
    ]
  },
};

module.exports = nextConfig;