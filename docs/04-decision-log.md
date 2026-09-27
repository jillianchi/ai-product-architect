# AI Product Architect --- Decision Log

**Status:** living document\
**Last updated:** 27 September 2026

## DEC-001 --- Build solution IP, not new platform/protocol IP

**Decision:** The project must use existing public products/interfaces
and be executable regionally.

**Reason:** New cross-company protocols or global product capabilities
are outside the realistic scope of an APAC partnership/solutions
project.

**Revisit when:** a participating product team explicitly sponsors a
global product change.

------------------------------------------------------------------------

## DEC-002 --- Do not position as a generic AI cloud architect

**Decision:** Architecture generation is a component, not the primary
product.

**Reason:** Competitive validation found multiple products already
covering natural-language architecture, cost estimation, IaC, and
deployment.

**Revisit when:** the differentiated economics/commercial loop fails
validation.

------------------------------------------------------------------------

## DEC-003 --- Normalize capabilities before provider services

**Decision:** Product ontology uses provider-neutral capabilities.

**Reason:** This prevents AWS terminology from becoming the architecture
model and preserves a path to Azure/GCP later.

**Revisit when:** never by default; provider-specific capabilities may
be represented as extensions.

------------------------------------------------------------------------

## DEC-004 --- Provider facts do not come from LLM memory

**Decision:** Pricing, regional availability, product capabilities,
limits, and similar facts should come from authoritative
maintained/current sources where possible.

**Reason:** These facts change and materially affect recommendations.

**Revisit when:** only for non-material explanatory defaults, never for
authoritative pricing/availability claims.

------------------------------------------------------------------------

## DEC-005 --- Economics calculations are deterministic

**Decision:** LLMs may reason about economics but do not perform the
authoritative arithmetic.

**Reason:** Calculations must be reproducible, testable, and traceable.

**Revisit when:** not expected.

------------------------------------------------------------------------

## DEC-006 --- Preserve provenance for material values

**Decision:** User facts, assumptions, benchmark results, provider
facts, and derived values must be distinguishable.

**Reason:** The system must not present assumptions as facts.

**Revisit when:** not expected.

------------------------------------------------------------------------

## DEC-007 --- Use validated architecture/deployment patterns

**Decision:** Compose from validated modules rather than allowing
arbitrary LLM-generated infrastructure.

**Reason:** Reduces hallucination, security risk, and deployment
variability while making cost models more trustworthy.

**Revisit when:** the validated library becomes too restrictive for
demonstrated customer demand.

------------------------------------------------------------------------

## DEC-008 --- AWS-only deployment for V1

**Decision:** V1 deploys to AWS only.

**Reason:** Multi-cloud deployment would multiply implementation and
operational complexity before product value is proven.

**Does not mean:** the product ontology is AWS-specific.

**Revisit when:** AGENT_SAAS deploys end-to-end reliably and the
economics/architecture loop is validated.

------------------------------------------------------------------------

## DEC-009 --- AGENT_SAAS is the first end-to-end pattern

**Decision:** Implement AGENT_SAAS first as a material capability added to an
existing digital product.

**Reason:** LLM inference is unquestionably central, making it a strong test of
the opportunity → architecture → incremental economics → commercial design
loop and of honest partner relevance.

**Revisit when:** the first implementation exposes a simpler/better
canonical workload.

------------------------------------------------------------------------

## DEC-010 --- ASYNC_AI is the second validation pattern

**Decision:** Replay the invoice-processing case after AGENT_SAAS.

**Reason:** It tests whether the abstraction generalizes to a materially
different workload and whether specialized AI services can compete with
general LLMs.

------------------------------------------------------------------------

## DEC-011 --- Benchmarks are first-class when evidence is insufficient

**Decision:** The architect can return `validation_required` and propose
an experiment.

**Reason:** Quality/cost decisions often cannot be resolved from public
pricing or model documentation alone.

**Revisit when:** not expected.

------------------------------------------------------------------------

## DEC-012 --- Stripe follows the commercial model

**Decision:** Define the commercial unit/pricing structure before
mapping it to Stripe primitives.

**Reason:** Avoids treating Stripe as a bolted-on checkout layer or
forcing product logic to mirror provider primitives.

------------------------------------------------------------------------

## DEC-013 --- Deployment engine is intentionally non-reasoning

**Decision:** Optional deployment consumes an approved `ArchitectureSpec` and
maps it to validated implementation modules. Opportunity analysis does not
create a separate deployment approval gate.

**Reason:** Architecture intelligence belongs before deployment;
deployment should be predictable and reviewable.

------------------------------------------------------------------------

## DEC-014 --- Use two canonical patterns rather than expanding discovery cases

**Decision:** Replace the greenfield coding-agent example with the DevFlow
existing-product AGENT_SAAS scenario; do not add more canonical examples now.

**Reason:** DevFlow and invoice processing are sufficient to test the revised
opportunity/architecture/economics/commercial loop. Additional examples risk
becoming research without reducing implementation uncertainty.

**Revisit when:** AGENT_SAAS and ASYNC_AI produce incompatible
abstractions.


------------------------------------------------------------------------

## DEC-015 --- Use AI Product Architect as the project name

**Decision:** Use “AI Product Architect” rather than “AI Business Architect” or “AI Solution Architect.”

**Reason:** “Business architect” understates the cloud/model/deployment depth, while “solution architect” risks making the economics and monetization loop feel secondary. “Product” keeps the technical and commercial architecture centered on the AI product the customer is building.

------------------------------------------------------------------------

## DEC-016 --- Use JSON Schema and TypeScript for the initial domain contract

**Decision:** JSON Schema Draft 2020-12 is the canonical, language-neutral
domain contract. The initial validator and tests use TypeScript on Node.js,
Ajv for runtime schema validation, and Vitest for tests.

**Reason:** The first milestone needs portable schemas, strict deterministic
validation, and focused tests without committing the product ontology to an
application framework. TypeScript provides a small implementation surface for
the initial validator and is compatible with the likely web and service
boundaries, while JSON Schema remains authoritative.

**Does not mean:** TypeScript types replace runtime validation, generated types
are required, or the application framework has been selected.

**Revisit when:** implementation beyond the domain boundary demonstrates a
material requirement that this stack cannot meet.

------------------------------------------------------------------------

## DEC-017 --- Evaluate a change to an existing product

**Decision:** The primary V1 unit of analysis is a material AI capability or
change being considered for an existing digital product/business.

**Reason:** The intended workflow is opportunity evaluation for real customer
contexts, not assuming that every user is founding a greenfield business.

**Does not mean:** complete current-architecture discovery is required.

------------------------------------------------------------------------

## DEC-018 --- Embed Opportunity in ProductDesign

**Decision:** `ProductDesign` remains the sole V1 root aggregate. It embeds an
`Opportunity` section; Opportunity has no separate root or lifecycle.

**Reason:** Opportunity reasoning and solution design need a clear conceptual
boundary without creating duplicate facts, synchronization, or a conversion
workflow.

**Revisit when:** portfolio ownership, independent lifecycle, or CRM
integration creates a demonstrated need for a separate aggregate.

------------------------------------------------------------------------

## DEC-019 --- Use one progressive flow with variable information completeness

**Decision:** Do not create seller and customer product modes. The same
`ProductDesign` becomes more precise as information is supplied with explicit
provenance and epistemic status.

**Reason:** Seller, customer, and other users can each have partial knowledge;
role alone does not justify separate product behavior.

------------------------------------------------------------------------

## DEC-020 --- Model the proposed change incrementally

**Decision:** Workload, architecture, economics, and commercial design are
scoped to the incremental effect of the proposed change. Economics carries an
explicit `incremental` scope.

**Reason:** Whole-product revenue and cost can hide whether the proposed
capability itself is viable or creates an incremental partner workload.

**Does not mean:** shared costs, cannibalization, or baseline effects are
ignored; they must be explicit inputs or assumptions when material.

------------------------------------------------------------------------

## DEC-021 --- Derive partner relevance and allow no fit

**Decision:** Partner relevance follows customer value, architecture,
economics, and commercial design. It may be strong, conditional, weak, or
absent. Do not add partner assessments to `ProductDesign` until the behavior is
implemented and validated.

**Reason:** The system must not manufacture partner fit because a participating
partner wants the opportunity.

------------------------------------------------------------------------

## DEC-022 --- Treat information acquisition as routing, not a questionnaire

**Decision:** A material unknown may eventually be routed to authoritative
research, explicit hypothesis, scenario modelling, the current user, future
customer discovery, or deferral. `InformationNeed` is transient output, not a
second persistent requirements model.

**Reason:** Missing fields do not automatically imply user questions, and
useful analysis must be possible before discovery is complete.

------------------------------------------------------------------------

## DEC-023 --- Keep deployment optional

**Decision:** Deployment is an optional path and requires an approved
`ArchitectureSpec`. Opportunity analysis informs the decision to proceed but
does not create an "approved opportunity" prerequisite.

**Reason:** Early opportunity analysis is useful even when deployment is not
requested or the current user cannot authorize it.
