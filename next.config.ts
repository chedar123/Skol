import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NODE_ENV === "production" ? "build" : ".next",
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "web-assets.same.dev",
      "assets.nolimitcity.com",
      "client.firstlookgames.com",
      "demo.firstlookgames.com",
      "lh3.googleusercontent.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "web-assets.same.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.nolimitcity.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "client.firstlookgames.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "demo.firstlookgames.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
