---
sidebar_position: 11
---

# Publishing and Distribution

Publishing and distributing React Native apps involves several steps and
requires meeting the guidelines of both the Apple App Store and Google Play
Store. Here’s an explanation of the key aspects you mentioned.

| Aspect                 | iOS                                             | Android                                        |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Developer Account Cost | $99/year                                        | $25 (one-time fee)                             |
| Signing                | Requires provisioning profiles and certificates | Requires a keystore for signing                |
| Review Time            | Longer 1–7 days (review required), stricter     | Shorter, more automated (A few hours to 1 day) |
| Distribution Options   | App Store, Ad-Hoc, Enterprise                   | Google Play, APK sharing                       |
| Submission Tool        | Xcode or Transporter                            | Google Play Console                            |
| Staged Rollout         | Not officially supported                        | Supported                                      |
| Pricing & Availability | Configured in App Store Connect                 | Configured in Play Console                     |
| App File Type          | .ipa                                            | .apk or .aab                                   |

## Apple Store Distribution

1. Create an App Store entry in App Store Connect. Set up app metadata
   (description, screenshots, categories, etc.).

2. Switch to the Release scheme (Product → Scheme → Edit Scheme, set
   Configuration to Release), then:
   - Archive the app (Product → Archive) for distribution.
   - Press Distribute App (Product → Distribute App).
   - Select App Store Connect.
   - Sign it with the appropriate provisioning profile and distribution
     certificate.

:::info

Xcode includes an app validation step when you archive your app for
distribution. It checks:

- Provisioning profiles and certificates.
- App Store guidelines compliance.
- Missing or invalid settings in the app’s metadata.

:::

3. Upload the app binary. Now you can find it in the App Store Connect under
   TestFlight.

4. Apple manually reviews the app to ensure compliance with guidelines. Approval
   typically takes a few days, though it may vary.

5. Once approved, publish the app or schedule a release date.

### Provisioning Profile and Distribution Certificate

- When building an app, you sign it using a certificate.
- Then, you associate that signed app with a provisioning profile.

**Provisioning Profiles** are Apple-specific and are a key component of Apple’s
app development and distribution process. They are required to run apps on
physical devices (for testing) and to distribute apps via the App Store or
TestFlight.

Types of provisioning profiles:

| Type        | Purpose                                      | Includes Device UDIDs? |
| ----------- | -------------------------------------------- | ---------------------- |
| Development | Run and debug apps on real devices via Xcode | Yes                    |
| Ad Hoc      | Distribute to testers outside the App Store  | Yes (max 100 devices)  |
| App Store   | Submit app to App Store                      | No (open to public)    |
| Enterprise  | Internal distribution within an organisation | No                     |

:::info Do Android Apps Have an Equivalent?

Not directly. Android apps don’t use provisioning profiles, but they do require:

- keystore: A digital file that holds the key used to sign your app.
- Proper permissions and target API levels to ensure compatibility with devices.

Android’s distribution process is more open and less restrictive compared to
Apple’s, making provisioning profiles unnecessary in the Android ecosystem.

:::

**The distribution certificate** proves to Apple and devices that the app was
created by a trusted developer.

- Created in the Apple Developer Portal or via Xcode.
- Identifies the developer or organization that published the app.
- Ensures that the app has not been tampered with after being signed.
- Is required to build and sign the app for distribution.

You can only have two active iOS Distribution Certificates at once (per team).

Types:

- Development Certificate: For testing apps on real devices.
- Distribution Certificate: For distributing apps either to the App Store or via
  Ad Hoc/Enterprise channels.

When creating a build for distribution (App Store or Enterprise), the app must
be signed using the Distribution Certificate associated with your Apple
Developer Account.

## Google Play Distribution

1. In Google Play Console, create your app entry and configure app details
   (name, description, graphics, etc.).

2. Android requires signing with a release key. Generate one with `keytool`

   ```sh
   keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
   ```

   - `keystore`: A file that holds the key used to sign your app.
   - `alias`: A unique identifier for the key.
   - `keyalg`: The algorithm used to generate the key (RSA).
   - `keysize`: The size of the key (2048 bits).
   - `validity`: The duration for which the key is valid (10000 days, ~27
     years).

   This creates my-upload-key.keystore (valid ~27 years). Keep the keystore and
   passwords safe. Place the `.keystore` in `android/app/` and reference it in
   ~/.gradle/gradle.properties to avoid committing.

   ```properties
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=alias_name
   MYAPP_RELEASE_STORE_PASSWORD=your_store_password
   MYAPP_RELEASE_KEY_PASSWORD=your_key_password
   ```

3. Generate a Signed App Bundle. Use tools like Android Studio to build a signed
   release **APK** (not recommended) or **AAB** (Android App Bundle, preferred).

4. Upload signed build to Play Console. Fill in release notes etc.

   :::info

   Play Console performs checks during the APK or AAB upload process. This
   includes verifying target API levels, permissions, and adherence to Android
   Developer Guidelines.

   :::

5. Once approved, publish your app or roll out in phases (via staged rollout).

## Tools for Simplifying Distribution:

1. **Expo:** If using Expo Managed Workflow, you can use expo build and eas
   submit for app creation and submission.
2. **Fastlane:** Automate the app building, signing, and submission process for
   both platforms.
