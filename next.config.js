/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/get-started',
        destination: '/scan',
<<<<<<< HEAD
        permanent: false,
=======
        permanent: true,
>>>>>>> efb8c80 (feat: add redirects and verify Revenue Lead requirements)
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
