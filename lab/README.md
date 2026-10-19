# Memo Lab

Тестовое приложение на Expo для проверки утверждений со страниц раздела React
Native на настоящих устройствах: клавиатура, VoiceOver и TalkBack, модалки,
фокус. Каждый кейс — экран с шагами, тем, что утверждает страница, и тем, что
записать; результат сохраняется на телефоне и отправляется отчётом.

Expo SDK 58, React Native 0.88, React Navigation 7. Development build, не Expo
Go: в приложении есть нативные библиотеки (`react-native-keyboard-controller`).

## Первая сборка

Нужны Node 22+, pnpm (через `corepack enable`) и аккаунт Expo. Команды — из
папки `lab/`.

```sh
pnpm install
npx eas-cli@latest login
npx eas-cli@latest init   # создаёт проект в EAS и пишет projectId в app.json — закоммитить
```

iOS: зарегистрировать iPhone для internal distribution (один раз на устройство):

```sh
npx eas-cli@latest device:create
```

Сборка в облаке EAS, Xcode и Android Studio не нужны:

```sh
npx eas-cli@latest build --profile development --platform all
```

Когда сборка готова, EAS даёт ссылку и QR-код для установки: на Android это APK,
на iOS — установка по ссылке (если iOS попросит, включить Developer Mode:
Settings → Privacy & Security → Developer Mode).

Bundle ID и package — `dev.faciledictu.memolab` (в `app.json`), можно поменять
до первой сборки.

## Каждый раз

```sh
pnpm start
```

Открыть Memo Lab на телефоне: он подключится к серверу на компьютере (одна сеть
Wi-Fi; если не видит — `pnpm start --tunnel`). Изменения в JS приходят без
пересборки; новая нативная библиотека — новая сборка.

Без EAS, локально: `pnpm android` (Android Studio) или `pnpm ios` (Xcode).

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
