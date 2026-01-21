---
skill: analyze-codebase
agent: architect
description: "Analyser un codebase existant pour comprendre l'architecture"
autonomy: high
checkpoint: none
condition: "project_type == brownfield"
---

# Skill: Analyze Existing Codebase

## Purpose
Analyze an existing codebase to understand its architecture, technologies, patterns, and structure before planning any new work. This is a MANDATORY first step for brownfield projects.

## Trigger
- Automatically suggested after /init for brownfield projects
- User says "analyser le code", "comprendre l'existant", "architecture actuelle"
- Command: `/analyze-codebase`

## Prerequisites
- workflow-status.yaml must have project.type = "brownfield"
- For greenfield projects, this skill is skipped

## Process

### Step 1: Announce Analysis
```
Léo (avec l'expertise de Victor, Architecte):

🔍 Analyse du code existant en cours...

Je vais examiner :
1. La structure du projet
2. Les technologies et frameworks
3. Les patterns d'architecture
4. Les points d'intégration existants
5. La dette technique potentielle
```

### Step 2: Scan Project Structure
Perform deep scan of the codebase:

```
ANALYZE:
├── Directory structure
│   └── Identify: src/, app/, lib/, components/, pages/, api/, etc.
├── Configuration files
│   └── package.json, tsconfig.json, .env.example, docker-compose.yml, etc.
├── Entry points
│   └── Main files, index files, routing
├── Test structure
│   └── __tests__/, *.test.*, *.spec.*
└── Documentation
    └── README.md, docs/, ARCHITECTURE.md
```

### Step 3: Identify Technologies

**Detect and categorize:**

| Category | What to Detect |
|----------|---------------|
| **Language** | TypeScript, JavaScript, Python, Go, Rust, etc. |
| **Frontend** | React, Vue, Angular, Next.js, Nuxt, Svelte |
| **Backend** | Express, Fastify, NestJS, Django, FastAPI |
| **Database** | PostgreSQL, MySQL, MongoDB, Prisma, TypeORM |
| **Auth** | NextAuth, Auth0, Firebase Auth, custom JWT |
| **State** | Redux, Zustand, Recoil, Context API |
| **Styling** | Tailwind, CSS Modules, Styled Components |
| **Testing** | Jest, Vitest, Playwright, Cypress |
| **Infrastructure** | Docker, Kubernetes, Vercel, AWS |

### Step 4: Map Architecture

**Identify patterns:**
- Monolith vs Microservices
- MVC, Clean Architecture, Hexagonal
- API structure (REST, GraphQL, tRPC)
- Component organization (atomic, feature-based)
- Data flow patterns

**Identify key components:**
```
📁 Key Components Found:
├── 🔐 Authentication: {location and type}
├── 📊 Database Layer: {ORM/queries location}
├── 🔌 API Routes: {structure}
├── 🎨 UI Components: {count and organization}
├── 🔧 Utilities: {shared code location}
└── ⚙️ Configuration: {env handling}
```

### Step 5: Identify Integration Points

```
🔗 Integration Points:
├── External APIs: {list found integrations}
├── Third-party services: {payment, email, etc.}
├── Internal services: {if microservices}
└── Environment dependencies: {required env vars}
```

### Step 6: Assess Technical Debt

**Flag potential issues:**
- Outdated dependencies
- Inconsistent patterns
- Missing tests
- Security concerns
- Performance bottlenecks
- Code duplication

```
⚠️ Technical Debt Identified:
├── 🔴 Critical: {issues requiring immediate attention}
├── 🟡 Moderate: {issues to address during development}
└── 🟢 Minor: {nice-to-fix when touching related code}
```

### Step 7: Update project-context.md

Add findings to the Technical Context section:

```markdown
## Technical Context

### Existing Architecture

**Project Type**: Brownfield
**Analysis Date**: {current_date}

#### Technology Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Language | {detected} | {version} |
| Frontend | {detected} | {version} |
| Backend | {detected} | {version} |
| Database | {detected} | {version} |
| ... | ... | ... |

#### Architecture Pattern
{Identified pattern with brief description}

#### Key Components
- **Authentication**: {description and location}
- **Data Layer**: {description and location}
- **API**: {description and location}
- **UI**: {description and location}

#### Integration Points
- {External service 1}: {purpose}
- {External service 2}: {purpose}
- ...

#### Existing Conventions
- File naming: {pattern}
- Component structure: {pattern}
- API naming: {pattern}
- Testing approach: {pattern}

### Technical Debt & Constraints

#### Critical Issues
- {Issue 1}
- {Issue 2}

#### Moderate Issues
- {Issue 1}
- {Issue 2}

#### Conventions to Follow
When adding new code, ALWAYS:
- {Convention 1}
- {Convention 2}
- ...
```

### Step 8: Display Summary & Recommendations

```
Léo: "✅ Analyse du code terminée !

      📊 RÉSUMÉ
      ─────────────────────────────────────────────
      Technologies principales :
      • {Technology 1}
      • {Technology 2}
      • {Technology 3}

      Architecture : {pattern}

      Composants identifiés : {count}

      ⚠️ Points d'attention :
      • {Key issue 1}
      • {Key issue 2}

      ─────────────────────────────────────────────

      J'ai mis à jour project-context.md avec toutes
      ces informations. Elles guideront la création
      des stories pour s'intégrer proprement.

      ┌─────────────────────────────────────────────┐
      │  Prochaine étape : CADRAGE RAPIDE          │
      │                                             │
      │  Maintenant que je connais le code, on peut │
      │  passer à la découverte des besoins.        │
      └─────────────────────────────────────────────┘

      [1] ▶ Commencer le cadrage (/frame)
      [2] 📋 Voir les détails de l'analyse
      [3] 💬 Poser des questions sur le code"
```

### Step 9: Update workflow-status.yaml

```yaml
workflow_status:
  analyze-codebase: "completed"

project:
  phase: "discovery"
  last_activity: "{current_timestamp}"

next_action:
  workflow: "frame"
  agent: "discovery"
  reason: "Analyse terminée, cadrage des besoins"

history:
  - workflow: "analyze-codebase"
    completed: "{timestamp}"
    agent: "architect"
    output: "project-context.md > Technical Context"
```

## Output
- Updated `project-context.md` with Technical Context section
- Complete technology inventory
- Architecture patterns documented
- Technical debt identified
- Integration points mapped
- Conventions documented for future development

## Autonomy Rules
- **CAN** autonomously: Scan all code, identify patterns, update project-context.md
- **MUST CHECKPOINT**: None for this skill
- **ALWAYS**: Document findings in project-context.md before proceeding

## Error Handling
- If no code found after all: Switch project to greenfield, confirm with user
- If cannot access certain directories: Report and continue with accessible parts
- If ambiguous architecture: Present findings and ask user for clarification

## Integration with Stories
The information gathered here is CRITICAL for the Planner agent. When creating stories:
- Reference `Technical Context > Existing Conventions`
- Respect patterns in `Architecture Pattern`
- Address issues from `Technical Debt` where relevant
- Follow integration patterns from `Integration Points`
