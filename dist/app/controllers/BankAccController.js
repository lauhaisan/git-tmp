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
// import config from '@/app/config/index';
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const BankAcc_1 = __importDefault(require("@/app/models/BankAcc"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
// import Employee from '@/app/models/Employee';
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class BankAccController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
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
                    bankName: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Bank name is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Bank name must be provided'],
                        },
                    },
                    accountNumber: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Account number is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Account number must be provided'],
                        },
                    },
                    accountType: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Account type is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Account type must be provided'],
                        },
                    },
                    ifscCode: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'ifscCode is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'ifscCode must be provided'],
                        },
                    },
                    micrcCode: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'micrcCode is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'micrcCode must be provided'],
                        },
                    },
                    uanNumber: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'uanNumber is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'uanNumber must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'ID must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 0, page = 1, skip = 0 } = body;
            const bankAccs = yield this.model
                .find({})
                .skip((page - 1) * limit + skip)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
            res.send(new ResponseResult_1.default({
                data: bankAccs,
                message: 'List items successfully',
                total: yield this.model.countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const bankAcc = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: bankAcc,
                message: 'Add item successfully',
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
            const bankAccs = yield this.model
                .find({ employee })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: bankAccs,
                total: yield this.model.countDocuments({ employee }),
                message: 'List items successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const bankAcc = yield this.model.findById(id).exec();
            if (!bankAcc) {
                throw new AdvancedError_1.default({
                    bankAcc: { kind: 'not.found', message: 'Bank account not found' },
                });
            }
            bankAcc.set(this.filterParams(body, ['employee', 'company']));
            yield bankAcc.save();
            res.send(new ResponseResult_1.default({
                message: 'Update bank account successfully',
                data: bankAcc,
            }));
        });
    }
}
exports.default = new BankAccController(BankAcc_1.default);
//# sourceMappingURL=BankAccController.js.map