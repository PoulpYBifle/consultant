---
skill: create-story
agent: planner
description: "Créer une story détaillée avec critères d'acceptation, subtasks, fichiers impactés et tests attendus"
autonomy: high
checkpoint: story_validation
---

# Skill: Create Detailed Story

## Purpose
Créer une story complète et détaillée qu'un développeur peut implémenter SANS poser de questions. La story est la source unique de vérité pour l'implémentation.

## Trigger
- Nouveau besoin à développer
- Feature à implémenter
- Commande: `/create-story`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md - understand business context
- Load config.yaml for story prefix
- If existing code: ANALYZE codebase structure
- Check sprint-status.yaml for existing stories
```

### 2. Codebase Analysis (CRITICAL)

```
🔍 CRITICAL STEP - DO NOT SKIP

If there is existing code in the project:
1. Identify the project structure (folders, patterns)
2. Identify naming conventions
3. Identify existing components that might be reused
4. Identify where new code should fit
5. Document in "Integration Notes" section
```

### 3. Story Gathering

Ask these questions:

```markdown
1. "Quel est l'objectif de cette fonctionnalité ?"
   → Description + Business value

2. "Qui l'utilisera et dans quel contexte ?"
   → User role + Trigger

3. "Quel est le résultat attendu, étape par étape ?"
   → Acceptance criteria

4. "Y a-t-il des cas particuliers ou erreurs à gérer ?"
   → Edge cases + Error handling
```

### 4. Story Generation

Create story file following this EXACT structure:

```markdown
---
story_id: {prefix}-{NNN}
title: "{action_verb} {what}"
status: ready-for-dev
priority: P1 | P2 | P3
estimated_hours: {X}
created: {YYYY-MM-DD}
epic: "{epic_name if applicable}"
depends_on: ["{STORY-XXX}" if any]
---

# Story: {title}

## Description

**En tant que** {user_role}
**Je veux** {action}
**Afin de** {business_value}

### Contexte
{Background information, why this story exists}

---

## Acceptance Criteria

- [ ] **AC-1:** {Criterion that is testable and measurable}
- [ ] **AC-2:** {Criterion that is testable and measurable}
- [ ] **AC-3:** {Criterion that is testable and measurable}

### Edge Cases
- [ ] **EC-1:** {Edge case to handle}
- [ ] **EC-2:** {Edge case to handle}

### Error Handling
- [ ] **ERR-1:** When {condition}, show {error_message}

---

## Subtasks (Technical)

### Backend
1. [ ] **TASK-B1:** {Description}
   - **Files:** `{path/to/file.ts}`
   - **Action:** create | modify | delete
   - **Details:** {specific implementation notes}

2. [ ] **TASK-B2:** {Description}
   - **Files:** `{path/to/file.ts}`
   - **Action:** modify
   - **Details:** {specific implementation notes}

### Frontend
3. [ ] **TASK-F1:** {Description}
   - **Files:** `{path/to/component.tsx}`
   - **Action:** create
   - **Details:** {specific implementation notes}

### Database
4. [ ] **TASK-D1:** {Description}
   - **Files:** `{path/to/migration.sql}`
   - **Action:** create
   - **Details:** {schema changes}

---

## Files Impacted

| File | Action | Description |
|------|--------|-------------|
| `src/api/routes/resource.ts` | MODIFY | Add new endpoint |
| `src/components/ResourceForm.tsx` | CREATE | New form component |
| `src/types/resource.ts` | MODIFY | Add new type |
| `tests/resource.test.ts` | CREATE | Unit tests |

---

## Expected Tests

### Unit Tests
- [ ] `{function_name}` should {expected_behavior}
- [ ] `{function_name}` should handle {edge_case}
- [ ] `{component_name}` should render {expected_state}

### Integration Tests
- [ ] API endpoint returns {expected_response} for valid input
- [ ] API endpoint returns {error_code} for {invalid_input}

### E2E Tests (if applicable)
- [ ] User can complete {flow_name} successfully

---

## Integration Notes

### Existing Code Analysis
- **Project structure:** {description}
- **Naming conventions:** {patterns observed}
- **Reusable components:** {list of components to reuse}

### Where This Fits
- **Location:** {where new code goes}
- **Patterns to follow:** {existing patterns to match}
- **Dependencies:** {existing code this depends on}

---

## Dev Notes

_This section is filled by the Developer during implementation_

### Implementation Decisions
{Decisions made during implementation}

### Issues Encountered
{Any issues and how they were resolved}

### Deviations from Plan
{Any changes from original plan and why}
```

### 5. Save and Update

```
1. Save story to: {paths.stories_dir}/story-{id}-{slug}.md
2. Update project-context.md > Stories Backlog
3. Update sprint-status.yaml with new story
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Analyze codebase structure
- Create detailed stories
- Break down into subtasks
- Identify files to modify/create
- Define acceptance criteria and tests
- Update sprint-status.yaml

### MUST CHECKPOINT:
- 🛑 **story_validation**: If story changes core architecture
- 🛑 **security_decision**: If story involves auth/security
- 🛑 **scope_change**: If story reveals missing requirements

---

## Quality Checklist

Before finalizing a story, verify:

```markdown
✅ Story Checklist

[ ] Title is action-oriented (verb + what)
[ ] Description has "As a... I want... So that..."
[ ] ALL acceptance criteria are testable
[ ] EVERY subtask has specific files listed
[ ] Files impacted table is complete
[ ] Expected tests cover all AC
[ ] Integration notes explain where code fits
[ ] Estimated hours is realistic
[ ] Dependencies are identified
```

---

## Output Format

```markdown
## 📝 Story Créée

| Information | Valeur |
|-------------|--------|
| **ID** | {STORY-XXX} |
| **Titre** | {title} |
| **Priorité** | {P1/P2/P3} |
| **Estimation** | {hours}h |

### Critères d'acceptation
{count} critères définis

### Subtasks
{count} tâches techniques

### Fichiers impactés
{count} fichiers

### Fichier
📁 `{stories_dir}/story-{id}-{slug}.md`

---

✅ sprint-status.yaml mis à jour
✅ project-context.md mis à jour
```

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| DE-01 | INVEST Criteria | 10m | Valider la qualité de la story |
| DE-02 | Story Splitting | 20m | Story trop grande (>8h estimées) |
| DE-03 | Acceptance Criteria Workshop | 25m | AC pas clairs ou incomplets |
| DE-04 | Example Mapping | 30m | Edge cases non identifiés |
| DE-05 | User Story Mapping | 45m | Breakdown d'un epic complet |
| DE-06 | Vertical Slicing | 20m | Story full-stack à découper |
| DE-07 | Task Decomposition | 15m | Planification technique |
| DE-08 | Definition of Done | 10m | Critères de completion flous |
| DE-09 | Spike Definition | 15m | Incertitudes techniques |
| DE-10 | MVP Scoping | 25m | Scope trop large |

### Auto-Detection

```
DETECT and SUGGEST techniques based on context:

IF estimated_hours > 8:
   → 💡 Suggérer DE-02 (Story Splitting)
   "Cette story semble conséquente. Voulez-vous la découper ?"

IF acceptance_criteria.count < 3:
   → 💡 Suggérer DE-03 (Acceptance Criteria Workshop)
   "Les critères d'acceptation sont légers. Approfondissons ?"

IF edge_cases not discussed:
   → 💡 Suggérer DE-04 (Example Mapping)
   "Je n'ai pas identifié de cas limites. Explorons avec des exemples ?"

IF story_is_epic_sized:
   → 💡 Suggérer DE-05 (User Story Mapping)
   "Ce besoin semble être un epic. Mappons le parcours utilisateur ?"

IF technical_unknowns detected:
   → 💡 Suggérer DE-09 (Spike Definition)
   "Il y a des incertitudes techniques. Définissons un spike ?"

After story creation:
   → 💡 Suggérer DE-01 (INVEST Criteria)
   "Validons la story avec les critères INVEST ?"
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
4. Intégrer dans la story générée

---

## Anti-Patterns to Avoid

```
⚠️ NEVER create a story without specifying exact files
⚠️ NEVER skip codebase analysis for existing projects
⚠️ NEVER leave acceptance criteria vague
⚠️ NEVER forget error handling criteria
⚠️ NEVER create a story the developer can't implement alone
```
