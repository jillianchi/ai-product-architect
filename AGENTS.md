# AI Product Architect — Agent Instructions

Before making architectural or implementation changes, read:

1. `docs/01-product-thesis.md`
2. `docs/03-product-spec.md`
3. `docs/04-decision-log.md`

Use `docs/02-validation-research.md` when evidence behind a product decision is needed.

Use `docs/05-research-register.md` before relying on provider pricing, capabilities, regional availability, residency, or other time-sensitive facts.

## Core principles

- Keep the capability model provider-neutral.
- AWS is the only deployment target for V1; this does not make the ontology AWS-specific.
- `AGENT_SAAS` is the first implemented pattern.
- `ASYNC_AI` is the second validation pattern.
- Economics calculations must be deterministic and testable.
- Provider facts must not come from LLM memory when they materially affect recommendations.
- Preserve provenance for user facts, assumptions, benchmarks, provider facts, and derived values.
- Keep evidence, statements, hypotheses, and modelling assumptions epistemically distinct.
- Prefer validated deployment modules over arbitrary generated infrastructure.
- Stripe implements the selected commercial model; Stripe does not define the commercial model.
- Derive partner relevance from customer need; a partner may be weak or irrelevant.
- Expose uncertainty. Create validation tasks/benchmarks rather than inventing precision.
- Model the incremental impact of the proposed change rather than silently treating it as a greenfield business.
- Do not expand V1 scope without recording the decision in `docs/04-decision-log.md`.

## First acceptance scenario

> “DevFlow operates a team developer platform and is considering adding a
> repository-aware AI coding agent to improve retention and support a premium
> offering.”

Target flow:

current context → opportunity → evidence and information needs → incremental architecture → incremental economics → commercial change → partner relevance → optional AWS deployment specification

## Working discipline

- Treat `docs/03-product-spec.md` and `docs/04-decision-log.md` as authoritative.
- If implementation forces a material architectural/product decision, update the decision log in the same change.
- If a provider fact is added or materially relied on, update the research register with its source and verification date.
- Do not silently turn illustrative discovery assumptions into defaults.
- Keep implementation changes small enough to test and review.
- Do not choose a language/framework merely because the repository is empty; make that choice explicitly when implementation begins.
