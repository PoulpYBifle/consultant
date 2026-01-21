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
    { name: 'project-init', type: 'skill', description: 'Initialisation d un nouveau projet client' },
    { name: 'analyze-codebase', type: 'skill', description: 'Analyse du codebase existant (brownfield)' },
    { name: 'upsell', type: 'skill', description: 'Identification d opportunites commerciales' }
  ];

  for (const skill of skills) {
    const content = generateClaudeCodeCommand(skill);
    fs.writeFileSync(path.join(commandsDir, `${skill.name}.md`), content, 'utf8');
  }

  // Create CLAUDE.md at project root
  generateClaudeMd(targetDir);

  console.log('     Created .claude/commands/consultant/');
  console.log('     Created CLAUDE.md');
  console.log('     Use /consultant:orchestrator to start');
}

function generateClaudeCodeCommand(skill) {
  const filePath = skill.type === 'agent'
    ? `_consultant/agents/${skill.name}.md`
    : `_consultant/skills/${skill.name}.md`;

  // Map skill name to actual file (handle rename)
  const actualFileName = skill.name === 'project-init' ? 'init' : skill.name;
  const actualFilePath = skill.type === 'agent'
    ? `_consultant/agents/${actualFileName}.md`
    : `_consultant/skills/${actualFileName}.md`;

  return `---
name: '${skill.name}'
description: '${skill.description}'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified.

<agent-activation CRITICAL="TRUE">
1. IMMEDIATELY load the agent/skill file from @${actualFilePath}
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

function generateClaudeMd(targetDir) {
  const claudeMd = `# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Consultant Stack** - AI Agents Framework for B2B consulting project lifecycle management. Provides a complete workflow from discovery to delivery with specialized agents and skills.

## Quick Start

Use \`/consultant:orchestrator\` to start the intelligent project assistant.

## Commands

### Consultant Stack Commands (via /consultant:*)
\`\`\`
/consultant:orchestrator    # Main entry point - intelligent routing
/consultant:project-init    # Initialize a new client project
/consultant:status          # Show current project status
/consultant:next            # Get next recommended action

# Discovery Phase
/consultant:clarify         # Clarify client requirements
/consultant:frame           # Frame and problematize the project

# Quotation Phase
/consultant:estimate        # Technical estimation
/consultant:quote           # Generate client quote

# Specs Phase
/consultant:spec            # Detailed technical specification
/consultant:analyze-codebase # Analyze existing code (brownfield)

# Planning Phase
/consultant:create-story    # Create user stories
/consultant:plan-sprint     # Sprint planning

# Development Phase
/consultant:implement       # Code implementation
/consultant:test            # Run tests

# Delivery Phase
/consultant:docs            # Generate documentation
/consultant:handoff         # Client delivery package
\`\`\`

### CLI Commands
\`\`\`bash
npx consultemps init        # Initialize framework (first time)
npx consultemps update      # Update framework files
npx consultemps version     # Show version
\`\`\`

## Architecture

### Directory Structure
\`\`\`
_consultant/                  # Project-specific instance
├── config.yaml               # Central config (consultant info, rates, languages)
├── project-context.md        # Project "bible" - single source of truth
├── workflow-status.yaml      # Current state tracking
├── project-path.yaml         # Phase journey definition
├── sprint-status.yaml        # Sprint/story tracking
├── agents/                   # 6 specialized agents
│   ├── orchestrator.md       # Leo - Main entry point & routing
│   ├── discovery.md          # Marie - Requirements clarification
│   ├── architect.md          # Technical design
│   ├── planner.md            # Estimation & planning
│   ├── developer.md          # Implementation
│   └── delivery.md           # Documentation & handoff
├── skills/                   # 17 skills across phases
├── templates/                # Story, spec, quote, handoff templates
├── modules/                  # Shared modules (estimation, techniques)
├── data/                     # Reference data (40 consulting techniques)
├── output/                   # Generated deliverables
└── stories/                  # User story files

.claude/commands/consultant/  # Claude Code slash commands
\`\`\`

### Agent System

| Agent | Persona | Role | Key Skills |
|-------|---------|------|------------|
| **Orchestrator** | Leo | Single entry point & intelligent routing | /project-init, /status, /next |
| **Discovery** | Marie | Requirements clarification | /clarify, /frame |
| **Architect** | - | Technical design | /spec, /analyze-codebase |
| **Planner** | - | Estimation & planning | /estimate, /quote, /create-story |
| **Developer** | - | Implementation | /implement, /test |
| **Delivery** | - | Documentation | /docs, /handoff |

### Project Phases

\`\`\`
0. Analysis (brownfield only)
   └─> 1. Discovery ─> 2. Quotation ─> 3. Specs ─> 4. Planning ─> 5. Development ─> 6. Delivery
\`\`\`

Phases have dependencies - progression blocked without completing required workflows.

## Key Patterns

### State Management
- **YAML** for structured state (workflow-status.yaml, sprint-status.yaml)
- **Markdown** for narrative docs (project-context.md, specs, stories)
- State files are the source of truth - agents read/update these files

### Configuration (\`_consultant/config.yaml\`)
- \`communication_language\`: User interaction language (french/english)
- \`document_output_language\`: Generated document language
- \`autonomy\`: Per-agent autonomy levels (high, very_high, medium)
- \`rates\`: Hourly rates for discovery/development/documentation

### Critical Checkpoints (always require human approval)
- quotation_approval
- final_delivery
- scope_change
- security_decision
- budget_adjustment

### Agent/Skill Files
Each agent/skill is a \`.md\` file with:
- YAML frontmatter (name, description)
- XML-formatted activation instructions and rules
- Persona definition and communication style

## Global Rules

From \`config.yaml\`:
- ALWAYS load \`project-context.md\` before any action
- ALWAYS update \`project-context.md\` after significant changes
- NEVER skip checkpoints for critical actions
- Communicate in configured \`{communication_language}\`
- Generate documents in \`{document_output_language}\`

## Project Detection

Framework auto-detects:
- **Greenfield**: New project (empty/no existing code)
- **Brownfield**: Existing codebase (triggers /analyze-codebase first)
`;

  fs.writeFileSync(path.join(targetDir, 'CLAUDE.md'), claudeMd, 'utf8');
}

// ============================================================================
// CURSOR SETUP
// ============================================================================

function setupCursor(targetDir) {
  const cursorRules = `# Consultant Stack - Cursor Rules

## Project Overview

**Consultant Stack** - AI Agents Framework for B2B consulting project lifecycle management.
Provides a complete workflow from discovery to delivery with specialized agents and skills.

## Quick Start

To start, load and follow the orchestrator agent:
1. Open _consultant/agents/orchestrator.md
2. Follow ALL activation instructions in the file
3. The orchestrator (Leo) will guide you through the workflow

## Architecture

### Directory Structure
\`\`\`
_consultant/
├── config.yaml               # Central config (consultant info, rates, languages)
├── project-context.md        # Project "bible" - single source of truth
├── workflow-status.yaml      # Current state tracking
├── project-path.yaml         # Phase journey definition
├── agents/                   # 6 specialized agents
│   ├── orchestrator.md       # Leo - Main entry point
│   ├── discovery.md          # Marie - Requirements
│   ├── architect.md          # Technical design
│   ├── planner.md            # Estimation & planning
│   ├── developer.md          # Implementation
│   └── delivery.md           # Documentation
├── skills/                   # 17 skills across phases
├── templates/                # Story, spec, quote templates
├── output/                   # Generated deliverables
└── stories/                  # User story files
\`\`\`

### Agent System

| Agent | File | Role |
|-------|------|------|
| Orchestrator (Leo) | orchestrator.md | Entry point & routing |
| Discovery (Marie) | discovery.md | Requirements clarification |
| Architect | architect.md | Technical design |
| Planner | planner.md | Estimation & planning |
| Developer | developer.md | Implementation |
| Delivery | delivery.md | Documentation & handoff |

### Skills (load from _consultant/skills/)

**Discovery**: clarify.md, frame.md
**Quotation**: estimate.md, quote.md
**Specs**: spec.md, analyze-codebase.md
**Planning**: create-story.md, plan-sprint.md
**Development**: implement.md, test.md
**Delivery**: docs.md, handoff.md
**Utilities**: status.md, next.md, init.md

### Project Phases

0. Analysis (brownfield) -> 1. Discovery -> 2. Quotation -> 3. Specs -> 4. Planning -> 5. Development -> 6. Delivery

## Key Rules

1. ALWAYS load config.yaml first to get consultant identity and language settings
2. ALWAYS load project-context.md before any action
3. ALWAYS update project-context.md after significant changes
4. ALWAYS check workflow-status.yaml for current state
5. Communicate in the language specified in config.yaml (communication_language)
6. Generate documents in the language specified in config.yaml (document_output_language)

## Critical Checkpoints (require human approval)

- quotation_approval
- final_delivery
- scope_change
- security_decision
- budget_adjustment

## State Files

- **workflow-status.yaml**: Current phase, completed workflows, next action
- **sprint-status.yaml**: Active sprint, story status
- **project-context.md**: All project knowledge (the "bible")
`;

  fs.writeFileSync(path.join(targetDir, '.cursorrules'), cursorRules, 'utf8');
  console.log('     Created .cursorrules');
}

// ============================================================================
// WINDSURF SETUP
// ============================================================================

function setupWindsurf(targetDir) {
  const windsurfRules = `# Consultant Stack - Windsurf Rules

## Project Overview

**Consultant Stack** - AI Agents Framework for B2B consulting project lifecycle management.
Complete workflow from discovery to delivery with specialized agents and skills.

## Quick Start

1. Open and read _consultant/agents/orchestrator.md
2. Follow ALL activation instructions exactly as written
3. The orchestrator (Leo) will guide you through the workflow

## Architecture

### Directory Structure
\`\`\`
_consultant/
├── config.yaml               # Consultant identity, rates, languages
├── project-context.md        # Project knowledge base
├── workflow-status.yaml      # Current state
├── agents/                   # 6 specialized agents
│   ├── orchestrator.md       # Leo - Entry point
│   ├── discovery.md          # Marie - Requirements
│   ├── architect.md          # Technical design
│   ├── planner.md            # Planning
│   ├── developer.md          # Implementation
│   └── delivery.md           # Documentation
├── skills/                   # 17 skills
├── templates/                # Document templates
├── output/                   # Deliverables
└── stories/                  # User stories
\`\`\`

### Agents

| Agent | Persona | Role |
|-------|---------|------|
| Orchestrator | Leo | Entry point & intelligent routing |
| Discovery | Marie | Requirements clarification |
| Architect | - | Technical design & specs |
| Planner | - | Estimation & story creation |
| Developer | - | Implementation & testing |
| Delivery | - | Documentation & handoff |

### Skills by Phase

**Discovery**: clarify, frame
**Quotation**: estimate, quote
**Specs**: spec, analyze-codebase
**Planning**: create-story, plan-sprint
**Development**: implement, test
**Delivery**: docs, handoff
**Utilities**: status, next, init

### Project Phases

Analysis (brownfield) -> Discovery -> Quotation -> Specs -> Planning -> Development -> Delivery

## Key Rules

1. ALWAYS load config.yaml first
2. ALWAYS read project-context.md before any action
3. ALWAYS update project-context.md after changes
4. Check workflow-status.yaml for current state
5. Use communication_language from config.yaml
6. Generate docs in document_output_language

## Critical Checkpoints

These ALWAYS require human approval:
- quotation_approval
- final_delivery
- scope_change
- security_decision
- budget_adjustment

## State Management

- workflow-status.yaml: Phase tracking
- sprint-status.yaml: Sprint progress
- project-context.md: All project knowledge
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

  const clineRules = `# Consultant Stack - Cline Rules

## Project Overview

**Consultant Stack** - AI Agents Framework for B2B consulting.
Complete workflow: Discovery -> Quotation -> Specs -> Planning -> Development -> Delivery

## Quick Start

1. Read _consultant/agents/orchestrator.md
2. Execute ALL activation instructions
3. Follow Leo (orchestrator) through the workflow

## Directory Structure

\`\`\`
_consultant/
├── config.yaml           # Consultant info, rates, language
├── project-context.md    # Project knowledge (read first!)
├── workflow-status.yaml  # Current state
├── agents/               # 6 agents with personas
├── skills/               # 17 workflow skills
├── templates/            # Document templates
├── output/               # Generated files
└── stories/              # User stories
\`\`\`

## Agents (_consultant/agents/)

| File | Persona | Role |
|------|---------|------|
| orchestrator.md | Leo | Entry point, routing |
| discovery.md | Marie | Requirements |
| architect.md | - | Technical design |
| planner.md | - | Estimation |
| developer.md | - | Implementation |
| delivery.md | - | Documentation |

## Skills (_consultant/skills/)

**Discovery**: clarify, frame
**Quotation**: estimate, quote
**Specs**: spec, analyze-codebase
**Planning**: create-story, plan-sprint
**Development**: implement, test
**Delivery**: docs, handoff
**Utilities**: status, next, init

## Key Rules

1. Load config.yaml first (language, rates)
2. Read project-context.md before any action
3. Update project-context.md after changes
4. Check workflow-status.yaml for state
5. Respect communication_language setting

## Checkpoints (require approval)

- quotation_approval
- final_delivery
- scope_change
- security_decision
- budget_adjustment
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
