import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  composeAgentSaasArchitecture,
  type ArchitectureComposition,
} from "../src/architecture-composer.js";

function fixture(name: "devflow-sparse" | "devflow-rich"): Record<string, any> {
  const path = fileURLToPath(
    new URL(`../schemas/fixtures/${name}.json`, import.meta.url),
  );
  return JSON.parse(readFileSync(path, "utf8"));
}

function capabilities(composition: ArchitectureComposition): string[] {
  return composition.conclusions.flatMap((conclusion) =>
    conclusion.kind === "capability" ? [conclusion.capability] : [],
  );
}

function decisions(composition: ArchitectureComposition): string[] {
  return composition.conclusions.flatMap((conclusion) =>
    conclusion.kind === "decision" ? [conclusion.id] : [],
  );
}

describe("AGENT_SAAS architecture composition", () => {
  it("composes rich DevFlow deterministically from populated requirements", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-rich"));

    expect(capabilities(composition)).toEqual([
      "agent_runtime",
      "model_inference",
      "repository_context_access",
      "tool_execution",
      "sandbox_compute",
      "usage_tracking",
      "entitlements",
    ]);
    expect(decisions(composition)).toContain("repository-context-realization");
  });

  it("does not give sparse DevFlow an unsupported complete architecture", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-sparse"));

    expect(capabilities(composition)).toEqual([
      "agent_runtime",
      "model_inference",
      "repository_context_access",
    ]);
    expect(decisions(composition)).toEqual([
      "repository-context-realization",
      "execution-mode",
    ]);
  });

  it("requires isolated compute for sandboxed code execution", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-rich"));

    expect(capabilities(composition)).toContain("tool_execution");
    expect(capabilities(composition)).toContain("sandbox_compute");
  });

  it("tool use requires tool execution but not sandbox compute", () => {
    const design = fixture("devflow-rich");
    design.workload.executionMode.value = "tool_use";

    const result = capabilities(composeAgentSaasArchitecture(design));
    expect(result).toContain("tool_execution");
    expect(result).not.toContain("sandbox_compute");
  });

  it("advisory-only behavior requires neither tools nor sandbox compute", () => {
    const design = fixture("devflow-rich");
    design.workload.executionMode.value = "advisory_only";

    const result = capabilities(composeAgentSaasArchitecture(design));
    expect(result).not.toContain("tool_execution");
    expect(result).not.toContain("sandbox_compute");
  });

  it("changes output when a relevant requirement is removed", () => {
    const design = fixture("devflow-rich");
    delete design.workload.executionMode;

    const composition = composeAgentSaasArchitecture(design);
    expect(capabilities(composition)).not.toContain("sandbox_compute");
    expect(
      composition.conclusions.find(({ id }) => id === "execution-mode"),
    ).toMatchObject({
      kind: "decision",
      status: "unresolved",
      informationNeedId: "agent-execution-characteristics",
    });
  });

  it("does not translate repository awareness directly into retrieval", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-rich"));
    const contextDecision = composition.conclusions.find(
      ({ id }) => id === "repository-context-realization",
    );

    expect(capabilities(composition)).toContain("repository_context_access");
    expect(capabilities(composition)).not.toContain("retrieval");
    expect(contextDecision).toMatchObject({
      kind: "decision",
      status: "unresolved",
      informationNeedId: "repository-context-realization",
    });
  });

  it("removes repository context when the structured requirement is false", () => {
    const design = fixture("devflow-rich");
    design.workload.requiredContextSources = [];

    const composition = composeAgentSaasArchitecture(design);
    expect(capabilities(composition)).not.toContain("repository_context_access");
    expect(decisions(composition)).not.toContain("repository-context-realization");
  });

  it("does not treat unrelated context sources as repository access", () => {
    const design = fixture("devflow-rich");
    design.workload.requiredContextSources = [
      { value: "customer_history", provenance: "user" },
    ];

    const composition = composeAgentSaasArchitecture(design);
    expect(capabilities(composition)).not.toContain("repository_context_access");
    expect(decisions(composition)).not.toContain("repository-context-realization");
  });

  it("does not infer runtime model routing from economic distribution assumptions", () => {
    const design = fixture("devflow-rich");
    expect(design.workload.modelRouting).toBeDefined();

    expect(
      capabilities(composeAgentSaasArchitecture(design)),
    ).not.toContain("model_routing");
  });

  it("keeps usage billing out of technical architecture composition", () => {
    const design = fixture("devflow-rich");
    expect(design.commercialModel.structure.value).toBe("subscription_usage");

    expect(
      capabilities(composeAgentSaasArchitecture(design)),
    ).not.toContain("usage_billing");
  });

  it("contains no provider service names as capability identifiers", () => {
    const result = capabilities(
      composeAgentSaasArchitecture(fixture("devflow-rich")),
    );

    expect(result.join(" ")).not.toMatch(
      /AWS|Lambda|Bedrock|ECS|EKS|S3|DynamoDB|OpenAI|Anthropic|Stripe/i,
    );
  });

  it("does not mutate ProductDesign", () => {
    const design = fixture("devflow-rich");
    const before = structuredClone(design);

    composeAgentSaasArchitecture(design);

    expect(design).toEqual(before);
  });

  it("returns identical output for repeated composition", () => {
    const design = fixture("devflow-rich");

    expect(composeAgentSaasArchitecture(design)).toEqual(
      composeAgentSaasArchitecture(design),
    );
  });

  it("gives every conclusion a traceable source path", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-rich"));

    for (const conclusion of composition.conclusions) {
      expect(conclusion.reason.length).toBeGreaterThan(0);
      expect(conclusion.derivedFrom.length).toBeGreaterThan(0);
    }
  });

  it("keeps proposed-commercial capabilities conditional", () => {
    const composition = composeAgentSaasArchitecture(fixture("devflow-rich"));
    const statuses = Object.fromEntries(
      composition.conclusions
        .filter((conclusion) => conclusion.kind === "capability")
        .map((conclusion) => [conclusion.capability, conclusion.status]),
    );

    expect(statuses.usage_tracking).toBe("conditional");
    expect(statuses.entitlements).toBe("conditional");
    expect(statuses.sandbox_compute).toBe("required");
  });
});
