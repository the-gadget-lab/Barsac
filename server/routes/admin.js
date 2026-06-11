// Admin area: login, dashboard and post CRUD. Everything except the login
// routes is protected by requireAuth.
const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Post = require("../models/Post");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin";

// ── cover image uploads ────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "..", "..", "data", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
    const name = crypto.randomBytes(8).toString("hex");
    cb(null, `${name}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp|gif|avif)$/.test(file.mimetype);
    cb(ok ? null : new Error("Format d'image non supporté."), ok);
  },
});

// Remove a previously-uploaded cover from disk. Guards against path escapes by
// only ever unlinking files that resolve inside UPLOAD_DIR.
function removeCover(publicPath) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const abs = path.join(UPLOAD_DIR, path.basename(publicPath));
  if (path.dirname(abs) !== UPLOAD_DIR) return;
  fs.promises.unlink(abs).catch(() => {}); // ignore if already gone
}

// Constant-time credential check that never short-circuits on length.
function checkCredentials(user = "", pass = "") {
  const a = Buffer.from(String(user));
  const b = Buffer.from(ADMIN_USER);
  const c = Buffer.from(String(pass));
  const d = Buffer.from(ADMIN_PASS);
  const userOk = a.length === b.length && crypto.timingSafeEqual(a, b);
  const passOk = c.length === d.length && crypto.timingSafeEqual(c, d);
  return userOk && passOk;
}

// ── auth ───────────────────────────────────────────────────────────────
router.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/admin");
  res.render("admin/login", { title: "Connexion · Administration", error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!checkCredentials(username, password)) {
    return res.status(401).render("admin/login", {
      title: "Connexion · Administration",
      error: "Identifiants incorrects.",
    });
  }
  req.session.user = { name: ADMIN_USER };
  res.redirect("/admin");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

// ── everything below requires a session ──────────────────────────────────
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.listAll();
    res.render("admin/dashboard", { title: "Administration · Journal", posts });
  } catch (err) {
    next(err);
  }
});

// In-body image uploads from the rich-text editor. Returns the public URL the
// editor inserts into the Markdown. Same validation/storage as cover images.
router.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucune image reçue." });
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.get("/posts/new", (req, res) => {
  res.render("admin/form", { title: "Nouvel article", post: null, error: null });
});

router.get("/posts/:id/edit", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect("/admin");
    res.render("admin/form", { title: `Modifier · ${post.title}`, post, error: null });
  } catch (err) {
    next(err);
  }
});

router.post("/posts", upload.single("cover"), async (req, res, next) => {
  try {
    const { title, excerpt, body, status } = req.body;
    if (!title || !body) {
      return res.status(400).render("admin/form", {
        title: "Nouvel article",
        post: { title, excerpt, body, status },
        error: "Le titre et le contenu sont obligatoires.",
      });
    }
    const cover_image = req.file ? `/uploads/${req.file.filename}` : null;
    await Post.create({ title, excerpt, body, cover_image, status });
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id", upload.single("cover"), async (req, res, next) => {
  try {
    const { title, excerpt, body, status } = req.body;
    const data = { title, excerpt, body, status };
    let oldCover = null;
    if (req.file) {
      const current = await Post.findById(req.params.id);
      oldCover = current && current.cover_image;
      data.cover_image = `/uploads/${req.file.filename}`;
    }
    const updated = await Post.update(req.params.id, data);
    if (updated && req.file) removeCover(oldCover); // drop the replaced image
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:id/delete", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    await Post.destroy(req.params.id);
    if (post) removeCover(post.cover_image); // tidy up its uploaded image
    res.redirect("/admin");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
