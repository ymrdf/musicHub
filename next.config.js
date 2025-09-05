/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "api.dicebear.com"],
  },
  // 支持音频文件上传
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|wav|midi|pdf)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/files/",
          outputPath: "static/files/",
        },
      },
    });

    // 忽略不需要的 Sequelize 数据库方言
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pg-hstore": false,
      pg: false,
      sqlite3: false,
      tedious: false,
      mariadb: false,
    };

    return config;
  },
  // API 路由配置
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
