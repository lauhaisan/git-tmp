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
const Compensation_1 = __importDefault(require("@/app/models/Compensation"));
const Department_1 = __importDefault(require("@/app/models/Department"));
const Document_1 = __importDefault(require("@/app/models/Document"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const GeneralInfo_1 = __importDefault(require("@/app/models/GeneralInfo"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const PerformanceHistory_1 = __importDefault(require("@/app/models/PerformanceHistory"));
const TimeSchedule_1 = __importDefault(require("@/app/models/TimeSchedule"));
const User_1 = __importDefault(require("@/app/models/User"));
const WeI9_1 = __importDefault(require("@/app/models/WeI9"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const utils_1 = require("@/app/utils/utils");
class CompanyController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
            },
            {
                name: 'get-by-id',
                _ref: this.getByID,
                type: 'POST',
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
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
                name: 'update-profile',
                type: 'POST',
                _ref: this.updateProfile,
                possiblePers: ['admin-cga'],
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
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
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
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
                possiblePers: ['admin-sa'],
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
                name: 'setup-complete',
                type: 'POST',
                _ref: this.setupComplete.bind(this),
            },
        ];
    }
    /**
     * add
     */
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Init uuid code
            body.code = yield utils_1.generateCompanyCode({ name: body.name });
            // create new company
            const company = yield this.model.create(body);
            //INIT CONFIG
            res.send(new ResponseResult_1.default({
                data: company,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const company = yield this.model.findById(id).exec();
            if (!company) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Company not found' },
                });
            }
            company.set(req.body);
            yield company.save();
            res.send(new ResponseResult_1.default({
                message: 'Update company successfully',
                data: company,
            }));
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, phone, address, contactEmail, website, logoUrl }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            // validate company:
            if (employee.company && employee.company.id !== id) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            const company = yield Company_1.default.findById(id).exec();
            if (!company) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            company.set({ id, phone, address, contactEmail, website, logoUrl });
            yield company.save();
            res.send(new ResponseResult_1.default({
                message: 'Update company successfully',
                data: company,
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            if (currentUser.email !== 'admin-sa@terralogic.com') {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission. Please login admin-sa@terralogic.com`,
                    },
                });
            }
            const item = yield Company_1.default.findById(req.body.id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield Location_1.default.deleteMany({ company: item._id });
            yield Department_1.default.deleteMany({ company: item._id });
            const employees = yield Employee_1.default.find({ company: item._id });
            for (let i = 0; i < employees.length; i++) {
                yield User_1.default.deleteOne({ employee: employees[i]._id });
                yield GeneralInfo_1.default.deleteMany({ _id: employees[i].generalInfo });
                yield PerformanceHistory_1.default.deleteMany({
                    _id: employees[i].performanceHistory,
                });
                yield TimeSchedule_1.default.deleteMany({ _id: employees[i].timeSchedule });
                yield WeI9_1.default.deleteMany({ _id: employees[i].weI9 });
                yield Compensation_1.default.deleteMany({ _id: employees[i].compensation });
                yield Document_1.default.deleteMany({ employee: employees[i]._id });
                yield User_1.default.deleteMany({ employee: employees[i]._id });
            }
            yield Employee_1.default.deleteMany({ company: item._id });
            // Validate dependencies:
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
    active(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const item = yield Company_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            item.set({ status: 'ACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    inactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const item = yield Company_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            // Update dependencies
            yield User_1.default.updateMany({ company: id }, { status: 'INACTIVE' });
            yield Location_1.default.updateMany({ company: id }, { status: 'INACTIVE' });
            // Update Company
            item.set({ status: 'INACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    setupComplete({ user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = user;
            currentUser.firstCreated = false;
            yield currentUser.save();
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
}
exports.default = new CompanyController(Company_1.default);
//# sourceMappingURL=CompanyController.js.map