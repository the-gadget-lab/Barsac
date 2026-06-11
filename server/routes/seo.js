// robots.txt and sitemap.xml, generated against the live post list.
const express = require("express");
const Post = require("../models/Post");
const { baseUrl } = require("../services/site");

const router = express.Router();

router.get("/robots.txt", (req, res) => {
  const base = baseUrl(req);
  res
    .type("text/plain")
    .send(["User-agent: *", "Disallow: /admin", "", `Sitemap: ${base}/sitemap.xml`].join("\n"));
});

router.get("/sitemap.xml", async (req, res, next) => {
  try {
    const base = baseUrl(req);
    const posts = await Post.listPublished();
    const urls = [
      { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
      { loc: `${base}/blog`, changefreq: "weekly", priority: "0.8" },
      ...posts.map((p) => ({
        loc: `${base}/blog/${p.slug}`,
        lastmod: String(p.updated_at || p.published_at || "").slice(0, 10),
        priority: "0.6",
      })),
    ];
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "";
          const freq = u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "";
          return `  <url><loc>${u.loc}</loc>${lastmod}${freq}<priority>${u.priority}</priority></url>`;
        })
        .join("\n") +
      "\n</urlset>\n";
    res.type("application/xml").send(xml);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
