---
sidebar_position: 2
description:
  Legacy bridge vs New Architecture (JSI, Fabric, TurboModules, Codegen),
  threads, rendering pipeline, native libraries and autolinking
---

# React Native Architecture: Bridge vs New Architecture

In the **legacy architecture** JS talked to native code through the **bridge**:
an asynchronous queue of batched JSON messages. The **New Architecture**
replaces it with **JSI**, a C++ interface that lets JS hold references to native
objects and call them directly, synchronously if needed. On top of JSI are
**Fabric** (the renderer), **TurboModules** (native modules) and **Codegen**
(typed bindings generated from a TS spec). The New Architecture is the default
since 0.76, and since 0.82 it is the only one: the legacy architecture cannot be
turned on.

Applies to: React Native 0.87.

## Details

### Legacy Bridge

Threads:

- **JS thread**: runs React and the app's JS.
- **Main (UI) thread**: native views and touch events.
- **Shadow thread**: computes layout with Yoga (the Flexbox engine).
- Native modules ran on their own background queues.

How it worked and what was wrong with it:

- Every call and every UI update was serialized to JSON, batched and sent across
  the bridge **asynchronously**; nothing could return a value right away.
- Serialization cost grew with traffic: long lists, animations and gestures that
  depended on JS lagged.
- JS and native state could get out of sync, which showed as UI flashes, for
  example when measuring a view before positioning another one.
- All native modules were initialized at startup, even unused ones.

### New Architecture

| Part         | What it is                                                                                        | What it gives                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| JSI          | A C++ API between the JS engine and native code; native objects are exposed to JS as host objects | No JSON, no queue; synchronous calls are possible                                   |
| TurboModules | Native modules built on JSI                                                                       | Loaded lazily on first use; can return values synchronously; can be written in C++  |
| Fabric       | The renderer; its shadow tree is in C++ and shared by both platforms                              | Synchronous layout and measuring, React concurrent features (transitions, Suspense) |
| Codegen      | Generates native interfaces from a TypeScript or Flow spec at build time                          | Type-safe JS ↔ native boundary                                                      |
| Bridgeless   | The mode in which the bridge is not created at all                                                | Default since 0.74 with the New Architecture                                        |

**Hermes** is the default JS engine. It compiles JS to bytecode at build time,
so the app starts faster and uses less memory than with a JIT engine.

### From `setState` to Pixels (Fabric)

1. **Render** (JS thread): React calls components and reconciles the element
   tree; Fabric builds a C++ **shadow tree** from it.
2. **Commit** (any thread): Yoga computes the layout of the shadow tree, and the
   new tree is promoted as the next one to mount.
3. **Mount** (UI thread): the difference between the old and new trees is
   applied to the real native views.

The render phase can be interrupted by a more urgent update, as with
[concurrent rendering](../react/performance/concurrent-rendering.md) on the web.
Updates triggered from the UI thread (for example a Reanimated animation) can
skip the JS thread.

### Native Libraries and Linking

- **Autolinking** (since 0.60): after installing a package, CocoaPods
  (`pod install`) and Gradle pick up its native code. The old
  `react-native link` command was removed in 0.69.
- A library for the New Architecture is a **Turbo Native Module** (an API
  without UI) or a **Fabric Native Component** (a native view), both described
  by a Codegen spec.
- Libraries written for the old architecture still work through the **interop
  layer**, but new code should not rely on it.
- In Expo apps, native modules are usually written with the **Expo Modules API**
  in Swift and Kotlin, and native config is changed by config plugins instead of
  editing `ios/` and `android/` by hand.

## Follow-up Questions

- Why was the bridge a bottleneck? All traffic was serialized to JSON and
  asynchronous, so frequent updates (scroll, gestures, animations) could not
  keep up, and native code could not answer synchronously.
- Does the New Architecture make JS multithreaded? No. JS still runs on one
  thread; JSI only removes the queue between JS and native code. Libraries like
  Reanimated run small functions (worklets) in a second JS runtime on the UI
  thread.
- What does Codegen generate? Native interfaces (C++, Objective-C, Java) from a
  typed spec, so a mismatch between JS and native signatures fails at build
  time.

## Common Mistakes

- Describing the bridge as the current mechanism. It is gone since 0.82.
- Saying the legacy architecture had one thread for layout and UI. Layout ran on
  a separate shadow thread.
- Saying JSI makes every call synchronous. It makes synchronous calls possible;
  most module methods are still async (return a promise).

## See Also

- [What Is React Native](./overview.md)
- [Reanimated](./animations/reanimated.md)
- [Rendering and Reconciliation in React](../react/basics/rendering.md)
