# AI Product Architect --- Validation & Research

**Status:** discovery evidence baseline\
**Last updated:** 27 September 2026

This document records the evidence that materially changed or supported
the product thesis. It is intentionally not an exhaustive research
archive.

## 1. Competitive validation

Research found multiple products already addressing portions of the
generic architecture workflow, including natural-language cloud
architecture, multi-cloud comparison, cost estimation, Terraform
generation, and deployment into customer cloud accounts.

Examples encountered during discovery included CrftInfrai, GenIaaC,
Leap, StackSpark, Spawned, and Dreambase.

**Finding:** the generic gap "requirements → architecture → cost → IaC →
deploy" is substantially smaller than initially assumed.

**Implication:** do not build or position V1 as a generic AI cloud
architect.

## 2. Cloud accelerator validation

AWS Generative AI Application Builder (GAAB) was examined as a possible
deployment layer. It supports several generative-AI application patterns
and deploys resources into a customer's AWS environment.

**Finding:** GAAB can be an implementation asset when a workload fits,
but it should not define the product ontology.

**Implication:** normalize capabilities such as RAG, agents, model
inference, storage, authentication, billing, and observability. Map
those capabilities to provider implementations or accelerators
afterward.

## 3. Canonical validation case A --- AI invoice-processing API

### Simulated founder input

Build an API for APAC SMEs that accepts invoices and returns normalized
structured JSON. Start around 100,000 invoices per month and potentially
scale to millions. Prefer Singapore-hosted infrastructure where
practical. The founder does not know which cloud/model architecture or
pricing model to use.

### Frozen workload assumptions

-   100,000 invoices/month initially;
-   average 2 pages/invoice;
-   p95 8 pages;
-   80% digital PDF, 20% scans/images;
-   English initially;
-   header fields, supplier, dates, tax, currency, line items, totals;
-   target \>98% field accuracy;
-   asynchronous processing acceptable;
-   human review allowed for low-confidence cases.

These are scenario assumptions, not market facts.

### Architecture finding

All three major clouds offer purpose-built invoice/document extraction
services. Therefore "use an LLM" should not be the default. Meaningful
candidates include:

-   specialized document extraction;
-   multimodal/general LLM;
-   specialized extraction plus LLM fallback;
-   LLM-first plus validation/fallback.

### Pricing finding

A prior public AWS Textract AnalyzeExpense example was used
illustratively at \$0.01/page for the first million pages and
\$0.008/page above that tier. This was not verified as a Singapore
regional quote and must not be treated as one.

GCP Invoice Parser research indicated a per-document-count pricing
structure in which a count covers a document up to a page limit. Numeric
pricing and regional terms must be re-verified before implementation.

### Commercial insight

Provider billing units can differ from customer billing units.

If the provider charges per page while the founder charges a flat amount
per invoice, long invoices can create margin exposure. This led to
alternatives such as:

-   per-page billing;
-   processing units based on page bands;
-   credits;
-   subscription plus included processing units and overage.

**Validated insight:** technical cost dimensions can expose flaws in the
proposed commercial model.

## 4. Model-strategy exploration

A deliberately illustrative two-page invoice normalization of 4,000
input tokens plus 700 output tokens was used to compare token-priced
multimodal paths.

This was a sensitivity exercise, not an accuracy benchmark and not a
universal invoice-token estimate.

**Finding:** low-cost multimodal inference can be economically
competitive with specialized extraction on raw inference cost.

However, raw API cost is insufficient. Accuracy, schema failures,
retries, latency, and human review can reverse the economics.

Example logic:

Cheap model + high human-review rate may cost more operationally than a
more expensive model with a much lower review rate.

**Resulting metric:** cost per successfully processed unit is more
meaningful than cost per API call.

### Resulting product behavior

When public evidence cannot resolve a quality/cost trade-off, the
architect should propose a benchmark rather than fabricate certainty.

A benchmark can measure:

-   field accuracy;
-   line-item accuracy;
-   schema failures;
-   latency;
-   retry rate;
-   inference cost;
-   human-review rate.

**Validated insight:** identifying uncertainty and generating the right
experiment belongs inside the architecture workflow.

## 5. Canonical validation case B --- AI capability for an existing SaaS

A coding-agent-style SaaS was selected because LLM inference is
unquestionably central.

### Simulated product-change input

DevFlow already operates a team developer platform. It is considering a
repository-aware AI coding agent to improve retention and potentially support
a premium offering.

### Illustrative workload assumptions

-   adopted users and agent tasks are incremental usage concepts;
-   tasks have highly variable complexity;
-   an illustrative task profile of 12,000 input tokens and 2,500 output
    tokens was used for sensitivity analysis;
-   heavy users may consume several times the expected usage.

These are scenario assumptions, not claims about any named product's
private usage.

### Finding

The opportunity cannot be evaluated from architecture alone. Retention,
premium-revenue, and experience improvements begin as hypotheses that require
evidence. Technical analysis then tests whether the incremental workload and
cost structure support those hypotheses.

A flat subscription can create long-tail incremental COGS exposure because one
"agent task" can range from a trivial action to a long tool-using loop.

This makes model strategy a business architecture decision:

-   lower-cost model for routine work;
-   stronger model for complex work;
-   premium model or additional consumption for expensive tasks.

### Commercial implication

Possible commercial structures include:

-   subscription plus credits;
-   included usage plus metered overage;
-   differentiated consumption units for more expensive work.

Stripe's public Warp case study was relevant during discovery because it
describes movement toward included AI usage and metered overages as AI
consumption creates variable costs. This should be re-verified from the
current Stripe source before external publication.

**Validated insight:** customer value must be considered before pricing, while
model architecture can materially affect incremental unit economics and the
viable commercial change.

## 6. Cross-case conclusion

The two cases are deliberately different:

**Invoice processing:** infrastructure/service selection can materially
change COGS and the appropriate billable unit.

**Agent SaaS:** model consumption and routing can materially change COGS
and the appropriate included-usage/overage design.

Both reduce to the same loop:

Current product context → proposed change and customer-value hypothesis →
evidence → incremental architecture ↔ economics ↔ commercial architecture →
validation → optional deployment.

This is sufficient validation to stop adding more example businesses
before implementation.

## 7. Open validation questions

The following remain unresolved and should be tested during
implementation:

-   Can live/public provider data support estimates with useful
    precision?
-   Does the recommendation materially exceed a strong general-purpose
    LLM answer?
-   Can a real working application be deployed without unacceptable
    cloud-account friction?
-   Can validated patterns cover enough useful variation without
    becoming rigid?
-   Does the Stripe commercial layer consistently add value beyond
    ordinary checkout integration?
-   How much provider data needs a maintained catalog versus live
    retrieval?
-   What minimum benchmark tooling is needed in V1?

## 8. Evidence discipline

Before using any pricing, model capability, residency, availability, or
product feature in a customer-facing output:

1.  retrieve it from an authoritative current source where possible;
2.  record source and verification date;
3.  distinguish list price from negotiated price;
4.  expose assumptions;
5.  do not silently convert illustrative discovery numbers into
    production facts.
