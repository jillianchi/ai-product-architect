import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";

const schemaPath = fileURLToPath(
  new URL("../schemas/product-design.schema.json", import.meta.url),
);
const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as object;

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateSchema = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject {
  return value as JsonObject;
}

function schemaError(error: ErrorObject): string {
  const path = error.instancePath || "/";
  return `${path} ${error.message ?? "is invalid"}`;
}

function factValue(container: JsonObject, key: string): unknown {
  const fact = container[key];
  return fact && typeof fact === "object" ? object(fact).value : undefined;
}

function sortedStrings(value: unknown): string[] {
  return Array.isArray(value) ? [...value].map(String).sort() : [];
}

function selectionKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((selection) => {
      const item = object(selection);
      const implementation = object(item.implementation);
      return `${String(item.capability)}:${String(implementation.value)}`;
    })
    .sort();
}

function sameStrings(left: unknown, right: unknown): boolean {
  return JSON.stringify(sortedStrings(left)) === JSON.stringify(sortedStrings(right));
}

function sameSelections(left: unknown, right: unknown): boolean {
  return JSON.stringify(selectionKeys(left)) === JSON.stringify(selectionKeys(right));
}

function moneyMinorUnits(scenario: JsonObject, key: string): number {
  const fact = object(scenario[key]);
  return Number(object(fact.value).minorUnits);
}

function moneyCurrency(scenario: JsonObject, key: string): string {
  const fact = object(scenario[key]);
  return String(object(fact.value).currency);
}

function validateRouting(workload: JsonObject): string[] {
  if (!Array.isArray(workload.modelRouting)) return [];

  const total = workload.modelRouting.reduce((sum: number, route) => {
    return sum + Number(factValue(object(route), "sharePercent"));
  }, 0);

  return Math.abs(total - 100) < 1e-9
    ? []
    : ["/workload/modelRouting sharePercent values must total 100"];
}

function validateArchitectureSpec(productDesign: JsonObject): string[] {
  const deployment = object(productDesign.deployment);
  if (deployment.status !== "approved") return [];

  const architecture = object(productDesign.architecture);
  const spec = object(deployment.architectureSpec);
  const errors: string[] = [];

  if (architecture.pattern !== spec.pattern) {
    errors.push("/deployment/architectureSpec/pattern must match architecture.pattern");
  }
  if (!sameStrings(architecture.requiredCapabilities, spec.capabilities)) {
    errors.push(
      "/deployment/architectureSpec/capabilities must match architecture.requiredCapabilities",
    );
  }
  if (!sameSelections(architecture.implementationSelections, spec.implementationSelections)) {
    errors.push(
      "/deployment/architectureSpec/implementationSelections must match architecture.implementationSelections",
    );
  }

  const constraints = object(productDesign.constraints);
  const cloud = factValue(constraints, "deploymentCloud");
  if (cloud !== undefined && cloud !== spec.targetCloud) {
    errors.push(
      "/deployment/architectureSpec/targetCloud must match constraints.deploymentCloud",
    );
  }

  if (Array.isArray(constraints.deploymentRegions)) {
    const constraintRegions = constraints.deploymentRegions.map((region) =>
      String(object(region).value),
    );
    if (!sameStrings(constraintRegions, spec.regions)) {
      errors.push(
        "/deployment/architectureSpec/regions must match constraints.deploymentRegions",
      );
    }
  }

  return errors;
}

function validateImplementationSelections(architecture: JsonObject): string[] {
  if (!Array.isArray(architecture.implementationSelections)) return [];

  const capabilities = new Set(sortedStrings(architecture.requiredCapabilities));
  const invalid = architecture.implementationSelections
    .map((selection) => String(object(selection).capability))
    .filter((capability) => !capabilities.has(capability));

  return invalid.length === 0
    ? []
    : [
        "/architecture/implementationSelections capabilities must be included in architecture.requiredCapabilities",
      ];
}

function validateEconomics(productDesign: JsonObject): string[] {
  const economics = object(productDesign.economics);
  if (!economics.scenarios) return [];

  const scenarios = object(economics.scenarios);
  const errors: string[] = [];
  const moneyKeys = [
    "monthlyRevenue",
    "modelCogs",
    "cloudCogs",
    "toolCogs",
    "paymentCosts",
    "totalCostToServe",
    "contribution",
    "unitRevenue",
    "unitCost",
  ];
  for (const name of ["low", "expected", "high"]) {
    const scenario = object(scenarios[name]);
    const currencies = new Set(moneyKeys.map((key) => moneyCurrency(scenario, key)));
    if (currencies.size !== 1) {
      errors.push(`/economics/scenarios/${name} monetary values must share a currency`);
    }

    const revenue = moneyMinorUnits(scenario, "monthlyRevenue");
    const total = moneyMinorUnits(scenario, "totalCostToServe");
    const calculatedTotal =
      moneyMinorUnits(scenario, "modelCogs") +
      moneyMinorUnits(scenario, "cloudCogs") +
      moneyMinorUnits(scenario, "toolCogs") +
      moneyMinorUnits(scenario, "paymentCosts");
    const contribution = moneyMinorUnits(scenario, "contribution");
    const margin = Number(factValue(scenario, "contributionMarginPercent"));

    if (total !== calculatedTotal) {
      errors.push(`/economics/scenarios/${name}/totalCostToServe is inconsistent`);
    }
    if (contribution !== revenue - total) {
      errors.push(`/economics/scenarios/${name}/contribution is inconsistent`);
    }
    const calculatedMargin = revenue === 0 ? 0 : (contribution / revenue) * 100;
    if (Math.abs(margin - calculatedMargin) > 0.01) {
      errors.push(`/economics/scenarios/${name}/contributionMarginPercent is inconsistent`);
    }

  }

  return errors;
}

export function validateProductDesign(data: unknown): ValidationResult {
  if (!validateSchema(data)) {
    return {
      valid: false,
      errors: (validateSchema.errors ?? []).map(schemaError),
    };
  }

  const productDesign = object(data);
  const workload = object(productDesign.workload);
  const architecture = object(productDesign.architecture);
  const errors = [
    ...validateRouting(workload),
    ...validateImplementationSelections(architecture),
    ...validateArchitectureSpec(productDesign),
    ...validateEconomics(productDesign),
  ];

  if (architecture.pattern !== undefined && architecture.pattern !== workload.pattern) {
    errors.push("/architecture/pattern must match workload.pattern");
  }

  return { valid: errors.length === 0, errors };
}
