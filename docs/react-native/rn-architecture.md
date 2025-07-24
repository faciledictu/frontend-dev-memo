---
sidebar_position: 15
---

# Bridge vs. Bridgeless Architecture

## Classic Bridge Architecture (Legacy)

In the legacy architecture, JavaScript communicates with native modules via an
asynchronous bridge. JS calls and UI updates are serialized to JSON and sent
over a queue to native threads. This design kept the JS thread and UI thread
unblocked but at a cost.

Under the bridge model, layout calculations and native UI updates ran on a
single main thread. This meant updates (e.g. layout or user input) could not be
handled concurrently or synchronously, limiting responsiveness. The bridge’s
asynchrony could also lead to “sync issues” (e.g. UI flashes) when JS and native
states got out of sync

**How It Works**

- JS and Native code run in separate threads.
- Communication happens via an asynchronous, batched bridge using
  JSON-serializable messages.
- Native Modules are registered and accessed through this bridge.
- Rendering is also scheduled over the bridge.

**Limitations**

- Serialization overhead: All data crossing the bridge must be serialized.
- Thread hopping: Cost of context-switching between JS and native threads.
- Debugging complexity: Poor stack traces across boundaries.
- Limited performance for animations, gestures, and high-frequency updates.

## New Bridgeless Architecture

React Native’s New Architecture removes the bridge entirely, using a C++
JavaScript Interface (JSI) layer and new module/component systems. This enables
direct, synchronous JS↔native calls, type-safe interfaces, and concurrent
rendering. The main components are:

**What Changed**

- Introduced via the JSI (JavaScript Interface) and Fabric for UI and
  TurboModules for native modules.
- Enables direct, synchronous access between JS and C++/native code—no JSON, no
  bridge.

**Key Components**

- JSI

  A lightweight C++ API that embeds the JS engine (Hermes, V8, etc.) into native
  code. Native modules expose C++ objects and functions directly to JS as “host
  objects,” eliminating JSON serialization allowing JS to call C++/native
  functions directly.

- TurboModules

  TurboModules use JSI under the hood to register native functions as C++ host
  objects. They offer:

  - Synchronous Calls. TurboModules can return values immediately (no callbacks
    needed).
  - Type Safety. Module interfaces are defined in TypeScript/Flow. A build-time
    Codegen step auto-generates native binding code (for both Android and iOS).
  - Lazy Loading. Modules are initialized on demand, not at startup.
  - Cross-Platform C++ Core. Modules can be implemented in cross-platform C++
    using the same interface.

- Fabric Renderer

  Next-gen rendering system for React Native; replaces UIManager. Enables
  faster, batched, and more reliable UI updates, with better support for modern
  React features (like useLayoutEffect and transitions)

  - Synchronous Updates. Fabric uses JSI to synchronously send UI changes from
    JS to the native view managers
  - Concurrent Rendering. It integrates React 18’s concurrent capabilities:
    multiple render passes can work in parallel

- Codegen

  Auto-generates type-safe bindings between JS and native code. Practically, you
  define a module spec in TS, and Codegen produces the native interface stubs
  for Android and iOS

**Benefits**

- Significantly lower latency for high-frequency operations (e.g., animations).
- Reduced memory usage and startup time (lazy loading).
- Seamless synchronous execution—critical for UI/UX responsiveness.

:::info Threading Model

Legacy React Native had three threads: JS thread (running JS code), main/UI
thread (native UI), and a native bridge thread (processing queued calls).

The new model removes the bridge thread. Instead, JS still runs on a JS runtime
thread (often still called “JS thread”), but Fabric introduces separate UI
management threads. Layout and view hierarchies can be computed on background
threads while the UI thread commits final updates. This means multiple threads
can handle work simultaneously. For example, React 18’s scheduler can slice work
on the JS side while background layout threads prepare UI.

:::
