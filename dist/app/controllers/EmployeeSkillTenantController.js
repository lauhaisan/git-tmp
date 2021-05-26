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
// import EmployeeSkillTenant from '@/app/models/EmployeeSkillTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import SkillTypeTenant from '@/app/models/SkillTypeTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const EmployeeSkillTenant_1 = __importDefault(require("../models/EmployeeSkillTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const SkillTypeTenant_1 = __importDefault(require("../models/SkillTypeTenant"));
class EmployeeSkillTenantController extends AbstractController_1.default {
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model ? this.model : EmployeeSkillTenant(tenantId)
            // this.EmployeeSkillTenantModel = this.EmployeeSkillTenantModel
            //   ? this.EmployeeSkillTenantModel
            //   : this.model
            // this.EmployeeTenantModel = this.EmployeeTenantModel
            //   ? this.EmployeeTenantModel
            //   : EmployeeTenant.getInstance(this.tenantId),
            // this.SkillTypeTenantModel = this.SkillTypeTenantModel
            //   ? this.SkillTypeTenantModel
            //   : new SkillTypeTenant(tenantId).getModel()
        });
    }
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-by-employee',
                type: 'POST',
                _ref: this.listByEmployee.bind(this),
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
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list-employee-by-skilltype',
                type: 'POST',
                _ref: this.listEmployeesBySkillType.bind(this),
                validationSchema: {
                    type: {
                        isString: {
                            errorMessage: ['isString', 'Type is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Type must be provided'],
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
            this.setInstanceModel(req);
            const { limit = 0, page = 1, skip = 0 } = body;
            const employeeSkills = yield EmployeeSkillTenant_1.default.getInstance(tenantId)
                .find({})
                .skip((page - 1) * limit + skip)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
            res.send(new ResponseResult_1.default({
                data: employeeSkills,
                message: 'List items successfully',
                total: yield this.model.countDocuments(),
            }));
        });
    }
    listByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const { employee } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const employeeSkills = yield EmployeeSkillTenant_1.default.getInstance(tenantId)
                .find({ employee })
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: employeeSkills,
                message: 'List items successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const employeeSkill = yield EmployeeSkillTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: employeeSkill,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            this.setInstanceModel(req);
            const employeeSkill = yield EmployeeSkillTenant_1.default.getInstance(tenantId).findById(id);
            if (!employeeSkill) {
                throw new AdvancedError_1.default({
                    employeeSkill: {
                        kind: 'not.found',
                        message: 'Employee skill not found',
                    },
                });
            }
            employeeSkill.set(this.filterParams(body, ['company', 'employee', 'type']));
            yield employeeSkill.save();
            res.send(new ResponseResult_1.default({
                data: employeeSkill,
                message: 'Update item successfully',
            }));
        });
    }
    listEmployeesBySkillType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const { type, page = 1, limit = 0, skip = 0 } = body;
            const foundSkillType = yield SkillTypeTenant_1.default.getInstance(tenantId).findById(type);
            if (!foundSkillType) {
                throw new AdvancedError_1.default({
                    skillType: {
                        kind: 'not.found',
                        message: 'Skill type not found',
                    },
                });
            }
            const employees = yield EmployeeSkillTenant_1.default.getInstance(tenantId)
                .find({ type })
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
                total: yield this.model.countDocuments({ type }),
            }));
        });
    }
}
exports.default = new EmployeeSkillTenantController();
//# sourceMappingURL=EmployeeSkillTenantController.js.map