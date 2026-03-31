'use strict';

/**
 * lib/console.js
 *
 * Bundled implementation of budgie-console (https://www.npmjs.com/package/budgie-console)
 * Inlined so budgie-react has zero external runtime dependencies and works
 * immediately after a global `npm install -g budgie-react`.
 *
 * Full API: log, success, error, warn, info, spinner, progress, table, box, divider, prompt, clear
 * Plus all ANSI style / colour constants.
 */

const readline = require('readline');

// ── ANSI Styles ───────────────────────────────────────────────────────────────
const Reset      = '\x1b[0m';
const Bright     = '\x1b[1m';
const Dim        = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink      = '\x1b[5m';
const Reverse    = '\x1b[7m';
const Hidden     = '\x1b[8m';

// ── Foreground colours ────────────────────────────────────────────────────────
const FgBlack   = '\x1b[30m';
const FgRed     = '\x1b[31m';
const FgGreen   = '\x1b[32m';
const FgYellow  = '\x1b[33m';
const FgBlue    = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan    = '\x1b[36m';
const FgWhite   = '\x1b[37m';

// ── Background colours ────────────────────────────────────────────────────────
const BgBlack   = '\x1b[40m';
const BgRed     = '\x1b[41m';
const BgGreen   = '\x1b[42m';
const BgYellow  = '\x1b[43m';
const BgBlue    = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan    = '\x1b[46m';
const BgWhite   = '\x1b[47m';

// ── Core log ──────────────────────────────────────────────────────────────────
function log(...props) {
  process.stdout.write(props.map(String).join('') + Reset + '\n');
}

// ── Log levels ────────────────────────────────────────────────────────────────
function success(msg) { log(FgGreen,   '✔  ' + Reset + msg); }
function error(msg)   { log(FgRed,    '✖  ' + Reset + msg); }
function warn(msg)    { log(FgYellow, '⚠  ' + Reset + msg); }
function info(msg)    { log(FgCyan,   'ℹ  ' + Reset + msg); }

// ── Spinner ───────────────────────────────────────────────────────────────────
const DEFAULT_FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

function spinner(
  frames   = DEFAULT_FRAMES,
  text     = '',
  speed    = 100,
  statusFn = () => true
) {
  let i = 0;
  const clearWidth = (frames[0] || '-').length + text.length + 4;
  const iv = setInterval(() => {
    if (!statusFn()) {
      clearInterval(iv);
      process.stdout.write('\r' + ' '.repeat(clearWidth) + '\r');
      return;
    }
    const frame = frames[i % frames.length];
    process.stdout.write('\r' + FgCyan + frame + Reset + '  ' + text);
    i++;
  }, speed);
  return iv;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function progress(current, total, width = 30, color = FgGreen) {
  const pct    = Math.min(current / total, 1);
  const filled = Math.round(pct * width);
  const empty  = width - filled;
  const bar    = color + '█'.repeat(filled) + Dim + '░'.repeat(empty) + Reset;
  const label  = `${Math.round(pct * 100)}%`.padStart(4);
  process.stdout.write(`\r[${bar}] ${label}`);
  if (current >= total) process.stdout.write('\n');
}

// ── Table ─────────────────────────────────────────────────────────────────────
function table(rows, headers) {
  const allRows = headers ? [headers, ...rows] : rows;
  if (!allRows.length) return;
  const cols   = allRows[0].length;
  const widths = Array.from({ length: cols }, (_, c) =>
    Math.max(...allRows.map((r) => String(r[c] ?? '').length))
  );

  const hRule = (l, m, r, f) =>
    l + widths.map((w) => f.repeat(w + 2)).join(m) + r;

  const rowLine = (cells) =>
    '│' + cells.map((c, i) => ' ' + String(c ?? '').padEnd(widths[i]) + ' ').join('│') + '│';

  log(FgCyan + hRule('┌', '┬', '┐', '─') + Reset);
  allRows.forEach((r, i) => {
    if (i === 0 && headers) {
      log(FgCyan + rowLine(r) + Reset);
      log(FgCyan + hRule('├', '┼', '┤', '─') + Reset);
    } else {
      log(rowLine(r));
    }
  });
  log(FgCyan + hRule('└', '┴', '┘', '─') + Reset);
}

// ── Box ───────────────────────────────────────────────────────────────────────
function box(text, color = Reset) {
  const len = text.length;
  log(color + '┌' + '─'.repeat(len + 2) + '┐' + Reset);
  log(color + '│ ' + Reset + text + color + ' │' + Reset);
  log(color + '└' + '─'.repeat(len + 2) + '┘' + Reset);
}

// ── Divider ───────────────────────────────────────────────────────────────────
function divider(char = '─', length = 40, color = Dim) {
  log(color + char.repeat(length) + Reset);
}

// ── Prompt (async) ────────────────────────────────────────────────────────────
function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input:  process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// ── Clear ─────────────────────────────────────────────────────────────────────
function clear() {
  process.stdout.write('\x1b[2J\x1b[0f');
}

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  // Styles
  Reset, Bright, Dim, Underscore, Blink, Reverse, Hidden,
  // Foreground
  FgBlack, FgRed, FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite,
  // Background
  BgBlack, BgRed, BgGreen, BgYellow, BgBlue, BgMagenta, BgCyan, BgWhite,
  // Methods
  log, success, error, warn, info,
  spinner, progress, table, box, divider, prompt, clear,
};
