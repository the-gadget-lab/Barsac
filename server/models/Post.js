// Post repository — the single place where post SQL lives. Every route goes
// through these methods, so switching database engine (or even swapping Knex
// for an ORM later) stays contained to this file.
const knex = require("../db/knex");
const slugify = require("slugify");

const TABLE = "posts";
const PUBLIC_COLUMNS = [
  "id", "title", "slug", "excerpt", "body",
  "cover_image", "status", "published_at", "created_at", "updated_at",
];

class Post {
  /** Published posts, newest first — for the public blog list. */
  static listPublished() {
    return knex(TABLE)
      .select(PUBLIC_COLUMNS)
      .where({ status: "published" })
      .orderBy("published_at", "desc");
  }

  /** Every post (drafts included), newest first — for the admin dashboard. */
  static listAll() {
    return knex(TABLE).select(PUBLIC_COLUMNS).orderBy("updated_at", "desc");
  }

  static findBySlug(slug) {
    return knex(TABLE).select(PUBLIC_COLUMNS).where({ slug }).first();
  }

  static findById(id) {
    return knex(TABLE).select(PUBLIC_COLUMNS).where({ id }).first();
  }

  /** Create a post. `status` controls publish; published_at is stamped on publish. */
  static async create({ title, excerpt, body, cover_image, status }) {
    const slug = await this.uniqueSlug(title);
    const now = new Date().toISOString();
    const row = {
      title,
      slug,
      excerpt: excerpt || null,
      body,
      cover_image: cover_image || null,
      status: status === "published" ? "published" : "draft",
      published_at: status === "published" ? now : null,
      created_at: now,
      updated_at: now,
    };
    const [id] = await knex(TABLE).insert(row);
    return this.findById(id);
  }

  static async update(id, { title, excerpt, body, cover_image, status }) {
    const current = await this.findById(id);
    if (!current) return null;

    const patch = {
      title,
      excerpt: excerpt || null,
      body,
      status: status === "published" ? "published" : "draft",
      updated_at: new Date().toISOString(),
    };

    // Re-derive the slug if the title changed (keeping it unique).
    if (title && title !== current.title) {
      patch.slug = await this.uniqueSlug(title, id);
    }
    // Only replace the cover when a new file was uploaded.
    if (cover_image !== undefined) patch.cover_image = cover_image || null;

    // Stamp published_at the first time a post goes live.
    if (patch.status === "published" && !current.published_at) {
      patch.published_at = new Date().toISOString();
    }

    await knex(TABLE).where({ id }).update(patch);
    return this.findById(id);
  }

  static destroy(id) {
    return knex(TABLE).where({ id }).del();
  }

  /** Build a URL-safe slug from the title, guaranteed unique (ignores `exceptId`). */
  static async uniqueSlug(title, exceptId = null) {
    const base = slugify(title || "article", { lower: true, strict: true, locale: "fr" }) || "article";
    let candidate = base;
    let n = 1;
    // Loop until no other row holds the candidate slug.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const q = knex(TABLE).where({ slug: candidate });
      if (exceptId) q.andWhereNot({ id: exceptId });
      const clash = await q.first();
      if (!clash) return candidate;
      n += 1;
      candidate = `${base}-${n}`;
    }
  }
}

module.exports = Post;
