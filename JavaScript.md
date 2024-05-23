# JavaScript

## What data types exist in modern JS?

JavaScript includes 8 data types.

- Seven are primitive data types[^1]

  - **undefined**: a special value automatically assigned to identifiers if they
    don't have any value
  - **null**: A keyword denoting a nonexistent value, but implicitly assigned
  - **boolean**: contains `true` and `false` values
  - **string:**: a sequence of characters that represents a text value
  - **number**: an integer or floating point number
  - **bigint**: an integer with infinite precision
  - **symbol**: a data type whose instances are always unique

> [!NOTE]
> `typeof null` will return `object` instead of `null`. This behaviour
> has some historical reasons.

- And one is a non-primitive, or composite, data type

  - **Object**

### Primitives

#### Immutability[^2]

It is important not to confuse a primitive value itself with a variable assigned
a primitive value. Primitives are immutable, so if you intend to alter the
variable containing a primitive, you need to replace its value with a new one.

Strings are immutable, so you can't replace one letter in the string value.
Symbols are immutable also.

#### Auto-boxing

Technically, primitives have no methods or properties, but they behave as if
they do. When we try to access property or method of a primitive, JavaScript
temporary converts the primitive to the corresponding object.

> [!NOTE]
> `-Infinity`, `+Infinity` and even `NaN` (not a number) are a special
> values of the number data type. And `NaN` it's also the only value in
> JavaScript that isn't equal to itself when we use the loose or strict equality
> operator to compare it (only `Object.is(NaN, NaN)` will return `true`).

### Objects

Objects are stored in memory, and variable reference them by links. In
JavaScript, objects are the sole mutable values.

Arrays, Dates, Sets, Maps, and many more structures in JavaScript are also
objects. Additionally, functions are objects, with the added capability of being
callable.

Each object represents a collection of key-value pairs. Keys are either strings
or symbols, and values can be of any data type, including other objects.[^3]

[^1]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#data_structures_and_types>

[^2]: <https://developer.mozilla.org/en-US/docs/Glossary/Mutable>
[^3]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects>

## What is type converson

JavaScript is a weakly typed language, so values can be converted to another
type when needed. This called **impicit type conversion** or **type coercion**.
For example, when we use logical negation operator `!` followed value is coerced
to boolean. Invoking `console.log()` with any non-string argument triggers
string coercion.

Values can be converted different ways: to primitives (it’s called _Primitive
coercion_), to strings (_String coercion_), to booleans (_Boolean coercion_), to
numbers (_Numeric coercion_) and to object (_Object coercion_). However, values
cannot be coerced to `null`, `undefined`, or `symbol`. In other words, these
data types don't have their coercion process.[^4]

Manual transformations of data from one type to another called **explicit type
conversion** and achieved through functions like `parseInt()`, `Object()` or
methods like `.toString`. [^4]:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion>

## Variables in JS

In JavaScript, there are three keywords used to declare variables: `var`, `let`,
and `const`. A keyword is followed by an identifier name and optionally by a
value.

<!-- prettier-ignore -->
```javascript
// declaration     // initializer
var myVariable     = 10;
```

**A declaration** consist of keyword followed by an identifier name is called .
**An initializer** includes an equal sign followed by an initial value.

Identifier names must follow certain rules:

- They can include letters, digits, `_`underscore and `$` dollar signs.
- They can’t begin with a digit.
- They are case-sensitive (`myVar` and `MyVar` are different variables).
- The standard convention is to use CamelCase-styled identifiers in JS code.

### Keyword `var`[^5]

`Var` is used to declare a variable with an optional initializer. If a variable
is declared without an initializer, it is automatically assigned the value
`undefined`.

When a `var` variable is declared at the top level of code (outside any
function), it’s considered a global variable and is accessible to any code at
any level. If the code is runnin in a module mode it becames module-scoped.

Variable of this type can also be local, which occurs when they are declared
within a function body. In such cases, they are only accessible within that
function.

`var` variables are hoisted (however it's not official term)[^7], that means
declarations are lifted, and any code located above the declaration can access
them. Although only declarations are hoisted, not initial values.

> [!NOTE]
> Unlike `let` or `const`, `var` variables can be redeclared in the same
> scope. If `var` is declared as a global variable, it adds a property of global
> object.

### Keywords `let` and `const`[^6]

Introduced in ES6, `let` and `const` allow you to declare variables that can be
not only global or local but also block-scoped. A block is to a portion of code
delimited by a pair of curly braces. If the `const` or `let` variable are
declared within any block (e.g., inside `if` or `for` statement), they are only
avaliable inside this block.

For `let` variables, an initializer is optional, similar for `var`.

Keyword `const` declares a constant whose value can’t be reassigned after its
creation. So for them an initializer is necessary. It's worth noting that
objects (including arrays) stored in `const` variables still can be mutated.
This happens because variable holds only a reference to the object, and while
the remains constant, the object's properties can be changed or new ones can be
created.

Variables declared with `let` and `const` can only be accessed after their
declaration.

> [!NOTE]
> We can say `const` and `let` are in temporal dead zone from the start
> of the block to the place where they are declared. They can be accessed by the
> code, that located before the declaration in the file but executed after. For
> example, the function is declared before the variable, that is used in this
> function. If we call the function before the variable declaration, the
> function will have access to the variable. So only the order of execution
> matters.

[^5]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var>

[^6]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations>

[^7]: <https://developer.mozilla.org/en-US/docs/Glossary/Hoisting>

## Function Declarations, Function Expressions, and Arrow Functions

### Function Keyword (regular functions)

#### Function Declarations

Function declarations define named functions that can be called later in your
code, even before the function declaration itself. They start with the
`function` keyword followed by the function name, a list of parameters in
parentheses, and the function body enclosed in curly braces.

Function declarations are hoisted, meaning they can be declared below the code
that uses them.

#### Function Expressions

Function expressions define functions as part of an expression, allowing them to
be assigned to variables. They can be anonymous (without a name) or named. After
declaration they can be invoked by variable name.

### Arrow Functions

Arrow functions use another syntax with the arrow `=>` symbol. They are always
anonymous, meaning they can only be assigned to a variable or used to declare
callbacks in-place. Unlike regular functions, arrow functions don't have their
own `this` keyword. Instead, they inherit it from the outer lexical environment.
This is why they can't be used as constructors. Additionally, arrow functions
don't have their own `arguments` array-like object.

## What is the `this` keyword used for in JavaScript?[^8]

The `this` keyword in JavaScript is a special idetifier that references the
context in which the code is executing.

Its behavior can vary depending on whether the code is running in strict mode or
not[^9].

1. In non-strict mode this always should refer to an object. If this is
   `undefined` or `null`, `this` gets substituted with `globalThis`.
2. If this points to any other primitive value, that value will be wrapped in
   the corresponding object.

### Global This

Outside of any function, `this` refers to `globalThis`, which is `undefined` in
strict mode or the 'global object' in non-strict mode. In code running at a
top-level of a module `this` is always 'undefined' because modules always run in
strict mode[^10].

### Inside regular functions

For regular functions, `this` is always defined at the time of invocation:

- **For standalone function calls**, `this` refers to `globalThis` (as mentioned
  earlier: `undefined` for _strict mode_ and _global object_ for _non-strict_).

<details>
<summary>Example</summary>

```javascript
'use strict';

function showThis() {
  console.log(this);
}

showThis(); //undefined
```

</details>

- **For calling as a method** `this` points to the related object (i.e. the
  object preceding the dot)

<details>
<summary>Example</summary>

```javascript
function showThis() {
  console.log(this);
}

const obj1 = {
  a: 1,
  showThis,
};

obj1.showThis(); // { a: 1, showThis: [Function: showThis] }
```

</details>

- **When a function is calling as a callback** this can refers to `undefined` or
  other value, depends of the API. For example, when a callback passed to
  `addEventListener()` is invoked, `this` usually refers to the DOM element that
  triggered the event.

<details>
<summary>Example</summary>

```javascript
function showThis() {
  console.log(this);
}

setTimeout(showThis);
// Depends on the Host. E. g.:
// in browser: Window object
// in node: Timeout object
```

</details>

- **In constrictors**, if function is invoked with the `new` keyword, `this`
  will refer to newly created object. Its internal [[Prototype]] property set to
  the `prototype` propery of the constructor function.

<details>
<summary>Example</summary>

```javascript
function ShowThis() {
  this.a = 1;
  console.log(this);
}

new ShowThis(); // ShowThis {a: 1}
```

</details>

- **When using the methods `.bind()`, `.apply()` and `.call()`.**, these can
  explicitly redefine `this` by passing its value as an argument.

<details>
<summary>Example</summary>

```javascript
'use strict';
function showThis() {
  console.log(this);
}

showThis.apply(1); // 1
```

</details>

#### Inside arrow function

Arrow functions don't have their own this. They inherit it from that lexical
environment, where they were defined (not called!). It works the same way as
closure.

<details>
<summary>Example</summary>

```javascript
'use strict';
const showThis = () => {
  console.log(this);
};

const obj1 = {
  a: 1,
  showThis,
};

obj1.showThis(); // undefined
```

</details>

[^8]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this>

[^9]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#securing_javascript>

[^10]: <https://tc39.es/ecma262/#sec-strict-mode-code>

## `bind`, `call`, and `apply` Methods in JavaScript

These are methods of `Function` prototype, they allow invoking a function with
explicitly bound `this` and applied arguments.

### `bind`

The bind method returns a bound function. This is a new function with the same
body as the original, but with its `this` keyword set to the provided value.
Additionally, it allows you to specify a sequence of arguments, which will
precede any provided when the new function is called. This method can be used
for creating partially applied functions.

<details>
<summary>Example</summary>

```javascript
function showThisAndArgs(...args) {
  console.log(this, ...args);
}

const binded = showThisAndArgs.bind({}, 'a', 'b');

binded('c'); // {} a b c
```

</details>

### `call` and `apply`

Unlike `bind`, these methods are used to invoke a function immediately. They
both accept `this` value as the first argument. The difference between these
methods lies in how they take arguments for the function being called. The
`call` method receives arguments provided individually, while the `apply` method
accepts arguments provided as an array.

<details>
<summary>Example</summary>

```javascript
function showThisAndArgs(...args) {
  console.log(this, ...args);
}

showThisAndArgs.call({}, ['a', 'b']); // {} a b
showThisAndArgs.apply({}, 'a', 'b'); // {} a b
```

</details>

## Arrays

Arrays in JavaScript are objects that optimized for storing and managing ordered
collections of data. Array can contain multiple element of any data type. Array
elements are accessed using their index, which starts from 0.

### Destructuring assignment

This syntax is a convenient way to extract multiple
values from arrays or objects and assign them to variables in a single
statement.

```javascript
const array = [1, 2, 3, 4, 5];

const [a, b] = array; // a is 1, b is 2
const [c, , d] = array; // c is 1, d is 3

// Rest property
const [e, f, ...rest] = array; // e is 1, f is 2, rest is [3, 4, 5]

// Default values
const [g, h = 'a'] = [1] // g is 1, h is 'a', because default value will be assigned

> [!NOTE]
> You can use destructuring assignment to swap the values of several variables in one line.
>
> ```javascript
> let a = 1;
> let b = 2;
> [b, a] = [a, b];
> conslole.log(a, b) // 2, 1
> ```

## How to Create Objects in JavaScript

- **Object Literal notation[^11].** It allows defining key-value pairs within
  curly braces `{}`.
- **Object.create() method[^12].** This method allows you to create a new object
  using a prototype object passed as an argument.
- **Constructor function and ES6 Classes[^13].** These approaches allows you to
  create an object using the `new` keyword. JavaScript offers various built-in
  constructors for creating different objects, and it's also possible to define
  custom ones. While both constructor functions and ES6 classes can be used,
  classes provide a more organized and structured way to create objects.

[^11]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer>

[^12]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create>

[^13]:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects#using_a_constructor_function>
