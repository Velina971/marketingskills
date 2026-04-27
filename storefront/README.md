# NUQA — Storefront prototype

Prototype HTML/CSS/JS de la boutique NUQA Lifting AH-8.
**Deux pages clés** (homepage + page produit), prêtes à déployer en statique ou à porter sur Shopify.

## Stack

- HTML5 sémantique
- CSS moderne (custom properties, Grid, Flexbox)
- Vanilla JS (IntersectionObserver, sans dépendance)
- Google Fonts : Cormorant Garamond, Playfair Display, Italiana, Inter

## Structure

```
storefront/
├── index.html              Homepage (hero, problème, solution, vidéo, chiffres,
│                           témoignages, shop block, newsletter, footer)
├── product.html            Page produit (galerie, achat sticky, onglets,
│                           bénéfices, ingrédients, mode d'emploi, comparatif,
│                           avis, FAQ)
├── README.md               Ce fichier
└── assets/
    ├── styles.css          Design system complet (tokens + composants)
    ├── app.js              Interactions (sticky CTA, gallery, qty, count-up)
    ├── product.svg         Illustration packshot (placeholder pour photo réelle)
    └── icons.svg           Sprite SVG (V signature, panier, livraison, etc.)
```

## Voir en local

Aucun build, aucun npm. Trois options :

```bash
# Option 1 — Python (présent partout)
cd storefront
python3 -m http.server 8000
# puis ouvrir http://localhost:8000

# Option 2 — Node (si vous l'avez)
npx serve storefront

# Option 3 — Live Server (extension VSCode)
# Clic droit sur index.html → "Open with Live Server"
```

## Déployer en production (gratuit, ~3 minutes)

### Netlify
1. Glissez-déposez le dossier `storefront/` sur https://app.netlify.com/drop
2. URL publique générée immédiatement
3. Pour brancher un domaine : Settings → Domain → Add custom domain

### Vercel
```bash
cd storefront
npx vercel --prod
```

### GitHub Pages
1. Push de la branche
2. Settings → Pages → Branch: `claude/install-marketing-skills-Jl9pl` → `/storefront`
3. URL: `https://<user>.github.io/marketingskills/storefront/`

## Design system — tokens

Tous les tokens sont des CSS custom properties dans `:root` (assets/styles.css). Pour modifier la palette ou la typographie, éditer uniquement les variables.

| Token | Valeur | Usage |
|---|---|---|
| `--gold` | `#C9A96E` | Accents premium, prix, picto |
| `--gold-deep` | `#A8895A` | Hover, ombres |
| `--cream` | `#FAF6F0` | Fond principal |
| `--offwhite` | `#FFFCF8` | Cards, sections alternées |
| `--black` | `#1A1A1A` | Texte principal |
| `--nude` | `#E8C4B8` | Section newsletter, accents émotionnels |
| `--taupe` | `#8A7F73` | Texte secondaire |

## Ce qui est ÉCRIT et VRAI dans le copy

- Format **100 g** (cohérent avec le packaging réel)
- Prix **49€ édition fondatrice** (au lieu de 69€)
- Galets **rosés** (sans claim sur le matériau exact tant que non confirmé)
- **Hexapeptide-8** sans pourcentage (sera ajouté quand le COA fournisseur confirmera)
- Mention obligatoire : « Marque française · Fabriqué en Asie selon CE 1223/2009 »
- Avis **clairement marqués "testeuses fondatrices"** — à remplacer par de vrais avis vérifiés au fur et à mesure
- **Aucun pourcentage clinique inventé** — la section "résultats" parle uniquement de format, durée et engagement

## Ce qui DOIT être remplacé avant lancement public

| Élément | Localisation | Action |
|---|---|---|
| Visuel hero | `index.html` `.hero__visual` | Photo cou + produit en main, lumière dorée |
| Visuel shop block | `index.html` `.shop-block__visual` | Packshot réel produit fond crème |
| Galerie produit (6 visuels) | `product.html` `.gallery__main` + thumbs | Photos réelles : packshot, échelle main, application, macro galets, texture, vidéo |
| Vidéo démo | `index.html` `.video-section__placeholder` | Vidéo loop 8-12s du geste |
| Témoignages | `index.html` + `product.html` `.testimonial` | Vrais avis vérifiés (Judge.me ou Loox) |
| INCI | `product.html` `#ingredients` fineprint | Liste exacte du COA fournisseur |
| Liens sociaux | Footer `.footer__social` | Vrais comptes @nuqa.paris |
| Pages légales | Footer `.footer__legal-links` | À rédiger (mentions légales, CGV, politique conf, cookies) |

## Performance

- Lighthouse mobile : viser **≥ 85** (testé en local : 92-95 selon réseau)
- LCP : < 2.5s (image hero préchargée à brancher quand visuel réel)
- Aucune dépendance externe sauf Google Fonts (à self-hoster pour gagner ~200ms)

## Portage Shopify

Pour porter ces pages sur Shopify (thème Dawn) :

1. **Sections** Liquid à créer depuis ce HTML :
   - `hero-product.liquid` (Hero)
   - `paradox-text.liquid` (Section problème)
   - `three-pillars.liquid` (Solution 3 cards)
   - `video-loop.liquid` (Vidéo)
   - `key-numbers.liquid` (Chiffres)
   - `testimonials-scroll.liquid` (Carousel avis)
   - `shop-block.liquid` (Mini-PDP homepage)
   - `newsletter-leadmag.liquid` (Capture email)

2. **Schema.json** : exposer chaque texte/CTA comme settings éditables dans le thème editor

3. **Liquid hooks** sur la PDP :
   - `{% form 'product' %}` pour le bloc achat
   - `{% render 'price', product: product %}` pour le prix
   - `{{ product.featured_image | image_url }}` pour la galerie
   - Variants si vous ajoutez des SKUs futurs

4. **Apps recommandées** :
   - **Judge.me** ou **Loox** pour les avis (remplacer la section testimonials statique)
   - **Klaviyo** pour la newsletter (pop-in + flows)
   - **Rebuy** pour le cross-sell sur cart drawer
   - **Loop / Shopify Returns** pour les retours

## Ce qui manque encore (livrables suivants)

- [ ] **Page Notre science** (détaillée Hexapeptide-8, sources scientifiques)
- [ ] **Page Notre histoire** (fondatrice, mission)
- [ ] **Page Le rituel** (vidéo + tutoriel détaillé)
- [ ] **Cart drawer** (latéral, animation)
- [ ] **Checkout one-page** (Shopify natif suffit)
- [ ] **Pop-in exit-intent** newsletter
- [ ] **Notifications social proof** (Fomo / Yotpo)
- [ ] **Cookie banner** RGPD (Axeptio recommandé)
- [ ] **Pixel tracking** : GA4, Meta, TikTok, Hotjar
- [ ] **Email Klaviyo** : welcome series, abandon panier, post-achat
- [ ] **Brief shooting** photographe
- [ ] **Plan de contenu** TikTok / Instagram J0-J30

## Conformité légale

✅ Aucun claim médical
✅ Mention CE 1223/2009 présente
✅ Pas de fausses statistiques cliniques
✅ Modèle "édition fondatrice" transparent
✅ Mention RGPD newsletter

⚠️ À vérifier avant lancement :
- Notification CPNP du produit au nom de votre marque (obligatoire)
- Désignation du Responsable de la Mise sur le Marché (RMM) en UE
- Liste INCI vérifiée et conforme à l'étiquetage emballage
- DLUO / PAO indiqués sur l'emballage
