/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/get-started',
        destination: '/scan',
        permanent: false,
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
