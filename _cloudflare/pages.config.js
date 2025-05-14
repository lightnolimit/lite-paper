// Configuration for Cloudflare Pages builds
module.exports = {
  build: {
    command: "pnpm run build",
    output_directory: "out",
    environment: {
      NEXT_PUBLIC_BACKGROUND_TYPE: "wave",
      NEXT_PUBLIC_SITE_URL: "https://docs.phantasy.bot"
    }
      }
}; 