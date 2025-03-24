import { Compilation, Compiler } from "webpack";
import { SODLogger, SODLogLevel } from "./logger";
import { StyleOverlapAnalyzer, StyleOverlapAnalyzerOptions } from "./analyzer";

export interface StyleOverlapDetectorOptions extends StyleOverlapAnalyzerOptions {
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
                const cssFiles = Object.keys(assets).filter((asset) => asset.endsWith('.css'));
                const sources = cssFiles.map((file) => assets[file].source().toString());

                const duplicates = this._analyzer.analyze(sources.join('\n'));

                duplicates.forEach((duplicate) => {
                    this._logger.log(duplicate);
                });
            });
        });
    }
}