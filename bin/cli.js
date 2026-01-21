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
    console.log(`\n⚠️  ${CONSULTANT_DIR}/ already exists in ${targetDir}`);
    console.log('   Use --force to overwrite (not recommended)\n');
    process.exit(1);
  }

  // Interactive configuration
  console.log('\n📝 Configuration\n');

  const config = await promptConfiguration();

  if (!config.name) {
    console.log('\n❌ Installation cancelled.\n');
    process.exit(0);
  }

  console.log('\n📂 Installing files...\n');

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

    // Show success
    showSuccess(consultantPath, config);

  } catch (err) {
    console.error('\n❌ Error during installation:', err.message);
    process.exit(1);
  }
}

// ============================================================================
// PROMPTS
// ============================================================================

async function promptConfiguration() {
  const questions = [
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
      message: 'Spécialité / Specialty',
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
        { title: 'Français', value: 'french' },
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
      message: 'Tarif développement / Development rate (per hour)',
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
        { title: 'EUR (€)', value: 'EUR' },
        { title: 'USD ($)', value: 'USD' },
        { title: 'CHF (Fr.)', value: 'CHF' },
        { title: 'GBP (£)', value: 'GBP' }
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
// CONFIG GENERATION
// ============================================================================

function generateConfig(consultantPath, config) {
  const configContent = `# =============================================================================
# STACK B2B CONSULTANT - CONFIGURATION CENTRALE
# =============================================================================
# Ce fichier est la source unique de vérité pour toutes les configurations.
# Tous les agents et skills DOIVENT charger ce fichier AVANT toute action.
# =============================================================================

# -----------------------------------------------------------------------------
# IDENTITÉ DU CONSULTANT
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
document_output_language: "${config.language}"      # Langue des documents générés

# -----------------------------------------------------------------------------
# CHEMINS (relatifs à la racine du projet)
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
# very_high: Agent procède sans confirmation
# high: Agent procède, confirme aux checkpoints
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
  - scope_change            # Changement de périmètre
  - security_decision       # Décision de sécurité
  - budget_adjustment       # Ajustement budgétaire

# -----------------------------------------------------------------------------
# TARIFICATION (pour les estimations)
# -----------------------------------------------------------------------------
rates:
  discovery_hourly: ${config.rateDiscovery}       # Tarif horaire discovery
  development_hourly: ${config.rateDev}     # Tarif horaire développement
  documentation_hourly: ${config.rateDoc}   # Tarif horaire documentation
  currency: "${config.currency}"

# -----------------------------------------------------------------------------
# PRÉFÉRENCES DE PROJET
# -----------------------------------------------------------------------------
preferences:
  user_skill_level: "intermediate"  # beginner | intermediate | advanced
  default_priority: "P2"            # P1 | P2 | P3
  story_prefix: "STORY"             # Préfixe des IDs de story

# -----------------------------------------------------------------------------
# RÈGLES GLOBALES
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
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         CONSULTANT STACK - Installation                      ║
║                                                              ║
║  Framework d'agents IA pour consultants B2B                  ║
║  AI agents framework for B2B consultants                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);
}

function showSuccess(consultantPath, config) {
  const lang = config.language === 'french' ? 'fr' : 'en';

  const messages = {
    fr: {
      success: '✅ Installation terminée !',
      config: 'Configuration sauvegardée',
      next: 'Prochaines étapes',
      step1: 'Dans Claude Code, chargez l\'orchestrateur',
      step2: 'Tapez /init pour démarrer votre premier projet',
      enjoy: 'Bonne consultation !'
    },
    en: {
      success: '✅ Installation complete!',
      config: 'Configuration saved',
      next: 'Next steps',
      step1: 'In Claude Code, load the orchestrator',
      step2: 'Type /init to start your first project',
      enjoy: 'Happy consulting!'
    }
  };

  const m = messages[lang];

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  ${m.success.padEnd(58)}║
╚══════════════════════════════════════════════════════════════╝

${m.config}:
  • Name: ${config.name}
  • Company: ${config.company}
  • Language: ${config.language}
  • Rates: ${config.rateDiscovery}/${config.rateDev}/${config.rateDoc} ${config.currency}/h

${m.next}:
────────────────────────────────────────────────────────────────
1. ${m.step1}:
   → ${CONSULTANT_DIR}/agents/orchestrator.md

2. ${m.step2}
────────────────────────────────────────────────────────────────

${m.enjoy}
`);
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║               CONSULTANT STACK - CLI Help                    ║
╚══════════════════════════════════════════════════════════════╝

Framework d'agents IA pour consultants B2B
AI agents framework for B2B consultants

USAGE:
  consultant-stack <command> [options]

COMMANDS:
  init [path]    Initialize the consultant stack in a directory
                 Initialiser le stack consultant dans un répertoire

                 Options:
                   --force, -f  Overwrite existing installation

  help           Show this help message
                 Afficher ce message d'aide

  version        Show version number
                 Afficher le numéro de version

EXAMPLES:
  npx consultant-stack init              # Initialize in current directory
  npx consultant-stack init ./my-project # Initialize in specific directory
  npx consultant-stack init --force      # Overwrite existing installation

MORE INFO:
  https://github.com/PoulpYBifle/consultant
`);
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(`consultant-stack v${pkg.version}`);
}

// ============================================================================
// PREREQUISITES
// ============================================================================

function checkPrerequisites() {
  const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

  if (nodeVersion < MIN_NODE_VERSION) {
    console.log(`\n❌ Node.js ${MIN_NODE_VERSION}+ is required (current: ${process.versions.node})`);
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
