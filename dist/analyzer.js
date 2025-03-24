"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleOverlapAnalyzer = void 0;
const css_1 = require("css");
class StyleOverlapAnalyzer {
    constructor(options) {
        this._options = options;
    }
    analyze(css) {
        var _a;
        const ast = (0, css_1.parse)(css);
        const selectors = new Map();
        (_a = ast.stylesheet) === null || _a === void 0 ? void 0 : _a.rules.forEach((rule) => {
            var _a, _b, _c;
            if (rule.type === 'rule') {
                const selectorText = ((_a = rule.selectors) === null || _a === void 0 ? void 0 : _a.join(', ')) || '';
                if ((_b = this._options.whitelist) === null || _b === void 0 ? void 0 : _b.includes(selectorText)) {
                    return;
                }
                const position = rule.position;
                const location = (_c = position === null || position === void 0 ? void 0 : position.start) === null || _c === void 0 ? void 0 : _c.line;
                if (selectors.has(selectorText)) {
                    const data = selectors.get(selectorText);
                    data.count++;
                    location && data.locations.push(location);
                }
                else {
                    selectors.set(selectorText, {
                        count: 1,
                        locations: location ? [location] : []
                    });
                }
            }
        });
        const duplicates = [];
        selectors.forEach((data, selector) => {
            if (data.count > 1) {
                duplicates.push(`Selector "${selector}" is repeated ${data.count} time(s)${data.locations.length ? `. Found at lines: ${data.locations.join(', ')}` : ''}`);
            }
        });
        return duplicates;
    }
}
exports.StyleOverlapAnalyzer = StyleOverlapAnalyzer;
