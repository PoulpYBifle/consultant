# Consultant Stack

> Framework d'agents IA pour consultants B2B | AI agents framework for B2B consultants

---

## Présentation / Overview

### [FR] Framework de consultation B2B

Le **Consultant Stack** est un framework d'agents IA conçu pour accompagner les consultants B2B dans l'ensemble du cycle de vie d'un projet : de la découverte des besoins jusqu'à la livraison finale.

**6 agents spécialisés** orchestrés par un point d'entrée unique (Léo, l'orchestrateur) vous guident à travers chaque phase de votre mission.

### [EN] B2B Consulting Framework

The **Consultant Stack** is an AI agents framework designed to support B2B consultants throughout the entire project lifecycle: from requirements discovery to final delivery.

**6 specialized agents** orchestrated by a single entry point (Léo, the orchestrator) guide you through each phase of your mission.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR (Léo)                           │
│              Point d'entrée unique / Single entry point             │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   DISCOVERY   │     │   ARCHITECT   │     │    PLANNER    │
│   (Clarify)   │────▶│    (Design)   │────▶│  (Planning)   │
└───────────────┘     └───────────────┘     └───────────────┘
        │                        │                        │
        │                        ▼                        │
        │              ┌───────────────┐                  │
        │              │   DEVELOPER   │◀─────────────────┘
        │              │  (Implement)  │
        │              └───────┬───────┘
        │                      │
        │                      ▼
        │              ┌───────────────┐
        └─────────────▶│   DELIVERY    │
                       │   (Handoff)   │
                       └───────────────┘
```

---

## Agents

| Agent | Rôle / Role | Skills |
|-------|-------------|--------|
| **Orchestrator** | Point d'entrée, routing intelligent / Single entry point, intelligent routing | `/init`, `/status`, `/next` |
| **Discovery** | Clarification des besoins / Requirements clarification | `/clarify`, `/frame`, `/techniques` |
| **Architect** | Conception technique / Technical design | `/spec`, `/analyze-codebase` |
| **Planner** | Planification et estimation / Planning and estimation | `/estimate`, `/quote`, `/create-story`, `/plan-sprint` |
| **Developer** | Implémentation / Implementation | `/implement`, `/test` |
| **Delivery** | Documentation et livraison / Documentation and delivery | `/docs`, `/handoff`, `/upsell` |

---

## Skills disponibles / Available Skills

### Discovery Phase
- `/clarify` - Clarifier les besoins avec le client / Clarify client requirements
- `/frame` - Cadrer le problème et les objectifs / Frame the problem and objectives
- `/techniques` - Techniques d'idéation (40 méthodes) / Ideation techniques (40 methods)

### Architecture Phase
- `/spec` - Rédiger une spécification technique / Write technical specification
- `/analyze-codebase` - Analyser un projet existant / Analyze existing codebase

### Planning Phase
- `/estimate` - Estimer la charge de travail / Estimate workload
- `/quote` - Générer un devis professionnel / Generate professional quote
- `/create-story` - Créer des user stories / Create user stories
- `/plan-sprint` - Planifier un sprint / Plan a sprint

### Development Phase
- `/implement` - Implémenter une story / Implement a story
- `/test` - Tester et valider / Test and validate

### Delivery Phase
- `/docs` - Générer la documentation / Generate documentation
- `/handoff` - Préparer la livraison / Prepare handoff
- `/upsell` - Identifier des opportunités / Identify opportunities

### Utilitaires / Utilities
- `/init` - Initialiser un nouveau projet / Initialize new project
- `/status` - Afficher l'état du projet / Show project status
- `/next` - Prochaine étape recommandée / Next recommended step

---

## Quick Start

### Prérequis / Prerequisites
- Claude Code (CLI)
- Accès au modèle Claude / Claude model access

### Installation

```bash
# Clone the repository / Cloner le dépôt
git clone https://github.com/PoulpYBifle/consultant.git _consultant

# Navigate to your project / Se placer dans votre projet
cd your-project

# Start the orchestrator / Lancer l'orchestrateur
# In Claude Code, invoke the orchestrator agent
```

### Utilisation / Usage

1. **Démarrer l'orchestrateur** / **Start the orchestrator**
   - Invoquez l'agent `orchestrator.md` dans Claude Code
   - Invoke the `orchestrator.md` agent in Claude Code

2. **Initialiser un projet** / **Initialize a project**
   - Tapez `/init` pour créer un nouveau projet
   - Type `/init` to create a new project

3. **Suivre le workflow** / **Follow the workflow**
   - L'orchestrateur vous guide automatiquement
   - The orchestrator guides you automatically

---

## Structure du projet / Project Structure

```
_consultant/
├── config.yaml              # Configuration centrale / Central config
├── project-context.md       # Contexte du projet / Project context
├── project-path.yaml        # Parcours des phases / Phase journey
├── workflow-status.yaml     # État courant / Current state
├── sprint-status.yaml       # État du sprint / Sprint status
│
├── agents/                  # Agents spécialisés / Specialized agents
│   ├── orchestrator.md      # Point d'entrée / Entry point
│   ├── discovery.md         # Discovery agent
│   ├── architect.md         # Architect agent
│   ├── planner.md           # Planner agent
│   ├── developer.md         # Developer agent
│   └── delivery.md          # Delivery agent
│
├── skills/                  # Compétences / Skills
│   ├── clarify.md
│   ├── frame.md
│   ├── estimate.md
│   └── ... (17 skills)
│
├── templates/               # Modèles / Templates
│   ├── story.md             # Template user story
│   ├── spec.md              # Template spécification
│   ├── quotation.md         # Template devis
│   └── handoff-checklist.md # Template livraison
│
├── modules/                 # Modules partagés / Shared modules
│   └── technique-selector.md
│
├── data/                    # Données / Data
│   └── consultant-techniques.csv  # 40 techniques d'idéation
│
├── output/                  # Outputs générés / Generated outputs
└── stories/                 # Stories créées / Created stories
```

---

## Personnalisation / Customization

Modifiez `config.yaml` pour adapter le framework :

```yaml
consultant:
  name: "Votre nom"
  company: "Votre entreprise"
  specialty: "Votre spécialité"

communication_language: "french"  # ou "english"
document_output_language: "french"

rates:
  discovery_hourly: 150
  development_hourly: 120
  currency: "EUR"
```

---

## Licence / License

MIT License - Voir [LICENSE](LICENSE)

---

## Contributeurs / Contributors

- Framework conçu pour les consultants B2B
- Framework designed for B2B consultants

---

## Liens / Links

- [BMAD Framework](https://github.com/bmadcode/BMAD-METHOD) - Inspiration for agent architecture
