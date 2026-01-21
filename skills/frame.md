---
skill: frame
agent: discovery
description: "Cadrage rapide du projet pour permettre une estimation et un devis"
autonomy: high
checkpoint: scope_change
---

# Skill: Quick Project Framing

## Purpose
Capturer rapidement les éléments essentiels d'un projet pour permettre à l'Architect d'estimer et de créer un devis. Focus sur l'essentiel, pas sur l'exhaustivité.

## Trigger
- Nouveau projet à cadrer
- Besoin d'une estimation rapide
- Commande: `/frame`

---

## Process

### 1. Context Check
```
🚨 BEFORE ANY ACTION:
- Check if project-context.md exists
- If empty: Initialize with framing data
- If exists: Update with new information
```

### 2. Essential Questions (10 questions max)

Capture these elements in order:

#### A. Business Context (3 questions)
```
1. "En une phrase, quel est l'objectif principal de ce projet ?"
   → Executive Summary

2. "Quel problème business résolvez-vous ? Quel est le coût actuel de ce problème ?"
   → Pain Points + Business Value

3. "Qui sont les utilisateurs principaux et combien sont-ils ?"
   → User Profile + Scale
```

#### B. Scope (3 questions)
```
4. "Quelles sont les 3-5 fonctionnalités essentielles (must-have) ?"
   → In Scope (prioritaires)

5. "Y a-t-il des fonctionnalités 'nice-to-have' qui pourraient être en phase 2 ?"
   → Out of Scope / Upsell opportunities

6. "Y a-t-il des intégrations avec des systèmes existants ?"
   → Technical Context > Integrations
```

#### C. Constraints (3 questions)
```
7. "Quelle est votre enveloppe budgétaire ?"
   → Constraints > Budget

8. "Y a-t-il une deadline ou un événement clé ?"
   → Constraints > Timeline

9. "Y a-t-il des contraintes techniques ou réglementaires ?"
   → Constraints > Technical / Regulatory
```

#### D. Success (1 question)
```
10. "Comment saurez-vous que le projet est un succès ? Quels KPIs ?"
    → Success Metrics
```

### 3. Rapid Synthesis

After questions, create a **Project Frame Summary**:

```markdown
## Project Frame Summary

**Projet:** {project_name}
**Client:** {client_name}
**Date:** {date}

### En bref
{one_sentence_summary}

### Problème → Solution
- **Problème:** {pain_point}
- **Solution:** {high_level_solution}
- **Valeur:** {business_value}

### Scope essentiel
1. {feature_1}
2. {feature_2}
3. {feature_3}

### Contraintes
- Budget: {budget_range}
- Délai: {timeline}
- Technique: {constraints}

### Succès =
{success_criteria}

### Prochaine étape
→ Estimation par l'Architect (/estimate)
```

### 4. Update Project Context

Populate project-context.md with framing data:
- Executive Summary
- Client Profile (basic)
- Business Objectives
- Pain Points
- In Scope (essential features)
- Out of Scope
- Constraints
- Success Metrics

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Ask all framing questions
- Synthesize responses
- Create/update project-context.md
- Create Project Frame Summary
- Recommend next steps

### MUST CHECKPOINT:
- 🛑 **scope_change**: If scope seems larger than initially discussed
- 🛑 **scope_change**: If budget constraint doesn't match scope expectations

---

## Output Format

```markdown
## 📋 Cadrage Projet: {project_name}

### Résumé
{one_paragraph_summary}

### Scope essentiel (must-have)
| # | Fonctionnalité | Description |
|---|----------------|-------------|
| 1 | {feature} | {brief_description} |
| 2 | {feature} | {brief_description} |
| 3 | {feature} | {brief_description} |

### Contraintes
| Type | Valeur |
|------|--------|
| Budget | {amount} |
| Délai | {deadline} |
| Technique | {constraints} |

### Critères de succès
- {metric_1}
- {metric_2}

### Hors scope (phase 2 potentielle)
- {out_of_scope_1}
- {out_of_scope_2}

---

**Statut:** ✅ Cadrage complété
**Prochaine étape:** Estimation technique → `/estimate` (Agent Architect)

---
✅ project-context.md mis à jour
```

---

## Quick Framing vs Deep Discovery

| Aspect | Quick Frame (/frame) | Deep Discovery (/clarify) |
|--------|---------------------|---------------------------|
| **Durée** | 15-30 min | 1-2 heures |
| **Objectif** | Permettre estimation | Spécifications complètes |
| **Niveau de détail** | High-level | Détaillé |
| **Questions** | 10 max | Illimité |
| **Output** | Project Frame Summary | Full Requirements |
| **Quand** | Avant devis | Après devis accepté |

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| AN-01 | Value Proposition Canvas | 30m | Nouveau produit, valeur pas claire |
| AN-02 | Problem-Solution Fit | 15m | Valider que la solution répond au problème |
| AN-03 | Stakeholder Mapping | 20m | Plusieurs parties prenantes |
| AN-04 | Success Criteria Definition | 15m | KPIs et succès pas définis |
| AN-09 | Feature Prioritization Matrix | 25m | Beaucoup de features à prioriser |
| EL-05 | Assumption Mapping | 25m | Beaucoup d'hypothèses non validées |
| EL-07 | Context Mapping | 45m | Contexte organisationnel complexe |
| EL-09 | Goal Decomposition | 20m | Objectifs vagues ou trop ambitieux |
| DE-10 | MVP Scoping | 25m | Scope initial trop large |
| OP-02 | Future State Visioning | 30m | Vision long terme à clarifier |

### Auto-Detection

```
DETECT and SUGGEST techniques based on context:

IF project_type == "new_product":
   → 💡 Suggérer AN-01 (Value Proposition Canvas)
   "C'est un nouveau produit. Clarifions la proposition de valeur ?"

IF value_proposition unclear:
   → 💡 Suggérer AN-01 (Value Proposition Canvas)
   "La valeur apportée n'est pas claire. Utilisons le Value Proposition Canvas ?"

IF stakeholders.count > 2:
   → 💡 Suggérer AN-03 (Stakeholder Mapping)
   "Plusieurs parties prenantes identifiées. Mappons-les ?"

IF success_metrics not defined:
   → 💡 Suggérer AN-04 (Success Criteria Definition)
   "Les critères de succès ne sont pas définis. Précisons-les ?"

IF scope seems broad:
   → 💡 Suggérer DE-10 (MVP Scoping)
   "Le scope semble large. Définissons un MVP ?"

IF many_features > 5:
   → 💡 Suggérer AN-09 (Feature Prioritization Matrix)
   "Beaucoup de features listées. Priorisons-les ?"

IF goals_vague:
   → 💡 Suggérer EL-09 (Goal Decomposition)
   "Les objectifs sont vagues. Décomposons-les ?"
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
4. Intégrer dans le Project Frame Summary

---

## Anti-Patterns to Avoid

```
⚠️ NEVER try to capture everything - focus on essentials
⚠️ NEVER skip the budget question - it's critical for estimation
⚠️ NEVER promise features - just document what's discussed
⚠️ NEVER give time estimates yourself - that's the Architect's job
```
