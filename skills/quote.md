---
skill: quote
agent: architect
description: "Générer un devis formel basé sur l'estimation"
autonomy: high
checkpoint: quotation_approval
---

# Skill: Generate Quotation

## Purpose
Créer un devis professionnel et formel basé sur l'estimation, prêt à être envoyé au client.

## Trigger
- Après estimation (/estimate)
- Commande: `/quote`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md - STOP if Financial Summary is empty
- Load config.yaml for consultant info and rates
- Verify estimation exists
```

### 2. Quotation Assembly

Generate quotation using template:

```markdown
---
document_type: quotation
project: {project_name}
client: {client_name}
date: {date}
valid_until: {date + 30 days}
reference: DEV-{YYYY}-{NNN}
status: draft
---

# DEVIS

## Informations

| | |
|---|---|
| **Référence** | DEV-{YYYY}-{NNN} |
| **Date** | {date} |
| **Validité** | 30 jours |

### Émetteur
{consultant.name}
{consultant.company}
{consultant.email}

### Client
{client.company}
{client.contact}

---

## Objet

{project_name}

{executive_summary from project-context.md}

---

## Périmètre des prestations

### Inclus dans ce devis

{For each In Scope item from project-context.md:}
- ✅ {feature_description}

### Non inclus (hors périmètre)

{For each Out of Scope item:}
- ❌ {item}

---

## Détail de la prestation

| Poste | Description | Heures | Tarif | Montant |
|-------|-------------|--------|-------|---------|
| Discovery & Architecture | Analyse, conception | {h} | {rate} €/h | {amount} € |
| Développement | Implémentation des fonctionnalités | {h} | {rate} €/h | {amount} € |
| Tests | Tests unitaires et E2E | {h} | {rate} €/h | {amount} € |
| Documentation | Guides utilisateur et technique | {h} | {rate} €/h | {amount} € |
| **Provision pour imprévus** | Buffer {%} | {h} | - | {amount} € |

---

## Total

| | |
|---|---|
| **Total HT** | {total_ht} € |
| **TVA (20%)** | {tva} € |
| **Total TTC** | {total_ttc} € |

---

## Conditions

### Modalités de paiement
- 30% à la signature
- 40% à mi-parcours
- 30% à la livraison

### Délai de réalisation
{timeline from constraints}

### Hypothèses
{assumptions from estimation}

---

## Acceptation

En signant ce devis, le client accepte les conditions ci-dessus.

| | Émetteur | Client |
|---|---|---|
| Nom | {consultant.name} | |
| Date | | |
| Signature | | |

---

_Ce devis est valable 30 jours à compter de sa date d'émission._
```

### 3. Save Quotation

Save to: `{paths.output_dir}/quotations/devis-{reference}.md`

### 4. Checkpoint

```
🛑 CHECKPOINT: quotation_approval

Résumé: Devis généré pour {project_name}
Montant: {total_ttc} € TTC
Validité: 30 jours

[APPROUVER] → Marquer comme envoyé
[MODIFIER] → Ajuster le devis
[REJETER] → Annuler le devis
```

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Generate quotation document
- Calculate totals and TVA
- Apply payment terms
- Save draft quotation

### MUST CHECKPOINT:
- 🛑 **quotation_approval**: ALWAYS before marking as final
- 🛑 **quotation_approval**: Before any client communication

---

## Output Format

```markdown
## 📄 Devis Généré

| Information | Valeur |
|-------------|--------|
| **Référence** | DEV-{YYYY}-{NNN} |
| **Client** | {client_name} |
| **Montant TTC** | {amount} € |
| **Validité** | {valid_until} |

### Fichier
📁 `{output_dir}/quotations/devis-{reference}.md`

---

🛑 **CHECKPOINT: Approbation requise avant envoi**

Voulez-vous:
[APPROUVER] Marquer comme prêt à envoyer
[MODIFIER] Ajuster le devis
[REJETER] Annuler

```

---

## Anti-Patterns to Avoid

```
⚠️ NEVER generate a quote without estimation first
⚠️ NEVER skip the approval checkpoint
⚠️ NEVER send without client and consultant info complete
⚠️ NEVER forget TVA calculation
⚠️ NEVER omit payment terms
```
