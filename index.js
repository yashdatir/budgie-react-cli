#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const Console = require('./console');
const { askProjectConfig } = require('./prompts');
const { generateProject } = require('./generator');

const args = process.argv.slice(2);
const projectName = args[0];

async function main() {
  // ── Banner ──────────────────────────────────────────────────────────────
  Console.clear();
  Console.divider('═', 52, Console.FgCyan);
  Console.box(
    '  🐦  Budgie React  —  React Project Initializer  ',
    Console.FgCyan
  );
  Console.divider('═', 52, Console.FgCyan);
  Console.log('');

  // ── Project name ─────────────────────────────────────────────────────────
  let name = projectName;
  if (!name) {
    const raw = await Console.prompt(
      Console.FgCyan + '? ' + Console.Reset + 'Project name: '
    );
    name = raw.trim();
  }

  if (!name || !/^[a-z0-9-_]+$/i.test(name)) {
    Console.error(
      'Invalid project name. Use only letters, numbers, hyphens or underscores.'
    );
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), name);

  if (fs.existsSync(targetDir)) {
    Console.error(`Directory "${name}" already exists. Choose a different name.`);
    process.exit(1);
  }

  Console.log('');
  Console.info(`Creating project: ${Console.Bright}${name}${Console.Reset}`);
  Console.log('');

  // ── Feature selection ─────────────────────────────────────────────────────
  const config = await askProjectConfig(name);

  Console.log('');
  Console.divider('─', 52, Console.FgCyan);
  Console.info('Scaffolding your project…');
  Console.divider('─', 52, Console.FgCyan);
  Console.log('');

  // ── Generate ──────────────────────────────────────────────────────────────
  await generateProject(targetDir, name, config);

  // ── Done ─────────────────────────────────────────────────────────────────
  Console.log('');
  Console.divider('═', 52, Console.FgGreen);
  Console.success(`Project "${name}" created successfully!`);
  Console.divider('═', 52, Console.FgGreen);
  Console.log('');
  Console.log(Console.FgWhite + '  Next steps:' + Console.Reset);
  Console.log('');
  Console.log(`  ${Console.FgCyan}cd ${name}${Console.Reset}`);
  Console.log(`  ${Console.FgCyan}npm install${Console.Reset}`);
  Console.log(`  ${Console.FgCyan}npm run dev${Console.Reset}`);
  Console.log('');

  if (config.redux) {
    Console.info('Redux Toolkit store is pre-configured in src/store/');
  }
  if (config.routing) {
    Console.info('React Router v6 routes live in src/routes/');
  }
  if (config.errorBoundary) {
    Console.info('ErrorBoundary component is at src/components/ErrorBoundary.tsx');
  }
  if (config.axios) {
    Console.info('Axios HTTP client is pre-configured in src/services/api.ts');
  }
  if (config.envConfig) {
    Console.info('Environment config ready — edit .env.development / .env.production');
  }

  Console.log('');
  Console.log(
    Console.Dim + '  Happy coding with Budgie React! 🐦' + Console.Reset
  );
  Console.log('');
}

main().catch((err) => {
  Console.error(err.message || String(err));
  process.exit(1);
});
