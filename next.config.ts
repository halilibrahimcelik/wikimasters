import { dirname } from "node:path";
import type { NextConfig } from "next";

const blobBaseUrl = process.env.BLOB_BASE_URL
  ? new URL(process.env.BLOB_BASE_URL)
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: blobBaseUrl
      ? [
          {
            protocol: blobBaseUrl.protocol.replace(":", "") as "http" | "https",
            hostname: blobBaseUrl.hostname,
            port: blobBaseUrl.port || undefined,
            pathname: "/**",
          },
        ]
      : [],
  },
  turbopack: {
    root: dirname(__filename),
  },
};

export default nextConfig;
