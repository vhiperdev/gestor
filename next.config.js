/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
  config.resolve.fallback = { fs: false };
  return config;
},
env:{
  API_KEY : process.env.API_KEY,
  AUTH0_KEY_MANAGEMET : process.env.AUTH0_KEY_MANAGEMET,
  AUTH0_ISSUER_BASE_URL : process.env.AUTH0_ISSUER_BASE_URL
},eslint: {
  ignoreDuringBuilds: true,
}
};

module.exports = nextConfig;
