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
const mongoose_1 = require("mongoose");
const AbstractController_1 = __importDefault(require("../declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const ChangeHistoryTenant_1 = __importDefault(require("../models/ChangeHistoryTenant"));
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
// import ChangeHistoryTenant from '../models/ChangeHistoryTenant'
// import CompensationTenant from '../models/CompensationTenant'
// import EmployeeTenant from '../models/EmployeeTenant'
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
const utils_1 = require("../utils/utils");
class ChangeHistoryTenantController extends AbstractController_1.default {
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
                _ref: this.getByEmployee,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'revoke',
                type: 'POST',
                _ref: this.revoke.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { effectiveDate, changeDate } = req.body;
            const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(req.body.employee);
            if (employee) {
                res.send(new ResponseResult_1.default({
                    message: "Changed employee's employment successfully",
                    data: yield ChangeHistoryTenant_1.default.getInstance(tenantId).create(req.body),
                }));
                if (effectiveDate <= changeDate) {
                    const compensation = yield CompensationTenant_1.default.getInstance(tenantId).findOne({
                        employee: req.body.employee,
                    });
                    if (compensation) {
                        compensation.set(utils_1.filterParams(req.body));
                        yield compensation.save();
                    }
                    employee.set(utils_1.filterParams(req.body, [
                        'effectiveDate',
                        'changeDate',
                        'takeEffect',
                        'currentCTC',
                        'compensationType',
                        'employee',
                        'changedBy',
                    ]));
                    yield employee.save();
                }
            }
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { employee } = req.body;
            const changes = yield ChangeHistoryTenant_1.default.getInstance(tenantId).find({
                employee,
            });
            const data = changes.sort((a, b) => Date.parse(b.changeDate.toISOString()) -
                Date.parse(a.changeDate.toISOString()));
            res.send(new ResponseResult_1.default({
                message: 'Fetched change history of employee successfully',
                data,
            }));
        });
    }
    revoke(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { employee, id } = body;
            let changeList = yield ChangeHistoryTenant_1.default.getInstance(tenantId)
                .find({ employee })
                .sort({ changeDate: -1 });
            if (!changeList) {
                throw new AdvancedError_1.default({
                    changeHistory: {
                        kind: 'not.found',
                        message: 'Change history not found',
                    },
                });
            }
            if (changeList.length === 0) {
                throw new AdvancedError_1.default({
                    changeHistory: {
                        kind: 'not.found',
                        message: 'No history found',
                    },
                });
            }
            let newChangeList = [...changeList];
            // const deleteChange: any = newChangeList.shift() // Remove most recent change
            yield ChangeHistoryTenant_1.default.getInstance(tenantId).deleteOne({
                _id: id,
            });
            changeList = yield ChangeHistoryTenant_1.default.getInstance(tenantId)
                .find({ employee })
                .sort({ changeDate: -1 });
            newChangeList = [...changeList];
            if (newChangeList.length > 0) {
                const recentChange = newChangeList[0]; // Get new recent change
                if (recentChange.title) {
                    yield EmployeeTenant_1.default.getInstance(tenantId).updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { title: recentChange.title._id });
                }
                if (recentChange.location) {
                    yield EmployeeTenant_1.default.getInstance(tenantId).updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { location: recentChange.location._id });
                }
                if (recentChange.employeeType) {
                    yield EmployeeTenant_1.default.getInstance(tenantId).updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { employeeType: recentChange.employeeType._id });
                }
                if (recentChange.compensationType) {
                    yield CompensationTenant_1.default.getInstance(tenantId).updateOne({ employee: mongoose_1.Types.ObjectId(employee) }, { compensationType: recentChange.compensationType });
                }
                if (recentChange.manager) {
                    yield EmployeeTenant_1.default.getInstance(tenantId).updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { manager: recentChange.manager._id });
                }
                if (recentChange.department) {
                    yield EmployeeTenant_1.default.getInstance(tenantId).updateOne({ _id: mongoose_1.Types.ObjectId(employee) }, { department: recentChange.department._id });
                }
            }
            res.send(new ResponseResult_1.default({
                message: 'Revoke change history successfully',
                data: {
                    newChangeList,
                },
            }));
        });
    }
}
exports.default = new ChangeHistoryTenantController();
//# sourceMappingURL=ChangeHistoryTenantController.js.map