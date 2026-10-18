---
sidebar_position: 10
description:
  Props, children, events, hooks, context, wrapping native elements and ref as a
  prop in React 19
tags: [junior, middle]
---

# Typing React

- **Props** are typed with a `type` or an `interface` on the props parameter.
  `children` is **`ReactNode`**. A plain function is the usual form; `React.FC`
  works but adds nothing.
- **Hooks** infer types from the initial value; a type argument is needed when
  the initial value is narrower than the state: `useState<User | null>(null)`.
- **Events** have their own types: `ChangeEvent<HTMLInputElement>`,
  `MouseEvent<HTMLButtonElement>`. Inline handlers get them inferred.
- **`ComponentProps<'button'>`** gives all props of a native element, for
  wrapper components. In React 19 **`ref` is a regular prop**, so `forwardRef`
  is no longer needed.

Applies to: React 19.3, `@types/react` 19.3, TypeScript 7.0.

## Details

### Props and Children

| What                      | Type                            |
| ------------------------- | ------------------------------- |
| anything React can render | `ReactNode`                     |
| exactly one element       | `ReactElement`                  |
| a component as a prop     | `ComponentType<Props>`          |
| a render prop             | `(item: T) => ReactNode`        |
| inline styles             | `CSSProperties`                 |
| props of a native element | `ComponentProps<'input'>`       |
| props of a component      | `ComponentProps<typeof Button>` |
| props plus `children`     | `PropsWithChildren<Props>`      |

- The return type of a component is usually inferred. If written, it is
  `ReactNode`: since TypeScript 5.1 a component may return a string or an array,
  not only an element or `null`. `React.JSX.Element` is narrower.
- The global `JSX` namespace is gone in `@types/react` 19: write `React.JSX`.
- `React.FC<Props>` does not add `children` since `@types/react` 18 and can't
  declare a generic component. Most code uses a plain function with typed props.
- Optional props with defaults are set in destructuring:
  `{ size = 'm' }: { size?: Size }`. See [Props](../react/basics/props.md).
- Props that depend on each other, such as `variant: 'link'` requiring `href`,
  are a [discriminated union](./narrowing.md#discriminated-unions).

### Events

| Event                     | Type                                             |
| ------------------------- | ------------------------------------------------ |
| `onChange` of an input    | `ChangeEvent<HTMLInputElement>`                  |
| `onClick`                 | `MouseEvent<HTMLButtonElement>`                  |
| `onKeyDown`               | `KeyboardEvent<HTMLInputElement>`                |
| `onSubmit` of a form      | `SubmitEvent<HTMLFormElement>`                   |
| `onInput`                 | `InputEvent<HTMLInputElement>`                   |
| `onFocus`, `onBlur`       | `FocusEvent<HTMLInputElement>`                   |
| a handler type for a prop | `ChangeEventHandler<HTMLInputElement>` and so on |

- These are React's synthetic events, imported from `react`, not the DOM
  `MouseEvent`.
- `FormEvent` is deprecated (since `@types/react` 19.2.10): use `SubmitEvent`,
  `ChangeEvent` or `InputEvent` for what the event really is.
- `e.currentTarget` is the element the handler is attached to and has its type.
  `e.target` may be a nested element; it is typed precisely only for change
  events of form fields.

### Hooks

- **`useState`**: `useState(0)` is `number`. An empty array is inferred as
  `never[]` and `null` as `null`, so write the type: `useState<string[]>([])`,
  `useState<User | null>(null)`.
- **`useRef`**: for a DOM element, `useRef<HTMLInputElement>(null)`; for a
  mutable value, `useRef<number | null>(null)`. In React 19 the argument is
  required and `current` is always writable (`MutableRefObject` is deprecated).
- **`useReducer`**: type the reducer function and its actions as a discriminated
  union, then let the hook infer the rest. Passing type arguments
  (`useReducer<State, Action>`) does not compile in React 19 types: the second
  parameter is now the tuple of action arguments.
- **Custom hooks** that return a tuple need `as const`, otherwise the result is
  an array of a union: `return [value, setValue] as const`.
- **Context**: `createContext<Value | null>(null)` and a custom hook that throws
  when the value is `null`, so consumers get `Value` without checks.

### Wrapping Native Elements

- Extend `ComponentProps<'button'>` to accept every native attribute, including
  `aria-*`, `disabled` and `ref`.
- `ComponentPropsWithoutRef<'button'>` excludes `ref`, for components that must
  not accept one.
- Generic components (a `List<T>` or a `Select<T>`) are described in
  [Generics](./generics.md#example).

## Example

```tsx
import {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from 'react';

// A wrapper around a native element; ref is a regular prop in React 19
// highlight-next-line
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
};

function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={`${variant} ${className ?? ''}`} {...props} />;
}

// Children and events
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      {label} {children}
    </label>
  );
}

function NameForm() {
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // highlight-next-line
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // e: SubmitEvent<HTMLFormElement>, inferred
        setTags([...tags, name]);
        inputRef.current?.focus();
      }}
    >
      <Field label="Name">
        <input ref={inputRef} value={name} onChange={handleChange} />
      </Field>
      <Button type="submit">Add</Button>
    </form>
  );
}
```

<details>
<summary>useReducer and context</summary>

```tsx
import { createContext, use, useReducer, type ReactNode } from 'react';

type State = { count: number };
type Action = { type: 'increment' } | { type: 'set'; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'set':
      return { count: action.value }; // narrowed: value exists here
  }
}

type CounterContextValue = {
  state: State;
  dispatch: (action: Action) => void;
};

// highlight-next-line
const CounterContext = createContext<CounterContextValue | null>(null);

function useCounter() {
  // highlight-start
  const value = use(CounterContext);
  if (!value) throw new Error('useCounter must be used inside CounterProvider');
  // highlight-end
  return value; // CounterContextValue, no null
}

function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 }); // inferred
  return (
    <CounterContext value={{ state, dispatch }}>{children}</CounterContext>
  );
}

function Counter() {
  const { state, dispatch } = useCounter();
  // error-next-line
  dispatch({ type: 'set' }); // Error: Argument of type '{ type: "set"; }' is not assignable to parameter of type 'Action'.
  return (
    <button onClick={() => dispatch({ type: 'increment' })}>
      {state.count}
    </button>
  );
}
```

</details>

## Follow-up Questions

- `React.FC` or a plain function? A plain function: it supports generics, and
  `FC` gives nothing extra since it stopped adding `children`.
- How do you type a component that accepts every prop of `<input>`?
  `ComponentProps<'input'>`, extended with an intersection or `Omit` for props
  that change meaning.
- How do you get the props type of a third-party component that does not export
  it? `ComponentProps<typeof Component>`.
- Why does `useState([])` cause errors later? It is inferred as `never[]`, so
  nothing can be added.
- Why is `forwardRef` not needed anymore? In React 19 function components get
  `ref` as a regular prop.

## Common Mistakes

- `children: React.JSX.Element` instead of `ReactNode`: strings, numbers and
  arrays are rejected.
- Importing `MouseEvent` from the DOM types instead of `react`.
- Typing context as `createContext<Value>({} as Value)`: a missing provider is
  then a runtime error that the compiler can't see.
- Writing the event type by hand everywhere instead of letting inline handlers
  infer it.
- `useRef<HTMLDivElement>()` without `null`: it does not compile in React 19
  types.

## See Also

- [Props](../react/basics/props.md)
- [Refs](../react/hooks/refs.md)
- [Generics](./generics.md)
- [Type Narrowing](./narrowing.md)
