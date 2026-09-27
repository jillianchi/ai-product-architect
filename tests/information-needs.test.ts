import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { analyzeInformationNeeds } from "../src/information-needs.js";
import { validateProductDesign } from "../src/validation.js";

function fixture(name: "devflow-sparse" | "devflow-rich"): Record<string, any> {
  const path = fileURLToPath(
    new URL(`../schemas/fixtures/${name}.json`, import.meta.url),
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("DevFlow information planning", () => {
  it("produces a small deterministic set of material needs for sparse DevFlow", () => {
    const needs = analyzeInformationNeeds(fixture("devflow-sparse"));

    expect(needs.map(({ id }) => id)).toEqual([
      "value-hypothesis-evidence",
      "incremental-demand-scenarios",
      "agent-execution-characteristics",
      "current-commercial-context",
    ]);
  });

  it("does not create needs for irrelevant absent fields", () => {
    const paths = analyzeInformationNeeds(fixture("devflow-sparse")).flatMap(
      ({ paths }) => paths,
    );

    expect(paths).not.toContain("/business/stage");
    expect(paths).not.toContain("/workload/storageGbMonth");
    expect(paths).not.toContain("/workload/modelRouting");
    expect(paths).not.toContain("/constraints/monthlyBudget");
    expect(paths).not.toContain("/constraints/excludedProviders");
  });

  it("resolves the value-evidence need when supporting evidence is added", () => {
    const design = fixture("devflow-sparse");
    design.opportunity.valueHypotheses[0].evidence = [
      {
        statement: "Customer interviews support willingness to evaluate a premium AI offering",
        kind: "evidence",
        provenance: "user",
        sourceReference: "fixture://devflow/new-customer-interviews",
      },
    ];

    expect(validateProductDesign(design).valid).toBe(true);
    expect(
      analyzeInformationNeeds(design).some(
        ({ id }) => id === "value-hypothesis-evidence",
      ),
    ).toBe(false);
  });

  it("resolves the economics-input need when explicit assumptions are added", () => {
    const design = fixture("devflow-sparse");
    design.workload.billableUsers = {
      value: 4000,
      provenance: "assumption",
      confidence: "low",
    };
    design.workload.agentTasksPerUserMonth = {
      value: 50,
      provenance: "assumption",
      confidence: "low",
    };

    expect(validateProductDesign(design).valid).toBe(true);
    expect(
      analyzeInformationNeeds(design).some(
        ({ id }) => id === "incremental-demand-scenarios",
      ),
    ).toBe(false);
  });

  it("can block economics without blocking architecture or opportunity analysis", () => {
    const need = analyzeInformationNeeds(fixture("devflow-sparse")).find(
      ({ id }) => id === "incremental-demand-scenarios",
    );

    expect(need?.blockingDecisionAreas).toEqual(["economics"]);
    expect(need?.blockingDecisionAreas).not.toContain("architecture");
    expect(need?.blockingDecisionAreas).not.toContain("opportunity");
  });

  it("limits unsupported value claims without globally blocking opportunity analysis", () => {
    const need = analyzeInformationNeeds(fixture("devflow-rich")).find(
      ({ id }) => id === "value-hypothesis-evidence",
    );

    expect(need?.affects).toContain("opportunity");
    expect(need?.blockingDecisionAreas).not.toContain("opportunity");
    expect(need?.blockingDecisionAreas).toEqual([]);
  });

  it("uses explicit execution mode rather than quantitative workload proxies", () => {
    const rich = fixture("devflow-rich");
    expect(
      analyzeInformationNeeds(rich).some(
        ({ id }) => id === "agent-execution-characteristics",
      ),
    ).toBe(false);

    delete rich.workload.executionMode;

    const need = analyzeInformationNeeds(rich).find(
      ({ id }) => id === "agent-execution-characteristics",
    );
    expect(rich.workload.toolCallsPerTask).toBeDefined();
    expect(rich.workload.computeSecondsPerTask).toBeDefined();
    expect(need?.paths).toEqual(["/workload/executionMode"]);
  });

  it("does not turn qualitative hypotheses into numeric assumptions", () => {
    const design = fixture("devflow-sparse");

    analyzeInformationNeeds(design);

    expect(design.workload.billableUsers).toBeUndefined();
    expect(design.workload.agentTasksPerUserMonth).toBeUndefined();
    expect(design.opportunity.valueHypotheses[0].hypothesis.kind).toBe(
      "hypothesis",
    );
  });

  it("produces materially fewer unresolved needs for rich DevFlow", () => {
    const sparseNeeds = analyzeInformationNeeds(fixture("devflow-sparse"));
    const richNeeds = analyzeInformationNeeds(fixture("devflow-rich"));

    expect(richNeeds.map(({ id }) => id)).toEqual([
      "value-hypothesis-evidence",
    ]);
    expect(richNeeds.length).toBeLessThan(sparseNeeds.length);
  });

  it("orders needs deterministically", () => {
    const design = fixture("devflow-sparse");
    const first = analyzeInformationNeeds(design).map(({ id }) => id);
    const second = analyzeInformationNeeds(design).map(({ id }) => id);

    expect(second).toEqual(first);
  });

  it("does not mutate ProductDesign", () => {
    const design = fixture("devflow-sparse");
    const before = structuredClone(design);

    analyzeInformationNeeds(design);

    expect(design).toEqual(before);
  });

  it("keeps unresolved acquisition routing honest", () => {
    const needs = analyzeInformationNeeds(fixture("devflow-sparse"));
    const evidence = needs.find(({ id }) => id === "value-hypothesis-evidence");
    const commercial = needs.find(({ id }) => id === "current-commercial-context");

    expect(evidence?.acquisition.status).toBe("unresolved");
    expect(commercial?.acquisition.status).toBe("unresolved");
  });
});
