# AI Product Architect --- Product Thesis & Discovery

**Status:** implementation baseline\
**Last updated:** 27 September 2026

## 1. Origin

The project began with a partnership question: can Stripe, a hyperscaler, and
an LLM provider create something technically meaningful together in APAC using
products and public interfaces that already exist, without depending on global
product changes?

The desired outcome is not co-marketing or a superficial reference
architecture. It should create real customer value and, when relevant,
generate qualified production workloads for participating platforms.

## 2. What changed the thesis

Requirements-to-architecture-to-IaC is already a crowded category. The more
useful observation is that AI product value, technical architecture, and
commercial architecture are unusually coupled.

Model choice, cloud services, token consumption, retries, tool use, human
review, and workload distribution can materially change the incremental cost
of a proposed capability. Those costs can change the viable product experience,
price, billable unit, and expected customer value.

Architecture generation is therefore evidence within an opportunity analysis,
not the product itself.

## 3. Current product thesis

**Working name:** AI Product Architect

**One-line proposition:**\
Evaluate a material AI capability for an existing digital product; connect the
customer-value hypothesis and evidence to incremental technical architecture,
economics, commercial design, partner relevance, validation, and optional
deployment.

The core loop is:

Current product/business context → proposed change → why change / why now /
customer value → evidence and information needs → incremental architecture ↔
economics ↔ commercial design → partner relevance → validation → optional
deployment.

Technical and economic analysis may strengthen, reshape, or reject the
opportunity hypothesis.

## 4. Primary user and information model

The user may be:

-   a seller or partner team member researching or preparing an account;
-   someone from the company exploring a capability;
-   another participant with partial knowledge of the company or product.

V1 does not create separate seller and customer modes. It uses one progressive
workflow whose precision follows the information available and its provenance.
The system should produce useful analysis from sparse context and should never
require a complete current architecture or perfect discovery data before doing
so.

Inputs may be user-provided facts or statements, source-backed evidence,
explicit hypotheses, modelling assumptions, benchmarks, provider sources, and
derived analysis. Absence means unknown. These epistemic states must remain
distinguishable.

## 5. Opportunity before solution

AI Product Architect is evidence-led, not ideation-led. An explicit proposal
can be evaluated directly. Relevant signals or evidence may support synthesis
of a grounded opportunity hypothesis. Generic company or account context alone
is insufficient and must not trigger speculative AI-capability brainstorming
followed by post-hoc justification.

The intended direction is:

Evidence/signals → grounded opportunity hypothesis → value hypotheses →
validation → architecture ↔ economics ↔ commercial design.

The product should help answer, in roughly this order:

1.  What is the current product and business context?
2.  What change or capability is being considered?
3.  Why might the customer change?
4.  Why might they change now?
5.  What customer value could result?
6.  What evidence supports those claims and what remains uncertain?
7.  What would the capability require technically?
8.  What are its incremental economics?
9.  How might the commercial model change?
10. Which partner capabilities are relevant, if any, and why?
11. What should be researched, modelled, asked, discovered, or deferred next?

Why-change, why-now, and customer value are product inputs, not sales copy added
after an architecture has been selected.

## 6. Why the partnership can be real

### Hyperscaler

The cloud provider can supply incremental runtime infrastructure, storage,
databases, networking, observability, security primitives, AI services, and
agent infrastructure. Relevance depends on the proposed change and the
customer's actual constraints.

### LLM provider

Model capability, price, context, caching, latency, and tool use can affect both
product quality and incremental COGS. A model provider is relevant only when a
validated model path contributes to the customer outcome.

### Stripe

The cost structure can imply a new commercial unit or pricing change. Stripe
may expand an existing relationship, replace another implementation, enable a
new commercial model, or be irrelevant. Stripe implements the selected
commercial architecture; it does not define it.

Partner relevance is derived from customer need, architecture, economics, and
commercial design. The system must be able to conclude that a partner
opportunity is weak or absent.

## 7. Product principles

-   Start with the customer opportunity, not a predetermined partner fit.
-   Synthesize opportunities only from an explicit proposal or sufficient
    relevant evidence/signals.
-   Normalize capabilities before mapping to providers.
-   Use LLMs for reasoning, not as the database of provider facts.
-   Use deterministic code for economics.
-   Model incremental impact explicitly.
-   Preserve provenance and epistemic status.
-   Prefer validated deployment patterns over arbitrary generated
    infrastructure.
-   Expose uncertainty instead of inventing precision.
-   Treat research, scenario modelling, customer discovery, benchmarks, and
    deferral as legitimate next actions.
-   Build solution IP regionally without requiring new global product
    capabilities.

## 8. V1 boundary

V1 proves one end-to-end loop for an existing digital product considering an
`AGENT_SAAS` capability. AWS remains the only deployment target, Stripe remains
the commercial implementation when relevant, and supported model paths must be
validated. The schemas remain provider-neutral.

Deployment is optional. When requested, it consumes an approved
`ArchitectureSpec`; opportunity analysis does not create a separate approval
gate.

`ASYNC_AI` remains the second validation pattern after the revised
`AGENT_SAAS` loop works end to end.

## 9. Canonical acceptance scenario

> "DevFlow operates a team developer platform and is considering adding a
> repository-aware AI coding agent to improve retention and support a premium
> offering."

The same scenario must work with sparse information and with richer evidence,
workload, commercial, and technical context. It should reach an explicit
opportunity hypothesis, evidence gaps, incremental architecture and economics,
commercial implications, honest partner relevance, next information needs,
and—only when requested—an AWS deployment specification.

The project should be reconsidered if this workflow is not more actionable
than a strong general-purpose LLM response plus existing cloud accelerators.
