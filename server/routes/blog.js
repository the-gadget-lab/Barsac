// Public journal: list of published posts and single-post pages.
const express = require("express");
const Post = require("../models/Post");
const { render } = require("../services/markdown");
const { baseUrl } = require("../services/site");

const router = express.Router();

/** Plain-text snippet for meta descriptions (markdown + tags stripped). */
function summarize(post) {
  if (post.excerpt) return post.excerpt;
  return post.body
    .replace(/[#*_>`\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.listPublished();
    const base = baseUrl(req);
    res.render("blog/index", {
      title: "Le Journal de Barsac (Drôme) · Nouvelles du village",
      posts,
      description:
        "Les nouvelles de Barsac, village du Diois en Drôme : conseil municipal, fêtes, vie associative et terroir de la Clairette de Die.",
      canonical: `${base}/blog`,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findBySlug(req.params.slug);
    if (!post || post.status !== "published") {
      return res.status(404).render("404", { title: "Article introuvable · Barsac" });
    }
    const base = baseUrl(req);
    const canonical = `${base}/blog/${post.slug}`;
    const ogImage = post.cover_image ? `${base}${post.cover_image}` : `${base}/assets/img/lg/NK1911_DJI_0098bd.jpg`;
    res.render("blog/show", {
      title: `${post.title} · Journal de Barsac (Drôme)`,
      post,
      bodyHtml: render(post.body),
      description: summarize(post),
      canonical,
      ogType: "article",
      ogImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: summarize(post),
        image: ogImage,
        url: canonical,
        inLanguage: "fr",
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: { "@type": "Organization", name: "Commune de Barsac (Drôme)" },
        publisher: { "@type": "Organization", name: "Commune de Barsac (Drôme)", url: `${base}/` },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
