#!/usr/bin/env node

/**
 * ECC Universal - Main CLI Entry Point
 * Harness-native agent operating system for Claude Code, Cursor, OpenCode, Codex, Gemini, and terminal workflows
 * 
 * Usage:
 *   npx ecc [command] [args]
 *   npx ecc status
 *   npx ecc list-installed
 *   npx ecc doctor
 *   npx ecc repair
 */

const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');

// Import utilities
const utils = require('./lib/utils');
const packageManager = require('./lib/package-manager');

const VERSION = '2.0.0-rc.1';

const COMMANDS = {
  status: 'Show installation status and health',
  'list-installed': 'List installed ECC components',
  doctor: 'Run diagnostics on ECC installation',
  repair: 'Repair broken or missing components',
  consult: 'Find and install components by capability',
  install: 'Install ECC components or profiles',
  'setup-pm': 'Configure package manager',
  uninstall: 'Remove ECC-managed files',
  version: 'Show version information',
  help: 'Show this help message',
};

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case 'status':
        return await handleStatus(commandArgs);
      case 'list-installed':
        return await handleListInstalled(commandArgs);
      case 'doctor':
        return await handleDoctor(commandArgs);
      case 'repair':
        return await handleRepair(commandArgs);
      case 'consult':
        return await handleConsult(commandArgs);
      case 'install':
        return await handleInstall(commandArgs);
      case 'setup-pm':
        return await handleSetupPM(commandArgs);
      case 'uninstall':
        return await handleUninstall(commandArgs);
      case 'version':
        return handleVersion();
      case 'help':
      case '--help':
      case '-h':
        return handleHelp();
      default:
        console.error(`❌ Unknown command: ${command}\n`);
        handleHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function handleStatus() {
  console.log('\n📊 ECC Installation Status\n');
  
  const homeDir = utils.getHomeDirectory();
  const claudeDir = path.join(homeDir, '.claude');
  
  console.log(`Home Directory: ${homeDir}`);
  console.log(`Claude Config: ${claudeDir}`);
  console.log(`Node Version: ${process.version}`);
  console.log(`ECC Version: ${VERSION}\n`);

  // Check installation paths
  const installPaths = {
    'Agents': path.join(claudeDir, 'agents'),
    'Rules': path.join(claudeDir, 'rules'),
    'Skills': path.join(claudeDir, 'skills'),
    'Hooks': path.join(claudeDir, 'hooks'),
    'Commands': path.join(claudeDir, 'commands'),
  };

  for (const [name, dir] of Object.entries(installPaths)) {
    const exists = utils.directoryExists(dir);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${name}: ${dir}`);
  }

  console.log('\n✅ Status check complete\n');
}

async function handleListInstalled() {
  console.log('\n📦 Installed ECC Components\n');
  
  const homeDir = utils.getHomeDirectory();
  const claudeDir = path.join(homeDir, '.claude');

  const components = {
    agents: path.join(claudeDir, 'agents'),
    rules: path.join(claudeDir, 'rules'),
    skills: path.join(claudeDir, 'skills'),
    hooks: path.join(claudeDir, 'hooks'),
    commands: path.join(claudeDir, 'commands'),
  };

  for (const [component, dir] of Object.entries(components)) {
    if (utils.directoryExists(dir)) {
      const items = utils.listDirectory(dir);
      console.log(`\n${component.toUpperCase()} (${items.length} items):`);
      items.forEach(item => console.log(`  • ${item}`));
    }
  }

  console.log('\n✅ List complete\n');
}

async function handleDoctor() {
  console.log('\n🔍 Running ECC Health Diagnostics\n');

  const checks = [
    {
      name: 'Node.js version',
      test: () => {
        const version = parseInt(process.version.slice(1).split('.')[0]);
        return version >= 18 ? { pass: true } : { 
          pass: false, 
          message: `Node.js 18+ required, found ${process.version}` 
        };
      },
    },
    {
      name: 'Package manager',
      test: async () => {
        try {
          const pm = await packageManager.detect();
          return { pass: true, message: `Detected: ${pm}` };
        } catch (err) {
          return { pass: false, message: err.message };
        }
      },
    },
    {
      name: 'Claude config directory',
      test: () => {
        const claudeDir = path.join(utils.getHomeDirectory(), '.claude');
        const exists = utils.directoryExists(claudeDir);
        return { 
          pass: exists, 
          message: exists ? claudeDir : 'Not found' 
        };
      },
    },
  ];

  for (const check of checks) {
    const result = await check.test();
    const status = result.pass ? '✅' : '❌';
    const message = result.message ? ` (${result.message})` : '';
    console.log(`${status} ${check.name}${message}`);
  }

  console.log('\n✅ Diagnostics complete\n');
}

async function handleRepair() {
  console.log('\n🔧 Running ECC Repair\n');
  console.log('This would reinstall missing or corrupted components.');
  console.log('Currently in progress - check back later.\n');
}

async function handleConsult(args) {
  const query = args.join(' ') || 'help';
  console.log(`\n🔍 Consulting ECC advisor for: "${query}"\n`);
  console.log('This feature helps you find and install the right components.');
  console.log('Currently in progress - check back later.\n');
}

async function handleInstall(args) {
  console.log('\n📥 Installing ECC Components\n');
  console.log('Usage: npx ecc install --profile [minimal|core|full] --target [claude|cursor|codex]');
  console.log('\nCurrently in progress - check back later.\n');
}

async function handleSetupPM(args) {
  console.log('\n⚙️  Configuring Package Manager\n');
  
  const pm = args[0];
  if (!pm) {
    try {
      const detected = await packageManager.detect();
      console.log(`Current package manager: ${detected}\n`);
    } catch (err) {
      console.error(`Error detecting package manager: ${err.message}\n`);
    }
  } else {
    console.log(`Setting package manager to: ${pm}\n`);
  }
}

async function handleUninstall(args) {
  console.log('\n🗑️  Uninstalling ECC Components\n');
  
  const options = parseArgs({ 
    args, 
    options: { 'dry-run': { type: 'boolean' } } 
  }).values;

  if (options['dry-run']) {
    console.log('Dry run - would remove the following:');
  } else {
    console.log('Removing ECC-managed files...');
  }
  console.log('\nCurrently in progress - check back later.\n');
}

function handleVersion() {
  console.log(`\necc-universal v${VERSION}\n`);
  console.log('Homepage: https://github.com/affaan-m/ECC');
  console.log('Repository: https://github.com/shivamen000-oss/-AI-\n');
}

function handleHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           ECC Universal v${VERSION}                                    ║
║   Harness-native agent operating system for agentic work          ║
╚══════════════════════════════════════════════════════════════════╝

USAGE
  npx ecc [command] [args]

COMMANDS
`);

  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(20)} ${desc}`);
  });

  console.log(`
EXAMPLES
  npx ecc status              Check installation status
  npx ecc list-installed      Show installed components
  npx ecc doctor              Run diagnostics
  npx ecc repair              Fix broken installation
  npx ecc consult "security"  Find relevant components
  npx ecc install --profile minimal --target claude

DOCUMENTATION
  https://github.com/affaan-m/ECC#quick-start
  https://github.com/affaan-m/ECC/blob/main/TROUBLESHOOTING.md

`);
}

// Run main
main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  if (process.env.DEBUG) {
    console.error(err.stack);
  }
  process.exit(1);
});
