const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");
const seoRoutes = require("./routes/seo");
const { baseUrl } = require("./services/site");

const ROOT = path.join(__dirname, "..");

function createApp() {
  const app = express();
  app.set("trust proxy", true);

  // Views
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  // Parsers
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Session (MemoryStore for now — fine for a single small instance)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "barsac-dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 },
    })
  );

  // A French date helper available in every template.
  app.locals.formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  // Homepage: the static front page, with %BASE% substituted so canonical,
  // Open Graph and JSON-LD URLs stay absolute whatever the public origin is.
  const homePath = path.join(ROOT, "barsac", "index.html");
  app.get("/", (req, res) => {
    const html = fs.readFileSync(homePath, "utf8").replaceAll("%BASE%", baseUrl(req));
    res.type("html").send(html);
  });
  app.get("/index.html", (req, res) => res.redirect(301, "/"));

  // Static assets — uploaded covers, then the existing front site at root
  // (which also serves the self-hosted editor bundle under assets/vendor).
  app.use("/uploads", express.static(path.join(ROOT, "data", "uploads")));
  app.use(express.static(path.join(ROOT, "barsac")));

  // Routes
  app.use(seoRoutes);
  app.use("/blog", blogRoutes);
  app.use(
    "/admin",
    (req, res, next) => {
      res.set("X-Robots-Tag", "noindex, nofollow");
      next();
    },
    adminRoutes
  );

  // 404
  app.use((req, res) => {
    res.status(404).render("404", { title: "Page introuvable · Barsac" });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    const message =
      err && err.message && /image|Format/.test(err.message)
        ? err.message
        : "Une erreur est survenue.";
    res.status(500).render("error", { title: "Erreur · Barsac", message });
  });

  return app;
}

module.exports = { createApp };
