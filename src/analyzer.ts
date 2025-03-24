import { parse } from 'css';

export interface StyleOverlapAnalyzerOptions {
    readonly whitelist?: readonly string[];
}

export class StyleOverlapAnalyzer {
    private readonly _options: StyleOverlapAnalyzerOptions;

    public constructor(options: StyleOverlapAnalyzerOptions) {
        this._options = options;
    }

    public analyze(css: string): readonly string[] {
        const ast = parse(css);
        const selectors = new Map<string, { count: number; locations: number[] }>();

        ast.stylesheet?.rules.forEach((rule) => {
            if (rule.type === 'rule') {
                const ruleSelectors = rule.selectors || [];

                ruleSelectors.forEach((selector) => {
                    if (this._options.whitelist?.includes(selector)) {
                        return;
                    }

                    const position = rule.position;
                    const location = position?.start?.line;

                    if (selectors.has(selector)) {
                        const data = selectors.get(selector)!;
                        data.count++;
                        location && data.locations.push(location);
                    } else {
                        selectors.set(selector, {
                            count: 1,
                            locations: location ? [location] : []
                        });
                    }
                });
            }
        });

        const duplicates: string[] = [];
        selectors.forEach((data, selector) => {
            if (data.count > 1) {
                duplicates.push(
                    `Selector "${selector}" is repeated ${data.count} time(s)${data.locations.length ? `. Found at lines: ${data.locations.join(', ')}` : ''}`
                );
            }
        });

        return duplicates;
    }
}