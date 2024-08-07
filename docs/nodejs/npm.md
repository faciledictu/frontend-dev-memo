---
sidebar_position: 6
---

# NPM package manager

## `npm init`

Initializes a new Node.js project and creates a _package.json_ file.

Starts an interactive prompt asking for details like project name, version,
description, entry point, test command, repository, keywords, author, and
license.

`npm init -y` or `npm init --yes`<br /> Automatically accepts default values for
all prompts, creating a _package.json_ with default settings.

## `npm install`

Installs all dependencies listed in _package.json_ or a specific package if
specified.

By default, it updates _package-lock.json_ and creates a _node_modules_
directory with the installed packages.

`npm install`<br /> Installs all dependencies defined in _package.json_.

`npm install <package-name>`<br /> Installs a specific package.

`npm install <package-name>@<version>`<br /> Installs a specific version of a
package.

`npm install <package-name> --save`<br /> Installs the package and updates
_package.json_ under the dependencies field. As of npm 5, --save is the default
behavior, so this flag is often unnecessary.

`npm install <package-name> --save-dev`<br /> Installs the package and updates
_package.json_ under the devDependencies field. Useful for packages that are
only needed during development, such as testing frameworks, linters, and build
tools.

## `npm ci`

Stands for "clean install". It installs dependencies from _package-lock.json_
rather than _package.json_.

The command ensures that the `node_modules` directory is consistent with the
`package-lock.json`, deleting any existing node_modules directory and
reinstalling everything from scratch.

It is faster and more reliable for continuous integration (CI) and continuous
deployment (CD) workflows.

## package-lock.json and npm-shrinkwrap.json

Both _package-lock.json_ and _npm-shrinkwrap.json_ are used in Node.js projects
to ensure the consistency of installed packages across different environments.
They help lock down the versions of dependencies, avoiding issues that may arise
due to version mismatches.

### package-lock.json

This file is mainly for applications to ensure the environment's consistency.

Automatically generated by npm when `npm install` is run. Helps improve the
speed and reliability of `npm install` by avoiding version resolution each time.

### npm-shrinkwrap.json

The file is mainly for libraries/modules to lock down the dependencies for
consumers. If _npm-shrinkwrap.json_ is present, npm uses it instead of
_package-lock.json_.

For modules that will be published, _npm-shrinkwrap.json_ is recommended to
ensure consumers get the exact dependency tree.

`npm shrinkwrap`<br /> _npm-shrinkwrap.json_ doesn't created automaticallt, it
needs to be manually created by running the command above.
