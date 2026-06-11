// Public journal: list of published posts and single-post pages.
const express = require("express");
const Post = require("../models/Post");
const { render } = require("../services/markdown");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.listPublished();
    res.render("blog/index", { title: "Le Journal · Barsac", posts });
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
    res.render("blog/show", {
      title: `${post.title} · Journal de Barsac`,
      post,
      bodyHtml: render(post.body),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
