const TerserPlugin = require("terser-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', '127.0.0.1', "nochan-api.aornum.xyz"],
  },
  eslint: {
    ignoreDuringBuilds: {
      "exhaustive-deps": "off"
    }
  }


}

module.exports = nextConfig
