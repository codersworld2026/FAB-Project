import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer must stay external (native-ish deps / fontkit).
  // pptxgenjs must be BUNDLED: it ships an ESM build under the "import"
  // condition, which the external loader tries to require() as CommonJS and
  // crashes ("Cannot use import statement outside a module"). Bundling lets
  // the compiler handle its ESM correctly.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
