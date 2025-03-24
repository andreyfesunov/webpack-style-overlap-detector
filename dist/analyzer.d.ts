export interface StyleOverlapAnalyzerOptions {
    readonly whitelist?: readonly string[];
}
export declare class StyleOverlapAnalyzer {
    private readonly _options;
    constructor(options: StyleOverlapAnalyzerOptions);
    analyze(css: string): readonly string[];
}
