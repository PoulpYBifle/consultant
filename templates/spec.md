---
document_type: technical_specification
project: "{project_name}"
version: "1.0"
date: "{date}"
author: "{consultant.name}"
status: draft
---

# Spécification Technique

## {project_name}

---

## 1. Vue d'ensemble

### 1.1 Objectif du système

{Description de ce que fait le système et pourquoi}

### 1.2 Utilisateurs cibles

| Rôle | Description | Nombre estimé |
|------|-------------|---------------|
| {role_1} | {description} | {count} |
| {role_2} | {description} | {count} |

### 1.3 Contraintes

| Type | Contrainte |
|------|------------|
| Budget | {budget} |
| Délai | {timeline} |
| Technique | {technical_constraints} |
| Réglementaire | {regulatory_constraints} |

---

## 2. Architecture

### 2.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                      (Navigateur)                            │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    ({frontend_tech})                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ API REST/GraphQL
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│                     ({backend_tech})                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│                      ({db_tech})                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Stack technique

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| Frontend | {tech} | {version} | {rationale} |
| Backend | {tech} | {version} | {rationale} |
| Database | {tech} | {version} | {rationale} |
| Cache | {tech} | {version} | {rationale} |
| Hosting | {tech} | - | {rationale} |

### 2.3 Intégrations externes

| Système | Type | Protocole | Description |
|---------|------|-----------|-------------|
| {system_1} | API | REST | {description} |
| {system_2} | Webhook | HTTPS | {description} |

---

## 3. Modèle de données

### 3.1 Diagramme entités-relations

```
┌──────────────────┐          ┌──────────────────┐
│      User        │          │     Project      │
├──────────────────┤          ├──────────────────┤
│ id: UUID [PK]    │───┐      │ id: UUID [PK]    │
│ email: String    │   │      │ name: String     │
│ password: Hash   │   └─────▶│ owner_id: UUID   │
│ role: Enum       │          │ status: Enum     │
│ created_at: Date │          │ created_at: Date │
└──────────────────┘          └──────────────────┘
                                       │
                                       │
                                       ▼
                              ┌──────────────────┐
                              │      Task        │
                              ├──────────────────┤
                              │ id: UUID [PK]    │
                              │ project_id: UUID │
                              │ title: String    │
                              │ status: Enum     │
                              └──────────────────┘
```

### 3.2 Détail des entités

#### User
| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| id | UUID | PK | Identifiant unique |
| email | String(255) | UNIQUE, NOT NULL | Email de connexion |
| password | String(255) | NOT NULL | Hash du mot de passe |
| role | Enum | NOT NULL | admin, user, viewer |
| created_at | Timestamp | NOT NULL | Date de création |

#### {Entity_2}
| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| ... | ... | ... | ... |

---

## 4. Fonctionnalités

### 4.1 {Feature 1}

#### Description
{Ce que fait cette fonctionnalité}

#### Flux utilisateur
1. L'utilisateur {action_1}
2. Le système {reaction_1}
3. L'utilisateur voit {result}

#### Règles métier
- {rule_1}
- {rule_2}

#### API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /api/v1/{resource} | Liste les {resources} | Required |
| POST | /api/v1/{resource} | Crée un {resource} | Required |
| GET | /api/v1/{resource}/:id | Détail d'un {resource} | Required |
| PUT | /api/v1/{resource}/:id | Modifie un {resource} | Required |
| DELETE | /api/v1/{resource}/:id | Supprime un {resource} | Required |

#### Payloads

**Request - POST /api/v1/{resource}**
```json
{
  "field_1": "string",
  "field_2": 123,
  "field_3": true
}
```

**Response - 201 Created**
```json
{
  "id": "uuid",
  "field_1": "string",
  "field_2": 123,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 4.2 {Feature 2}
...

---

## 5. Sécurité

### 5.1 Authentification

| Aspect | Choix | Détails |
|--------|-------|---------|
| Méthode | JWT | Tokens signés HS256 |
| Expiration | 24h | Refresh token: 7j |
| Stockage | HttpOnly Cookie | Protection XSS |

### 5.2 Autorisation

| Rôle | Permissions |
|------|-------------|
| Admin | Toutes les opérations |
| User | CRUD sur ses propres ressources |
| Viewer | Lecture seule |

### 5.3 Protection des données

- [ ] Chiffrement at rest: {AES-256}
- [ ] Chiffrement in transit: HTTPS TLS 1.3
- [ ] Conformité RGPD: {measures}
- [ ] Logs d'audit: {what's logged}

---

## 6. Performance

### 6.1 Objectifs

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Temps de réponse API (p95) | < 200ms | APM |
| Temps de chargement page | < 2s | Lighthouse |
| Uptime | 99.9% | Monitoring |
| Utilisateurs simultanés | {count} | Load test |

### 6.2 Stratégies d'optimisation

- **Caching:** {strategy}
- **Pagination:** Cursor-based, 20 items/page
- **Indexation:** {key_indexes}
- **CDN:** {if_applicable}

---

## 7. Déploiement

### 7.1 Environnements

| Environnement | URL | Usage | Branch |
|---------------|-----|-------|--------|
| Development | localhost:3000 | Dev local | feature/* |
| Staging | staging.{domain} | Tests/QA | develop |
| Production | {domain} | Production | main |

### 7.2 CI/CD

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Push   │───▶│  Build  │───▶│  Test   │───▶│ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

- **Build:** {tool}
- **Test:** {test_runner}
- **Deploy:** {deployment_method}

---

## 8. Décisions d'architecture

| # | Décision | Options | Choix | Rationale |
|---|----------|---------|-------|-----------|
| ADR-001 | {decision} | A, B, C | B | {why} |
| ADR-002 | {decision} | X, Y | X | {why} |

---

## 9. Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| {risk_1} | Moyen | Élevé | {mitigation} |
| {risk_2} | Faible | Moyen | {mitigation} |

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| {term} | {definition} |

### B. Références

- {reference_1}
- {reference_2}

---

*Document généré le {date}*
*Version {version}*
