// Render Markdown to safe HTML. Authors are trusted (admin only), but output is
// still sanitized so a mistaken paste of a <script> can never run.
const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

marked.setOptions({ gfm: true, breaks: false });

const ALLOWED_TAGS = sanitizeHtml.defaults.allowedTags.concat([
  "img", "h1", "h2", "figure", "figcaption",
]);

const ALLOWED_ATTR = {
  ...sanitizeHtml.defaults.allowedAttributes,
  img: ["src", "alt", "title", "loading"],
  a: ["href", "name", "target", "rel"],
};

function render(markdownText = "") {
  const rawHtml = marked.parse(markdownText);
  return sanitizeHtml(rawHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    // Only allow http(s), mailto and site-relative image/link sources.
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}

module.exports = { render };
