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

There are 3 keywords to declare variables: `var`, `let`, and `const`. The keyword followed by the identifier name and optionally by a value.

A keyword followed by an identifier name is called a declaration, a = operator followed by initial value is called an initializer.

```javascript
// declaration    // initializer
var myVar         = 10;
```

Identifier names must follow certain rules:

- Identifiers can consist of letters, digits, underscores, and dollar signs.
- Identifiers can’t begin with a digit.
- Identifiers are case-sensitive (`myVar` and `MyVar` are different variables).
- The standard practice is using CamelCase-styled identifiers in JS code.

#### Keyword `var`

`Var` is used for a variable declaration with an optional initializer. If a variable is declared without an initializer, it is automatically assigned the value `undefined`.

When a `var` variable is declared at the top level of code (outside any function), it’s considered a global variable and is accessible to any code at any level.

Variable of this type can also be local, which occurs when they are declared within a function body. In such cases, they are only accessible within that function.

`var` variables are hoisted, that means declarations are lifted, and any code located above the declaration can access them. Although only declarations are hoisted, not initial values.

#### Keywords `let` and `const`

These keywords introduced in ES6 and they allow you to declare not only global local or variables. They can be block-scoped as well. A block is to a portion of code delimited by a pair of curly braces. If the `const` or `let` variable are declared within any block (e.g., if or for statements), they are only avaliable inside this block.

For `let` variables, an initializer is optional, similar for var. And keyword `const` declares a constant whose value can’t be reassigned after its creation. So for them an initializer is necessary. It's worth noting that objects (including arrays) stored in `const` variables still can be mutated. It happens because variable have only a reference to an object, and that refenese remains constant, while object properties can be changed or new ones can be created.

Variables declared with `let` and `const` can only be accessed after their declaration.

>[!NOTE]
> We can say `const` and `let` are still hoisted, because they can be accessed by the code, that located before the declaration in the file. It is called hoisting with temporal dead zone. For example, any variable can be accessed by the function which is declared before variable but is called after. So only the order of execution matters.
