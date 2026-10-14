---
sidebar_position: 2
description:
  What fastlane automates for iOS and Android releases, lanes, match, fastlane
  vs EAS
---

# Fastlane

**fastlane** is an open-source Ruby tool that automates building, signing,
testing and releasing native apps. Steps are **actions** (`build_app`,
`upload_to_testflight`, `match`), grouped into **lanes** in a `Fastfile`, and
run the same way on a laptop and in CI. In React Native it is used for bare
projects; Expo projects usually rely on **EAS Build** and **EAS Submit**
instead.

## Details

### What It Automates

| Task              | Actions                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| iOS code signing  | `match`: certificates and profiles in a private encrypted git repo or cloud storage, shared by the team and CI |
| Build             | `build_app` (gym) for iOS, `gradle` for Android                                                                |
| Versioning        | `increment_build_number`, `increment_version_code` (plugin)                                                    |
| Beta distribution | `upload_to_testflight`, `upload_to_play_store(track: 'internal')`, Firebase App Distribution (plugin)          |
| Store release     | `upload_to_app_store` (deliver), `upload_to_play_store` (supply), metadata and release notes                   |
| Screenshots       | `capture_screenshots` (snapshot) across devices and languages                                                  |

### Fastlane vs EAS

|         | fastlane                                    | EAS Build / Submit                        |
| ------- | ------------------------------------------- | ----------------------------------------- |
| Runs on | Your machines or CI (iOS builds need macOS) | Expo's cloud, or locally with `--local`   |
| Signing | `match` or manual                           | Credentials managed by EAS                |
| Fits    | Any native project, full control            | Expo projects; paid tiers for more builds |

## Example

```ruby
lane :beta_ios do
  match(type: "appstore")           # Fetch the certificate and profile
  increment_build_number
  build_app(scheme: "MyApp")        # Build the .ipa
  upload_to_testflight
end

lane :beta_android do
  gradle(task: "clean bundleRelease", project_dir: "android")
  upload_to_play_store(track: "internal", aab: "android/app/build/outputs/bundle/release/app-release.aab")
end
```

## See Also

- [Publishing and Distribution](./distribution.md)
- [CI/CD](../../tooling/ci-cd.md)
