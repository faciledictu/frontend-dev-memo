# React Developer Interwiev Questions

I've put together this file of answers to some of the most common questions
about JavaScript and React that you might be asked in a job interview.

> [!IMPORTANT]
> I've answered all the questions myself, using different sources.
> I can't promise that the answers are 100% correct and comprehensive, but I'm
> working on it!

## JavaScript Basics

### What data types exist in modern JS?

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
> `typeof null` will return `object` instead of `null`. This behaviour has some
historical reasons.

- And one is a non-primitive, or composite, data type

  - **Object**

#### Primitives

##### Immutability[^2]

It is important not to confuse a primitive value itself with a variable
assigned a primitive value. Primitives are immutable, so if you intend to
alter the variable containing a primitive, you need to replace its value with
a new one.

Strings are immutable, so you can't replace one letter in the string value.
Symbols are immutable also.

##### Auto-boxing

Technically, primitives have no methods or properties, but they behave as if
they do. When we try to access property or method of a primitive, JavaScript
temporary converts the primitive to the corresponding object.

> [!NOTE]
> `-Infinity`, `+Infinity` and even `NaN` (not a number) are a
> special values of the number data type. And `NaN` it's also the only value in
> JavaScript that isn't equal to itself when we use the loose or strict
> equality operator to compare it (only `Object.is(NaN, NaN)` will return
> `true`).

#### Objects

Objects are stored in memory, and variable reference them by links. In
JavaScript, objects are the sole mutable values.

Arrays, Dates, Sets, Maps, and many more structures in JavaScript are also
objects. Additionally, functions are objects, with the added capability of being
callable.

Each object represents a collection of key-value pairs. Keys are either strings
or symbols, and values can be of any data type, including other objects.[^3]

[^1]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#data_structures_and_types>
[^2]: <https://developer.mozilla.org/en-US/docs/Glossary/Mutable>
[^3]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects>

### What is type coercion

JavaScript is a weakly typed language, so values can be implicitly converted to
another types when that type is expected. For instance, this occurs when we apply
the unary plus operator `+` or invoke `console.log()` with any argument. In the
first case, the value will be converted to a number, while in the second, the
argument will be converted to a string.

Values can be converted different ways: to primitives (it’s called Primitive coercion),
to strings (String coercion), to booleans (Boolean coercion), to numbers (Numeric
coercion), etc. However, values cannot be coerced to `null`, `undefined`, or `symbol`.
In other words, all data types, except `null`, `undefined`, and `symbol`, have
their coercion process.[^4]

[^4]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#type_coercion>

### Variables in JS

In JavaScript, there are three keywords used to declare variables: `var`, `let`, and `const`. A keyword is followed by an identifier name and optionally by a value.

```javascript
// declaration    // initializer
var myVar         = 10;
```

**A declaration** consist of keyword followed by an identifier name is called .
**An initializer** includes an equal sign followed by an initial value.

Identifier names must follow certain rules:

- They can include letters, digits, `_`underscore and `$` dollar signs.
- They can’t begin with a digit.
- They are case-sensitive (`myVar` and `MyVar` are different variables).
- The standard convention is to use CamelCase-styled identifiers in JS code.

#### Keyword `var`[^5]

`Var` is used to declare a variable with an optional initializer. If a variable is declared without an initializer, it is automatically assigned the value `undefined`.

When a `var` variable is declared at the top level of code (outside any function), it’s considered a global variable and is accessible to any code at any level. If the code is runnin in a module mode it becames module-scoped.

Variable of this type can also be local, which occurs when they are declared within a function body. In such cases, they are only accessible within that function.

`var` variables are hoisted (however it's not official term)[^7], that means declarations are lifted, and any code located above the declaration can access them. Although only declarations are hoisted, not initial values.

>[!NOTE]
>Unlike `let` or `const`, `var` variables can be redeclared in the same scope. If `var` is declared as a global variable, it adds a property of global object.

#### Keywords `let` and `const`[^6]

Introduced in ES6, `let` and `const` allow you to declare variables that can be not only global or local but also block-scoped. A block is to a portion of code delimited by a pair of curly braces. If the `const` or `let` variable are declared within any block (e.g., inside `if` or `for` statement), they are only avaliable inside this block.

For `let` variables, an initializer is optional, similar for var.

Keyword `const` declares a constant whose value can’t be reassigned after its creation. So for them an initializer is necessary. It's worth noting that objects (including arrays) stored in `const` variables still can be mutated. This happens because variable holds only a reference to the object, and while the remains constant, the object's properties can be changed or new ones can be created.

Variables declared with `let` and `const` can only be accessed after their declaration.

>[!NOTE]
> We can say `const` and `let` are in temporal dead zone from the start of the block to the place where they are declared. They can be accessed by the code, that located before the declaration in the file but executed after. For example, the function is declared before the variable, that is used in this function. If we call the function before the variable declaration, the function will have access to the variable. So only the order of execution matters.

[^5]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var>
[^6]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations>
[^7]: <https://developer.mozilla.org/en-US/docs/Glossary/Hoisting>
