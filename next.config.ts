import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the heavy export libraries out of the bundler so they load reliably
  // from node_modules at runtime in the Node serverless functions on Vercel.
  serverExternalPackages: ["@react-pdf/renderer", "pptxgenjs"],
};

export default nextConfig;
