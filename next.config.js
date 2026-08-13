/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/get-started',
        destination: '/scan',
        permanent: true,
      },
      {
        source: '/founding',
        destination: '/#founding',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
