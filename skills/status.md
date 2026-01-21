---
skill: status
agent: orchestrator
description: "Afficher le statut complet du projet"
autonomy: very_high
checkpoint: none
---

# Skill: Project Status

## Purpose
Display a comprehensive, visual status of the project showing completed workflows, current phase, blockers, and recommended next actions.

## Trigger
- User says "statut", "où en est", "avancement", "résumé", "point"
- Menu option [2] "Voir le statut complet"
- Command: `/status`

## Process

### Step 1: Load Status Data
```
LOAD:
├── workflow-status.yaml → project state, workflow completion
├── project-path.yaml → phase definitions, dependencies
├── project-context.md → project details
└── sprint-status.yaml → story progress (if exists)
```

### Step 2: Calculate Progress

**Per phase:**
```
For each phase in project-path.yaml:
  - Count total required workflows
  - Count completed workflows
  - Calculate percentage: completed / total * 100
  - Determine phase status: not_started | in_progress | completed
```

**Overall:**
```
Overall progress = Sum of all completed required workflows /
                   Sum of all required workflows * 100
```

### Step 3: Display Status Dashboard

```
Léo: "📊 STATUT DU PROJET : {project.name}

╔═══════════════════════════════════════════════════════════════════╗
║  Client: {project.client}                                         ║
║  Type: {project.type}  |  Phase: {project.phase}                  ║
║  Créé: {project.created}  |  Dernière activité: {last_activity}   ║
╚═══════════════════════════════════════════════════════════════════╝

📈 PROGRESSION GLOBALE
═══════════════════════════════════════════════════════════════════
[{'█' * progress_blocks}{'░' * (20-progress_blocks)}] {overall_progress}%

🔄 PHASES DU PROJET
═══════════════════════════════════════════════════════════════════

{phase_status_icon} Phase 0: Analysis (Brownfield)
   {workflow_line for analyze-codebase}

{phase_status_icon} Phase 1: Discovery
   {workflow_line for frame}
   {workflow_line for clarify}
   {workflow_line for upsell}

{phase_status_icon} Phase 2: Quotation
   {workflow_line for estimate}
   {workflow_line for quote}

{phase_status_icon} Phase 3: Specs
   {workflow_line for spec}

{phase_status_icon} Phase 4: Planning
   {workflow_line for create-story}
   {workflow_line for plan-sprint}

{phase_status_icon} Phase 5: Development
   {workflow_line for implement}
   {workflow_line for test}

{phase_status_icon} Phase 6: Delivery
   {workflow_line for docs}
   {workflow_line for handoff}

═══════════════════════════════════════════════════════════════════

{IF blockers exist}
⚠️ BLOCKERS
─────────────────────────────────────────────────────────────────
{for each blocker}
  • {blocker description}
{/for}

{IF checkpoints pending}
🛑 CHECKPOINTS EN ATTENTE
─────────────────────────────────────────────────────────────────
{for each pending checkpoint}
  • {checkpoint_name}: {checkpoint_message}
{/for}

{IF sprint_status exists}
📋 SPRINT EN COURS
─────────────────────────────────────────────────────────────────
  Stories: {done}/{total} terminées
  En cours: {in_progress_story_title}

═══════════════════════════════════════════════════════════════════

▶ PROCHAINE ACTION RECOMMANDÉE
─────────────────────────────────────────────────────────────────
  Workflow: /{next_action.workflow}
  Agent: {next_action.agent}
  Raison: {next_action.reason}

═══════════════════════════════════════════════════════════════════

[1] ▶ Exécuter la prochaine action
[2] 📜 Voir l'historique récent
[3] 🔙 Retour au menu principal"
```

### Workflow Line Format

```
For each workflow:
  IF status == "completed":
    "   ✅ {workflow_id}: Terminé ({completion_date})"
  ELIF status == "in_progress":
    "   🔄 {workflow_id}: En cours"
  ELIF status == "skipped":
    "   ⏭️ {workflow_id}: Ignoré"
  ELIF dependencies not met:
    "   🔒 {workflow_id}: Verrouillé (nécessite: {missing_deps})"
  ELSE:
    "   ⏳ {workflow_id}: En attente"

  IF required == false:
    append " (optionnel)"
```

### Phase Status Icons

```
Phase status:
  - All workflows completed → ✅
  - At least one in_progress → 🔄
  - Blocked by checkpoint → 🛑
  - Not yet started → ⏳
  - Skipped (condition not met) → ⏭️
```

### Step 4: Handle User Choice

**Option [1] - Execute next action:**
→ Route to next_action.workflow

**Option [2] - Show history:**
```
Léo: "📜 HISTORIQUE RÉCENT
     ─────────────────────────────────────────────
     {for each entry in history (last 10)}
     • {workflow} - {completed_date}
       Agent: {agent} | Output: {output}
     {/for}
     ─────────────────────────────────────────────

     [1] Retour au statut
     [2] Retour au menu principal"
```

**Option [3] - Back to menu:**
→ Display orchestrator intelligent menu

## Output
- Visual status display
- No file modifications
- User returned to menu or next action

## Autonomy Rules
- **CAN** autonomously: Read all status files, display formatted output
- **MUST CHECKPOINT**: None for this skill
- **ALWAYS**: Show next recommended action prominently

## Integration Notes
This skill is read-only. It aggregates information from:
- workflow-status.yaml (primary source)
- project-path.yaml (phase definitions)
- project-context.md (project details)
- sprint-status.yaml (story progress)

No files are modified during status display.
