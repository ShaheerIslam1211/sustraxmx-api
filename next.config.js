/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/form?name=fuel",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
