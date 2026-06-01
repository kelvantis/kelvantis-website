import { readFileSync, writeFileSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, extname } from 'path';

/*
 * SECURITY — bewust geaccepteerd restrisico (audit #11):
 * De CSP in vercel.json bevat `script-src ... 'unsafe-inline'`. Dit is een
 * bewuste keuze: dit is een statische site zonder server-side rendering of
 * user-generated content (laag XSS-aanvalsoppervlak), en de inline scripts
 * (gtag-init, consent-banner, LP/scan-handlers) zijn talrijk en wijzigen
 * regelmatig. Per-script SHA-256-hashes/nonces zijn hier te fragiel: één
 * gemiste of gewijzigde inline-script blokkeert dan álle JS op de site.
 * Bij een toekomstige buildstap die alle inline scripts kan enumereren kan
 * dit alsnog naar hashes/nonces worden gemigreerd.
 */

const navbar = readFileSync('_components/navbar.html', 'utf8');
const footer = readFileSync('_components/footer.html', 'utf8');

// Match standaard navbar (.navbar) én legacy regio-navbars (.limburg-nav, .belgie-nav)
// die ooit als losse design-systemen gebouwd zijn maar nu via build moeten syncen.
const headerRe = /<header class="(?:navbar|limburg-nav|belgie-nav)"[\s\S]*?<\/header>/;
// LET OP: footerRe matcht ELKE <footer>...</footer>. Een pagina-footer die
// afwijkt van _components/footer.html wordt bij de volgende build overschreven.
// Houd pagina-footers dus identiek aan de component.
const footerRe = /<footer[\s\S]*?<\/footer>/;

function collectHtmlFiles(dir, skip = []) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!skip.includes(entry)) collectHtmlFiles(full, skip);
      else continue;
    } else if (extname(entry) === '.html') {
      results.push(full);
    }
    if (stat.isDirectory() && !skip.includes(entry)) {
      // already handled above
    }
  }
  return results;
}

// Collect all HTML files, skipping _components and lp directories
function walkDir(dir, skip = []) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (skip.includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full, skip));
    } else if (extname(entry) === '.html') {
      results.push(full);
    }
  }
  return results;
}

const files = walkDir('.', ['_components', 'lp', 'node_modules', '.git']);
let updated = 0;

for (const file of files) {
  let html = readFileSync(file, 'utf8');
  let changed = false;

  if (headerRe.test(html)) {
    html = html.replace(headerRe, navbar.trim());
    changed = true;
  }
  if (footerRe.test(html)) {
    html = html.replace(footerRe, footer.trim());
    changed = true;
  }

  if (changed) {
    writeFileSync(file, html, 'utf8');
    updated++;
    console.log(`  Updated: ${file}`);
  }
}

console.log(`\nBuild complete. Updated ${updated} files.`);

// ── CSS minify (audit #9) ──────────────────────────────────────────────
// paper.css → paper.min.css. Gebruikt esbuild als die beschikbaar is; valt
// anders veilig terug op een ongeminificeerde kopie zodat de build nooit breekt.
const SRC_CSS = 'paper.css';
const OUT_CSS = 'paper.min.css';
try {
  const css = readFileSync(SRC_CSS, 'utf8');
  let minified;
  try {
    const esbuild = await import('esbuild');
    const result = await esbuild.transform(css, { loader: 'css', minify: true });
    minified = result.code;
    console.log(`CSS minified via esbuild: ${SRC_CSS} → ${OUT_CSS} (${css.length} → ${minified.length} bytes)`);
  } catch (e) {
    minified = null;
    console.warn(`esbuild niet beschikbaar (${e.message}); ${OUT_CSS} wordt een ongeminificeerde kopie.`);
  }
  if (minified !== null) {
    writeFileSync(OUT_CSS, minified, 'utf8');
  } else {
    copyFileSync(SRC_CSS, OUT_CSS);
  }
} catch (e) {
  console.error(`CSS-minify-stap overgeslagen: ${e.message}`);
}
