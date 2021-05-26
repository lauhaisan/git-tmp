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
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const EmployeeSkill_1 = __importDefault(require("@/app/models/EmployeeSkill"));
const SkillType_1 = __importDefault(require("@/app/models/SkillType"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class EmployeeSkillController extends AbstractController_1.default {
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
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 0, page = 1, skip = 0 } = body;
            const employeeSkills = yield this.model
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
    listByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const foundEmployee = yield Employee_1.default.findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const employeeSkills = yield this.model
                .find({ employee })
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: employeeSkills,
                message: 'List items successfully',
            }));
        });
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeSkill = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: employeeSkill,
                message: 'Add item successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const employeeSkill = yield this.model.findById(id);
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
    listEmployeesBySkillType({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, page = 1, limit = 0, skip = 0 } = body;
            const foundSkillType = yield SkillType_1.default.findById(type);
            if (!foundSkillType) {
                throw new AdvancedError_1.default({
                    skillType: {
                        kind: 'not.found',
                        message: 'Skill type not found',
                    },
                });
            }
            const employees = yield this.model
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
exports.default = new EmployeeSkillController(EmployeeSkill_1.default);
//# sourceMappingURL=EmployeeSkillController.js.map