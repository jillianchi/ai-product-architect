# AI Product Architect --- Product Thesis & Discovery

**Status:** discovery baseline\
**Last updated:** 26 September 2026

## 1. Origin

The project began with a partnership question: can Stripe, a
hyperscaler, and an LLM provider create something technically meaningful
together in APAC using products and public interfaces that already
exist, without depending on global product changes?

The desired outcome is not co-marketing or a superficial reference
architecture. It should create real customer value and, if successful,
generate qualified production workloads for the participating platforms.

## 2. Early hypotheses

Several ideas were considered:

-   an agent economic control plane / capability marketplace;
-   a multi-cloud AI architecture advisor;
-   an agent that converts requirements into cloud architecture, cost
    estimates, and infrastructure-as-code;
-   a deployable architecture generator using cloud accelerators such as
    AWS Generative AI Application Builder.

The first concept was rejected as too dependent on new global product or
protocol work. The architecture-agent direction was more regionally
executable, but competitive research showed that
requirements-to-architecture-to-IaC-to-deployment is already a crowded
category.

## 3. What changed the thesis

The useful observation was not that AI can generate architecture. It was
that **AI product architecture and commercial architecture are unusually
coupled**.

Model choice, cloud services, token consumption, document length,
retries, tool use, human review, and workload distribution can
materially change cost to serve. A pricing model that looks sensible
before those technical costs are understood can become structurally
unprofitable.

This suggests a different product boundary:

> Design the technical architecture and commercial architecture
> together, model the unit economics, validate uncertain decisions, and
> produce a deployable implementation.

Architecture generation becomes a means rather than the product.

## 4. Current product thesis

**Working name:** AI Product Architect

**One-line proposition:**\
Describe the AI product you want to build; the system designs a viable
technical and commercial architecture, models its unit economics, and
produces a deployable implementation.

The core loop is:

Business idea → requirements → technical architecture ↔ unit economics ↔
commercial architecture → validation → deployment.

After deployment, actual usage could eventually feed the loop again, but
continuous production optimization is not a V1 requirement.

## 5. Why the partnership is real

### Hyperscaler

The cloud provider supplies runtime infrastructure, storage, databases,
networking, observability, security primitives, AI services, and
potentially managed agent infrastructure. A successful recommendation
can become an attributable workload with estimated and eventually actual
cloud consumption.

### LLM provider

For agentic products, model capability, price, context, caching,
latency, tool use, and routing can materially affect both product
quality and COGS. The provider therefore participates in a genuine
architecture and economics decision rather than merely appearing as a
logo.

### Stripe

The technical cost structure can determine the appropriate commercial
unit: pages, credits, processing units, included usage, or metered
overage. Stripe Billing, meters, entitlements, payments, and related
primitives implement that commercial architecture.

The key sequence is:

Cost driver → billable unit → pricing model → Stripe implementation.

## 6. What is differentiated

The product is **not** primarily:

-   a generic AI cloud architect;
-   a diagram generator;
-   a Terraform generator;
-   a multi-cloud comparison website;
-   an AI app builder.

The differentiated hypothesis is the closed loop between:

1.  business model;
2.  workload assumptions;
3.  architecture/model strategy;
4.  cost to serve;
5.  pricing/billing design;
6.  validation where evidence is insufficient;
7.  deployable implementation.

## 7. Product principles

-   Normalize capabilities before mapping to providers.
-   Use LLMs for reasoning, not as the database of provider facts.
-   Use deterministic code for economics.
-   Preserve provenance for assumptions and user-provided facts.
-   Prefer validated deployment patterns over arbitrary generated
    infrastructure.
-   Expose uncertainty instead of inventing precision.
-   Treat a required benchmark or human handoff as a feature, not a
    failure.
-   Build solution IP regionally; do not require new global product
    capabilities.

## 8. Current V1 thesis

V1 should prove one end-to-end loop using an **AGENT_SAAS** workload,
AWS deployment, Stripe commerce, and supported model providers. The
schemas remain provider-neutral so other clouds and workload patterns
can be added later.

A second **ASYNC_AI** invoice-processing workload is retained as a
cross-check that the abstraction generalizes beyond agent SaaS.

## 9. Success test

The prototype should be able to take:

> "I want to build an AI coding agent for teams and charge \$20/month."

and reach:

structured requirements → adaptive questions → architecture → economics
→ pricing strategy → Stripe implementation → AWS deployment
specification.

The project should be reconsidered if this workflow does not produce
meaningfully better, more actionable output than a strong
general-purpose LLM plus existing cloud accelerators.
