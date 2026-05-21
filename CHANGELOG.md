# Changelog — Kelvantis Website Consistency Sprint (2026-04-19)

Vijf-blok sprint om site-brede inconsistenties te elimineren en de GEO-fundering af te maken. Eén commit per blok.

---

## Blok 1 — Audit (`35e6d9f`, gecombineerd met Blok 2)

**Nieuw bestand**: [AUDIT.md](AUDIT.md)

Snapshot van de staat vóór de sprint: pagina-overzicht met meta-tags en schema-types, inventarisatie van `hallo@kelvantis.com` voorkomens, bevestiging dat `+31600000000` en `/diensten/seo.html` niet voorkomen, navigatie-inconsistentie gemeld (AI Development vs AI Implementatie), ChatGPT-context categorisering, GEO-bestanden status.

---

## Blok 2 — Email consistentie (`35e6d9f`)

**Wijzigingen**: 36 voorkomens van `hallo@kelvantis.com` → `kelvantis.com@gmail.com`

**Bestanden** (19):
- `_components/footer.html` (centrale footer — raakt alle pagina's die hem inlinen)
- `index.html` (LocalBusiness schema + body)
- `404.html`, `bedankt/index.html`
- `over-ons/index.html`, `werkwijze/index.html`
- `contact/index.html` (4 voorkomens: schema, body, footer, JS fallback)
- `faq/index.html` (3: schema answer, body, footer)
- `limburg/index.html`, `belgie/index.html` (elk 2: LocalBusiness schema + body)
- `privacy/index.html` (4), `voorwaarden/index.html` (2)
- `lp/gratis-gesprek/index.html` (JS fallback)
- Alle 4 diensten-pagina's (footer)
- Alle 4 blog-pagina's + blog-index (footer)
- `llms.txt`

**Verificatie**: `grep "hallo@kelvantis.com"` levert 0 treffers in productiebestanden (2 in AUDIT.md als historische referentie).

**Nav-label behoud**: menu-item "AI Development" (display-naam) blijft staan hoewel URL `ai-implementatie.html` en schema "AI Implementatie" gebruiken. Zie open TODO's onderaan.

---

## Blok 3 — Kjell expertise-blok + blog tagline (`296ff77`)

**Gewijzigd**: `over-ons/index.html`

- Foto-placeholder `/images/kjell.jpg` (graceful hide via `onerror`)
- LinkedIn link (placeholder met TODO-comment)
- Bio uitgebreid met concrete tools: Webflow, WordPress, n8n, Make.com, Claude, GPT-4
- Tech-stack chips toegevoegd onder de paragrafen
- Person schema: `image`, `sameAs: [LinkedIn-placeholder]`, `knowsAbout` uitgebreid

**Blog tagline verificatie**: `grep` op `Websites, SEO` / `SEO & AI Automatisering` levert 0 treffers — al opgeschoond in eerdere sprint. Geen wijziging.

**Over-ons vier-pijler sectie**: de diensten-panel toont al correct Webdesign, GEO & AEO, Workflow automatisering, AI-implementatie. Geen "SEO-strategie" meer aanwezig.

---

## Blok 4 — `website-laten-maken.html` versterken (`43c7182`)

**Meta + H1**:
- Title (57 chars): `Website laten maken in Limburg | Maatwerk B2B | Kelvantis`
- Description (152 chars): herschreven met "website laten maken", "maatwerk", "B2B", "Nederland en België", CTA "gratis gesprek"
- H1: `Professionele website laten maken voor B2B bedrijven in Nederland en België`

**Nieuwe secties**:
- **Showcase-sectie** (na "Hoe werkt het"): kelvantis.com als demonstratie, 6 technische kenmerken (Core Web Vitals 90+, schema, TL;DR, FAQ, mobiel-first, hreflang)
- **Marktinformatie-sectie** (vóór pakketten): prijsranges 2026 (€2.000–€4.000 simpel, €8.000–€25.000 maatwerk B2B, vanaf €10.000 e-commerce), expliciet gemarkeerd als marktranges, afsluitend kader dat Kelvantis altijd met offerte op maat werkt

**FAQ uitbreiding**: van 6 naar 9 items, zowel HTML `<details>` als `FAQPage` schema:
- "Bouwen jullie websites voor bedrijven in Heerlen, Sittard, Roermond en Venlo?"
- "Kunnen Belgische bedrijven ook bij Kelvantis terecht?" (incl. btw-verlegging)
- "Wat is het verschil tussen een website en een Kelvantis systeem?"

**Interne links in body copy**: naar `/diensten/geo-aeo.html`, `/diensten/workflow-automatisering.html`, `/blog/webflow-vs-wordpress/` (ingebouwd in showcase + marktinformatie + laatste FAQ-antwoord).

**Schema**: `Service` had al `areaServed: [Nederland, België]` — ongewijzigd. `FAQPage` uitgebreid.

---

## Blok 5 — GEO fundering compleet (`2615fe5`)

**Homepage `index.html` schema**:
- `@type` hybride: `["Organization", "LocalBusiness"]`
- `geo`: `GeoCoordinates` Maastricht (lat 50.8514, lon 5.6910)
- `sameAs` uitgebreid met persoonlijke LinkedIn + Crunchbase placeholders
- `knowsAbout` uitgebreid met Webflow, WordPress, n8n, Make.com, Answer Engine Optimization, Workflow Automation

**`robots.txt` uitgebreid**: expliciete `Allow: /` voor GPTBot, ClaudeBot, PerplexityBot, Google-Extended.

**`sitemap.xml`**: 18 `<lastmod>` entries bijgewerkt naar `2026-04-19`.

**`llms.txt`**: email al opgelost in Blok 2.

**ChatGPT-context audit**: 69 voorkomens, ~60% in zakelijke context ("gevonden worden in ChatGPT", "ChatGPT, Perplexity en Google AI Overviews"), rest in meta/OG descriptions (marketing-context, acceptabel). Geen losse out-of-context vermeldingen gevonden. Geen wijziging nodig.

---

## Blok 6 — Nabewerking open TODO's

- **LinkedIn URL**: `https://www.linkedin.com/in/kjellkuijpers/` ingevuld in `over-ons/index.html` (HTML + Person schema) en `index.html` sameAs. TODO-comments verwijderd.
- **Crunchbase**: verwijderd uit `index.html` sameAs — Kjell heeft geen Crunchbase-profiel.
- **Nav-naam**: "AI Development" → "AI Implementatie" globaal vervangen in alle `.html` en `.js` bestanden. Navigatie, schema, page-title en display-naam nu consistent.

## Open TODO's

| Item | Waar | Wanneer oppakken |
|---|---|---|
| Foto Kjell uploaden naar `/images/kjell.jpg` | over-ons Kjell-sectie | Zodra beschikbaar (img verbergt zich nu via onerror) |
| `limburg/index.html` title bevat "SEO Bureau" en "Website Laten Maken Maastricht" | title + og:title + twitter:title | Valt buiten deze sprint; aparte cleanup nodig vanwege positioneringsregels |
| Echte case-studies of klant-showcases | `website-laten-maken.html` | Wanneer toestemming klanten verkregen |

---

## Verificatie-checklist

- [x] `grep "hallo@kelvantis.com"` → 0 treffers in productiecode
- [x] `FAQPage` op `website-laten-maken.html` = 9 entries
- [x] Homepage schema = `["Organization", "LocalBusiness"]` + geo + sameAs
- [x] `robots.txt` bevat 4 expliciete AI-bot user-agents
- [x] Alle sitemap lastmod = `2026-04-19`
- [ ] Rich Results Test doorvoeren op kelvantis.com (uitvoeren na deploy)
- [ ] Localhost dev-server check (geen broken links, menu consistent) — uit te voeren indien gewenst

---

## Homepage redesign + site-cleanup (2026-05-21)

### Homepage redesign — paper/Fraunces (`3897244`, merge `2691558`)

Homepage volledig vernieuwd naar een paper/cream-esthetiek: Fraunces display-font, JetBrains Mono labels, Inter Tight body, coral accent `#FF4D2E`. Alle SEO, content, JSON-LD-schema's (Organization+LocalBusiness, WebSite met speakable, FAQPage), GTM en URL's byte-voor-byte behouden. CSS volledig inline in `index.html` — de gedeelde `style.css` is onaangeroerd, dus de overige pagina's blijven ongewijzigd. `script.js` ongewijzigd. Homepage is light-only (geen dark-mode-variant).

### Site-brede opschoning (branch `site-cleanup`)

- **Componenten** (`a13a582`): `_components/navbar.html` + `footer.html` html-validate- en a11y-fixes — redundante `role`-attributen verwijderd, telefoonnummer met non-breaking spaces, `aria-label` op de mobiele sub-nav, redundante `aria-hidden` van het mobiele menu weg. `build.mjs` gedraaid → gesynct naar alle 22 pagina's. `tongeren` + `lanaken` hadden stale navbar-markup (zonder mobiel menu / theme-toggle); nu in sync.
- **Cookie-banner** (`9b4bec1`): `script.js` bevatte twee conflicterende `initCookieBanner`-implementaties (dubbele banner, inconsistente localStorage-waarden). Samengevoegd tot één — de GA Consent Mode v2-variant die `gtag('consent','update')` aanroept. Inert `#cookieBanner`-element uit `index.html` verwijderd; de overige pagina's volgen bij hun migratie.
- **Performance** (`5593fb1`): `og-image.jpg` 697 KB → 90 KB (JPEG-kwaliteit 82, zelfde 1200×630). Fraunces-fontlink `wght`-as `300..900` → `300..700`.
- **SEO**: `sitemap.xml` `lastmod` van de homepage → `2026-05-21`.

### build.mjs — aandachtspunt

`build.mjs` synct navbar én footer naar elke pagina via regex. De footer-regex `<footer>…</footer>` matcht **elke** footer; de navbar-regex matcht `<header class="navbar|limburg-nav|belgie-nav">`. Een pagina met afwijkende navbar/footer-markup wordt bij de volgende build overschreven met de component. Houd pagina-footers dus identiek aan `_components/footer.html`.
