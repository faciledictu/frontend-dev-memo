---
sidebar_position: 6
---

# Fonts

## Adding Font Files

First, you need to have the font files (e.g., .ttf or .otf) you want to use.
Follow these steps:

1. Create a folder named assets/fonts in the root of your project if it doesn't
   exist.
2. Place your font files in the assets/fonts folder.

```text
your-project/
├── android/
├── ios/
├── src/
├── assets/
│   └── fonts/
│       ├── CustomFont-Regular.ttf
│       └── CustomFont-Bold.ttf
└── ...
```

## Linking

In React Native, you need to link the assets to make them accessible in the native code. This is done differently based on the React Native version you're using.

Add the following to your react-native.config.js file in the root of your project

```javascript
module.exports = {
  assets: ['./assets/fonts/'],
};
```

And run the following command

```sh
npx react-native-asset
```

## Using in Your Project

Once the fonts are linked, you can use them in your React Native components.

```javascript
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.customFontText}>Hello, Custom Font!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  customFontText: {
    fontFamily: 'CustomFont-Regular', // Use the exact name of the font file (excluding extension)
    fontSize: 24,
  },
});

export default App;
```
