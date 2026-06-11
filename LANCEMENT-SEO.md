# Runbook SEO — prendre la première place

État au 11 juin 2026. Le site est techniquement prêt (voir « Déjà en place »).
Ce document liste, dans l'ordre, les actions qui le font passer en tête des
résultats, et comment vérifier chaque étape.

## Constat : la place est libre

Recherche « barsac drôme village » (juin 2026) — la première page n'est
occupée que par des annuaires et des tiers : communes.com, annuaire-mairie.fr,
Wikipédia, diois-tourisme.com, villorama, villesavivre, un blog personnel.
**Aucun site officiel de la commune n'existe dans les résultats.** Google
privilégie systématiquement la source officielle pour les requêtes de type
« mairie / commune » dès qu'elle existe : la place de n°1 est à prendre, pas
à conquérir.

Requêtes cibles (par ordre de gain) :
1. `mairie barsac` / `mairie barsac drôme` — intention navigationnelle, gain immédiat
2. `barsac drôme` / `barsac diois` / `barsac 26150`
3. `que faire à barsac` / `barsac clairette de die`
4. `berceau de la clairette de die` / `village clairette de die`
5. `barsac` (requête nue) — long terme ; le Barsac girondin (Sauternes) a
   l'antériorité, mais la géolocalisation des chercheurs drômois et les
   requêtes désambiguïsées font l'essentiel du trafic réel.

## Lancement (dans l'ordre)

1. **Domaine pérenne** — ex. `barsac-drome.fr` ou `mairie-barsac.fr`
   (un `.fr` est un signal France). Puis dans `.env` :
   `SITE_URL=https://www.barsac-drome.fr` et redémarrer. Canonicals,
   Open Graph, JSON-LD et sitemap suivent automatiquement.
2. **Google Search Console** (search.google.com/search-console) — valider le
   domaine, soumettre `https://…/sitemap.xml`, demander l'indexation de `/`.
   Faire de même sur Bing Webmaster Tools (import en un clic depuis GSC).
3. **Fiche Google Business Profile « Mairie de Barsac »** — catégorie
   « Hôtel de ville », adresse 6 Route du Village 26150, tél. 04 75 21 71 58,
   horaires jeudi 9 h–12 h, site web = le domaine. C'est ce qui occupe le
   panneau de droite et la carte — la position 0 locale.
4. **Backlinks fondateurs** (deux courriels suffisent) :
   - Diois Tourisme (diois-tourisme.com/pays-diois/communes/barsac/) — leur
     page Barsac existe déjà ; demander l'ajout du lien « site officiel ».
   - Communauté de communes du Diois (paysdiois.fr) — annuaire des communes.
   Bonus : Wikipédia « Barsac (Drôme) », champ « site officiel » de l'infobox
   (modification libre, factuelle, acceptée).
5. **Annuaire service-public.fr** — la mairie peut déclarer son site officiel
   via son compte Service-Public ; ce lien institutionnel est le plus fort
   signal « source officielle » qui existe.

## Vérification (après 2–4 semaines)

- GSC → Couverture : `/`, `/blog` et les articles indexés, zéro erreur.
- GSC → Performance : suivre les requêtes cibles ci-dessus.
- Recherche en navigation privée : `mairie barsac` doit sortir le site en
  premier ; `barsac drôme` en première page puis en tête.
- Test des résultats enrichis (search.google.com/test/rich-results) : la
  page d'accueil doit faire ressortir FAQPage et GovernmentOffice.

## Déjà en place (vérifié)

- Title/description désambiguïsés « Barsac (Drôme) », Diois, Clairette de Die
- Canonical, Open Graph, Twitter card, geo tags (FR-26, 44.731;5.289)
- JSON-LD : City (sameAs Wikipédia/BANATIC/Diois-Tourisme), TouristDestination,
  GovernmentOffice (coordonnées mairie vérifiées), WebSite, FAQPage (5 questions)
- BlogPosting sur chaque article ; sitemap.xml dynamique ; robots.txt
- gzip, Cache-Control (7 j images, 1 h CSS/JS), favicon, 301 /index.html → /
- noindex : /admin (X-Robots-Tag), 404, erreurs ; article de test dépublié
- Contenu unique et vérifié (sources : BANATIC, Diois Tourisme, annuaire-mairie)
