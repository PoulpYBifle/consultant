# Technique Selector Module

Ce module fournit la logique de sélection contextuelle des techniques d'idéation pour les skills du consultant.

---

## Data Source

```
📁 _consultant/data/consultant-techniques.csv
```

---

## Context Analysis

Analyser le contexte actuel selon 4 dimensions :

### 1. Phase Analysis

| Phase | Catégories recommandées |
|-------|-------------------------|
| discovery | elicitation, analysis, opportunity |
| quotation | analysis, validation |
| specs | architecture, analysis |
| planning | decomposition, validation |
| development | validation (code-focused otherwise) |
| delivery | communication, validation |

### 2. Problem Type Detection

| Signal dans l'input utilisateur | Catégorie | Techniques suggérées |
|--------------------------------|-----------|----------------------|
| "je ne comprends pas", "c'est flou", "pas clair" | elicitation | 5 Whys, Scenario Walkthrough |
| "je ne sais pas pourquoi", "cause", "origine" | elicitation | 5 Whys, Root Cause |
| "utilisateur", "besoin réel", "vraiment besoin" | elicitation | Jobs-to-be-Done, Empathy Mapping |
| "estimer", "combien de temps", "effort" | analysis | Three-Point, Analogical, T-Shirt |
| "prioriser", "important", "urgent" | analysis | Feature Prioritization, MoSCoW |
| "découper", "trop gros", "splitter" | decomposition | Story Splitting, INVEST |
| "critères", "acceptation", "done" | decomposition | AC Workshop, Definition of Done |
| "architecture", "design", "structure" | architecture | C4, ADR, Data Flow |
| "opportunité", "améliorer", "automatiser" | opportunity | Gap Analysis, Quick Win |

### 3. Complexity Assessment

| Indicateur | Approche recommandée |
|------------|---------------------|
| Domaine simple/connu | Techniques rapides (5-15 min) |
| Complexité moyenne | Techniques standard (15-30 min) |
| Haute complexité/nouveau | Techniques approfondies (30+ min) |

### 4. User Energy / Communication Style

| Style détecté | Style de technique |
|---------------|-------------------|
| Formel/corporate | Frameworks structurés et prouvés |
| Casual/créatif | Techniques visuelles et collaboratives |
| Frustré/bloqué | Techniques de déblocage (5 Whys, Example Mapping) |

---

## Selection Algorithm

```
1. Identifier la phase actuelle depuis workflow-status.yaml
2. Détecter le type de problème depuis l'input utilisateur
3. Évaluer la complexité depuis project-context.md
4. Filtrer les techniques par: phase + skill + triggers
5. Scorer les techniques par pertinence contextuelle
6. Recommander 2-3 techniques avec justification
7. Laisser l'utilisateur choisir ou utiliser la recommandation
```

---

## Trigger Matching

Les triggers dans le CSV sont des mots-clés séparés par `|`.

**Exemple de matching:**
```
Input: "Je ne sais pas pourquoi le client veut cette feature"
Triggers matchés: unclear_cause, dont_know_why, why_this_feature
Techniques: 5 Whys (EL-01), Jobs-to-be-Done (EL-02)
```

---

## Output Formats

### Format de suggestion automatique (inline dans un skill)

```
💡 TECHNIQUE SUGGÉRÉE: {technique_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi: {rationale basé sur le contexte détecté}
Durée: ~{duration_min} minutes
Comment: {brief facilitation guide}

[A] Appliquer cette technique
[C] Continuer sans technique
```

### Format de recommandation détaillée (skill /techniques)

```
🎯 TECHNIQUE RECOMMANDÉE: {technique_name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Description:
{description}

✅ Idéal pour:
{best_for}

⏱️ Durée: ~{duration_min} minutes
📊 Complexité: {complexity}

📝 Comment l'appliquer:
{facilitation_steps}

---

[1] Utiliser cette technique
[2] Voir d'autres options ({count} disponibles)
[3] Continuer sans technique
```

---

## Facilitation Guides

### EL-01: 5 Whys
```
1. Énoncer le problème initial clairement
2. Demander "Pourquoi ?" → Noter la réponse
3. Sur cette réponse, demander "Pourquoi ?" → Noter
4. Répéter jusqu'à 5 fois ou jusqu'à la cause racine
5. Valider la cause racine identifiée
```

### EL-02: Jobs-to-be-Done
```
1. Demander: "Quand utilisez-vous/avez besoin de ceci ?"
2. Identifier le JOB FONCTIONNEL: "Qu'essayez-vous d'accomplir ?"
3. Identifier le JOB ÉMOTIONNEL: "Comment voulez-vous vous sentir ?"
4. Identifier le JOB SOCIAL: "Comment voulez-vous être perçu ?"
5. Synthétiser: "Vous voulez [job] pour [outcome]"
```

### EL-03: Empathy Mapping
```
1. Créer 4 quadrants: Dit | Pense | Fait | Ressent
2. SAYS: Quotes directes du client
3. THINKS: Ce qu'il pense (non dit)
4. DOES: Actions observables
5. FEELS: Émotions et frustrations
6. Synthétiser les insights
```

### DE-01: INVEST Criteria
```
Vérifier chaque critère:
- I (Independent): La story peut-elle être développée seule ?
- N (Negotiable): Le scope est-il ajustable ?
- V (Valuable): Apporte-t-elle de la valeur utilisateur ?
- E (Estimable): Peut-on l'estimer raisonnablement ?
- S (Small): Faisable en un sprint ?
- T (Testable): Peut-on la tester objectivement ?
```

### DE-02: Story Splitting
```
Patterns de découpage:
1. Par étape du workflow
2. Par rôle utilisateur
3. Par règle métier
4. Par variation de données
5. Par opération CRUD
6. Par plateforme/canal
7. Par happy path vs edge cases
```

### DE-04: Example Mapping
```
1. Story au centre
2. Pour chaque règle métier → carte jaune
3. Pour chaque règle → exemples concrets (cartes vertes)
4. Questions/doutes → cartes rouges
5. Si trop de rouges → story pas prête
```

### AN-01: Value Proposition Canvas
```
Côté Client:
1. Jobs: Que doit-il accomplir ?
2. Pains: Quelles frustrations ?
3. Gains: Quels bénéfices recherchés ?

Côté Produit:
4. Products: Que proposons-nous ?
5. Pain Relievers: Comment soulageons les pains ?
6. Gain Creators: Comment créons les gains ?
```

### AN-06: Analogical Estimation
```
1. Identifier un projet similaire passé
2. Lister les similarités et différences
3. Partir de l'effort réel du projet passé
4. Ajuster pour les différences (+/- %)
5. Appliquer un buffer pour l'incertitude
```

### AN-07: T-Shirt Sizing
```
Définir les tailles:
- XS: < 2h
- S: 2-4h
- M: 4-8h (1 jour)
- L: 8-16h (2 jours)
- XL: 16-40h (1 semaine)
- XXL: > 40h (à découper)
```

### AR-02: ADR (Architecture Decision Record)
```
1. Titre: [Décision courte]
2. Statut: Proposed | Accepted | Deprecated
3. Contexte: Pourquoi cette décision est nécessaire
4. Options considérées: A, B, C avec pros/cons
5. Décision: Option choisie
6. Conséquences: Impacts positifs et négatifs
```

---

## Integration Pattern

Chaque skill qui supporte les techniques DOIT inclure cette section:

```markdown
## Technique Support

### Techniques disponibles pour ce skill
{Chargées depuis consultant-techniques.csv où skill = {current_skill}}

### Détection automatique
Quand ces patterns sont détectés dans l'input utilisateur:
- {trigger_pattern} → Suggérer {technique}

### Exécution de technique
Quand une technique est sélectionnée:
1. Charger les détails depuis le CSV
2. Afficher le guide de facilitation
3. Guider l'utilisateur à travers les étapes
4. Capturer les outputs dans un format structuré
5. Intégrer les findings dans l'output du skill
```

---

## Menu A/C Pattern

Après détection d'un contexte approprié, proposer:

```
[A]dvanced - Utiliser une technique d'idéation pour approfondir
[C]ontinue - Continuer normalement sans technique

>>>
```

---

## Examples

### Example 1: Clarify with unclear requirement
```
Input: "Le client dit qu'il veut 'une meilleure gestion des utilisateurs'"

Détection: vague_requirement, unclear
Technique suggérée: EL-01 (5 Whys)

💡 TECHNIQUE SUGGÉRÉE: 5 Whys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi: Le besoin "meilleure gestion" est vague -
          creusons pour trouver le vrai problème.
Durée: ~10 minutes

[A] Appliquer  [C] Continuer
```

### Example 2: Create-story with large scope
```
Input: "Créer une story pour le système d'authentification complet"

Détection: large_story, needs_split
Technique suggérée: DE-02 (Story Splitting)

💡 TECHNIQUE SUGGÉRÉE: Story Splitting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi: Un système d'auth complet est trop gros
          pour une seule story - découpons-le.
Durée: ~20 minutes

[A] Appliquer  [C] Continuer
```

### Example 3: Estimate with uncertainty
```
Input: "Estimer l'effort pour l'intégration avec leur CRM"

Détection: uncertain_estimate, integration
Technique suggérée: AN-08 (Three-Point Estimation)

💡 TECHNIQUE SUGGÉRÉE: Three-Point Estimation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pourquoi: Les intégrations ont beaucoup d'inconnues -
          estimons optimiste/probable/pessimiste.
Durée: ~20 minutes

[A] Appliquer  [C] Continuer
```
