#!/usr/bin/env node

import { Command } from 'commander';
import { 
  navigate, screenshot, consoleLogs, click, performance, network,
  snapshot, emulate, lighthouse, hover, evaluate,
  listPages, newPage, selectPage, closePage, fill
} from './commands/index.js';

const program = new Command();

program
  .name('cdp-cli')
  .description('CLI tool for Chrome DevTools Protocol via MCP')
  .version('1.0.0');

// Navigation
program
  .command('navigate <url>')
  .description('Navigate to a URL')
  .action(navigate);

// Debugging
program
  .command('screenshot <output> [url]')
  .description('Take a screenshot of current page or URL')
  .action((output, url) => screenshot(url, output));

program
  .command('snapshot [url]')
  .description('Take a DOM snapshot (optionally navigate to URL first)')
  .action(snapshot);

program
  .command('console [url]')
  .description('Capture console logs from current page or URL')
  .action(consoleLogs);

program
  .command('evaluate <function> [url]')
  .description('Execute JavaScript function on current page or URL')
  .action((func, url) => evaluate(url, func));

// Performance & Auditing
program
  .command('performance <url>')
  .description('Analyze performance of a URL')
  .action(performance);

program
  .command('lighthouse <url>')
  .description('Run Lighthouse audit')
  .action(lighthouse);

program
  .command('network [url]')
  .description('Capture network requests from current page or URL')
  .action(network);

// Interaction
program
  .command('click <url> <uid>')
  .description('Click an element (use snapshot to get UID)')
  .action(click);

program
  .command('hover <url> <uid>')
  .description('Hover over an element (use snapshot to get UID)')
  .action(hover);

program
  .command('fill <url> <uid> <value>')
  .description('Fill an input field (use snapshot to get UID)')
  .action(fill);

// Emulation
program
  .command('emulate <url> <device>')
  .description('Emulate a device (e.g., "iPhone 12")')
  .action(emulate);

// Page Management
program
  .command('pages')
  .alias('list-pages')
  .description('List all open pages')
  .action(listPages);

program
  .command('new-page <url>')
  .description('Open a new page')
  .action(newPage);

program
  .command('select-page <pageId>')
  .description('Switch to a specific page')
  .action(selectPage);

program
  .command('close-page <pageId>')
  .description('Close a specific page')
  .action(closePage);

program.parse();
