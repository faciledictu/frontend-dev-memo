---
sidebar_position: 1
description:
  Publishing to the App Store and Google Play, signing, provisioning profiles,
  Play App Signing, test tracks, review and staged rollout
---

# Publishing and Distribution

A release is a **signed** native build uploaded to the store: an `.ipa` to **App
Store Connect** and an `.aab` (Android App Bundle) to the **Google Play
Console**. iOS signs with a **distribution certificate** and a **provisioning
profile**; Android signs with an **upload key** from a keystore, and Google
re-signs the app with the **app signing key** it keeps (Play App Signing).
Builds go to testers first (**TestFlight**, Play **testing tracks**), then to
review and a gradual rollout. An Expo project is released the same way after
`npx expo prebuild` generates `ios/` and `android/`; EAS Build and EAS Submit
can do it in the cloud instead, but they are optional.

## Details

### iOS vs Android

|                   | iOS                                                                                | Android                                                        |
| ----------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Developer account | $99 a year                                                                         | $25 once                                                       |
| Signing           | Certificate + provisioning profile                                                 | Upload key (keystore); Google holds the app signing key        |
| Artifact          | `.ipa`                                                                             | `.aab` (required for new apps on Play); `.apk` for sideloading |
| Testing           | TestFlight: internal (up to 100, no review), external (up to 10,000, light review) | Internal, closed and open testing tracks                       |
| Review            | Manual; most apps within a day or two                                              | Mostly automated; hours to a few days                          |
| Gradual rollout   | Phased release over 7 days, can be paused                                          | Staged rollout by percentage, can be halted                    |
| Upload            | Xcode, Transporter, `eas submit`, fastlane                                         | Play Console, `eas submit`, fastlane                           |

New personal Google Play accounts must run a closed test with at least 12
testers for 14 days before the first production release.

### iOS Signing

- **Certificate**: proves who built the app. A development certificate for
  running on devices, a distribution certificate for TestFlight and the App
  Store.
- **Provisioning profile**: ties the app ID, the certificate and (for
  development and ad hoc) the list of allowed devices.

| Profile     | Purpose                                       | Device list                           |
| ----------- | --------------------------------------------- | ------------------------------------- |
| Development | Debug on registered devices                   | Yes                                   |
| Ad Hoc      | Install on registered test devices            | Yes, up to 100 per device type a year |
| App Store   | TestFlight and the App Store                  | No                                    |
| Enterprise  | In-house apps of a company, outside the store | No                                    |

Android has no provisioning profiles: a signed APK can be installed outside the
store if the user allows it. Since September 2026 in some countries (globally in
2027), the developer must also be verified by Google, or the user has to install
through adb or an extra confirmation flow.

### Android Signing and Play App Signing

- You generate an **upload key** and sign builds with it.
- Google Play strips it and signs the delivered APKs with the **app signing
  key**, which only Google holds.
- A lost upload key can be reset through Play Console support. Before Play App
  Signing, a lost key meant the app could never be updated.

## Example

<details>
<summary>iOS release with Xcode</summary>

1. Create the app in App Store Connect: bundle ID, name, metadata, screenshots.
2. In Xcode, select the Release configuration and a generic device, then
   **Product → Archive**.
3. In the Organizer, **Distribute App → App Store Connect**. Xcode validates
   signing and settings and uploads the build.
4. The build appears in TestFlight after processing; add testers.
5. Attach the build to a version, submit it for review, then release it
   manually, automatically or with a phased release.

</details>

<details>
<summary>Android release with Gradle</summary>

1. Generate the upload key:

   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Put the keystore in `android/app/` and the passwords in
   `~/.gradle/gradle.properties` (not in the repository), and reference them in
   `signingConfigs.release` of `android/app/build.gradle`:

   ```properties
   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=*****
   MYAPP_UPLOAD_KEY_PASSWORD=*****
   ```

3. Build the bundle: `cd android && ./gradlew bundleRelease`. The result is
   `android/app/build/outputs/bundle/release/app-release.aab`.
4. Upload it to a testing track in Play Console, then promote it to production
   with a staged rollout.

</details>

## Follow-up Questions

- How do you fix a JS bug without a store release? With an OTA update. See
  [OTA Updates](./ota.md).
- How do you automate releases? EAS Build and Submit, or fastlane. See
  [Fastlane](./fastlane.md).

## See Also

- [Fastlane](./fastlane.md)
- [Environment Configuration and Secrets](./env.md)
- [OTA Updates](./ota.md)
