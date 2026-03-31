# 🐦 Budgie React

> A flexible, interactive React project initializer — TypeScript by default, batteries included.

[![npm version](https://img.shields.io/npm/v/budgie-react.svg)](https://www.npmjs.com/package/budgie-react)
[![Node >=14](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](https://nodejs.org)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## Quick Start

```bash
# Run interactively via npx (no install needed)
npx budgie-react my-app

# Or install globally once
npm install -g budgie-react
budgie-react my-app
```

You'll be guided through an interactive CLI to pick exactly what you need.

---

## What It Does

Budgie React scaffolds a fully configured React project in seconds. After answering a few prompts, you get a production-ready boilerplate with only the features you actually want.

```
? Project description (optional):
? Author name (optional):
? Select features to include:

  ┌───┬───────────────────────┬─────────────────────────────────────────────────────┐
  │ # │ Feature               │ Description                                         │
  ├───┼───────────────────────┼─────────────────────────────────────────────────────┤
  │ 1 │ Redux Toolkit         │ State management with @reduxjs/toolkit + react-redux │
  │ 2 │ React Router v6       │ Client-side routing with react-router-dom            │
  │ 3 │ Error Boundaries      │ Global error boundary component + fallback UI        │
  │ 4 │ Axios HTTP Client     │ Pre-configured Axios instance with interceptors      │
  │ 5 │ Environment Config    │ .env.development / .env.production + dotenv-webpack  │
  │ 6 │ ESLint + Prettier     │ Airbnb TypeScript rules + auto-format on save        │
  │ 7 │ Jest + Testing Library│ Unit test setup with @testing-library/react          │
  └───┴───────────────────────┴─────────────────────────────────────────────────────┘

> 1,2,3,5   ← comma-separated numbers, "all", or Enter to skip
```

---

## Features

| Feature | Always included |
|---|---|
| ⚡ Webpack 5 + HMR | ✅ |
| 🔷 TypeScript (strict) | ✅ |
| 🏷️ Path aliases (`@/*`, `@components/*`, …) | ✅ |
| 🎨 CSS Modules-ready | ✅ |
| 📦 Vendor code-splitting | ✅ |

| Feature | Optional |
|---|---|
| 🗄️ Redux Toolkit + typed hooks | `--redux` |
| 🧭 React Router v6 (lazy pages) | `--routing` |
| 🛡️ Error Boundary + fallback UI | `--error-boundary` |
| 🌐 Axios + interceptors | `--axios` |
| 🔐 dotenv-webpack env config | `--env-config` |
| 🎯 ESLint (Airbnb TS) + Prettier | `--eslint` |
| 🧪 Jest + Testing Library | `--jest` |

---

## Generated Project Structure

```
my-app/
├── public/
│   └── index.html
├── src/
│   ├── index.tsx            ← entry point (wires up Provider, BrowserRouter, etc.)
│   ├── App.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── store/               ← (Redux) configureStore + RootState types
│   │   ├── index.ts
│   │   └── rootReducer.ts
│   ├── features/            ← (Redux) slices
│   │   └── counter/
│   │       └── counterSlice.ts
│   ├── hooks/               ← (Redux) useAppDispatch + useAppSelector
│   │   └── index.ts
│   ├── routes/              ← (Router) AppRoutes + lazy page loading
│   │   └── index.tsx
│   ├── pages/               ← (Router) Home, About, NotFound
│   ├── components/          ← (Error Boundary) ErrorBoundary, ErrorFallback
│   ├── services/            ← (Axios) api.ts + types.ts
│   └── __tests__/           ← (Jest) App.test.tsx
├── webpack.config.js
├── tsconfig.json
├── .babelrc
├── .eslintrc.js             ← (ESLint)
├── .prettierrc              ← (Prettier)
├── jest.config.js           ← (Jest)
├── .env.development         ← (Env Config)
├── .env.production
└── package.json
```

---

## Available Scripts (in generated project)

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server on `localhost:3000` with HMR |
| `npm run build` | Production build (minified, content-hashed) |
| `npm run type-check` | Run TypeScript compiler check (no emit) |
| `npm run lint` | Run ESLint on `src/` |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |

---

## TypeScript Path Aliases

The following path aliases work out of the box in both webpack and TypeScript:

```ts
import { useAppSelector } from '@hooks';
import HomePage from '@pages/Home';
import api from '@services/api';
import { store } from '@store';
```

---

## Redux Usage

Typed hooks are pre-wired so you never need to cast manually:

```tsx
import { useAppSelector, useAppDispatch } from '@hooks';
import { increment, incrementByAmount } from '@features/counter/counterSlice';

const Counter = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
};
```

Add new slices under `src/features/` and register them in `src/store/rootReducer.ts`.

---

## Axios Usage

The Axios instance reads `REACT_APP_API_URL` from your env file and attaches `Authorization` headers automatically:

```ts
import api from '@services/api';

// GET
const { data } = await api.get<User[]>('/users');

// POST
const { data: newUser } = await api.post<User>('/users', { name: 'Alice' });
```

---

## Error Boundary Usage

`ErrorBoundary` is wired at the root in `src/index.tsx`. You can also nest it around individual components:

```tsx
import ErrorBoundary from '@components/ErrorBoundary';

<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
  onError={(err, info) => logToSentry(err, info)}
>
  <RiskyComponent />
</ErrorBoundary>
```

---

## Powered by budgie-console 🐦

The CLI output is styled using [`budgie-console`](https://www.npmjs.com/package/budgie-console) — colored logs, spinners, progress bars, and bordered tables, all with zero dependencies.

---

## License

ISC © [Yash Datir](https://github.com/yashdatir)
