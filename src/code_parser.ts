import { sources } from "webpack";

export enum CodeParserMode {
    CSS = 'CSS',
    Angular = 'Angular',
}

export interface CodeParserOptions {
    readonly parse_modes?: readonly CodeParserMode[];
}

export interface CodeParser {
    parse(assets: {
        [index: string]: sources.Source
    }): readonly string[];
}

export class CodeParserFactory {
    public static create(parse_mode: CodeParserMode): CodeParser {
        if (parse_mode === CodeParserMode.Angular) {
            return new AngularCodeParser();
        }
        if (parse_mode === CodeParserMode.CSS) {
            return new CSSCodeParser();
        }

        throw new Error('Invalid code parser mode');
    }
}

export class CSSCodeParser implements CodeParser {
    public parse(assets: {
        [index: string]: sources.Source
    }): readonly string[] {
        const cssFiles = Object.keys(assets).filter((asset) => asset.endsWith('.css'));

        return cssFiles.map((file) => assets[file].source().toString());
    }
}

export class AngularCodeParser implements CodeParser {
    public parse(assets: {
        [index: string]: sources.Source
    }): readonly string[] {
        const jsFiles = Object.keys(assets).filter((asset) => asset.endsWith('.js'));

        return jsFiles.map((file) => {
            const source = assets[file].source().toString();
            const styleMatches = source.match(/styles:\s*\[\s*"(.*?)"\s*\]/);
            return styleMatches ? styleMatches[1] : null;
        }).filter((style) => style !== null);
    }
}
