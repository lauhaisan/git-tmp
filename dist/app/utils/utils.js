"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterParams = exports.checkWithdrawValid = exports.getEndDate = exports.multipleDateRangeOverlaps = exports.dateRangeOverlaps = exports.getDeductDay = exports.TIME_OF_DAY = exports.generateCompanyCode = exports.getMonthlyAverage = exports.responseErr = exports.generateFields = exports.chunkArray = exports.isBlank = exports.isString = void 0;
const Company_1 = __importDefault(require("@/app/models/Company"));
const lodash_1 = require("lodash");
const randomstring_1 = __importDefault(require("randomstring"));
const moment_1 = __importDefault(require("moment"));
function isString(input) {
    return Boolean(typeof input === 'string');
}
exports.isString = isString;
function isBlank(input) {
    return input.length === 0;
}
exports.isBlank = isBlank;
function chunkArray(arr, chunkSize) {
    const chunks = [];
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
    }
    return chunks;
}
exports.chunkArray = chunkArray;
function generateFields(schema, schemaDefinition, possibleFields) {
    return Object.keys(schemaDefinition)
        .filter(nameField => {
        if (!possibleFields.includes(nameField))
            return false;
        const schemaType = schema.path(nameField);
        return schemaType.instance;
    })
        .map(nameField => {
        const schemaType = schema.path(nameField);
        let type = schemaType.instance;
        if (type === 'Array')
            type = [schemaType.caster.instance];
        const { options: { ref }, } = schemaType;
        return Object.assign({ name: nameField, type }, (ref ? { ref } : {}));
    });
}
exports.generateFields = generateFields;
function responseErr(next, errMsg) {
    return next({
        statusCode: 400,
        name: 'ValidationError',
        errors: [{ message: errMsg }],
    });
}
exports.responseErr = responseErr;
function getMonthlyAverage({ logs, month, key } = {}) {
    const average = lodash_1.sumBy(logs, (log) => {
        if (new Date(log.createdAt).getMonth() === month) {
            return log[key];
        }
    }) / 12;
    return Math.floor(average);
}
exports.getMonthlyAverage = getMonthlyAverage;
function generateCompanyCode({ name = '' } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let codeNumber = randomstring_1.default
            .generate({
            length: 3,
            charset: '0123456789',
        })
            .toUpperCase();
        let code = `${name
            .replace(/\s/g, '')
            .substring(0, 4)}-${codeNumber}`.toUpperCase();
        const company = yield Company_1.default.findOne({ code });
        if (company) {
            code = yield generateCompanyCode({ name });
        }
        else {
            return code;
        }
    });
}
exports.generateCompanyCode = generateCompanyCode;
exports.TIME_OF_DAY = {
    WHOLE_DAY: 'WHOLE-DAY',
    MORNING: 'MORNING',
    AFTERNOON: 'AFTERNOON',
};
exports.getDeductDay = (leaveDates) => {
    // const TIME_OF_DAY = {
    //   WHOLE_DAY: 'WHOLE-DAY',
    //   MORNING: 'MORNING',
    //   AFTERNOON: 'AFTERNOON',
    // }
    let deductDate = 0;
    leaveDates.map((item) => {
        const { timeOfDay } = item;
        const { WHOLE_DAY, MORNING, AFTERNOON } = exports.TIME_OF_DAY;
        if (timeOfDay === WHOLE_DAY) {
            deductDate += 1;
        }
        if (timeOfDay === MORNING || timeOfDay === AFTERNOON) {
            deductDate += 0.5;
        }
        return null;
    });
    return deductDate;
};
exports.dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
    if (a_start < b_start && b_start < a_end)
        return true; // b starts in a
    if (a_start < b_end && b_end < a_end)
        return true; // b ends in a
    if (b_start < a_start && a_end < b_end)
        return true; // a in b
    return false;
};
const isValidDate = (date) => {
    return (date &&
        Object.prototype.toString.call(date) === '[object Date]' &&
        !isNaN(date));
};
exports.multipleDateRangeOverlaps = (timeEntries) => {
    let i = 0, j = 0;
    let timeIntervals = timeEntries.filter(entry => isValidDate(entry.from) && isValidDate(entry.to));
    if (timeIntervals != null && timeIntervals.length > 1)
        for (i = 0; i < timeIntervals.length - 1; i += 1) {
            for (j = i + 1; j < timeIntervals.length; j += 1) {
                if (exports.dateRangeOverlaps(timeIntervals[i].from.getTime(), timeIntervals[i].to.getTime(), timeIntervals[j].from.getTime(), timeIntervals[j].to.getTime()))
                    return true;
            }
        }
    return false;
};
const addHours = (date, h) => {
    const newDate = new Date(date);
    // newDate.setTime(date.getTime() + 6 * 60 * 60 * 1000)
    newDate.setTime(newDate.getTime() + h * 60 * 60 * 1000);
    return newDate;
};
exports.getEndDate = (date, type) => {
    const { WHOLE_DAY, MORNING, AFTERNOON } = exports.TIME_OF_DAY;
    let endDate = date;
    switch (type) {
        case WHOLE_DAY:
            endDate = addHours(date, 8);
            break;
        case MORNING:
        case AFTERNOON:
            endDate = addHours(date, 4);
            break;
        default:
            break;
    }
    return endDate;
};
exports.checkWithdrawValid = (fromDate) => {
    const now = moment_1.default().format('YYYY-MM-DD');
    const from = moment_1.default(fromDate).format('YYYY-MM-DD');
    return from > now;
};
exports.filterParams = (root = {}, ignoreFields = []) => {
    lodash_1.forEach(ignoreFields, v => {
        delete root[v];
    });
    return root;
};
//# sourceMappingURL=utils.js.map