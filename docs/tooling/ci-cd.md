---
sidebar_position: 3
---

# CI/CD Overview

CI/CD stands for Continuous Integration and Continuous Deployment (or Continuous
Delivery). It's a set of practices and tools designed to improve the speed,
quality, and reliability of software development and delivery. Here's a brief
overview of each component:

## Continuous Integration (CI)

Developers regularly merge their code changes into a shared repository, usually
multiple times a day. Each merge triggers an automated build and testing
process, ensuring that new code changes do not break the existing codebase.

## Continuous Deployment (CD)

Once the code passes all automated tests, it's automatically deployed to a
staging or production environment. This ensures that the latest version of the
application is always ready for release. Continuous Delivery is a slightly
different concept where the deployment to production is manual but can be done
at any time.

## CI/CD for Frontend Applications

For a React application, a CI/CD pipeline can be set up in GitLab to automate
tasks such as linting, testing, building, and deploying the application.

### Key Stages of a Frontend CI/CD Pipeline

1. **Linting.** Ensure code quality and consistency.

2. **Testing.** Run unit tests to verify the functionality of the code.

3. **Building.** Create a production-ready build of the application.

4. **Deploying.** Deploy the build to a staging or production environment.

### Example

Here’s a sample `.gitlab-ci.yml` file to illustrate a basic CI/CD pipeline for a
frontend application.

```yaml
stages:
  - lint
  - test
  - build
  - deploy

# Linting Stage
lint:
  stage: lint
  image: node:14
  script:
    - npm install
    - npm run lint
  only:
    - merge_requests
    - main

# Testing Stage
test:
  stage: test
  image: node:14
  script:
    - npm install
    - npm run test
  only:
    - merge_requests
    - main

# Building Stage
build:
  stage: build
  image: node:14
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - build/
  only:
    - main

# Deploying Stage
deploy:
  stage: deploy
  image: node:14
  script:
    - npm install -g firebase-tools
    - firebase deploy --token "$FIREBASE_DEPLOY_TOKEN"
  only:
    - main
```

## CI/CD for React Native Apps

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

:::tip[Automated Deployment]

Configure your pipeline to optionally deploy to beta or production stores. For
example, with Fastlane’s `deliver` (iOS) and `supply` (Android) actions, you can
upload the app bundle to TestFlight/App Store or Google Play Console as part of
the CI process. This closes the loop so that a successful merge can trigger a
nightly or tagged release.

:::
