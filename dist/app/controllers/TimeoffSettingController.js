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
const Location_1 = __importDefault(require("@/app/models/Location"));
const SettingCompanyCountry_1 = __importDefault(require("@/app/models/SettingCompanyCountry"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class TimeoffSettingController extends AbstractController_1.default {
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
            const { _id } = req.body;
            const existData = yield this.model.findById(_id);
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
            if (employee.company
            // employee.company.toString() !== existData.location.company.toString()
            ) {
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
            const { id } = req.body;
            const existData = yield this.model.findById(id);
            const currentUser = req.user;
            const employee = currentUser.employee;
            const existLocation = yield Location_1.default.findById(employee.location);
            const existCompany = yield Company_1.default.findById(employee.company);
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
            if (employee.company
            // employee.company._id.toString() !==
            // existData.location.company._id.toString()
            ) {
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
exports.default = new TimeoffSettingController(SettingCompanyCountry_1.default);
//# sourceMappingURL=TimeoffSettingController.js.map