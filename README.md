# AI Product Architect

**Design, validate, price, and deploy AI products by connecting technical architecture with unit economics and commercial models.**

AI Product Architect explores a closed-loop approach to building AI products:

```text
business idea
    ↓
requirements
    ↓
technical architecture ↔ unit economics ↔ commercial architecture
    ↓
validation
    ↓
deployment
```

The project deliberately goes beyond generic architecture or IaC generation. Its thesis is that model, cloud, workload, and operational choices materially affect cost to serve — and therefore should influence pricing, billing, and monetization design.

## V1

V1 focuses on an `AGENT_SAAS` vertical slice:

- provider-neutral requirements and capability model;
- AWS deployment;
- supported LLM provider/model paths;
- deterministic unit-economics engine;
- commercial-model reasoning and Stripe mapping;
- validated deployment patterns rather than arbitrary generated infrastructure.

The canonical acceptance scenario is:

> “I want to build an AI coding agent for teams and charge $20/month.”

## Documentation

1. [Product thesis](docs/01-product-thesis.md)
2. [Validation research](docs/02-validation-research.md)
3. [V1 product specification](docs/03-product-spec.md)
4. [Decision log](docs/04-decision-log.md)
5. [Research register](docs/05-research-register.md)

For coding agents, start with [AGENTS.md](AGENTS.md).

## Status

Discovery baseline complete. Implementation has not yet begun.
