---
skill: next
agent: orchestrator
description: "Exécuter la prochaine action recommandée"
autonomy: very_high
checkpoint: none
---

# Skill: Execute Next Action

## Purpose
Quickly execute the next recommended action from workflow-status.yaml without needing to navigate menus. This is the "fast forward" command.

## Trigger
- User says "suivant", "prochaine étape", "continue", "on fait quoi", "next"
- Menu option [1] "Exécuter la prochaine action"
- Command: `/next`

## Process

### Step 1: Load Current State
```
LOAD workflow-status.yaml:
  - next_action.workflow
  - next_action.agent
  - next_action.reason
```

### Step 2: Check for Blockers

**IF next_action.workflow requires checkpoint:**
```
Léo: "🛑 La prochaine étape nécessite une validation.

      Workflow: /{next_action.workflow}
      Checkpoint: {checkpoint_name}

      {checkpoint_message}

      [APPROUVER] Valider et continuer
      [VOIR DÉTAILS] Voir ce qui a été fait
      [ANNULER] Retour au menu"

WAIT for user response before proceeding.
```

**IF dependencies not met:**
```
Léo: "⏳ Avant de lancer /{next_action.workflow}, il faut d'abord :

      {for each missing dependency}
      • /{dependency} - {dependency_description}
      {/for}

      [1] Lancer /{first_missing_dependency} d'abord
      [2] Voir le statut complet
      [3] Retour au menu"

WAIT for user choice.
```

**IF no blockers:**
→ Proceed to Step 3

### Step 3: Confirm and Execute

```
Léo: "▶ Prochaine action : /{next_action.workflow}

      {next_action.reason}

      Agent: {next_action.agent}

      [ENTER ou 1] Lancer maintenant
      [2] Voir plus de détails
      [3] Choisir autre chose"
```

**On confirmation (Enter or 1):**
1. Display: `"🚀 Lancement de /{next_action.workflow}..."`
2. Load skill file: `{project-root}/_consultant/skills/{next_action.workflow}.md`
3. Execute skill with role persistence
4. After completion, workflow-status.yaml is updated by the skill
5. Return here to show new next action

### Step 4: Show Result and New Next Action

After skill completion:

```
Léo: "✅ /{completed_workflow} terminé avec succès !

      ────────────────────────────────────────────────

      ▶ Nouvelle prochaine action : /{new_next_action.workflow}
        {new_next_action.reason}

      [1] ▶ Continuer avec /{new_next_action.workflow}
      [2] 📊 Voir le statut du projet
      [3] 🔙 Retour au menu principal"
```

This creates a seamless flow where the user can just keep pressing [1] to advance through the project.

## Fast-Forward Mode

If user says "YOLO" or "auto" or "continue tout":
```
Léo: "🚄 Mode Fast-Forward activé !

      Je vais exécuter les workflows automatiquement jusqu'au
      prochain checkpoint ou blocker.

      ⚠️ Je m'arrêterai à :
      • Checkpoints nécessitant validation
      • Questions nécessitant votre input
      • Erreurs ou problèmes

      [CONFIRMER] C'est parti !
      [ANNULER] Non, un par un"
```

**On confirm:**
```
LOOP:
  1. Execute current next_action
  2. Check if new next_action has checkpoint → STOP
  3. Check if new next_action is same as before (stuck) → STOP
  4. Check if phase changed → NOTIFY and continue
  5. Repeat
```

## Output
- Executes the workflow from next_action
- Updates workflow-status.yaml (via the executed skill)
- Returns to next action suggestion or menu

## Autonomy Rules
- **CAN** autonomously: Load next action, execute skill, chain to next
- **MUST CHECKPOINT**: All checkpoints defined in project-path.yaml
- **ALWAYS**: Stop at checkpoints even in fast-forward mode

## Edge Cases

**Project not initialized:**
```
Léo: "📋 Le projet n'est pas encore initialisé.

      La première étape est de créer le projet.

      [1] ▶ Initialiser le projet (/init)
      [2] 🔙 Retour au menu"
```

**All workflows completed:**
```
Léo: "🎉 Félicitations ! Toutes les étapes du projet sont terminées.

      ✅ Discovery: Terminé
      ✅ Quotation: Terminé
      ✅ Specs: Terminé
      ✅ Planning: Terminé
      ✅ Development: Terminé
      ✅ Delivery: Terminé

      Le projet '{project.name}' est livré !

      Voulez-vous :
      [1] 📊 Voir le résumé final
      [2] 📁 Voir les livrables
      [3] 🔄 Démarrer un nouveau projet"
```

**In development phase with multiple stories:**
```
Léo: "▶ Prochaine action : /implement

      Il y a {count} stories prêtes pour le développement :

      {for top 3 ready stories}
      • {story_id}: {story_title} (P{priority})
      {/for}

      [1] Implémenter la story prioritaire ({first_story_id})
      [2] Choisir une story spécifique
      [3] Voir toutes les stories"
```
