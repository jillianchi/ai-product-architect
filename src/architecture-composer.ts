import { validateProductDesign } from "./validation.js";

export type ComposedCapability =
  | "agent_runtime"
  | "model_inference"
  | "repository_context_access"
  | "tool_execution"
  | "sandbox_compute"
  | "usage_tracking"
  | "entitlements";

interface ConclusionBase {
  id: string;
  status: "required" | "conditional" | "unresolved";
  reason: string;
  derivedFrom: string[];
}

export interface CapabilityConclusion extends ConclusionBase {
  kind: "capability";
  status: "required" | "conditional";
  capability: ComposedCapability;
}

export interface DecisionConclusion extends ConclusionBase {
  kind: "decision";
  requirement: string;
  alternatives?: string[];
  informationNeedId?: string;
}

export type ArchitectureConclusion = CapabilityConclusion | DecisionConclusion;

export interface ArchitectureComposition {
  pattern: "AGENT_SAAS";
  scope: "incremental";
  conclusions: ArchitectureConclusion[];
}

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject {
  return value as JsonObject;
}

function factValue(container: JsonObject, key: string): unknown {
  const fact = container[key];
  return fact && typeof fact === "object" ? object(fact).value : undefined;
}

function contextSourcePath(workload: JsonObject, source: string): string | undefined {
  if (!Array.isArray(workload.requiredContextSources)) return undefined;
  const index = workload.requiredContextSources.findIndex(
    (entry) => object(entry).value === source,
  );
  return index >= 0 ? `/workload/requiredContextSources/${index}` : undefined;
}

function assertValidProductDesign(productDesign: unknown): asserts productDesign is JsonObject {
  const result = validateProductDesign(productDesign);
  if (!result.valid) {
    throw new Error(`Invalid ProductDesign: ${result.errors.join("; ")}`);
  }
}

function capability(
  capabilityId: ComposedCapability,
  reason: string,
  derivedFrom: string[],
  status: "required" | "conditional" = "required",
): CapabilityConclusion {
  return {
    id: capabilityId,
    kind: "capability",
    capability: capabilityId,
    status,
    reason,
    derivedFrom,
  };
}

function executionConclusions(workload: JsonObject): ArchitectureConclusion[] {
  const executionMode = factValue(workload, "executionMode");
  const path = "/workload/executionMode";

  if (executionMode === undefined) {
    return [
      {
        id: "execution-mode",
        kind: "decision",
        status: "unresolved",
        requirement: "Determine how the agent may execute actions or code",
        reason:
          "Execution mode is absent, so tool use and isolation requirements cannot be selected honestly.",
        derivedFrom: [path],
        alternatives: [
          "advisory_only",
          "tool_use",
          "sandboxed_code_execution",
        ],
        informationNeedId: "agent-execution-characteristics",
      },
    ];
  }

  const decision: DecisionConclusion = {
    id: "execution-mode",
    kind: "decision",
    status: "required",
    requirement: `Honor the ${String(executionMode)} execution boundary`,
    reason: "The execution boundary is an explicit provenanced workload requirement.",
    derivedFrom: [path],
  };

  if (executionMode === "advisory_only") return [decision];

  const conclusions: ArchitectureConclusion[] = [
    decision,
    capability(
      "tool_execution",
      "The explicit execution mode permits the agent to invoke tools or actions.",
      [path],
    ),
  ];

  if (executionMode === "sandboxed_code_execution") {
    conclusions.push(
      capability(
        "sandbox_compute",
        "Sandboxed code execution requires isolated compute separate from the agent reasoning runtime.",
        [path],
      ),
    );
  }

  return conclusions;
}

function commercialConclusions(commercialModel: JsonObject): CapabilityConclusion[] {
  const structure = factValue(commercialModel, "structure");
  const conclusions: CapabilityConclusion[] = [];

  if (["usage", "subscription_usage", "credits"].includes(String(structure))) {
    conclusions.push(
      capability(
        "usage_tracking",
        "The proposed commercial structure would depend on measured consumption.",
        ["/commercialModel/structure"],
        "conditional",
      ),
    );
  }

  if (commercialModel.includedAllowance !== undefined) {
    conclusions.push(
      capability(
        "entitlements",
        "The assumed included allowance would require enforcing which consumption is included before overage applies.",
        ["/commercialModel/includedAllowance"],
        "conditional",
      ),
    );
  }

  return conclusions;
}

export function composeAgentSaasArchitecture(
  productDesign: unknown,
): ArchitectureComposition {
  assertValidProductDesign(productDesign);
  const workload = object(productDesign.workload);
  const commercialModel = object(productDesign.commercialModel);
  const repositorySourcePath = contextSourcePath(
    workload,
    "source_code_repository",
  );
  const conclusions: ArchitectureConclusion[] = [
    capability(
      "agent_runtime",
      "The structured workload is an AGENT_SAAS capability requiring an agent execution loop.",
      ["/workload/pattern"],
    ),
    capability(
      "model_inference",
      "The structured AGENT_SAAS workload requires model inference for agent reasoning.",
      ["/workload/pattern"],
    ),
  ];

  if (repositorySourcePath) {
    conclusions.push(
      capability(
        "repository_context_access",
        "The product explicitly requires repository context for the proposed agent capability.",
        [repositorySourcePath],
      ),
      {
        id: "repository-context-realization",
        kind: "decision",
        status: "unresolved",
        requirement: "Choose how repository context will be supplied to the agent",
        reason:
          "Repository context is required, but ProductDesign does not establish whether tool-based access, retrieval/indexing, or another context-construction mechanism is appropriate.",
        derivedFrom: [repositorySourcePath],
        alternatives: [
          "tool_based_repository_access",
          "retrieval_or_indexing",
          "request_time_context_construction",
        ],
        informationNeedId: "repository-context-realization",
      },
    );
  }

  conclusions.push(...executionConclusions(workload));

  conclusions.push(...commercialConclusions(commercialModel));

  return {
    pattern: "AGENT_SAAS",
    scope: "incremental",
    conclusions,
  };
}
