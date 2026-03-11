/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 支持绝对路径导入
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;