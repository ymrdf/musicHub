/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "api.dicebear.com"],
  },
  // 实验性功能配置
  experimental: {
    // 启用服务器组件缓存优化
    serverComponentsExternalPackages: ["sequelize", "mysql2"],
  },
  // 缓存配置
  generateBuildId: async () => {
    // 使用时间戳作为构建ID，确保每次部署都有新的构建ID
    return `build-${Date.now()}`;
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
