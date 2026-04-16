import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg' : {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: { svgo: false }
          }
        ],
        as: '*.js',
      }
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { svgo: false }
        }
      ],
    })

    return config
  },
};

export default nextConfig;
