---
document_type: handoff_checklist
project: "{project_name}"
date: "{date}"
status: in_progress
completion: 0%
---

# Checklist de Livraison

## {project_name}

---

## Vue d'ensemble

| Information | Valeur |
|-------------|--------|
| **Projet** | {project_name} |
| **Client** | {client_name} |
| **Date prévue** | {delivery_date} |
| **Consultant** | {consultant.name} |

---

## 1. Code & Application

### 1.1 Développement
- [ ] Toutes les stories sont en statut "done"
- [ ] Toutes les fonctionnalités sont implémentées selon les specs
- [ ] Pas de TODO ou FIXME critiques dans le code
- [ ] Code review effectuée sur tous les PRs

### 1.2 Qualité du code
- [ ] Tous les tests unitaires passent
- [ ] Tous les tests d'intégration passent
- [ ] Tous les tests E2E passent (si applicable)
- [ ] Coverage minimum atteint ({threshold}%)
- [ ] Pas de console.log ou code de debug
- [ ] Linting sans erreurs

### 1.3 Déploiement
- [ ] Application déployée en staging
- [ ] Tests de recette effectués en staging
- [ ] Application déployée en production
- [ ] Smoke tests passés en production

---

## 2. Documentation

### 2.1 Documentation utilisateur
- [ ] Guide utilisateur complet
- [ ] Screenshots à jour
- [ ] FAQ documentée
- [ ] Guide de dépannage

### 2.2 Documentation administrateur
- [ ] Guide de configuration
- [ ] Gestion des utilisateurs documentée
- [ ] Procédures de maintenance

### 2.3 Documentation technique
- [ ] Architecture documentée
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Schéma de base de données
- [ ] Variables d'environnement documentées

### 2.4 Runbook opérationnel
- [ ] Procédure de déploiement
- [ ] Procédure de backup/restore
- [ ] Procédure de rollback
- [ ] Contacts d'urgence
- [ ] Monitoring et alertes documentés

---

## 3. Accès & Credentials

### 3.1 Comptes utilisateurs
- [ ] Compte admin créé pour le client
- [ ] Comptes utilisateurs test créés (si demandé)
- [ ] Droits et rôles correctement configurés

### 3.2 Accès infrastructure
- [ ] Accès à l'environnement de production
- [ ] Accès à l'environnement de staging
- [ ] Accès aux logs (si applicable)
- [ ] Accès au monitoring (si applicable)

### 3.3 Credentials
- [ ] Credentials documentés de manière sécurisée
- [ ] Credentials transmis via canal sécurisé
- [ ] Credentials de développement ≠ production

### 3.4 Services tiers
- [ ] Accès aux services tiers transférés
- [ ] Documentation des comptes externes

---

## 4. Infrastructure

### 4.1 Hébergement
- [ ] Hébergement configuré et stable
- [ ] Ressources dimensionnées correctement
- [ ] Auto-scaling configuré (si applicable)

### 4.2 Sécurité
- [ ] HTTPS configuré avec certificat valide
- [ ] Headers de sécurité configurés
- [ ] Rate limiting en place
- [ ] WAF configuré (si applicable)

### 4.3 Backup & Recovery
- [ ] Backups automatiques configurés
- [ ] Backup testé avec restore réussi
- [ ] Politique de rétention définie
- [ ] Procédure de disaster recovery documentée

### 4.4 Monitoring
- [ ] Monitoring de disponibilité en place
- [ ] Alertes configurées
- [ ] Logs centralisés
- [ ] APM configuré (si applicable)

---

## 5. Formation

### 5.1 Préparation
- [ ] Session de formation planifiée
- [ ] Participants identifiés
- [ ] Agenda de formation préparé
- [ ] Matériaux de formation créés

### 5.2 Contenu
- [ ] Présentation des fonctionnalités principales
- [ ] Démonstration des workflows clés
- [ ] Session Q&A prévue
- [ ] Enregistrement prévu (si demandé)

### 5.3 Post-formation
- [ ] Support de formation partagé
- [ ] Enregistrement partagé (si applicable)
- [ ] Questions post-formation traitées

---

## 6. Support & Garantie

### 6.1 Période de garantie
- [ ] Durée de garantie définie: {duration}
- [ ] Couverture de garantie documentée
- [ ] Process de signalement des bugs communiqué

### 6.2 Support
- [ ] Canal de support défini
- [ ] Horaires de support communiqués
- [ ] SLA défini (si applicable)
- [ ] Escalation path documenté

### 6.3 Maintenance
- [ ] Contrat de maintenance discuté
- [ ] Conditions de maintenance documentées

---

## 7. Administratif

### 7.1 Contractuel
- [ ] PV de recette préparé
- [ ] PV de recette signé
- [ ] Transfert de propriété (si applicable)

### 7.2 Facturation
- [ ] Facture finale préparée
- [ ] Facture envoyée
- [ ] Paiement reçu

### 7.3 Clôture
- [ ] Retour d'expérience planifié
- [ ] Témoignage client demandé (si approprié)
- [ ] Projet archivé

---

## Résumé de progression

| Catégorie | Complété | Total | % |
|-----------|----------|-------|---|
| Code & Application | 0 | 12 | 0% |
| Documentation | 0 | 14 | 0% |
| Accès & Credentials | 0 | 10 | 0% |
| Infrastructure | 0 | 12 | 0% |
| Formation | 0 | 9 | 0% |
| Support & Garantie | 0 | 7 | 0% |
| Administratif | 0 | 7 | 0% |
| **TOTAL** | **0** | **71** | **0%** |

---

## Notes

{Notes additionnelles sur la livraison}

---

## Signatures

### Recette

| | Client | Consultant |
|---|---|---|
| **Nom** | | {consultant.name} |
| **Date** | | |
| **Signature** | | |

### Commentaires client

{Espace pour les commentaires du client lors de la recette}

---

*Checklist générée le {date}*
*Dernière mise à jour: {last_updated}*
