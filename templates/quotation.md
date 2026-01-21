---
document_type: quotation
project: "{project_name}"
client: "{client_name}"
date: "{date}"
valid_until: "{date + 30 days}"
reference: "DEV-{YYYY}-{NNN}"
status: draft
---

# DEVIS

---

## Informations

| | |
|---|---|
| **Référence** | DEV-{YYYY}-{NNN} |
| **Date** | {date} |
| **Validité** | 30 jours |

---

### Émetteur

**{consultant.company}**
{consultant.name}
{consultant.email}

### Client

**{client.company}**
{client.contact}
{client.email}

---

## Objet

**{project_name}**

{executive_summary}

---

## Périmètre des prestations

### Inclus dans ce devis

- ✅ {feature_1}
- ✅ {feature_2}
- ✅ {feature_3}
- ✅ {feature_4}

### Non inclus (hors périmètre)

- ❌ {out_of_scope_1}
- ❌ {out_of_scope_2}

---

## Détail de la prestation

| Poste | Description | Heures | Tarif | Montant |
|-------|-------------|--------|-------|---------|
| Discovery & Architecture | Analyse des besoins, conception technique | {h} | {rate} €/h | {amount} € |
| Développement | Implémentation des fonctionnalités | {h} | {rate} €/h | {amount} € |
| Tests | Tests unitaires, intégration, E2E | {h} | {rate} €/h | {amount} € |
| Documentation | Guides utilisateur et technique | {h} | {rate} €/h | {amount} € |
| **Provision pour imprévus** | Buffer {percentage}% | {h} | - | {amount} € |

---

## Total

| | Montant |
|---|---|
| **Total HT** | {total_ht} € |
| **TVA (20%)** | {tva} € |
| **Total TTC** | **{total_ttc} €** |

---

## Conditions

### Modalités de paiement

| Étape | Pourcentage | Montant | Échéance |
|-------|-------------|---------|----------|
| Signature | 30% | {amount} € | À la commande |
| Mi-parcours | 40% | {amount} € | {milestone} |
| Livraison | 30% | {amount} € | À la recette |

### Délai de réalisation

- **Début estimé:** {start_date}
- **Livraison prévue:** {end_date}
- **Durée totale:** {duration}

### Hypothèses et prérequis

Ce devis est établi sur la base des hypothèses suivantes:
- {assumption_1}
- {assumption_2}
- {assumption_3}

### Conditions générales

1. Ce devis est valable 30 jours à compter de sa date d'émission
2. Tout dépassement du périmètre fera l'objet d'un avenant
3. Les délais sont donnés à titre indicatif et dépendent de la réactivité du client
4. La garantie de {warranty_months} mois couvre les bugs sur les fonctionnalités livrées

---

## Acceptation

En signant ce devis, le client:
- Accepte le périmètre défini ci-dessus
- Accepte les conditions de paiement
- Confirme la disponibilité des interlocuteurs nécessaires

| | Émetteur | Client |
|---|---|---|
| **Nom** | {consultant.name} | |
| **Fonction** | Consultant | |
| **Date** | {date} | |
| **Signature** | | |
| **Mention "Bon pour accord"** | | |

---

*Merci pour votre confiance.*

*{consultant.company}*
