---
sidebar_position: 2
---

# Components

## Functional Components

Defined as JavaScript functions (regular or arrow) that return React element.

- Simpler and more concise than class components. They involve less boilerplate
  code and can be easier to understand.

- They were traditionally stateless, but with the introduction of React Hooks,
  they can now manage state and side effects.

- Better performance compared to class components in certain scenarios. Since
  they are just functions, they have a smaller memory footprint and can be
  optimized more easily by the JavaScript engine.

- Easier to test because they are just JavaScript functions. You can test them
  like any other function by passing input props and asserting the output. This
  makes unit testing simpler and more straightforward.

- Functional components don't have lifecycle methods. To replace some of them
  you can use useEffect hook.

## Class Components

Legacy way to define components. See
[Class Components and Lifecycle Methods](./class-components.md).

## Fragments

Each React component should return only one element. If you need to return
multiple elements, you can use a single wrapper element (like a `<div>`) or
React Fragments, that let you group elements without a wrapper element.

:::tip

This is useful when you need to return multiple elements from a component's
return (or render method) but don't want to create unnecessary wrapper elements,
which can clutter the DOM and affect styling and performance. Another way is
returning an array of components, although you will need to add a `key` prop for
each element.

:::

React Fragments can be used in two ways: using the `<></>` syntax or explicitly.

```javascript
return (
  <>
    <ChildA />
    <ChildB />
  </>
);
```

Fragments declared with the explicit `<Fragment>` syntax may have keys (for
rendering a list of Fragments)

```javascript
function Blog() {
  return posts.map((post) => (
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  ));
}
```
