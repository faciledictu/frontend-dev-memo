---
sidebar_position: 2
---

# Environment Configuration and Secrets

Use .env files and libraries. React Native does not natively support
`process.env` (except `NODE_ENV`), so use a special library to inject
environment-specific values

- `react-native-config` (for use env variables in JS and native code)
- `react-native-dotenv` (for only use env variables in JS).

For example, create `.env.dev` and `.env.prod` files with API endpoints, feature
flags, etc., and load them in code.

You can access variables in JS via import `Config` from `react-native-config`
and also in native code via `BuildConfig` on Android or `Info.plist` on iOS.

## Examples

**In Javascript code**

```javascript
import Config from 'react-native-config';

console.log(Config.API_URL);
```

**In native code**

```java
public HttpURLConnection getApiUrl(){
    URL url = new URL(BuildConfig.API_URL);
    // ...
}
```

```gradle
defaultConfig {
    apiURL project.env.get("API_URL")
    versionCode project.env.get("VERSION_CODE").toInteger()
}
```

```objective-c
// import header
#import "RNCConfig.h"

// then read individual keys like:
NSString *apiUrl = [RNCConfig envFor:@"API_URL"];

// or just fetch the whole config
NSDictionary *config = [RNCConfig env];
```

## Secrets

Sensitive keys (API secrets, certificates) should not be hardcoded or checked
into Git.

Instead, store secrets in secure places. Common practices include using CI/CD
variables (so keys are only in your build environment) or a secret manager (e.g.
AWS Secrets Manager). For build-time secrets (like certificate passwords), use
Gradle/Mac Keychain for Android and Xcode build settings for iOS (again from CI
secrets or keychain) to avoid exposing them in source.

:::tip Inject only one config per build.

Avoid bundling multiple environments into one binary. Use separate .env or
configuration files per build target, and configure your build scripts (Fastlane
lanes, EAS build profiles, etc.) to load only the needed variables. This
prevents leaking staging keys or debug endpoints in production releases.

:::
