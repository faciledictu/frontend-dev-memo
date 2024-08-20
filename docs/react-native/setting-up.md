---
sidebar_position: 2
---

# Setting up a React Native environment

## On MacOS

### Basic setup

#### Install Homebrew

Homebrew is a package manager for macOS that simplifies the installation of
software.

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# After installation run
brew update
```

#### Install Node.js and Watchman

Node.js is essential for React Native, and Watchman helps with file watching.

```sh
brew install node
brew install watchman
```

### iOS

#### Install Xcode

For iOS development, you’ll need Xcode. Install it from the Mac App Store.

Set up Xcode Command Line Tools. Open Xcode and go to _Preferences > Locations_,
then select the latest version of Xcode in the Command Line Tools dropdown.

#### Install CocoaPods

CocoaPods is the dependency manager for iOS projects.

```sh
brew install cocoapods
```

#### Installing an iOS Simulator in Xcode

Open `Xcode > Settings > Platforms` tab, then click "+" icon and select `iOS…`
option.

### Android

#### Install Java Development Kit (JDK)

React Native requires a JDK for Android development. The recommended way to do
this is to install the OpenJDK distribution called Azul Zulu.

```sh
brew install --cask zulu@17

# Get path to where cask was installed to double-click installer
brew info --cask zulu@17
```

After installing the JDK, add or update your _JAVA_HOME_ environment variable in
_~/.zshrc_. If you have set up the Azul Zulu distribution, the JDK will probably
be located at _/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home_

```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

#### Install Android Studio

Download and install Android Studio from
[here](https://developer.android.com/studio).

You need to check these options:

- Android SDK
- Android SDK Platform
- Android Virtual Device

Building a React Native app with native code requires the Android 14
(UpsideDownCake) SDK in particular. This SDK can be installed through the SDK
Manager in Android Studio (in Settings).

Add the following lines to your _~/.zprofile_ or _~/.zshrc_

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Add Virtual Android device

Click on the "AVD Manager" icon in the top-right corner of the Android Studio
window. It looks like a phone with a small Android logo.

If you don't see the icon, you can also access the AVD Manager via the top menu:
_Tools > Device Manager_

In the AVD Manager, click on the "Create Virtual Device..." button at the bottom
of the window and follow the instructions.
