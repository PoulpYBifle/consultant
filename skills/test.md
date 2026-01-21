---
skill: test
agent: developer
description: "Générer les tests pour une story selon la section 'Expected Tests'"
autonomy: very_high
checkpoint: none
---

# Skill: Generate Tests

## Purpose
Générer les tests définis dans la section "Expected Tests" d'une story, avant ou pendant l'implémentation.

## Trigger
- Avant d'implémenter une story (TDD)
- Après implémentation pour compléter les tests
- Commande: `/test`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load the story file (ask which one if not specified)
- Extract "Expected Tests" section
- Load project-context.md for test patterns
- Identify test framework used
```

### 2. Test Framework Detection

```markdown
Detect from project:
- JavaScript/TypeScript: Jest, Vitest, Mocha
- Python: pytest, unittest
- Go: testing package
- etc.

Check for existing test files to match patterns.
```

### 3. Test Generation Loop

For EACH test in "Expected Tests":

```markdown
## Test: {test_description}

### 1. Identify Test Type
- Unit test: Single function/component
- Integration test: Multiple components
- E2E test: Full user flow

### 2. Create Test File
Location: Match project convention
Naming: {module}.test.{ext} or {module}_test.{ext}

### 3. Write Test

Follow AAA pattern:
- Arrange: Set up test data and conditions
- Act: Execute the code being tested
- Assert: Verify the expected outcome
```

### 4. Test Templates

#### Unit Test (Jest/Vitest)
```typescript
describe('{ModuleName}', () => {
  describe('{functionName}', () => {
    it('should {expected_behavior}', () => {
      // Arrange
      const input = {testData};

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toEqual({expected});
    });

    it('should handle {edge_case}', () => {
      // Arrange
      const input = {edgeCaseData};

      // Act & Assert
      expect(() => functionName(input)).toThrow({ExpectedError});
    });
  });
});
```

#### Integration Test (API)
```typescript
describe('API: {endpoint}', () => {
  it('should return {status} for valid request', async () => {
    // Arrange
    const payload = {validData};

    // Act
    const response = await request(app)
      .post('/api/v1/resource')
      .send(payload);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({expected});
  });

  it('should return {error_code} for {invalid_case}', async () => {
    // Arrange
    const payload = {invalidData};

    // Act
    const response = await request(app)
      .post('/api/v1/resource')
      .send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('{error_message}');
  });
});
```

#### Component Test (React)
```typescript
describe('{ComponentName}', () => {
  it('should render {expected_state}', () => {
    // Arrange
    const props = {testProps};

    // Act
    render(<ComponentName {...props} />);

    // Assert
    expect(screen.getByText('{expected_text}')).toBeInTheDocument();
  });

  it('should call {handler} when {action}', async () => {
    // Arrange
    const mockHandler = jest.fn();
    render(<ComponentName onAction={mockHandler} />);

    // Act
    await userEvent.click(screen.getByRole('button'));

    // Assert
    expect(mockHandler).toHaveBeenCalledWith({expected_args});
  });
});
```

### 5. Run Tests

```bash
# Run new tests
npm test -- --testPathPattern="{test_file}"

# Verify all tests pass
npm test
```

### 6. Update Story

Check test items in story file:

```markdown
## Expected Tests

### Unit Tests
- [x] `{function_name}` should {expected_behavior}
- [x] `{function_name}` should handle {edge_case}

### Integration Tests
- [x] API endpoint returns {expected_response} for valid input
- [x] API endpoint returns {error_code} for {invalid_input}
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Generate all tests from story specification
- Match project test patterns
- Run tests and verify they pass/fail appropriately
- Update story checkboxes

### NO CHECKPOINT REQUIRED:
- Tests are defined in story, just implementing them

---

## Output Format

```markdown
## 🧪 Tests Generated for: {story_id}

### Tests Created
| Type | Description | File | Status |
|------|-------------|------|--------|
| Unit | {desc} | `tests/user.test.ts` | ✅ Created |
| Unit | {desc} | `tests/user.test.ts` | ✅ Created |
| Integration | {desc} | `tests/api.test.ts` | ✅ Created |

### Test Results
```
PASS tests/user.test.ts
  UserService
    ✓ should create user with valid data (5ms)
    ✓ should reject invalid email (2ms)

PASS tests/api.test.ts
  API: /users
    ✓ should return 200 for valid request (15ms)
    ✓ should return 400 for missing fields (8ms)

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
```

---

✅ Story test checkboxes updated
```

---

## TDD Workflow

If using Test-Driven Development:

```markdown
## TDD Cycle

1. **RED**: Write failing test
   - Test describes expected behavior
   - Run test → should FAIL

2. **GREEN**: Write minimal code
   - Just enough to pass the test
   - Run test → should PASS

3. **REFACTOR**: Clean up
   - Improve code quality
   - Run test → should still PASS

Repeat for each acceptance criterion.
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER write tests that always pass (no assertions)
⚠️ NEVER test implementation details, test behavior
⚠️ NEVER skip edge case tests
⚠️ NEVER leave flaky tests
⚠️ NEVER test multiple things in one test
```
