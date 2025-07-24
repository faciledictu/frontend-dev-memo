---
sidebar_position: 1
---

# Fastlane

Fastlane is an open-source toolchain that automates building, signing, testing,
and releasing mobile apps — particularly useful for both iOS and Android in
React Native projects.

## What is it used for?

1. Automated Screenshot Generation

   - Capture localized screenshots across all languages and devices your app
     supports.
   - Define the setup once, and anyone on your team can regenerate screenshots
     later.
   - Runs headlessly — great for CI.
   - Perfect for App Store and Play Store submissions with proper localization.

2. Beta Deployment

   - Publish builds to beta testers using TestFlight, Play Store internal track,
     or other services like Firebase App Distribution, HockeyApp, etc.
   - Automates: version bumping, code signing, building the app, uploading
     builds, setting changelogs

3. App Store and Google Play Deployment

   - Fully automate release submissions.
   - Automatically submit new app versions for review.
   - Great for repeatable and reliable deployment workflows.

4. Automatic Code Signing (iOS)

   - Handles provisioning profiles and certificates via match.
   - Stores them securely in a private, encrypted git repo.
   - Ensures every dev on the team can generate signed builds.

5. CI/CD Integration
   - Integrates with CI/CD pipelines (e.g., GitHub Actions, GitLab CI).

## Example: A simple Fastlane setup

```ruby
lane :release_ios do
  match(type: "appstore")           # Fetch provisioning profiles
  increment_build_number            # Bump build number
  build_app(scheme: "MyApp")        # Build the .ipa
  upload_to_testflight              # Send to TestFlight
end
```

```ruby
lane :release_android do
  gradle(task: "clean assembleRelease")
  upload_to_play_store(track: "beta") # Push to Google Play beta track
end
```

:::tip Advantages

- **Repeatable:** Makes the release process predictable across teams.
- **Reliable:** Cuts down on human error in releases.
- **Time-saving:** Automates the boring bits so you can focus on writing
  features.
- **Cross-platform:** Works equally well for iOS and Android in React Native
  projects.
- **Team-friendly:** Easy handoff for builds and distribution between devs and
  QA.

:::
