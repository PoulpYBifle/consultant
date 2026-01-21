---
skill: techniques
agent: orchestrator
description: "Explorer et utiliser les techniques d'idéation du catalogue"
autonomy: high
checkpoint: none
---

# Skill: Explore Ideation Techniques

## Purpose
Permettre à l'utilisateur d'explorer le catalogue de techniques d'idéation et de recevoir des recommandations contextuelles basées sur sa situation actuelle.

## Trigger
- Besoin d'une technique pour avancer
- Exploration du catalogue disponible
- Commande: `/techniques`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load consultant-techniques.csv from _consultant/data/
- Load workflow-status.yaml to know current phase
- Load project-context.md for project context
```

### 2. Display Main Menu

```
╔════════════════════════════════════════════════════════════════╗
║             📚 CATALOGUE DE TECHNIQUES D'IDÉATION              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Catégories disponibles:                                       ║
║                                                                ║
║  [1] 🎯 Elicitation (10)    - Extraire les besoins             ║
║  [2] 📊 Analysis (10)       - Analyser et estimer              ║
║  [3] ✂️  Decomposition (10) - Découper et structurer           ║
║  [4] 🏗️  Architecture (5)   - Concevoir la solution            ║
║  [5] ✅ Validation (3)      - Valider et tester                ║
║  [6] 💬 Communication (2)   - Livrer et présenter              ║
║  [7] 💡 Opportunity (5)     - Détecter les opportunités        ║
║                                                                ║
║  ─────────────────────────────────────────────────────────     ║
║                                                                ║
║  [R] 🎯 RECOMMANDATION basée sur le contexte actuel            ║
║  [S] 🔍 RECHERCHER une technique par mot-clé                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

>>>
```

### 3. Category Display

When user selects a category, show techniques in that category:

```
╔════════════════════════════════════════════════════════════════╗
║                    🎯 TECHNIQUES D'ELICITATION                 ║
╠════════════════════════════════════════════════════════════════╣

┌─────┬─────────────────────────┬───────┬─────────────────────────┐
│ ID  │ Technique               │ Durée │ Idéal pour              │
├─────┼─────────────────────────┼───────┼─────────────────────────┤
│ EL-01 │ 5 Whys                │ 10m   │ Trouver la cause racine │
│ EL-02 │ Jobs-to-be-Done       │ 20m   │ Comprendre les besoins  │
│ EL-03 │ Empathy Mapping       │ 30m   │ Perspective utilisateur │
│ EL-04 │ Scenario Walkthrough  │ 15m   │ Flux pas clairs         │
│ EL-05 │ Assumption Mapping    │ 25m   │ Hypothèses risquées     │
│ EL-06 │ Stakeholder Interview │ 30m   │ Perspectives multiples  │
│ EL-07 │ Context Mapping       │ 45m   │ Contexte complexe       │
│ EL-08 │ Pain Point Priority   │ 15m   │ Prioriser les douleurs  │
│ EL-09 │ Goal Decomposition    │ 20m   │ Objectifs vagues        │
│ EL-10 │ As-Is/To-Be Analysis  │ 25m   │ Transformation          │
└─────┴─────────────────────────┴───────┴─────────────────────────┘

[ID] Sélectionner une technique (ex: EL-01)
[B]  Retour au menu principal

>>>
```

### 4. Technique Detail

When user selects a technique, show full details:

```
╔════════════════════════════════════════════════════════════════╗
║                   🎯 5 WHYS (EL-01)                            ║
╠════════════════════════════════════════════════════════════════╣

📋 DESCRIPTION:
Drill down through causation layers to find root cause.
Technique simple mais puissante pour découvrir la vraie cause
d'un problème en demandant "Pourquoi ?" de manière répétée.

✅ IDÉAL POUR:
- Problèmes dont la cause n'est pas claire
- Besoins exprimés de manière vague
- Situations où le client ne sait pas expliquer pourquoi

⏱️  DURÉE: ~10 minutes
📊 COMPLEXITÉ: Low
🎯 PHASE: Discovery
🔧 SKILLS: /clarify

─────────────────────────────────────────────────────────────────

📝 COMMENT L'APPLIQUER:

1. Énoncer le problème initial clairement
   Ex: "L'utilisateur veut un meilleur reporting"

2. Demander "Pourquoi ?" → Noter la réponse
   "Pourquoi veut-il un meilleur reporting ?"
   → "Parce qu'il ne trouve pas les infos rapidement"

3. Sur cette réponse, demander "Pourquoi ?" → Noter
   "Pourquoi ne trouve-t-il pas les infos ?"
   → "Parce qu'il doit chercher dans plusieurs endroits"

4. Répéter jusqu'à 5 fois ou jusqu'à la cause racine
   "Pourquoi dans plusieurs endroits ?"
   → "Parce que les données ne sont pas consolidées"

5. Valider la cause racine identifiée
   CAUSE RACINE: Manque de consolidation des données

─────────────────────────────────────────────────────────────────

[U] Utiliser cette technique maintenant
[B] Retour à la catégorie
[M] Menu principal

>>>
```

### 5. Contextual Recommendation

When user selects [R], analyze context and recommend:

```
🎯 RECOMMANDATION CONTEXTUELLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Contexte détecté:
   - Phase: {phase from workflow-status}
   - Dernière action: {last_completed_skill}
   - Prochaine action: {next_action}

💡 TECHNIQUES RECOMMANDÉES:

┌───┬─────────────────────────┬─────────────────────────────────┐
│ # │ Technique               │ Pourquoi                        │
├───┼─────────────────────────┼─────────────────────────────────┤
│ 1 │ {technique_name}        │ {reason based on context}       │
│ 2 │ {technique_name}        │ {reason based on context}       │
│ 3 │ {technique_name}        │ {reason based on context}       │
└───┴─────────────────────────┴─────────────────────────────────┘

[1-3] Sélectionner une technique
[M]   Menu principal

>>>
```

### 6. Keyword Search

When user selects [S], prompt for keyword:

```
🔍 RECHERCHE PAR MOT-CLÉ
━━━━━━━━━━━━━━━━━━━━━━━

Tapez un mot-clé pour trouver des techniques pertinentes.
Exemples: "estimation", "découper", "utilisateur", "risque"

>>> estimation

─────────────────────────────────────────────────────────────────

📊 RÉSULTATS POUR "estimation":

┌─────┬─────────────────────────┬───────┬─────────────────────────┐
│ ID  │ Technique               │ Cat.  │ Match                   │
├─────┼─────────────────────────┼───────┼─────────────────────────┤
│ AN-06 │ Analogical Estimation │ anal. │ "Estimation par analogie"|
│ AN-07 │ T-Shirt Sizing        │ anal. │ "Estimation rapide"     │
│ AN-08 │ Three-Point Estimation│ anal. │ "Estimation à 3 points" │
└─────┴─────────────────────────┴───────┴─────────────────────────┘

[ID] Voir les détails
[M]  Menu principal

>>>
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Display catalog and categories
- Search techniques by keyword
- Show technique details
- Make contextual recommendations
- Guide through technique execution

### NO CHECKPOINT REQUIRED:
- This skill is purely informational/facilitative
- User chooses whether to apply techniques

---

## Output Format

When technique is applied, capture results:

```markdown
## 🎯 Technique Applied: {technique_name}

### Context
- Skill: {current_skill}
- Input: {user_problem_statement}

### Process
{Steps followed with responses}

### Findings
{Key insights discovered}

### Impact on skill output
{How this affects the current task}

---
✅ Technique completed
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER force a technique - always let user choose
⚠️ NEVER suggest techniques that don't match the context
⚠️ NEVER make technique execution feel bureaucratic
⚠️ NEVER skip technique guides - follow the steps
⚠️ NEVER forget to integrate findings into skill output
```
