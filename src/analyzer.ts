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
                const selectorText = rule.selectors?.join(', ') || '';

                if (this._options.whitelist?.includes(selectorText)) {
                    return;
                }

                const position = rule.position;
                const location = position?.start?.line;

                if (selectors.has(selectorText)) {
                    const data = selectors.get(selectorText)!;
                    data.count++;
                    location && data.locations.push(location);
                } else {
                    selectors.set(selectorText, {
                        count: 1,
                        locations: location ? [location] : []
                    });
                }
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