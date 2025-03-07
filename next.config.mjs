/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["webapi.amap.com", "vdata.amap.com"],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  transpilePackages: ["@uiw/react-amap"],
  output: "export", // 静态导出模式
  basePath: "", // 默认空即可，除非需要子路径
};

export default nextConfig;
