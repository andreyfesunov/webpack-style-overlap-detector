export declare enum SODLogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info"
}
export declare class SODLogger {
    private readonly _level;
    private readonly _logMethod;
    constructor(level: SODLogLevel);
    log(message: string): void;
    private _resolveLogMethod;
}
