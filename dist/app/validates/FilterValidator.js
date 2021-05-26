"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateTypeOfFilter = exports.sanitizeDateTypeOfFilter = void 0;
const validator_1 = __importDefault(require("validator"));
function sanitizeDateTypeOfFilter(val) {
    if (!val ||
        typeof val.type !== 'string' ||
        !['range', 'month', 'year'].includes(val.type)) {
        return val;
    }
    const dateTypes = {
        range: ({ from, to }) => ({
            type: 'range',
            from: validator_1.default.toDate(from),
            to: validator_1.default.toDate(to),
        }),
        default: (_a) => {
            var { time } = _a, rest = __rest(_a, ["time"]);
            return (Object.assign(Object.assign({}, rest), { time: Number.parseInt(time, 10) }));
        },
    };
    const sanitizer = dateTypes[val.type] || dateTypes.default;
    return sanitizer(val);
}
exports.sanitizeDateTypeOfFilter = sanitizeDateTypeOfFilter;
function validateDateTypeOfFilter(val) {
    if (!val ||
        typeof val.type !== 'string' ||
        !['range', 'month', 'year'].includes(val.type)) {
        return false;
    }
    const dateTypes = {
        range: ({ from, to }) => from !== null && to !== null,
        default: ({ time }) => typeof time === 'number',
    };
    const check = dateTypes[val.type] || dateTypes.default;
    return check(val);
}
exports.validateDateTypeOfFilter = validateDateTypeOfFilter;
//# sourceMappingURL=FilterValidator.js.map