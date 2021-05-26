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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const Tax_1 = __importDefault(require("@/app/models/Tax"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
class TaxController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    incomeTaxRule: {
                        isString: {
                            errorMessage: ['isString', 'Income tax rule is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Income tax rule must be provided'],
                        },
                    },
                    panNum: {
                        isString: {
                            errorMessage: ['isString', 'PANNum is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'PANNum must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Employee must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 0, page = 1, skip = 0 } = body;
            const taxes = yield this.model
                .find({})
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: taxes,
                message: 'List items successfully',
                total: yield this.model.countDocuments(),
            }));
        });
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tax = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: tax,
                message: 'Add item successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const tax = yield this.model.findById(id).exec();
            if (!tax) {
                throw new AdvancedError_1.default({
                    tax: { kind: 'not.found', message: 'Tax not found' },
                });
            }
            tax.set(this.filterParams(body, ['company', 'employee']));
            yield tax.save();
            res.send(new ResponseResult_1.default({
                data: tax,
                message: 'Update item successfully',
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, page = 1, limit = 0, skip = 0 } = body;
            const foundEmployee = yield Employee_1.default.findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const tax = yield this.model
                .find({ employee })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: tax,
                total: yield this.model.countDocuments({ employee }),
                message: 'List items successfully',
            }));
        });
    }
}
exports.default = new TaxController(Tax_1.default);
//# sourceMappingURL=TaxController.js.map