// Configuration for Cloudflare Pages builds
module.exports = {
  build: {
    command: "npm run build",
    environment: {
      NODE_VERSION: "18",
      NEXT_PUBLIC_BACKGROUND_TYPE: "wave",
      NEXT_PUBLIC_SITE_URL: "https://docs.phantasy.bot"
    }
  }
}; 