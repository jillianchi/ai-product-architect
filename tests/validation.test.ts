import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { validateProductDesign } from "../src/validation.js";

function fixture(name: string): Record<string, any> {
  const path = fileURLToPath(
    new URL(`../schemas/fixtures/${name}.json`, import.meta.url),
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("ProductDesign validation", () => {
  it("accepts the sparse canonical founder prompt without invented assumptions", () => {
    const sparse = fixture("agent-saas-sparse");

    expect(validateProductDesign(sparse)).toEqual({ valid: true, errors: [] });
    expect(sparse.workload).toEqual({ pattern: "AGENT_SAAS" });
    expect(sparse.economics).toEqual({});
  });

  it("accepts a complete AGENT_SAAS design", () => {
    expect(validateProductDesign(fixture("agent-saas-complete"))).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("uses absence for unknown values and rejects null", () => {
    const sparse = fixture("agent-saas-sparse");
    sparse.workload.billableUsers = null;

    expect(validateProductDesign(sparse).valid).toBe(false);
  });

  it("requires an assumption to have an explicit value", () => {
    const complete = fixture("agent-saas-complete");
    delete complete.architecture.assumptions[0].value;

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("does not allow a non-assumption provenance on an assumption", () => {
    const complete = fixture("agent-saas-complete");
    complete.architecture.assumptions[0].provenance = "user";

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("requires low, expected, and high scenarios together", () => {
    const complete = fixture("agent-saas-complete");
    delete complete.economics.scenarios.high;

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("requires derived provenance for economics outputs", () => {
    const complete = fixture("agent-saas-complete");
    complete.economics.scenarios.expected.modelCogs.provenance = "assumption";

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("checks economics arithmetic deterministically", () => {
    const complete = fixture("agent-saas-complete");
    complete.economics.scenarios.expected.totalCostToServe.value.minorUnits += 1;

    const result = validateProductDesign(complete);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "/economics/scenarios/expected/totalCostToServe is inconsistent",
    );
  });

  it("represents a negative contribution margin", () => {
    const complete = fixture("agent-saas-complete");
    const high = complete.economics.scenarios.high;
    high.modelCogs.value.minorUnits = 170000;
    high.totalCostToServe.value.minorUnits = 222000;
    high.contribution.value.minorUnits = -22000;
    high.contributionMarginPercent.value = -11;
    high.unitCost.value.minorUnits = 2220;

    expect(validateProductDesign(complete)).toEqual({ valid: true, errors: [] });
  });

  it("requires model-routing shares to total 100", () => {
    const complete = fixture("agent-saas-complete");
    complete.workload.modelRouting[0].sharePercent.value = 70;

    expect(validateProductDesign(complete).errors).toContain(
      "/workload/modelRouting sharePercent values must total 100",
    );
  });

  it("requires an approved deployment to contain an ArchitectureSpec", () => {
    const complete = fixture("agent-saas-complete");
    delete complete.deployment.architectureSpec;

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("keeps ArchitectureSpec derived from selected architecture", () => {
    const complete = fixture("agent-saas-complete");
    complete.deployment.architectureSpec.capabilities.pop();

    expect(validateProductDesign(complete).errors).toContain(
      "/deployment/architectureSpec/capabilities must match architecture.requiredCapabilities",
    );
  });

  it("only selects implementations for required capabilities", () => {
    const complete = fixture("agent-saas-complete");
    complete.architecture.implementationSelections[0].capability = "object_storage";

    expect(validateProductDesign(complete).errors).toContain(
      "/architecture/implementationSelections capabilities must be included in architecture.requiredCapabilities",
    );
  });

  it("rejects non-AWS deployment targets in V1", () => {
    const complete = fixture("agent-saas-complete");
    complete.deployment.architectureSpec.targetCloud = "GCP";

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("rejects provider services as capability identifiers", () => {
    const complete = fixture("agent-saas-complete");
    complete.architecture.requiredCapabilities.push("AWS Lambda");

    expect(validateProductDesign(complete).valid).toBe(false);
  });

  it("rejects unknown fields instead of silently expanding the contract", () => {
    const sparse = fixture("agent-saas-sparse");
    sparse.workload.anticipatedFutureDimension = {
      value: 1,
      provenance: "assumption",
    };

    expect(validateProductDesign(sparse).valid).toBe(false);
  });
});
