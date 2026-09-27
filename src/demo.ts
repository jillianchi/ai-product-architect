import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  analyzeInformationNeeds,
  type AcquisitionMethod,
  type DecisionArea,
  type InformationNeed,
} from "./information-needs.js";

type JsonObject = Record<string, any>;

const decisionAreas: Array<[DecisionArea, string]> = [
  ["opportunity", "Opportunity"],
  ["architecture", "Architecture"],
  ["economics", "Economics"],
  ["commercial_model", "Commercial model"],
  ["deployment", "Deployment"],
];

const methodLabels: Record<AcquisitionMethod, string> = {
  research: "Research",
  ask_user: "Ask the current user",
  customer_discovery: "Customer discovery",
  scenario_model: "Scenario modelling with explicit assumptions",
  defer: "Defer",
};

function loadFixture(name: "devflow-sparse" | "devflow-rich"): JsonObject {
  const path = fileURLToPath(
    new URL(`../schemas/fixtures/${name}.json`, import.meta.url),
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

function factValue(fact: JsonObject | undefined): unknown {
  return fact?.value;
}

function displayValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") {
    const money = value as JsonObject;
    if (typeof money.minorUnits === "number" && typeof money.currency === "string") {
      return `${money.currency} ${(money.minorUnits / 100).toFixed(2)}`;
    }
  }
  return String(value);
}

function factLabel(fact: JsonObject): string {
  const provenance = String(fact.provenance).replaceAll("_", " ").toUpperCase();
  const confidence = fact.confidence
    ? `, ${String(fact.confidence).toUpperCase()} CONFIDENCE`
    : "";
  return `${displayValue(fact.value)} [${provenance}${confidence}]`;
}

function line(label: string, value: string): void {
  console.log(`- ${label}: ${value}`);
}

function printOpportunity(design: JsonObject): void {
  const business = design.business as JsonObject;
  const opportunity = design.opportunity as JsonObject;

  console.log("PRODUCT / OPPORTUNITY");
  line("Organization", factLabel(business.organizationName));
  line("Existing product", factLabel(business.productDescription));
  if (business.targetCustomer) line("Customers", factLabel(business.targetCustomer));
  line("Proposed change", factLabel(opportunity.proposedChange));
}

function printEntry(entry: JsonObject, prefix = ""): void {
  const kind = String(entry.kind).toUpperCase();
  const confidence = entry.confidence
    ? ` | Confidence: ${String(entry.confidence)}`
    : "";
  const source = entry.sourceReference
    ? ` | Source: ${String(entry.sourceReference)}`
    : "";
  console.log(
    `- ${prefix}[${kind} · ${String(entry.provenance).toUpperCase()}] ${String(entry.statement)}${confidence}${source}`,
  );
}

function printHypotheses(design: JsonObject): void {
  const opportunity = design.opportunity as JsonObject;
  console.log("\nWHY CHANGE / VALUE HYPOTHESES");

  const whyChange = Array.isArray(opportunity.whyChange)
    ? opportunity.whyChange
    : [];
  if (whyChange.length > 0) {
    console.log("Why change:");
    for (const entry of whyChange) {
      printEntry(entry);
      if (entry.kind === "hypothesis") {
        console.log("  Supporting evidence: not explicitly linked");
      }
    }
  } else {
    console.log("Why change: unknown");
  }

  const whyNow = Array.isArray(opportunity.whyNow) ? opportunity.whyNow : [];
  if (whyNow.length > 0) {
    console.log("Why now:");
    for (const entry of whyNow) printEntry(entry);
  } else {
    console.log("Why now: unknown");
  }

  const valueHypotheses = Array.isArray(opportunity.valueHypotheses)
    ? opportunity.valueHypotheses
    : [];
  if (valueHypotheses.length > 0) {
    console.log("Customer-value hypotheses:");
    for (const valueHypothesis of valueHypotheses) {
      const hypothesis = valueHypothesis.hypothesis as JsonObject;
      printEntry(hypothesis, `${String(valueHypothesis.category).toUpperCase()} · `);
      const evidence = Array.isArray(valueHypothesis.evidence)
        ? valueHypothesis.evidence
        : [];
      console.log(
        `  Supporting evidence: ${evidence.length > 0 ? `yes (${evidence.length})` : "no"}`,
      );
      for (const entry of evidence) printEntry(entry, "SUPPORT · ");
    }
  } else {
    console.log("Customer-value hypotheses: unknown");
  }
}

function printKnown(design: JsonObject): void {
  const business = design.business as JsonObject;
  const workload = design.workload as JsonObject;
  const constraints = design.constraints as JsonObject;
  const economics = design.economics as JsonObject;
  const commercial = design.commercialModel as JsonObject;
  const deployment = design.deployment as JsonObject;

  console.log("\nWHAT WE CURRENTLY KNOW");
  line("Workload pattern", String(workload.pattern));
  if (business.currentCommercialModel) {
    line("Current commercial model", factLabel(business.currentCommercialModel));
  }
  if (workload.billableUsers) {
    line("Adopted AI users", factLabel(workload.billableUsers));
  }
  if (workload.agentTasksPerUserMonth) {
    line("Tasks per user/month", factLabel(workload.agentTasksPerUserMonth));
  }
  if (workload.executionMode) {
    line("Execution mode", factLabel(workload.executionMode));
  }
  if (workload.toolCallsPerTask) {
    line("Tool calls per task", factLabel(workload.toolCallsPerTask));
  }
  if (workload.computeSecondsPerTask) {
    line("Compute seconds per task", factLabel(workload.computeSecondsPerTask));
  }
  if (constraints.deploymentCloud) {
    line("Deployment cloud", factLabel(constraints.deploymentCloud));
  }
  if (Array.isArray(constraints.deploymentRegions)) {
    line(
      "Deployment regions",
      constraints.deploymentRegions.map(factLabel).join(", "),
    );
  }
  line("Economics scope", String(economics.scope));
  if (economics.scenarios) {
    const expected = (economics.scenarios as JsonObject).expected as JsonObject;
    line("Expected incremental revenue", factLabel(expected.monthlyRevenue));
    line("Expected incremental cost", factLabel(expected.totalCostToServe));
    line(
      "Expected contribution margin",
      `${displayValue(factValue(expected.contributionMarginPercent))}% [DERIVED]`,
    );
  }
  if (commercial.structure) {
    line("Proposed commercial structure", factLabel(commercial.structure));
  }
  if (commercial.price) line("Proposed price", factLabel(commercial.price));
  line("Deployment status", String(deployment.status));
}

function acquisitionLabel(need: InformationNeed): string {
  if (need.acquisition.status === "recommended") {
    return methodLabels[need.acquisition.method];
  }
  return `Unresolved routing — ${need.acquisition.candidates
    .map((method) => methodLabels[method])
    .join(" / ")} (${need.acquisition.reason})`;
}

function printNeeds(needs: InformationNeed[]): void {
  console.log("\nWHAT WE NEED TO LEARN");
  if (needs.length === 0) {
    console.log("- No material unresolved information needs.");
    return;
  }

  for (const need of needs) {
    console.log(`- ${need.id} [${need.materiality.toUpperCase()}]`);
    console.log(`  Needed: ${need.summary}`);
    console.log(`  Why: ${need.why}`);
    console.log(`  Acquisition: ${acquisitionLabel(need)}`);
    console.log(`  Affects: ${need.affects.join(", ")}`);
    console.log(
      `  Blocks meaningful progress: ${
        need.blockingDecisionAreas.length > 0
          ? need.blockingDecisionAreas.join(", ")
          : "nothing; unsupported claims must still remain hypotheses"
      }`,
    );
  }
}

function printProgress(needs: InformationNeed[]): void {
  console.log("\nWHAT CAN PROCEED");
  for (const [area, label] of decisionAreas) {
    const blockers = needs
      .filter(({ blockingDecisionAreas }) => blockingDecisionAreas.includes(area))
      .map(({ id }) => id);
    console.log(
      blockers.length === 0
        ? `- ✓ ${label}: can proceed meaningfully`
        : `- ✗ ${label}: blocked by ${blockers.join(", ")}`,
    );
  }
}

function printCase(title: string, design: JsonObject): InformationNeed[] {
  const needs = analyzeInformationNeeds(design);
  console.log("=".repeat(80));
  console.log(title);
  console.log("=".repeat(80));
  printOpportunity(design);
  printHypotheses(design);
  printKnown(design);
  printNeeds(needs);
  printProgress(needs);
  console.log();
  return needs;
}

const sparseNeeds = printCase("SPARSE DEVFLOW", loadFixture("devflow-sparse"));
const richNeeds = printCase("RICH DEVFLOW", loadFixture("devflow-rich"));

console.log("=".repeat(80));
console.log("COMPARISON");
console.log("=".repeat(80));
console.log(`- Sparse unresolved material needs: ${sparseNeeds.length}`);
console.log(`- Rich unresolved material needs: ${richNeeds.length}`);
console.log(
  `- Resolved as information was added: ${sparseNeeds
    .filter(({ id }) => !richNeeds.some((rich) => rich.id === id))
    .map(({ id }) => id)
    .join(", ")}`,
);
