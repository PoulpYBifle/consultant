---
skill: upsell
agent: discovery
description: "Identifier les opportunités d'upselling - besoins non exprimés qui pourraient devenir de futurs engagements"
autonomy: high
checkpoint: none
---

# Skill: Identify Upselling Opportunities

## Purpose
Détecter les besoins clients non exprimés ou hors scope actuel qui représentent des opportunités de futurs engagements. Upselling = aider le client à voir ce dont il aura besoin.

## Trigger
- Pendant ou après une session de discovery
- Besoin détecté mais hors scope actuel
- Commande: `/upsell`

---

## Process

### 1. Context Analysis
```
🚨 BEFORE ANY ACTION:
- Load project-context.md
- Review current scope (In Scope / Out of Scope)
- Review pain points and business objectives
- Identify gaps between objectives and scope
```

### 2. Opportunity Detection Patterns

Look for these signals during conversations:

| Signal | Opportunity Type |
|--------|------------------|
| "Pour l'instant on fait ça manuellement..." | Automation |
| "On aimerait bien un jour..." | Future phase |
| "C'est un problème mais pas prioritaire..." | Quick win add-on |
| "On utilise Excel pour..." | Data management |
| "Les équipes n'ont pas de visibilité sur..." | Reporting/Dashboard |
| "On perd du temps à..." | Process optimization |
| "On fait des erreurs quand..." | Validation/Workflow |

### 3. Opportunity Qualification

For each opportunity identified, evaluate:

```markdown
| Critère | Score (1-5) |
|---------|-------------|
| **Urgence client** | How soon do they need this? |
| **Valeur business** | ROI potential for the client |
| **Complexité** | Effort to implement |
| **Synergie** | Fits with current project? |
| **Budget probable** | Can they afford it? |
```

### 4. Document Opportunity

Add to project-context.md > Upselling Opportunities:

```markdown
## Upselling Opportunities

| Opportunité | Description | Valeur estimée | Priorité client | Score |
|-------------|-------------|----------------|-----------------|-------|
| {name} | {what it solves} | {EUR estimate} | {high/medium/low} | {1-5} |
```

---

## Opportunity Templates

### Automation Opportunity
```markdown
**Opportunité:** Automatisation de {process}
**Problème actuel:** Le client fait {manual_task} manuellement, ce qui prend {time} et génère {errors}
**Solution proposée:** {automation_solution}
**Valeur estimée:** {hours} heures de dev = {amount} EUR
**ROI client:** Économie de {time_saved} par {period}
```

### Reporting/Dashboard Opportunity
```markdown
**Opportunité:** Tableau de bord {area}
**Problème actuel:** Pas de visibilité sur {metrics}, décisions basées sur {current_method}
**Solution proposée:** Dashboard temps réel avec {features}
**Valeur estimée:** {hours} heures de dev = {amount} EUR
**ROI client:** Meilleures décisions, gain de {time} en reporting
```

### Integration Opportunity
```markdown
**Opportunité:** Intégration avec {system}
**Problème actuel:** Double saisie entre {system_a} et {system_b}
**Solution proposée:** Synchronisation automatique via {method}
**Valeur estimée:** {hours} heures de dev = {amount} EUR
**ROI client:** Fin de la double saisie, données cohérentes
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Identify and document opportunities
- Calculate rough value estimates
- Add to project-context.md
- Suggest opportunities during conversations
- Prioritize opportunities by score

### NO CHECKPOINT REQUIRED:
- This skill is purely informational
- Opportunities are documented for future reference
- No immediate action or scope change

---

## Output Format

```markdown
## Upselling Opportunities Identified

### Opportunity 1: {name}
- **Type:** Automation | Reporting | Integration | Feature
- **Signal detected:** "{quote from client}"
- **Problem:** {current pain}
- **Proposed solution:** {brief description}
- **Estimated value:** {amount} EUR ({hours}h)
- **Client priority:** High | Medium | Low
- **Synergy with current project:** High | Medium | Low
- **Recommended timing:** Now | After delivery | Future phase

### Summary
| Opportunité | Valeur | Priorité | Timing |
|-------------|--------|----------|--------|
| {name} | {EUR} | {H/M/L} | {when} |

**Total upsell potential:** {total} EUR

---
✅ Added to project-context.md > Upselling Opportunities
```

---

## Communication Tips

```
✅ DO: "J'ai noté que vous mentionnez {pain}. C'est hors scope actuel,
       mais je le note comme amélioration potentielle pour une phase future."

✅ DO: "Ce besoin pourrait être adressé après la livraison initiale.
       Je l'ajoute aux opportunités identifiées."

❌ DON'T: Push aggressively for scope expansion
❌ DON'T: Make the client feel they're missing something essential
❌ DON'T: Confuse current scope with future opportunities
```

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| OP-01 | Gap Analysis | 25m | Identifier les écarts entre actuel et idéal |
| OP-02 | Future State Visioning | 30m | Clarifier la vision long terme |
| OP-03 | Quick Win Identification | 15m | Trouver des gains rapides |
| OP-04 | Integration Opportunity Scan | 20m | Détecter les intégrations utiles |
| OP-05 | Automation Potential Assessment | 25m | Évaluer le potentiel d'automatisation |
| EL-02 | Jobs-to-be-Done | 20m | Comprendre les besoins non exprimés |
| EL-10 | As-Is/To-Be Analysis | 25m | Comparer état actuel vs futur |

### Auto-Detection

```
DETECT and SUGGEST techniques based on context:

IF "on fait ça manuellement":
   → 💡 Suggérer OP-05 (Automation Potential Assessment)
   "Vous mentionnez un processus manuel. Évaluons le potentiel d'automatisation ?"

IF "on aimerait bien un jour":
   → 💡 Suggérer OP-02 (Future State Visioning)
   "Vous avez une vision future. Explorons-la ensemble ?"

IF "pas prioritaire mais problématique":
   → 💡 Suggérer OP-03 (Quick Win Identification)
   "Ce problème pourrait être un quick win. Analysons ?"

IF "double saisie" or "plusieurs systèmes":
   → 💡 Suggérer OP-04 (Integration Opportunity Scan)
   "Intégration potentielle détectée. Explorons cette opportunité ?"

IF gaps_between_scope_and_objectives:
   → 💡 Suggérer OP-01 (Gap Analysis)
   "Il y a un écart entre les objectifs et le scope. Analysons-le ?"

IF underlying_need_unclear:
   → 💡 Suggérer EL-02 (Jobs-to-be-Done)
   "Quel est le vrai besoin sous-jacent ? Utilisons Jobs-to-be-Done."
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
4. Documenter comme opportunité dans project-context.md

### Quick Win Identification Guide

```
Critères d'un Quick Win:
1. Effort faible (< 8h de dev)
2. Valeur immédiate perçue par le client
3. Pas de dépendance avec d'autres features
4. Risque technique faible

Questions à poser:
- "Qu'est-ce qui vous fait perdre le plus de temps au quotidien ?"
- "Quelle petite amélioration aurait un grand impact ?"
- "Y a-t-il un irritant que tout le monde mentionne ?"

Scoring: Impact (1-5) × Facilité (1-5) = Priorité
  > Score > 15 = Quick Win prioritaire
  > Score 10-15 = À considérer
  > Score < 10 = Pas un quick win
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER push aggressively for upsell
⚠️ NEVER make the client feel their scope is insufficient
⚠️ NEVER promise upsell features as part of current project
⚠️ NEVER forget to document opportunities for follow-up
⚠️ NEVER mix current scope with future opportunities
```
