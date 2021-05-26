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
// import Company from '@/app/models/Company'
const EmployeeSchedule_1 = __importDefault(require("@/app/models/EmployeeSchedule"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
// import Country from '../models/Country'
// import VietNamPolicy from '../inits/countryPolicyDefault'
class EmployeeScheduleController extends AbstractController_1.default {
    generateMethods() {
        return [
            // {
            //   name: 'init-default',
            //   type: 'POST',
            //   _ref: this.initDefault.bind(this),
            // },
            {
                name: 'init-default-from-location',
                type: 'POST',
                _ref: this.initDefaultFromLocation.bind(this),
            },
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
    // protected async initDefault(req: Request, res: Response) {
    //   const defaultData = VietNamPolicy.timeOffSetting.employeeSchedule
    //   const currentUser = req.user as IUser
    //   const employee = currentUser.employee as IEmployee
    //   const {
    //     location = employee.location,
    //     company = employee.company,
    //   } = req.body
    //   const existLocation = await Location.findById(location)
    //   const existCompany = await Company.findById(company)
    //   if (!existLocation) {
    //     throw new AdvancedError({
    //       location: {
    //         kind: 'not.found',
    //         message: 'Location not found',
    //       },
    //     })
    //   }
    //   if (!existCompany) {
    //     throw new AdvancedError({
    //       company: {
    //         kind: 'not.found',
    //         message: 'Company not found',
    //       },
    //     })
    //   }
    //   const data = new EmployeeSchedule({ location, company, defaultData })
    //   await data.save()
    //   res.send(
    //     new ResponseResult({
    //       data,
    //       message: 'Init successfully',
    //     }),
    //   )
    // }
    initDefaultFromLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location } = req.body;
            // const currentUser = req.user as IU
            const existlocation = yield Location_1.default.findById(location);
            const existData = yield this.model.findOne({ location: location });
            // const company = await Company.findById(employee.company)
            // const country = await Country.findById(employee.location.country)
            if (!existlocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            if (existData) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'exists',
                        message: 'Init default of this location already exist',
                    },
                });
            }
            const newData = new EmployeeSchedule_1.default({
                totalHour: 8,
                startWorkDay: {
                    start: '8:00',
                    amPM: 'AM',
                },
                endWorkDay: {
                    end: '17:00',
                    amPM: 'PM',
                },
                workDay: [
                    { date: 'MONDAY', checked: true },
                    { date: 'TUESDAY', checked: true },
                    { date: 'WEDNESDAY', checked: true },
                    { date: 'THURSDAY', checked: true },
                    { date: 'FRIDAY', checked: true },
                    { date: 'SATURDAY', checked: true },
                    { date: 'SUNDAY', checked: true },
                ],
                location,
            });
            res.send(new ResponseResult_1.default({
                data: yield newData.save(),
                message: 'Create data by location successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const employeeSchedule = yield this.model.findById(_id);
            if (!employeeSchedule) {
                throw new AdvancedError_1.default({
                    employeeschedule: {
                        kind: 'not.found',
                        message: 'Employee schedule not found',
                    },
                });
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
            const { _id } = req.body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            // const existLocation = await Location.findById(location)
            const employeeSchedule = yield this.model.findById(_id);
            if (!employeeSchedule) {
                throw new AdvancedError_1.default({
                    employeeschedule: {
                        kind: 'not.found',
                        message: 'Employee schedule not found',
                    },
                });
            }
            // if (!existLocation) {
            //   throw new AdvancedError({
            //     location: {
            //       kind: 'not.found',
            //       message: 'Location not found',
            //     },
            //   })
            // }
            // if (
            //   employee.company &&
            //   employee.company._id.toString() !== location.company._id.toString()
            // ) {
            //   throw new AdvancedError({
            //     method: {
            //       path: 'method',
            //       kind: 'not.permission',
            //       message: `You don't have permission.`,
            //     },
            //   })
            // }
            res.send(new ResponseResult_1.default({
                data: employeeSchedule,
                message: 'get data successfully',
            }));
        });
    }
    getByLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location } = req.body;
            const data = yield this.model.findOne({
                location: location,
            });
            if (!data) {
                throw new AdvancedError_1.default({
                    employeeschedule: {
                        kind: 'not.found',
                        message: 'Employee schedule not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'Get data by location successfully',
            }));
        });
    }
}
exports.default = new EmployeeScheduleController(EmployeeSchedule_1.default);
//# sourceMappingURL=EmployeeScheduleController.js.map