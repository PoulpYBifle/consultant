---
skill: spec
agent: architect
description: "Créer la spécification technique du projet"
autonomy: high
checkpoint: architecture_sign_off
---

# Skill: Create Technical Specification

## Purpose
Créer une spécification technique complète qui servira de référence pour le Planner et le Developer.

## Trigger
- Après devis accepté
- Besoin de documenter l'architecture
- Commande: `/spec`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md - STOP if scope not defined
- Review requirements in detail
- Identify technical decisions to make
```

### 2. Technical Specification Structure

Create spec document with these sections:

```markdown
---
document_type: technical_specification
project: {project_name}
version: 1.0
date: {date}
author: {consultant.name}
status: draft
---

# Spécification Technique: {project_name}

## 1. Vue d'ensemble

### 1.1 Objectif
{Brief description of what the system does}

### 1.2 Utilisateurs
| Rôle | Description | Nombre |
|------|-------------|--------|
| {role} | {description} | {count} |

### 1.3 Contraintes
- Budget: {budget}
- Délai: {timeline}
- Technique: {constraints}

---

## 2. Architecture

### 2.1 Vue globale
```
[Diagram ASCII ou description]

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Backend   │────▶│  Database   │
│  (Browser)  │     │   (API)     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.2 Stack technique
| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| Frontend | {tech} | {version} | {why} |
| Backend | {tech} | {version} | {why} |
| Database | {tech} | {version} | {why} |
| Hosting | {tech} | - | {why} |

### 2.3 Intégrations externes
| Système | Type | Description |
|---------|------|-------------|
| {system} | API/Webhook/File | {description} |

---

## 3. Modèle de données

### 3.1 Entités principales
```
[Entity Relationship Diagram ASCII]

┌──────────────┐       ┌──────────────┐
│    User      │       │   Project    │
├──────────────┤       ├──────────────┤
│ id           │───┐   │ id           │
│ email        │   └──▶│ owner_id     │
│ name         │       │ name         │
│ role         │       │ status       │
└──────────────┘       └──────────────┘
```

### 3.2 Détail des entités
| Entité | Attribut | Type | Contraintes |
|--------|----------|------|-------------|
| User | id | UUID | PK |
| User | email | String | Unique, Required |
| ... | ... | ... | ... |

---

## 4. Fonctionnalités détaillées

### 4.1 {Feature 1}

**Description:** {what it does}

**Flux utilisateur:**
1. User does X
2. System responds Y
3. User sees Z

**Règles métier:**
- Rule 1
- Rule 2

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resource | List resources |
| POST | /api/v1/resource | Create resource |

### 4.2 {Feature 2}
...

---

## 5. Sécurité

### 5.1 Authentification
- Méthode: {JWT/Session/OAuth}
- Expiration: {duration}

### 5.2 Autorisation
| Rôle | Permissions |
|------|-------------|
| Admin | Full access |
| User | Read own data |

### 5.3 Protection des données
- Chiffrement at rest: {yes/no}
- Chiffrement in transit: HTTPS
- RGPD: {compliance measures}

---

## 6. Performance

### 6.1 Objectifs
| Métrique | Cible |
|----------|-------|
| Temps de réponse API | < 200ms |
| Temps de chargement page | < 2s |
| Utilisateurs simultanés | {count} |

### 6.2 Stratégies
- Caching: {strategy}
- Pagination: {approach}
- Indexation DB: {key indexes}

---

## 7. Déploiement

### 7.1 Environnements
| Env | URL | Usage |
|-----|-----|-------|
| Dev | localhost | Development |
| Staging | staging.{domain} | Testing |
| Prod | {domain} | Production |

### 7.2 CI/CD
- Build: {tool}
- Test: {approach}
- Deploy: {method}

---

## 8. Décisions d'architecture

| # | Décision | Options considérées | Choix | Rationale |
|---|----------|---------------------|-------|-----------|
| 1 | {decision} | A, B, C | B | {why} |

---

## 9. Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| {risk} | H/M/L | H/M/L | {mitigation} |

```

### 3. Update Project Context

Update project-context.md > Technical Context with:
- Target Architecture
- Key Technical Decisions

### 4. Checkpoint

```
🛑 CHECKPOINT: architecture_sign_off

Architecture proposée:
- Stack: {stack_summary}
- Décisions clés: {key_decisions}

[APPROUVER] → Valider l'architecture
[MODIFIER] → Revoir certains choix
[REJETER] → Reprendre l'analyse
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Propose technical architecture
- Document all specification sections
- Make technology recommendations
- Identify risks and mitigations
- Create diagrams

### MUST CHECKPOINT:
- 🛑 **architecture_sign_off**: Before finalizing spec
- 🛑 **security_decision**: For sensitive data handling
- 🛑 **scope_change**: If spec reveals missing requirements

---

## Output Format

```markdown
## 📋 Spécification Technique Créée

| Information | Valeur |
|-------------|--------|
| **Projet** | {project_name} |
| **Version** | 1.0 |
| **Status** | Draft |

### Stack proposée
| Couche | Technologie |
|--------|-------------|
| Frontend | {tech} |
| Backend | {tech} |
| Database | {tech} |

### Fichier
📁 `{output_dir}/specs/spec-{project_name}.md`

---

🛑 **CHECKPOINT: Validation architecture requise**

[APPROUVER] [MODIFIER] [REJETER]
```

---

## Technique Support

### Techniques disponibles pour ce skill

| ID | Technique | Durée | Quand l'utiliser |
|----|-----------|-------|------------------|
| AR-01 | C4 Model Simplified | 30m | Documentation architecture visuelle |
| AR-02 | ADR (Architecture Decision Record) | 15m | Décision importante à documenter |
| AR-03 | API Contract First | 25m | Développement API-centric |
| AR-04 | Data Flow Diagram | 20m | Application data-heavy |
| AR-05 | Security Threat Modeling | 40m | Application sensible (auth, data) |
| AN-05 | Risk Assessment Matrix | 25m | Identifier les risques techniques |
| AN-10 | Dependency Mapping | 20m | Intégrations complexes |

### Auto-Detection

```
DETECT and SUGGEST techniques based on context:

IF architecture_decision needed:
   → 💡 Suggérer AR-02 (ADR)
   "Décision architecturale importante. Documentons-la avec un ADR ?"

IF api_centric project:
   → 💡 Suggérer AR-03 (API Contract First)
   "Projet centré API. Définissons les contrats d'abord ?"

IF data_heavy or many_entities:
   → 💡 Suggérer AR-04 (Data Flow Diagram)
   "Beaucoup de données. Créons un diagramme de flux ?"

IF security_sensitive or auth_required:
   → 💡 Suggérer AR-05 (Security Threat Modeling)
   "Application sensible. Modélisons les menaces de sécurité ?"

IF complex_architecture:
   → 💡 Suggérer AR-01 (C4 Model)
   "Architecture complexe. Utilisons le modèle C4 pour documenter ?"

IF many_integrations:
   → 💡 Suggérer AN-10 (Dependency Mapping)
   "Plusieurs intégrations. Mappons les dépendances ?"
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
4. Intégrer dans la spécification technique

### ADR Quick Template

```markdown
# ADR-{NNN}: {Titre de la décision}

## Statut
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Contexte
{Pourquoi cette décision est nécessaire}

## Options considérées
1. **Option A**: {description}
   - ✅ Avantages: ...
   - ❌ Inconvénients: ...

2. **Option B**: {description}
   - ✅ Avantages: ...
   - ❌ Inconvénients: ...

## Décision
Nous choisissons l'**Option {X}** car {raison principale}.

## Conséquences
- ✅ Positif: {impact positif}
- ⚠️ Attention: {impact à surveiller}
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER skip the architecture checkpoint
⚠️ NEVER propose tech without justification
⚠️ NEVER ignore security in the spec
⚠️ NEVER forget to document key decisions
⚠️ NEVER leave integration points undefined
```
