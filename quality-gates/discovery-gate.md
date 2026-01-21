---
name: "discovery-gate"
phase: "discovery"
description: "Quality Gate pour la phase Discovery - validation avant passage à Quotation"
---

```xml
<quality-gate name="Discovery Gate" phase="discovery" next_phase="quotation">

<purpose>
    Valider que la phase Discovery est complète avant de passer à Quotation.
    AUCUN passage en Quotation tant que ce gate n'est pas validé à 100%.
</purpose>

<checklist>
    <!-- BESOINS DOCUMENTÉS -->
    <section name="Needs Documentation">
        <item id="DG-01" required="true">
            Tous les besoins ont un "pourquoi" documenté (5 Whys)
            <verification>
                - Ouvrir project-context.md
                - Pour chaque besoin listé, vérifier qu'il y a une chaîne "Why"
                - Au moins 3 niveaux de "pourquoi" pour les besoins majeurs
            </verification>
        </item>

        <item id="DG-02" required="true">
            Au moins 3 scénarios concrets par feature majeure
            <verification>
                - Compter les scénarios dans project-context.md
                - Chaque scénario doit avoir: contexte, action, résultat attendu
            </verification>
        </item>

        <item id="DG-03" required="true">
            Besoins cachés (hidden needs) identifiés
            <verification>
                - Section "Hidden Needs" existe dans project-context.md
                - Au moins 2 besoins non exprimés initialement documentés
            </verification>
        </item>
    </section>

    <!-- CLARIFICATION COMPLÈTE -->
    <section name="Clarification Complete">
        <item id="DG-04" required="true">
            Aucun terme ambigu non résolu
            <verification>
                - Chercher les mots: "should", "maybe", "probably", "simple", "easy"
                - Tous ces termes doivent être remplacés par des définitions concrètes
            </verification>
        </item>

        <item id="DG-05" required="true">
            Tous les termes métier définis dans un glossaire
            <verification>
                - Section "Glossary" existe
                - Termes spécifiques au domaine client sont définis
            </verification>
        </item>

        <item id="DG-06" required="true">
            Cas limites documentés pour chaque feature
            <verification>
                - Chaque feature majeure a une section "Edge Cases"
                - Au moins 2 edge cases par feature
            </verification>
        </item>
    </section>

    <!-- CADRAGE VALIDÉ -->
    <section name="Frame Validated">
        <item id="DG-07" required="true">
            Jobs-to-be-Done clairement articulé
            <verification>
                - Section "Jobs-to-be-Done" existe
                - Job principal identifié avec verbe d'action
                - Jobs fonctionnels, émotionnels, sociaux documentés
            </verification>
        </item>

        <item id="DG-08" required="true">
            Scope IN/OUT explicitement défini
            <verification>
                - Section "Scope" avec "In Scope" et "Out of Scope"
                - Chaque exclusion a une raison documentée
            </verification>
        </item>

        <item id="DG-09" required="true">
            Métriques de succès définies
            <verification>
                - Au moins 3 métriques de succès
                - Chaque métrique est mesurable (nombre, pourcentage, délai)
            </verification>
        </item>

        <item id="DG-10" required="true">
            Contraintes identifiées
            <verification>
                - Budget connu ou estimé
                - Délais connus
                - Contraintes techniques documentées
            </verification>
        </item>
    </section>

    <!-- PROJECT-CONTEXT À JOUR -->
    <section name="Project Context Updated">
        <item id="DG-11" required="true">
            project-context.md complètement à jour
            <verification>
                - Fichier existe et n'est pas vide
                - Sections Business Context, Requirements, Scope remplies
                - Date de dernière mise à jour récente
            </verification>
        </item>

        <item id="DG-12" required="false">
            Opportunités d'upselling documentées
            <verification>
                - Section "Upselling Opportunities" existe si pertinent
                - Opportunités liées à des besoins découverts
            </verification>
        </item>
    </section>
</checklist>

<validation-process>
    <step n="1">
        CHARGER project-context.md
    </step>
    <step n="2">
        Pour CHAQUE item required="true":
        - Exécuter la vérification
        - Marquer PASS ou FAIL
        - Si FAIL, documenter ce qui manque
    </step>
    <step n="3">
        CALCULER le score:
        - 100% required items = PASS
        - < 100% required items = BLOCKED
    </step>
    <step n="4">
        SI BLOCKED:
        - Lister les items manquants
        - Retourner au sous-agent approprié
        - NE PAS autoriser le passage à Quotation
    </step>
</validation-process>

<output-format>
    ## 🚦 Discovery Quality Gate

    ### Checklist Verification
    | ID | Critère | Status | Notes |
    |----|---------|--------|-------|
    | DG-01 | Besoins avec "pourquoi" | ✅/❌ | {notes} |
    | DG-02 | 3 scénarios/feature | ✅/❌ | {notes} |
    | DG-03 | Hidden needs identifiés | ✅/❌ | {notes} |
    | DG-04 | Pas de termes ambigus | ✅/❌ | {notes} |
    | DG-05 | Glossaire complet | ✅/❌ | {notes} |
    | DG-06 | Edge cases documentés | ✅/❌ | {notes} |
    | DG-07 | Jobs-to-be-Done | ✅/❌ | {notes} |
    | DG-08 | Scope IN/OUT | ✅/❌ | {notes} |
    | DG-09 | Métriques succès | ✅/❌ | {notes} |
    | DG-10 | Contraintes | ✅/❌ | {notes} |
    | DG-11 | project-context.md | ✅/❌ | {notes} |
    | DG-12 | Upselling (optionnel) | ✅/❌/N/A | {notes} |

    ### Score
    **Required items**: {X}/{Y} passed
    **Optional items**: {A}/{B} passed

    ### Verdict
    🟢 **GATE PASSED** - Ready for Quotation phase
    ou
    🔴 **GATE BLOCKED** - Fix required items before proceeding

    ### If Blocked - Actions Required
    | Item | Action | Assigned To |
    |------|--------|-------------|
    | DG-XX | {what needs to be done} | {sub-agent} |
</output-format>

<block-until>
    Tous les items required="true" sont ✅
</block-until>

</quality-gate>
```
