import { createHash } from 'node:crypto';
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

const output = resolve('dist/pwa');
const icons = [180, 192, 512];
const iconName = size => `icon-${size}.png`;
await Promise.all(icons.map(size => copyFile(resolve('assets/pwa', iconName(size)), resolve(output, iconName(size)))));

const manifest = {
  id: './',
  name: 'Escalaê · Voluntário',
  short_name: 'Escalaê',
  lang: 'pt-BR',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#101020',
  theme_color: '#101020',
  icons: [192, 512].map(size => ({ src: iconName(size), sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })),
};
await writeFile(resolve(output, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

const htmlPath = resolve(output, 'index.html');
const html = (await readFile(htmlPath, 'utf8')).replace('<html lang="en">', '<html lang="pt-BR">')
  .replace('</head>', `<meta name="theme-color" content="#101020">
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="apple-touch-icon" href="./icon-180.png">
  </head>`)
  .replace('</body>', `<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(console.warn);
      });
    }
  </script></body>`);
await writeFile(htmlPath, html);

const resources = await readdir(output, { recursive: true, withFileTypes: true });
const bundled = resources.filter(entry => entry.isFile()).map(entry => relative(output, resolve(entry.parentPath, entry.name)).split(sep).join('/'))
  .filter(path => path.startsWith('_expo/') || path.startsWith('assets/')).sort();
const shell = ['./', './manifest.webmanifest', ...icons.map(size => `./${iconName(size)}`), ...bundled.map(path => `./${path}`)];
const version = createHash('sha256').update(html).update(JSON.stringify(shell)).digest('hex').slice(0, 16);

// Only cache the published demo shell. Requests for data and user files stay online.
await writeFile(resolve(output, 'sw.js'), `
const prefix = 'escalae-voluntario:' + self.registration.scope + ':';
const cacheName = prefix + ${JSON.stringify(version)};
const shell = ${JSON.stringify(shell)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shell)));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)))),
  ]));
});
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.open(cacheName)).match('./')));
  } else if (shell.some(path => new URL(path, self.registration.scope).href === request.url)) {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(request)).then(hit => hit || fetch(request)));
  }
});
`.trimStart());
