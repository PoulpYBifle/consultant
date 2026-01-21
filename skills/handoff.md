---
skill: handoff
agent: delivery
description: "Préparer le package complet de livraison avec checklist"
autonomy: high
checkpoint: final_delivery
---

# Skill: Prepare Handoff Package

## Purpose
Préparer un package de livraison complet incluant tous les documents, guides et vérifications nécessaires pour une transition réussie au client.

## Trigger
- Toutes les stories done
- Documentation prête
- Commande: `/handoff`

---

## Process

### 1. Pre-Handoff Verification
```
🚨 BEFORE ANY ACTION:
- Load sprint-status.yaml - verify ALL stories are "done"
- Load project-context.md for project info
- Verify documentation exists
- If stories not all done: WARN and list remaining
```

### 2. Handoff Checklist

Complete this checklist:

```markdown
# Checklist de Livraison: {project_name}

## 1. Code & Application
- [ ] Toutes les stories implémentées et testées
- [ ] Tous les tests passent (unit, integration, e2e)
- [ ] Code déployé en environnement de staging/prod
- [ ] Pas de console.log ou code debug
- [ ] Variables d'environnement documentées

## 2. Documentation
- [ ] Guide utilisateur complet
- [ ] Guide administrateur (si applicable)
- [ ] Documentation technique / API
- [ ] Runbook opérationnel
- [ ] FAQ

## 3. Accès & Credentials
- [ ] Accès admin créés pour le client
- [ ] Credentials documentés de manière sécurisée
- [ ] Accès aux environnements (staging, prod)
- [ ] Accès au repository (si applicable)
- [ ] Accès aux services tiers (si applicable)

## 4. Infrastructure
- [ ] Backups configurés et testés
- [ ] Monitoring en place
- [ ] Alertes configurées
- [ ] SSL/Certificats valides
- [ ] Domaine configuré

## 5. Formation
- [ ] Session de formation planifiée
- [ ] Matériaux de formation préparés
- [ ] Enregistrement de la formation (si applicable)

## 6. Support
- [ ] Période de support définie
- [ ] Canal de support communiqué
- [ ] Escalation path documenté
- [ ] SLA défini (si applicable)

## 7. Administratif
- [ ] PV de recette préparé
- [ ] Facture finale préparée
- [ ] Garantie/maintenance définie
```

### 3. Handoff Package Assembly

Create the delivery package:

```markdown
# Package de Livraison: {project_name}

## Informations générales
| Information | Valeur |
|-------------|--------|
| Projet | {project_name} |
| Client | {client_name} |
| Date de livraison | {date} |
| Version | {version} |
| Consultant | {consultant.name} |

---

## Contenu du package

### 1. Documentation
| Document | Description | Emplacement |
|----------|-------------|-------------|
| Guide utilisateur | Documentation end-user | `/docs/guide-utilisateur.md` |
| Guide admin | Documentation administrateur | `/docs/guide-admin.md` |
| Documentation technique | API, architecture | `/docs/technique.md` |
| Runbook | Procédures opérationnelles | `/docs/runbook.md` |

### 2. Accès
| Service | URL | Notes |
|---------|-----|-------|
| Application (Prod) | {url} | Accès via credentials fournis |
| Application (Staging) | {url} | Pour tests |
| Repository | {url} | Si accès accordé |

### 3. Credentials
📁 Fichier sécurisé: `credentials-{project}.enc`
(Transmis séparément de manière sécurisée)

### 4. Contacts

**Support technique:**
- Email: {support_email}
- Téléphone: {support_phone}
- Horaires: {support_hours}

**Escalation:**
- {escalation_contact}

---

## Prochaines étapes

1. **Session de formation**
   - Date: {date}
   - Durée: {duration}
   - Participants: {list}

2. **Période de garantie**
   - Début: {start_date}
   - Fin: {end_date}
   - Couverture: {what's_covered}

3. **Recette**
   - PV de recette à signer
   - Date limite: {deadline}

---

## Acceptation

En signant ce document, le client confirme avoir reçu:
- [ ] L'application fonctionnelle
- [ ] Toute la documentation
- [ ] Les accès nécessaires
- [ ] La formation prévue

| | Client | Consultant |
|---|---|---|
| Nom | | {consultant.name} |
| Date | | {date} |
| Signature | | |
```

### 4. Save Package

Save to: `{paths.output_dir}/delivery/handoff-package-{date}.md`

### 5. Checkpoint

```
🛑 CHECKPOINT: final_delivery

Package de livraison préparé pour: {project_name}

Contenu:
- Checklist: {completed}/{total} items
- Documentation: {count} documents
- Accès: Configurés

[APPROUVER] → Marquer comme livré
[MODIFIER] → Compléter les éléments manquants
[REJETER] → Revenir à la préparation
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Verify all stories are done
- Compile documentation
- Create handoff package
- Generate checklist status

### MUST CHECKPOINT:
- 🛑 **final_delivery**: ALWAYS before delivering to client
- 🛑 **final_delivery**: Before any client communication

---

## Output Format

```markdown
## 📦 Package de Livraison Préparé

### Statut de la checklist
| Catégorie | Complété | Total |
|-----------|----------|-------|
| Code & Application | {x} | {y} |
| Documentation | {x} | {y} |
| Accès & Credentials | {x} | {y} |
| Infrastructure | {x} | {y} |
| Formation | {x} | {y} |
| Support | {x} | {y} |
| Administratif | {x} | {y} |
| **TOTAL** | **{x}** | **{y}** |

### Progression: {percentage}%

### Items manquants (si applicable)
- [ ] {missing_item_1}
- [ ] {missing_item_2}

### Fichiers générés
📁 `{output_dir}/delivery/handoff-package-{date}.md`
📁 `{output_dir}/delivery/checklist-{date}.md`

---

🛑 **CHECKPOINT: Approbation requise avant livraison**

[APPROUVER] [MODIFIER] [REJETER]
```

---

## Post-Delivery Actions

After approval:

```markdown
1. Send package to client
2. Schedule training session
3. Update project-context.md:
   - phase: "delivered"
   - status: "delivered"
4. Archive project files
5. Send final invoice (if applicable)
```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER deliver without completing checklist
⚠️ NEVER skip the final_delivery checkpoint
⚠️ NEVER send credentials in plain text
⚠️ NEVER forget to schedule training
⚠️ NEVER deliver without testing in production environment
```
