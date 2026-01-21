---
skill: estimate
agent: architect
description: "Estimer l'effort du projet en heures avec buffer pour les inconnus"
autonomy: high
checkpoint: budget_adjustment
---

# Skill: Effort Estimation

## Purpose
Produire une estimation réaliste de l'effort en heures pour chaque poste du projet, incluant un buffer pour les imprévus.

## Trigger
- Après le cadrage projet (/frame)
- Besoin d'estimation pour devis
- Commande: `/estimate`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md - STOP if empty or no scope defined
- Load config.yaml for rates
- Extract: scope, constraints, technical context, integrations
```

### 2. Scope Breakdown

For each feature in scope, identify:

```markdown
| Feature | Composants techniques | Complexité |
|---------|----------------------|------------|
| {feature_1} | Frontend, Backend, DB | Low/Med/High |
| {feature_2} | ... | ... |
```

### 3. Estimation Matrix

Use this estimation guide:

| Composant | Low (h) | Medium (h) | High (h) |
|-----------|---------|------------|----------|
| **Frontend - Page simple** | 2-4 | 4-8 | 8-16 |
| **Frontend - Page complexe** | 8-16 | 16-24 | 24-40 |
| **Backend - CRUD simple** | 2-4 | 4-8 | 8-12 |
| **Backend - Logique métier** | 8-16 | 16-32 | 32-48 |
| **Base de données - Modèle** | 2-4 | 4-8 | 8-16 |
| **Intégration API externe** | 8-16 | 16-32 | 32-48 |
| **Authentification** | 8-16 | 16-24 | 24-40 |
| **Tests unitaires** | 20% du dev | 25% du dev | 30% du dev |
| **Tests E2E** | 10% du dev | 15% du dev | 20% du dev |

### 4. Buffer Calculation

```
ALWAYS add buffer for unknowns:

| Niveau de confiance | Buffer |
|---------------------|--------|
| Scope bien défini, tech connue | +20% |
| Scope défini, tech nouvelle | +30% |
| Scope flou, tech connue | +40% |
| Scope flou, tech nouvelle | +50% |
```

### 5. Estimation Breakdown

Create detailed estimation:

```markdown
## Estimation détaillée

### 1. Discovery & Architecture
| Tâche | Heures |
|-------|--------|
| Analyse des besoins | X |
| Architecture technique | X |
| **Sous-total** | X |

### 2. Développement
| Feature | Frontend | Backend | DB | Total |
|---------|----------|---------|-----|-------|
| {feat_1} | X | X | X | X |
| {feat_2} | X | X | X | X |
| **Sous-total** | X | X | X | X |

### 3. Tests
| Type | Heures |
|------|--------|
| Tests unitaires | X |
| Tests E2E | X |
| **Sous-total** | X |

### 4. Documentation & Livraison
| Tâche | Heures |
|-------|--------|
| Documentation utilisateur | X |
| Documentation technique | X |
| Formation | X |
| **Sous-total** | X |

### 5. Buffer ({percentage}%)
| Buffer pour imprévus | X |

---

## TOTAL: {total_hours} heures
```

### 6. Update Project Context

Update project-context.md > Financial Summary:

```markdown
## Financial Summary

| Poste | Estimation (h) | Montant (EUR) |
|-------|----------------|---------------|
| Discovery | X | X |
| Développement | X | X |
| Tests | X | X |
| Documentation | X | X |
| Buffer | X | X |
| **TOTAL** | **X** | **X** |
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Break down scope into technical components
- Calculate effort for each component
- Apply appropriate buffer
- Create detailed estimation
- Update project-context.md

### MUST CHECKPOINT:
- 🛑 **budget_adjustment**: If estimation exceeds client budget by >20%
- 🛑 **scope_change**: If estimation reveals missing scope items

---

## Output Format

```markdown
## 📊 Estimation Projet: {project_name}

### Résumé
| Métrique | Valeur |
|----------|--------|
| **Effort total** | {total}h |
| **Buffer inclus** | {buffer}% ({buffer_hours}h) |
| **Montant estimé** | {amount} EUR |

### Détail par poste

| Poste | Heures | Taux | Montant |
|-------|--------|------|---------|
| Discovery/Architecture | {h} | {rate} | {EUR} |
| Développement | {h} | {rate} | {EUR} |
| Tests | {h} | {rate} | {EUR} |
| Documentation | {h} | {rate} | {EUR} |
| Buffer ({buffer}%) | {h} | - | {EUR} |
| **TOTAL** | **{h}** | - | **{EUR}** |

### Hypothèses
- {assumption_1}
- {assumption_2}

### Risques identifiés
- {risk_1}: Impact +{hours}h si matérialisé
- {risk_2}: Impact +{hours}h si matérialisé

---

**Niveau de confiance:** {High/Medium/Low}
**Prochaine étape:** Génération du devis → `/quote`

---
✅ project-context.md > Financial Summary mis à jour
```

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| AN-06 | Analogical Estimation | 15m | Projet similaire passé existe |
| AN-07 | T-Shirt Sizing | 10m | Estimation rapide relative |
| AN-08 | Three-Point Estimation | 20m | Incertitude élevée, besoin de range |
| AN-05 | Risk Assessment Matrix | 25m | Identifier les risques |
| AN-10 | Dependency Mapping | 20m | Dépendances complexes |
| AN-04 | Success Criteria Definition | 15m | Métriques de succès pas claires |
| DE-07 | Task Decomposition | 15m | Besoin de détailler pour estimer |

### Auto-Detection

```
DETECT and SUGGEST techniques based on context:

IF similar_project_mentioned:
   → 💡 Suggérer AN-06 (Analogical Estimation)
   "Vous avez mentionné un projet similaire. Utilisons-le comme référence ?"

IF uncertainty_high or scope_unclear:
   → 💡 Suggérer AN-08 (Three-Point Estimation)
   "Beaucoup d'incertitude. Estimons en optimiste/probable/pessimiste ?"

IF quick_estimate_needed:
   → 💡 Suggérer AN-07 (T-Shirt Sizing)
   "Besoin d'une estimation rapide. Utilisons le T-Shirt Sizing ?"

IF integration_mentioned:
   → 💡 Suggérer AN-05 (Risk Assessment Matrix)
   "Les intégrations sont risquées. Évaluons les risques ?"

IF dependencies_complex:
   → 💡 Suggérer AN-10 (Dependency Mapping)
   "Plusieurs dépendances identifiées. Mappons-les ?"

IF scope_vague:
   → 💡 Suggérer DE-07 (Task Decomposition)
   "Le scope est vague. Décomposons en tâches pour mieux estimer ?"
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
4. Intégrer dans l'estimation détaillée

### Three-Point Estimation Quick Guide

```
Pour chaque composant, estimer:
- O (Optimiste): Si tout va parfaitement
- M (Most likely): Estimation réaliste
- P (Pessimiste): Si problèmes rencontrés

Formule: E = (O + 4*M + P) / 6
Écart-type: σ = (P - O) / 6

Exemple:
- O = 8h, M = 12h, P = 24h
- E = (8 + 48 + 24) / 6 = 13.3h
- σ = (24 - 8) / 6 = 2.7h
- Range: 10.6h - 16h (E ± σ)
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER estimate without reading project-context.md first
⚠️ NEVER skip the buffer - unknowns ALWAYS exist
⚠️ NEVER underestimate integrations - they're always harder
⚠️ NEVER forget testing time - it's 20-30% of dev
⚠️ NEVER give point estimates - use ranges when unsure
```
