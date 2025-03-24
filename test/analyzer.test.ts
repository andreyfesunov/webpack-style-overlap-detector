import { StyleOverlapAnalyzer } from "../src/analyzer";

describe("CSS Analyzer", () => {
    test("Detects duplicate selectors", () => {
        const cssCode = `
      .btn { color: red; }
      .btn { color: blue; }
    `;
        const result = new StyleOverlapAnalyzer({}).analyze(cssCode);

        expect(result.length).toBe(1);
    });

    test("Ignores selectors from safelist", () => {
        const cssCode = `
      .btn { color: red; }
      .btn { color: blue; }
    `;
        const result = new StyleOverlapAnalyzer({
            whitelist: ['.btn']
        }).analyze(cssCode);

        expect(result.length).toBe(0);
    });

    test("Handles empty CSS gracefully", () => {
        const result = new StyleOverlapAnalyzer({}).analyze("");

        expect(result.length).toBe(0);
    });
});
