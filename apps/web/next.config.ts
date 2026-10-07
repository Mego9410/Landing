import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The embedded Postgres for local work loads its own WebAssembly files, so it stays out of the bundle.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Workspace packages: the design system ships plain CSS; motion and content ship TypeScript source.
  transpilePackages: ["@landing/content", "@landing/design-system", "@landing/motion"],
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // The pre-launch prototype (see prelaunch.json) stays out of search results.
      { source: "/prototype/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async rewrites() {
    // Serve the pre-launch prototype, published to public/prototype/ by scripts/copy-prototype.mjs.
    return [{ source: "/prototype", destination: "/prototype/index.html" }];
  },
};

export default nextConfig;
