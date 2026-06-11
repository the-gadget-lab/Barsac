// Posts table. Only dialect-agnostic column types are used so this migration
// runs identically on SQLite, PostgreSQL and MySQL.
exports.up = async function (knex) {
  await knex.schema.createTable("posts", (t) => {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.string("slug").notNullable().unique();
    t.string("excerpt", 500);
    t.text("body").notNullable();
    t.string("cover_image");
    t.string("status").notNullable().defaultTo("draft"); // 'draft' | 'published'
    t.timestamp("published_at");
    t.timestamps(true, true); // created_at / updated_at with defaults
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("posts");
};
