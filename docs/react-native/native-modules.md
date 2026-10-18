---
sidebar_position: 12
description:
  Turbo Native Modules, Expo Modules API and Nitro Modules, Codegen spec, sync
  vs async methods, events, Fabric Native Components, config plugins
tags: [senior]
---

# Native Modules

A **native module** exposes platform code (Swift, Kotlin, Objective-C++, C++) to
JS as a typed object. You write one when no library covers an SDK or platform
API. There are three ways, all on top of JSI: a **Turbo Native Module** (core
React Native, typed by a **Codegen** spec), the **Expo Modules API** (a Swift
and Kotlin DSL, the default in Expo apps) and **Nitro Modules** (generated
bindings, the lowest call overhead). Methods are **async** (return a promise)
unless they are cheap reads: a sync method blocks the JS thread.

Applies to: React Native 0.88, Expo SDK 58, Nitro Modules 0.37.

## Details

### When You Need One

- A vendor SDK has no React Native wrapper: a payment terminal, an analytics or
  video SDK.
- A platform API is not covered by Expo or a community library (check
  [React Native Directory](https://reactnative.directory) first).
- Heavy work belongs in native or shared C++: image processing, crypto, parsing.
- A native view is needed (a map, a chart, a camera preview): that is a native
  **component**, not a module; see below.

### Three Ways

|             | Turbo Native Module                                            | Expo Modules API                                                  | Nitro Modules                                                 |
| ----------- | -------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Native code | Kotlin / Java; Objective-C++ on iOS (Swift via a wrapper); C++ | Swift and Kotlin                                                  | Swift, Kotlin, C++                                            |
| Types       | Codegen from a TS / Flow spec at build time                    | Written by hand in TS; arguments converted and checked at runtime | Nitrogen generates bindings from a TS spec                    |
| Views       | Fabric Native Component                                        | `View` in the same module                                         | Hybrid Views                                                  |
| Extra       | Nothing: part of React Native                                  | Lifecycle hooks, config plugins; needs the `expo` package         | `react-native-nitro-modules`; native objects passed as values |
| Fits        | Libraries for any app, no dependencies                         | App-specific modules and libraries for Expo apps                  | Performance-critical libraries with frequent calls (MMKV 4)   |

The architecture behind them (JSI, bridgeless, Codegen) is on
[Architecture](./rn-architecture.md).

### Turbo Native Module Step by Step

1. **Spec**: `specs/NativeDeviceInfo.ts`; the `Native` prefix is required. An
   interface extends `TurboModule`, and the default export is
   `TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceInfo')` (throws if the
   module is missing; `get` returns `null`).
2. **`codegenConfig`** in `package.json`: `name`, `type: "modules"`,
   `jsSrcsDir`, `android.javaPackageName`, `ios.modulesProvider` (JS name → iOS
   class).
3. **Codegen** runs during the Gradle build and `pod install` and generates an
   abstract class (Android) and a protocol (iOS) from the spec.
4. **Android**: a Kotlin class extends the generated `NativeDeviceInfoSpec`; a
   `BaseReactPackage` returns it; an app adds the package in `getPackages()`, a
   library is autolinked.
5. **iOS**: an Objective-C++ (`.mm`) class conforms to the generated protocol
   and returns its JSI wrapper from `getTurboModule:`.
6. **JS** imports the spec file and calls the methods.

### Sync vs Async

- The spec decides: `getModel(): string` is synchronous,
  `getBatteryLevel(): Promise<number>` is async. In Expo it is `Function` vs
  `AsyncFunction`.
- A sync call runs on the JS thread and blocks it until native code returns: a
  slow one freezes the UI and touches. Keep sync for cheap reads: constants, a
  value from memory (MMKV).
- Disk, network, permissions, dialogs, anything on the main thread → async.
- An async method runs off the JS thread but also off the UI thread: on the
  module's queue on iOS, on a native-modules thread on Android (Expo's
  `AsyncFunction` on a background queue). UIKit and Android views need a hop to
  the main thread: `runOnQueue(.main)` in Expo, `dispatch_async` to the main
  queue in `.mm`, `UiThreadUtil.runOnUiThread` in Kotlin.
- What crosses the boundary: primitives, plain objects and arrays, promises,
  callbacks, `ArrayBuffer`; not class instances (Nitro's hybrid objects are the
  exception).

### Events to JS

- Turbo Module: `readonly onBatteryLow: CodegenTypes.EventEmitter<Payload>` in
  the spec; native code calls the generated `emitOnBatteryLow(…)`; JS calls
  `Module.onBatteryLow(cb)` and gets a subscription to `remove()`.
- Expo Modules: `Events("onBatteryLow")` and `sendEvent(…)` in native code;
  `addListener` or the `useEvent` hook in JS.
- `NativeEventEmitter` with `RCTEventEmitter` is the older pattern, still seen
  in existing libraries.

### Fabric Native Component

- For a native view: the spec is `specs/MapNativeComponent.ts` with
  `codegenNativeComponent<NativeProps>('MapView')`; props extend `ViewProps`,
  events are `CodegenTypes.BubblingEventHandler` / `DirectEventHandler`.
- `codegenConfig.type` is `"components"` (or `"all"`); Android implements a
  `ViewManager` with the generated interface, iOS a subclass of
  `RCTViewComponentView` in Objective-C++.
- In Expo Modules the same is `View(MapView::class) { Prop("zoom") { … } }`.

### Native Setup in Expo

A module often needs native config: `Info.plist` keys, Android permissions,
Gradle dependencies. In an Expo app it ships a **config plugin**
(`withInfoPlist`, `withAndroidManifest` from `expo/config-plugins`) that applies
the changes on `npx expo prebuild`, so `ios/` and `android/` stay generated. A
module for one app is created with `npx create-expo-module --local`.

## Example

```ts title="specs/NativeDeviceInfo.ts"
import type { CodegenTypes, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type BatteryEvent = { level: number };

export interface Spec extends TurboModule {
  getModel(): string; // sync: a constant
  // highlight-next-line
  getBatteryLevel(): Promise<number>; // async: asks the system
  readonly onBatteryLow: CodegenTypes.EventEmitter<BatteryEvent>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceInfo');
```

```tsx title="BatteryBadge.tsx"
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import DeviceInfo from './specs/NativeDeviceInfo';

export function BatteryBadge() {
  const [level, setLevel] = useState<number | null>(null);

  useEffect(() => {
    DeviceInfo.getBatteryLevel().then(setLevel);
    const sub = DeviceInfo.onBatteryLow((e) => setLevel(e.level));
    return () => sub.remove();
  }, []);

  return (
    <Text>
      {DeviceInfo.getModel()}: {level ?? '…'}%
    </Text>
  );
}
```

<details>
<summary>The same module with the Expo Modules API</summary>

```swift title="ios/DeviceInfoModule.swift"
import ExpoModulesCore
import UIKit

public class DeviceInfoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DeviceInfo")
    Events("onBatteryLow")

    Function("getModel") { UIDevice.current.model } // "iPhone", "iPad"

    AsyncFunction("getBatteryLevel") { () -> Float in
      UIDevice.current.isBatteryMonitoringEnabled = true
      return UIDevice.current.batteryLevel * 100
    }.runOnQueue(.main)
  }
}
```

```kotlin title="android/.../DeviceInfoModule.kt"
import android.content.Context
import android.os.BatteryManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DeviceInfoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DeviceInfo")
    Events("onBatteryLow")

    Function("getModel") { Build.MODEL }

    AsyncFunction("getBatteryLevel") {
      val manager = appContext.reactContext!!
        .getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }
  }
}
```

```ts title="index.ts"
import { NativeModule, requireNativeModule } from 'expo';

type Events = { onBatteryLow: (event: { level: number }) => void };

// Declared by hand: nothing checks these types against Swift and Kotlin
declare class DeviceInfoModule extends NativeModule<Events> {
  getModel(): string;
  getBatteryLevel(): Promise<number>;
}

export default requireNativeModule<DeviceInfoModule>('DeviceInfo');
```

</details>

## Follow-up Questions

- Turbo Module, Expo Module or Nitro? In an Expo app, Expo Modules (Swift and
  Kotlin, lifecycle hooks, config plugins); they also work in a bare app with
  the `expo` package installed. For a library with no dependencies, Turbo. For a
  hot path with many calls or native objects passed around, Nitro.
- Why must the spec be typed? Codegen generates the native interfaces from it,
  so a mismatch between JS and native signatures fails at build time, not at
  runtime.
- Do old (bridge) modules still work? Yes, through the interop layer, but new
  code should be a Turbo or Expo module; see
  [Architecture](./rn-architecture.md).
- How do you pass binary data? An `ArrayBuffer` instead of a base64 string:
  Nitro supports it, and since 0.88 Java Turbo Modules too.
- Why does a module work in a development build but not in Expo Go? Expo Go
  contains only its own native modules; any custom native code needs a
  development build.
- How do you test code that uses a native module? Mock the module in Jest with a
  factory (`jest.mock('./specs/NativeDeviceInfo', () => ({ … }))`): without one
  Jest loads the real spec, and `getEnforcing` throws; the native side is tested
  with XCTest and JUnit or end-to-end.

## Common Mistakes

- Making every method synchronous "because JSI allows it": a slow call freezes
  the UI.
- Calling UIKit off the main thread in an async method (`runOnQueue(.main)` in
  Expo, `dispatch_async` to the main queue in Objective-C++).
- A spec file without the `Native` prefix: Codegen skips it.
- Editing `ios/` and `android/` by hand in an Expo (CNG) project: the next
  prebuild overwrites it; use a config plugin.
- Forgetting to remove event subscriptions.

## See Also

- [Architecture](./rn-architecture.md)
- [Platform-Specific Code](./platform-specific-code.md)
- [Turbo Native Modules (reactnative.dev)](https://reactnative.dev/docs/turbo-native-modules-introduction)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [Nitro Modules](https://nitro.margelo.com/)
