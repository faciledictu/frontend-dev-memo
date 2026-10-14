# Аудит страниц

Результат этапа 1 из [ROADMAP.md](ROADMAP.md). Пути страниц — на момент аудита;
после этапа 2 см. раздел «После этапа 2». Текст страниц не менялся. Таблица одна
по смыслу (колонки везде одинаковые), но разбита по разделам, чтобы её можно
было читать.

## Как читать

**Вердикт:**

- **оставить** — страница в порядке, на этапе 3 только привести к шаблону;
- **править** — исправить ошибки и устаревшее, объём не растёт;
- **дополнить** — заглушка или заметный пробел внутри темы страницы;
- **сократить** — по существу верно, но длиннее, чем нужно для ответа;
- **переписать** — проще написать заново, чем чинить;
- **слить с…** — дубль или слишком мелкая страница;
- **перенести в…** — тема не на своём месте (этап 2);
- **удалить** — тема мертва или не про собеседования.

**Актуальность:** ✅ актуально · ⚠️ частично устарело · ❌ устарело.

**Ошибки** — только фактические и ломающие смысл; опечатки перечислены, потому
что их видно коллегам. **Не хватает** — только то, что реально спрашивают.

Десять индексных страниц разделов (`docs/*.mdx`) в таблицы не включены, кроме
`git.mdx`: в них только заголовок и список карточек, править нечего.

## Сводка

Проверено 140 страниц.

| Вердикт                   | Страниц |
| ------------------------- | ------- |
| править                   | 65      |
| слить с другой страницей  | 25      |
| оставить                  | 18      |
| переписать                | 11      |
| дополнить (заглушки)      | 7       |
| сократить                 | 6       |
| перенести в другой раздел | 4       |
| удалить                   | 4       |

Актуальность: ✅ 85 · ⚠️ 43 · ❌ 12. На 39 страницах есть ошибка по существу (в
таблицах выделены жирным) — неверное утверждение или неработающий пример.

### Что исправить в первую очередь

> Сделано: все 12 пунктов и неработающие примеры из списка ниже исправлены
> отдельными коммитами сразу после аудита. Строки в таблицах разделов описывают
> состояние на момент аудита; остальные замечания по этим страницам в силе.

Ошибки, с которыми страница вредит на собеседовании. Их можно чинить отдельным
PR до этапа 2: они не зависят от структуры.

1. `javascript/bind-call-apply.md` — примеры `call` и `apply` перепутаны.
2. `javascript/this-keyword.md` — «`globalThis` is `undefined` in strict mode».
3. `javascript/objects.md` — optional chaining назван nullish coalescing.
4. `javascript/event-loop.md` — рендеринг записан в макротаски.
5. `browser/http.md` — CORS описан как запрет, PATCH — как идемпотентный.
6. `react/hooks.mdx` — правила хуков изложены неверно.
7. `react/routing.md` — смесь API двух версий, ничего не работает.
8. `typescript/type-casting.md` — неверный совет про утверждения типа в JSX.
9. `nextjs/app-router/client-components.md` — «run entirely in the browser».
10. `nodejs/modules/events.md` — «events are processed asynchronously».
11. `git/tag.md` — в разделе про push стоит команда удаления.
12. `browser/html.md` — страница сломана визуально.

Неработающие примеры кода (синтаксис или необъявленные имена):
`javascript/errors`, `javascript/arrays`, `typescript/basic-types`,
`typescript/objects`, `react/state`, `react/context`, `react/react-fragment`,
`common/oop/oop-principles`, `nextjs/authentication`, `nextjs/optimisation`
(шрифты), `nextjs/page-router/forms`, `nextjs/app-router/forms`,
`nodejs/modules/http`, `react-native/notifications`.

### Повторяющиеся проблемы

- **Примеры кода никто не запускал.** Почти все ошибки выше ловятся запуском. На
  этапе 3 стоит прогонять каждый изменённый пример.
- **Версии не указаны.** Страницы про React, Next.js, React Router и React
  Native не говорят, для какой версии написаны, поэтому устаревание незаметно. В
  шаблон страницы стоит добавить необязательную пометку версии.
- **Следы генерации текста:** «the key aspects you mentioned», символы нулевой
  ширины, абзацы-пожелания («Understand how to interpolate values») и заключения
  в духе «this helps build maintainable code». Вычищать при правке.
- **Опечатки** — на 45 страницах из 140, часто в заголовках. Проверку орфографии
  (cspell) дешевле добавить в CI, чем вычитывать глазами.
- **Язык блока кода** не соответствует содержимому (TS в `jsx` / `javascript`,
  JSX в `typescript`).
- **`sidebar_position`** дублируется или идёт с дырами почти в каждом разделе.
- Орфография заголовков гуляет между британской и американской (Optimisation /
  Optimization).

### Входные данные для этапа 2

**Удалить:** `react/recompose`, `nextjs/other`, `nextjs/app-router/other`,
`react-native/setting-up`.

**Перенести:**

- `common/debugging` + `react/devtools` → Web Platform (инструменты);
- `common/gc` → JavaScript;
- `react/bundle-optimization` → Web Platform (производительность);
- `nextjs/styling` + `react-native/styled-components` → общая страница про
  подходы к стилизации в будущем разделе CSS;
- `nodejs/npm` → инструменты фронтенда;
- общая теория из `nextjs/authentication` → Web Platform (безопасность).

**Слить:**

- `common/best-practices/*` (3 страницы) → одна;
- `common/paradigms` + `fp` + `oop/*` → группа «Парадигмы»;
- `react/testing` и `react-native/other/testing` → общая часть в
  `common/testing`, специфика остаётся на месте;
- `common/ci-cd` + `react-native/other/ci-cd`;
- `git/tag` + `git/reset` → «Частые команды»;
- `react/virtual-dom` + `react/fiber` → «Рендеринг и reconciliation»;
- `react/components` (классы) + `react/lifecycle` → одна legacy-страница;
- `react/react-fragment` → `react/components`;
- `react/memoization` → `react/optimisation`;
- `react/reselect` → `react/redux`;
- `nextjs/app-router/navigation` → `redirecting`;
- `nextjs/app-router/rendering-strategies` → `server-components`;
- `nextjs/app-router/forms` → `server-actions`;
- Page Router: 10 страниц → 4 (`overview`, `rendering-strategies`,
  `data-fetching`, `forms`);
- `react-native/scroll-view` → `lists`; `fonts` → стили; `timers` → анимации;
  `native-libraries` → `rn-architecture`;
- `nodejs/modules/timer` → `nodejs/event-loop`;
- `sql/crud` → `sql/commands`;
- `browser/cookies` → будущая страница «Хранилища».

**Переименовать** (тема не соответствует адресу): `javascript/inheritance` →
prototypes, `typescript/type-casting` → type assertions, `react/concurrent-mode`
→ concurrent rendering, `react-native/code-splitting` → platform-specific code,
папка `react-native/other` → release.

Итого после слияний и удалений из 140 страниц остаётся около 105. Старые адреса
не сохраняем (решение после аудита), редиректы не нужны.

**Поправки к плану:**

- event loop в JavaScript и Node.js — не дубль, сливать не нужно (см. раздел
  Node.js);
- `react/routing` и `react/redux` в плане не отмечены, но по состоянию хуже
  отмеченных `lifecycle` и `recompose`;
- раздел TypeScript — самый слабый относительно своей важности: 5 страниц, из
  них 2 заглушки и 3 с некомпилируемыми примерами. В порядке этапа 3 он стоит
  третьим; есть смысл поднять его перед React.

### После этапа 2

Этап 2 выполнен. Таблицы разделов ниже описывают страницы по старым путям; где
они теперь:

| Было                                                                | Стало                                                |
| ------------------------------------------------------------------- | ---------------------------------------------------- |
| `common/best-practices/*`                                           | `programming/best-practices.md`                      |
| `common/paradigms`, `fp`, `oop/*`                                   | `programming/paradigms/*` (`paradigms` → `overview`) |
| `common/patterns`, `data-structures`                                | `programming/`                                       |
| `common/testing` + общая часть `react/testing` + RN `other/testing` | `tooling/testing.md`                                 |
| `common/ci-cd` + RN `other/ci-cd`                                   | `tooling/ci-cd.md`                                   |
| `common/code-review`, `dev-methodologies`                           | `tooling/`                                           |
| `nodejs/npm`                                                        | `tooling/package-managers.md`                        |
| `common/gc`                                                         | `javascript/garbage-collection.md`                   |
| `common/debugging` + `react/devtools`                               | `web-platform/tools/debugging.md`                    |
| `browser/http`, `cookies`                                           | `web-platform/network/` (`cookies` → `storage`)      |
| `browser/browser-workflow`, `events`                                | `web-platform/browser/`                              |
| `browser/html`                                                      | `html-css/html.md`                                   |
| `react/bundle-optimization`                                         | `web-platform/tools/bundle-optimization.md`          |
| теория из `nextjs/authentication`                                   | `web-platform/network/authentication.md`             |
| `nextjs/styling` + `react-native/styled-components`                 | `react/ecosystem/styling.md`                         |
| `git/tag` + `git/reset`                                             | `git/commands.md`                                    |
| `javascript/inheritance`                                            | `javascript/prototypes.md`                           |
| `typescript/type-casting`                                           | `typescript/type-assertions.md`                      |
| `react/virtual-dom` + `fiber`                                       | `react/basics/rendering.md`                          |
| классы из `react/components` + `lifecycle`                          | `react/basics/class-components.md`                   |
| `react/react-fragment`                                              | `react/basics/components.md`                         |
| `react/memoization`                                                 | `react/performance/optimisation.md`                  |
| `react/reselect`                                                    | `react/ecosystem/redux.md`                           |
| `react/concurrent-mode`                                             | `react/performance/concurrent-rendering.md`          |
| остальные `react/*`                                                 | `react/basics`, `hooks`, `performance`, `ecosystem`  |
| `app-router/navigation` + `redirecting`                             | `app-router/navigation.md`                           |
| `app-router/rendering-strategies`                                   | `app-router/server-components.mdx`                   |
| `app-router/forms`                                                  | `app-router/server-actions.mdx`                      |
| `page-router/navigation`, `redirecting`                             | `page-router/overview.md`                            |
| `page-router/ssg`, `ssr`, `csr`                                     | `page-router/rendering-strategies.md`                |
| `react-native/scroll-view`                                          | `react-native/lists.md`                              |
| `react-native/fonts`                                                | `react-native/stylesheet.md`                         |
| `react-native/timers`                                               | `react-native/animations/animated.md`                |
| `react-native/native-libraries`                                     | `react-native/rn-architecture.md`                    |
| `react-native/code-splitting`                                       | `react-native/platform-specific-code.md`             |
| `react-native/other/*`, `distribution`                              | `react-native/release/*`                             |
| `nodejs/modules/timer`                                              | `nodejs/event-loop.md`                               |
| `sql/crud`                                                          | `sql/commands.mdx`                                   |

Удалены: `react/recompose`, `nextjs/other`, `nextjs/app-router/other`,
`react-native/setting-up`.

Отступления от списка выше:

- `react/testing` остался в `react/ecosystem`: в `tooling/testing.md` уехал
  только раздел про E2E-библиотеки, остальное специфично для React.
- Из `page-router/ssr` при слиянии выброшен подраздел «Page-level SSR»: он
  утверждал, что страницы по умолчанию SSR, и противоречил соседнему разделу про
  SSG на той же странице.
- Из `react-native/native-libraries` перенесён только раздел про линковку:
  Bridge и JSI в `rn-architecture.md` уже описаны.
- Из `app-router/navigation` не перенесён пример с `redirect` в серверном
  компоненте: дубль примера из `redirecting` с синхронным `params`.

### Входные данные для этапа 4

Список новых страниц по убыванию важности. Пункты из плана подтверждены, жирным
— то, чего в плане не было.

1. Промисы и async/await.
2. TypeScript: utility types; сужение типов и type guards; **`type` vs
   `interface`**; generics (переписать заглушку); **типизация React**.
3. **React: когда и почему компонент перерисовывается**; **списки и `key`**;
   **React 19** (Actions, `use`, Compiler).
4. Модули (ESM / CommonJS).
5. Безопасность: XSS, CSRF, CORS, CSP.
6. Хранилища: cookies vs Web Storage vs IndexedDB.
7. Web Vitals и производительность загрузки, critical rendering path.
8. CSS: специфичность и каскад, box model, flexbox и grid, позиционирование,
   адаптивность, подходы к стилизации.
9. **React Native: навигация; производительность; Expo.**
10. Доступность.
11. **`Map` / `Set` / `WeakMap`, итераторы и генераторы, debounce / throttle.**
12. **Git: merge vs rebase, модели ветвления помимо Gitflow.**
13. **Серверное состояние (TanStack Query) и «где хранить состояние».**
14. **Next.js: кэширование (переписать), RSC vs SSR, Metadata.**
15. Воркеры и service worker, WebSocket / SSE.
16. **SQL: `JOIN`** — единственное исключение из «только исправления».

## Common

| Страница                           | Вердикт                                                                                    | Акт. | Ошибки                                                                                                                                                                                                             | Не хватает                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `best-practices/naming.md`         | слить с `dry-kiss-yagni` и `clean-code`                                                    | ✅   | —                                                                                                                                                                                                                  | —                                                                                                        |
| `best-practices/dry-kiss-yagni.md` | слить (см. выше)                                                                           | ✅   | —                                                                                                                                                                                                                  | Когда DRY вредит (преждевременная абстракция)                                                            |
| `best-practices/clean-code.md`     | слить (см. выше), сократить                                                                | ✅   | Список «антипаттернов» — это code smells из «Refactoring» Фаулера, а не из «Clean Code»                                                                                                                            | —                                                                                                        |
| `oop/oop-principles.md`            | править                                                                                    | ✅   | Пример Inheritance сломан: `BaseButton` игнорирует `children`, `icon = Icon` не используется, `title` не объявлен; и это композиция, а не наследование. JSX в блоке `typescript`. «Realisation» → «Implementation» | Нормальный пример наследования (`extends`), composition over inheritance одной строкой                   |
| `oop/solid.md`                     | оставить                                                                                   | ✅   | Опечатка «without without»                                                                                                                                                                                         | Короткие примеры для OCP/LSP/ISP (сейчас код есть только у DIP)                                          |
| `patterns.md`                      | править                                                                                    | ✅   | Пример назван Factory Method, но это Simple Factory. «They are provide»                                                                                                                                            | Singleton, Decorator, Pub/Sub vs Observer — их спрашивают чаще                                           |
| `data-structures.md`               | править                                                                                    | ✅   | Опечатка в заголовке «Alogrithms». Big O назван «worst case» (это верхняя граница, не случай). В таблице O(n log n) стоит раньше O(n)                                                                              | Hash table / Map / Set, сложность операций по структурам, сортировки, BFS/DFS                            |
| `paradigms.md`                     | слить с `fp.md` и `oop` в группу «Парадигмы»                                               | ✅   | Рекурсивный факториал подан как пример декларативного стиля — это не так; нужен пример `for` vs `map/filter` или JSX                                                                                               | —                                                                                                        |
| `fp.md`                            | оставить                                                                                   | ✅   | Комментарии «Partially apply» в примере каррирования смешивают каррирование и частичное применение. Опечатка «Antoher»                                                                                             | Higher-order functions, каррирование vs частичное применение                                             |
| `testing.md`                       | править; сюда же слить общую часть из `react/testing.md` и `react-native/other/testing.md` | ⚠️   | Enzyme мёртв (нет адаптера под React 18+). `require('cucumber')` → `@cucumber/cucumber`; `browser.waitForExist` — API WebdriverIO v4. Опечатки «strucure», «recieve»                                               | Vitest, MSW, виды тестовых дублёров (mock / stub / spy), что такое покрытие и почему 100 % не цель       |
| `debugging.md`                     | перенести в Web Platform                                                                   | ✅   | «Logging … isn’s a powerful tool» — опечатка, перевернувшая смысл                                                                                                                                                  | Вкладки Performance и Memory, `debugger`, source maps                                                    |
| `gc.md`                            | перенести в JavaScript, дополнить                                                          | ✅   | «Prevents memory leaks» — GC не спасает от утечек через живые ссылки                                                                                                                                               | Типовые утечки в JS (замыкания, таймеры, слушатели, detached DOM), `WeakMap` / `WeakRef`, поколения в V8 |
| `ci-cd.md`                         | править; слить с `react-native/other/ci-cd.md`                                             | ⚠️   | CD расшифрован сразу как Deployment и Delivery вперемешку. В примере: `node:14` (EOL), `only:` вместо `rules:`, `npm install` вместо `npm ci`, `firebase deploy --token` (deprecated)                              | Кэш зависимостей, preview-окружения                                                                      |
| `code-review.md`                   | оставить                                                                                   | ✅   | —                                                                                                                                                                                                                  | На что смотреть в ревью, как давать обратную связь — это и спрашивают                                    |
| `dev-methodologies.md`             | оставить, сократить                                                                        | ✅   | По Scrum Guide 2020: «Developers», а не «Development Team»; «events», а не «ceremonies». Абзац про Jira — вода                                                                                                     | —                                                                                                        |

Замечания по разделу:

- `common` — свалка из четырёх разных тем: принципы кода (best practices, OOP,
  FP, паттерны), алгоритмы, процессы (CI/CD, ревью, методологии) и инструменты
  (отладка, тесты). Это подтверждает пункт этапа 2 «разобрать `common`».
- `sidebar_position` не по порядку и с дырами (1, 2, 3, 3, 4 … 19, 20).

## Git

| Страница     | Вердикт                               | Акт. | Ошибки                                                                                                                                                                                    | Не хватает                                                                                         |
| ------------ | ------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `git.mdx`    | оставить                              | ✅   | —                                                                                                                                                                                         | —                                                                                                  |
| `merging.md` | править                               | ✅   | «Merge commit shows that a merge occurred» — при fast-forward merge-коммита нет; `--no-ff` не упомянут. Хеш `e5f6g7h8` в примере невалиден (не hex)                                       | Merge vs rebase (главный вопрос по Git), интерактивный rebase, конфликты, «не ребейзить публичное» |
| `tag.md`     | слить с `reset.md` в «Частые команды» | ✅   | **В разделе Pushing стоит команда удаления** `git tag -d my-tag` вместо `git push origin my-tag`. «Deleting from local branch» — теги не привязаны к веткам                               | —                                                                                                  |
| `reset.md`   | править                               | ✅   | Опечатки «Reseting»                                                                                                                                                                       | `git restore`, `reflog` (как вернуть «потерянное»), `stash`, пример `revert`                       |
| `gitflow.md` | переписать                            | ⚠️   | Описан не Gitflow: ветки `test` в модели нет, release-ветки пропущены, «merged into develop, and then to test» — локальная практика. Автор модели с 2020 года сам не советует её для веба | Trunk-based development и GitHub Flow, сравнение трёх моделей                                      |

Пробелы раздела: `fetch` vs `pull`, `cherry-pick` и `stash` как отдельные
ответы, `bisect`.

## JavaScript

| Страница               | Вердикт                               | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                              | Не хватает                                                                                                                      |
| ---------------------- | ------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `types.md`             | править                               | ✅   | `null` описан как «implicitly assigned» — наоборот, его присваивают явно. `bigint` — «infinite precision» → arbitrary. «`console.log()` triggers string coercion» — нет. Раздел Type conversion стоит после сносок. Опечатки «converson», «impicit»                                                                                                                                 | `==` vs `===`, список falsy, таблица `typeof`, примеры приведения (`[] + {}`), `0.1 + 0.2`, копирование по значению / по ссылке |
| `variables.md`         | править                               | ✅   | Оборванное предложение «A declaration consist of … is called .»; «while the remains constant» — пропущено слово. «CamelCase» → camelCase. Опечатки «runnin», «becames», «avaliable»                                                                                                                                                                                                 | Сводная таблица `var` / `let` / `const`, пример hoisting и TDZ кодом                                                            |
| `functions.md`         | дополнить                             | ✅   | —                                                                                                                                                                                                                                                                                                                                                                                   | Ни одного примера кода. Параметры по умолчанию и rest, IIFE, функции высшего порядка, полный список отличий стрелочных          |
| `execution-context.md` | переписать                            | ❌   | Терминология ES3: Variable Object, Activation Object. С ES5 это Lexical Environment / Environment Record — на собеседовании такой ответ звучит устаревшим. «Declarations are moved to the top» — упрощение, вводящее в заблуждение                                                                                                                                                  | Scope и scope chain простыми словами; связать с `closures.md` и `variables.md`                                                  |
| `this-keyword.md`      | править                               | ✅   | **«`this` refers to `globalThis`, which is `undefined` in strict mode»** — неверно: на верхнем уровне скрипта `this` — глобальный объект в любом режиме, а `globalThis` никогда не `undefined`. `undefined` бывает в модулях и при обычном вызове функции в strict mode. Заголовок «Inside arrow function» уровнем ниже, чем нужно. Опечатки «idetifier», «constrictors», «propery» | Потеря контекста при передаче метода как колбэка — самый частый вопрос                                                          |
| `bind-call-apply.md`   | править                               | ✅   | **Примеры `call` и `apply` перепутаны.** `call({}, ['a', 'b'])` выведет `{} ['a', 'b']`, а `apply({}, 'a', 'b')` бросит TypeError                                                                                                                                                                                                                                                   | «Напишите свой `bind`», повторный `bind` не меняет `this`                                                                       |
| `arrays.md`            | править, сократить                    | ✅   | `conslole.log` в примере. `console.log(word); // 'cba'` — выводится не та переменная. Пример `sort()` на `[1, 4, 3, 2]` прячет главный подвох (`[1, 10, 2]`). Незакрытый бэктик у `reduceRight()`. Раздел «array literal» рассказывает про spread. Опечатки «lenght», «examole», «litteral», «compairing»                                                                           | Таблица «мутирует / не мутирует» (`toSpliced`, `with`), `slice` vs `splice`                                                     |
| `objects.md`           | править                               | ✅   | **Optional chaining назван «also known as nullish coalescing»** — это разные операторы (`?.` и `??`). `Object.hasOwn(obj)` — в сигнатуре нет второго аргумента. «`structuredClone` is not available in some environments» устарело. Опечатка «tructuredClone». Нумерация сносок с 11                                                                                                | Ограничения `structuredClone`, `freeze` / `seal`, дескрипторы свойств, `??`, `Map` vs объект                                    |
| `closures.md`          | оставить                              | ✅   | —                                                                                                                                                                                                                                                                                                                                                                                   | Задача про `var` в цикле с `setTimeout`; практические применения (`once`, мемоизация, debounce)                                 |
| `inheritance.md`       | править; переименовать в «Prototypes» | ✅   | «The end of the chain is the prototype of `Object`, which is `null`» — `null` — прототип `Object.prototype`. `Object.setPrototypeOf(obj)` без второго аргумента. `__proto__` назван нестандартным — он в спецификации (Annex B, legacy). «using certain like» — пропущено слово                                                                                                     | Связь с `class` (сахар над прототипами), что делает `new` по шагам                                                              |
| `classes.md`           | оставить                              | ✅   | «ECMAScript 2022 introduced supports» — грамматика                                                                                                                                                                                                                                                                                                                                  | Геттеры / сеттеры, статические поля, отличия от функции-конструктора                                                            |
| `event-loop.md`        | править                               | ✅   | **«UI rendering» записан в макротаски** — рендеринг не задача, а отдельный шаг цикла. Среди микротасок нет `queueMicrotask` и `await`. «Delegate to background threads» — не названы Web Workers. Опечатка «setzInterval»                                                                                                                                                           | Задача «в каком порядке выведется» — без неё страница не отвечает на главный вопрос. `requestAnimationFrame` в цикле            |
| `errors.md`            | править                               | ✅   | **Пример не работает:** `tryToGetAccess()` не принимает `age`, оба вызова дадут ReferenceError. «Custom exceptions can be created using the `throw` statement» — их создают наследованием от `Error`                                                                                                                                                                                | Свой класс ошибки, `cause`, ошибки в промисах и `unhandledrejection`                                                            |
| `regexp.md`            | оставить                              | ✅   | Сломанный список квантификаторов (`- - *`). `const regex` объявлен дважды в одном блоке. Опечатки «Characrer», «charachters»                                                                                                                                                                                                                                                        | Флаги, `match` / `replace`, жадность. Приоритет низкий                                                                          |

Пробелы раздела, по убыванию важности:

1. **Промисы и async/await** — нет вообще, хотя это вопрос номер один.
2. Модули (ESM / CommonJS, динамический импорт, tree shaking).
3. `Map` / `Set` / `WeakMap` / `WeakRef`.
4. Итераторы и генераторы.
5. Debounce / throttle (спрашивают как задачу).
6. `Symbol`, `Proxy` / `Reflect` — коротко.

`sidebar_position` дробные и с дырами (1.5, 3.5, 19, 20) — упорядочить на
этапе 3.

## TypeScript

| Страница          | Вердикт                                    | Акт. | Ошибки                                                                                                                                                                                                                                                                                      | Не хватает                                                                                                                                          |
| ----------------- | ------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `basic-types.md`  | править                                    | ✅   | **Пример Type Aliases не компилируется:** `type Direction: …` (нужно `=`) и дважды `Dicrection`. `const list` объявлен дважды в одном блоке. Опечатка «Litteral»                                                                                                                            | `any` vs `unknown` vs `never` одним ответом, intersection types, exhaustive check через `never`                                                     |
| `objects.md`      | править                                    | ✅   | **`interface User: { … };` — синтаксическая ошибка** (двоеточие). Два модификатора слиплись в один абзац. Опечатка «Ypu»                                                                                                                                                                    | **`type` vs `interface`** — главный вопрос по TS, а его нет. Declaration merging, `Record`, excess property check                                   |
| `type-casting.md` | править; переименовать в «Type Assertions» | ✅   | **Совет про JSX неверен:** в `.tsx` угловые скобки для утверждений типа запрещены совсем, а `<T,>` — приём для generic-стрелочных функций. «Asserting that employee is of type Employee» — тип называется `User`. Большой пример сначала делает `as User`, потом проверяет — это антипример | Type guards (`is`), `as const`, `satisfies`, `!`, `as unknown as`                                                                                   |
| `enums.md`        | дополнить                                  | ⚠️   | —                                                                                                                                                                                                                                                                                           | Заглушка. Строковые enum, `const enum`, обратное отображение, почему сейчас советуют union или `as const` (enum не стирается, `erasableSyntaxOnly`) |
| `generics.md`     | дополнить (переписать)                     | ✅   | `GenericNumber` без инициализации полей не пройдёт `strict`                                                                                                                                                                                                                                 | Заглушка. Ограничения (`extends`), значения по умолчанию, вывод типов, generic-компоненты и хуки                                                    |

Пробелы раздела — здесь их больше всего, раздел самый слабый относительно того,
как часто спрашивают:

1. Utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`).
2. Сужение типов и type guards, discriminated unions.
3. `keyof`, `typeof`, indexed access, mapped и conditional types, `infer`.
4. `type` vs `interface`.
5. Типизация React: пропсы, события, `children`, хуки, generic-компоненты.
6. `tsconfig`: что включает `strict`.

## Browser

| Страница              | Вердикт                                       | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Не хватает                                                                                                                                                                                     |
| --------------------- | --------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `http.md`             | править; разделить на HTTP и CORS             | ⚠️   | **CORS описан как запрет** («feature to prevent requests to a different domain») — запрещает Same-Origin Policy, а CORS её ослабляет; origin — это схема + хост + порт, а не домен. «PATCH generally idempotent» — по спецификации не идемпотентен. «Basic text protocol» — HTTP/2 и 3 бинарные. Абзац про прокси начинается с середины. Пример `fetch` не проверяет `response.ok`. В списке REST висит пункт «with universal methods». Опечатки «Beause», «sended» | Preflight и credentials, ходовые коды (201, 204, 304, 401 vs 403, 429), кэширование (`Cache-Control`, `ETag`), HTTP/1.1 vs 2 vs 3, safe-методы, `AbortController`. XHR сократить до упоминания |
| `events.md`           | править                                       | ⚠️   | **В разделе Removing стоит сигнатура `addEventListener`.** `keypress` и `unload` устарели. В примере делегирования `matches` не сработает на вложенных элементах — нужен `closest`                                                                                                                                                                                                                                                                                  | `target` vs `currentTarget`, фаза target, события без всплытия, опции `once` / `passive` / `signal`                                                                                            |
| `browser-workflow.md` | править                                       | ✅   | В шагах рендеринга выполнение JS стоит после построения render tree — на деле скрипты блокируют парсинг HTML; `defer` / `async` не упомянуты. Нет шага Composite. «It sends a DNS server» — пропущено слово. Заголовок «Response Sending» не на том уровне. Опечатка «needes»                                                                                                                                                                                       | Critical rendering path, что вызывает reflow / repaint, layout thrashing                                                                                                                       |
| `html.md`             | переписать                                    | ✅   | **Страница сломана визуально:** списки слиплись в абзацы (`-<p>: …`), блок из четырёх бэктиков проглотил заголовок «Types of Buttons» и текст под ним. Содержание — учебник по тегам, а не ответы на вопросы. `<strong>` описан как «makes text bold», `<u>` — как подчёркивание                                                                                                                                                                                    | Семантическая разметка, `defer` / `async` / `type="module"`, block vs inline, `data-*`, meta viewport, валидация форм                                                                          |
| `cookies.md`          | править; слить в будущую страницу «Хранилища» | ⚠️   | Дата в примере — 2024 год: такая кука удалится сразу. `getCookie` не экранирует имя для RegExp. Опечатки «clients's», «wiht»                                                                                                                                                                                                                                                                                                                                        | **Cookies vs localStorage vs sessionStorage**, `SameSite` / `Secure` / `HttpOnly` по существу, сторонние куки                                                                                  |

Замечания по разделу:

- У трёх страниц из пяти `sidebar_position: 4`.
- Раздел мал для своей роли. Пробелы: Web Storage и IndexedDB, безопасность
  (XSS, CSRF, CSP), Web Vitals и производительность загрузки, доступность, весь
  CSS, воркеры и service worker, WebSocket / SSE, наблюдатели
  (`IntersectionObserver`, `MutationObserver`). Совпадает со списком этапа 4.

## React

Раздел написан под React 16–18. Основная масса правок — следствие React 19 (в
репозитории уже стоит 19.2): `forwardRef`, `defaultProps` и `propTypes` у
функциональных компонентов ушли, появились Actions, `use`, React Compiler.

| Страница                 | Вердикт                                             | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                   | Не хватает                                                                                                                                                                                        |
| ------------------------ | --------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-in-browser.md`    | дополнить                                           | ✅   | —                                                                                                                                                                                                                                                                                                                                                                        | Заглушка. `createRoot` / `hydrateRoot`, гидратация, `StrictMode`, `flushSync`                                                                                                                     |
| `react-fragment.md`      | слить с `components.md`                             | ✅   | Второй пример сломан: лишняя строка `return (` перед `function Blog()`. Опечатка «alhough»                                                                                                                                                                                                                                                                               | —                                                                                                                                                                                                 |
| `virtual-dom.md`         | слить с `fiber.md` в «Рендеринг и reconciliation»   | ⚠️   | «Ensures cross-browser compatibility» — это делали синтетические события, не VDOM. «Real DOM is slow» — миф в такой формулировке: дорог не DOM, а лишние layout и ручная синхронизация                                                                                                                                                                                   | Заглушка. Эвристики сравнения (тип элемента, `key`), **когда компонент перерисовывается**                                                                                                         |
| `fiber.md`               | слить (см. выше), сократить                         | ⚠️   | Пример fiber-узла выдуман: полей `priority`, `previousOutput`, `parent` нет (есть `return`, `child`, `sibling`, `alternate`, `lanes`). «Expiration times» заменены моделью lanes. «New version of the core algorithm» — 2017 год. Голая ссылка в конце                                                                                                                   | —                                                                                                                                                                                                 |
| `components.md`          | править                                             | ⚠️   | «Better performance compared to class components … smaller memory footprint» — недоказуемое утверждение, лучше убрать                                                                                                                                                                                                                                                    | Что такое компонент, элемент и JSX; чистота компонентов. Классовую часть — в одну legacy-страницу с `lifecycle.md`                                                                                |
| `props.md`               | править                                             | ❌   | `defaultProps` у функций удалён в React 19 — нужны параметры по умолчанию. `propTypes` в React 19 молча игнорируются. Сравнение с Flow неактуально. Опечатки «are are», «from from»                                                                                                                                                                                      | `children`, prop drilling                                                                                                                                                                         |
| `lifecycle.md`           | сократить; слить с классовой частью `components.md` | ⚠️   | Только классы. Нумерация списков продолжается через заголовки (MD029)                                                                                                                                                                                                                                                                                                    | Жизненный цикл функционального компонента (mount → update → unmount через эффекты), соответствие методов хукам                                                                                    |
| `hooks.mdx`              | править                                             | ⚠️   | **Правила хуков изложены неверно:** оба пункта — одно и то же правило (верхний уровень), а второго («только из React-функций») нет. Большой пример включает запрос через флаг в эффекте — антипаттерн; `error` не используется, таймер не очищается. В `useToggle` `setValue(!value)` вместо updater-функции и нет `export`                                              | **Обзора встроенных хуков нет вообще.** Исключение для `use` (можно в условии)                                                                                                                    |
| `side-effects.md`        | дополнить                                           | ✅   | «Replacement to `static getSnapshotBeforeUpdate`» — метод не статический, а `useLayoutEffect` по времени ближе к `componentDidMount` / `componentDidUpdate`                                                                                                                                                                                                              | Страница слишком тонкая для главной темы. Варианты массива зависимостей, порядок cleanup, двойной вызов в StrictMode, гонки при загрузке данных, «You Might Not Need an Effect», `useEffectEvent` |
| `state.md`               | править, сократить                                  | ✅   | **Классовый пример не работает:** `handleIncrement() => {` — синтаксическая ошибка, в `onClick` передан несуществующий `increment`. Батчинг объяснён трижды. Оборванная фраза «It's particularly useful By using useReducer». Опечатки «Asynchornous», «recieves»                                                                                                        | Иммутабельное обновление объектов и массивов, ленивая инициализация, подъём состояния, производное состояние                                                                                      |
| `memoization.md`         | слить с `optimisation.md`                           | ⚠️   | Полный дубль половины `optimisation.md`                                                                                                                                                                                                                                                                                                                                  | —                                                                                                                                                                                                 |
| `refs.md`                | править                                             | ⚠️   | `forwardRef` в React 19 не нужен: `ref` — обычный проп. «Refs point to a DOM node or a React element» — к экземпляру класса, не к элементу. Пример PreviousValue читает `ref.current` во время рендера, что документация запрещает                                                                                                                                       | Callback ref в функциональных компонентах и его cleanup                                                                                                                                           |
| `context.md`             | править                                             | ⚠️   | **Синтаксическая ошибка в примере:** `<{children}>`. «A way to manage state globally» — контекст доставляет значение, а не управляет состоянием. `Consumer` назван HOC — это render prop. Причина мемоизации названа неверно: дело не в дорогих вычислениях, а в новой ссылке на каждый рендер                                                                           | React 19: `<Context>` как провайдер и `use(Context)`. Разделение контекстов, контекст vs стор                                                                                                     |
| `portals.md`             | сократить                                           | ✅   | Два почти одинаковых примера по 35 строк. Опечатка «argumen»                                                                                                                                                                                                                                                                                                             | Доступность модалок (фокус), `<dialog>`                                                                                                                                                           |
| `forms.md`               | править, сократить                                  | ⚠️   | В функциональной странице куски классового кода (`this.inputRef`). Formik фактически не развивается. Заголовки «Pros» на разных уровнях. «Form Lifecycle» — вода. Пропущено слово в «the value is directly from the DOM». Опечатка «shoud»                                                                                                                               | React 19: `action` у формы, `useActionState`, `useFormStatus`, `useOptimistic`                                                                                                                    |
| `patterns.md`            | править                                             | ✅   | Опечатка «See aslo»                                                                                                                                                                                                                                                                                                                                                      | Compound components, композиция через `children`. Что error boundary не ловит (обработчики, асинхронный код). Подвох `&&` с нулём                                                                 |
| `optimisation.md`        | править                                             | ⚠️   | «Wrap only those functions … in `useCallback` that are computationally intensive» — `useCallback` не про тяжесть вычислений. `key` — про идентичность, а не про оптимизацию; заслуживает отдельной страницы. Опечатка «refenrences»                                                                                                                                      | **React Compiler** меняет весь совет «когда мемоизировать». Приёмы без мемоизации: опустить состояние ниже, передать `children`                                                                   |
| `virtualization.md`      | править                                             | ⚠️   | `react-virtualized` заброшен                                                                                                                                                                                                                                                                                                                                             | `react-window` / TanStack Virtual                                                                                                                                                                 |
| `recompose.md`           | **удалить**                                         | ❌   | Библиотека заморожена автором в 2018 году. Под заголовком `onlyUpdateForKeys` показан `withPropsOnChange`                                                                                                                                                                                                                                                                | —                                                                                                                                                                                                 |
| `redux.md`               | переписать                                          | ⚠️   | Текст взят из заметок про React Native: заголовок «Why Use It in React Native», `unstable_batchedUpdates from react-native`. **Ни одного примера кода.** `redux-mock-store` не рекомендуется, `serializableCheck.ignoreActions` → `ignoredActions`, normalizr → `createEntityAdapter`. Разметка «I**mmutable». Половина страницы — «Advanced Tips» без пользы для ответа | Поток данных и slice кодом, `useSelector` / `useDispatch`. Альтернативы: Zustand, TanStack Query для серверного состояния                                                                         |
| `concurrent-mode.md`     | переписать; переименовать                           | ❌   | Названия «Concurrent Mode» нет с React 18 — это concurrent rendering. Врезка определяет конкурентность как «несколько задач сразу, чтобы работало быстрее». **Пример Suspense ничего не подвешивает.** Пример `useTransition` на счётчике не показывает, зачем он нужен                                                                                                  | `use`, асинхронные transitions (Actions). Часть про `useDeferredValue` хорошая — оставить                                                                                                         |
| `bundle-optimization.md` | перенести в Web Platform (производительность)       | ⚠️   | **`import { debounce } from 'lodash'` не tree-shake'ится** — lodash в CommonJS; нужен `lodash-es` или `lodash/debounce`. Только webpack. Опечатка в заголовке «Optimisaton»                                                                                                                                                                                              | Vite / Rollup, `sideEffects`, динамический импорт по маршрутам                                                                                                                                    |
| `devtools.md`            | слить с `common/debugging.md`                       | ❌   | Вкладки «React» нет с 2019 года (есть Components и Profiler), «Context panel» не существует. Разметка сломана: пункты списка вместо подзаголовков                                                                                                                                                                                                                        | —                                                                                                                                                                                                 |
| `testing.md`             | править; общую часть слить в `common/testing.md`    | ⚠️   | Раздел про Enzyme лишний. `fireEvent` вместо `userEvent`, `getByText` вместо `getByRole`. Пример Playwright — скрипт на библиотеке, а не тест на `@playwright/test`. Тест HOC ничего не проверяет. Опечатка «Componets»                                                                                                                                                  | `findBy*` для асинхронного, `renderHook`, MSW, Vitest                                                                                                                                             |
| `routing.md`             | переписать                                          | ❌   | **Смесь API v5 и v6, ни один пример не работает ни на одной версии:** `<Routes>` вместе с `component=` и `exact`, `Redirect`, `Switch`, `useHistory`, `useRouteMatch`. Актуальна v7                                                                                                                                                                                      | `element`, `Navigate`, `useNavigate`, `Outlet`, data router с loader'ами, ленивые маршруты, защищённые маршруты                                                                                   |
| `reselect.md`            | слить с `redux.md`                                  | ⚠️   | «Remember the arguments of the last call» — с Reselect 5 кэш по умолчанию `weakMapMemoize`. Опечатка в заголовке «Memoization it Redux». `sidebar_position: 100`                                                                                                                                                                                                         | —                                                                                                                                                                                                 |

Пробелы раздела:

1. **Когда и почему компонент перерисовывается** (render → commit) — нет
   страницы, хотя это вопрос, с которого начинают.
2. Списки и `key` отдельной страницей.
3. React 19 одной страницей: Actions, `use`, `useActionState`, `useOptimistic`,
   `ref` как проп, Compiler.
4. Серверное состояние (TanStack Query) и обзор «где хранить состояние».
5. SSR и гидратация, Server Components — обзор со ссылкой в раздел Next.js.
6. Подходы к стилизации (CSS Modules, CSS-in-JS, Tailwind).
7. Синтетические события.

26 страниц плоским списком с `sidebar_position` от 1 до 100 — на этапе 2 нужны
подгруппы (основы / хуки / производительность / экосистема).

## Next.js

Раздел написан под Next.js 13–14. С тех пор: в 15-й версии `fetch` перестал
кэшироваться по умолчанию, а `params` / `searchParams` стали промисами; в 16-й
`middleware` переименован в `proxy`, появились Cache Components (`'use cache'`),
убран `next lint`. Версии и детали перепроверить по документации при правке.

### Общие страницы

| Страница            | Вердикт                                   | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Не хватает                                                                                                                                                         |
| ------------------- | ----------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `overview.md`       | править, сократить                        | ⚠️   | Половина страницы — установка и вопросы `create-next-app` (устарели), это не для собеседования. `next lint` удалён. Роутинг описан только через `pages/`. Опечатка «necessacry»                                                                                                                                                                                                                                                                                                        | App Router vs Pages Router одной таблицей; когда Next.js не нужен                                                                                                  |
| `optimisation.md`   | править, сократить                        | ⚠️   | **Пример шрифтов выдуман:** `GoogleFont` в `next/font/google` нет — импортируется сам шрифт (`Roboto({ weight, subsets })`). «Splits code for every Server Component» — делит по сегментам маршрута, серверные компоненты в клиентский бандл не попадают. Лишняя `;` после `<DynamicComponent />` попадёт в разметку. `blurDataUrl` → `blurDataURL`. `priority` у `next/image` заменён на `preload`. Опечатки «Optimisaton», «exapmle», «eiter», «determite», «some some»              | Зачем `sizes`, как `next/image` влияет на LCP и CLS                                                                                                                |
| `authentication.md` | переписать, сократить вдвое               | ⚠️   | **`useActionState` импортирован из `react-dom`** — он в `react`. В примере Page Router `router` не объявлен, `signIn` импортирован зря. HOC рендерит защищённый компонент до редиректа. «Middleware can be placed in specific directories» — файл один, в корне. В «Protecting Server Actions» `FormData` деструктурируется как объект, токен берётся из формы. Разделы «Authorizaton» и «Authorization» дублируются. В тексте невидимые символы нулевой ширины. TS-код в блоках `jsx` | Сессии vs JWT, `httpOnly`-куки, проверка прав рядом с данными (Data Access Layer), почему одного middleware мало. Общую теорию (стратегии, OAuth) — в Web Platform |
| `styling.md`        | перенести в общую страницу про стилизацию | ⚠️   | Ничего специфичного для Next.js, кроме последней врезки. `tailwind.config.js` — с Tailwind 4 конфигурация в CSS. Не сказано, что runtime CSS-in-JS не работает в серверных компонентах                                                                                                                                                                                                                                                                                                 | —                                                                                                                                                                  |
| `other.md`          | **удалить**                               | ✅   | Одна функция `userAgent` — на собеседованиях не спрашивают                                                                                                                                                                                                                                                                                                                                                                                                                             | —                                                                                                                                                                  |

### App Router

| Страница                             | Вердикт                                       | Акт. | Ошибки                                                                                                                                                                                                                                                                                            | Не хватает                                                                                                                                          |
| ------------------------------------ | --------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app-router/overview.md`             | править                                       | ✅   | **`app/(marketing)/about.js` → `/about` — неверно**, нужен `about/page.js`. В дереве одновременно `app/about/page.js` и `app/(marketing)/about/page.js` с пометкой «same as above» — это ошибка сборки, а не синоним. Пункт «API Routes Integration» невнятен                                     | `not-found`, `template`, catch-all сегменты, параллельные и перехватывающие маршруты — хотя бы строкой                                              |
| `app-router/navigation.md`           | слить с `redirecting.md`                      | ❌   | **`<Link><a>…</a></Link>`** — с Next 13 это ошибка. `params.id` читается синхронно (с 15-й версии `params` — промис). Половина страницы повторяет `redirecting.md`                                                                                                                                | `usePathname`, `useSearchParams`, prefetch                                                                                                          |
| `app-router/server-components.mdx`   | править; влить сюда `rendering-strategies.md` | ⚠️   | «Static rendering — at build time» — ещё и при ревалидации. Раздел Instant Loading State сбивчив («replace it with an interactive version as soon as data is prepared»). «Send parts of the actual to the client» — пропущено слово. Опечатки «palintext» (язык блока), «Serves-Side», «splitted» | **RSC vs SSR** — главный вопрос. Ограничения серверных компонентов (нет состояния, эффектов, обработчиков). Partial Prerendering / Cache Components |
| `app-router/client-components.md`    | править                                       | ✅   | **«Run entirely in the browser»** — нет, клиентские компоненты тоже пререндерятся на сервере (следующий же пункт про гидратацию это и говорит). Заголовок файла `context/ThemeContext.js`, а импорт из `./theme-provider`. Опечатка «ou»                                                          | `'use client'` — граница, а не метка компонента; серверный компонент как `children` клиентского; сериализуемость пропсов                            |
| `app-router/rendering-strategies.md` | слить с `server-components.mdx`               | ✅   | Пересказ документации без вывода; название конфликтует с одноимённым разделом в `server-components.mdx`                                                                                                                                                                                           | —                                                                                                                                                   |
| `app-router/server-actions.mdx`      | править; влить сюда `forms.md`                | ⚠️   | Страница открывается врезкой про `fetch`, не относящейся к теме. В примере для клиентского компонента `create` импортирован и не использован. В React 19 это называется Server Functions                                                                                                          | **Server Action — публичный POST-эндпоинт**: авторизация и валидация внутри. Ревалидация после мутации, возврат ошибок                              |
| `app-router/forms.md`                | слить с `server-actions.mdx`                  | ⚠️   | Пример программной отправки не работает: нет `'use client'`, `useRef` не импортирован. `method="post"` рядом с функцией в `action` лишний                                                                                                                                                         | `useActionState`, валидация (zod), progressive enhancement                                                                                          |
| `app-router/redirecting.md`          | оставить (плюс навигация)                     | ⚠️   | «In server components or API routes» — в App Router это Route Handlers. `if (true)` в примере. Middleware → `proxy` в Next 16                                                                                                                                                                     | `redirects` в `next.config`, `notFound()`                                                                                                           |
| `app-router/caching.md`              | переписать                                    | ❌   | Модель до Next 15 (уже отмечено в плане). Список «Opting out» для 15+ неверен. `await revalidatePath()` — функция синхронная                                                                                                                                                                      | Четыре слоя кэша (Request Memoization, Data Cache, Full Route Cache, Router Cache), что изменилось в 15 и 16, `'use cache'`, теги                   |
| `app-router/fetching-patterns.md`    | править                                       | ⚠️   | `params: { username }` деструктурируется синхронно в обоих примерах                                                                                                                                                                                                                               | Паттерн preload, передача промиса в клиентский компонент через `use`                                                                                |
| `app-router/route-handlers.md`       | дополнить                                     | ✅   | Нет frontmatter. «`route.js` or `route.js`» (нужно `route.ts`), сломанные бэктики. Опечатка «hawe»                                                                                                                                                                                                | Заглушка. `NextResponse`, динамические сегменты, когда Route Handler, а когда Server Action                                                         |
| `app-router/other.md`                | **удалить**; заменить страницей про Metadata  | ✅   | Один `generateViewport`; TS-код в блоке `jsx`                                                                                                                                                                                                                                                     | `generateMetadata` спрашивают, viewport — нет                                                                                                       |

У трёх пар страниц совпадает `sidebar_position` (7, 8, 8).

### Page Router

План — сжать 10 страниц до 3–4. Аудит это подтверждает: `ssg`, `ssr`, `csr` и
`rendering-strategies` пересказывают друг друга, а `ssg.md` и `ssr.md` друг
другу противоречат.

| Страница                              | Вердикт                                        | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                       | Не хватает                               |
| ------------------------------------- | ---------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `page-router/overview.md`             | оставить; влить `navigation`, `redirecting`    | ✅   | Заголовок «Templates» над `_app` и `_document` — это не шаблоны. Опечатки «on of», «mehtods»                                                                                                                                                                                                                                                                                 | —                                        |
| `page-router/navigation.md`           | слить с `overview.md`                          | ✅   | —                                                                                                                                                                                                                                                                                                                                                                            | —                                        |
| `page-router/redirecting.md`          | слить с `overview.md`                          | ✅   | `NextResponse.redirect('/new-page')` — нужен абсолютный URL. «`getStaticProps` to redirect during the build process» — на сборке редирект из `getStaticProps` запрещён. Уровни заголовков перепутаны                                                                                                                                                                         | —                                        |
| `page-router/rendering-strategies.md` | оставить как основу; влить `ssg`, `ssr`, `csr` | ✅   | Грамматика «CSR: Not be ideal»                                                                                                                                                                                                                                                                                                                                               | ISR в сравнении; гидратация и её ошибки  |
| `page-router/ssr.md`                  | слить (см. выше)                               | ✅   | **«By default, pages are SSR-enabled»** — страница без `getServerSideProps` пререндерится статически; противоречит `ssg.md`. Оборванная фраза «SSR doesn't client-side specific features»                                                                                                                                                                                    | —                                        |
| `page-router/ssg.md`                  | слить (см. выше)                               | ✅   | —                                                                                                                                                                                                                                                                                                                                                                            | —                                        |
| `page-router/csr.md`                  | слить (см. выше)                               | ✅   | «Use the `useEffect()` and `useEffect()` hook». «Rich Interactivity» — не свойство CSR. Грамматика первого предложения. Опечатка «recomended»                                                                                                                                                                                                                                | —                                        |
| `page-router/data-fetching.mdx`       | править, сократить вдвое                       | ⚠️   | `useQuery(['data'], fetchData)` — синтаксис до TanStack Query v5. В списке «когда нужен ISR» стоит «Dynamic User-Dependent Content» — как раз не для него. При `fallback: false` проверка `router.isFallback` — мёртвый код. `getInitialProps` назван deprecated (он legacy) и показан в `components/`. Опечатка «Thrid»                                                     | On-demand ревалидация (`res.revalidate`) |
| `page-router/forms.md`                | править; переименовать в «API Routes и формы»  | ✅   | **Пример Error Handling не работает:** `setLoading` и `setIsSuccess` не объявлены (есть `setIsLoading`, `setSuccess`), `email` и `password` не существуют, `FormData` отправляется с `Content-Type: application/json`, при ошибке `isLoading` остаётся `true`. Заголовок «Server-Only Forms» не про то. TS в блоке `javascript`. Опечатки «endpont», «recieved», «attibutes» | —                                        |

Пробелы раздела: `generateMetadata` и SEO, `generateStaticParams`, обработка
ошибок (`error.js`, `global-error.js`), proxy / middleware отдельной страницей,
переменные окружения (`NEXT_PUBLIC_`), runtime (Node vs Edge), деплой вне
Vercel.

## React Native

Раздел написан в разное время: `rn-architecture.md` и папка `other/` свежие,
анимации и нативные библиотеки — эпохи до New Architecture. Точка отсчёта для
правки: New Architecture включена по умолчанию с 0.76, а legacy-архитектура
удалена в 0.82; Reanimated 4, Gesture Handler 2+; Expo — рекомендуемый способ
начать проект.

| Страница                               | Вердикт                                  | Акт. | Ошибки                                                                                                                                                                                                                                                                                                                                                                                 | Не хватает                                                                                                                               |
| -------------------------------------- | ---------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `overview.md`                          | править                                  | ⚠️   | **«Rendering UI elements that compile into native code»** — JS не компилируется в нативный код: он исполняется в Hermes и управляет нативными view. «Developed by Facebook» → Meta                                                                                                                                                                                                     | Expo и bare workflow, Hermes, RN vs Flutter vs натив — этим вопросом открывают собеседование                                             |
| `setting-up.md`                        | **удалить**                              | ❌   | Инструкция по установке, а не ответ на вопрос; устаревает быстрее всего (Android 14 SDK, «Preferences» в Xcode, иконка AVD Manager), создание проекта не описано                                                                                                                                                                                                                       | Достаточно ссылки на официальную документацию                                                                                            |
| `code-splitting.md`                    | оставить; переименовать файл             | ✅   | Имя файла `code-splitting`, а страница про платформенный код                                                                                                                                                                                                                                                                                                                           | `Platform.Version`                                                                                                                       |
| `stylesheet.md`                        | править                                  | ⚠️   | Совет «`StyleSheet.create` даёт оптимизации, inline их обходит» устарел: сейчас `create` возвращает объект как есть. `flatten` описан дважды. Под заголовком `absoluteFillObject` в примере `absoluteFill`. `Dimensions.get` на уровне модуля не реагирует на поворот. Опечатка «Dimenstions»                                                                                          | `useWindowDimensions`, единицы (dp, нет `px` / `rem`), отсутствие каскада и наследования                                                 |
| `styled-components.md`                 | сократить до «Подходы к стилизации»      | ⚠️   | styled-components в режиме поддержки. Проп `primary` уйдёт в нативный компонент — нужны transient props (`$primary`)                                                                                                                                                                                                                                                                   | NativeWind, Unistyles — что выбирают сейчас и почему                                                                                     |
| `flexbox.md`                           | оставить                                 | ✅   | `stretch` — «default for column direction»: это значение по умолчанию при любом направлении. Нет `baseline`                                                                                                                                                                                                                                                                            | **Отличия от веба** (column по умолчанию, `flex` — одно число), `gap`                                                                    |
| `fonts.md`                             | слить со стилями                         | ✅   | **«Use the exact name of the font file»** — на iOS нужно PostScript-имя шрифта, а не имя файла; классическая причина «на Android работает, на iOS нет». «Done differently based on the version» — и дальше один способ                                                                                                                                                                 | `expo-font`                                                                                                                              |
| `scroll-view.md`                       | слить с `lists.md`                       | ✅   | —                                                                                                                                                                                                                                                                                                                                                                                      | —                                                                                                                                        |
| `lists.md`                             | править                                  | ⚠️   | В примере `keyExtractor` по индексу и `extraData={data}` — оба антипримеры                                                                                                                                                                                                                                                                                                             | **Оптимизация FlatList** (`getItemLayout`, `windowSize`, `initialNumToRender`, мемоизация `renderItem`) и FlashList — стандартный вопрос |
| `animations/animated.md`               | править, сократить                       | ✅   | У `spring` смешаны два несовместимых набора параметров (`friction` / `tension` и `stiffness` / `damping`). «Non-essential UI threads» — бессмыслица. «Understand how to interpolate» — совет вместо содержания. React Native Debugger устарел                                                                                                                                          | `Animated.Value` и `interpolate` кодом, `LayoutAnimation`                                                                                |
| `animations/grs.md`                    | сократить; влить сюда PanResponder       | ✅   | `Touchable*` — вместо них рекомендован `Pressable`. Вложенные списки вместо заголовков. Опечатка «Bubblig»                                                                                                                                                                                                                                                                             | —                                                                                                                                        |
| `animations/reanimated.md`             | переписать                               | ❌   | **Описан Reanimated 1:** «Nodes», `Transitioning` / `Transition` — этого API давно нет. Совет про `useNativeDriver` относится к Animated. `runOnUI` в примере ничего не делает. «Worklets are isolated environments» — это функции, исполняемые в UI-рантайме                                                                                                                          | `useDerivedValue`, вызов JS из worklet, layout-анимации (entering / exiting), почему это быстрее Animated                                |
| `animations/gestures-and-animation.md` | переписать                               | ❌   | `useAnimatedGestureHandler` и `PanGestureHandler` — старый API; сейчас `Gesture.Pan()` и `GestureDetector`. Часть про PanResponder дублирует `grs.md`, список сломан. Опечатка «Exapmle»                                                                                                                                                                                               | Композиция жестов (`Simultaneous`, `Race`, `Exclusive`)                                                                                  |
| `permissions.md`                       | править, сократить                       | ⚠️   | `expo-permissions` удалён — права запрашиваются через сами модули. `Platform` в примере не импортирован. «Storage» на Android 13+ разбит на медиа-разрешения. Врезка в Best Practices — вода                                                                                                                                                                                           | Статус `BLOCKED` и переход в настройки                                                                                                   |
| `distribution.md`                      | править                                  | ⚠️   | **«Staged Rollout: not officially supported» для iOS** — есть Phased Release. Фраза «the key aspects you mentioned» — след чата. Команда создаёт `my-release-key.keystore`, текст говорит `my-upload-key`. `expo build` удалён → `eas build`. Срок ревью 1–7 дней завышен                                                                                                              | Play App Signing (upload key vs app signing key), TestFlight и внутренние треки                                                          |
| `notifications.md`                     | править, сократить                       | ⚠️   | **«On Android, permissions are granted during installation»** — с Android 13 нужен runtime-запрос. **`const async requestUserPermission = () =>`** — синтаксическая ошибка. Payload с полем `to` — legacy API FCM, отключён в 2024 году. APNs: сертификат `.p12` вместо ключа `.p8`. Токен и поток описаны дважды. `react-native-push-notification` заброшен, статус Notifee проверить | Типы сообщений (notification vs data), поведение в foreground / background / quit, `expo-notifications`                                  |
| `timers.md`                            | сократить; слить с анимациями            | ⚠️   | Пример анимирует через `setState` на каждый кадр — в RN так делать нельзя, это повод для вопроса «почему тормозит». Таблица перенесена с веба («pauses in hidden views»). Раздел «How it works internally» — домыслы. `Animated` импортирован и не используется                                                                                                                        | —                                                                                                                                        |
| `native-libraries.md`                  | переписать; слить с `rn-architecture.md` | ❌   | Bridge описан как действующий механизм. `react-native link` / `unlink` удалены в 0.69. «Rebuild Your App:» — и пусто                                                                                                                                                                                                                                                                   | Turbo Modules и Fabric-компоненты, Codegen, autolinking, Expo Modules                                                                    |
| `rn-architecture.md`                   | править                                  | ✅   | Потоки legacy описаны неверно: «layout ran on a single main thread» и «native bridge thread» — на деле были JS, UI и shadow-поток (layout). Не сказано, что новая архитектура — уже единственная. Жирный текст вместо заголовков                                                                                                                                                       | Hermes, одной схемой «что происходит от `setState` до пикселя»                                                                           |
| `other/fastlane.md`                    | оставить                                 | ✅   | HockeyApp закрыт. `assembleRelease` + `upload_to_play_store` — Play принимает AAB (`bundleRelease`)                                                                                                                                                                                                                                                                                    | —                                                                                                                                        |
| `other/env.md`                         | оставить                                 | ✅   | В примере Gradle `apiURL …` — такого свойства нет. «Gradle/Mac Keychain for Android» — невнятно                                                                                                                                                                                                                                                                                        | **Переменные в JS-бандле не секретны.** `EXPO_PUBLIC_`                                                                                   |
| `other/ci-cd.md`                       | слить с `common/ci-cd.md`                | ✅   | Блок кода вне списка ломает нумерацию                                                                                                                                                                                                                                                                                                                                                  | EAS Build как основной вариант                                                                                                           |
| `other/ota.md`                         | править                                  | ✅   | **«React Native's license specifically permits JS updates»** — разрешение даёт лицензионное соглашение Apple Developer Program, а не лицензия RN                                                                                                                                                                                                                                       | `runtimeVersion` / fingerprint, что случилось с CodePush (App Center закрыт в 2025)                                                      |
| `other/testing.md`                     | слить с `common/testing.md`              | ✅   | **Врезка сломана:** `::: tip Coverage…` с пробелом рендерится текстом                                                                                                                                                                                                                                                                                                                  | —                                                                                                                                        |

Замечания по разделу:

- Папка `other` в сайдбаре называется «Best Practices», а лежит в ней релизный
  процесс. На этапе 2: группа «Сборка и релиз» (`distribution`, `fastlane`,
  `env`, `ota`, CI/CD).

Пробелы раздела, по убыванию важности:

1. **Навигация** (React Navigation / Expo Router, deep links) — нет вообще.
2. **Производительность**: лишние рендеры, списки, время запуска,
   профилирование.
3. Expo: prebuild / CNG, dev client, EAS.
4. Хранение данных: AsyncStorage, MMKV, Keychain / SecureStore.
5. Отладка: React Native DevTools (Flipper больше не поддерживается).
6. Базовые компоненты и клавиатура / safe area.
7. Жизненный цикл приложения (`AppState`), фоновые задачи, офлайн.

## Node.js

По плану раздел не развивается — только исправление ошибок. Колонка «Не хватает»
поэтому заполнена минимально.

| Страница                   | Вердикт                                              | Акт. | Ошибки                                                                                                                                                                                                                                                                              | Не хватает                                        |
| -------------------------- | ---------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `overview.md`              | дополнить двумя строками                             | ✅   | Опечатка в заголовке «Overwiev»                                                                                                                                                                                                                                                     | Заглушка. libuv и пул потоков — одной фразой      |
| `modules/http.md`          | править                                              | ⚠️   | **Пример с маршрутами падает:** `writeHead(200)` вызывается до ветвления, затем `writeHead(404)` — `ERR_HTTP_HEADERS_SENT`. Раздел «Installation» ставит TypeScript глобально и к теме не относится. Оборванный заголовок «Making HTTP Requests in». `chunk: string` — это `Buffer` | Встроенный `fetch` вместо `http.request`          |
| `modules/timer.md`         | слить с `event-loop.md`                              | ✅   | Противопоставление «в браузере таймеры блокируют UI, а Node неблокирующий» ложно: колбэк блокирует поток в обоих случаях. `setImmediate` — не «сразу после цикла», а в фазе check                                                                                                   | —                                                 |
| `modules/filesystem.md`    | править                                              | ✅   | **Вступление описывает браузерный File System Access API** (file handles, разрешение пользователя), а не модуль `fs`. **В таблице несуществующие методы** `fs.promises.readFileSync` и т. д. — в `fs.promises` суффикса `Sync` нет. `rmdir` → `rm`. Уровни заголовков перепутаны    | —                                                 |
| `modules/events.md`        | править                                              | ✅   | **«Events are processed asynchronously»** — `EventEmitter` вызывает слушателей синхронно. В первом примере нет импорта. Опечатки «Expamples», «Creating and», «Setting up and»                                                                                                      | Особое поведение события `error`                  |
| `modules/child-process.md` | оставить                                             | ✅   | `fork('./child.ts')` — запуск `.ts` требует оговорки                                                                                                                                                                                                                                | —                                                 |
| `modules/cluster.md`       | править                                              | ⚠️   | `cluster.isMaster` устарел с Node 16 → `isPrimary`; «Master» → «Primary»                                                                                                                                                                                                            | Чем отличается от `worker_threads` — спрашивают   |
| `modules/stream.md`        | оставить                                             | ✅   | `pipe()` не пробрасывает ошибки и не закрывает потоки                                                                                                                                                                                                                               | `pipeline` из `stream/promises`                   |
| `errors.md`                | править                                              | ✅   | Классификация спутана: operational errors — не «специфика Node», а пара к programmer errors. `err?.statusCode` на типе `Error` не скомпилируется. Обработчик `uncaughtException` без завершения процесса — плохой пример. Опечатка «Commont»                                        | —                                                 |
| `event-loop.md`            | править; с `javascript/event-loop.md` **не сливать** | ✅   | **Фаза Pending Callbacks описана словами фазы Poll** («handles almost all callbacks», «reading and writing files»); на деле это отложенные системные колбэки. «Delegated to the system kernel» — часть операций уходит в пул потоков libuv                                          | `process.nextTick` и микротаски между фазами      |
| `module-system.md`         | править                                              | ⚠️   | Врезка бессмысленна: «`module.exports` is a shorthand for module.exports a shorthand `exports`». `__dirname`, `require`, `module`, `exports` названы глобальными — это параметры обёртки CommonJS, в ESM их нет. «ES6 Modules» → ES modules                                         | Разница CJS и ESM по существу, `require(esm)`     |
| `npm.md`                   | править; перенести к фронтенд-инструментам           | ✅   | **«`npm-shrinkwrap.json` is recommended for libraries»** — документация npm советует обратное: для библиотек его не публикуют. Опечатка «automaticallt»                                                                                                                             | semver (`^`, `~`), виды зависимостей, npm vs pnpm |
| `socket-io.md`             | сократить вдвое                                      | ✅   | «Built on top of WebSockets API» — у Socket.IO свой протокол, обычный WebSocket-клиент к нему не подключится. `message` не является встроенным событием. Две трети страницы — справочник по комнатам                                                                                | —                                                 |

Замечание к плану: в этапе 2 записано «слить дубли … event loop в двух
разделах». По факту это не дубли: браузерная модель (задачи и микротаски) и фазы
libuv — разные ответы на разные вопросы. Достаточно перекрёстных ссылок.

## SQL

Тоже только исправление ошибок.

| Страница           | Вердикт                  | Акт. | Ошибки                                                                                                                                                                                                                             | Не хватает                     |
| ------------------ | ------------------------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `data-types.md`    | править                  | ✅   | `TIMESTAMP` «converts to server time» — к часовому поясу сессии (пример ниже это и показывает). В выводе примера колонка `times_tamp`. Пустой пункт списка в конце. Опечатки «dirrefence», «Desctiption»                           | —                              |
| `constraints.md`   | править                  | ✅   | `DEFAULT GETDATE()` — SQL Server, остальной раздел на MySQL. `only one` оформлено как код                                                                                                                                          | `ON DELETE CASCADE`            |
| `relationships.md` | править                  | ✅   | **Заголовок «One-to-Many (M:M)»** — должно быть Many-to-Many. В примере 1:1 у `UserID` нет `UNIQUE`, то есть это 1:M                                                                                                               | —                              |
| `commands.mdx`     | править; влить `crud.md` | ✅   | У `SELECT` нет ни синтаксиса, ни примера. В каждой группе вкладок `default` стоит на обеих                                                                                                                                         | `SELECT` с `JOIN` и `GROUP BY` |
| `transactions.md`  | править                  | ✅   | Пример на T-SQL (`@@ERROR`), и проверяет он только последний оператор. «Serializable … by locking the entire range of rows» — зависит от СУБД. Repeatable Read «allows phantom reads» — по стандарту да, в InnoDB и PostgreSQL нет | —                              |
| `crud.md`          | слить с `commands.mdx`   | ✅   | Повторяет раздел DML из `commands.mdx`                                                                                                                                                                                             | —                              |
| `nosql.md`         | оставить                 | ✅   | Пустой заголовок «Features», под ним разделы того же уровня. «Limited ACID» устарело для MongoDB. «Both MongoDB and DynamoDB» — без введения                                                                                       | —                              |

Сквозная проблема: примеры написаны на трёх диалектах вперемешку. Выбрать один
(PostgreSQL или MySQL) и оговорить это на странице раздела.

Единственный пробел, который стоит закрыть вопреки ограничению: **`JOIN`** —
если фронтендера спрашивают про SQL, то про него.
