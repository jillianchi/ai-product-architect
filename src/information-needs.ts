import { validateProductDesign } from "./validation.js";

export type DecisionArea =
  | "opportunity"
  | "architecture"
  | "economics"
  | "commercial_model"
  | "deployment";

export type AcquisitionMethod =
  | "research"
  | "ask_user"
  | "customer_discovery"
  | "scenario_model"
  | "defer";

export type AcquisitionRecommendation =
  | {
      status: "recommended";
      method: AcquisitionMethod;
    }
  | {
      status: "unresolved";
      candidates: AcquisitionMethod[];
      reason: string;
    };

export interface InformationNeed {
  id: string;
  summary: string;
  paths: string[];
  why: string;
  affects: DecisionArea[];
  acquisition: AcquisitionRecommendation;
  blockingDecisionAreas: DecisionArea[];
  materiality: "high" | "medium";
}

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject {
  return value as JsonObject;
}

function assertValidProductDesign(productDesign: unknown): asserts productDesign is JsonObject {
  const result = validateProductDesign(productDesign);
  if (!result.valid) {
    throw new Error(`Invalid ProductDesign: ${result.errors.join("; ")}`);
  }
}

function hasPath(productDesign: JsonObject, path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  let current: unknown = productDesign;

  for (const segment of segments) {
    if (
      current === null ||
      typeof current !== "object" ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return false;
    }
    current = object(current)[segment];
  }

  return true;
}

function unsupportedValueHypothesisPaths(productDesign: JsonObject): string[] {
  const opportunity = object(productDesign.opportunity);
  if (!Array.isArray(opportunity.valueHypotheses)) return [];

  return opportunity.valueHypotheses.flatMap((valueHypothesis, index) => {
    const evidence = object(valueHypothesis).evidence;
    return Array.isArray(evidence) && evidence.length > 0
      ? []
      : [`/opportunity/valueHypotheses/${index}/evidence`];
  });
}

function unresolvedPaths(productDesign: JsonObject, paths: string[]): string[] {
  return paths.filter((path) => !hasPath(productDesign, path));
}

export function analyzeInformationNeeds(productDesign: unknown): InformationNeed[] {
  assertValidProductDesign(productDesign);
  const needs: InformationNeed[] = [];

  const evidencePaths = unsupportedValueHypothesisPaths(productDesign);
  if (evidencePaths.length > 0) {
    needs.push({
      id: "value-hypothesis-evidence",
      summary: "Evidence supporting the customer-value hypotheses is insufficient.",
      paths: evidencePaths,
      why: "The opportunity should not be treated as established customer value until its value hypotheses have supporting evidence.",
      affects: ["opportunity", "commercial_model"],
      acquisition: {
        status: "unresolved",
        candidates: ["research", "ask_user", "customer_discovery"],
        reason:
          "The appropriate source depends on whether relevant evidence is public, already known by the current operator, or must be discovered with customers.",
      },
      blockingDecisionAreas: [],
      materiality: "high",
    });
  }

  const demandPaths = unresolvedPaths(productDesign, [
    "/workload/billableUsers",
    "/workload/agentTasksPerUserMonth",
  ]);
  if (demandPaths.length > 0) {
    needs.push({
      id: "incremental-demand-scenarios",
      summary: "Incremental adoption or task-frequency inputs are missing.",
      paths: demandPaths,
      why: "Deterministic incremental revenue and cost scenarios require explicit adopted-user and usage values.",
      affects: ["economics", "commercial_model"],
      acquisition: {
        status: "recommended",
        method: "scenario_model",
      },
      blockingDecisionAreas: ["economics"],
      materiality: "high",
    });
  }

  const executionPaths = unresolvedPaths(productDesign, [
    "/workload/executionMode",
  ]);
  if (executionPaths.length > 0) {
    needs.push({
      id: "agent-execution-characteristics",
      summary: "The agent's required execution mode is not established.",
      paths: executionPaths,
      why: "Advisory-only behavior, ordinary tool use, and sandboxed code execution require materially different runtime, isolation, and deployment capabilities.",
      affects: ["architecture", "economics", "deployment"],
      acquisition: {
        status: "unresolved",
        candidates: ["ask_user", "customer_discovery"],
        reason:
          "ProductDesign does not state whether the current operator can answer how the proposed capability should execute code and tools.",
      },
      blockingDecisionAreas: ["architecture", "deployment"],
      materiality: "high",
    });
  }

  if (!hasPath(productDesign, "/business/currentCommercialModel")) {
    needs.push({
      id: "current-commercial-context",
      summary: "The existing product's commercial model is unknown.",
      paths: ["/business/currentCommercialModel"],
      why: "A proposed add-on, allowance, or usage model cannot be evaluated honestly without understanding the current customer charge and commercial relationship.",
      affects: ["economics", "commercial_model"],
      acquisition: {
        status: "unresolved",
        candidates: ["ask_user", "customer_discovery"],
        reason:
          "The appropriate route depends on whether the current operator knows the existing commercial model.",
      },
      blockingDecisionAreas: ["commercial_model"],
      materiality: "medium",
    });
  }

  return needs;
}
