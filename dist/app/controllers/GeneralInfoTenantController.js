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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import CertificationTenant from '@/app/models/CertificationTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import Document from '@/app/models/Document'
// import GeneralInfoTenant from '@/app/models/GeneralInfoTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const mongoose_1 = require("mongoose");
const CertificationTenant_1 = __importDefault(require("../models/CertificationTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const constant_1 = require("../utils/constant");
const utils_1 = require("../utils/utils");
class GeneralInfoTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
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
            {
                name: 'delete',
                type: 'POST',
                _ref: this.delete.bind(this),
            },
            {
                name: 'list-relation',
                type: 'POST',
                _ref: this.listRelationship.bind(this),
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { id, employeeId } = req.body;
            const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findById(id);
            generalInfo.set(utils_1.filterParams(req.body, ['employee', 'company']));
            // generalInfo.set(req.body)
            if (employeeId) {
                const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                    _id: generalInfo.employee,
                });
                // const findEmployeeId = await Employee.findOne({ employeeId, company: employee.company })
                const findEmployeeId = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                    employeeId,
                    company: employee.company,
                });
                if (findEmployeeId && findEmployeeId.id !== employee.id) {
                    throw new AdvancedError_1.default({
                        employeeId: {
                            kind: 'not.unique',
                            message: 'employeeId must be unique',
                        },
                    });
                }
                employee.set({ employeeId });
                yield employee.save();
            }
            yield generalInfo.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: generalInfo,
            }));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { id } = req.body;
            const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).deleteMany({
                _id: mongoose_1.Types.ObjectId(id),
            });
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: generalInfo,
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { employee } = body;
            const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                employee,
            });
            // console.log('employee', employee)
            // console.log('generalInfo', generalInfo.id)
            const certification = yield CertificationTenant_1.default.getInstance(tenantId).find({
                employee,
            });
            generalInfo.certification = certification;
            // const documents = await Document.find({ employee })
            // generalInfo.documents = documents
            res.send(new ResponseResult_1.default({
                data: generalInfo,
                message: 'get generalInfo successfully',
            }));
        });
    }
    listRelationship(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: [...constant_1.EMPLOYEE.relationshipEnum],
                message: 'List items successfully',
            }));
        });
    }
}
exports.default = new GeneralInfoTenantController();
//# sourceMappingURL=GeneralInfoTenantController.js.map