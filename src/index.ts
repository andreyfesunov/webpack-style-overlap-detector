import { Compilation, Compiler } from "webpack";
import { SODLogger, SODLogLevel } from "./logger";
import { StyleOverlapAnalyzer, StyleOverlapAnalyzerOptions } from "./analyzer";
import { CodeParserFactory, CodeParserMode, CodeParserOptions } from "./code_parser";

export interface StyleOverlapDetectorOptions extends StyleOverlapAnalyzerOptions, CodeParserOptions {
    readonly mode: SODLogLevel;
}

export class StyleOverlapDetector {
    private readonly _options: StyleOverlapDetectorOptions;
    private readonly _logger: SODLogger;
    private readonly _analyzer: StyleOverlapAnalyzer;

    public constructor(options: StyleOverlapDetectorOptions) {
        this._options = options;
        this._logger = new SODLogger(this._options.mode);
        this._analyzer = new StyleOverlapAnalyzer(this._options);
    }

    public apply(compiler: Compiler): void {
        compiler.hooks.thisCompilation.tap('StyleOverlapDetector', (compilation) => {
            compilation.hooks.processAssets.tap({
                name: 'StyleOverlapDetector',
                stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (assets) => {
                const parse_modes = this._options.parse_modes ?? [CodeParserMode.CSS];
                const parsers = parse_modes.map((mode) => CodeParserFactory.create(mode));
                const sources = parsers.map((parser) => parser.parse(assets));
                const duplicates = this._analyzer.analyze(sources.join('\n'));
                duplicates.forEach((duplicate) => {
                    this._logger.log(duplicate);
                });
            });
        });
    }
}