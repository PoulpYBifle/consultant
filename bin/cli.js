#!/usr/bin/env node

/**
 * Consultant Stack CLI
 * Framework d'agents IA pour consultants B2B
 * AI agents framework for B2B consultants
 */

const fs = require('fs');
const path = require('path');

const CONSULTANT_DIR = '_consultant';

const commands = {
  init: initProject,
  help: showHelp,
  version: showVersion
};

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  if (commands[command]) {
    commands[command](args.slice(1));
  } else {
    console.log(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
}

function initProject(args) {
  const targetDir = args[0] || process.cwd();
  const consultantPath = path.join(targetDir, CONSULTANT_DIR);

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           CONSULTANT STACK - Initialization                  ║
╚══════════════════════════════════════════════════════════════╝
`);

  // Check if already exists
  if (fs.existsSync(consultantPath)) {
    console.log(`⚠️  ${CONSULTANT_DIR}/ already exists in ${targetDir}`);
    console.log('   Use --force to overwrite (not recommended)');
    process.exit(1);
  }

  // Copy framework files
  const sourceDir = path.join(__dirname, '..');

  try {
    copyDirectory(sourceDir, consultantPath, [
      'node_modules',
      '.git',
      'output',
      'stories',
      '.DS_Store',
      'Thumbs.db'
    ]);

    console.log(`✅ Consultant Stack installed in ${consultantPath}`);
    console.log(`
Next steps / Prochaines étapes:
────────────────────────────────────────────────────────────────
1. Edit ${CONSULTANT_DIR}/config.yaml with your information
   Modifiez ${CONSULTANT_DIR}/config.yaml avec vos informations

2. In Claude Code, invoke the orchestrator agent:
   Dans Claude Code, invoquez l'agent orchestrateur:

   → Load agent: ${CONSULTANT_DIR}/agents/orchestrator.md

3. Type /init to start a new project
   Tapez /init pour démarrer un nouveau projet
────────────────────────────────────────────────────────────────
`);
  } catch (err) {
    console.error('❌ Error during installation:', err.message);
    process.exit(1);
  }
}

function copyDirectory(src, dest, exclude = []) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║               CONSULTANT STACK - CLI Help                    ║
╚══════════════════════════════════════════════════════════════╝

Framework d'agents IA pour consultants B2B
AI agents framework for B2B consultants

USAGE:
  consultant <command> [options]

COMMANDS:
  init [path]    Initialize the consultant stack in a directory
                 Initialiser le stack consultant dans un répertoire

  help           Show this help message
                 Afficher ce message d'aide

  version        Show version number
                 Afficher le numéro de version

EXAMPLES:
  consultant init              # Initialize in current directory
  consultant init ./my-project # Initialize in specific directory

MORE INFO:
  https://github.com/PoulpYBifle/consultant
`);
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(`consultant-stack v${pkg.version}`);
}

main();
