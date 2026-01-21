---
skill: plan-sprint
agent: planner
description: "Planifier le sprint en organisant les stories par priorité et dépendances"
autonomy: high
checkpoint: none
---

# Skill: Plan Sprint

## Purpose
Organiser les stories existantes dans un sprint cohérent, en respectant les priorités et dépendances.

## Trigger
- Plusieurs stories créées, besoin d'organiser
- Début d'un nouveau sprint
- Commande: `/plan-sprint`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load all story files from {paths.stories_dir}
- Load sprint-status.yaml
- Load project-context.md for constraints
```

### 2. Story Inventory

Create inventory of all stories:

```markdown
| ID | Title | Status | Priority | Hours | Dependencies |
|----|-------|--------|----------|-------|--------------|
| STORY-001 | ... | ready-for-dev | P1 | 8 | - |
| STORY-002 | ... | ready-for-dev | P2 | 4 | STORY-001 |
```

### 3. Dependency Analysis

```
Build dependency graph:
- Identify blocking dependencies
- Flag circular dependencies (ERROR)
- Order by dependency chain

Example:
STORY-001 (no deps) → STORY-002 (deps: 001) → STORY-003 (deps: 002)
```

### 4. Sprint Capacity Planning

```markdown
## Sprint Capacity

| Constraint | Value |
|------------|-------|
| Sprint duration | {X weeks} |
| Available hours | {total_hours} |
| Buffer (20%) | {buffer_hours} |
| **Capacity** | {capacity_hours} |

## Allocation

| Priority | Stories | Hours |
|----------|---------|-------|
| P1 (must) | {count} | {hours} |
| P2 (should) | {count} | {hours} |
| P3 (could) | {count} | {hours} |
| **Total** | {count} | {hours} |
```

### 5. Sprint Order

Define execution order:

```markdown
## Sprint Execution Order

### Week 1
1. STORY-001 (P1, 8h) - No dependencies
2. STORY-003 (P1, 4h) - No dependencies

### Week 2
3. STORY-002 (P1, 6h) - Depends on STORY-001
4. STORY-004 (P2, 8h) - Depends on STORY-003

### Backlog (overflow)
- STORY-005 (P3, 4h) - Deferred to next sprint
```

### 6. Update Sprint Status

Update sprint-status.yaml:

```yaml
sprint:
  name: "Sprint {N}"
  start_date: "{date}"
  end_date: "{date}"
  goal: "{sprint_goal}"
  capacity_hours: {hours}

stories:
  - id: "STORY-001"
    title: "{title}"
    status: "ready-for-dev"
    priority: "P1"
    order: 1
    assigned_to: "developer"

  - id: "STORY-002"
    title: "{title}"
    status: "ready-for-dev"
    priority: "P1"
    order: 2
    depends_on: "STORY-001"
    assigned_to: "developer"

statistics:
  total_stories: {count}
  total_hours: {hours}
  p1_count: {count}
  p2_count: {count}
  p3_count: {count}
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Inventory all stories
- Analyze dependencies
- Calculate capacity
- Propose sprint order
- Update sprint-status.yaml

### NO CHECKPOINT REQUIRED:
- Sprint planning is informational
- Developer will execute stories in order

---

## Output Format

```markdown
## 📅 Sprint Planifié: {sprint_name}

### Vue d'ensemble
| Métrique | Valeur |
|----------|--------|
| **Durée** | {X} semaines |
| **Stories** | {count} |
| **Heures estimées** | {hours}h |
| **Capacité** | {capacity}h |

### Ordre d'exécution

| # | Story | Priority | Hours | Dependencies |
|---|-------|----------|-------|--------------|
| 1 | STORY-001: {title} | P1 | 8h | - |
| 2 | STORY-002: {title} | P1 | 6h | STORY-001 |
| 3 | STORY-003: {title} | P2 | 4h | - |

### Backlog (hors sprint)
- STORY-005: {title} (P3, 4h)

### Risques
- {risk_1}
- {risk_2}

---

✅ sprint-status.yaml mis à jour

**Prochaine étape:** Implémenter la première story → `/implement` (Agent Developer)
```

---

## Sprint Planning Rules

```markdown
1. P1 stories MUST fit in sprint capacity
2. Never start a story if its dependencies aren't done
3. Leave 20% buffer for unexpected issues
4. Maximum 1 story in_progress at a time per developer
5. P3 stories are first to be cut if capacity is exceeded
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER plan more hours than capacity
⚠️ NEVER ignore dependencies
⚠️ NEVER start P2/P3 before all P1 are done
⚠️ NEVER skip the buffer - issues WILL happen
```
