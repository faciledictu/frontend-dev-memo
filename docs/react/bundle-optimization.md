---
sidebar_position: 23
---

# Bundle Optimisaton

When you import a module or a library into your JavaScript application, it
contributes to the overall size of your bundle. The term "import cost" refers to
the amount of data (in bytes) that this module will add to your final JavaScript
bundle.

:::tip

If you are testing the performance of your React application or encountering
performance issues, it is essential to test a minified final (production) build.

:::

## Bundle Analyzers

Bundle analyzer tools help you identify which modules are contributing the most
to the size of your bundle. Webpack Bundle Analyzer plugin generates an
interactive treemap visualization of the contents of all bundles.

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

## Tree Shaking

Tree shaking is a form of dead code elimination. It ensures that unused modules
are not included in the final bundle.

- Use ES6 import/export syntax. This allows bundlers like Webpack to analyze and
  remove unused code.

- Ensure that dependencies are tree-shakable. Prefer modern libraries that use
  ES6 modules.

Consider importing a large utility library like Lodash.

```javascript
import _ from 'lodash';
```

If your application only uses a few functions from Lodash, importing the entire
library adds unnecessary bulk to your bundle. Instead, you can import only the
specific functions you need.

```javascript
import { debounce, map } from 'lodash';
```

## Splitting Code into Chunks

By splitting your code into smaller chunks and loading them on demand, you can
significantly improve the initial loading time of your web application.

You can use `React.lazy` and dynamic `import()` syntax to load components as
needed for code splitting at the component level. It works with Suspense to show
a fallback UI while loading the split code.

```javascript
import { Suspense, lazy } from 'react';

const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
