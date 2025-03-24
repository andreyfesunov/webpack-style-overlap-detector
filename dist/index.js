"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleOverlapDetector = void 0;
const webpack_1 = require("webpack");
const logger_1 = require("./logger");
const analyzer_1 = require("./analyzer");
class StyleOverlapDetector {
    constructor(options) {
        this._options = options;
        this._logger = new logger_1.SODLogger(this._options.mode);
        this._analyzer = new analyzer_1.StyleOverlapAnalyzer(this._options);
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('StyleOverlapDetector', (compilation) => {
            compilation.hooks.processAssets.tap({
                name: 'StyleOverlapDetector',
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (assets) => {
                const cssFiles = Object.keys(assets).filter((asset) => asset.endsWith('.css'));
                const sources = cssFiles.map((file) => assets[file]);
                const duplicates = this._analyzer.analyze(sources.join('\n'));
                duplicates.forEach((duplicate) => {
                    this._logger.log(duplicate);
                });
            });
        });
    }
}
exports.StyleOverlapDetector = StyleOverlapDetector;
