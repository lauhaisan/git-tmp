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
const Company_1 = __importDefault(require("@/app/models/Company"));
const HolidayCalendar_1 = __importDefault(require("@/app/models/HolidayCalendar"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const Country_1 = __importDefault(require("../models/Country"));
class HolidayCalendarController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'init-default',
                type: 'POST',
                _ref: this.initDefault.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
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
            },
            {
                name: 'remove-by-id',
                type: 'POST',
                _ref: this.removeById.bind(this),
                // possiblePers: ['HR'],
                validationSchema: {
                    id: {
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
                // possiblePers: ['HR'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-location',
                type: 'POST',
                _ref: this.getByLocation.bind(this),
            },
            {
                name: 'actve',
                type: 'POST',
                _ref: this.active.bind(this),
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive.bind(this),
            },
            {
                name: 'get-by-country',
                type: 'POST',
                _ref: this.getByCountry.bind(this),
            },
        ];
    }
    // public async createSettingLocation(user: any) {
    //   const currentUser = user as IUser
    //   const employee = currentUser.employee as IEmployee
    //   const existLocation = await Location.findById(employee.location)
    //   const existSettingLocation = await HolidayCalendar.findById({
    //     location: employee.location,
    //   })
    //   if (!existLocation) {
    //     throw new AdvancedError({
    //       location: {
    //         kind: 'not.found',
    //         message: 'Location not found',
    //       },
    //     })
    //   }
    //   if (existSettingLocation) {
    //     throw new AdvancedError({
    //       holidayCalendar: {
    //         kind: 'exist',
    //         message: 'Holiday calendar for this location alreay existed',
    //       },
    //     })
    //   }
    //   const data = {
    //     holiday: [
    //       {
    //         name: 'New Year Eve',
    //         range: { start: '1/1/2020', end: '1/1/2020', year: 2020, total: 1 },
    //         type: 'Restricted Holiday',
    //       },
    //       {
    //         name: 'New Year Eve',
    //         range: { start: '1/1/2020', end: '1/1/2020', year: 2020, total: 1 },
    //         type: 'Restricted Holiday',
    //       },
    //       {
    //         name: 'New Year Eve',
    //         range: { start: '1/1/2020', end: '1/1/2020', year: 2020, total: 1 },
    //         type: 'Restricted Holiday',
    //       },
    //     ],
    //     location: employee.location,
    //   }
    //   return data
    // }
    fecthData(countryCode = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://www.googleapis.com/calendar/v3/calendars/en.${countryCode}%23holiday%40group.v.calendar.google.com/events?key=AIzaSyAF20l8ukEe3i6LF0jRm70c0M47G-5U_hM`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return res.json();
        });
    }
    initDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // countryCode: vietnamese, indian, usa
            const { location, company, country, countryCode } = req.body;
            // const existData = await this.model.findOne({ company: company })
            const existData = yield this.model.findOne({ location: location });
            const existLocation = yield Location_1.default.findById(location);
            const existCompany = yield Company_1.default.findById(company);
            const existCountry = yield Country_1.default.findById(country);
            if (existData) {
                throw new AdvancedError_1.default({
                    holidaycalendar: {
                        kind: 'exists',
                        message: 'Holiday calendar for this company already existed',
                    },
                });
            }
            // if (existData_1) {
            //   throw new AdvancedError({
            //     holidaycalendar: {
            //       kind: 'exists',
            //       message: 'Holiday calendar for this company already existed',
            //     },
            //   })
            // }
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
            if (!existCountry) {
                throw new AdvancedError_1.default({
                    country: {
                        kind: 'not.found',
                        message: 'Country not found',
                    },
                });
            }
            // const data = { username: 'example' }
            const data = yield this.fecthData(countryCode);
            let newData = new HolidayCalendar_1.default({
                holiday: [],
                company: existCompany,
                location: existLocation,
                country: existCountry,
            });
            data.items.map((item) => {
                newData.holiday.push({
                    name: item.summary,
                    date: item.start.date,
                });
                return {
                    name: item.summary,
                    date: item.start.date,
                };
            });
            yield newData.save();
            res.send(new ResponseResult_1.default({
                data: newData,
                message: 'Init successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, } = req.body;
            const existHoliday = yield this.model.findOne({ location: location });
            if (!existHoliday) {
                throw new AdvancedError_1.default({
                    holiday: {
                        kind: 'exists',
                        message: 'Holiday already existed',
                    },
                });
            }
            // existHoliday.holiday.push(newHoliday)
            // await existHoliday.save()
            res.send(new ResponseResult_1.default({
                data: existHoliday,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, updateId, updateObj } = req.body;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const existLocation = yield Location_1.default.findById(employee.location);
            const holidayCalendar = yield this.model.findById(id);
            if (!holidayCalendar) {
                throw new AdvancedError_1.default({
                    holiday: {
                        kind: 'not.found',
                        message: 'Holiday not found',
                    },
                });
            }
            if (!existLocation) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found',
                    },
                });
            }
            const data = holidayCalendar.toObject();
            for (let item of data.holiday) {
                if (item._id.toString() === updateId) {
                    item = Object.assign(Object.assign({}, item), updateObj);
                }
            }
            holidayCalendar.set(Object.assign(Object.assign({}, data), updateObj));
            yield holidayCalendar.save();
            res.send(new ResponseResult_1.default({
                data: holidayCalendar,
                message: 'Updated successfully',
            }));
        });
    }
    // List
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: yield this.model.find(),
                message: 'Successfully',
            }));
            // }
        });
    }
    // Remove By Id
    removeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, removeId } = req.body;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const existLocation = yield Location_1.default.findById(employee.location);
            const existCompany = yield Company_1.default.findById(employee.company);
            const holidayCalendar = yield this.model.findById(id);
            if (!holidayCalendar) {
                throw new AdvancedError_1.default({
                    holidayCalendar: {
                        kind: 'not.found',
                        message: 'Holiday not found',
                    },
                });
            }
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
            const data = holidayCalendar.toObject();
            let { holiday } = data;
            const dataIndex = holiday.findIndex((item) => item._id.toString() === removeId);
            holiday.splice(dataIndex, 1);
            holiday = [...holiday];
            holidayCalendar.holiday = [...holiday];
            // console.log(holidayCalendar.holiday)
            // holidayCalendar.set({ holiday: holiday })
            // console.log(await this.model.find())
            yield holidayCalendar.save();
            res.send(new ResponseResult_1.default({
                message: 'Remove successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, removeList } = req.body;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const existLocation = yield Location_1.default.findById(employee.location);
            const existCompany = yield Company_1.default.findById(employee.company);
            const holidayCalendar = yield this.model.findById(id);
            if (!holidayCalendar) {
                throw new AdvancedError_1.default({
                    holidayCalendar: {
                        kind: 'not.found',
                        message: 'Holiday not found',
                    },
                });
            }
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
            const data = holidayCalendar.toObject();
            const { holiday } = data;
            for (const key of removeList) {
                const index = holiday.findIndex((item) => item._id.toString() === key);
                holiday.splice(index, 1);
            }
            holidayCalendar.set({ holiday: holiday });
            yield holidayCalendar.save();
            // await holidayCalendar.remove()
            res.send(new ResponseResult_1.default({
                data: holidayCalendar,
                message: 'Remove successfully',
            }));
        });
    }
    listByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const currentUser = user;
            if (!currentUser) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'not.found',
                        message: 'User not found',
                    },
                });
            }
            const data = yield this.model
                .find(currentUser)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data,
                message: 'List by employee successfully',
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
                    holidaycalendar: {
                        kind: 'not.found',
                        message: 'Holiday calendar not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'Successful',
            }));
        });
    }
    getByCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { country } = req.body;
            const data = yield this.model.findOne({ country: country });
            if (!data) {
                throw new AdvancedError_1.default({
                    holidaycalendar: {
                        kind: 'not.found',
                        message: 'Holiday calendar not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: data,
                message: 'Successful',
            }));
        });
    }
}
exports.default = new HolidayCalendarController(HolidayCalendar_1.default);
//# sourceMappingURL=HolidayCalendarController.js.map