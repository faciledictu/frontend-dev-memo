---
sidebar_position: 10
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

### 1. Prepare for Submission:

- Create an App Store entry in App Store Connect.
- Set up app metadata (description, screenshots, categories, etc.).

### 2. Build the App:

- Use Xcode to archive the app for distribution.
- Sign it with the appropriate provisioning profile and distribution
  certificate.

  :::info

  Xcode includes an app validation step when you archive your app for
  distribution. It checks:

  - Provisioning profiles and certificates.
  - App Store guidelines compliance.
  - Missing or invalid settings in the app’s metadata.

    :::

### 3. Submit via Xcode/Transporter:

- Upload the app binary to App Store Connect.
- Pass Apple’s automated checks.

### 4. Review Process:

- Apple manually reviews the app to ensure compliance with guidelines.
- Approval typically takes a few days, though it may vary.

### 5. Go Live:

- Once approved, publish the app or schedule a release date.

### Provisioning Profile

Provisioning Profiles are Apple-specific and are a key component of Apple’s app
development and distribution process. They are required to run apps on physical
devices (for testing) and to distribute apps via the App Store or TestFlight.

- **App ID:** Unique identifier for your app.
- **Devices (for development):** A list of devices where the app can be
  installed (only for development profiles).
- **Certificates:** A file that proves your app was signed by you.

There are different types of provisioning profiles:

- **Development Profile**: Used for testing on physical devices during
  development.
- **Ad-Hoc Profile**: Allows testing on specified devices before release.
- **Distribution Profile**: Required for submitting apps to the App Store.

:::tip Do Android Apps Have an Equivalent?

Not directly. Android apps don’t use provisioning profiles, but they do require:

- keystore: A digital file that holds the key used to sign your app.
- Proper permissions and target API levels to ensure compatibility with devices.

Android’s distribution process is more open and less restrictive compared to
Apple’s, making provisioning profiles unnecessary in the Android ecosystem.

:::

### Distribution Certificate

The distribution certificate proves the app was developed by an authorized Apple
developer. This certificate:

- Identifies the developer or organization that published the app.
- Ensures that the app has not been tampered with after being signed.
- Is required to build and sign the app for distribution.

When creating a build for distribution (App Store or Enterprise), the app must
be signed using the Distribution Certificate associated with your Apple
Developer Account.

## Google Play Distribution

### 1. Prepare Your Google **Play Console**:

- Create an app entry in the Play Console.
- Configure app details (name, description, graphics, etc.).

### 2. Generate a Signed App Bundle:

- Use tools like Android Studio to build a release **APK** or **AAB** (Android
  App Bundle).
- Sign it with your keystore (digital signature unique to your app).

### 3. Upload to Play Console:

- Upload the signed APK or AAB.
- Set app details, such as pricing, target devices, and release notes.

:::info

Play Console performs checks during the APK or AAB upload process. This includes
verifying target API levels, permissions, and adherence to Android Developer
Guidelines.

:::

### 4. Release:

- Once approved, publish your app or roll out in phases (via staged rollout).

## Tools for Simplifying Distribution:

1. **Expo:** If using Expo Managed Workflow, you can use expo build and eas
   submit for app creation and submission.
2. **Fastlane:** Automate the app building, signing, and submission process for
   both platforms.
