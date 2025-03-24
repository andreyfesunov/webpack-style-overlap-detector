export enum SODLogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info'
}

export class SODLogger {
    private readonly _level: SODLogLevel;
    private readonly _logMethod: (message: string) => void;

    public constructor(level: SODLogLevel) {
        this._level = level;
        this._logMethod = this._resolveLogMethod();
    }

    public log(message: string): void {
        this._logMethod(message);
    }

    private _resolveLogMethod(): (message: string) => void {
        if (this._level === SODLogLevel.ERROR) {
            return console.error;
        } else if (this._level === SODLogLevel.WARN) {
            return console.warn;
        } else {
            return console.log;
        }
    }
}