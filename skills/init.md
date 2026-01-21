---
skill: init
agent: orchestrator
description: "Initialiser un nouveau projet ou reprendre un projet existant"
autonomy: high
checkpoint: none
---

# Skill: Project Initialization

## Purpose
Initialize a new project or resume an existing one. Automatically detects whether this is a greenfield (new) or brownfield (existing code) project.

## Trigger
- First interaction with the orchestrator on a new project
- User says "nouveau projet", "commencer", "init", "démarrer"
- Command: `/init`

## Process

### Step 1: Scan Environment
Scan the project directory to detect existing artifacts:

```
SCAN for:
├── Code directories: src/, app/, lib/, packages/, components/
├── Config files: package.json, tsconfig.json, pyproject.toml, Cargo.toml, etc.
├── Project artifacts: project-context.md (with content)
├── Workflow state: workflow-status.yaml (with project.name != "")
```

### Step 2: Determine Project State

**CASE A: workflow-status.yaml exists with project.name**
```
→ Project ALREADY INITIALIZED
→ Load workflow-status.yaml
→ Display:
  "🔄 Projet '{project.name}' détecté !
   Dernière activité : {last_activity}
   Phase actuelle : {phase}
   Prochaine action : {next_action.workflow}

   [1] Continuer où on en était
   [2] Voir le statut complet
   [3] Recommencer à zéro (attention: perte de données)"
```

**CASE B: Code exists BUT no workflow-status.yaml (or empty)**
```
→ BROWNFIELD project detected
→ Set project_type: "brownfield"
→ Display:
  "🔍 Je détecte du code existant dans ce projet !

   Répertoires trouvés : {list of code directories}
   Technologies détectées : {frameworks/languages found}

   C'est un projet BROWNFIELD - on travaille sur une base existante.
   Avant de planifier, je vais analyser le code pour comprendre
   l'architecture actuelle.

   [1] Oui, c'est un projet existant → Commencer l'analyse
   [2] Non, ignorer ce code → Traiter comme nouveau projet
   [3] Annuler"
```

**CASE C: No code AND no workflow-status.yaml (or empty)**
```
→ GREENFIELD project
→ Set project_type: "greenfield"
→ Display:
  "🌱 Nouveau projet détecté !

   Aucun code existant trouvé.
   On part de zéro - c'est un projet GREENFIELD.

   [1] Commencer l'initialisation
   [2] Annuler"
```

### Step 3: Collect Project Information
If proceeding with initialization (new or override):

```
Léo: "Parfait ! Quelques infos pour démarrer :

      1. Quel est le NOM du projet ?
         (ex: 'ERP Facturation', 'Portail Client B2B')"

WAIT for response → store as {project_name}

Léo: "2. Qui est le CLIENT ?
      (Nom de l'entreprise ou personne)"

WAIT for response → store as {client_name}

Léo: "3. Type de projet confirmé : {project_type}
      [1] Confirmer
      [2] Changer (greenfield ↔ brownfield)"

WAIT for response → confirm or toggle project_type
```

### Step 4: Create/Update Files

**Update workflow-status.yaml:**
```yaml
project:
  name: "{project_name}"
  client: "{client_name}"
  type: "{project_type}"  # greenfield | brownfield
  phase: "discovery"      # or "analysis" if brownfield
  created: "{current_date}"
  last_activity: "{current_timestamp}"

workflow_status:
  # Reset all to pending
  analyze-codebase: "{pending if brownfield, skipped if greenfield}"
  frame: "pending"
  clarify: "pending"
  # ... all others pending

next_action:
  workflow: "{analyze-codebase if brownfield, frame if greenfield}"
  agent: "{architect if brownfield, discovery if greenfield}"
  reason: "{Analyse du code existant if brownfield, Cadrage rapide du projet if greenfield}"

checkpoints_passed: {}

# 🚦 QUALITY GATES - Initialized for all phases
quality_gates:
  discovery:
    status: "pending"
    last_check: ""
    required_items: 11
    passed_items: 0
    blocking_items: []

  specs:
    status: "pending"
    last_check: ""
    required_items: 12
    passed_items: 0
    review_issues_found: 0
    review_issues_resolved: 0
    blocking_items: []

  planning:
    status: "pending"
    last_check: ""
    required_items: 12
    passed_items: 0
    stories_validated: 0
    stories_incomplete: []
    buffer_percentage: 0
    blocking_items: []

  development:
    current_story: ""
    status: "pending"
    placeholder_scan: "pending"
    tests_exist: "pending"
    tests_pass: "pending"
    review_done: "pending"
    review_issues_found: 0
    blockers_resolved: "pending"
    blocking_items: []

  delivery:
    status: "pending"
    last_check: ""
    required_items: 17
    passed_items: 0
    docs_validated: false
    package_complete: false
    final_validation: "pending"
    blocking_items: []

gate_history: []

blockers: []
notes: []

history:
  - workflow: "init"
    completed: "{current_timestamp}"
    agent: "orchestrator"
    output: "workflow-status.yaml"
```

**Update project-context.md header section:**
```markdown
# Project Context: {project_name}

> **Client**: {client_name}
> **Type**: {project_type}
> **Created**: {current_date}
> **Status**: Initialized - Discovery phase

---

## Executive Summary
*(À compléter lors du cadrage)*

## Client Profile
- **Company**: {client_name}
- **Industry**: *(À définir)*
- **Contact**: *(À définir)*

...
```

### Step 5: Display Success & Next Steps

**For GREENFIELD:**
```
Léo: "✅ Projet '{project_name}' initialisé avec succès !

      Type : GREENFIELD (nouveau projet)
      Client : {client_name}

      ┌─────────────────────────────────────────────┐
      │  Prochaine étape : CADRAGE RAPIDE          │
      │                                             │
      │  Je vais te poser quelques questions pour   │
      │  comprendre le projet et pouvoir estimer.   │
      └─────────────────────────────────────────────┘

      [1] ▶ Commencer le cadrage (/frame)
      [2] 📋 Voir le statut du projet
      [3] 💬 Discuter d'abord"
```

**For BROWNFIELD:**
```
Léo: "✅ Projet '{project_name}' initialisé avec succès !

      Type : BROWNFIELD (code existant)
      Client : {client_name}

      ┌─────────────────────────────────────────────┐
      │  Prochaine étape : ANALYSE DU CODE         │
      │                                             │
      │  Avant de planifier, je dois analyser le    │
      │  code existant pour comprendre:             │
      │  - L'architecture actuelle                  │
      │  - Les technologies utilisées               │
      │  - Les patterns et conventions              │
      └─────────────────────────────────────────────┘

      [1] ▶ Analyser le code (/analyze-codebase)
      [2] 📋 Voir le statut du projet
      [3] 💬 Discuter d'abord"
```

## Output
- Updated `workflow-status.yaml` with project info
- Updated `project-context.md` header
- Project ready for next phase

## Autonomy Rules
- **CAN** autonomously: Scan directories, detect project type, create initial files
- **MUST CHECKPOINT**: None for this skill
- **ALWAYS**: Confirm project type with user before proceeding

## Error Handling
- If cannot write to workflow-status.yaml: Report permission error
- If project-context.md doesn't exist: Create it from scratch
- If user cancels: Return to orchestrator menu with no changes
