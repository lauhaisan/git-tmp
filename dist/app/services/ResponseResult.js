"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("@/app/declares/Enums");
class ResponseResult {
    constructor({ status, statusCode, message, data, total, sum, } = {}) {
        this.statusCode = Enums_1.SUCCESS_CODE;
        this.status = Enums_1.SUCCESS;
        this.status = status || this.status;
        this.statusCode = statusCode || this.statusCode;
        this.message = message;
        this.data = data;
        this.total = total;
        this.sum = sum;
    }
}
exports.default = ResponseResult;
//# sourceMappingURL=ResponseResult.js.map