# AI Product Architect

**Evaluate and design material AI product changes by connecting customer value, evidence, technical architecture, incremental economics, and commercial models.**

AI Product Architect explores a closed-loop approach to building AI products:

```text
current product and business context
    ↓
proposed capability → why change / why now / customer value
    ↓
evidence and information needs
    ↓
incremental technical architecture ↔ economics ↔ commercial architecture
    ↓
partner relevance → validation → optional deployment
```

The project deliberately goes beyond generic architecture or IaC generation. Its thesis is that a proposed AI capability should be evaluated as a product opportunity: customer value and evidence come first, while model, cloud, workload, and operational choices validate the opportunity through incremental cost and commercial consequences.

## V1

V1 focuses on an `AGENT_SAAS` vertical slice:

- provider-neutral requirements and capability model;
- AWS deployment;
- supported LLM provider/model paths;
- deterministic unit-economics engine;
- commercial-model reasoning and Stripe mapping;
- validated deployment patterns rather than arbitrary generated infrastructure.

The canonical acceptance scenario is an existing digital product considering a material AI capability:

> “DevFlow operates a team developer platform and is considering adding a repository-aware AI coding agent to improve retention and support a premium offering.”

## Documentation

1. [Product thesis](docs/01-product-thesis.md)
2. [Validation research](docs/02-validation-research.md)
3. [V1 product specification](docs/03-product-spec.md)
4. [Decision log](docs/04-decision-log.md)
5. [Research register](docs/05-research-register.md)

For coding agents, start with [AGENTS.md](AGENTS.md).

## Status

Milestone 1 established the canonical domain schema and validator. The domain
is being reframed around the DevFlow existing-product opportunity before new
reasoning behavior is implemented.
