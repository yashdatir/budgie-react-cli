'use strict';

const readline = require('readline');
const Console = require('./console');

// ─── Inline checkbox prompt ──────────────────────────────────────────────────
// budgie-console handles single-line prompts; we build a multi-select on top.

const FEATURES = [
  {
    key: 'redux',
    label: 'Redux Toolkit',
    description: 'State management with @reduxjs/toolkit + react-redux',
  },
  {
    key: 'routing',
    label: 'React Router v6',
    description: 'Client-side routing with react-router-dom',
  },
  {
    key: 'errorBoundary',
    label: 'Error Boundaries',
    description: 'Global error boundary component + fallback UI',
  },
  {
    key: 'axios',
    label: 'Axios HTTP Client',
    description: 'Pre-configured Axios instance with interceptors',
  },
  {
    key: 'envConfig',
    label: 'Environment Config',
    description: '.env.development / .env.production + dotenv-webpack',
  },
  {
    key: 'eslint',
    label: 'ESLint + Prettier',
    description: 'Airbnb TypeScript rules + auto-format on save',
  },
  {
    key: 'jest',
    label: 'Jest + Testing Library',
    description: 'Unit test setup with @testing-library/react',
  },
];

const PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm'];

/**
 * Renders a numbered feature list and reads a comma-separated selection.
 */
async function selectFeatures() {
  Console.log(
    Console.FgYellow + '? ' + Console.Reset + 'Select features to include:'
  );
  Console.log(
    Console.Dim + '  (Enter comma-separated numbers, e.g. 1,2,3 — or "all" / Enter to skip)' + Console.Reset
  );
  Console.log('');

  Console.table(
    FEATURES.map((f, i) => [String(i + 1), f.label, f.description]),
    ['#', 'Feature', 'Description']
  );
  Console.log('');

  const raw = await Console.prompt(
    Console.FgCyan + '> ' + Console.Reset
  );
  const trimmed = raw.trim().toLowerCase();

  if (trimmed === 'all') {
    return FEATURES.reduce((acc, f) => ({ ...acc, [f.key]: true }), {});
  }

  if (!trimmed) {
    return FEATURES.reduce((acc, f) => ({ ...acc, [f.key]: false }), {});
  }

  const indices = trimmed
    .split(',')
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < FEATURES.length);

  return FEATURES.reduce((acc, f, i) => {
    acc[f.key] = indices.includes(i);
    return acc;
  }, {});
}

/**
 * Ask which package manager to use.
 */
async function selectPackageManager() {
  Console.log('');
  Console.log(
    Console.FgYellow +
      '? ' +
      Console.Reset +
      `Package manager ${Console.Dim}(1 = npm, 2 = yarn, 3 = pnpm — default: 1)${Console.Reset}:`
  );

  const raw = await Console.prompt(Console.FgCyan + '> ' + Console.Reset);
  const choice = parseInt(raw.trim(), 10);

  if (choice >= 1 && choice <= 3) return PACKAGE_MANAGERS[choice - 1];
  return 'npm';
}

/**
 * Ask for project description (optional).
 */
async function askDescription() {
  const raw = await Console.prompt(
    Console.FgCyan + '? ' + Console.Reset + 'Project description (optional): '
  );
  return raw.trim() || '';
}

/**
 * Ask for author name (optional).
 */
async function askAuthor() {
  const raw = await Console.prompt(
    Console.FgCyan + '? ' + Console.Reset + 'Author name (optional): '
  );
  return raw.trim() || '';
}

/**
 * Main prompt orchestrator — returns full config object.
 */
async function askProjectConfig(projectName) {
  const description = await askDescription();
  const author = await askAuthor();

  Console.log('');
  const features = await selectFeatures();
  const packageManager = await selectPackageManager();

  Console.log('');
  Console.divider('─', 52, Console.FgCyan);
  Console.info('Your configuration:');
  Console.log('');

  const summary = [
    ['Project', projectName],
    ['Description', description || '—'],
    ['Author', author || '—'],
    ['Package Manager', packageManager],
    ...FEATURES.map((f) => [f.label, features[f.key] ? '✔  Yes' : '✖  No']),
  ];
  Console.table(summary, ['Setting', 'Value']);

  Console.log('');
  const confirm = await Console.prompt(
    Console.FgYellow +
      '? ' +
      Console.Reset +
      'Looks good? Press Enter to generate, or type "no" to exit: '
  );

  if (confirm.trim().toLowerCase() === 'no') {
    Console.warn('Aborted. No files were created.');
    process.exit(0);
  }

  return { projectName, description, author, packageManager, ...features };
}

module.exports = { askProjectConfig };
