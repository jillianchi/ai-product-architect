# AI Product Architect --- V1 Product Specification

**Status:** implementation baseline\
**Last updated:** 27 September 2026

## 1. Product definition

AI Product Architect evaluates a material AI capability for an existing digital
product. It connects current product context, why-change and why-now reasoning,
customer-value hypotheses, and evidence to incremental technical architecture,
economics, commercial design, honest partner relevance, validation, and
optional deployment.

## 2. Canonical V1 acceptance scenario

Sparse input:

> "DevFlow operates a team developer platform and is considering adding a
> repository-aware AI coding agent to improve retention and support a premium
> offering."

The same scenario gains precision as workload, customer, commercial,
technical, and source-backed information is added. It does not split into
seller and customer modes.

The prototype should eventually produce:

current context → opportunity and evidence → information needs → normalized
capabilities → incremental architecture alternatives → deterministic
incremental economics → commercial change → partner relevance → validation →
optional AWS deployment specification.

## 3. V1 user journey

1.  The user supplies partial structured or unstructured current-product and
    proposed-change context.
2.  The system records what is known with provenance and leaves absent values
    unknown.
3.  The system forms explicit why-change, why-now, and customer-value
    hypotheses from an explicit proposal or sufficient relevant signals,
    without presenting unsupported hypotheses as facts.
4.  The system identifies evidence and material information needs.
5.  Each information need may eventually be routed to authoritative research,
    explicit hypothesis, scenario modelling, the current user, future customer
    discovery, or deferral.
6.  The system selects or composes validated capability patterns for the
    proposed change without requiring a complete current architecture.
7.  Provider facts and pricing come from maintained/current sources.
8.  Deterministic economics evaluates the incremental low, expected, and high
    scenarios for the proposed change.
9.  Architecture, economics, and opportunity reasoning challenge one another.
10. The system proposes commercial changes and maps a selected change to
    Stripe capabilities only when relevant.
11. The system derives partner relevance from customer need and may conclude
    that a partner opportunity is weak or absent.
12. If deployment is requested, an approved `ArchitectureSpec` is mapped to
    validated modules through an explicit plan/review/apply flow.

## 4. Canonical aggregate and domain concepts

`ProductDesign` is the sole V1 root aggregate and structured state. Opportunity
is embedded within it; there is no separate Opportunity lifecycle.

### Business

Captures the existing organization, product, target customer, geography,
stage, current commercial context, and priorities.

### Opportunity

Captures the proposed change, why-change and why-now statements/evidence/
hypotheses, and customer-value hypotheses.

Opportunity entries must distinguish:

-   a user-provided statement;
-   source-backed evidence;
-   an analytical hypothesis;
-   a modelling assumption.

Evidence requires a source reference. Hypotheses require confidence. These
epistemic states do not assert that a customer statement is independently
verified.

### Workload

Captures incremental activity created by the proposed change: users,
requests/tasks, tokens, tool calls, compute, storage, routing, and other
pattern-specific cost drivers.

### Constraints

Captures constraints applicable to the change: cloud requirement, deployment
region, data residency, provider exclusions, availability, compliance, and
budget. A complete current-estate inventory is not required.

### Architecture

Captures the incremental target architecture for the proposed change:
normalized capabilities, selected patterns, implementations, model strategy,
decisions, assumptions, and validation tasks. It is not an arbitrary analysis
of all existing infrastructure.

### Economics

Captures explicitly incremental revenue, COGS, contribution, margin, and
sensitivity scenarios for the proposed change. Shared-cost allocation,
cannibalization, and baseline comparisons remain explicit inputs or
assumptions; they must not be silently inferred.

### CommercialModel

Captures the proposed commercial change: subscription, usage, credits, hybrid
pricing, included allowances, overage, and billable unit. Stripe is an
implementation of the selected model, not the model itself.

### Deployment

Captures an optional approved `ArchitectureSpec` and provider-specific
deployment configuration. Opportunity analysis informs whether work should
proceed but is not a separate deployment approval gate.

### Partner relevance

Partner relevance is an intended derived output based on the opportunity,
architecture, economics, and commercial design. It may be strong,
conditional, weak, or absent. It is deliberately not part of the V1 schema
until partner-relevance behavior is implemented and validated.

### InformationNeed

An `InformationNeed` is intended to be transient reasoning output rather than a
second persistent requirements model. It should eventually capture:

-   what is unknown or insufficiently supported;
-   why it matters;
-   affected decisions;
-   recommended acquisition method;
-   whether it blocks meaningful progress.

The current deterministic `InformationNeed` analyzer covers only material rules
exercised by the DevFlow fixtures. It does not perform acquisition, research,
question phrasing, or natural-language opportunity generation.

The product is evidence-led, not ideation-led. Generic company context such as
"DevFlow is a developer collaboration company" is insufficient to generate an
AI opportunity. In that case the system should expose insufficient signal and
identify useful evidence needs. It must not brainstorm speculative capabilities
and then manufacture justification.

## 5. Provenance and epistemic status

Material facts retain provenance:

-   `user`;
-   `assumption`;
-   `benchmark`;
-   `provider_source`;
-   `derived`.

`user` means supplied by the current user. It does not claim that the current
user originated or independently verified the information. A customer may be
the current user, so V1 does not add `customer_source`.

V1 also does not add `public_source` until a concrete fixture or behavior needs
it. Source-backed opportunity evidence supplied by the user uses `user`
provenance plus a required `sourceReference` and an explicit `evidence`
epistemic kind.

Absence means genuinely unknown. An assumption must contain an explicit value
with `assumption` provenance. Hypotheses and statements are not silently
converted into evidence.

## 6. Provider-neutral capability model

The initial capability vocabulary continues to cover web frontend,
authentication, tenant management, API, agent runtime, inference, routing,
tool execution, sandbox compute, retrieval, database, storage, orchestration,
secrets, observability, usage tracking, billing, and entitlements.

Provider service names must not be used as the ontology.

## 7. Architecture patterns

The schema continues to recognize:

1.  `AI_API`
2.  `AI_SAAS`
3.  `AGENT_SAAS`
4.  `ASYNC_AI`
5.  `RAG_SAAS`

`AGENT_SAAS` is implemented first as an incremental capability added to
DevFlow. `ASYNC_AI` remains the second validation pattern. Patterns compose
through a base pattern and capability modules rather than isolated codebases.

## 8. Provider knowledge

Provider pricing, capabilities, regions, limits, compatibility, and similar
facts must come from authoritative maintained/current sources and retain their
source and verification date. LLM memory is not authoritative provider data.

## 9. Incremental economics

Economics calculations are deterministic code. Potential incremental inputs
include adopted users, task volume, tokens, routing, compute, storage,
bandwidth, tools, fallback, human review, payment volume, incremental revenue,
and explicitly allocated shared costs.

Outputs include incremental monthly revenue, model COGS, cloud COGS, tool
COGS, payment costs, total cost to serve, contribution, contribution margin,
unit revenue, and unit cost.

V1 produces low, expected, and high scenarios together. The scenario-input
override and unit-denominator contracts remain unresolved and must be decided
before implementing the economics engine.

## 10. Commercial and partner reasoning

The commercial engine reasons from customer value and incremental cost
structure toward a commercial unit and pricing change. Initial supported
structures remain subscription, usage, subscription plus usage, and credits.

Partner relevance follows this reasoning. Existing use of AWS, Stripe, or a
model provider does not by itself prove an incremental opportunity. The
analysis must be able to conclude that no relevant partner change exists.

## 11. Deployment boundary

### Supported

-   optional AWS deployment only;
-   provider-neutral schema;
-   Stripe implementation when commercially relevant;
-   validated model paths;
-   validated infrastructure/application modules;
-   explicit plan/review/apply flow;
-   short-lived/scoped AWS access.

### Not supported

-   Azure or GCP deployment;
-   complete brownfield-estate analysis or migration;
-   arbitrary generated Terraform;
-   Kubernetes optimization;
-   complex enterprise networking;
-   automatic compliance certification;
-   continuous production optimization;
-   automatic production model switching;
-   universal production-readiness claims;
-   CRM integration, lead scoring, or sales handoff;
-   live web research or an LLM integration in the domain reframing;
-   separate seller and customer product modes.

## 12. V1 success criteria

V1 succeeds if:

-   sparse DevFlow context produces useful opportunity analysis without
    fabricated precision;
-   richer information increases precision in the same `ProductDesign`;
-   evidence, statements, hypotheses, and assumptions remain distinct;
-   technical and economic analysis can challenge the value hypothesis;
-   incremental architecture alternatives have explainable economic effects;
-   commercial design follows customer value and cost structure;
-   partner relevance is honest and may be absent;
-   material information needs are routed appropriately;
-   an approved `ArchitectureSpec` can optionally produce an AWS deployment
    specification.
