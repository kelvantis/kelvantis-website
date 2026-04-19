# Kelvantis Website Audit — 2026-04-19

Snapshot van de huidige staat vóór de consistency sprint. Geen wijzigingen in dit blok — alleen observatie.

## 1. Pagina-overzicht

| Pagina | Meta title | H1 | Schema types | TL;DR | FAQ-sectie |
|---|---|---|---|---|---|
| `index.html` | Kelvantis \| Webdesign · GEO/AEO · AI Automatisering voor B2B | (homepage, meerdere H2) | LocalBusiness, Service×3, Review×3, FAQPage | nee | ja (homepage-FAQ) |
| `over-ons/index.html` | Over Kelvantis \| Het systeem achter de resultaten | Het systeem achter Kelvantis | BreadcrumbList, Person, Organization | nee | nee |
| `werkwijze/index.html` | Onze Werkwijze \| Hoe Kelvantis werkt \| Kelvantis | Zo werken wij. Stap voor stap. | BreadcrumbList | nee | nee |
| `contact/index.html` | Contact \| Plan een gratis strategiegesprek \| Kelvantis | Plan een gratis strategiegesprek | BreadcrumbList, Organization, ContactPoint | nee | nee |
| `faq/index.html` | FAQ \| Veelgestelde Vragen over Webdesign, GEO/AEO & AI \| Kelvantis | Alles wat je wil weten over Kelvantis | FAQPage, BreadcrumbList | nee | ja (hoofdpagina) |
| `diensten/website-laten-maken.html` | Website Laten Maken \| Maatwerk Website voor B2B \| Kelvantis | Professionele website laten maken voor je bedrijf | Service, FAQPage, BreadcrumbList | ja | ja (6 items) |
| `diensten/geo-aeo.html` | GEO & AEO Bureau \| Generative Engine Optimization \| Kelvantis | Gevonden worden in AI-zoekmachines | Service, FAQPage, BreadcrumbList | ja | ja |
| `diensten/workflow-automatisering.html` | Workflow Automatisering \| Bedrijfsprocessen Automatiseren met AI \| Kelvantis | Bedrijfsprocessen automatiseren met n8n en AI | Service, FAQPage, BreadcrumbList | ja | ja |
| `diensten/ai-implementatie.html` | AI Implementatie voor MKB \| AI Chatbot & AI Agent \| Kelvantis | AI implementatie voor je bedrijf, zonder gedoe | Service, FAQPage, BreadcrumbList | ja | ja |
| `blog/index.html` | GEO/AEO, Websites & AI Automatisering Kennisbank \| Kelvantis Blog | Inzichten over websites, GEO/AEO en automatisering | BreadcrumbList | nee | nee |
| `blog/wat-is-geo-aeo/index.html` | Wat is GEO en AEO? Gevonden worden in ChatGPT en Perplexity [2026] | Wat is GEO en AEO? Gevonden worden in ChatGPT en Perplexity [2026] | Article, FAQPage, BreadcrumbList | nee | ja |
| `blog/ai-chatbot-website/index.html` | AI Chatbot voor je Website: Kosten, Voordelen & Voorbeelden [2026] | AI chatbot voor je website: wat kost het en wat levert het op? [2026] | Article, FAQPage, HowTo, BreadcrumbList | nee | ja |
| `blog/webflow-vs-wordpress/index.html` | Webflow vs WordPress (2026): Welk Platform Past bij Jouw Bedrijf? | Webflow vs WordPress in 2026: welk platform past bij jouw bedrijf? | Article, FAQPage, BreadcrumbList | nee | ja |
| `blog/n8n-vs-make/index.html` | n8n vs Make (2026): Eerlijke Vergelijking voor Bedrijven | n8n vs Make: welke automation tool past bij jouw bedrijf? [2026] | Article, FAQPage, BreadcrumbList | nee | ja |
| `limburg/index.html` | **Webdesign & SEO Bureau Limburg \| Website Laten Maken Maastricht \| Kelvantis** | Het AI-bureau van Limburg. | LocalBusiness, FAQPage, BreadcrumbList | nee | ja |
| `belgie/index.html` | AI Bureau België \| Websites, Automatisering & AI Search \| Kelvantis | Het AI-bureau voor Oost-België. | LocalBusiness, FAQPage, BreadcrumbList | nee | ja |
| `lp/gratis-gesprek/index.html` | Gratis Strategiegesprek \| Kelvantis | (landing page) | (geen) | nee | nee |
| `bedankt/index.html` | Aanvraag ontvangen \| Kelvantis | Aanvraag ontvangen! | (geen) | nee | nee |
| `privacy/index.html` | Privacyverklaring \| Kelvantis | Privacyverklaring | (geen) | nee | nee |
| `voorwaarden/index.html` | Algemene Voorwaarden \| Kelvantis | Algemene Voorwaarden | (geen) | nee | nee |
| `404.html` | Pagina niet gevonden \| Kelvantis | Deze pagina bestaat niet | (geen) | nee | nee |

## 2. Contactgegevens — inconsistenties

### `hallo@kelvantis.com` → moet `kelvantis.com@gmail.com` worden
**36 voorkomens in 19 bestanden:**

- `_components/footer.html:30` (centrale footer — daarvandaan wordt het naar alle pagina's ge-inlined)
- `404.html:217`
- `index.html:47` (LocalBusiness schema), `index.html:1090` (footer)
- `over-ons/index.html:494`
- `werkwijze/index.html:460`
- `contact/index.html:54` (Organization schema), `:276` (body), `:348` (footer), `:487` (JS fallback)
- `faq/index.html:97` (FAQPage schema answer), `:297` (body), `:506` (footer)
- `limburg/index.html:43` (LocalBusiness schema), `:1203` (body)
- `belgie/index.html:43` (LocalBusiness schema), `:1197` (body)
- `privacy/index.html:169, :227, :233, :273`
- `voorwaarden/index.html:349, :385`
- `bedankt/index.html:270`
- `lp/gratis-gesprek/index.html:617` (JS fallback)
- `diensten/website-laten-maken.html:681` (footer)
- `diensten/geo-aeo.html:677` (footer)
- `diensten/workflow-automatisering.html:679` (footer)
- `diensten/ai-implementatie.html:691` (footer)
- `blog/index.html:410`, `blog/wat-is-geo-aeo/index.html:501`, `blog/ai-chatbot-website/index.html:552`, `blog/webflow-vs-wordpress/index.html:510`, `blog/n8n-vs-make/index.html:653`
- `llms.txt:13`

### `kelvantis.com@gmail.com` — al aanwezig
- `script.js:524`, `:570` (contactformulier foutmeldingen)

### `+31600000000` (fake nummer)
**Geen treffers.** Al eerder opgeschoond.

### `+31627900367` / `+31 6 27 90 03 67`
Consistent in footer en schema's. Beide formats worden bewust gebruikt (spaties voor weergave en `tel:`-links, zonder spaties voor schema).

## 3. Navigatie — centrale component

`_components/navbar.html` wordt ingevoegd op alle pagina's. Eén bron van waarheid. Menu-items:

- Websites laten maken
- Workflow Automatisering
- **AI Development** (displaynaam — bestandsnaam is `/diensten/ai-implementatie.html`, schema gebruikt "AI Implementatie")
- GEO & AEO
- Aanpak
- Voor wie
- Blog
- FAQ
- Gratis gesprek

**Inconsistentie**: menu-label "AI Development" vs. page-title + Service schema "AI Implementatie" + URL `/diensten/ai-implementatie.html`. Besluit volgens plan: display-naam "AI Development" laat staan, URL/schema ongemoeid. TODO documenteren in CHANGELOG.

## 4. SEO-pagina
`/diensten/seo.html` — **niet gevonden**. Geen redirect of opruiming nodig.

## 5. GEO-bestanden in root

| Bestand | Status | Bijzonderheden |
|---|---|---|
| `llms.txt` | ✅ aanwezig | Email `hallo@kelvantis.com` moet in Blok 2/5 worden aangepast |
| `robots.txt` | ⚠️ incompleet | Alleen `Allow: /` + `Disallow: /bedankt/` + `Sitemap:`. Mist expliciete `User-agent` blokken voor GPTBot, ClaudeBot, PerplexityBot, Google-Extended |
| `sitemap.xml` | ⚠️ oude lastmod | Alle `<lastmod>` = `2026-04-13`. Moet in Blok 5 naar `2026-04-19` |
| `/author/kjell/` directory | niet aanwezig | Niet in sitemap. Geen directe actie in dit plan |

## 6. Schema-dekking

Sterke dekking:
- Alle diensten-pagina's: Service + FAQPage + BreadcrumbList
- Alle blogs: Article + FAQPage + BreadcrumbList (+ HowTo op ai-chatbot-website)
- Homepage: LocalBusiness + Service×3 + FAQPage + Review×3
- Over-ons: BreadcrumbList + Person + Organization

**Gaten** (voor Blok 5):
- Homepage LocalBusiness mist `geo` coordinates, `sameAs` array, `knowsAbout` array
- Homepage niet gemarkeerd als `@type: ["Organization", "LocalBusiness"]` (hybride type)
- Person schema over-ons mist `sameAs` (LinkedIn) en `image`

## 7. "ChatGPT" vermeldingen

Totaal **~69 voorkomens** in 13 HTML-bestanden. Categorisering:

**In-context (goed, geen actie):**
- `diensten/geo-aeo.html` — "ChatGPT, Perplexity en Google AI Overviews", "gevonden worden in ChatGPT"
- `belgie/index.html` — zakelijke context rond AI-zoek adoptie
- `faq/index.html` — "AI-zoekmachines zoals ChatGPT en Perplexity"
- `blog/wat-is-geo-aeo/` — artikelcontext
- `blog/ai-chatbot-website/`, `blog/n8n-vs-make/` — zakelijke context

**Meta/OG descriptions (acceptabel — marketing-context, geen cleanup nodig):**
- limburg, belgie, contact meta descriptions noemen ChatGPT meestal in opsomming met Perplexity

**Losse/context-arme vermeldingen**: geen duidelijke gevonden. Blok 5e wordt een verificatie-ronde, geen grote opschoning.

## 8. Overige bevindingen

- **`limburg/index.html` title schendt positioneringsregels**: bevat zowel "SEO Bureau" als "Website Laten Maken Maastricht". Valt buiten de 5 blokken van dit plan maar verdient aandacht in een vervolgsprint.
- **Person-schema auteur-bio in blogartikelen**: alle vier artikelen gebruiken consistente author-attribution ("Bouwt conversiegerichte websites, GEO/AEO-strategieën en workflow automations voor B2B bedrijven") — ✅.
- **Geen case-studies of showcase** op `website-laten-maken.html` — wordt in Blok 4 aangepakt.
- **`limburg` en `belgie` hebben eigen LocalBusiness schema** (dubbele markup met homepage). Acceptabel voor regio-pagina's maar om in gaten te houden.
