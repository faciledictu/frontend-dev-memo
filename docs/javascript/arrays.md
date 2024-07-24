---
sidebar_position: 6
desctiption: Storing and managing ordered collections of data in JS
---

# Arrays

Arrays in JavaScript are objects that optimized for storing and managing ordered
collections of data. Array can contain multiple element of any data type. Array
elements are accessed using their index, which starts from 0.

## Creating

:::tip

Normally, it is not necessary to use the `let` keyword to declare a variable
that refers to an array. Using `const`, you cannot reassign the reference to the
array stored in the variable, but the contents of the array can still be
modified.

:::

### Using array litteral syntax

You can also use the spread operator to destructure an array and create a
shallow copy of it. The spread operator can convert any iterable object (such as
a string or a set) into an array.

```javascript
const birds = ['sparrow', 'crow', 'eagle'];
const animals = ['cow', 'dog', ...birds]; // Using of spread-operator
```

### Using the `Array` constructor

```javascript
let planets = new Array('Mercury', 'Venus', 'Earth');
```

### Using `Array.from()` static method

It accepts an iterable or array-like object to convert to an array and an
optional function that is applied to each element of the resulting array.

```javascript
const nodeList = document.querySelectorAll('div');
const divArray = Array.from(nodeList); // Array of div elements

const arr = Array.from([1, 2, 3], (x) => x + x); // [2, 4, 6]
```

## Accessing elements

### Length Property

Arrays and array-like objects have the `lenght` property contains the number of
array elements.

```javascript
let numbers = [1, 10, 100];
console.log(numbers.length); // 3
```

:::tip

Here's and examole how you can create an array and initialize it with values
using a mapping function.

```javascript
const length = 5;
const filledArray = Array.from({ length }, (_, index) => index + 1);
console.log(filledArray); // [1, 2, 3, 4, 5]
```

:::

### Using Bracket Notation

You can access an element in an array is by using the index within square
brackets. Indices start from `0`.

```javascript
let fruits = ['apple', 'banana', 'cherry'];

// Access the first element
console.log(fruits[0]); // 'apple'

// Access the last element
console.log(fruits[fruits.length - 1]); // 'cherry'
```

### Using `at()` Method

Works the same way when accepts positive values, and support for negative
indices to access elements from the end of the array.

```javascript
// Access the first element
console.log(fruits.at(0)); // 'apple'
// Access the last element
console.log(fruits.at(-1)); // 'cherry'
```

### Destructuring assignment

This syntax is a convenient way to extract multiple values from arrays or
objects and assign them to variables in a single statement.

```javascript
const array = [1, 2, 3, 4, 5];

const [a, b] = array; // a = 1, b = 2
const [c, , d] = array; // c = 1, d = 3

// Rest property
const [e, f, ...rest] = array; // e = 1, f = 2, rest = [3, 4, 5]

// Default values
const [g, h = 'a'] = [1]; // g = 1, h = 'a', because default value will be assigned
```

:::tip

You can use destructuring assignment to swap the values of several variables in
one line.

```javascript
let a = 1;
let b = 2;
[b, a] = [a, b];
conslole.log(a, b); // 2, 1
```

:::

## Methods

### Adding and deleting elements

`pop()` Removes the last element from an array and returns it.

`push()` Adds one or more elements to the end of an array.

`shift()` Removes the first element from an array and returns it.

`unshift()` Adds one or more elements to the beginning of an array.

`splice()` Adds or removes elements from an array.

```javascript
const colors = ['red', 'green', 'blue'];

colors.push('yellow');
console.log(colors); // ['red', 'green', 'blue', 'yellow']

const lastColor = colors.pop();
console.log(lastColor); // 'yellow'
console.log(colors); // ['red', 'green', 'blue']

colors.unshift('orange');
console.log(colors); // ['orange', 'red', 'green', 'blue']

const firstColor = colors.shift();
console.log(firstColor); // 'orange'
console.log(colors); // ['red', 'green', 'blue']

colors.splice(1, 1, 'purple'); // At index 1, remove 1 element and add 'purple'
console.log(colors); // ['red', 'purple', 'blue']
```

### Checking values

- `includes()`<br />Determines whether an array includes a certain value.

- `findIndex()`<br />Returns the index of the first element in the array that
  satisfies the provided testing function.

- `find()`<br />Returns the value of the first element in the array that
  satisfies the provided testing function.

- `filter()`<br />Returns a new array with all elements that satisfy the
  provided function.

- `some()`<br />Tests whether at least one element in the array passes the test
  implemented by the provided function.

- `every()`<br />Tests whether all elements in the array pass the test
  implemented by the provided function.

### Sorting

- `sort()`<br /> Sorts the elements of an array in place (i. e. this method
  mutates an array) and returns the sorted array. The method accepts optional
  function for compairing elements. If no function provided, the array elements
  are converted to strings and sorted by compairing their sequences of Unicode
  code point values.

  ```javascript
  const arr = [1, 4, 3, 2];
  arr.sort();
  console.log(arr); // [1, 2, 3, 4]
  ```

  To return new array instead mutating original one, you can use the method
  `toSorted()`, introduced in ES2023.

- `reverse()`<br />Reverses the order of the elements in an array in place (i.
  e. this method mutates an array).

  ```javascript
  const arr = [1, 2, 3, 4];
  arr.reverse();
  console.log(arr); // [4, 3, 2, 1]
  ```

  To return new array instead mutating original one, use `toReversed()` (ES2023)

### Iteration

- `forEach()`<br /> Executes a provided function on every element. Doesn't
  return a result.

  ```javascript
  const cities = ['New York', 'Los Angeles', 'Chicago'];

  const result = cities.forEach((city) => console.log(city));
  // New York, Los Angeles, Chicago

  console.log(result); // undefined, because forEach doesn't return anything
  ```

- `map()`<br /> Returns a new array with the results of calling a provided
  function on every element.

  ```javascript
  const numbers = [1, 2, 3];

  const doubled = numbers.map((n) => n * 2);
  console.log(doubled); // [2, 4, 6]
  ```

- `reduce()` and `reduceRight`<br />Execute a reducer function on each element
  of the array, resulting in a single output value. `reduce` do it from the
  first element to the last, while `reduceRight() starts from the last and goes
  to the first.

  ```javascript
  const letters = ['a', 'b', 'c'];

  const word = letters.reduce((acc, letter) => acc + letter, '');
  console.log(word); // 'abc'

  const reversedWord = letters.reduceRight((acc, letter) => acc + letter, '');
  console.log(word); // 'cba'
  ```

### Flatten

- `flat()`<br /> Flattens a nested array up to the specified depth.

- `flatMap()`<br /> Maps each element using a mapping function, then flattens
  the result into a new array.
