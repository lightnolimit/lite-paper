// Configuration for Cloudflare Pages builds
module.exports = {
  build: {
    command: "npm run build",
    environment: {
      NODE_VERSION: "18",
      NEXT_PUBLIC_BACKGROUND_TYPE: "wave",
      NEXT_PUBLIC_SITE_URL: "https://docs.phantasy.bot"
    },
    output_directory: "out",
    root_dir: "."
  },
  deployment: {
    // No custom deploy command needed for Pages UI deployments
    // Cloudflare Pages handles this automatically when output_directory is defined
  }
}; 