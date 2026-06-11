// Inserts a first published article so the journal isn't empty. Idempotent:
// it skips if the slug already exists.
exports.seed = async function (knex) {
  const slug = "bienvenue-sur-le-journal-de-barsac";
  const exists = await knex("posts").where({ slug }).first();
  if (exists) return;

  const now = new Date().toISOString();
  const body = [
    "Bienvenue sur le **journal de Barsac** !",
    "",
    "Ce nouvel espace nous permet de partager avec vous les nouvelles du village :",
    "les comptes rendus du conseil municipal, les dates des fêtes et marchés, la vie",
    "des associations et, de temps en temps, une histoire de notre coin de Drôme.",
    "",
    "## Ce que vous y trouverez",
    "",
    "- Les **informations pratiques** de la mairie",
    "- L'**agenda** des événements à venir",
    "- Des nouvelles de la **vie associative** et du **terroir**",
    "",
    "Bonne lecture, et à très vite sur la place du village.",
  ].join("\n");

  await knex("posts").insert({
    title: "Bienvenue sur le journal de Barsac",
    slug,
    excerpt:
      "Un nouvel espace pour suivre les nouvelles du village : conseil municipal, événements, vie associative et histoires de notre coin de Drôme.",
    body,
    cover_image: "/assets/img/sm/NK1911_DJI_0098bd.jpg",
    status: "published",
    published_at: now,
    created_at: now,
    updated_at: now,
  });
};
