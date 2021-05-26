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
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Department_1 = __importDefault(require("@/app/models/Department"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const GeneralInfo_1 = __importDefault(require("@/app/models/GeneralInfo"));
const Location_1 = __importDefault(require("@/app/models/Location"));
const Title_1 = __importDefault(require("@/app/models/Title"));
const TitleTenant_1 = __importDefault(require("@/app/models/TitleTenant"));
const User_1 = __importDefault(require("@/app/models/User"));
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = __importStar(require("bluebird"));
const Compensation_1 = __importDefault(require("../models/Compensation"));
// import { sendNotificationNewEmployee } from '@/app/services/SendMail'
const lodash_1 = require("lodash");
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const EmployeeType_1 = __importDefault(require("../models/EmployeeType"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const PasswordRequest_1 = __importDefault(require("../models/PasswordRequest"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
const constant_1 = require("../utils/constant");
// import PasswordRequest from '../models/PasswordRequest'
// const { WEB_URL } = config
// import { COMMON } from '../utils/constant'
class ClientService {
    checkAPI(apiSchema, requiredKeys, isList, msgErr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default({
                method: apiSchema.method,
                url: apiSchema.route,
                data: apiSchema.body,
                header: apiSchema.header,
            })
                .then(function (response) {
                if (isList) {
                    const employees = response.data.data.employees;
                    lodash_1.forEach(employees, function (employee) {
                        if (!lodash_1.every(requiredKeys, lodash_1.partial(lodash_1.has, employee))) {
                            msgErr = 'required keys not match';
                            throw new AdvancedError_1.default({});
                        }
                    });
                }
                else {
                    if (!lodash_1.every(requiredKeys, lodash_1.partial(lodash_1.has, response.data.data.employee))) {
                        msgErr = 'required keys not match';
                        throw new AdvancedError_1.default({});
                    }
                }
            })
                .catch(function () {
                throw new AdvancedError_1.default({
                    api: {
                        kind: 'not.work',
                        message: msgErr,
                    },
                });
            });
        });
    }
    checkEmployee(empUpdate, empAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailUpdate = lodash_1.map(empUpdate, 'workEmail');
            const emailAdd = lodash_1.map(empAdd, 'workEmail');
            return {
                empAdd: lodash_1.differenceWith(emailAdd, emailUpdate, lodash_1.isEqual),
                empUpdate: lodash_1.intersectionWith(emailAdd, emailUpdate, lodash_1.isEqual),
            };
        });
    }
    syncUpdate(empSync, company, location) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultUpdate = [];
            resultUpdate = yield bluebird_1.default.map(empSync, (item) => __awaiter(this, void 0, void 0, function* () {
                const requiredKeys = ['firstName', 'employeeEmail'];
                if (requiredKeys.every(k => k in item)) {
                    let fieldUpdate = {
                        firstName: item.firstName,
                        lastName: item.lastName,
                        employeeId: item.employeeCode,
                        employeeSyncId: item.employeeId,
                        title: item.title,
                        updatedAt: Date.now(),
                    };
                    fieldUpdate = lodash_1.pickBy(fieldUpdate, lodash_1.identity);
                    yield User_1.default.updateOne({ email: item.employeeEmail, company: company, location: location }, {
                        $set: fieldUpdate,
                    });
                    item.status = 'success';
                }
                else {
                    item.status = 'failed';
                }
                return item;
            }));
            return resultUpdate;
        });
    }
    syncAdd(employeeSync, company) {
        return __awaiter(this, void 0, void 0, function* () {
            const locations = yield Location_1.default.find({ company });
            const departments = yield Department_1.default.find({ company });
            const titles = yield Title_1.default.find({ company });
            let resultAdd = [];
            resultAdd = yield bluebird_1.default.map(employeeSync, (item) => __awaiter(this, void 0, void 0, function* () {
                const requiredKeys = ['firstName', 'workEmail', 'location', 'department'];
                if (requiredKeys.every(k => k in item)) {
                    const filterLocation = yield bluebird_1.filter(locations, v => v.name === item.location);
                    const filterDepartment = yield bluebird_1.filter(departments, v => v.name === item.department);
                    const filterTitle = yield bluebird_1.filter(titles, v => v.name === item.title);
                    if (filterLocation.length > 0 && filterDepartment.length > 0) {
                        // const password = Math.random().toString(36).slice(-8);
                        const password = '12345678@Tc';
                        const user = yield User_1.default.create({
                            roles: ['EMPLOYEE'],
                            email: item.workEmail,
                            status: 'ACTIVE',
                            password: yield new Bcrypt_1.default(password).hash(),
                        });
                        // Create password request
                        // const code = Math.round(Math.random() * (999999 - 100000) + 100000)
                        // await PasswordRequest.deleteMany({ code })
                        // await PasswordRequest.create({
                        //   user: user.id,
                        //   email: user.email,
                        //   time: new Date().getTime() + COMMON.expiredTimeForNewMember,
                        //   code,
                        //   isClient: true,
                        // })
                        let title = null;
                        if (filterTitle.length) {
                            title = filterTitle[0];
                        }
                        const employee = yield Employee_1.default.create({
                            title,
                            company,
                            location: filterLocation[0],
                            department: filterDepartment[0],
                            joinDate: new Date(item.joinDate) || new Date(),
                            employeeId: item.employeeId,
                        });
                        const generalInfo = yield GeneralInfo_1.default.create({
                            personalEmail: item.personalEmail || '',
                            workEmail: item.workEmail,
                            legalName: item.firstName,
                            firstName: item.firstName,
                            employeeId: item.employeeId || '',
                            personalNumber: item.personalNumber || '',
                            employee,
                        });
                        const compensation = yield Compensation_1.default.create({
                            employee,
                            company: company,
                        });
                        // const adhaarCard = await AdhaarCard.create({
                        //   employee,
                        // })
                        employee.location = filterLocation[0];
                        employee.department = filterDepartment[0];
                        employee.generalInfo = generalInfo;
                        employee.compensation = compensation;
                        yield employee.save();
                        user.employee = employee;
                        yield user.save();
                        // const randomChars = '0123456789'
                        // let codeNumber = ''
                        // for (let i = 0; i < 6; i++) {
                        //   codeNumber += randomChars.charAt(
                        //     Math.floor(Math.random() * randomChars.length),
                        //   )
                        // }
                        // sendActiveUserEmail(
                        //   { email: workEmail, fullName: firstName },
                        //   [],
                        //   user.id,
                        //   `${WEB_URL}/active-user/${user.id}`,
                        // )
                        // item.user = user
                        // item.employee = employee
                        // item.generalInfo = generalInfo
                        item.password = password;
                        item.isAdded = true;
                        item.status = '[SUCCESS] ' + item.workEmail + ' added!';
                    }
                    else {
                        item.isAdded = false;
                        item.status = '[FAILED] - Department,  Location not found!';
                    }
                    // }
                    // const user = await User.create(data)
                    // item.status = 'success'
                    // // Create password request
                    // const code = Math.round(Math.random() * (999999 - 100000) + 100000)
                    // await PasswordRequest.deleteMany({ code })
                    // await PasswordRequest.create({
                    //   user: user.id,
                    //   email: user.email,
                    //   time: new Date().getTime() + COMMON.expiredTimeForNewMember,
                    //   code,
                    //   isClient: true,
                    // })
                    // sendNotificationNewEmployee(
                    //   { email: user.email, fullName: "" },
                    //   [],
                    //   user.company.name,
                    //   user.company.code,
                    //   user.location.name,
                    //   `${WEB_URL}/password/reset/${code}`,
                    // )
                }
                else {
                    item.isAdded = false;
                    item.status =
                        '[FAILED] - firstName, workEmail, location, department must be required!';
                }
                return item;
            }));
            const addSuccess = yield bluebird_1.filter(resultAdd, (v) => __awaiter(this, void 0, void 0, function* () {
                return v.isAdded;
            }));
            //add Manager
            yield bluebird_1.default.map(addSuccess, (item) => __awaiter(this, void 0, void 0, function* () {
                const user = yield User_1.default.findOne({ email: item.workEmail });
                const employee = yield Employee_1.default.findById(user.employee);
                const userManager = yield User_1.default.findOne({
                    email: item.managerWorkEmail,
                });
                const manager = yield Employee_1.default.findById(userManager.employee);
                if (manager) {
                    employee.manager = manager;
                    yield employee.save();
                }
            }));
            return resultAdd;
        });
    }
    loadEmployeeSync(apiSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default({
                method: apiSchema.method,
                url: apiSchema.route,
                data: apiSchema.body,
                header: apiSchema.header,
            })
                .then(function (response) {
                return response.data.data.employees;
            })
                .catch(function () {
                throw new AdvancedError_1.default({
                    api: {
                        kind: 'not.work',
                        message: 'Employee List Api not work.',
                    },
                });
            });
        });
    }
    syncAddTenant(employeeSync, tenantId, company) {
        return __awaiter(this, void 0, void 0, function* () {
            let locations = yield LocationTenant_1.default.getInstance(tenantId).find({
                company,
            });
            let departments = yield DepartmentTenant_1.default.getInstance(tenantId).find({
                company,
            });
            if (locations.length === 0) {
                let locationNames = employeeSync.map((item) => item.location);
                locationNames = [...new Set(locationNames)];
                yield bluebird_1.default.map(locationNames, (name) => __awaiter(this, void 0, void 0, function* () {
                    const location = yield LocationTenant_1.default.getInstance(tenantId).create({
                        name: name,
                        tenant: tenantId,
                        company: company,
                        headQuarterAddress: {
                            addressLine1: '',
                            addressLine2: '',
                            state: '',
                            zipCode: '',
                            country: '',
                        },
                        legalAddress: {
                            addressLine1: '',
                            addressLine2: '',
                            state: '',
                            zipCode: '',
                            country: '',
                        },
                    });
                    locations.push(location);
                }));
            }
            // const titles = await Title.find({ $or: [{ isDefault: true }, { company }] })
            let resultAdd = [];
            resultAdd = yield bluebird_1.default.map(employeeSync, (item) => __awaiter(this, void 0, void 0, function* () {
                const requiredKeys = ['firstName', 'workEmail', 'location', 'department'];
                // const requiredKeys = ['firstName', 'workEmail', 'location', 'department']
                if (requiredKeys.every(k => k in item)) {
                    const filterLocation = yield bluebird_1.filter(locations, v => v.name === item.location);
                    const filterDepartment = yield bluebird_1.filter(departments, v => v.name === item.department);
                    // const filterTitle = await filter(titles, v => v.name === item.title)
                    if (filterLocation.length > 0) {
                        const password = '12345678@Tc';
                        let userMap = yield UserMap_1.default.findOne({ email: item.workEmail });
                        if (!userMap) {
                            // Create new userMap:
                            userMap = yield UserMap_1.default.create({
                                email: item.workEmail,
                                firstName: item.firstName,
                                signInRole: ['EMPLOYEE'],
                                status: 'ACTIVE',
                                password: yield new Bcrypt_1.default(password).hash(),
                            });
                        }
                        // Create password request
                        const code = Math.round(Math.random() * (999999 - 100000) + 100000);
                        yield PasswordRequest_1.default.deleteMany({ code });
                        yield PasswordRequest_1.default.create({
                            user: userMap.id,
                            email: userMap.email,
                            time: new Date().getTime() + constant_1.COMMON.expiredTimeForNewMember,
                            code,
                            isClient: true,
                        });
                        if (item.joinDate) {
                            item.joinDate = new Date(item.joinDate);
                        }
                        let checkExistedEmployeeId = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({ company: company, employeeId: item.employeeId });
                        if (checkExistedEmployeeId) {
                            item.isAdded = false;
                            item.status = '[FAILED] - EmployeeId existed!';
                            return item;
                        }
                        let checkExistedWorkEmail = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ company: company, workEmail: item.workEmail });
                        if (checkExistedWorkEmail) {
                            item.isAdded = false;
                            item.status = '[FAILED] - workEmail existed!';
                            return item;
                        }
                        if (filterDepartment.length === 0) {
                            // Add new departments if not existed yet.
                            const department = yield DepartmentTenant_1.default.getInstance(tenantId).create({
                                name: item.department,
                                tenant: tenantId,
                                company,
                            });
                            filterDepartment.push(department);
                        }
                        let title = yield TitleTenant_1.default.getInstance(tenantId).findOne({
                            name: item.title,
                            department: filterDepartment[0]._id,
                            company
                        });
                        if (!title) { // Add corresponding Job titles as well.
                            title = yield TitleTenant_1.default.getInstance(tenantId).create({
                                name: item.title,
                                company,
                                department: filterDepartment[0]._id,
                            });
                        }
                        const employee = yield EmployeeTenant_1.default.getInstance(tenantId).create({
                            title,
                            company: company,
                            location: filterLocation[0],
                            department: filterDepartment[0],
                            employeeId: item.employeeId,
                            joinDate: item.joinDate || new Date(),
                            tenant: tenantId,
                        });
                        let managePermission = yield ManagePermission_1.default.findOne({
                            tenantId,
                            company: company,
                        });
                        if (managePermission) {
                            managePermission.signInRole.push('EMPLOYEE');
                            managePermission.signInRole = [
                                ...new Set(managePermission.signInRole),
                            ];
                            (managePermission.roles = ['EMPLOYEE']),
                                (managePermission.location = item.location);
                            managePermission.employee = employee;
                            managePermission.save();
                        }
                        else {
                            managePermission = yield ManagePermission_1.default.create({
                                company: company,
                                tenant: tenantId,
                                signInRole: ['EMPLOYEE'],
                                employee: employee,
                                location: filterLocation[0],
                                roles: ['EMPLOYEE'],
                                userMap: userMap,
                            });
                        }
                        const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).create({
                            personalEmail: item.personalEmail || '',
                            workEmail: item.workEmail,
                            legalName: item.firstName,
                            firstName: item.firstName,
                            employeeId: item.employeeId || '',
                            personalNumber: item.personalNumber || '',
                            company: company,
                            employee,
                        });
                        const compensation = yield CompensationTenant_1.default.getInstance(tenantId).create({
                            employee,
                            company: company,
                        });
                        const employeeType = yield EmployeeType_1.default.findOne({
                            name: item.employeeType
                        });
                        // const adhaarCard = await AdhaarCard.create({
                        //   employee,
                        // })
                        employee.location = filterLocation[0];
                        employee.department = filterDepartment[0];
                        employee.generalInfo = generalInfo;
                        employee.compensation = compensation;
                        employee.employeeType = employeeType;
                        yield employee.save();
                        item.password = password;
                        item.isAdded = true;
                        item.status = '[SUCCESS] ' + item.workEmail + ' added!';
                    }
                    else {
                        item.isAdded = false;
                        item.status = '[FAILED] - Location not found!';
                    }
                }
                else {
                    item.isAdded = false;
                    item.status =
                        '[FAILED] - firstName, workEmail, location, department must be required!';
                }
                return item;
            }));
            const addSuccess = yield bluebird_1.filter(resultAdd, (v) => __awaiter(this, void 0, void 0, function* () {
                return v.isAdded;
            }));
            //add Manager
            yield bluebird_1.default.map(addSuccess, (item) => __awaiter(this, void 0, void 0, function* () {
                const userMap = yield UserMap_1.default.findOne({ email: item.workEmail });
                const managePermission = yield ManagePermission_1.default.findOne({ userMap, tenant: tenantId, company });
                const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(managePermission === null || managePermission === void 0 ? void 0 : managePermission.employee);
                const userMapManager = yield UserMap_1.default.findOne({ email: item.managerWorkEmail });
                const managePermissionManager = yield ManagePermission_1.default.findOne({ userMap: userMapManager, tenant: tenantId, company });
                if (managePermissionManager) {
                    employee.manager = managePermissionManager.employee;
                    yield employee.save();
                }
            }));
            return resultAdd;
        });
    }
}
exports.default = new ClientService();
//# sourceMappingURL=ClientService.js.map