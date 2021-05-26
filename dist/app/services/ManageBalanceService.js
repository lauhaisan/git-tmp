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
const LeaveBalanceTenant_1 = __importDefault(require("../models/LeaveBalanceTenant"));
const ManageBalanceTenant_1 = __importDefault(require("../models/ManageBalanceTenant"));
const Tenant_1 = __importDefault(require("../models/Tenant"));
const TimeoffTypeTenant_1 = __importDefault(require("../models/TimeoffTypeTenant"));
class ManageBalanceService extends AbstractController_1.default {
    resetBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTenants = yield Tenant_1.default.find();
            yield bluebird_1.default.map(allTenants, (tenant) => __awaiter(this, void 0, void 0, function* () {
                const manageBalances = yield ManageBalanceTenant_1.default.getInstance(String(tenant.id)).find({
                    $and: [
                        {
                            statusEffect: {
                                $eq: false,
                            },
                        },
                        {
                            effectiveDate: {
                                $lt: new Date(),
                            },
                        },
                    ],
                });
                if (manageBalances.length > 0) {
                    // console.log(manageBalances)
                    yield bluebird_1.default.map(manageBalances, (employeeBalance) => __awaiter(this, void 0, void 0, function* () {
                        const leaveBalance = yield LeaveBalanceTenant_1.default.getInstance(tenant.id).findOne({ employee: employeeBalance.employeeId._id });
                        // console.log(leaveBalance)
                        //update current allowance from csv file
                        let commonLeaves = leaveBalance.commonLeaves.timeOffTypes;
                        yield bluebird_1.default.map(commonLeaves, (item) => __awaiter(this, void 0, void 0, function* () {
                            const timeOffType = yield TimeoffTypeTenant_1.default.getInstance(tenant.id).findById({
                                _id: String(item.defaultSettings._id),
                            });
                            if (timeOffType.shortType == 'CL') {
                                item.currentAllowance = employeeBalance.casualLeave;
                            }
                            else if (timeOffType.shortType == 'SL') {
                                item.currentAllowance = employeeBalance.sickLeave;
                            }
                        }));
                        employeeBalance.statusEffect = true;
                        yield employeeBalance.save();
                        yield leaveBalance.save();
                    }));
                }
            }));
        });
    }
}
exports.default = ManageBalanceService;
//# sourceMappingURL=ManageBalanceService.js.map