---
skill: implement
agent: developer
description: "Implémenter une story en suivant les subtasks et critères d'acceptation"
autonomy: very_high
checkpoint: security_decision
---

# Skill: Implement Story

## Purpose
Implémenter une story complète en suivant EXACTEMENT les subtasks définies. Le fichier story est la source unique de vérité.

## Trigger
- Story en statut "ready-for-dev"
- Commande: `/implement`

---

## Process

### 1. Story Selection
```
🚨 BEFORE ANY ACTION:
- Load sprint-status.yaml
- Find first story with status "ready-for-dev" and highest priority
- If no story found: STOP and inform user
- Load the COMPLETE story file
```

### 2. Pre-Implementation Checklist

```markdown
Before writing ANY code:

[ ] Story file is fully loaded and understood
[ ] ALL acceptance criteria are clear
[ ] ALL subtasks have specific files listed
[ ] Dependencies (other stories) are done
[ ] project-context.md patterns are understood
```

### 3. Update Status

```yaml
# In sprint-status.yaml
- id: "{story_id}"
  status: "in_progress"  # Changed from ready-for-dev
```

### 4. Implementation Loop

For EACH subtask in the story, in ORDER:

```markdown
## Subtask: {TASK-ID}

### 1. Understand
- Read subtask description
- Identify files to modify/create
- Check existing patterns

### 2. Test First (if applicable)
- Write failing test for this subtask
- Verify test fails for the right reason

### 3. Implement
- Make the minimal change to pass test
- Follow project-context.md patterns
- Match existing code style

### 4. Verify
- Run the test - must pass
- Run ALL existing tests - must pass
- Check acceptance criteria coverage

### 5. Commit
git commit -m "{type}({scope}): {description} [{story_id}]"

Types: feat, fix, refactor, test, docs

### 6. Update Story
- Check the subtask checkbox in story file
- Add notes in Dev Notes section if needed
```

### 5. Acceptance Criteria Verification

After ALL subtasks complete:

```markdown
## AC Verification

For each acceptance criterion:

- [ ] AC-1: {criterion}
  - How verified: {manual test / automated test / inspection}
  - Result: PASS / FAIL

- [ ] AC-2: {criterion}
  - How verified: {method}
  - Result: PASS / FAIL

ALL must PASS before story is done.
```

### 6. Final Checks

```markdown
## Final Checklist

[ ] ALL subtasks completed and checked
[ ] ALL acceptance criteria verified PASS
[ ] ALL tests pass (new + existing)
[ ] Dev Notes updated in story file
[ ] No console.log or debug code left
[ ] Code follows project patterns
[ ] 🚨 PLACEHOLDER SCAN PASSED (zero results)
```

### 6.5. Quality Gate Validation (MANDATORY)

```markdown
## Development Quality Gate

BEFORE marking this story as done, validate:

### Placeholder Scan
[ ] Run: grep -rn "TODO\|FIXME" src/
[ ] Run: grep -rn "Not implemented" src/
[ ] Run: grep -rn "() => {}" src/
[ ] ALL scans return ZERO results

### Test Verification
[ ] All AC have at least one test
[ ] All tests PASS
[ ] All existing tests still PASS

### Code Review
[ ] Code review performed
[ ] At least 3 issues identified (not "looks good")
[ ] All BLOCKER issues resolved
[ ] All MAJOR issues resolved

### If ANY check fails:
🛑 DO NOT mark story as done
🛑 Return to appropriate sub-agent
🛑 Fix issues and re-validate
```

### 7. Complete Story

```yaml
# In sprint-status.yaml
- id: "{story_id}"
  status: "done"  # Changed from in_progress
```

Update story file frontmatter:
```yaml
status: done
completed: {YYYY-MM-DD}
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Implement ALL subtasks as specified
- Write tests as specified in story
- Make commits following conventional commits
- Update story status and checkboxes
- Refactor within story scope
- Update Dev Notes

### MUST CHECKPOINT:
- 🛑 **security_decision**: Any auth/security implementation
- 🛑 **security_decision**: Database schema changes
- 🛑 **scope_change**: Need to implement something NOT in story
- 🛑 When tests fail and fix requires changes outside story scope

---

## Commit Message Format

```
{type}({scope}): {description} [{story_id}]

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- test: Adding tests
- docs: Documentation

Examples:
- feat(auth): add login endpoint [STORY-001]
- fix(users): handle null email [STORY-002]
- test(api): add user creation tests [STORY-001]
```

---

## Output Format

### During Implementation
```markdown
## 🔄 Implementing: {story_id}

### Progress
- [x] TASK-B1: Created user model ✅
- [x] TASK-B2: Added API endpoint ✅
- [ ] TASK-F1: Create form component (in progress)
- [ ] TASK-T1: Write tests

### Current Status
Subtask 3/5 completed
```

### After Completion
```markdown
## ✅ Story Completed: {story_id}

| Information | Valeur |
|-------------|--------|
| **Story** | {title} |
| **Subtasks** | {completed}/{total} |
| **Commits** | {count} |
| **Tests** | {passed}/{total} |

### Acceptance Criteria
- [x] AC-1: {criterion} ✅
- [x] AC-2: {criterion} ✅
- [x] AC-3: {criterion} ✅

### Files Changed
- `src/models/user.ts` (created)
- `src/api/users.ts` (modified)
- `tests/users.test.ts` (created)

---

✅ Story marked as done in sprint-status.yaml
✅ Dev Notes updated in story file

**Prochaine story:** {next_story_id} ou "Sprint terminé"
```

---

## 🚨 ANTI-PLACEHOLDER RULES (CRITICAL)

```
🔴 ABSOLUTE RULE: ZERO PLACEHOLDERS ALLOWED

This is the MOST IMPORTANT rule in the entire system.
A story is NEVER "done" if it contains placeholder code.
```

### Forbidden Patterns - NEVER WRITE THESE:

```javascript
// ❌ FORBIDDEN - Placeholder comments
// TODO: implement this later
// FIXME: add actual implementation
// Will be done in STORY-XXX
// @todo: complete this

// ❌ FORBIDDEN - Fake implementations
function doSomething() {
  throw new Error("Not implemented");
}

async function fetchData() {
  throw new Error("Not yet implemented");
}

// ❌ FORBIDDEN - Empty handlers
onClick={() => {}}
onChange={() => { /* TODO */ }}

// ❌ FORBIDDEN - Stub returns
return null; // temporary
return []; // will populate later
return {}; // placeholder

// ❌ FORBIDDEN - Mock data in production code
const users = [{ id: 1, name: "Test" }]; // mock
const data = { foo: "bar" }; // temporary data
```

### Required Patterns - ALWAYS WRITE THESE:

```javascript
// ✅ CORRECT - Actual working implementation
async function getUsers() {
  const response = await api.get('/users');
  return response.data;
}

// ✅ CORRECT - Real error handling
try {
  await saveUser(data);
} catch (error) {
  logger.error('Failed to save user', { error, data });
  throw new UserSaveError(error.message);
}

// ✅ CORRECT - Complete implementation
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ✅ CORRECT - Real validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  return true;
}
```

### Placeholder Scan (MANDATORY before marking done)

```bash
# This scan MUST be run and return ZERO results

# Scan for TODO/FIXME
grep -rn "TODO\|FIXME\|@todo" src/

# Scan for "Not implemented"
grep -rn "Not implemented\|not yet implemented" src/

# Scan for empty functions
grep -rn "() => {}" src/
grep -rn "function.*{[\s]*}" src/

# Scan for stub throws
grep -rn "throw new Error.*implement" src/
```

### If Scan Finds Placeholders:

```
🛑 STOP - Story is NOT done

1. DO NOT mark story as done
2. DO NOT commit placeholder code
3. RETURN to Coder sub-agent
4. IMPLEMENT the actual functionality
5. RE-RUN placeholder scan
6. ONLY proceed when scan returns zero results
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER implement anything not in the story subtasks
⚠️ NEVER skip a subtask or do them out of order
⚠️ NEVER commit without running all tests
⚠️ NEVER mark story done if any AC fails
⚠️ NEVER leave debug code in production
⚠️ NEVER skip updating Dev Notes
🚨 NEVER write placeholder code (TODO, FIXME, not implemented)
🚨 NEVER use mock data in production code
🚨 NEVER leave empty function bodies
```

---

## When Blocked

If you encounter a blocker:

```markdown
🚫 BLOCKED: {story_id}

**Reason:** {description of blocker}
**Impact:** Cannot complete {subtask_id}
**Suggested action:** {what needs to happen}

Options:
1. Request story update from Planner
2. Request clarification from user
3. Mark as blocked in sprint-status.yaml
```

Update sprint-status.yaml:
```yaml
- id: "{story_id}"
  status: "blocked"
  blocked_by: "{reason}"
```
