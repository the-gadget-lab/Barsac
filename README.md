# Site de la commune de Barsac

Site public 100 % statique de Barsac (Drôme) : HTML, CSS et JavaScript natif. Il ne nécessite ni serveur applicatif, ni base de données, ni variable d’environnement.

## Aperçu local

Depuis la racine du dépôt :

```sh
python -m http.server 8080
```

Ouvrir ensuite <http://localhost:8080>.

## Contact et démarches

Tous les liens de démarche pointent vers `#contact` avec un attribut `data-contact-topic`. Le script sélectionne le motif correspondant et le formulaire prépare un lien `mailto:` vers `mairie.barsac@orange.fr`. Rien n’est envoyé ni conservé par le site lui-même.

Pour ajouter un motif :

1. ajouter une option dans `#contact-topic` dans `index.html` ;
2. ajouter, si besoin, un lien portant `data-contact-topic="valeur-de-option"` ;
3. exécuter les contrôles.

Un motif peut aussi être présélectionné avec `index.html?demande=urbanisme#contact`.

## Informations dynamiques

Agenda et journal utilisent les widgets IntraMuros de la commune `10970` et de l’intercommunalité `914`. Les actes administratifs utilisent la collectivité `11891`. La configuration se trouve au début de `assets/js/main.js`.

## Vérification éditoriale

Dernière revue complète : 4 septembre 2026. Toute modification d’un horaire, d’une coordonnée, d’un chiffre ou d’un texte touristique doit être recoupée avec une source officielle ou institutionnelle.

Références de maintenance :

- mairie et horaires : [Annuaire de l’administration](https://lannuaire.service-public.gouv.fr/auvergne-rhone-alpes/drome/94a212de-d39a-43b3-8b7b-9fc8c8fcbffe) et [BANATIC](https://www.banatic.interieur.gouv.fr/commune/26027-Barsac) ;
- population et rattachements administratifs : [Insee, commune 26027](https://www.insee.fr/fr/statistiques/1405599?geo=COM-26027) ;
- village et vignoble : [Office de tourisme du Pays Diois](https://www.diois-tourisme.com/pays-diois/communes/barsac/) ;
- appellation Clairette de Die : [INAO](https://www.inao.gouv.fr/node/31884/printable/pdf) ;
- photographies : Noak Carrau.

## Médias et typographies

Les images d’affichage sont en WebP dans `assets/img/lg` et `assets/img/sm`. Le JPEG de couverture est conservé pour le partage sur les réseaux sociaux. Fraunces et Spectral sont auto-hébergées dans `assets/fonts`, avec leurs licences OFL.

## Contrôles

```sh
python tools/check_site.py
```

Le même contrôle est lancé par GitHub Actions. Il vérifie les fichiers référencés, les identifiants IntraMuros, l’adresse de contact, l’absence de dépendance Google Fonts et l’absence d’anciens éléments serveur.

## Publication

Un exemple de configuration Caddy avec HTTPS, en-têtes de sécurité, cache et page 404 se trouve dans `deploy/Caddyfile`.

Avant la mise en ligne, il reste impératif de :

- renseigner l’identité exacte de l’hébergeur dans `mentions-legales.html` et `confidentialite.html` ;
- configurer les DNS de `barsac-drome.fr` ;
- réaliser un audit RGAA, publier le schéma pluriannuel et le plan d’action annuel, puis mettre à jour `accessibilite.html`.
