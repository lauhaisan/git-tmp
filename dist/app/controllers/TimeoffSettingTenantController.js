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
const CompanyTenant_1 = __importDefault(require("@/app/models/CompanyTenant"));
const LocationTenant_1 = __importDefault(require("@/app/models/LocationTenant"));
const SettingCompanyCountryTenant_1 = __importDefault(require("@/app/models/SettingCompanyCountryTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class TimeoffSettingTenantController extends AbstractController_1.default {
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
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { _id } = req.body;
            const existData = yield SettingCompanyCountryTenant_1.default.getInstance(tenantId).findById(_id);
            const currentUser = req.user;
            const employee = currentUser.employee;
            if (!existData) {
                throw new AdvancedError_1.default({
                    timeoffsetting: {
                        kind: 'not.found',
                        message: 'Timeoff setting not found',
                    },
                });
            }
            if (employee.company &&
                employee.company.toString() !== existData.location.company.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            existData.set(req.body);
            yield existData.save();
            res.send(new ResponseResult_1.default({
                data: existData,
                message: 'Update successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { id } = req.body;
            const existData = yield SettingCompanyCountryTenant_1.default.getInstance(tenantId).findById(id);
            const currentUser = req.user;
            const employee = currentUser.employee;
            const existLocation = yield LocationTenant_1.default.getInstance(tenantId).findById(employee.location);
            const existCompany = yield CompanyTenant_1.default.getInstance(tenantId).findById(employee.company);
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            if (!existCompany) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found',
                    },
                });
            }
            if (!existData) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'not.found',
                        message: 'Timeoff Type not found',
                    },
                });
            }
            if (employee.company &&
                employee.company._id.toString() !==
                    existData.location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // const filterHoliday = [
            //   {
            //     $sort: {
            //       holidayCalendar: [
            //         {
            //           date: -1,
            //         },
            //       ],
            //     },
            //   },
            // ]
            res.send(new ResponseResult_1.default({
                data: existData,
                message: 'Get by id successfully',
            }));
        });
    }
}
exports.default = new TimeoffSettingTenantController();
//# sourceMappingURL=TimeoffSettingTenantController.js.map