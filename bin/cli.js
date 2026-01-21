#!/usr/bin/env node

/**
 * Consultant Stack CLI
 * Framework d'agents IA pour consultants B2B
 * AI agents framework for B2B consultants
 */

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

const CONSULTANT_DIR = '_consultant';
const MIN_NODE_VERSION = 16;
const MANIFEST_FILE = '.consultemps-manifest.json';

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'init':
      await initProject(args.slice(1));
      break;
    case 'update':
      await updateProject(args.slice(1));
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    case 'version':
    case '--version':
    case '-v':
      showVersion();
      break;
    default:
      console.log(`Unknown command: ${command}\n`);
      showHelp();
      process.exit(1);
  }
}

// ============================================================================
// INIT PROJECT
// ============================================================================

async function initProject(args) {
  const targetDir = args[0] || process.cwd();
  const consultantPath = path.join(targetDir, CONSULTANT_DIR);
  const forceMode = args.includes('--force') || args.includes('-f');

  // Show banner
  showBanner();

  // Check prerequisites
  if (!checkPrerequisites()) {
    process.exit(1);
  }

  // Check if directory exists
  if (fs.existsSync(consultantPath) && !forceMode) {
    console.log(`\n  ${CONSULTANT_DIR}/ already exists in ${targetDir}`);
    console.log('   Use --force to overwrite (not recommended)\n');
    process.exit(1);
  }

  // Interactive configuration
  console.log('\n  Configuration\n');

  const config = await promptConfiguration();

  if (!config.name) {
    console.log('\n  Installation cancelled.\n');
    process.exit(0);
  }

  console.log('\n  Installing files...\n');

  // Copy framework files
  const sourceDir = path.join(__dirname, '..');

  try {
    // Remove existing if force mode
    if (forceMode && fs.existsSync(consultantPath)) {
      fs.rmSync(consultantPath, { recursive: true, force: true });
    }

    // Copy files
    copyDirectory(sourceDir, consultantPath, [
      'node_modules',
      '.git',
      'output',
      'stories',
      '.DS_Store',
      'Thumbs.db',
      'package-lock.json'
    ]);

    // Generate personalized config.yaml
    generateConfig(consultantPath, config);

    // Create output and stories directories
    fs.mkdirSync(path.join(consultantPath, 'output'), { recursive: true });
    fs.mkdirSync(path.join(consultantPath, 'stories'), { recursive: true });

    // Setup IDE-specific files
    setupIDE(targetDir, config.ide);

    // Create manifest file
    createManifest(consultantPath, config.ide);

    // Show success
    showSuccess(consultantPath, config);

  } catch (err) {
    console.error('\n  Error during installation:', err.message);
    process.exit(1);
  }
}

// ============================================================================
// UPDATE PROJECT
// ============================================================================

async function updateProject(args) {
  const targetDir = args[0] || process.cwd();
  const consultantPath = path.join(targetDir, CONSULTANT_DIR);

  // Check if project exists
  if (!fs.existsSync(consultantPath)) {
    console.log('\n  No installation found.');
    console.log('   Use: npx consultemps init\n');
    process.exit(1);
  }

  console.log('\n  Updating Consultant Stack...\n');

  // Read manifest to get IDE
  const manifestPath = path.join(consultantPath, MANIFEST_FILE);
  let ide = 'other';
  let previousVersion = 'unknown';

  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      ide = manifest.ide || 'other';
      previousVersion = manifest.version || 'unknown';
    } catch (e) {
      // Fallback: try to detect IDE
      ide = detectInstalledIDE(targetDir);
    }
  } else {
    // Fallback: try to detect IDE
    ide = detectInstalledIDE(targetDir);
  }

  // Backup user config
  const configPath = path.join(consultantPath, 'config.yaml');
  let userConfig = null;
  if (fs.existsSync(configPath)) {
    userConfig = fs.readFileSync(configPath, 'utf8');
    console.log('     Backing up config.yaml...');
  }

  // Backup workflow-status.yaml
  const workflowStatusPath = path.join(consultantPath, 'workflow-status.yaml');
  let workflowStatus = null;
  if (fs.existsSync(workflowStatusPath)) {
    workflowStatus = fs.readFileSync(workflowStatusPath, 'utf8');
    console.log('     Backing up workflow-status.yaml...');
  }

  // Backup project-context.md
  const projectContextPath = path.join(consultantPath, 'project-context.md');
  let projectContext = null;
  if (fs.existsSync(projectContextPath)) {
    projectContext = fs.readFileSync(projectContextPath, 'utf8');
    console.log('     Backing up project-context.md...');
  }

  const sourceDir = path.join(__dirname, '..');

  try {
    // Update agents, skills, templates, modules, data
    const foldersToUpdate = ['agents', 'skills', 'templates', 'modules', 'data'];

    for (const folder of foldersToUpdate) {
      const srcFolder = path.join(sourceDir, folder);
      const destFolder = path.join(consultantPath, folder);

      if (fs.existsSync(srcFolder)) {
        // Remove old folder
        if (fs.existsSync(destFolder)) {
          fs.rmSync(destFolder, { recursive: true, force: true });
        }
        // Copy new folder
        copyDirectory(srcFolder, destFolder);
        console.log(`     Updated ${folder}/`);
      }
    }

    // Update project-path.yaml (framework file)
    const projectPathSrc = path.join(sourceDir, 'project-path.yaml');
    const projectPathDest = path.join(consultantPath, 'project-path.yaml');
    if (fs.existsSync(projectPathSrc)) {
      fs.copyFileSync(projectPathSrc, projectPathDest);
      console.log('     Updated project-path.yaml');
    }

    // Restore user files
    if (userConfig) {
      fs.writeFileSync(configPath, userConfig, 'utf8');
      console.log('     Restored config.yaml');
    }

    if (workflowStatus) {
      fs.writeFileSync(workflowStatusPath, workflowStatus, 'utf8');
      console.log('     Restored workflow-status.yaml');
    }

    if (projectContext) {
      fs.writeFileSync(projectContextPath, projectContext, 'utf8');
      console.log('     Restored project-context.md');
    }

    // Regenerate IDE files
    setupIDE(targetDir, ide);

    // Update manifest
    const pkg = require('../package.json');
    const manifestData = {
      version: pkg.version,
      installedAt: fs.existsSync(manifestPath)
        ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')).installedAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ide: ide
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');

    // Show success
    console.log(`
  Update complete!

  Previous version: ${previousVersion}
  New version: ${pkg.version}
  IDE: ${ide}

  Your config.yaml and project files have been preserved.
`);

  } catch (err) {
    console.error('\n  Error during update:', err.message);
    process.exit(1);
  }
}

// ============================================================================
// IDE DETECTION
// ============================================================================

function detectInstalledIDE(targetDir) {
  if (fs.existsSync(path.join(targetDir, '.claude', 'commands', 'consultant'))) {
    return 'claude-code';
  }
  if (fs.existsSync(path.join(targetDir, '.cursorrules'))) {
    return 'cursor';
  }
  if (fs.existsSync(path.join(targetDir, '.windsurfrules'))) {
    return 'windsurf';
  }
  if (fs.existsSync(path.join(targetDir, '.cline'))) {
    return 'cline';
  }
  return 'other';
}

// ============================================================================
// PROMPTS
// ============================================================================

async function promptConfiguration() {
  const questions = [
    {
      type: 'select',
      name: 'ide',
      message: 'IDE IA / AI IDE',
      choices: [
        { title: 'Claude Code', value: 'claude-code', description: 'Anthropic CLI (recommended)' },
        { title: 'Cursor', value: 'cursor', description: 'AI-first IDE' },
        { title: 'Windsurf', value: 'windsurf', description: 'Codeium IDE' },
        { title: 'Cline', value: 'cline', description: 'VS Code extension' },
        { title: 'Autre / Other', value: 'other', description: 'Manual setup' }
      ],
      initial: 0
    },
    {
      type: 'text',
      name: 'name',
      message: 'Votre nom / Your name',
      initial: process.env.USER || process.env.USERNAME || ''
    },
    {
      type: 'text',
      name: 'company',
      message: 'Entreprise / Company',
      initial: 'Consulting'
    },
    {
      type: 'text',
      name: 'specialty',
      message: 'Specialite / Specialty',
      initial: 'B2B Consulting'
    },
    {
      type: 'text',
      name: 'email',
      message: 'Email (optionnel / optional)',
      initial: ''
    },
    {
      type: 'select',
      name: 'language',
      message: 'Langue / Language',
      choices: [
        { title: 'Francais', value: 'french' },
        { title: 'English', value: 'english' }
      ],
      initial: 0
    },
    {
      type: 'number',
      name: 'rateDiscovery',
      message: 'Tarif discovery / Discovery rate (per hour)',
      initial: 150,
      min: 0
    },
    {
      type: 'number',
      name: 'rateDev',
      message: 'Tarif developpement / Development rate (per hour)',
      initial: 120,
      min: 0
    },
    {
      type: 'number',
      name: 'rateDoc',
      message: 'Tarif documentation / Documentation rate (per hour)',
      initial: 100,
      min: 0
    },
    {
      type: 'select',
      name: 'currency',
      message: 'Devise / Currency',
      choices: [
        { title: 'EUR', value: 'EUR' },
        { title: 'USD ($)', value: 'USD' },
        { title: 'CHF (Fr.)', value: 'CHF' },
        { title: 'GBP', value: 'GBP' }
      ],
      initial: 0
    }
  ];

  // Handle Ctrl+C gracefully
  const onCancel = () => {
    return false;
  };

  return await prompts(questions, { onCancel });
}

// ============================================================================
// IDE SETUP FUNCTIONS
// ============================================================================

function setupIDE(targetDir, ide) {
  switch (ide) {
    case 'claude-code':
      setupClaudeCode(targetDir);
      break;
    case 'cursor':
      setupCursor(targetDir);
      break;
    case 'windsurf':
      setupWindsurf(targetDir);
      break;
    case 'cline':
      setupCline(targetDir);
      break;
    case 'other':
    default:
      // No IDE-specific setup
      break;
  }
}

// ============================================================================
// CLAUDE CODE SETUP
// ============================================================================

function setupClaudeCode(targetDir) {
  const commandsDir = path.join(targetDir, '.claude', 'commands', 'consultant');
  fs.mkdirSync(commandsDir, { recursive: true });

  // Skills to create commands for
  const skills = [
    { name: 'orchestrator', type: 'agent', description: 'Point d entree du Consultant Stack - gestion de projet B2B' },
    { name: 'clarify', type: 'skill', description: 'Clarification des besoins client' },
    { name: 'frame', type: 'skill', description: 'Cadrage et problematisation du projet' },
    { name: 'estimate', type: 'skill', description: 'Estimation technique du projet' },
    { name: 'quote', type: 'skill', description: 'Generation du devis client' },
    { name: 'spec', type: 'skill', description: 'Specification technique detaillee' },
    { name: 'create-story', type: 'skill', description: 'Creation de user stories' },
    { name: 'plan-sprint', type: 'skill', description: 'Planification du sprint' },
    { name: 'implement', type: 'skill', description: 'Implementation du code' },
    { name: 'test', type: 'skill', description: 'Execution des tests' },
    { name: 'docs', type: 'skill', description: 'Generation de la documentation' },
    { name: 'handoff', type: 'skill', description: 'Livraison au client' },
    { name: 'status', type: 'skill', description: 'Statut du projet en cours' },
    { name: 'next', type: 'skill', description: 'Prochaine etape recommandee' },
    { name: 'init', type: 'skill', description: 'Initialisation d un nouveau projet' },
    { name: 'analyze-codebase', type: 'skill', description: 'Analyse du codebase existant (brownfield)' },
    { name: 'upsell', type: 'skill', description: 'Identification d opportunites commerciales' }
  ];

  for (const skill of skills) {
    const content = generateClaudeCodeCommand(skill);
    fs.writeFileSync(path.join(commandsDir, `${skill.name}.md`), content, 'utf8');
  }

  console.log('     Created .claude/commands/consultant/');
  console.log('     Use /consultant:orchestrator to start');
}

function generateClaudeCodeCommand(skill) {
  const filePath = skill.type === 'agent'
    ? `_consultant/agents/${skill.name}.md`
    : `_consultant/skills/${skill.name}.md`;

  return `---
name: '${skill.name}'
description: '${skill.description}'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified.

<agent-activation CRITICAL="TRUE">
1. IMMEDIATELY load the agent/skill file from @${filePath}
2. READ its entire contents carefully
3. Execute ALL activation steps exactly as written in the file
4. Follow the agent's persona, rules and workflow precisely
5. Stay in character throughout the session
6. NEVER break character until explicitly asked to exit
</agent-activation>

<context-loading>
Before executing, also load these critical context files:
- @_consultant/config.yaml (consultant identity and settings)
- @_consultant/workflow-status.yaml (current project state)
- @_consultant/project-context.md (project details, if exists)
</context-loading>

<communication>
- Always communicate in the language specified in config.yaml
- Follow the exact output format specified in the agent/skill file
- Maintain consistent persona throughout the interaction
</communication>
`;
}

// ============================================================================
// CURSOR SETUP
// ============================================================================

function setupCursor(targetDir) {
  const cursorRules = `# Consultant Stack Rules for Cursor

## Overview
This project uses the Consultant Stack framework for B2B consulting projects.

## Agents
Load agents from _consultant/agents/:
- orchestrator.md - Main entry point, intelligent project orchestrator
- discovery.md - Client needs clarification
- architect.md - Technical design
- planner.md - Planning and estimation
- developer.md - Implementation
- delivery.md - Documentation and delivery

## Skills (Commands)
Load skills from _consultant/skills/:
- /clarify - Clarify client requirements
- /frame - Frame and problematize the project
- /estimate - Technical estimation
- /quote - Generate client quote
- /spec - Detailed technical specification
- /create-story - Create user stories
- /plan-sprint - Sprint planning
- /implement - Code implementation
- /test - Run tests
- /docs - Generate documentation
- /handoff - Client delivery
- /status - Current project status
- /next - Next recommended action
- /init - Initialize new project
- /analyze-codebase - Analyze existing codebase

## Configuration
- _consultant/config.yaml - Consultant identity and rates
- _consultant/workflow-status.yaml - Current project state
- _consultant/project-context.md - Project details

## How to Use
1. Load the orchestrator: Read _consultant/agents/orchestrator.md
2. Follow the activation instructions in the file
3. The orchestrator will guide you through the workflow

## Language
Communicate in the language specified in _consultant/config.yaml (communication_language field).
`;

  fs.writeFileSync(path.join(targetDir, '.cursorrules'), cursorRules, 'utf8');
  console.log('     Created .cursorrules');
}

// ============================================================================
// WINDSURF SETUP
// ============================================================================

function setupWindsurf(targetDir) {
  const windsurfRules = `# Consultant Stack Rules for Windsurf

## Framework B2B Consultant
This project uses the Consultant Stack for B2B consulting project management.

## Agents
Load from _consultant/agents/:
- orchestrator.md (main entry point)
- discovery.md (requirements clarification)
- architect.md (technical design)
- planner.md (estimation and planning)
- developer.md (implementation)
- delivery.md (documentation and handoff)

## Skills
Load from _consultant/skills/:
clarify, frame, estimate, quote, spec, create-story, plan-sprint,
implement, test, docs, handoff, status, next, init, analyze-codebase

## Configuration
- _consultant/config.yaml - Consultant identity and settings
- _consultant/workflow-status.yaml - Project state tracking
- _consultant/project-context.md - Project information

## Getting Started
1. Read _consultant/agents/orchestrator.md
2. Follow the activation instructions
3. Use the intelligent menu to navigate workflows

## Language
Respect the communication_language setting in config.yaml.
`;

  fs.writeFileSync(path.join(targetDir, '.windsurfrules'), windsurfRules, 'utf8');
  console.log('     Created .windsurfrules');
}

// ============================================================================
// CLINE SETUP
// ============================================================================

function setupCline(targetDir) {
  const clineDir = path.join(targetDir, '.cline');
  fs.mkdirSync(clineDir, { recursive: true });

  const clineRules = `# Consultant Stack for Cline

## Framework
B2B consulting project management with AI agents.

## Entry Point
Load _consultant/agents/orchestrator.md to start.

## Agents (_consultant/agents/)
- orchestrator.md - Project orchestrator
- discovery.md - Requirements gathering
- architect.md - Technical architecture
- planner.md - Sprint planning
- developer.md - Development
- delivery.md - Documentation

## Skills (_consultant/skills/)
clarify, frame, estimate, quote, spec, create-story, plan-sprint,
implement, test, docs, handoff, status, next, init, analyze-codebase

## Config
- _consultant/config.yaml - Settings
- _consultant/workflow-status.yaml - State
- _consultant/project-context.md - Context
`;

  fs.writeFileSync(path.join(clineDir, 'rules.md'), clineRules, 'utf8');
  console.log('     Created .cline/rules.md');
}

// ============================================================================
// MANIFEST
// ============================================================================

function createManifest(consultantPath, ide) {
  const pkg = require('../package.json');
  const manifest = {
    version: pkg.version,
    installedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ide: ide
  };

  fs.writeFileSync(
    path.join(consultantPath, MANIFEST_FILE),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
}

// ============================================================================
// CONFIG GENERATION
// ============================================================================

function generateConfig(consultantPath, config) {
  const configContent = `# =============================================================================
# STACK B2B CONSULTANT - CONFIGURATION CENTRALE
# =============================================================================
# Ce fichier est la source unique de verite pour toutes les configurations.
# Tous les agents et skills DOIVENT charger ce fichier AVANT toute action.
# =============================================================================

# -----------------------------------------------------------------------------
# IDENTITE DU CONSULTANT
# -----------------------------------------------------------------------------
consultant:
  name: "${config.name}"
  company: "${config.company}"
  email: "${config.email || ''}"
  specialty: "${config.specialty}"

# -----------------------------------------------------------------------------
# LANGUES
# -----------------------------------------------------------------------------
communication_language: "${config.language}"        # Langue de conversation avec l'utilisateur
document_output_language: "${config.language}"      # Langue des documents generes

# -----------------------------------------------------------------------------
# CHEMINS (relatifs a la racine du projet)
# -----------------------------------------------------------------------------
paths:
  root: "{project-root}"
  consultant_home: "{project-root}/_consultant"
  project_context: "{project-root}/_consultant/project-context.md"
  workflow_status: "{project-root}/_consultant/workflow-status.yaml"
  project_path: "{project-root}/_consultant/project-path.yaml"
  sprint_status: "{project-root}/_consultant/sprint-status.yaml"
  stories_dir: "{project-root}/_consultant/stories"
  output_dir: "{project-root}/_consultant/output"
  templates_dir: "{project-root}/_consultant/templates"
  agents_dir: "{project-root}/_consultant/agents"
  skills_dir: "{project-root}/_consultant/skills"

# -----------------------------------------------------------------------------
# NIVEAUX D'AUTONOMIE PAR AGENT
# -----------------------------------------------------------------------------
# very_high: Agent procede sans confirmation
# high: Agent procede, confirme aux checkpoints
# medium: Agent propose, attend approbation
# -----------------------------------------------------------------------------
autonomy:
  discovery: "high"
  architect: "high"
  planner: "high"
  developer: "very_high"
  delivery: "high"

# -----------------------------------------------------------------------------
# CHECKPOINTS CRITIQUES (toujours validation humaine)
# -----------------------------------------------------------------------------
critical_checkpoints:
  - quotation_approval      # Approbation du devis
  - final_delivery          # Livraison finale au client
  - scope_change            # Changement de perimetre
  - security_decision       # Decision de securite
  - budget_adjustment       # Ajustement budgetaire

# -----------------------------------------------------------------------------
# TARIFICATION (pour les estimations)
# -----------------------------------------------------------------------------
rates:
  discovery_hourly: ${config.rateDiscovery}       # Tarif horaire discovery
  development_hourly: ${config.rateDev}     # Tarif horaire developpement
  documentation_hourly: ${config.rateDoc}   # Tarif horaire documentation
  currency: "${config.currency}"

# -----------------------------------------------------------------------------
# PREFERENCES DE PROJET
# -----------------------------------------------------------------------------
preferences:
  user_skill_level: "intermediate"  # beginner | intermediate | advanced
  default_priority: "P2"            # P1 | P2 | P3
  story_prefix: "STORY"             # Prefixe des IDs de story

# -----------------------------------------------------------------------------
# REGLES GLOBALES
# -----------------------------------------------------------------------------
global_rules:
  - "ALWAYS load project-context.md before any action"
  - "ALWAYS update project-context.md after significant changes"
  - "NEVER skip checkpoints for critical actions"
  - "ALWAYS communicate in {communication_language}"
  - "ALWAYS generate documents in {document_output_language}"
`;

  fs.writeFileSync(path.join(consultantPath, 'config.yaml'), configContent, 'utf8');
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

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

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

function showBanner() {
  console.log(`
+==============================================================+
|                                                              |
|         CONSULTANT STACK - Installation                      |
|                                                              |
|  Framework d'agents IA pour consultants B2B                  |
|  AI agents framework for B2B consultants                     |
|                                                              |
+==============================================================+
`);
}

function showSuccess(consultantPath, config) {
  const lang = config.language === 'french' ? 'fr' : 'en';

  const ideInstructions = {
    'claude-code': {
      fr: 'Tapez /consultant:orchestrator pour demarrer',
      en: 'Type /consultant:orchestrator to start'
    },
    'cursor': {
      fr: 'Chargez _consultant/agents/orchestrator.md',
      en: 'Load _consultant/agents/orchestrator.md'
    },
    'windsurf': {
      fr: 'Chargez _consultant/agents/orchestrator.md',
      en: 'Load _consultant/agents/orchestrator.md'
    },
    'cline': {
      fr: 'Chargez _consultant/agents/orchestrator.md',
      en: 'Load _consultant/agents/orchestrator.md'
    },
    'other': {
      fr: 'Chargez _consultant/agents/orchestrator.md dans votre IDE',
      en: 'Load _consultant/agents/orchestrator.md in your IDE'
    }
  };

  const messages = {
    fr: {
      success: 'Installation terminee !',
      config: 'Configuration sauvegardee',
      ide: 'IDE configure',
      next: 'Prochaine etape',
      enjoy: 'Bonne consultation !'
    },
    en: {
      success: 'Installation complete!',
      config: 'Configuration saved',
      ide: 'IDE configured',
      next: 'Next step',
      enjoy: 'Happy consulting!'
    }
  };

  const m = messages[lang];
  const ideInstruction = ideInstructions[config.ide][lang];
  const ideNames = {
    'claude-code': 'Claude Code',
    'cursor': 'Cursor',
    'windsurf': 'Windsurf',
    'cline': 'Cline',
    'other': 'Manual'
  };

  console.log(`
+==============================================================+
|  ${m.success.padEnd(58)}|
+==============================================================+

${m.config}:
  - Name: ${config.name}
  - Company: ${config.company}
  - Language: ${config.language}
  - Rates: ${config.rateDiscovery}/${config.rateDev}/${config.rateDoc} ${config.currency}/h

${m.ide}: ${ideNames[config.ide]}

${m.next}:
----------------------------------------------------------------
${ideInstruction}
----------------------------------------------------------------

${m.enjoy}
`);
}

function showHelp() {
  console.log(`
+==============================================================+
|               CONSULTANT STACK - CLI Help                    |
+==============================================================+

Framework d'agents IA pour consultants B2B
AI agents framework for B2B consultants

USAGE:
  npx consultemps <command> [options]

COMMANDS:
  init [path]    Initialize the consultant stack in a directory
                 Initialiser le stack consultant dans un repertoire

                 Options:
                   --force, -f  Overwrite existing installation

  update [path]  Update framework files (preserves config.yaml)
                 Mettre a jour les fichiers (preserve config.yaml)

  help           Show this help message
                 Afficher ce message d'aide

  version        Show version number
                 Afficher le numero de version

EXAMPLES:
  npx consultemps init              # Initialize in current directory
  npx consultemps init ./my-project # Initialize in specific directory
  npx consultemps init --force      # Overwrite existing installation
  npx consultemps update            # Update framework files

SUPPORTED IDEs:
  - Claude Code (recommended) - Creates .claude/commands/consultant/
  - Cursor - Creates .cursorrules
  - Windsurf - Creates .windsurfrules
  - Cline - Creates .cline/rules.md

MORE INFO:
  https://github.com/PoulpYBifle/consultant
`);
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(`consultemps v${pkg.version}`);
}

// ============================================================================
// PREREQUISITES
// ============================================================================

function checkPrerequisites() {
  const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

  if (nodeVersion < MIN_NODE_VERSION) {
    console.log(`\n  Node.js ${MIN_NODE_VERSION}+ is required (current: ${process.versions.node})`);
    console.log(`   Please upgrade Node.js: https://nodejs.org/\n`);
    return false;
  }

  return true;
}

// ============================================================================
// RUN
// ============================================================================

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
