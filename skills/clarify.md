---
skill: clarify
agent: discovery
description: "Clarifier un besoin flou ou ambigu à travers un questionnement structuré"
autonomy: high
checkpoint: scope_change
---

# Skill: Clarify Requirements

## Purpose
Transformer des besoins clients vagues ou ambigus en exigences précises, actionnables et mesurables.

## Trigger
- Client exprime un besoin de manière floue
- Ambiguïté détectée dans les exigences
- Commande: `/clarify`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md
- Identify the unclear requirement to clarify
- Check if similar requirements already exist
```

### 2. Clarification Loop

Use the **5W+H Framework** to extract precise information:

| Question | Purpose |
|----------|---------|
| **WHAT** | "Quel résultat concret attendez-vous ?" |
| **WHO** | "Qui utilisera cette fonctionnalité ? Quel est leur rôle ?" |
| **WHEN** | "Quand/à quelle fréquence sera-ce utilisé ?" |
| **WHERE** | "Dans quel contexte/écran/processus ?" |
| **WHY** | "Quel problème business cela résout-il ?" |
| **HOW** | "Comment gérez-vous cela aujourd'hui ?" |

### 3. Concrete Scenario Validation

```
ALWAYS ask for a concrete example:
"Pouvez-vous me décrire un cas d'usage réel, étape par étape ?"

Document the scenario:
- Utilisateur: [qui]
- Contexte: [situation de départ]
- Action: [ce que fait l'utilisateur]
- Résultat attendu: [outcome précis]
```

### 4. Validate Understanding

```
Restate the requirement in YOUR words:
"Si je comprends bien, vous avez besoin de [X] pour que [utilisateur] puisse [action]
afin de [bénéfice business]. Est-ce correct ?"

Wait for confirmation or correction.
```

### 5. Update Project Context

After clarification, update project-context.md:

```markdown
## Requirements Registry > Functional Requirements

| ID | Requirement | Priority | Status | Notes |
|----|-------------|----------|--------|-------|
| FR-XXX | [Requirement précis et mesurable] | P1/P2/P3 | validated | [Contexte capturé] |
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Ask all clarifying questions
- Propose requirement definitions
- Validate understanding with client
- Update project-context.md with clarified requirements
- Suggest related requirements that might be needed

### MUST CHECKPOINT:
- 🛑 **scope_change**: If clarification reveals scope creep
- 🛑 **scope_change**: If new major requirement is discovered
- 🛑 **budget_adjustment**: If budget/timeline impact detected

---

## Output Format

After clarification, provide:

```markdown
## Requirement Clarified

**Original statement:** "{vague_statement}"

**Clarified requirement:**
- **ID:** FR-XXX
- **Description:** [precise requirement]
- **User:** [who uses it]
- **Trigger:** [when it's used]
- **Expected outcome:** [measurable result]
- **Business value:** [why it matters]

**Example scenario:**
[Concrete step-by-step scenario]

**Impact:** [scope/budget/timeline if any]

---
✅ Added to project-context.md
```

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| EL-01 | 5 Whys | 10m | Cause racine pas claire |
| EL-02 | Jobs-to-be-Done | 20m | Besoin sous-jacent à découvrir |
| EL-03 | Empathy Mapping | 30m | Perspective utilisateur manquante |
| EL-04 | Scenario Walkthrough | 15m | Flux pas clair |
| EL-05 | Assumption Mapping | 25m | Hypothèses non validées |
| EL-06 | Stakeholder Interview | 30m | Perspectives multiples nécessaires |
| EL-08 | Pain Point Prioritization | 15m | Plusieurs douleurs à prioriser |
| EL-10 | As-Is/To-Be Analysis | 25m | Transformation ou amélioration |

### Auto-Detection

```
DETECT and SUGGEST techniques based on user input:

IF "je ne sais pas pourquoi" or "cause" or "origine":
   → 💡 Suggérer EL-01 (5 Whys)
   "Je ne comprends pas la cause. Creusons avec les 5 Pourquoi ?"

IF feature_request without user_context:
   → 💡 Suggérer EL-02 (Jobs-to-be-Done)
   "Quel est le vrai besoin derrière cette feature ? Utilisons Jobs-to-be-Done."

IF "utilisateur" or user_behavior_unclear:
   → 💡 Suggérer EL-03 (Empathy Mapping)
   "Je ne comprends pas l'utilisateur. Créons une Empathy Map ?"

IF "comment" or "flux" or "processus" unclear:
   → 💡 Suggérer EL-04 (Scenario Walkthrough)
   "Le flux n'est pas clair. Parcourons un scénario concret ?"

IF many_assumptions detected:
   → 💡 Suggérer EL-05 (Assumption Mapping)
   "Beaucoup d'hypothèses. Mappons-les pour les valider ?"

IF "améliorer" or "transformer":
   → 💡 Suggérer EL-10 (As-Is/To-Be Analysis)
   "C'est une amélioration. Comparons l'état actuel et cible ?"
```

### Suggestion Format

```
💡 TECHNIQUE SUGGÉRÉE: {technique_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi: {contextual reason}
Durée: ~{duration} minutes

[A] Appliquer cette technique
[C] Continuer sans technique
```

### Technique Execution

Quand une technique est sélectionnée:
1. Charger le guide depuis `_consultant/modules/technique-selector.md`
2. Guider l'utilisateur à travers les étapes
3. Capturer les outputs
4. Intégrer dans l'exigence clarifiée

### 5 Whys Quick Guide

```
Exemple de déroulement:

Problème: "L'utilisateur veut un meilleur reporting"

1er Pourquoi: "Pourquoi veut-il un meilleur reporting ?"
   → "Parce qu'il ne trouve pas les infos rapidement"

2e Pourquoi: "Pourquoi ne trouve-t-il pas les infos ?"
   → "Parce qu'il doit chercher dans 3 systèmes différents"

3e Pourquoi: "Pourquoi dans 3 systèmes ?"
   → "Parce que les données ne sont pas consolidées"

4e Pourquoi: "Pourquoi pas consolidées ?"
   → "Parce qu'il n'y a pas d'intégration entre les systèmes"

5e Pourquoi: "Pourquoi pas d'intégration ?"
   → "Parce que ça n'a jamais été priorisé"

CAUSE RACINE: Manque d'intégration des données
VRAI BESOIN: Consolidation des données, pas juste "meilleur reporting"
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER assume what the client means - always ask
⚠️ NEVER accept "it should just work" as a requirement
⚠️ NEVER skip the concrete scenario validation
⚠️ NEVER proceed if requirement is still ambiguous
```
