---
name: "specs-gate"
phase: "specs"
description: "Quality Gate pour la phase Specs - validation avant passage à Planning"
---

```xml
<quality-gate name="Specs Gate" phase="specs" next_phase="planning">

<purpose>
    Valider que les spécifications techniques sont complètes et de qualité
    avant de créer les stories. AUCUN passage en Planning sans validation.
</purpose>

<checklist>
    <!-- DÉCISIONS TECHNIQUES -->
    <section name="Technical Decisions">
        <item id="SG-01" required="true">
            Toutes les décisions techniques ont un ADR
            <verification>
                - Lister toutes les décisions dans spec.md
                - Chaque décision a: contexte, options, choix, rationale
                - Au moins 3 options considérées par décision majeure
            </verification>
        </item>

        <item id="SG-02" required="true">
            Trade-offs explicites pour chaque décision
            <verification>
                - Chaque ADR a une section "Trade-offs"
                - Pros ET cons documentés pour l'option choisie
            </verification>
        </item>

        <item id="SG-03" required="true">
            Stack technique validé
            <verification>
                - Technologies choisies listées
                - Raison du choix documentée
                - Versions spécifiées
            </verification>
        </item>
    </section>

    <!-- SPÉCIFICATIONS COMPLÈTES -->
    <section name="Spec Completeness">
        <item id="SG-04" required="true">
            Spec couvre 100% des requirements
            <verification>
                - Matrice de traçabilité requirements → spec sections
                - Aucun requirement sans section correspondante
            </verification>
        </item>

        <item id="SG-05" required="true">
            Tous les cas d'erreur spécifiés
            <verification>
                - Chaque endpoint/fonction a une section "Errors"
                - Codes d'erreur et messages définis
                - Actions utilisateur suggérées
            </verification>
        </item>

        <item id="SG-06" required="true">
            Edge cases couverts
            <verification>
                - Section "Edge Cases" pour chaque feature
                - Comportement défini pour limites (empty, null, max)
            </verification>
        </item>

        <item id="SG-07" required="true">
            Aucune ambiguïté dans la spec
            <verification>
                - Pas de "should", "might", "could", "etc."
                - Tous les termes sont définis
                - Comportements sont déterministes
            </verification>
        </item>
    </section>

    <!-- DATA MODEL -->
    <section name="Data Specifications">
        <item id="SG-08" required="true">
            Modèle de données complet
            <verification>
                - Tous les modèles définis avec types
                - Relations documentées
                - Contraintes spécifiées (unique, not null, etc.)
            </verification>
        </item>

        <item id="SG-09" required="true">
            Migrations planifiées (brownfield)
            <verification>
                - Si brownfield, plan de migration documenté
                - Impact sur données existantes évalué
            </verification>
        </item>
    </section>

    <!-- REVIEW ADVERSARIAL -->
    <section name="Adversarial Review">
        <item id="SG-10" required="true">
            Review adversarial effectuée
            <verification>
                - Review Rapport exists
                - Au moins 3 issues identifiés
                - "Looks good" n'a JAMAIS été la conclusion initiale
            </verification>
        </item>

        <item id="SG-11" required="true">
            Tous les issues CRITICAL et MAJOR résolus
            <verification>
                - Lister les issues du rapport de review
                - Vérifier que CRITICAL et MAJOR ont des fixes appliqués
                - Re-review si nécessaire
            </verification>
        </item>
    </section>

    <!-- VALIDATION UTILISATEUR -->
    <section name="User Validation">
        <item id="SG-12" required="true">
            Architecture validée par l'utilisateur
            <verification>
                - Checkpoint architecture_sign_off passé
                - Utilisateur a confirmé compréhension
            </verification>
        </item>
    </section>
</checklist>

<validation-process>
    <step n="1">
        CHARGER spec.md et tous les ADR
    </step>
    <step n="2">
        EXÉCUTER le sous-agent Reviewer pour review adversarial
        SI pas encore fait
    </step>
    <step n="3">
        Pour CHAQUE item required="true":
        - Exécuter la vérification
        - Marquer PASS ou FAIL
        - Si FAIL, documenter ce qui manque
    </step>
    <step n="4">
        SI issues CRITICAL ou MAJOR non résolus:
        - RETOURNER au sous-agent Spec Writer avec feedback
        - RE-EXÉCUTER Reviewer après corrections
    </step>
    <step n="5">
        CALCULER le score final
    </step>
</validation-process>

<output-format>
    ## 🚦 Specs Quality Gate

    ### Technical Decisions
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | SG-01 | ADR pour toutes décisions | ✅/❌ | {notes} |
    | SG-02 | Trade-offs explicites | ✅/❌ | {notes} |
    | SG-03 | Stack validé | ✅/❌ | {notes} |

    ### Spec Completeness
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | SG-04 | 100% requirements couverts | ✅/❌ | {notes} |
    | SG-05 | Cas d'erreur spécifiés | ✅/❌ | {notes} |
    | SG-06 | Edge cases couverts | ✅/❌ | {notes} |
    | SG-07 | Aucune ambiguïté | ✅/❌ | {notes} |

    ### Data Specifications
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | SG-08 | Modèle données complet | ✅/❌ | {notes} |
    | SG-09 | Migrations planifiées | ✅/❌/N/A | {notes} |

    ### Adversarial Review
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | SG-10 | Review effectuée (3+ issues) | ✅/❌ | {issues count} |
    | SG-11 | CRITICAL/MAJOR résolus | ✅/❌ | {open count} |

    ### User Validation
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | SG-12 | Architecture sign-off | ✅/❌ | {date if passed} |

    ### Score
    **Required items**: {X}/{Y} passed

    ### Verdict
    🟢 **GATE PASSED** - Ready for Planning phase
    ou
    🔴 **GATE BLOCKED** - Fix required items

    ### Review Issues Status
    | Severity | Found | Resolved | Open |
    |----------|-------|----------|------|
    | CRITICAL | {N} | {N} | {N} |
    | MAJOR | {N} | {N} | {N} |
    | MINOR | {N} | {N} | {N} |
</output-format>

<block-until>
    - Tous les items required="true" sont ✅
    - Tous les CRITICAL issues résolus
    - Tous les MAJOR issues résolus
    - architecture_sign_off checkpoint passé
</block-until>

</quality-gate>
```
