import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dataDir = path.join(root, 'src/data');
const assetsDir = path.join(root, 'public/assets');

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function hue(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 360;
}

function svg(width, height, id, label, fontSize) {
  const h = hue(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${h} 70% 45%)"/>
      <stop offset="1" stop-color="hsl(${(h + 40) % 360} 60% 15%)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" fill="#fff" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>
</svg>
`;
}

function write(rel, content) {
  const file = path.join(assetsDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const titleFiles = fs.readdirSync(dataDir).filter((f) => /^titles-\d+\.json$/.test(f)).sort();
const titles = titleFiles.flatMap(readJson);
for (const t of titles) {
  write(`posters/${t.id}.svg`, svg(300, 450, t.id, t.name, t.name.length > 16 ? 22 : 28));
  write(`banners/${t.id}.svg`, svg(1600, 700, t.id, t.name, 72));
}

const profiles = readJson('profiles.json');
for (const p of profiles) write(`avatars/${p.id}.svg`, svg(128, 128, p.id, p.name.charAt(0), 56));

write(
  'placeholder.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <rect width="100%" height="100%" fill="#333"/>
  <text x="50%" y="50%" fill="#b3b3b3" font-family="system-ui, sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Sin imagen</text>
</svg>
`,
);

console.log(`Generados ${titles.length} pósteres, ${titles.length} banners y ${profiles.length} avatares.`);
