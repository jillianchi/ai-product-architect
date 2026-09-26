# AI Product Architect --- V1 Product Specification

**Status:** implementation baseline\
**Last updated:** 26 September 2026

## 1. Product definition

Describe the AI product you want to build; the system designs a viable
technical and commercial architecture, models its unit economics, and
produces a deployable implementation.

## 2. V1 acceptance scenario

Initial prompt:

> "I want to build an AI coding agent for teams and charge \$20/month."

The prototype should produce:

structured requirements → adaptive questions → normalized capabilities →
architecture alternatives → deterministic economics → commercial design
→ Stripe implementation mapping → AWS deployment specification.

## 3. V1 user journey

1.  User describes the business in natural language.
2.  System extracts known requirements.
3.  System asks only follow-up questions that materially affect
    architecture or economics.
4.  Unknown values may remain unknown; material unknowns can become
    explicit assumptions.
5.  System selects/composes validated architecture patterns.
6.  Provider facts and pricing are retrieved from maintained/current
    sources.
7.  Economics engine evaluates expected and sensitivity scenarios.
8.  Architecture/economics loop evaluates alternatives.
9.  System proposes commercial structures and maps the chosen structure
    to Stripe primitives.
10. System exposes assumptions, trade-offs, and validation tasks.
11. User can request a deployment specification.
12. Deployment engine converts the approved architecture specification
    into validated modules/configuration.

## 4. Primary domain objects

### Business

Captures what is being sold, target customer, geography, stage, proposed
pricing, and priorities.

### Workload

Captures the activity that drives technical consumption: users,
requests/tasks, tokens, documents/pages, tool calls, storage, latency,
and other workload-specific dimensions.

### Constraints

Captures cloud preference/requirement, region and residency
requirements, provider exclusions, availability expectations, compliance
constraints, and budget.

### Architecture

Captures normalized capabilities, selected patterns, provider
implementations, model strategy, decisions, assumptions, and validation
tasks.

### Economics

Captures revenue, COGS categories, unit economics, contribution, and
sensitivity scenarios.

### CommercialModel

Captures subscription, usage, credits, hybrid pricing, included
allowances, overage, and the billable unit.

### Deployment

Captures the approved architecture specification and provider-specific
deployment configuration.

## 5. Provenance

Material values must carry provenance.

Example:

``` json
{
  "value": 80,
  "source": "user"
}
```

or:

``` json
{
  "value": 12000,
  "source": "assumption",
  "confidence": "low"
}
```

Supported sources should include at least:

-   user;
-   assumption;
-   benchmark;
-   provider_source;
-   derived.

## 6. Provider-neutral capability model

Initial capability vocabulary should cover:

-   web frontend;
-   authentication;
-   tenant management;
-   API;
-   agent runtime;
-   model inference;
-   model routing;
-   tool execution;
-   sandbox compute;
-   retrieval;
-   database;
-   object storage;
-   queue/orchestration;
-   secrets;
-   observability;
-   usage tracking;
-   subscription billing;
-   usage billing;
-   entitlements.

Provider service names must not be used as the ontology.

## 7. Architecture patterns

The schema should support five patterns even though only one is
implemented end-to-end initially:

1.  `AI_API`
2.  `AI_SAAS`
3.  `AGENT_SAAS`
4.  `ASYNC_AI`
5.  `RAG_SAAS`

Patterns should compose through a base pattern plus capability modules
rather than becoming five isolated codebases.

### First implemented pattern

`AGENT_SAAS`

### Second validation pattern

`ASYNC_AI`

## 8. Provider knowledge layer

Each implementation entry should be capable of representing:

-   provider;
-   service/product;
-   supported capabilities;
-   regions;
-   pricing dimension;
-   pricing source;
-   limits;
-   constraints;
-   compatibility;
-   source URL/reference;
-   last verified date.

LLM memory is not an authoritative provider-data source.

## 9. Economics engine

Economics calculations are deterministic code.

Potential inputs include:

-   users;
-   requests/tasks;
-   input/output tokens;
-   model routing distribution;
-   compute duration;
-   storage;
-   bandwidth;
-   tool calls;
-   documents/pages;
-   fallback rate;
-   human-review rate/cost;
-   payment volume.

Outputs include:

-   monthly revenue;
-   model COGS;
-   cloud COGS;
-   tool COGS;
-   payment costs;
-   total cost to serve;
-   contribution;
-   contribution margin;
-   unit revenue;
-   unit cost.

V1 automatically produces three scenarios:

-   low;
-   expected;
-   high.

## 10. Architecture/economics reasoning

The reasoning layer may:

-   propose alternatives;
-   identify cost drivers;
-   identify margin exposure;
-   propose model routing;
-   propose different provider implementations;
-   identify assumptions that dominate the result;
-   require validation where evidence is insufficient.

It must not fabricate benchmark quality or provider facts.

A decision object should include:

-   decision;
-   selected alternative;
-   alternatives considered;
-   reasoning;
-   affected metrics;
-   confidence;
-   whether validation is required.

## 11. Commercial engine

The commercial engine reasons from technical cost structure toward a
commercial unit and pricing structure.

Initial supported structures:

-   subscription;
-   usage;
-   subscription + usage;
-   credits.

Then map the selected structure to existing Stripe capabilities.

Stripe is an implementation of the commercial architecture, not the
commercial architecture itself.

## 12. V1 deployment boundary

### Supported

-   AWS deployment only;
-   provider-neutral schema;
-   Stripe commercial implementation;
-   OpenAI, Anthropic, and/or supported Bedrock model paths as
    validated;
-   validated infrastructure/application modules;
-   explicit plan/review/apply flow;
-   short-lived/scoped AWS access rather than raw long-lived
    credentials.

### Not supported in V1

-   Azure deployment;
-   GCP deployment;
-   brownfield migration;
-   arbitrary existing-infrastructure analysis;
-   arbitrary generated Terraform;
-   Kubernetes optimization;
-   complex enterprise networking;
-   automatic compliance certification/design;
-   continuous production optimization;
-   automatic production model switching;
-   every AI workload;
-   every pricing structure;
-   every model benchmark;
-   a claim that generated systems are universally "production-ready."

## 13. Deployment contract

The reasoning system outputs an `ArchitectureSpec`.

The deployment engine should not perform open-ended architecture
reasoning. It maps the approved specification to validated modules,
configuration, Terraform/provider-native deployment, plan, approval,
apply, and health check.

## 14. Initial working application

The AGENT_SAAS reference deployment should ultimately demonstrate:

user signup → subscription/entitlement → AI agent use → model/tool
consumption → usage measurement → Stripe billing/allowance behavior.

## 15. V1 success criteria

V1 is successful if:

-   a sparse founder prompt can be converted into a useful structured
    workload;
-   adaptive questions materially improve the recommendation;
-   assumptions are visible and traceable;
-   architecture alternatives have explainable economic consequences;
-   the commercial model follows from the cost structure;
-   a real reference application can be deployed into a
    customer-controlled AWS account;
-   the output is more actionable than a generic LLM architecture
    answer.

V1 should be reconsidered if these benefits cannot be demonstrated
without excessive manual curation.
