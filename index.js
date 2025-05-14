// Minimal worker for static site hosting
export default {
  async fetch() {
    // The static site is handled automatically by Cloudflare Pages
    return new Response("This is a static site.", { status: 200 });
  }
}; 