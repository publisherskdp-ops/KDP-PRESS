const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/leads/:path*',
        destination: '/api/leads/:path*',
      },
    ];
  },
};

export default nextConfig;
