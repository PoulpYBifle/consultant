---
skill: docs
agent: delivery
description: "Générer la documentation utilisateur du projet"
autonomy: high
checkpoint: none
---

# Skill: Generate User Documentation

## Purpose
Créer une documentation utilisateur claire et complète, destinée aux utilisateurs finaux (non-techniques).

## Trigger
- Stories implémentées, prêtes pour documentation
- Commande: `/docs`

---

## Process

### 1. Context Loading
```
🚨 BEFORE ANY ACTION:
- Load project-context.md for project overview
- Load all completed story files for feature details
- Identify user roles from project context
- Check for existing documentation to update
```

### 2. Documentation Structure

Generate documentation with this structure:

```markdown
# {Project Name} - Guide Utilisateur

## Table des matières
1. Introduction
2. Prise en main
3. Fonctionnalités
4. FAQ
5. Dépannage

---

## 1. Introduction

### À propos de {Project Name}
{Brief description of what the application does and its value}

### Pour qui ?
{Description of target users}

### Prérequis
- {Prerequisite 1: browser, access, etc.}
- {Prerequisite 2}

---

## 2. Prise en main

### Accès à l'application
1. Ouvrez votre navigateur
2. Accédez à {URL}
3. {Login instructions if applicable}

### Première connexion
{Step-by-step guide for first-time users}

### Navigation
{Overview of main sections/menus}

[Screenshot placeholder: main navigation]

---

## 3. Fonctionnalités

### 3.1 {Feature 1 Name}

**Objectif:** {What this feature does}

**Comment l'utiliser:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

[Screenshot placeholder: feature in action]

**Conseils:**
- {Tip 1}
- {Tip 2}

**Erreurs courantes:**
- {Error}: {Solution}

---

### 3.2 {Feature 2 Name}
...

---

## 4. FAQ

### Questions fréquentes

**Q: {Common question 1}?**
A: {Answer}

**Q: {Common question 2}?**
A: {Answer}

---

## 5. Dépannage

### Problèmes courants

| Problème | Cause possible | Solution |
|----------|----------------|----------|
| {Problem 1} | {Cause} | {Solution} |
| {Problem 2} | {Cause} | {Solution} |

### Contact support
{Support contact information}

---

*Documentation générée le {date}*
*Version: {version}*
```

### 3. Feature Documentation

For each completed story, create feature documentation:

```markdown
### {Feature Name}

**Description:**
{What the user can do with this feature}

**Accès:**
{Where to find this feature in the UI}

**Étapes:**
1. {Action step with screenshot reference}
2. {Action step}
3. {Expected result}

**Exemple:**
{Concrete example of using the feature}

**Points d'attention:**
- {Important consideration}
- {Limitation if any}
```

### 4. Save Documentation

Save to: `{paths.output_dir}/delivery/guide-utilisateur.md`

---

## Autonomy Rules

### CAN DO AUTONOMOUSLY:
- Generate all documentation sections
- Extract features from stories
- Write user-friendly instructions
- Create FAQ and troubleshooting

### NO CHECKPOINT REQUIRED:
- Documentation is informational
- Can be reviewed before delivery

---

## Output Format

```markdown
## 📚 Documentation Générée

### Documents créés
| Document | Description | Emplacement |
|----------|-------------|-------------|
| Guide utilisateur | Documentation complète | `output/delivery/guide-utilisateur.md` |

### Contenu
- Introduction et prise en main
- {count} fonctionnalités documentées
- FAQ ({count} questions)
- Guide de dépannage

### Fonctionnalités couvertes
- [x] {Feature 1}
- [x] {Feature 2}
- [x] {Feature 3}

---

📁 Fichier: `{output_dir}/delivery/guide-utilisateur.md`

**Prochaine étape:** Préparer le package de livraison → `/handoff`
```

---

## Writing Guidelines

```markdown
## Documentation Best Practices

✅ DO:
- Write for the end-user, not developers
- Use simple, non-technical language
- Include concrete examples
- Use numbered steps for processes
- Add "Conseils" sections for best practices
- Include troubleshooting for common issues

❌ DON'T:
- Use technical jargon without explanation
- Assume prior knowledge
- Skip steps that seem "obvious"
- Write walls of text without structure
- Forget to mention limitations
```

---

## Screenshot Placeholders

Include placeholders for screenshots:

```markdown
[Screenshot: {description}]
Ajouter capture d'écran montrant {what_to_show}
```

These can be filled in during final review.

---

## Anti-Patterns to Avoid

```
⚠️ NEVER use developer terminology with end-users
⚠️ NEVER skip the "why" - explain the purpose
⚠️ NEVER forget error handling documentation
⚠️ NEVER assume users know where things are
⚠️ NEVER write documentation without reading completed stories
```
