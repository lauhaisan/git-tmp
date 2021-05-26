"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umi_request_1 = require("umi-request");
const errorHandler = (error) => {
    const { data: response = {} } = error;
    return response;
};
/**
 * Request function
 */
function request(url, options, token) {
    let headers = options.headers || {};
    if (token) {
        headers = Object.assign({ Authorization: `${token}` }, headers);
    }
    return umi_request_1.extend(Object.assign({ errorHandler, credentials: 'include', headers }, options))(url);
}
exports.default = request;
//# sourceMappingURL=request.js.map