---
sidebar_position: 2
---

# React.Fragment

Each React component should return only one element. If you need to return
multiple elements, you can use a single wrapper element (like a `<div>`). React
Fragments let you group elements without a wrapper node.

:::tip

This is useful when you need to return multiple elements from a component's
render method but don't want to create unnecessary wrapper elements, which can
clutter the DOM and affect styling and performance. Another way is returning an
array of components, alhough you will need to add a `key` prop for each element.

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

Fragments declared with the explicit `<Fragment>` syntax may have keys
(for rendering a list of Fragments)

```javascript
return (
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```
