---
sidebar_position: 5
---

# Module System in Node.js

The module system in Node.js is fundamental to its design and allows developers
to break down their code into manageable, reusable pieces called modules. Each
module is a separate file with its own scope.

## CommonJS Modules

CommonJS module system allows you to structure and organize your code into
separate files, or modules, that can be required and reused across your
application.

### Defining a CommonJS Module

A module is defined in its own file and makes use of the `exports` or
`module.exports` objects to expose functions, objects, or values to other files.

```javascript
// myModule.js
function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = greet;
```

In this example, `greet` is a function defined in _myModule.js_ and is exported
using `module.exports`.

:::tip

`module.exports` is a shorthand for module.exports a shorthand `exports`. Both
refer to the same object initially. However, if you reassign `exports` directly,
it will break the reference to `module.exports`.

```javascript
exports = function () {
  console.log('This will not work as expected');
};
```

:::

### Using a CommonJS Module

To use a module in another file, you use the require function to import it.

```javascript
// app.js
const greet = require('./myModule');

console.log(greet('Node.js'));
```

### Globals

Node.js has several global objects available in all modules, making it
unnecessary to require them explicitly.

`global`<br /> The global namespace object.

`process`<br /> Provides information and control over the current Node.js
process.

`__dirname`<br /> The directory name of the current module.

`__filename`<br /> The file name of the current module.

`require`<br /> Function to import modules.

`module`<br /> Reference to the current module.

`exports`<br /> Shortcut to module.exports.

## ES6 Modules

Node.js also supports ES6 (ECMAScript 2015) modules, which use import and export
syntax. This requires using the _.mjs_ file extension or setting
`"type": "module"` in the _package.json_ file.

### Defining an ES6 Module

```javascript
// myModule.mjs
export function greet(name) {
  return `Hello, ${name}!`;
}
```

### Using an ES6 Module

```javascript
// app.mjs
import { greet } from './myModule.mjs';

console.log(greet('Node.js'));
```

## Module Resolution

_Core Modules_<br/> If the module is a core module, Node.js returns it.

_File Modules_<br/> If the module is a relative path (e.g., _./module_), Node.js
resolves it to a file or directory.

_Node Modules_<br/> If the module is not a core module or relative path, Node.js
searches the node_modules directories.
