---
sidebar_position: 3
---

# CI/CD Best Practices

1. **On each commit/PR, run linting and static analysis** (ESLint, TypeScript)
   and **execute your test suite**. Automatically building on merge to main
   ensures no breaking code reaches production. Typical pipelines include steps
   like npm install (or yarn), lint (npm run lint), unit tests (npm test), and
   code quality checks.

2. **Automate builds and signing.** Have your CI produce release APKs/IPAs on
   demand. Many teams use Fastlane for build automation: e.g., lanes like
   build_android_release and build_ios_release, which can invoke Gradle or Xcode
   builds. Sample Fastlane lane loading env vars:

```ruby
lane :build_android_release do |options|
  dotenv(env: "production")
  sh "npm install"
  gradle(task: "clean assembleRelease")   # Android
end

lane :build_ios_release do |options|
  dotenv(env: "production")
  sh "npm install"
  gym(scheme: "MyApp", configuration: "Release")  # iOS
end
```

Popular options include GitHub Actions, or Expo EAS. **GitHub Actions** lets you
define workflows in `.github/workflows/ci.yml`, and can run on every push or
pull request. **Expo EAS Workflows** (especially for Expo apps) provide managed
build servers that handle signing certificates and keystore files automatically.

If you use GitHub Actions, include build artifacts (signed binaries) as pipeline
outputs or uploads to a distribution service.

:::tip Automated Deployment

Configure your pipeline to optionally deploy to beta or production stores. For
example, with Fastlane’s `deliver` (iOS) and `supply` (Android) actions, you can
upload the app bundle to TestFlight/App Store or Google Play Console as part of
the CI process. This closes the loop so that a successful merge can trigger a
nightly or tagged release.

:::
