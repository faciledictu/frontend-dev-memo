---
sidebar_position: 1
---

# Styling Approaches

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

## Styled Components in React Native

Styled Components is a library for styling React Native (and React)
applications. It uses tagged template literals (a JavaScript feature) to style
components directly within your JavaScript files. This approach keeps the
styling tied closely to the component, providing a seamless development
experience.

### Define Styled Components

Use the `styled` function to create styled versions of React Native components.

```javascript
import styled from 'styled-components/native';
import { Text, View } from 'react-native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

const StyledText = styled(Text)`
  font-size: 18px;
  color: #333;
`;

const App = () => (
  <Container>
    <StyledText>Hello, Styled Components!</StyledText>
  </Container>
);

export default App;
```

#### Dynamic Styling with Props

Styled Components can also be used to apply dynamic styles based on props.

```javascript
const Button = styled.TouchableOpacity`
  background-color: ${({ primary }) => (primary ? '#007BFF' : '#6C757D')};
  padding: 10px 20px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
`;

const App = () => (
  <Button primary>
    <ButtonText>Click Me</ButtonText>
  </Button>
);
```

#### Theming

Styled Components can also be used to apply theme-based styles.

```javascript
import { ThemeProvider } from 'styled-components/native';

const theme = {
  colors: {
    primary: '#007BFF',
    secondary: '#6C757D',
  },
};

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
`;

const App = () => (
  <ThemeProvider theme={theme}>
    <Button />
  </ThemeProvider>
);
```

#### Composition and Inheritance

Styled Components support composition and inheritance, allowing you to create
complex styles from simpler ones.

```javascript
import styled from 'styled-components/native';

const BaseButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: #007bff;
`;

const SecondaryButton = styled(BaseButton)`
  background-color: #6c757d;
`;

const App = () => (
  <>
    <PrimaryButton />
    <SecondaryButton />
  </>
);

export default App;
```

### Pros and Cons

#### Pros

- Dynamic and Conditional Styling. Style components dynamically based on props
  or states without extra logic.
- Supports Theming. Built-in support for theming allows easy application-wide
  styling changes.
- Allows using CSS syntax, making styling more intuitive for developers familiar
  with CSS.

#### Cons

- Styles are generated dynamically, which might affect performance in
  high-frequency updates or on lower-end devices.

- Dependency on third-party library
