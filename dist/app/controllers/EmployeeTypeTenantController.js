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
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const CompanyTenant_1 = __importDefault(require("@/app/models/CompanyTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const EmployeeTypeTenant_1 = __importDefault(require("../models/EmployeeTypeTenant"));
class EmployeeTypeTenantController extends AbstractController_1.default {
    setInstanceModel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = req.header('tenantId');
            const tenantId = header ? header : '';
            this.model = this.model
                ? this.model
                : EmployeeTypeTenant_1.default.getInstance(tenantId);
            this.EmployeeTypeTenantModel = this.EmployeeTypeTenantModel
                ? this.EmployeeTypeTenantModel
                : this.model;
            this.CompanyTenantModel = this.CompanyTenantModel
                ? this.CompanyTenantModel
                : CompanyTenant_1.default.getInstance(tenantId);
            this.EmployeeTenantModel = this.EmployeeTenantModel
                ? this.EmployeeTenantModel
                : EmployeeTenant_1.default.getInstance(tenantId);
        });
    }
    generateMethods() {
        return [
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            this.setInstanceModel(req);
            const EmployeeType = yield EmployeeTypeTenant_1.default.getInstance(tenantId).findById(id);
            if (!EmployeeType) {
                throw new AdvancedError_1.default({
                    EmployeeType: { kind: 'not.found', message: 'EmployeeType not found' },
                });
            }
            EmployeeType.set(this.filterParams(body, ['company']));
            yield EmployeeType.save();
            res.send(new ResponseResult_1.default({
                data: EmployeeType,
                message: 'Update item successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            this.setInstanceModel(req);
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            const companyData = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(employee.company)
                .exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            const data = yield EmployeeTypeTenant_1.default.getInstance(tenantId)
                .find({ status: 'ACTIVE' })
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                message: 'Successfully find',
                data,
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            this.setInstanceModel(req);
            const { name } = req.body;
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            const companyData = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(employee.company)
                .exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            const employeeType = yield EmployeeTypeTenant_1.default.getInstance(tenantId).create({
                company: companyData,
                name,
            });
            res.send(new ResponseResult_1.default({
                message: 'add employee type successfully.',
                data: employeeType,
            }));
        });
    }
}
exports.default = new EmployeeTypeTenantController();
//# sourceMappingURL=EmployeeTypeTenantController.js.map