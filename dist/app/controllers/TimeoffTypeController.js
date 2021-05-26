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
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const Company_1 = __importDefault(require("../models/Company"));
// import Country from '../models/Country'
const TimeoffType_1 = __importDefault(require("../models/TimeoffType"));
// import VietNamPolicy from '../inits/countryPolicyDefault'
class TimeoffTypeController extends AbstractController_1.default {
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
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                possiblePers: ['HR'],
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
    //   const defaultData = VietNamPolicy.timeOffSetting.timeoffType
    //   const currentUser = req.user as IUser
    //   const employee = currentUser.employee as IEmployee
    //   const location = await Location.findById(employee.location)
    //   const company = await Company.findById(employee.company)
    //   const country = await Country.findById(employee.location.country)
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
    //   const data = new TimeoffType({
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
            const { location, company, _id, name, type } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const timeoffType = yield this.model.findById(_id);
            const existName = yield this.model.findOne({ name, type });
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
            const existLocation = yield Location_1.default.findById(location).exec();
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const existCompany = yield Company_1.default.findById(company).exec();
            if (!existCompany) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found!',
                    },
                });
            }
            const data = yield this.model.create(req.body);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Add new successfully',
            }));
        });
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.find();
            res.send(new ResponseResult_1.default({
                data,
                message: 'List successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { _id, location, company } = req.body
            const { _id } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const timeoffType = yield this.model.findById(_id);
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
            const { location, company, _id } = req.body;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const timeoffType = yield this.model.findById(_id);
            if (!timeoffType) {
                throw new AdvancedError_1.default({
                    timeoffType: {
                        kind: 'not.found',
                        message: 'Time off type not found',
                    },
                });
            }
            const existLocation = yield Location_1.default.findById(location).exec();
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const existCompany = yield Company_1.default.findById(company).exec();
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
}
exports.default = new TimeoffTypeController(TimeoffType_1.default);
//# sourceMappingURL=TimeoffTypeController.js.map