---
name: "development-gate"
phase: "development"
description: "Quality Gate pour la phase Development - validation STRICTE avant de marquer une story done"
---

```xml
<quality-gate name="Development Gate" phase="development" scope="per_story">

<purpose>
    Valider qu'une story est VRAIMENT terminée avant de la marquer "done".
    🚨 RÈGLE ABSOLUE: AUCUN PLACEHOLDER, AUCUN CODE INCOMPLET.
</purpose>

<critical-warning>
    ⛔ CE GATE EST LE PLUS STRICT ⛔

    Une story n'est JAMAIS "done" si:
    - Il reste du placeholder code
    - Des tests manquent
    - Des tests échouent
    - La review n'a pas trouvé/résolu des issues

    AUCUNE EXCEPTION.
</critical-warning>

<checklist>
    <!-- ZERO PLACEHOLDER -->
    <section name="Zero Placeholder Rule" priority="CRITICAL">
        <item id="DV-01" required="true" blocking="true">
            🚨 AUCUN PLACEHOLDER dans le code
            <verification>
                SCAN automatique pour:
                - "TODO" dans le code
                - "FIXME" dans le code
                - "Not implemented" / "Not yet implemented"
                - Fonctions vides: `() => {}`
                - throw new Error("implement")
                - "will be done in STORY-XXX"
                - Code commenté significatif
                - Mock data en production

                SI TROUVÉ = STORY NON DONE, POINT FINAL.
            </verification>
        </item>
    </section>

    <!-- CODE FONCTIONNEL -->
    <section name="Functional Code">
        <item id="DV-02" required="true">
            Code compile/s'exécute sans erreur
            <verification>
                - Build successful
                - Pas d'erreurs TypeScript/lint
                - Application démarre
            </verification>
        </item>

        <item id="DV-03" required="true">
            Tous les AC sont satisfaits
            <verification>
                Pour CHAQUE AC de la story:
                - Vérifier manuellement OU
                - Test automatisé passe
                - Documenter la méthode de vérification
            </verification>
        </item>
    </section>

    <!-- TESTS -->
    <section name="Test Coverage" priority="CRITICAL">
        <item id="DV-04" required="true" blocking="true">
            Tests EXISTENT pour chaque AC
            <verification>
                - Matrice AC → Test
                - Chaque AC a au moins un test
                - Tests dans les bons fichiers
            </verification>
        </item>

        <item id="DV-05" required="true" blocking="true">
            Tous les tests PASSENT
            <verification>
                - Exécuter la suite de tests
                - 100% des tests verts
                - Pas de tests skipped sans raison
            </verification>
        </item>

        <item id="DV-06" required="true">
            Tests de régression OK
            <verification>
                - Tous les tests EXISTANTS passent
                - Aucun test cassé par les changements
            </verification>
        </item>
    </section>

    <!-- CODE REVIEW ADVERSARIAL -->
    <section name="Adversarial Review" priority="CRITICAL">
        <item id="DV-07" required="true">
            Code review effectuée
            <verification>
                - Rapport de review existe
                - Au moins 3 issues trouvés
                - "Looks good" n'était PAS la conclusion initiale
            </verification>
        </item>

        <item id="DV-08" required="true" blocking="true">
            Tous les BLOCKERS résolus
            <verification>
                - Lister les BLOCKERS du rapport
                - Vérifier chacun est fixé
                - Re-review si nécessaire
            </verification>
        </item>

        <item id="DV-09" required="true">
            Tous les MAJOR issues résolus
            <verification>
                - Lister les MAJOR du rapport
                - Vérifier chacun est fixé ou documenté pourquoi non
            </verification>
        </item>
    </section>

    <!-- STORY FILE UPDATED -->
    <section name="Story Documentation">
        <item id="DV-10" required="true">
            Subtasks cochées dans la story
            <verification>
                - Ouvrir le fichier story
                - Toutes les checkboxes subtasks [x]
            </verification>
        </item>

        <item id="DV-11" required="true">
            Dev Notes remplies
            <verification>
                - Section "Dev Notes" n'est pas vide
                - Contient décisions d'implémentation
                - Contient notes utiles pour maintenance
            </verification>
        </item>
    </section>

    <!-- CODE QUALITY -->
    <section name="Code Quality">
        <item id="DV-12" required="true">
            Suit les patterns du projet
            <verification>
                - Code match project-context.md patterns
                - Naming conventions respectées
                - Structure fichiers respectée
            </verification>
        </item>

        <item id="DV-13" required="true">
            Pas de code debug/dev
            <verification>
                - Pas de console.log
                - Pas de debugger
                - Pas de credentials hardcodées
            </verification>
        </item>
    </section>
</checklist>

<validation-process>
    <step n="1" name="Placeholder Scan" blocking="true">
        AVANT TOUT AUTRE CHECK:
        ```bash
        # Scan pour placeholders
        grep -r "TODO\|FIXME\|Not implemented\|implement later" src/
        ```
        SI résultat non vide = ARRÊT IMMÉDIAT, story non done.
    </step>

    <step n="2" name="Test Execution">
        - Exécuter tous les tests
        - Vérifier 100% pass
        - Vérifier aucune régression
    </step>

    <step n="3" name="Review Check">
        - Vérifier rapport de review existe
        - Vérifier ≥ 3 issues trouvés
        - Vérifier BLOCKERS et MAJOR résolus
    </step>

    <step n="4" name="AC Verification">
        Pour chaque AC:
        - Test automatisé passe OU
        - Vérification manuelle documentée
    </step>

    <step n="5" name="Final Checklist">
        Vérifier tous les items DV-01 à DV-13
    </step>
</validation-process>

<output-format>
    ## 🚦 Development Quality Gate: {STORY-ID}

    ### 🚨 Placeholder Scan
    ```
    Scanning for placeholders...
    Files scanned: {N}
    Placeholders found: {N}

    {If found, list each occurrence}
    ```
    **Placeholder Status**: ✅ CLEAN / ❌ FOUND (BLOCKER)

    ### Test Results
    | Metric | Value |
    |--------|-------|
    | New tests | {N} |
    | All tests run | {N} |
    | Passed | {N} |
    | Failed | {N} |
    | **Status** | ✅/❌ |

    ### AC Verification
    | AC | Description | Verified By | Status |
    |----|-------------|-------------|--------|
    | AC-1 | {desc} | test/manual | ✅/❌ |
    | AC-2 | {desc} | test/manual | ✅/❌ |

    ### Code Review
    | Metric | Value |
    |--------|-------|
    | Review done | ✅/❌ |
    | Issues found | {N} (min 3) |
    | BLOCKERS | {N} resolved / {N} total |
    | MAJOR | {N} resolved / {N} total |

    ### Quality Checklist
    | ID | Critère | Status |
    |----|---------|--------|
    | DV-01 | Zero placeholders | ✅/❌ |
    | DV-02 | Code compiles | ✅/❌ |
    | DV-03 | All AC satisfied | ✅/❌ |
    | DV-04 | Tests exist per AC | ✅/❌ |
    | DV-05 | All tests pass | ✅/❌ |
    | DV-06 | Regression OK | ✅/❌ |
    | DV-07 | Review done (3+ issues) | ✅/❌ |
    | DV-08 | BLOCKERS resolved | ✅/❌ |
    | DV-09 | MAJOR resolved | ✅/❌ |
    | DV-10 | Subtasks checked | ✅/❌ |
    | DV-11 | Dev Notes filled | ✅/❌ |
    | DV-12 | Follows patterns | ✅/❌ |
    | DV-13 | No debug code | ✅/❌ |

    ### Verdict
    🟢 **STORY DONE** - Can mark as done in sprint-status.yaml
    ou
    🔴 **STORY NOT DONE** - Cannot proceed

    ### If Not Done - Required Actions
    | Issue | Action | Priority |
    |-------|--------|----------|
    | {issue} | {fix} | BLOCKER/MAJOR |
</output-format>

<block-until>
    - DV-01: Zero placeholders ✅
    - DV-04: Tests exist ✅
    - DV-05: Tests pass ✅
    - DV-08: BLOCKERS resolved ✅
    - Tous les autres items required ✅
</block-until>

<escalation>
    SI le gate échoue:
    1. RETOURNER au sous-agent Coder pour fixes
    2. RETOURNER au sous-agent Tester si tests manquent
    3. RETOURNER au sous-agent Code Reviewer pour re-review
    4. NE JAMAIS marquer "done" manuellement pour bypass
</escalation>

</quality-gate>
```
