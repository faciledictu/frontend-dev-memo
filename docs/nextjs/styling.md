---
sidebar_position: 10
---

# Styling

Here is a review of various opportunities for styling your applications,
providing flexibility and accommodating different preferences and needs.

## CSS Modules

CSS Modules allow you to write CSS that's scoped locally to the component.

This prevents naming conflicts and keeps the styles encapsulated.

To use CSS Modules, create a .module.css or .module.scss file and import it into
your component.

## Tailwind CSS

Tailwind CSS is a utility-first CSS framework that can be integrated with
Next.js.

It allows you to compose styles directly in your markup using utility classes.

Tailwind can be configured and customized via a tailwind.config.js file.

## CSS-in-JS

This approach allows you to write CSS directly within your JavaScript or
TypeScript files.

Libraries like styled-components or emotion can be used for this purpose.

It provides benefits like scoped styles, dynamic styling, and critical CSS.

## Sass

Next.js supports Sass out of the box, enabling you to use .scss or .sass files
for your styles.

Sass provides powerful features like variables, nesting, and mixins that help in
writing more maintainable CSS.

:::tip

If you want to style Server Components, we recommend using CSS Modules or other
solutions that output CSS files, like PostCSS or Tailwind CSS.

:::
