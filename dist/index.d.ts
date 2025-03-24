import { Compiler } from "webpack";
import { SODLogLevel } from "./logger";
import { StyleOverlapAnalyzerOptions } from "./analyzer";
export interface StyleOverlapDetectorOptions extends StyleOverlapAnalyzerOptions {
    readonly mode: SODLogLevel;
}
export declare class StyleOverlapDetector {
    private readonly _options;
    private readonly _logger;
    private readonly _analyzer;
    constructor(options: StyleOverlapDetectorOptions);
    apply(compiler: Compiler): void;
}
