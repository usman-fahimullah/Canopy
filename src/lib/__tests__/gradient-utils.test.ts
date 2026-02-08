import { describe, it, expect } from "vitest";
import {
  getCollectionGradient,
  getGradientFromPathways,
  getPathwayFamily,
  getPathwaysByFamily,
} from "../gradient-utils";

describe("getPathwayFamily", () => {
  it("maps agriculture to green", () => {
    expect(getPathwayFamily("agriculture")).toBe("green");
  });

  it("maps conservation to blue", () => {
    expect(getPathwayFamily("conservation")).toBe("blue");
  });

  it("maps construction to orange", () => {
    expect(getPathwayFamily("construction")).toBe("orange");
  });

  it("maps education to red", () => {
    expect(getPathwayFamily("education")).toBe("red");
  });

  it("maps energy to yellow", () => {
    expect(getPathwayFamily("energy")).toBe("yellow");
  });

  it("maps policy to purple", () => {
    expect(getPathwayFamily("policy")).toBe("purple");
  });
});

describe("getPathwaysByFamily", () => {
  it("returns green family pathways", () => {
    const green = getPathwaysByFamily("green");
    expect(green).toContain("agriculture");
    expect(green).toContain("finance");
    expect(green).toContain("forestry");
    expect(green).toContain("transportation");
    expect(green).toContain("waste-management");
  });

  it("returns blue family pathways", () => {
    const blue = getPathwaysByFamily("blue");
    expect(blue).toContain("conservation");
    expect(blue).toContain("research");
    expect(blue).toContain("water");
  });
});

describe("getCollectionGradient", () => {
  it("returns fallback for empty pathways", () => {
    expect(getCollectionGradient({ pathways: [] })).toBe("var(--gradient-green-100)");
  });

  it("returns same-family gradient for pathways in same family", () => {
    const result = getCollectionGradient({ pathways: ["energy", "technology"] });
    expect(result).toBe("var(--gradient-yellow-100)");
  });

  it("returns dual-family gradient for pathways in different families", () => {
    const result = getCollectionGradient({ pathways: ["agriculture", "energy"] });
    // green + yellow → sorted alphabetically: agriculture (green), energy (yellow)
    expect(result).toBe("var(--gradient-yellow-100)");
  });

  it("normalizes pathway order (alphabetical)", () => {
    const result1 = getCollectionGradient({ pathways: ["energy", "agriculture"] });
    const result2 = getCollectionGradient({ pathways: ["agriculture", "energy"] });
    expect(result1).toBe(result2);
  });

  it("handles single pathway", () => {
    const result = getCollectionGradient({ pathways: ["conservation"] });
    expect(result).toBe("var(--gradient-blue-100)");
  });

  it("returns a CSS variable string", () => {
    const result = getCollectionGradient({ pathways: ["construction", "water"] });
    expect(result).toMatch(/^var\(--gradient-/);
  });
});

describe("getGradientFromPathways", () => {
  it("filters out invalid pathways", () => {
    const result = getGradientFromPathways(["agriculture", "invalid", "energy"]);
    // Should ignore "invalid" and compute from agriculture (green) + energy (yellow)
    expect(result).toMatch(/^var\(--gradient-/);
  });

  it("returns fallback when all pathways are invalid", () => {
    expect(getGradientFromPathways(["invalid", "nope"])).toBe("var(--gradient-green-100)");
  });

  it("handles empty array", () => {
    expect(getGradientFromPathways([])).toBe("var(--gradient-green-100)");
  });
});
