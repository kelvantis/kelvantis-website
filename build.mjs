import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const navbar = readFileSync('_components/navbar.html', 'utf8');
const footer = readFileSync('_components/footer.html', 'utf8');

const headerRe = /<header class="navbar"[\s\S]*?<\/header>/;
const footerRe = /<footer class="footer"[\s\S]*?<\/footer>/;

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
