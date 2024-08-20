---
sidebar_position: 2
---

# StyleSheet

The _StyleSheet_ object is used to create and manage styles for your components.
It helps in organizing styles in a way that is consistent, scalable, and
optimized.

By using StyleSheet, you can define styles in a similar way to how CSS works on
the web, but with the added benefits of performance optimizations specific to
React Native.

## Methods

### StyleSheet.create

Allows you to define styles in a centralized and organized manner. It takes an
object where keys represent style names and values are the style definitions.

:::tip

Always define your styles using `StyleSheet.create`.

While inline styles can be convenient for quick styling, they should be avoided
for complex components because they bypass the optimizations that
`StyleSheet.create` provides. This method helps React Native improve performance
by reducing the overhead of creating styles during render.

:::

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'blue',
  },
});
```

### StyleSheet.flatten

Takes an array of style objects and merges them into a single style object. It’s
useful when you want to combine multiple styles.

```javascript
const combinedStyle = StyleSheet.flatten([styles.text, { fontWeight: 'bold' }]);
```

### StyleSheet.flatten and StyleSheet.compose

`flatten` is used to merge an array of style objects into a single style object.
This is particularly useful when you want to combine multiple styles and apply
them to a component. It resolves any style conflicts by using the last style in
the array to override previous ones.

```javascript
const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const combinedStyle = StyleSheet.flatten([styles.base, styles.bold]);
// combinedStyle = { fontSize: 16, color: 'black', fontWeight: 'bold' }
```

`compose` convenience method provided by React Native to combine two styles into
a single style. Unlike `flatten`, it is specifically designed to handle _exactly
two styles_ and returns a single merged style.

## Properties

### StyleSheet.hairlineWidth

This property provides the smallest possible width (usually 1 pixel) that a
screen can display. It's often used for drawing borders or lines that need to be
extremely thin.

```javascript
const styles = StyleSheet.create({
  thinLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
  },
});
```

### StyleSheet.absoluteFill

This is a style reference that can be directly applied to a component using the
style prop. It is an object that contains predefined styles to absolutely
position an element, making it fill its parent component.

```jsx
<View style={[styles.box, StyleSheet.absoluteFill]}>
```

### StyleSheet.absoluteFillObject

This is the actual object containing the style properties that enable absolute
positioning. The properties include
`{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }`. You can spread
this object or merge it with other styles as needed.

```javascript
const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
```

## Dimenstions API

Use the Dimensions API to create responsive designs that adapt to different
screen sizes. This is particularly useful for defining dynamic styles based on
screen dimensions.

```javascript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.2,
  },
});
```
