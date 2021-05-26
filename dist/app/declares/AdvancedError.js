"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdvancedError extends Error {
    constructor(errors) {
        super('ValidationError');
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.errors = errors;
    }
    /**
     * setName
     */
    setName(name) {
        this.name = name;
    }
    /**
     * setStatusCode
     */
    setStatusCode(code) {
        this.statusCode = code;
    }
}
exports.default = AdvancedError;
//# sourceMappingURL=AdvancedError.js.map