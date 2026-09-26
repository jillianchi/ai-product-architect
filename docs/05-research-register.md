# AI Product Architect --- Research Register

**Status:** living evidence index\
**Last updated:** 26 September 2026

This register records research that can become stale. It is not a
substitute for re-checking authoritative sources before customer-facing
recommendations.

  ------------------------------------------------------------------------------------------
  Topic              Discovery finding       Evidence status   Action before
                                                               implementation/publication
  ------------------ ----------------------- ----------------- -----------------------------
  Generic            Multiple tools already  Validated         Re-check named competitors
  architecture       offer natural-language  directionally     before external competitive
  competitors        architecture, IaC, cost during discovery  claims
                     estimation and/or                         
                     deployment                                

  AWS GAAB           Useful AWS              Validated during  Re-check current GAAB
                     accelerator/reference   discovery         capabilities/API/deployment
                     implementation; not the                   model before integration
                     product ontology                          

  AWS pricing data   Public pricing          Validated         Select authoritative
                     mechanisms exist        directionally     API/source and implement
                                                               retrieval/cache strategy

  Azure pricing data Retail pricing          Validated         Defer implementation;
                     mechanisms exist        directionally     re-check when Azure support
                                                               is planned

  GCP pricing data   Cloud billing/catalog   Validated         Defer implementation;
                     mechanisms exist        directionally     re-check when GCP support is
                                                               planned

  AWS Textract       Purpose-built invoice   Example price was Verify current ap-southeast-1
  AnalyzeExpense     extraction; prior       illustrative, not availability and applicable
                     public example used     verified          price before use
                     page-based pricing      Singapore quote   

  Azure Document     Prebuilt invoice        Validated         Re-check current
  Intelligence       extraction exists       directionally     model/features/pricing if
                                                               used

  GCP Document AI    Purpose-built invoice   Validated         Re-check current price,
  Invoice Parser     extraction exists;      directionally     page-count definition and
                     billing unit differs                      region support
                     from page-based                           
                     examples                                  

  OpenAI             Token-priced model      Pricing is        Retrieve current official
  multimodal/model   paths can make LLM      time-sensitive    model pricing at
  pricing            extraction economically                   runtime/build time
                     plausible                                 

  Anthropic model    Model tier can          Pricing is        Retrieve current official
  pricing            materially affect agent time-sensitive    pricing and supported
                     COGS                                      regional path

  Gemini model       Lower-cost multimodal   Pricing is        Retrieve current official
  pricing            tiers can be            time-sensitive    pricing if included in
                     economically                              comparison
                     significant                               

  AI invoice token   4k input + 700 output   **Assumption      Benchmark representative
  profile            tokens/invoice used in  only**            invoices; never present as
                     one sensitivity pass                      universal

  Coding-agent token 12k input + 2.5k output **Assumption      Replace with
  profile            tokens/task used in     only**            benchmark/observed
                     sensitivity analysis                      distribution when prototype
                                                               exists

  Stripe usage       Existing primitives     Validated         Re-check current APIs, limits
  billing/meters     support usage/hybrid    directionally     and pricing before
                     billing patterns                          implementation

  Stripe/Warp case   Public case study       Relevant          Re-open current official case
  study              supported               discovery         study before external
                     subscription + included evidence          citation
                     usage + metered-overage                   
                     reasoning                                 

  Data residency     "Singapore" can mean    Validated         Model these as separate
                     storage, processing, or conceptual        constraints; verify provider
                     infrastructure location requirement       support live
                     and these differ by                       
                     provider                                  

  Customer discounts Public list pricing     Known limitation  Show pricing
                     does not represent                        provenance/assumptions and
                     negotiated enterprise                     allow overrides later
                     pricing                                   

  Human review       Review cost can         Economic          Include as workload/economics
                     dominate raw inference  hypothesis        input where applicable
                     savings                 demonstrated      
                                             mathematically    

  Cost per           More decision-useful    Product           Validate with invoice
  successful unit    than raw API-call cost  hypothesis        benchmark workflow
                     when quality differs                      

  Cloud account      Deployment should use   Design            Define concrete AWS
  access             scoped/short-lived      requirement       bootstrap/trust pattern
                     access and review/apply                   before deployment code
  ------------------------------------------------------------------------------------------

## Evidence labels

**Validated directionally** --- sufficient for product/discovery
decisions, but must be re-verified before a current external factual
claim.

**Illustrative / assumption** --- used to test product logic. It must
not be promoted to a factual benchmark.

**Current provider fact** --- should only be used when retrieved from an
authoritative current source with a verification timestamp.

## Maintenance rule

Whenever a provider fact materially changes an architecture or economics
recommendation, record:

-   source;
-   retrieval/verification date;
-   region if applicable;
-   pricing unit;
-   assumptions;
-   whether negotiated pricing may override it.

This register should remain short. Detailed raw research belongs in
source notes or implementation tests, not here.
