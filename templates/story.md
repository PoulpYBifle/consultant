---
story_id: "{PREFIX}-{NNN}"
title: "{action_verb} {what}"
status: ready-for-dev
priority: P1
estimated_hours: 0
created: "{YYYY-MM-DD}"
epic: ""
depends_on: []
---

# Story: {title}

## Description

**En tant que** {user_role}
**Je veux** {action}
**Afin de** {business_value}

### Contexte
{Background information explaining why this story exists and its importance}

---

## Acceptance Criteria

- [ ] **AC-1:** {Testable and measurable criterion}
- [ ] **AC-2:** {Testable and measurable criterion}
- [ ] **AC-3:** {Testable and measurable criterion}

### Edge Cases
- [ ] **EC-1:** {Edge case that must be handled}
- [ ] **EC-2:** {Edge case that must be handled}

### Error Handling
- [ ] **ERR-1:** When {condition}, display {error_message}
- [ ] **ERR-2:** When {condition}, {behavior}

---

## Subtasks (Technical)

### Backend

1. [ ] **TASK-B1:** {Task description}
   - **Files:** `{path/to/file.ts}`
   - **Action:** create | modify | delete
   - **Details:** {Specific implementation notes}

2. [ ] **TASK-B2:** {Task description}
   - **Files:** `{path/to/file.ts}`
   - **Action:** modify
   - **Details:** {Specific implementation notes}

### Frontend

3. [ ] **TASK-F1:** {Task description}
   - **Files:** `{path/to/component.tsx}`
   - **Action:** create
   - **Details:** {Specific implementation notes}

4. [ ] **TASK-F2:** {Task description}
   - **Files:** `{path/to/component.tsx}`, `{path/to/styles.css}`
   - **Action:** modify
   - **Details:** {Specific implementation notes}

### Database

5. [ ] **TASK-D1:** {Task description}
   - **Files:** `{path/to/migration.sql}`
   - **Action:** create
   - **Details:** {Schema changes description}

### Tests

6. [ ] **TASK-T1:** {Test task description}
   - **Files:** `{path/to/test.ts}`
   - **Action:** create
   - **Details:** {What tests to write}

---

## Files Impacted

| File | Action | Description |
|------|--------|-------------|
| `src/api/routes/{resource}.ts` | CREATE | New API endpoint |
| `src/models/{resource}.ts` | CREATE | Data model |
| `src/components/{Component}.tsx` | CREATE | UI component |
| `src/types/{resource}.ts` | MODIFY | Add new types |
| `tests/{resource}.test.ts` | CREATE | Unit tests |
| `tests/api/{resource}.test.ts` | CREATE | Integration tests |

---

## Expected Tests

### Unit Tests
- [ ] `{functionName}` should {expected_behavior} when {condition}
- [ ] `{functionName}` should handle {edge_case} correctly
- [ ] `{ComponentName}` should render {expected_state} when {condition}
- [ ] `{ComponentName}` should call `{handler}` when {user_action}

### Integration Tests
- [ ] API `POST /api/{resource}` returns 201 with valid data
- [ ] API `POST /api/{resource}` returns 400 when {invalid_condition}
- [ ] API `GET /api/{resource}` returns paginated list

### E2E Tests (if applicable)
- [ ] User can complete {flow_name} from start to finish
- [ ] Error message displays when {error_condition}

---

## Integration Notes

### Existing Code Analysis

- **Project structure:** {Description of current folder structure}
- **Naming conventions:** {Observed patterns - camelCase, kebab-case, etc.}
- **Reusable components:** {List existing components that can be reused}

### Where This Fits

- **API location:** `src/api/routes/` following existing pattern
- **Component location:** `src/components/{feature}/`
- **Patterns to follow:** {List existing patterns to match}

### Dependencies

- **Uses:** {Existing code/modules this depends on}
- **Used by:** {Future features that will depend on this}

---

## Dev Notes

_This section is filled by the Developer during implementation_

### Implementation Decisions

{Document any decisions made during implementation that deviate from or clarify the original plan}

### Issues Encountered

{Document any issues and how they were resolved}

### Deviations from Plan

{If implementation differs from original plan, explain why}

### Technical Debt

{Any shortcuts taken that should be addressed later}

---

## Review Checklist

Before marking as done:

- [ ] All subtasks completed
- [ ] All acceptance criteria verified
- [ ] All tests written and passing
- [ ] Code follows project patterns
- [ ] No console.log or debug code
- [ ] Dev Notes section updated
- [ ] PR created and reviewed (if applicable)

---

*Story created: {created_date}*
*Last updated: {updated_date}*
