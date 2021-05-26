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
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const LeaveBalanceTenant_1 = __importDefault(require("../models/LeaveBalanceTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const TimeoffTypeTenant_1 = __importDefault(require("../models/TimeoffTypeTenant"));
// import EmployeeTenant from '../models/EmployeeTenant'
// import LeaveBalanceTenant from '../models/LeaveBalanceTenant'
// import TimeoffTypeTenant from '../models/TimeoffTypeTenant'
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class LeaveBalanceTenantController extends AbstractController_1.default {
    // private async setInstanceModel(_req: Request) {
    // const header = req.header('tenantId')
    // const tenantId = header ? header : ''
    // this.model = this.model ? this.model : LeaveBalanceTenant(tenantId)
    // this.LeaveBalanceTenantModel = this.LeaveBalanceTenantModel
    //   ? this.LeaveBalanceTenantModel
    //   : this.model
    // this.EmployeeTenantModel = this.EmployeeTenantModel
    //   ? this.EmployeeTenantModel
    //   : EmployeeTenant.getInstance(this.tenantId),
    // this.TimeoffTypeTenantModel = this.TimeoffTypeTenantModel
    //   ? this.TimeoffTypeTenantModel
    //   : TimeoffTypeTenant(tenantId)
    // }
    generateMethods() {
        return [
            {
                name: 'get-by-user',
                type: 'POST',
                _ref: this.getByUser.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
    getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const currentUser = req.user;
            // const employee = await EmployeeTenant.getInstance(tenantId).findById(
            //   currentUser.id,
            // )
            const userPermission = (yield ManagePermission_1.default.findOne({
                userMap: currentUser.id,
            }));
            const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(userPermission.employee);
            const timeOffList = yield TimeoffTypeTenant_1.default.getInstance(tenantId).find({
            // company: company,
            // location: location,
            });
            if (employee) {
                const leaveBalance = yield LeaveBalanceTenant_1.default.getInstance(tenantId).findOne({
                    employee: employee._id,
                });
                if (leaveBalance) {
                    // Get list of time off from current user
                    let employeeTimeoff = leaveBalance.commonLeaves.timeOffTypes
                        .map((item) => {
                        return item.defaultSettings._id;
                    })
                        .concat(leaveBalance.specialLeaves.timeOffTypes.map((item) => {
                        return item.defaultSettings._id;
                    }));
                    // Delete time off type of user that is not in current settings
                    const compareList = timeOffList.map(x => x._id);
                    employeeTimeoff.map((item) => __awaiter(this, void 0, void 0, function* () {
                        for (let i = 0; i < compareList.length; i++) {
                            if (lodash_1.isEqual(compareList[i], item)) {
                                break;
                            }
                            if (i === compareList.length - 1) {
                                yield leaveBalance.updateOne({
                                    $pull: {
                                        'commonLeaves.timeOffTypes': { defaultSettings: item },
                                        'specialLeaves.timeOffTypes': { defaultSettings: item },
                                    },
                                }, { safe: true });
                            }
                        }
                    }));
                    timeOffList.map((item) => __awaiter(this, void 0, void 0, function* () {
                        // Add new time off types from current settings to user's balance
                        if (!employeeTimeoff.includes(item._id)) {
                            if (item.type === 'A' || item.type === 'B') {
                                yield leaveBalance.updateOne({
                                    $push: {
                                        'commonLeaves.timeOffTypes': {
                                            defaultSettings: item._id,
                                            currentAllowance: item.baseAccrual.time || 0,
                                        },
                                    },
                                });
                            }
                            else {
                                yield leaveBalance.updateOne({
                                    $push: {
                                        'specialLeaves.timeOffTypes': {
                                            defaultSettings: item._id,
                                            currentAllowance: item.baseAccrual.time || 0,
                                        },
                                    },
                                });
                            }
                        }
                    }));
                    yield leaveBalance.save();
                    const leaveBalanceData = yield LeaveBalanceTenant_1.default.getInstance(tenantId)
                        .findOne({
                        employee: employee._id,
                    })
                        .populate({
                        path: 'commonLeaves.timeOffTypes.defaultSettings',
                        model: TimeoffTypeTenant_1.default.getInstance(tenantId),
                        select: {
                            name: 1,
                            shortType: 1,
                            typeName: 1,
                            type: 1,
                            baseAccrual: 1,
                        },
                    })
                        .populate({
                        path: 'specialLeaves.timeOffTypes.defaultSettings',
                        model: TimeoffTypeTenant_1.default.getInstance(tenantId),
                        select: { name: 1, shortType: 1, typeName: 1 },
                    })
                        .exec();
                    res.send(new ResponseResult_1.default({
                        message: 'Successfully fetched leave balance by employee',
                        data: leaveBalanceData,
                    }));
                }
                else {
                    let commonLeaves = { timeOffTypes: [] };
                    let specialLeaves = { timeOffTypes: [] };
                    yield bluebird_1.default.map(timeOffList, (item) => {
                        if (item.type === 'A' || item.type === 'B') {
                            if (!commonLeaves.policy || commonLeaves.policy !== item.policyDoc)
                                commonLeaves.policy = item.policyDoc;
                            commonLeaves.timeOffTypes.push({
                                defaultSettings: item,
                                currentAllowance: item.baseAccrual.time || 0,
                            });
                        }
                        else {
                            if (!specialLeaves.policy ||
                                specialLeaves.policy !== item.policyDoc)
                                specialLeaves.policy = item.policyDoc;
                            specialLeaves.timeOffTypes.push({
                                defaultSettings: item,
                                currentAllowance: item.baseAccrual.time || 0,
                            });
                        }
                    });
                    res.send(new ResponseResult_1.default({
                        message: 'Successfully fetched leave balance for user',
                        data: yield LeaveBalanceTenant_1.default.getInstance(tenantId).create({
                            employee: employee._id,
                            commonLeaves,
                            specialLeaves,
                        }),
                    }));
                }
            }
            else {
                res.send(new AdvancedError_1.default({
                    leaveBalance: {
                        kind: 'not.found',
                        message: 'User is not found as an employee',
                    },
                }));
            }
        });
    }
}
exports.default = new LeaveBalanceTenantController();
//# sourceMappingURL=LeaveBalanceTenantController.js.map