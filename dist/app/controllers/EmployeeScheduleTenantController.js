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
// import CompanyTenant from '@/app/models/CompanyTenant'
// import EmployeeScheduleTenant from '@/app/models/EmployeeScheduleTenant'
// import LocationTenant from '@/app/models/LocationTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const EmployeeSchedule_1 = __importDefault(require("../models/EmployeeSchedule"));
// import CompanyTenant from '../models/CompanyTenant'
const EmployeeScheduleTenant_1 = __importDefault(require("../models/EmployeeScheduleTenant"));
// import Country from '../models/Country'
// import VietNamPolicy from '../inits/countryPolicyDefault'
class EmployeeScheduleTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'get-by-location',
                type: 'POST',
                _ref: this.getByLocation.bind(this),
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active.bind(this),
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, tenantId } = req.body;
            const employeeSchedule = yield EmployeeScheduleTenant_1.default.getInstance(tenantId).findOne({ location: location });
            if (!employeeSchedule) {
                res.send(new ResponseResult_1.default({
                    data: yield EmployeeScheduleTenant_1.default.getInstance(tenantId).create(req.body),
                }));
            }
            employeeSchedule.set(req.body);
            yield employeeSchedule.save();
            res.send(new ResponseResult_1.default({
                data: employeeSchedule,
                message: 'Update successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, _id } = req.body;
            const employeeSchedule = yield EmployeeScheduleTenant_1.default.getInstance(tenantId).findById(_id);
            if (!employeeSchedule) {
                throw new AdvancedError_1.default({
                    employeeschedule: {
                        kind: 'not.found',
                        message: 'Employee schedule not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: employeeSchedule,
                message: 'get data successfully',
            }));
        });
    }
    getByLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, tenantId } = req.body;
            const data = yield EmployeeScheduleTenant_1.default.getInstance(tenantId).findOne({
                location: location,
            });
            if (!data) {
                res.send(new ResponseResult_1.default({
                    data: yield EmployeeSchedule_1.default.findOne({
                        location: null,
                    }),
                    message: 'Success',
                }));
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'Get data by location successfully',
            }));
        });
    }
}
exports.default = new EmployeeScheduleTenantController();
//# sourceMappingURL=EmployeeScheduleTenantController.js.map