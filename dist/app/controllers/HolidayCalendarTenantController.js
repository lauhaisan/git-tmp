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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const HolidayCalendar_1 = __importDefault(require("../models/HolidayCalendar"));
const HolidayCalendarTenant_1 = __importDefault(require("../models/HolidayCalendarTenant"));
class HolidayCalendarTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
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
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, newHoliday, tenantId, country } = req.body;
            const existDefault = yield HolidayCalendar_1.default.find({
                country: country,
            });
            const existList = yield HolidayCalendarTenant_1.default.getInstance(tenantId).aggregate([
                {
                    $match: {
                        country: country,
                    },
                },
            ]);
            const existHoliday = yield HolidayCalendarTenant_1.default.getInstance(tenantId).findOne({ location: location });
            if (!existHoliday) {
                throw new AdvancedError_1.default({
                    holidaycalendar: {
                        kind: 'exists',
                        message: 'Holiday already existed',
                    },
                });
            }
            if (existDefault.length === 0) {
                throw new AdvancedError_1.default({
                    holidaycalendar: {
                        kind: 'not.found',
                        message: 'Holiday calendar default not found',
                    },
                });
            }
            if (existList.length === 0) {
                existDefault.map((item) => {
                    return Object.assign(Object.assign({}, item), { location: location });
                });
            }
            // existHoliday.holiday.push(newHoliday)
            existHoliday.set(newHoliday);
            yield existHoliday.save();
            res.send(new ResponseResult_1.default({
                data: existHoliday,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, tenantId } = req.body;
            const holidayCalendar = yield HolidayCalendarTenant_1.default.getInstance(tenantId).findById(id);
            if (!holidayCalendar) {
                throw new AdvancedError_1.default({
                    holiday: {
                        kind: 'not.found',
                        message: 'Holiday not found',
                    },
                });
            }
            holidayCalendar.set(req.body);
            yield holidayCalendar.save();
            res.send(new ResponseResult_1.default({
                data: holidayCalendar,
                message: 'Updated successfully',
            }));
        });
    }
    // List
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            res.send(new ResponseResult_1.default({
                data: yield HolidayCalendarTenant_1.default.getInstance(tenantId).find(),
                message: 'Successfully',
            }));
            // }
        });
    }
    // Remove By Id
    removeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, tenantId } = req.body;
            const holidayCalendar = yield HolidayCalendarTenant_1.default.getInstance(tenantId).findById(id);
            if (!holidayCalendar) {
                throw new AdvancedError_1.default({
                    holidayCalendar: {
                        kind: 'not.found',
                        message: 'Holiday not found',
                    },
                });
            }
            yield holidayCalendar.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { removeList, tenantId } = req.body;
            yield HolidayCalendarTenant_1.default.getInstance(tenantId).deleteMany({
                $in: removeList,
            });
            res.send(new ResponseResult_1.default({
                // data: holidayCalendar,
                message: 'Remove successfully',
            }));
        });
    }
    // protected async listByEmployee(req: Request, res: Response) {
    //   const { usertenantId } = req
    //   const currentUser = user as IUser
    //   if (!currentUser) {
    //     throw new AdvancedError({
    //       employee: {
    //         kind: 'not.found',
    //         message: 'User not found',
    //       },
    //     })
    //   }
    //   const data = await HolidayCalendarTenant.getInstance(tenantId)
    //     .find(currentUser)
    //     .sort({ createdAt: -1 })
    //     .exec()
    //   res.send(
    //     new ResponseResult({
    //       data,
    //       message: 'List by employee successfully',
    //     }),
    //   )
    // }
    getByLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { location, tenantId } = req.body;
            const data = yield HolidayCalendarTenant_1.default.getInstance(tenantId).findOne({
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
            const { country, tenantId } = req.body;
            const data = yield HolidayCalendarTenant_1.default.getInstance(tenantId).findOne({
                country: country,
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
                data: data,
                message: 'Successful',
            }));
        });
    }
}
exports.default = new HolidayCalendarTenantController();
//# sourceMappingURL=HolidayCalendarTenantController.js.map