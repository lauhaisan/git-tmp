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
const EmployeeTenant_1 = __importDefault(require("@/app/models/EmployeeTenant"));
const PayslipTenant_1 = __importDefault(require("@/app/models/PayslipTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class PayslipTenantController extends AbstractController_1.default {
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
                name: 'list-by-employee',
                type: 'POST',
                _ref: this.listByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: ['body'],
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
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Name is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Name must be provided'],
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
                            errorMessage: ['Required', 'Id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { limit = 0, page = 1, skip = 0 } = body;
            const payslips = yield PayslipTenant_1.default.getInstance(tenantId)
                .find({})
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: payslips,
                message: 'List items successfully',
                total: yield PayslipTenant_1.default.getInstance(tenantId).countDocuments(),
            }));
        });
    }
    listByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { employee, limit = 0, page = 1, skip = 0 } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const payslips = yield PayslipTenant_1.default.getInstance(tenantId)
                .find({ employee })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: payslips,
                message: 'List items successfully',
                total: yield PayslipTenant_1.default.getInstance(tenantId).countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const payslip = yield PayslipTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: payslip,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            const payslip = yield PayslipTenant_1.default.getInstance(tenantId).findById(id);
            if (!payslip) {
                throw new AdvancedError_1.default({
                    payslip: { kind: 'not.found', message: 'Payslip not found' },
                });
            }
            payslip.set(this.filterParams(body, ['employee', 'company']));
            yield payslip.save();
            res.send(new ResponseResult_1.default({
                data: payslip,
                message: 'Update item successfully',
            }));
        });
    }
}
exports.default = new PayslipTenantController();
//# sourceMappingURL=PayslipTenantController.js.map