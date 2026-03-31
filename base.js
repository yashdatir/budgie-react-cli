'use strict';

// ─── package.json ─────────────────────────────────────────────────────────────
function makePackageJson(name, config) {
  const deps = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  };

  const devDeps = {
    '@babel/core': '^7.24.0',
    '@babel/preset-env': '^7.24.0',
    '@babel/preset-react': '^7.24.0',
    '@babel/preset-typescript': '^7.24.0',
    '@babel/plugin-transform-runtime': '^7.24.0',
    '@babel/runtime': '^7.24.0',
    '@types/react': '^18.3.3',
    '@types/react-dom': '^18.3.0',
    'babel-loader': '^9.1.3',
    'css-loader': '^7.1.2',
    'style-loader': '^4.0.0',
    'html-webpack-plugin': '^5.6.0',
    'webpack': '^5.91.0',
    'webpack-cli': '^5.1.4',
    'webpack-dev-server': '^5.0.4',
    typescript: '^5.4.5',
    'ts-loader': '^9.5.1',
  };

  if (config.redux) {
    deps['@reduxjs/toolkit'] = '^2.2.3';
    deps['react-redux'] = '^9.1.2';
    devDeps['@types/react-redux'] = '^7.1.33';
  }

  if (config.routing) {
    deps['react-router-dom'] = '^6.23.1';
    devDeps['@types/react-router-dom'] = '^5.3.3';
  }

  if (config.axios) {
    deps['axios'] = '^1.7.2';
  }

  if (config.envConfig) {
    devDeps['dotenv-webpack'] = '^8.1.0';
  }

  if (config.eslint) {
    devDeps['eslint'] = '^8.57.0';
    devDeps['@typescript-eslint/eslint-plugin'] = '^7.10.0';
    devDeps['@typescript-eslint/parser'] = '^7.10.0';
    devDeps['eslint-config-airbnb'] = '^19.0.4';
    devDeps['eslint-config-airbnb-typescript'] = '^18.0.0';
    devDeps['eslint-config-prettier'] = '^9.1.0';
    devDeps['eslint-plugin-import'] = '^2.29.1';
    devDeps['eslint-plugin-jsx-a11y'] = '^6.8.0';
    devDeps['eslint-plugin-react'] = '^7.34.2';
    devDeps['eslint-plugin-react-hooks'] = '^4.6.2';
    devDeps['prettier'] = '^3.3.2';
  }

  if (config.jest) {
    devDeps['jest'] = '^29.7.0';
    devDeps['jest-environment-jsdom'] = '^29.7.0';
    devDeps['@testing-library/react'] = '^16.0.0';
    devDeps['@testing-library/jest-dom'] = '^6.4.5';
    devDeps['@testing-library/user-event'] = '^14.5.2';
    devDeps['@types/jest'] = '^29.5.12';
    devDeps['babel-jest'] = '^29.7.0';
  }

  const scripts = {
    dev: 'webpack serve --config webpack.config.js --mode development',
    build: 'webpack --config webpack.config.js --mode production',
    start: 'webpack serve --config webpack.config.js --mode development',
    'type-check': 'tsc --noEmit',
  };

  if (config.eslint) {
    scripts.lint = 'eslint src --ext .ts,.tsx';
    scripts['lint:fix'] = 'eslint src --ext .ts,.tsx --fix';
    scripts.format = 'prettier --write "src/**/*.{ts,tsx,css}"';
  }

  if (config.jest) {
    scripts.test = 'jest';
    scripts['test:watch'] = 'jest --watch';
    scripts['test:coverage'] = 'jest --coverage';
  }

  return JSON.stringify(
    {
      name,
      version: '0.1.0',
      private: true,
      description: config.description || `${name} — a Budgie React app`,
      author: config.author || '',
      license: 'MIT',
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    },
    null,
    2
  );
}

// ─── tsconfig.json ────────────────────────────────────────────────────────────
function makeTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
          '@components/*': ['src/components/*'],
          '@pages/*': ['src/pages/*'],
          '@store/*': ['src/store/*'],
          '@features/*': ['src/features/*'],
          '@hooks/*': ['src/hooks/*'],
          '@services/*': ['src/services/*'],
          '@styles/*': ['src/styles/*'],
        },
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    },
    null,
    2
  );
}

// ─── webpack.config.js ────────────────────────────────────────────────────────
function makeWebpackConfig(config) {
  const dotenvImport = config.envConfig
    ? `const Dotenv = require('dotenv-webpack');\n`
    : '';

  const dotenvPlugin = config.envConfig
    ? `    new Dotenv({ path: \`./.env.\${process.env.NODE_ENV || 'development'}\`, safe: true }),`
    : '';

  return `'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
${dotenvImport}
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@styles': path.resolve(__dirname, 'src/styles'),
      },
    },

    module: {
      rules: [
        {
          test: /\\.(ts|tsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\\.(png|jpg|jpeg|gif|svg|ico)$/,
          type: 'asset/resource',
          generator: { filename: 'assets/images/[name].[hash][ext]' },
        },
        {
          test: /\\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: { filename: 'assets/fonts/[name].[hash][ext]' },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
      }),
${dotenvPlugin}
    ].filter(Boolean),

    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: true,
      compress: true,
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    },

    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    performance: {
      hints: isProduction ? 'warning' : false,
    },
  };
};
`;
}

// ─── .babelrc ─────────────────────────────────────────────────────────────────
function makeBabelRc() {
  return JSON.stringify(
    {
      presets: [
        ['@babel/preset-env', { targets: { browsers: ['> 0.5%', 'last 2 versions', 'not dead'] } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    },
    null,
    2
  );
}

// ─── public/index.html ────────────────────────────────────────────────────────
function makeIndexHtml(name) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${name} — built with Budgie React" />
    <meta name="theme-color" content="#0ea5e9" />
    <title>${name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
}

// ─── src/index.tsx ────────────────────────────────────────────────────────────
function makeIndexTsx(config) {
  const reduxImport = config.redux
    ? `import { Provider } from 'react-redux';\nimport { store } from './store';\n`
    : '';

  const routerImport = config.routing
    ? `import { BrowserRouter } from 'react-router-dom';\n`
    : '';

  const errorBoundaryImport = config.errorBoundary
    ? `import ErrorBoundary from './components/ErrorBoundary';\nimport ErrorFallback from './components/ErrorFallback';\n`
    : '';

  let appJsx = '<App />';

  if (config.errorBoundary) {
    appJsx = `<ErrorBoundary fallback={<ErrorFallback />}>\n        ${appJsx}\n      </ErrorBoundary>`;
  }

  if (config.routing) {
    appJsx = `<BrowserRouter>\n        ${appJsx}\n      </BrowserRouter>`;
  }

  if (config.redux) {
    appJsx = `<Provider store={store}>\n        ${appJsx}\n      </Provider>`;
  }

  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
${reduxImport}${routerImport}${errorBoundaryImport}import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    ${appJsx}
  </React.StrictMode>
);
`;
}

// ─── src/App.tsx ──────────────────────────────────────────────────────────────
function makeAppTsx(config) {
  if (config.routing) {
    return `import React from 'react';
import { AppRoutes } from './routes';

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;
`;
  }

  const reduxSection = config.redux
    ? `
import { useAppSelector, useAppDispatch } from './hooks';
import { increment, decrement, reset } from './features/counter/counterSlice';
`
    : '';

  const reduxBody = config.redux
    ? `
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
`
    : '';

  const reduxUI = config.redux
    ? `
        <div className="counter">
          <h2>Counter: {count}</h2>
          <button onClick={() => dispatch(decrement())}>−</button>
          <button onClick={() => dispatch(reset())}>Reset</button>
          <button onClick={() => dispatch(increment())}>+</button>
        </div>`
    : '';

  return `import React from 'react';
${reduxSection}
const App: React.FC = () => {${reduxBody}
  return (
    <div className="app">
      <header className="app-header">
        <h1>🐦 Welcome to Budgie React</h1>
        <p>TypeScript + Webpack 5 starter — edit <code>src/App.tsx</code> to begin.</p>${reduxUI}
      </header>
    </div>
  );
};

export default App;
`;
}

// ─── src/styles/globals.css ───────────────────────────────────────────────────
function makeGlobalsCss() {
  return `*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-primary: #0ea5e9;
  --color-primary-dark: #0284c7;
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-border: #334155;
  --radius: 8px;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'Cascadia Code', Consolas, monospace;
}

html,
body {
  height: 100%;
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1.5rem;
  text-align: center;
  padding: 2rem;
}

.app-header h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--color-primary);
}

.app-header p {
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

.app-header code {
  font-family: var(--font-mono);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.1em 0.4em;
  font-size: 0.9em;
  color: var(--color-primary);
}

/* Counter demo */
.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.counter h2 {
  font-size: 1.5rem;
  min-width: 140px;
  text-align: center;
}

.counter button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1.25rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.counter button:hover {
  background: var(--color-primary-dark);
}

/* Page layout */
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.page h1 {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.page p {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

/* Nav */
nav {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover,
nav a.active {
  color: var(--color-primary);
}

/* Error boundary */
.error-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.error-fallback h2 {
  font-size: 1.8rem;
  color: #f87171;
}

.error-fallback button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}

/* 404 */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 1rem;
  text-align: center;
}

.not-found h1 {
  font-size: 6rem;
  color: var(--color-primary);
  line-height: 1;
}
`;
}

// ─── .gitignore ───────────────────────────────────────────────────────────────
function makeGitIgnore() {
  return `# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# Coverage
coverage/
`;
}

// ─── .env files ───────────────────────────────────────────────────────────────
function makeEnvFiles(name) {
  const common = `# App
REACT_APP_NAME=${name}
REACT_APP_VERSION=0.1.0

# API
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_API_TIMEOUT=10000
`;

  return {
    dev: `# Development Environment\n${common}`,
    prod: `# Production Environment\nREACT_APP_NAME=${name}\nREACT_APP_VERSION=0.1.0\n\nREACT_APP_API_URL=https://api.yourdomain.com/api\nREACT_APP_API_TIMEOUT=15000\n`,
    example: `# Copy to .env.development or .env.production\n${common}`,
  };
}

// ─── .eslintrc.js ─────────────────────────────────────────────────────────────
function makeEslintConfig() {
  return `module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  settings: { react: { version: 'detect' } },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
`;
}

// ─── .prettierrc ──────────────────────────────────────────────────────────────
function makePrettierConfig() {
  return JSON.stringify(
    {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
      bracketSameLine: false,
      arrowParens: 'always',
    },
    null,
    2
  );
}

// ─── jest.config.js ───────────────────────────────────────────────────────────
function makeJestConfig() {
  return `module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  setupFilesAfterFramework: [],
  setupFiles: [],
  setupFilesAfterFramework: [],
  moduleNameMapper: {
    '\\\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/index.tsx'],
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
`;
}

module.exports = {
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
};
