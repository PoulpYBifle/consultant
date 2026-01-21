---
name: "delivery-gate"
phase: "delivery"
description: "Quality Gate pour la phase Delivery - validation finale avant livraison au client"
---

```xml
<quality-gate name="Delivery Gate" phase="delivery" scope="project">

<purpose>
    Valider que le package de livraison est COMPLET et prêt pour le client.
    Dernière ligne de défense avant la livraison finale.
</purpose>

<checklist>
    <!-- DÉVELOPPEMENT TERMINÉ -->
    <section name="Development Complete">
        <item id="DL-01" required="true" blocking="true">
            Toutes les stories sont "done" dans sprint-status.yaml
            <verification>
                - Charger sprint-status.yaml
                - Vérifier status: "done" pour chaque story du sprint
                - Aucune story "in_progress" ou "blocked"
            </verification>
        </item>

        <item id="DL-02" required="true" blocking="true">
            Tous les tests passent (full suite)
            <verification>
                - Exécuter la suite complète de tests
                - 0 failures
                - 0 tests skipped sans justification
            </verification>
        </item>

        <item id="DL-03" required="true">
            Pas de bugs critiques ouverts
            <verification>
                - Vérifier le bug tracker (si existant)
                - 0 bugs severity "critical"
                - 0 bugs severity "high" (ou documentés en known issues)
            </verification>
        </item>
    </section>

    <!-- DOCUMENTATION COMPLÈTE -->
    <section name="Documentation Complete">
        <item id="DL-04" required="true">
            Documentation utilisateur existe
            <verification>
                - Getting started guide ✓
                - Feature documentation ✓
                - FAQ ✓ (min 10 questions)
                - Troubleshooting guide ✓
            </verification>
        </item>

        <item id="DL-05" required="true">
            Documentation admin existe
            <verification>
                - Configuration guide ✓
                - User management ✓
                - Permissions setup ✓
                - Backup procedures ✓
            </verification>
        </item>

        <item id="DL-06" required="true">
            Documentation technique existe
            <verification>
                - Architecture overview ✓
                - API documentation ✓ (si API)
                - Database schema ✓
                - Deployment guide ✓
            </verification>
        </item>

        <item id="DL-07" required="true">
            Documentation validée (accuracy)
            <verification>
                - Sous-agent Validator a vérifié
                - Toutes les procédures testées
                - Screenshots correspondent à l'UI actuelle
            </verification>
        </item>
    </section>

    <!-- RUNBOOK -->
    <section name="Runbook Complete">
        <item id="DL-08" required="true">
            Procédures de déploiement documentées
            <verification>
                - Step-by-step deployment ✓
                - Rollback procedure ✓
                - Environment configuration ✓
            </verification>
        </item>

        <item id="DL-09" required="true">
            Backup/restore documenté ET testé
            <verification>
                - Procédure backup documentée ✓
                - Procédure restore documentée ✓
                - 🚨 Restore TESTÉ (pas juste documenté)
            </verification>
        </item>

        <item id="DL-10" required="true">
            Monitoring et alertes documentés
            <verification>
                - Quoi monitorer ✓
                - Où voir les logs ✓
                - Comment réagir aux alertes ✓
            </verification>
        </item>
    </section>

    <!-- TRAINING -->
    <section name="Training Materials">
        <item id="DL-11" required="true">
            Matériaux de training préparés
            <verification>
                - Agenda de formation ✓
                - Key workflows documentés ✓
                - Exercices pratiques ✓
            </verification>
        </item>
    </section>

    <!-- HANDOFF -->
    <section name="Handoff Ready">
        <item id="DL-12" required="true">
            Checklist de livraison 100% complète
            <verification>
                - Toutes les items de handoff-checklist cochées
                - Aucun item "pending"
            </verification>
        </item>

        <item id="DL-13" required="true">
            Known issues documentés
            <verification>
                - Liste des issues connus
                - Workarounds documentés pour chacun
            </verification>
        </item>

        <item id="DL-14" required="true">
            Recommendations post-livraison
            <verification>
                - Améliorations futures suggérées
                - Maintenance recommendations
            </verification>
        </item>

        <item id="DL-15" required="true">
            Accès transférés/confirmés
            <verification>
                - Client a accès au code source (si applicable)
                - Client a les credentials nécessaires
                - Client sait comment accéder au support
            </verification>
        </item>
    </section>

    <!-- VALIDATION FINALE -->
    <section name="Final Validation">
        <item id="DL-16" required="true">
            Package de livraison complet
            <verification>
                - DELIVERY-MANIFEST.md existe
                - Tous les fichiers listés sont présents
                - Package peut être utilisé de manière autonome
            </verification>
        </item>

        <item id="DL-17" required="true">
            Validation finale effectuée
            <verification>
                - Sous-agent Validator a run
                - Tous les BLOCKERS résolus
                - Verdict: APPROVED FOR DELIVERY
            </verification>
        </item>
    </section>
</checklist>

<validation-process>
    <step n="1" name="Development Check">
        - Vérifier sprint-status.yaml
        - Exécuter tests full suite
        - Vérifier bug tracker
    </step>

    <step n="2" name="Documentation Check">
        - Inventorier tous les documents
        - Vérifier existence de chaque document requis
        - Demander au Validator de vérifier accuracy
    </step>

    <step n="3" name="Runbook Check">
        - Vérifier procédures deployment
        - 🚨 TESTER la procédure restore
        - Vérifier monitoring
    </step>

    <step n="4" name="Package Assembly">
        - Demander au Packager d'assembler
        - Vérifier DELIVERY-MANIFEST
        - Vérifier tous les fichiers présents
    </step>

    <step n="5" name="Final Validation">
        - Demander au Validator de valider le package complet
        - Résoudre tout BLOCKER identifié
    </step>

    <step n="6" name="User Approval">
        - Demander le checkpoint final_delivery
        - Attendre confirmation utilisateur
    </step>
</validation-process>

<output-format>
    ## 🚦 Delivery Quality Gate

    ### Development Status
    | Check | Status |
    |-------|--------|
    | All stories done | ✅/❌ ({X}/{Y} done) |
    | All tests pass | ✅/❌ ({X} passed) |
    | No critical bugs | ✅/❌ |

    ### Documentation Status
    | Document Type | Exists | Validated |
    |---------------|--------|-----------|
    | User docs | ✅/❌ | ✅/❌ |
    | Admin docs | ✅/❌ | ✅/❌ |
    | Technical docs | ✅/❌ | ✅/❌ |

    ### Runbook Status
    | Procedure | Documented | Tested |
    |-----------|------------|--------|
    | Deployment | ✅/❌ | ✅/❌ |
    | Backup | ✅/❌ | ✅/❌ |
    | Restore | ✅/❌ | ✅/❌ (🚨 MUST TEST) |
    | Monitoring | ✅/❌ | ✅/❌ |

    ### Handoff Status
    | Item | Status |
    |------|--------|
    | Checklist 100% | ✅/❌ ({X}%) |
    | Known issues documented | ✅/❌ |
    | Recommendations | ✅/❌ |
    | Access transferred | ✅/❌ |

    ### Package Status
    | Check | Status |
    |-------|--------|
    | Manifest complete | ✅/❌ |
    | All files present | ✅/❌ |
    | Validator approved | ✅/❌ |

    ### Quality Gate Results
    | ID | Critère | Status |
    |----|---------|--------|
    | DL-01 | All stories done | ✅/❌ |
    | DL-02 | All tests pass | ✅/❌ |
    | ... | ... | ... |
    | DL-17 | Validation finale | ✅/❌ |

    ### Verdict
    🟢 **READY FOR DELIVERY** - final_delivery checkpoint can proceed
    ou
    🔴 **NOT READY** - Fix blocking issues

    ### If Not Ready - Required Actions
    | Issue | Priority | Action |
    |-------|----------|--------|
    | {issue} | BLOCKER | {fix} |

    ### Delivery Approval
    ⏳ Awaiting final_delivery checkpoint from user
    ou
    ✅ final_delivery checkpoint PASSED on {date}
</output-format>

<block-until>
    - DL-01: All stories done ✅
    - DL-02: All tests pass ✅
    - Tous les items required ✅
    - final_delivery checkpoint passed
</block-until>

<celebration>
    When gate passes and delivery complete:

    🎉 **PROJET LIVRÉ AVEC SUCCÈS!** 🎉

    Résumé du projet:
    - Stories complétées: {X}
    - Tests: {Y} passing
    - Documentation: {Z} pages
    - Durée: {dates}

    Merci d'avoir utilisé le système _consultant!
</celebration>

</quality-gate>
```
