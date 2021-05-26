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
const LocationTenant_1 = __importDefault(require("@/app/models/LocationTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
// import CountryTenant from '../models/CountryTenant'
const TimeoffTypeTenant_1 = __importDefault(require("../models/TimeoffTypeTenant"));
// import VietNamPolicy from '../inits/countryPolicyDefault'
class TimeoffTypeTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            // {
            //   name: 'init-default',
            //   type: 'POST',
            //   _ref: this.initDefault.bind(this),
            // },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    name: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Name must be provided'],
                        },
                    },
                    type: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Type must be provided'],
                        },
                    },
                    typeName: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Name of type must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
            // {
            //   name: 'get-by-location',
            //   type: 'POST',
            //   _ref: this.getByLocation.bind(this),
            // },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    // protected async initDefault(req: Request, res: Response) {
    //   const tenantId: any = req.header('tenantId')
    //   const defaultData = VietNamPolicy.timeOffSetting.timeoffType
    //   const currentUser = req.user as IUser
    //   const employee = currentUser.employee as IEmployee
    //   const location = await LocationTenant.getInstance(tenantId).findById(
    //     employee.location,
    //   )
    //   const company = await CompanyTenant.getInstance(tenantId).findById(
    //     employee.company,
    //   )
    //   const country = await CountryTenant.getInstance(tenantId).findById(
    //     employee.location.country,
    //   )
    //   if (!location) {
    //     throw new AdvancedError({
    //       location: {
    //         kind: 'not.found',
    //         message: 'Location not found',
    //       },
    //     })
    //   }
    //   if (!company) {
    //     throw new AdvancedError({
    //       company: {
    //         kind: 'not.found',
    //         message: 'Company not found',
    //       },
    //     })
    //   }
    //   if (!country) {
    //     throw new AdvancedError({
    //       country: {
    //         kind: 'not.found',
    //         message: 'Country not found',
    //       },
    //     })
    //   }
    //   const data = new (TimeoffTypeTenant.getInstance(tenantId))({
    //     timeoffType: defaultData,
    //     location,
    //     company,
    //     country,
    //   })
    //   await data.save()
    //   res.send(
    //     new ResponseResult({
    //       data,
    //       message: 'Init successfully',
    //     }),
    //   )
    // }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, location, company, _id, name, type } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const timeoffType = yield TimeoffTypeTenant_1.default.getInstance(tenantId).findById(_id);
            const existName = yield TimeoffTypeTenant_1.default.getInstance(tenantId).findOne({
                name,
                type,
            });
            if (existName) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'exists',
                        message: 'Type already existed',
                    },
                });
            }
            if (timeoffType) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'exists',
                        message: 'Time off type already existed',
                    },
                });
            }
            const existLocation = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(location)
                .exec();
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const existCompany = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(company)
                .exec();
            if (!existCompany) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found!',
                    },
                });
            }
            const data = yield TimeoffTypeTenant_1.default.getInstance(tenantId).create(req.body);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Add new successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const data = yield TimeoffTypeTenant_1.default.getInstance(tenantId).find();
            res.send(new ResponseResult_1.default({
                data,
                message: 'List successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            // const { _id, location, company } = req.body
            const { _id } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const timeoffType = yield TimeoffTypeTenant_1.default.getInstance(tenantId).findById(_id);
            if (!timeoffType) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'not.found',
                        message: 'Time off Type not found',
                    },
                });
            }
            yield timeoffType.remove();
            res.send(new ResponseResult_1.default({
                data: timeoffType,
                message: 'Remove successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, location, company, _id } = req.body;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const timeoffType = yield TimeoffTypeTenant_1.default.getInstance(tenantId).findById(_id);
            if (!timeoffType) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'not.found',
                        message: 'Time off type not found',
                    },
                });
            }
            const existLocation = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(location)
                .exec();
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const existCompany = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(company)
                .exec();
            if (!existCompany) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found!',
                    },
                });
            }
            if (employee.company &&
                employee.company._id.toString() !== location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            timeoffType.set(this.filterParams(req.body, ['location', 'company']));
            yield timeoffType.save();
            res.send(new ResponseResult_1.default({
                data: timeoffType,
                message: 'Update successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, tenantId } = req.body;
            const timeOffType = yield TimeoffTypeTenant_1.default.getInstance(tenantId).findById(_id);
            if (!timeOffType) {
                throw new AdvancedError_1.default({
                    timeofftype: {
                        kind: 'exists',
                        message: 'Time Off Type not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: timeOffType,
                message: 'Get data successfully',
            }));
        });
    }
}
exports.default = new TimeoffTypeTenantController();
//# sourceMappingURL=TimeoffTypeTenantController.js.map