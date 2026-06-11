// Resolves the public origin used to build absolute URLs (canonical, Open
// Graph, sitemap). SITE_URL pins it in production; otherwise we trust the
// request (trust proxy is enabled so ngrok/reverse proxies report https).
function baseUrl(req) {
  const env = process.env.SITE_URL;
  if (env) return env.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

module.exports = { baseUrl };
