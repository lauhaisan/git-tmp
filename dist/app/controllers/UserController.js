"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import config from '@/app/config/index'
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Company_1 = __importDefault(require("@/app/models/Company"));
const Department_1 = __importDefault(require("@/app/models/Department"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const User_1 = __importStar(require("@/app/models/User"));
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const ClientService_1 = __importDefault(require("@/app/services/ClientService"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
// import { sendNotificationNewEmployee } from '@/app/services/SendMail'
const constant_1 = require("@/app/utils/constant");
const lodash_1 = require("lodash");
const omit_js_1 = __importDefault(require("omit.js"));
// import AdhaarCard from '../models/AdhaarCard'
const Compensation_1 = __importDefault(require("../models/Compensation"));
const Employee_1 = __importDefault(require("../models/Employee"));
const GeneralInfo_1 = __importDefault(require("../models/GeneralInfo"));
const PasswordRequest_1 = __importDefault(require("../models/PasswordRequest"));
const PerformanceHistory_1 = __importDefault(require("../models/PerformanceHistory"));
const TimeSchedule_1 = __importDefault(require("../models/TimeSchedule"));
const SecurityCode_1 = __importDefault(require("../models/SecurityCode"));
const SendMail_1 = require("@/app/services/SendMail");
const index_1 = __importDefault(require("@/app/config/index"));
const { WEB_URL } = index_1.default;
class UserController extends AbstractController_1.default {
    constructor(model) {
        super(model);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.registerFcmToken = this.registerFcmToken.bind(this);
    }
    generateMethods() {
        return [
            {
                name: 'get-current-user',
                type: 'GET',
                _ref: this.getCurrentUser,
            },
            {
                name: 'register-fcm-token',
                type: 'POST',
                _ref: this.registerFcmToken,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-all',
                type: 'POST',
                _ref: this.listAll.bind(this),
            },
            {
                name: 'add-employee',
                type: 'POST',
                // possiblePers: ['admin-cla'],
                _ref: this.addEmployee,
                validationSchema: {
                    workEmail: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: constant_1.VALIDATE_MSG.emailValid,
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                    personalEmail: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: constant_1.VALIDATE_MSG.emailValid,
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                    firstName: {
                        isString: {
                            errorMessage: ['isString', constant_1.VALIDATE_MSG.firstNameValid],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 50,
                            },
                            errorMessage: ['max', 50, constant_1.VALIDATE_MSG.firstNameMax],
                        },
                    },
                    location: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'location must be provided'],
                        },
                    },
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'company must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-employee',
                type: 'POST',
                _ref: this.updateEmployee.bind(this),
                possiblePers: ['admin-cla'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                    permission: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'permission must be provided'],
                        },
                    },
                },
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.activeUser.bind(this),
                possiblePers: ['admin-cla'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                    permission: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'permission must be provided'],
                        },
                    },
                },
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactiveUser.bind(this),
                possiblePers: ['admin-cla'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                    permission: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'permission must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.removeUser.bind(this),
                possiblePers: ['admin-sa'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                    permission: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'permission must be provided'],
                        },
                    },
                },
            },
            {
                name: 'count-overall',
                type: 'POST',
                _ref: this.countOverall.bind(this),
                possiblePers: ['admin-sa'],
            },
            {
                name: 'import-employee',
                type: 'POST',
                _ref: this.importEmployee,
                possiblePers: ['admin-cla'],
                validationSchema: {
                    employees: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employees must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-company-code',
                type: 'POST',
                _ref: this.getCompanyCode,
                isRoot: true,
                authorized: false,
                validationSchema: {
                    email: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'email must be provided'],
                        },
                    },
                },
            },
        ];
    }
    /**
     * getCurrentUser
     */
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.default.findById(req.user._id).exec();
            let employee = yield Employee_1.default.findById(user.employee);
            user.employee = null;
            delete user['employee'];
            user = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(employee))), JSON.parse(JSON.stringify(user)));
            if (!user) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found.',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Successfully get user information',
                data: user,
            }));
        });
    }
    registerFcmToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(req.user._id).exec();
            if (!user) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found.',
                    },
                });
            }
            yield user.set('fcmToken', req.body.fcmToken).save();
            res.send(new ResponseResult_1.default({ message: 'Successfully updated fcmToken' }));
        });
    }
    /**
     * update
     */
    update({ user, body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findById(user._id).exec();
            if (!currentUser) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found.',
                    },
                });
            }
            const updateFields = omit_js_1.default(body, Object.keys(User_1.PrivateFields));
            if (updateFields.password) {
                updateFields.password = yield new Bcrypt_1.default(updateFields.password).hash();
            }
            yield currentUser.set(updateFields).save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: currentUser,
            }));
        });
    }
    /**
     * List active user
     */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { limit = 0 }, } = req;
            // const currentUser = req.user as IUser
            // const searchQ = { $regex: q, $options: 'i' }
            // Fiter by company, location and roles
            // let filter: any = this.filterByRoles(currentUser)
            // Specific case for ADMIN-CLA
            // if (currentUser.hasRoles(['ADMIN-CLA'])) {
            //   filter.location = {
            //     $in: this.getIds({ data: get(currentUser, 'manageLocations') }),
            //   }
            // }
            // filter.status = { $nin: ['INACTIVE'] } // because old data from free-version
            // Fiter by q
            // if (q) {
            //   filter.$or = [
            //     { firstName: searchQ },
            //     { lastName: searchQ },
            //     { email: searchQ },
            //   ]
            // }
            let filter = {};
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: yield User_1.default.find(filter)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .exec(),
                total: yield User_1.default.countDocuments(filter),
            }));
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { q, limit = 0, userType, location, status = [] }, } = req;
            const currentUser = req.user;
            const searchQ = { $regex: q, $options: 'i' };
            // Fiter by company, location and roles
            let filter = this.filterByRoles(currentUser);
            delete filter.location;
            if (userType === 'account') {
                // get admin list
                filter.roles = { $nin: ['EMPLOYEE'] };
            }
            else {
                filter.roles = { $in: ['EMPLOYEE'] };
                if (location) {
                    // get employee list
                    if (!(yield Location_1.default.findById(location).exec())) {
                        throw new AdvancedError_1.default({
                            company: {
                                kind: 'not.found',
                                message: 'Location not found.',
                            },
                        });
                    }
                    filter.location = location;
                }
            }
            // ADMIN-SA list ADMIN-CSA
            if (currentUser.hasRoles(['ADMIN-SA'])) {
                filter.roles = { $in: ['ADMIN-CSA'] };
            }
            // Fiter by q
            if (q) {
                filter.$or = [
                    { firstName: searchQ },
                    { lastName: searchQ },
                    { email: searchQ },
                ];
            }
            if (!lodash_1.isEmpty(status)) {
                filter.status = { $in: status };
            }
            const data = yield User_1.default.find(filter)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                message: data.length > 0 ? 'Successfully find a people' : 'User list is empty',
                data,
            }));
        });
    }
    addEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { workEmail, personalEmail, title, firstName, location, company, department, manager, employeeId = '', joinDate = '', }, } = req;
            let { body: { password = '' }, } = req;
            let { body } = req;
            if (!body.roles) {
                body.roles = ['EMPLOYEE'];
            }
            let joinDateConvert = new Date();
            if (joinDate != '') {
                joinDateConvert = new Date(joinDate);
            }
            const locationData = yield Location_1.default.findOne({
                _id: location,
            }).exec();
            if (!locationData) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found.',
                    },
                });
            }
            // Validate Company:
            const companyData = yield Company_1.default.findById(company).exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            const departmentData = yield Department_1.default.findById(department).exec();
            if (!departmentData) {
                throw new AdvancedError_1.default({
                    department: {
                        kind: 'not.found',
                        message: 'department not found.',
                    },
                });
            }
            const userCheck = yield User_1.default.findOne({ email: workEmail });
            if (userCheck) {
                throw new AdvancedError_1.default({
                    email: {
                        kind: 'existed',
                        message: 'email existed!.',
                    },
                });
            }
            const managerData = yield Employee_1.default.findById(manager);
            if (!managerData) {
                throw new AdvancedError_1.default({
                    manager: {
                        kind: 'not.found',
                        message: 'manager not found!.',
                    },
                });
            }
            const findEmployeeId = yield Employee_1.default.findOne({
                employeeId,
                company: companyData._id,
            });
            if (findEmployeeId) {
                throw new AdvancedError_1.default({
                    employeeId: {
                        kind: 'not.unique',
                        message: 'employeeId not unique!.',
                    },
                });
            }
            if (!password) {
                // password = Math.random().toString(36).slice(-8);
                password = '12345678@Tc';
            }
            // Create new user:
            const user = yield User_1.default.create({
                email: workEmail,
                status: 'ACTIVE',
                password: yield new Bcrypt_1.default(password).hash(),
                roles: body.roles,
            });
            // Create password request
            const code = Math.round(Math.random() * (999999 - 100000) + 100000);
            yield PasswordRequest_1.default.deleteMany({ code });
            yield PasswordRequest_1.default.create({
                user: user.id,
                email: user.email,
                time: new Date().getTime() + constant_1.COMMON.expiredTimeForNewMember,
                code,
                isClient: true,
            });
            const employee = yield Employee_1.default.create({
                title,
                company: companyData,
                location: locationData,
                department: departmentData,
                manager: managerData,
                employeeId: employeeId,
                joinDate: joinDateConvert,
            });
            const generalInfo = yield GeneralInfo_1.default.create({
                personalEmail,
                workEmail,
                legalName: firstName,
                firstName,
                employee,
                employeeId: employeeId,
            });
            const performanceHistory = yield PerformanceHistory_1.default.create({
                employee,
            });
            const timeSchedule = yield TimeSchedule_1.default.create({
                employee,
            });
            const compensation = yield Compensation_1.default.create({
                employee,
                company: companyData,
            });
            // const adhaarCard = await AdhaarCard.create({
            //   employee,
            // })
            employee.generalInfo = generalInfo;
            employee.performanceHistory = performanceHistory;
            employee.timeSchedule = timeSchedule;
            employee.compensation = compensation;
            yield employee.save();
            user.employee = employee;
            yield user.save();
            const randomChars = '0123456789';
            let codeNumber = '';
            for (let i = 0; i < 6; i++) {
                codeNumber += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
            yield SecurityCode_1.default.create({
                codeNumber,
                email: workEmail,
                firstName,
                expiredDate: Date.now(),
            });
            SendMail_1.sendActiveUserEmail({ email: workEmail, fullName: firstName }, [], user.id, `${WEB_URL}/active-user/${user.id}`, user.password);
            res.send(new ResponseResult_1.default({
                message: 'add user successfully.',
            }));
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { password, id }, body, } = req;
            // const currentUser = req.user as IUser
            // const { manageLocations = [] } = currentUser
            const user = yield User_1.default.findById(id).exec();
            if (!user) {
                throw new AdvancedError_1.default({
                    user: { kind: 'not.found', message: 'User not found.' },
                });
            }
            // Update password:
            if (password) {
                body.password = yield new Bcrypt_1.default(password).hash();
            }
            // Ignore fields
            const fields = this.filterParams(body, [
                'company',
                'status',
                'manageLocations',
                'roles',
                'email',
            ]);
            // Update user:
            user.set(fields);
            yield user.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully.',
                data: user,
            }));
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const item = yield User_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'User not found.' },
                });
            }
            // Validate roles:
            if (!this.hasAllowPermission({ req, data: item })) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
    activeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const item = yield User_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    user: { kind: 'not.found', message: 'User not found.' },
                });
            }
            // Validate roles:
            if (!this.hasAllowPermission({ req, data: item })) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // Validate dependencies:
            if (lodash_1.get(item, 'location.status') === 'INACTIVE') {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'location',
                        kind: 'dependencies',
                        message: `User location is inactive.`,
                    },
                });
            }
            item.set({ status: 'ACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully.',
                data: item,
            }));
        });
    }
    inactiveUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id }, } = req;
            const item = yield User_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    user: { kind: 'not.found', message: 'User not found.' },
                });
            }
            // Validate roles:
            if (!this.hasAllowPermission({ req, data: item })) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            item.set({ status: 'INACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully.',
                data: item,
            }));
        });
    }
    countOverall(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                message: 'Get infomation successfully.',
                data: {
                    totalCompanies: yield Company_1.default.countDocuments(),
                    totalUsers: yield User_1.default.countDocuments(),
                    activeCompanies: yield Company_1.default.countDocuments({ status: 'ACTIVE' }),
                    activeUsers: yield User_1.default.countDocuments({ status: 'ACTIVE' }),
                },
            }));
        });
    }
    importEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { location, employees }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            // Validate Company
            const companyData = yield Company_1.default.findById(employee.company).exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'User company not found.',
                    },
                });
            }
            let empAdd = employees;
            let emailExist = lodash_1.map(empAdd, 'employeeEmail');
            const filterQuery = {
                company: companyData.id,
                roles: ['EMPLOYEE'],
                email: { $in: emailExist },
            };
            if (currentUser.hasRoles(['ADMIN-CLA'])) {
                filterQuery.location = location;
            }
            let empUpdate = lodash_1.map(yield User_1.default.find(filterQuery), 'email');
            empUpdate = lodash_1.filter(empAdd, v => lodash_1.includes(empUpdate, v.employeeEmail));
            const resultCheck = yield ClientService_1.default.checkEmployee(empUpdate, empAdd);
            // Suite Edition Limit
            const empLimit = lodash_1.get(companyData, 'suiteEdition.employeeLimit', 0);
            if (resultCheck.empAdd.length + empUpdate.length > empLimit) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: `Suite Edition Limit ${resultCheck.empAdd.length +
                            empUpdate.length}/${empLimit}`,
                    },
                });
            }
            empAdd = lodash_1.filter(empAdd, function (p) {
                return lodash_1.includes(resultCheck.empAdd, p.employeeEmail);
            });
            empAdd = yield ClientService_1.default.syncAdd(empAdd, companyData._id);
            empUpdate = yield ClientService_1.default.syncUpdate(empUpdate, companyData._id, location);
            res.send(new ResponseResult_1.default({
                message: 'sync api successfully',
                data: {
                    newList: empAdd,
                    updateList: empUpdate,
                },
            }));
        });
    }
    getCompanyCode(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { email } = body
            //const users = await User.find({ status: 'ACTIVE', email }).exec()
            const data = {};
            //const data = users.map(item => item.company.code)
            res.send(new ResponseResult_1.default({
                message: 'Get company code successfully',
                data,
            }));
        });
    }
}
exports.default = new UserController(User_1.default);
//# sourceMappingURL=UserController.js.map