'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Console = require('./console');

const {
  makePackageJson,
  makeTsConfig,
  makeWebpackConfig,
  makeBabelRc,
  makeIndexHtml,
  makeIndexTsx,
  makeAppTsx,
  makeGlobalsCss,
  makeGitIgnore,
  makeEnvFiles,
  makeEslintConfig,
  makePrettierConfig,
  makeJestConfig,
} = require('./base');

const { makeStore, makeRootReducer, makeCounterSlice, makeHooksTsx } = require('./redux');
const { makeRouterIndex, makeHomePage, makeNotFoundPage, makeAboutPage } = require('./routing');
const { makeErrorBoundary, makeErrorFallback } = require('./errorBoundary');
const { makeApiService, makeApiTypes } = require('./axios');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function step(msg) {
  Console.log(`  ${Console.FgCyan}→${Console.Reset} ${msg}`);
}

// ─── Main Generator ───────────────────────────────────────────────────────────

async function generateProject(targetDir, name, config) {
  let running = true;

  // Spinner while generating
  Console.spinner(
    ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    'Generating project files…',
    80,
    () => running
  );

  try {
    fs.mkdirSync(targetDir, { recursive: true });

    // ── Base files ──────────────────────────────────────────────────────────
    writeFile(path.join(targetDir, 'package.json'), makePackageJson(name, config));
    writeFile(path.join(targetDir, 'tsconfig.json'), makeTsConfig());
    writeFile(path.join(targetDir, 'webpack.config.js'), makeWebpackConfig(config));
    writeFile(path.join(targetDir, '.babelrc'), makeBabelRc());
    writeFile(path.join(targetDir, '.gitignore'), makeGitIgnore());
    writeFile(path.join(targetDir, 'public', 'index.html'), makeIndexHtml(name));
    writeFile(path.join(targetDir, 'src', 'index.tsx'), makeIndexTsx(config));
    writeFile(path.join(targetDir, 'src', 'App.tsx'), makeAppTsx(config));
    writeFile(path.join(targetDir, 'src', 'styles', 'globals.css'), makeGlobalsCss());

    // ── Environment config ──────────────────────────────────────────────────
    if (config.envConfig) {
      const envs = makeEnvFiles(name);
      writeFile(path.join(targetDir, '.env.development'), envs.dev);
      writeFile(path.join(targetDir, '.env.production'), envs.prod);
      writeFile(path.join(targetDir, '.env.example'), envs.example);
    }

    // ── ESLint + Prettier ───────────────────────────────────────────────────
    if (config.eslint) {
      writeFile(path.join(targetDir, '.eslintrc.js'), makeEslintConfig());
      writeFile(path.join(targetDir, '.prettierrc'), makePrettierConfig());
    }

    // ── Jest ────────────────────────────────────────────────────────────────
    if (config.jest) {
      writeFile(path.join(targetDir, 'jest.config.js'), makeJestConfig());
      writeFile(
        path.join(targetDir, 'src', '__tests__', 'App.test.tsx'),
        makeAppTest(config)
      );
    }

    // ── Redux ───────────────────────────────────────────────────────────────
    if (config.redux) {
      writeFile(path.join(targetDir, 'src', 'store', 'index.ts'), makeStore());
      writeFile(path.join(targetDir, 'src', 'store', 'rootReducer.ts'), makeRootReducer());
      writeFile(
        path.join(targetDir, 'src', 'features', 'counter', 'counterSlice.ts'),
        makeCounterSlice()
      );
      writeFile(path.join(targetDir, 'src', 'hooks', 'index.ts'), makeHooksTsx());
    }

    // ── Routing ─────────────────────────────────────────────────────────────
    if (config.routing) {
      writeFile(path.join(targetDir, 'src', 'routes', 'index.tsx'), makeRouterIndex(config));
      writeFile(path.join(targetDir, 'src', 'pages', 'Home.tsx'), makeHomePage(config));
      writeFile(path.join(targetDir, 'src', 'pages', 'About.tsx'), makeAboutPage());
      writeFile(path.join(targetDir, 'src', 'pages', 'NotFound.tsx'), makeNotFoundPage());
    }

    // ── Error Boundary ──────────────────────────────────────────────────────
    if (config.errorBoundary) {
      writeFile(
        path.join(targetDir, 'src', 'components', 'ErrorBoundary.tsx'),
        makeErrorBoundary()
      );
      writeFile(
        path.join(targetDir, 'src', 'components', 'ErrorFallback.tsx'),
        makeErrorFallback()
      );
    }

    // ── Axios ───────────────────────────────────────────────────────────────
    if (config.axios) {
      writeFile(path.join(targetDir, 'src', 'services', 'api.ts'), makeApiService(config));
      writeFile(path.join(targetDir, 'src', 'services', 'types.ts'), makeApiTypes());
    }

    // ── README ──────────────────────────────────────────────────────────────
    writeFile(path.join(targetDir, 'README.md'), makeReadme(name, config));

  } finally {
    running = false;
    // Small pause to let spinner clear
    await new Promise((r) => setTimeout(r, 200));
  }

  Console.log('');

  // ── File summary ──────────────────────────────────────────────────────────
  const generated = countFiles(targetDir);
  Console.success(`Generated ${generated} files in ${targetDir}`);

  Console.log('');
  Console.info(`Run ${Console.Bright}cd ${config.projectName} && ${config.packageManager} install${Console.Reset} to get started.`);
}

function countFiles(dir) {
  let count = 0;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (item === 'node_modules') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) count += countFiles(full);
    else count += 1;
  }
  return count;
}

// ─── App Test Template ────────────────────────────────────────────────────────
function makeAppTest(config) {
  return `import React from 'react';
import { render, screen } from '@testing-library/react';
${config.redux ? "import { Provider } from 'react-redux';\nimport { store } from '../store';" : ''}
${config.routing ? "import { MemoryRouter } from 'react-router-dom';" : ''}
import App from '../App';

${config.redux && config.routing ? `
const renderApp = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
` : config.redux ? `
const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
` : config.routing ? `
const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
` : `
const renderApp = () => render(<App />);
`}

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
    expect(document.body).toBeTruthy();
  });
});
`;
}

// ─── README ───────────────────────────────────────────────────────────────────
function makeReadme(name, config) {
  const features = [
    '- ⚡ **Webpack 5** + **Babel 7** with hot module replacement',
    '- 🔷 **TypeScript** (strict mode, path aliases)',
    config.redux && '- 🗄️ **Redux Toolkit** with typed hooks and example counter slice',
    config.routing && '- 🧭 **React Router v6** with lazy-loaded pages',
    config.errorBoundary && '- 🛡️ **Error Boundary** with fallback UI',
    config.axios && '- 🌐 **Axios** pre-configured with interceptors and base URL',
    config.envConfig && '- 🔐 **Environment config** via dotenv-webpack',
    config.eslint && '- 🎨 **ESLint + Prettier** with Airbnb TypeScript rules',
    config.jest && '- 🧪 **Jest + Testing Library** ready for unit tests',
  ]
    .filter(Boolean)
    .join('\n');

  return `# ${name}

> Scaffolded with [Budgie React](https://github.com/yashdatir/budgie-react) 🐦

## Features

${features}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
${config.jest ? '\n# Run tests\nnpm test' : ''}
\`\`\`

## Project Structure

\`\`\`
src/
├── index.tsx          # App entry point
├── App.tsx            # Root component${config.redux ? '\n├── store/             # Redux store & root reducer\n├── features/          # Redux slices (e.g. counter)\n├── hooks/             # Typed useAppDispatch / useAppSelector' : ''}${config.routing ? '\n├── routes/            # Route definitions\n├── pages/             # Page components (Home, About, 404)' : ''}${config.errorBoundary ? '\n├── components/        # ErrorBoundary, ErrorFallback' : ''}${config.axios ? '\n├── services/          # Axios instance + API types' : ''}
└── styles/            # Global CSS
public/
└── index.html
\`\`\`
${config.redux ? `
## Redux

Slices live under \`src/features/\`. Use the typed hooks from \`src/hooks/\`:

\`\`\`tsx
import { useAppSelector, useAppDispatch } from './hooks';
import { increment } from './features/counter/counterSlice';

const count = useAppSelector((s) => s.counter.value);
const dispatch = useAppDispatch();
dispatch(increment());
\`\`\`
` : ''}
${config.axios ? `
## HTTP Client

The Axios instance in \`src/services/api.ts\` reads \`REACT_APP_API_URL\` from your env file.

\`\`\`ts
import api from './services/api';
const data = await api.get('/users');
\`\`\`
` : ''}

## License

MIT
`;
}

module.exports = { generateProject };
