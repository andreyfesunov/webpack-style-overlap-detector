"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SODLogger = exports.SODLogLevel = void 0;
var SODLogLevel;
(function (SODLogLevel) {
    SODLogLevel["ERROR"] = "error";
    SODLogLevel["WARN"] = "warn";
    SODLogLevel["INFO"] = "info";
})(SODLogLevel || (exports.SODLogLevel = SODLogLevel = {}));
class SODLogger {
    constructor(level) {
        this._level = level;
        this._logMethod = this._resolveLogMethod();
    }
    log(message) {
        this._logMethod(message);
    }
    _resolveLogMethod() {
        if (this._level === SODLogLevel.ERROR) {
            return console.error;
        }
        else if (this._level === SODLogLevel.WARN) {
            return console.warn;
        }
        else {
            return console.log;
        }
    }
}
exports.SODLogger = SODLogger;
