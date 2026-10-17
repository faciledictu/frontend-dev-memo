---
sidebar_position: 4
description:
  Service worker as a network proxy, registration and scope, lifecycle and
  updates, caching strategies, offline and PWA
---

# Service Workers

A **service worker** is a script that the browser runs **between the page and
the network**: a programmable proxy for all requests of its **scope**. It
intercepts the `fetch` event and decides what to answer: from the network, from
**Cache Storage**, or something generated. This gives **offline mode**, instant
repeat loads, **push notifications** and background sync. It is event-driven,
lives independently of the tabs, and the browser stops it when it is idle. It
works only over **HTTPS** (and on `localhost`). Lifecycle: **register → install
→ waiting → activate**, after which it controls the pages.

## Details

### Registration and Scope

- `navigator.serviceWorker.register('/sw.js')` installs it. The **scope** is by
  default the directory of the script: `/sw.js` controls the whole site,
  `/app/sw.js` only `/app/…`. A wider scope needs the `Service-Worker-Allowed`
  header.
- The page that registered it is not controlled until the next navigation,
  unless the worker calls `clients.claim()`.
- One active service worker per scope; it handles requests from all tabs of the
  scope.

### Lifecycle and Updates

1. **Install**: the `install` event, usually to precache the static files.
2. **Waiting**: if an older version still controls open tabs, the new one waits
   until all of them are closed. Even reloading the only tab is not enough: the
   old page is still open while the new one is requested. `self.skipWaiting()`
   activates it at once.
3. **Activate**: the `activate` event, to delete caches of old versions.
   `clients.claim()` takes control of the already open pages.

- The browser checks for an update on navigation to a page in the scope, on
  `registration.update()`, and on push or sync events if the last check was more
  than 24 hours ago. It downloads `sw.js` and compares it byte by byte; the HTTP
  cache is bypassed for this check by default. Calling `register()` again with
  the same URL does not check.
- `skipWaiting()` means that an open page loaded with the old files now gets
  responses from the new worker. Apps often show "A new version is available,
  reload" instead.
- `event.waitUntil(promise)` keeps the worker alive until the work is done;
  `event.respondWith(promise)` gives the response to a request.
- **Debugging**: DevTools → Application → Service workers ("Update on reload",
  "Bypass for network", "Unregister").

### Caching Strategies

| Strategy               | How it works                                          | Suits                                |
| ---------------------- | ----------------------------------------------------- | ------------------------------------ |
| Cache first            | the cache, the network only on a miss                 | files with a hash in the name, fonts |
| Network first          | the network, the cache when offline                   | HTML pages, data that must be fresh  |
| Stale-while-revalidate | the cache at once, updated from the network meanwhile | avatars, non-critical data           |
| Network only           | always the network                                    | `POST`, payments, analytics          |
| Cache only             | only the cache                                        | precached files of an offline app    |

- **Cache Storage** (`caches.open`, `cache.addAll`, `cache.match`, `cache.put`)
  is separate from the HTTP cache and managed only by code.
- **Workbox** implements these strategies, precaching with revisions and cache
  expiration.

### Pitfalls

- No DOM, no `localStorage`; state between events goes to IndexedDB or Cache
  Storage, because the worker can be stopped at any moment and global variables
  are lost.
- A cached `index.html` served cache first keeps users on the old version
  forever. Serve HTML network first.
- A broken service worker survives deploys. Keep a way out: deploy a new `sw.js`
  that unregisters itself (`self.registration.unregister()`), or send the
  `Clear-Site-Data: "storage"` header.

### PWA

A **Progressive Web App** is a site with a **Web App Manifest**
(`manifest.webmanifest`: name, icons, `display: standalone`) and usually a
service worker for offline work. Browsers can then install it as an app with its
own window and icon. Push notifications use the Push API and the Notifications
API through the service worker.

## Example

```javascript title="main.js"
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript title="sw.js"
const CACHE = 'static-v2';
const ASSETS = ['/app.js', '/styles.css', '/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  // Remove the caches of old versions
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // the browser handles it as usual

  if (request.mode === 'navigate') {
    // Pages: network first, the offline page as a fallback
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Static files: cache first
  // highlight-start
  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request))
  );
  // highlight-end
});
```

## Follow-up Questions

- How is a service worker different from a Web Worker? A Web Worker belongs to
  one page and does computation for it. A service worker belongs to a scope,
  intercepts network requests of all its pages and lives without them.
- Why does the new version not activate after a deploy? The old one still
  controls open tabs; it waits until they are closed, or until `skipWaiting()`.
- How do you tell the user that a new version is ready? On `updatefound`, wait
  until the new worker's state is `installed` and show "Reload to update". On
  click, send it a message that calls `skipWaiting()`, and reload the page on
  the `controllerchange` event.
- Why HTTPS only? A worker that can rewrite every response would let a network
  attacker take over the site permanently.
- Does a service worker replace the HTTP cache? No: requests from it go through
  the HTTP cache too. Cache Storage is for what must work offline or be
  controlled from code.

## Common Mistakes

- Registering `/static/sw.js` and expecting it to control the whole site: the
  scope is the script's directory.

- Serving HTML cache first and forgetting to version the caches: users never get
  the new release.
- Keeping state in global variables of the worker: it is stopped and restarted
  between events.
- Calling `skipWaiting()` without thinking about open pages that still run the
  old code.
- Expecting the first page load to be controlled: the worker takes control from
  the next navigation, or after `clients.claim()`.

## See Also

- [Web Workers](./web-workers.md)
- [Browser Storage](../network/storage.md)
- [Critical Rendering Path and Loading Performance](../performance/loading-performance.md)
