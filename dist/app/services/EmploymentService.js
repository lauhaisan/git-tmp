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
const Candidate_1 = __importDefault(require("@/app/models/Candidate"));
// import Compensation from '@/app/models/Compensation'
// import Employee from '@/app/models/Employee'
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = __importDefault(require("lodash"));
const ChangeHistoryTenant_1 = __importDefault(require("../models/ChangeHistoryTenant"));
// import CompanyTenant from '../models/CompanyTenant'
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const Tenant_1 = __importDefault(require("../models/Tenant"));
const utils_1 = require("../utils/utils");
// import CustomEmail from '../models/CustomEmail'
class EmploymentService extends AbstractController_1.default {
    changeOnSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantList = yield Tenant_1.default.find();
            bluebird_1.default.map(tenantList, (item) => __awaiter(this, void 0, void 0, function* () {
                // const companyList = await CompanyTenant.getInstance(item.id).find()
                const pendings = yield ChangeHistoryTenant_1.default.getInstance(item.id).find({
                    takeEffect: 'WILL_UPDATE',
                });
                // console.log(pendings)
                const changes = pendings.filter(key => {
                    return key.effectiveDate < Date.now();
                });
                // console.log(changes)
                bluebird_1.default.map(changes, (changeItem) => __awaiter(this, void 0, void 0, function* () {
                    if (changeItem) {
                        const employee = yield EmployeeTenant_1.default.getInstance(item.id).findById(changeItem.employee);
                        console.log(employee);
                        if (employee) {
                            changeItem.set({ takeEffect: 'UPDATED' });
                            yield changeItem.save();
                            const compensation = yield CompensationTenant_1.default.getInstance(item.id).findById(employee.compensation._id);
                            if (compensation) {
                                compensation.set(utils_1.filterParams(changeItem.toJSON(), [
                                    '_id',
                                    'createdAt',
                                    'updatedAt',
                                    'effectiveDate',
                                    'changeDate',
                                    'takeEffect',
                                    'employee',
                                    'changedBy',
                                    'company',
                                ]));
                                yield compensation.save();
                            }
                            employee.set(utils_1.filterParams(changeItem.toJSON(), [
                                '_id',
                                'createdAt',
                                'updatedAt',
                                'effectiveDate',
                                'changeDate',
                                'takeEffect',
                                'currentAnnualCTC',
                                'employee',
                                'changedBy',
                                'company',
                            ]));
                            console.log(employee);
                            yield employee.save();
                        }
                    }
                }));
            }));
        });
    }
    updateCandidateOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            const candidates = (yield Candidate_1.default.find());
            const filteredOffer = lodash_1.default.filter(candidates, (per) => Date.parse(per.offerExpirationDate.toISOString()) > Date.now());
            const update = lodash_1.default.map(filteredOffer, (per) => ({
                updateOne: {
                    filter: { _id: per.id },
                    update: { $set: { processStatus: 'REJECT-FINAL-OFFER-CANDIDATE' } },
                    upsert: true,
                },
            }));
            yield Candidate_1.default.bulkWrite(update);
        });
    }
}
exports.default = EmploymentService;
//# sourceMappingURL=EmploymentService.js.map