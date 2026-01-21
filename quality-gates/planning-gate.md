---
name: "planning-gate"
phase: "planning"
description: "Quality Gate pour la phase Planning - validation avant passage à Development"
---

```xml
<quality-gate name="Planning Gate" phase="planning" next_phase="development">

<purpose>
    Valider que les stories sont complètes et le sprint bien planifié
    avant de commencer le développement. Stories incomplètes = développement bloqué.
</purpose>

<checklist>
    <!-- STORIES COMPLÈTES -->
    <section name="Story Completeness">
        <item id="PG-01" required="true">
            Chaque story a des AC testables
            <verification>
                Pour chaque story dans le sprint:
                - Format Given/When/Then respecté
                - AC sont mesurables
                - AC ont une méthode de vérification
            </verification>
        </item>

        <item id="PG-02" required="true">
            Chaque story a des subtasks avec fichiers
            <verification>
                Pour chaque story:
                - Subtasks existent
                - Chaque subtask liste les fichiers à modifier/créer
                - Action (create/modify/delete) spécifiée
            </verification>
        </item>

        <item id="PG-03" required="true">
            Chaque story a des tests attendus
            <verification>
                Pour chaque story:
                - Section "Expected Tests" existe
                - Tests couvrent tous les AC
                - Types de tests spécifiés (unit/integration/e2e)
            </verification>
        </item>

        <item id="PG-04" required="true">
            Chaque story a des notes d'intégration
            <verification>
                Pour chaque story:
                - Section "Integration Notes" existe
                - Patterns existants à suivre référencés
                - Impact sur code existant documenté
            </verification>
        </item>

        <item id="PG-05" required="true">
            Aucune ambiguïté dans les stories
            <verification>
                - Pas de "should", "might", "could", "simple"
                - Développeur peut implémenter sans poser de questions
            </verification>
        </item>
    </section>

    <!-- ESTIMATIONS VALIDES -->
    <section name="Valid Estimates">
        <item id="PG-06" required="true">
            Estimations breakdown en subtasks
            <verification>
                - Chaque story a une estimation totale
                - Chaque subtask a une estimation
                - Somme subtasks ≈ estimation totale
            </verification>
        </item>

        <item id="PG-07" required="true">
            Aucune tâche > 4 heures
            <verification>
                - Parcourir toutes les subtasks
                - Aucune ne dépasse 4h
                - Si > 4h, doit être découpée
            </verification>
        </item>
    </section>

    <!-- DÉPENDANCES -->
    <section name="Dependencies Managed">
        <item id="PG-08" required="true">
            Dépendances entre stories identifiées
            <verification>
                - Champ "depends_on" rempli si applicable
                - Pas de dépendances circulaires
                - Stories dépendantes ordonnées correctement
            </verification>
        </item>

        <item id="PG-09" required="true">
            Chemin critique identifié
            <verification>
                - Sprint plan montre le chemin critique
                - Stories sur chemin critique marquées
            </verification>
        </item>
    </section>

    <!-- CAPACITÉ SPRINT -->
    <section name="Sprint Capacity">
        <item id="PG-10" required="true">
            Sprint capacity respectée
            <verification>
                - Capacité calculée: équipe × jours × heures × facteur focus
                - Total stories ≤ 80% capacité (20% buffer)
            </verification>
        </item>

        <item id="PG-11" required="true">
            Buffer préservé (minimum 20%)
            <verification>
                - Calculer: (capacité - total stories) / capacité
                - Résultat ≥ 20%
            </verification>
        </item>
    </section>

    <!-- SPRINT STATUS -->
    <section name="Sprint Tracking">
        <item id="PG-12" required="true">
            sprint-status.yaml à jour
            <verification>
                - Fichier existe
                - Toutes les stories du sprint listées
                - Statuts corrects (ready-for-dev)
            </verification>
        </item>
    </section>
</checklist>

<validation-process>
    <step n="1">
        CHARGER tous les fichiers story du sprint
    </step>
    <step n="2">
        CHARGER sprint-status.yaml
    </step>
    <step n="3">
        Pour CHAQUE story:
        - Vérifier AC format et testabilité
        - Vérifier subtasks et fichiers
        - Vérifier expected tests
        - Vérifier estimations
    </step>
    <step n="4">
        VÉRIFIER dépendances et chemin critique
    </step>
    <step n="5">
        CALCULER capacité et buffer
    </step>
    <step n="6">
        SI story incomplète:
        - RETOURNER au sous-agent Story Maker
        - RÉPÉTER jusqu'à validation
    </step>
</validation-process>

<output-format>
    ## 🚦 Planning Quality Gate

    ### Story Completeness
    | Story | AC Testable | Subtasks+Files | Tests | Integration | Clarity |
    |-------|-------------|----------------|-------|-------------|---------|
    | STORY-001 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
    | STORY-002 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

    ### Estimation Check
    | Story | Total Est. | Subtask Sum | Max Task | Valid |
    |-------|------------|-------------|----------|-------|
    | STORY-001 | 8h | 8h | 2h | ✅ |
    | STORY-002 | 6h | 6h | 5h | ❌ (task > 4h) |

    ### Dependencies
    ```
    STORY-001 ──► STORY-003
    STORY-002 ──► STORY-003
    STORY-003 ──► STORY-004 (Critical Path)
    ```

    ### Capacity Analysis
    | Metric | Value |
    |--------|-------|
    | Team Capacity | {X}h |
    | Total Committed | {Y}h |
    | Buffer | {Z}h ({%}%) |
    | Buffer Valid (≥20%) | ✅/❌ |

    ### Gate Results
    | ID | Critère | Status |
    |----|---------|--------|
    | PG-01 | AC testables | ✅/❌ |
    | PG-02 | Subtasks + fichiers | ✅/❌ |
    | PG-03 | Tests attendus | ✅/❌ |
    | PG-04 | Notes intégration | ✅/❌ |
    | PG-05 | Pas d'ambiguïté | ✅/❌ |
    | PG-06 | Estimations breakdown | ✅/❌ |
    | PG-07 | Tasks ≤ 4h | ✅/❌ |
    | PG-08 | Dépendances identifiées | ✅/❌ |
    | PG-09 | Chemin critique | ✅/❌ |
    | PG-10 | Capacité respectée | ✅/❌ |
    | PG-11 | Buffer ≥ 20% | ✅/❌ |
    | PG-12 | sprint-status.yaml | ✅/❌ |

    ### Score
    **Required items**: {X}/{Y} passed

    ### Verdict
    🟢 **GATE PASSED** - Ready for Development phase
    ou
    🔴 **GATE BLOCKED** - Fix stories before development

    ### Incomplete Stories (if blocked)
    | Story | Issue | Action |
    |-------|-------|--------|
    | STORY-XXX | {issue} | {fix needed} |
</output-format>

<block-until>
    - Tous les items required="true" sont ✅
    - Toutes les stories sont complètes
    - Buffer sprint ≥ 20%
</block-until>

</quality-gate>
```
