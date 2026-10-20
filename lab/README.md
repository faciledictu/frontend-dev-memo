# Memo Lab

Тестовое приложение на Expo для проверки утверждений со страниц раздела React
Native на настоящих устройствах: клавиатура, VoiceOver и TalkBack, модалки,
фокус. Каждый кейс — экран с шагами, тем, что утверждает страница, и тем, что
записать; результат сохраняется на телефоне и отправляется отчётом.

Expo SDK 58, React Native 0.88, React Navigation 7. Development build, не Expo
Go: в приложении есть нативные библиотеки (`react-native-keyboard-controller`).

## Сборка

Локально через Expo CLI, все команды — из папки `lab/`: в корне репозитория
`pnpm android` запускает не скрипт, а Android CLI от Google, если он установлен.
Нужны Node 22+ и pnpm (через `corepack enable`).

```sh
cd lab
pnpm install
```

Папки `android/` и `ios/` генерирует `expo run` (prebuild), в git их нет; после
изменения `app.json` или новой нативной библиотеки —
`npx expo prebuild --clean`.

### Android

Нужны Android Studio (Android SDK) и JDK 17. На телефоне включить отладку по USB
(Developer options → USB debugging) и подключить его кабелем.

```sh
npx expo run:android --device   # выбрать телефон из списка; собирает, ставит и запускает
```

### iOS

Нужен Mac с Xcode. На iPhone включить Developer Mode (Settings → Privacy &
Security → Developer Mode) и подключить его кабелем.

Подпись: добавить в `app.json` в `expo.ios` свой Team ID —
`"appleTeamId": "XXXXXXXXXX"` (developer.apple.com → Membership); иначе один раз
выбрать команду в Xcode: `ios/MemoLab.xcworkspace` → Signing & Capabilities.

```sh
npx expo run:ios --device       # выбрать iPhone из списка
```

Bundle ID и package — `dev.faciledictu.memolab` (в `app.json`), можно поменять
до первой сборки.

### Каждый раз

После первой сборки приложение остаётся на телефоне. Чтобы работать с ним:

```sh
pnpm start
```

Открыть Memo Lab на телефоне: он подключится к серверу на компьютере (одна сеть
Wi-Fi; если не видит — `pnpm start --tunnel`). Изменения в JS приходят без
пересборки; новая нативная библиотека — снова `npx expo run:android --device` /
`npx expo run:ios --device`.

Release-сборка без сервера (JS внутри приложения), например чтобы проверить
поведение как у пользователя: `npx expo run:android --device --variant release`,
`npx expo run:ios --device --configuration Release`.

### Через EAS, если понадобится

Облачная сборка без Android Studio и Xcode: профили в `eas.json`,
`npx eas-cli@latest init`, `device:create` для iPhone, затем
`npx eas-cli@latest build --profile development --platform all`.

## Как проверять

1. Открыть кейс, прочитать Setup, Steps и Expected.
2. Start the test, проверить, вернуться назад.
3. Выбрать As expected / Differs / Unclear, записать в заметку, что видно по
   каждому варианту, Save.
4. На главном экране Share report — и прислать текст в чат: по нему правятся
   страницы.

Тест `KeyboardAvoidingView` проходить в свежем запуске, до теста
keyboard-controller: `KeyboardProvider` меняет то, как Android применяет инсеты,
до перезапуска приложения.

## Как добавить кейс

1. Запись в `src/cases.ts`: страница, шаги, что утверждает страница, что
   записать.
2. Экран в `src/tests/` и строка в `src/tests/index.ts`.
3. Новая нативная библиотека — `npx expo install <пакет>` и новая сборка.

`lab/` не входит в сборку сайта: свой `pnpm-workspace.yaml` и lockfile, корневой
`tsconfig.json` его исключает; форматирование — общий Prettier из корня.
