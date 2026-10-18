---
sidebar_position: 5
description:
  pushState and replaceState, the popstate event, hash vs history routing, and
  the Navigation API
tags: [junior, middle]
---

# History API

The **History API** lets a single-page app change the URL **without a page
load**:

- `history.pushState(state, '', url)` adds an entry to the session history,
  `history.replaceState(state, '', url)` replaces the current one. The URL in
  the address bar changes, but **no request is sent** and no event fires: the
  app renders the new view itself.
- When the user goes **back or forward**, the browser fires **`popstate`** with
  the entry's `state`, and the app renders the view for `location`.

A client-side router is these two parts plus intercepting link clicks. The newer
**Navigation API** puts all of it into one `navigate` event.

## Details

### pushState and replaceState

- The URL must have the **same origin** as the page, otherwise a `SecurityError`
  is thrown. A relative URL works: `pushState(null, '', '?tab=2')`.
- The second argument (`title`) is ignored by browsers; pass `''`.
- `state` is stored as a **structured clone** (like `postMessage`), so functions
  and DOM nodes throw `DataCloneError`. It survives a reload and comes back as
  `history.state`. Keep it small: an ID or a scroll position, not the page data.
- `replaceState` is for updates that should not create a back step: filters
  typed into a search field, a corrected URL after a redirect.
- `history.back()`, `forward()` and `go(n)` move through the history
  asynchronously, like the browser buttons, and fire `popstate` when the target
  entry belongs to the same document.

### popstate and hashchange

- `popstate` fires on **traversal** (back, forward, `history.go()`) between
  entries of the same document, and also on fragment navigation (`#section`). It
  does **not** fire for `pushState` / `replaceState` or on page load.
- `hashchange` fires when only the fragment changes: a click on `#id` or
  `location.hash = 'id'`. It fires after `popstate`, and not after `pushState`,
  even if the URL had a different hash.
- `history.scrollRestoration = 'manual'` turns off the browser's own scroll
  restoration on back / forward, so the router can restore the position after
  the content is rendered.

### Hash vs History Routing

|                      | Hash routing (`/#/users/1`)      | History routing (`/users/1`)                       |
| -------------------- | -------------------------------- | -------------------------------------------------- |
| Events               | `hashchange`                     | `pushState` + `popstate`                           |
| What the server sees | Always `/`: the hash is not sent | The full path: it must return `index.html` for all |
| SEO and SSR          | Poor                             | Normal URLs                                        |
| Anchors `#id`        | Taken by the router              | Work as usual                                      |

Server configuration and React Router's `HashRouter` are covered in
[React Router](../../react/ecosystem/routing.md).

### Navigation API

- `navigation.addEventListener('navigate', handler)` receives **every**
  navigation the page starts: link clicks, form submissions, back / forward,
  `location.href = …`, `history.pushState`. Typing in the address bar and
  bookmarks are not included.
- `event.intercept({ handler })` turns it into a same-document navigation: the
  browser updates the URL, the async `handler` renders the view, and the page
  does not reload. No manual click handling and no separate `popstate`.
- `event.canIntercept` is `false` for cross-origin URLs and for back / forward
  to another document; `event.hashChange`, `event.downloadRequest` and
  `event.formData` describe the navigation.
- `navigation.entries()` lists the tab's same-origin history entries (`history`
  hides them), `navigation.currentEntry.getState()` returns its state,
  `navigation.navigate(url, { state })` and `navigation.traverseTo(key)`
  navigate and return `{ committed, finished }`, two promises.
- `event.signal` aborts when the user starts another navigation, so a stale
  fetch can be canceled.

Support: the History API is Baseline; the Navigation API has been Baseline since
January 2026.

## Example

A minimal router: link delegation, `pushState` and `popstate`:

```javascript
const routes = {
  '/': () => '<h1>Home</h1>',
  '/about': () => '<h1>About</h1>',
};

function render() {
  const view = routes[location.pathname] ?? (() => '<h1>Not found</h1>');
  document.querySelector('#app').innerHTML = view();
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (
    !link ||
    link.origin !== location.origin ||
    link.target ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return; // external links and "open in a new tab" stay with the browser
  }
  event.preventDefault();
  // highlight-next-line
  history.pushState(null, '', link.href);
  render(); // pushState does not fire popstate
});

window.addEventListener('popstate', render); // back and forward
render();
```

The same router with the Navigation API, without click handling:

```javascript
navigation.addEventListener('navigate', (event) => {
  if (!event.canIntercept || event.hashChange || event.downloadRequest) return;

  const { pathname } = new URL(event.destination.url);
  // highlight-next-line
  event.intercept({
    handler: async () => {
      const view = routes[pathname] ?? (() => '<h1>Not found</h1>');
      document.querySelector('#app').innerHTML = view();
    },
  });
});
```

The delegation itself is explained in [DOM Events](./events.md).

## Follow-up Questions

- Why does the URL change but nothing happens after `pushState`? The API only
  updates the history and the address bar; rendering the view is the app's job.
- How do you warn about unsaved changes before leaving? `beforeunload` for page
  loads; inside the SPA, the router has to block its own navigation (in the
  Navigation API, `event.preventDefault()` in `navigate`).
- Where do you keep the state of filters so that a link can be shared? In the
  query string (`URLSearchParams`), updated with `replaceState`. See
  [URL and Encoding](../network/url.md).
- How does the app restore the scroll position on back?
  `scrollRestoration = 'manual'`, the position saved in `history.state`
  (`replaceState` before leaving), and `scrollTo` after the view is rendered.
- Why is the Navigation API simpler for routers? One event covers links, forms
  and back / forward, and the browser tracks the loading state and aborts stale
  navigations.

## Common Mistakes

- Expecting `pushState` to fire `popstate` or to load the page.
- Intercepting every `<a>` click, including external links, `target="_blank"`
  and Ctrl / Cmd + click.
- Storing large data or non-cloneable values in `state`.
- Calling `pushState` for every keystroke in a search field instead of
  `replaceState`: the back button then steps through each letter.
- Forgetting the server fallback, so a reload of `/about` returns 404.

## See Also

- [React Router](../../react/ecosystem/routing.md)
- [DOM Events](./events.md)
- [URL and Encoding](../network/url.md)
