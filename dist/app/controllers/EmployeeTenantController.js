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
// import config from '@/app/config/index'
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import CompanyTenant from '@/app/models/CompanyTenant'
// import CompensationTenant from '@/app/models/CompensationTenant'
// import DepartmentTenant from '@/app/models/DepartmentTenant'
// import DocumentTenant from '@/app/models/DocumentTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import GeneralInfoTenant from '@/app/models/GeneralInfoTenant'
// import LocationTenant from '@/app/models/LocationTenant'
// import PerformanceHistoryTenant from '@/app/models/PerformanceHistoryTenant'
// import TimeScheduleTenant from '@/app/models/TimeScheduleTenant'
// import UserTenant from '@/app/models/UserTenant'
// import WeI9Tenant from '@/app/models/WeI9Tenant'
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const ClientService_1 = __importDefault(require("@/app/services/ClientService"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
// import GeneralInfo from '../models/GeneralInfo'
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const PasswordRequest_1 = __importDefault(require("../models/PasswordRequest"));
const PerformanceHistoryTenant_1 = __importDefault(require("../models/PerformanceHistoryTenant"));
const SecurityCode_1 = __importDefault(require("../models/SecurityCode"));
const TimeScheduleTenant_1 = __importDefault(require("../models/TimeScheduleTenant"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
// import UserMap from '../models/UserMap'
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
const WeI9Tenant_1 = __importDefault(require("../models/WeI9Tenant"));
const constant_1 = require("../utils/constant");
// import CompensationTenantController from './CompensationTenantController'
// const { WEB_URL } = config
class EmployeeTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.addEmployee.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'get-current-user',
                type: 'POST',
                _ref: this.getCurrentUser.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-test',
                type: 'POST',
                _ref: this.listTest.bind(this),
            },
            {
                name: 'list-employee-name',
                type: 'POST',
                _ref: this.listEmployeeName.bind(this),
            },
            {
                name: 'list-inactive',
                type: 'POST',
                _ref: this.listInactive.bind(this),
            },
            {
                name: 'list-my-team',
                type: 'POST',
                _ref: this.listMyTeam.bind(this),
            },
            {
                name: 'list-all',
                type: 'POST',
                _ref: this.listAll.bind(this),
            },
            {
                name: 'get-chart-organisation',
                type: 'POST',
                _ref: this.getChartOrganisation.bind(this),
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
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'import',
                type: 'POST',
                _ref: this.importEmployee,
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
            {
                name: 'list-manager',
                type: 'POST',
                _ref: this.listManager.bind(this),
                validationSchema: {
                    company: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Company is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Company must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list-by-department',
                type: 'POST',
                _ref: this.listByDepartment.bind(this),
                validationSchema: {
                    department: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Department is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Department must be provided'],
                        },
                    },
                },
            },
            {
                name: 'admin-list',
                type: 'POST',
                _ref: this.listEmployeeForAdmin.bind(this),
            },
            {
                name: 'get-by-employee-id',
                type: 'POST',
                _ref: this.getByEmployeeId.bind(this),
            },
            {
                name: 'employee-list',
                type: 'POST',
                _ref: this.listEmployeeBy.bind(this),
            },
            {
                name: 'searchd',
                type: 'POST',
                _ref: this.search.bind(this),
            },
            {
                name: 'add-role-manager-for-all',
                type: 'POST',
                _ref: this.addRoleManagerForAll.bind(this),
            },
            {
                name: 'add-role-employee-for-all',
                type: 'POST',
                _ref: this.addRoleEmployeeForAll.bind(this),
            },
            {
                name: 'list-administrator',
                type: 'POST',
                _ref: this.listAdministrator.bind(this),
            },
        ];
    }
    /**
     * getCurrentUser
     */
    // protected async getCurrentUser(req: Request, res: Response) {
    //   let user: any = await User.findById((req.user as IUser)._id).exec()
    //   let employee: any = await Employee.findById(user.employee)
    //   user.employee = null
    //   delete user['employee']
    //   user = {
    //     ...JSON.parse(JSON.stringify(employee)),
    //     ...JSON.parse(JSON.stringify(user)),
    //   }
    //   if (!user) {
    //     throw new AdvancedError({
    //       user: {
    //         kind: 'not.found',
    //         message: 'User not found.',
    //       },
    //     })
    //   }
    //   res.send(
    //     new ResponseResult({
    //       message: 'Successfully get user information',
    //       data: user,
    //     }),
    //   )
    // }
    registerFcmToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const user = yield UserTenant_1.default.getInstance(tenantId)
                .findById(req.user._id)
                .exec();
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
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const currentUser = req.user;
            console.log('currentUser ', currentUser);
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            const user = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(employee))), JSON.parse(JSON.stringify(currentUser)));
            if (!currentUser) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found.',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: user,
            }));
        });
    }
    getByEmployeeId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, tenantId } = req.body;
            const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                employee,
            });
            if (!generalInfo) {
                throw new AdvancedError_1.default({
                    employee: {
                        kind: 'not.found',
                        message: 'employee not found.',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: generalInfo,
            }));
        });
    }
    /**
     * List active user
     */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { 
            // limit = 0,
            // location = [],
            department = [], employeeType = [], 
            // company = [],
            name = '', status = ['ACTIVE'], company = [], location = [], }, } = req;
            let listEmployee = [];
            // let departmentId = department.map((s: string) => {
            //   return Types.ObjectId(s)
            // })
            let employeeTypeId = employeeType.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            // let locationId = location.map((s: any) => {
            //   return Types.ObjectId(s.id)
            // })
            // let companyId = company.map((s: string) => {
            //   return Types.ObjectId(s)
            // })
            let locationFilter = [];
            yield bluebird_1.default.map(company, (itemCompany) => __awaiter(this, void 0, void 0, function* () {
                yield bluebird_1.default.map(location, (itemLocation) => __awaiter(this, void 0, void 0, function* () {
                    const item = yield LocationTenant_1.default.getInstance(itemCompany.tenant).find({
                        'headQuarterAddress.country': itemLocation.country,
                        'headQuarterAddress.state': { $in: itemLocation.state },
                        company: itemCompany._id,
                    });
                    locationFilter = [...locationFilter, ...item];
                }));
                locationFilter = locationFilter.map((location) => {
                    return location._id;
                });
                if (locationFilter.length > 0) {
                    let locationId = locationFilter;
                    let aggregate = [];
                    const matchOne = { $match: {} };
                    matchOne.$match.status = { $in: status };
                    // if (departmentId.length > 0) {
                    //   matchOne.$match.department = {}
                    //   matchOne.$match.department = { $in: departmentId }
                    // }
                    matchOne.$match.location = {};
                    matchOne.$match.location = { $in: locationId };
                    if (employeeTypeId.length > 0) {
                        matchOne.$match.employeeType = {};
                        matchOne.$match.employeeType = { $in: employeeTypeId };
                    }
                    matchOne.$match.company = {};
                    matchOne.$match.company = { $in: [mongoose_1.Types.ObjectId(itemCompany._id)] };
                    aggregate.push(matchOne);
                    const lookup = [
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_companies`,
                                localField: 'company',
                                foreignField: '_id',
                                as: 'company',
                            },
                        },
                        {
                            $unwind: {
                                path: '$company',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_departments`,
                                localField: 'department',
                                foreignField: '_id',
                                as: 'department',
                            },
                        },
                        {
                            $unwind: {
                                path: '$department',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `employeetypes`,
                                localField: 'employeeType',
                                foreignField: '_id',
                                as: 'employeeType',
                            },
                        },
                        {
                            $unwind: {
                                path: '$employeeType',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_titles`,
                                localField: 'title',
                                foreignField: '_id',
                                as: 'title',
                            },
                        },
                        {
                            $unwind: {
                                path: '$title',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_generalinfos`,
                                localField: 'generalInfo',
                                foreignField: '_id',
                                as: 'generalInfo',
                            },
                        },
                        {
                            $unwind: {
                                path: '$generalInfo',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_compensations`,
                                localField: 'compensation',
                                foreignField: '_id',
                                as: 'compensation',
                            },
                        },
                        {
                            $unwind: {
                                path: '$compensation',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_locations`,
                                localField: 'location',
                                foreignField: '_id',
                                as: 'location',
                            },
                        },
                        {
                            $unwind: {
                                path: '$location',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_employees`,
                                localField: 'manager',
                                foreignField: '_id',
                                as: 'manager',
                            },
                        },
                        {
                            $unwind: {
                                path: '$manager',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${itemCompany.tenant}_generalinfos`,
                                localField: 'manager.generalInfo',
                                foreignField: '_id',
                                as: 'manager.generalInfo',
                            },
                        },
                        {
                            $unwind: {
                                path: '$manager.generalInfo',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `managepermissions`,
                                localField: '_id',
                                foreignField: 'employee',
                                as: 'managePermission',
                            },
                        },
                        {
                            $unwind: {
                                path: '$managePermission',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    aggregate = [...aggregate, ...lookup];
                    const matchTwo = { $match: {} };
                    const matchAnd = {
                        $and: [],
                    };
                    if (name !== '') {
                        matchAnd.$and.push({
                            'generalInfo.firstName': new RegExp(name, 'i'),
                        });
                    }
                    if (department.length > 0) {
                        matchAnd.$and.push({
                            'department.name': { $in: department },
                        });
                    }
                    if (name != '' || department.length > 0) {
                        matchTwo.$match = matchAnd;
                        aggregate.push(matchTwo);
                    }
                    const project = {
                        $project: {
                            employeeId: 1,
                            joinDate: 1,
                            status: 1,
                            department: { name: 1, _id: 1 },
                            location: { name: 1, _id: 1, headQuarterAddress: 1 },
                            company: { name: 1, _id: 1 },
                            title: { name: 1, _id: 1 },
                            employeeType: { name: 1, _id: 1 },
                            tenant: 1,
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                                skills: 1,
                                avatar: 1,
                                employeeId: 1,
                                workEmail: 1,
                                _id: 1,
                                personalEmail: 1,
                            },
                            manager: { _id: 1 },
                            'manager.generalInfo': {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                avatar: 1,
                                personalEmail: 1,
                            },
                            managePermission: {
                                roles: 1,
                            },
                        },
                    };
                    aggregate.push(project);
                    const employeeData = yield EmployeeTenant_1.default.getInstance(itemCompany.tenant).aggregate(aggregate);
                    listEmployee = [...listEmployee, ...employeeData];
                }
            }));
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: listEmployee,
                total: listEmployee.length,
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, tenantId } = req.body;
            let aggregate = [];
            let matchOne = { $match: {} };
            matchOne.$match._id = mongoose_1.Types.ObjectId(id);
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_compensations`,
                        localField: 'compensation',
                        foreignField: '_id',
                        as: 'compensation',
                    },
                },
                {
                    $unwind: {
                        path: '$compensation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_performancehistories`,
                        localField: 'performanceHistory',
                        foreignField: '_id',
                        as: 'performanceHistory',
                    },
                },
                {
                    $unwind: {
                        path: '$performanceHistory',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_timeschedules`,
                        localField: 'timeSchedule',
                        foreignField: '_id',
                        as: 'timeSchedule',
                    },
                },
                {
                    $unwind: {
                        path: '$timeSchedule',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_companies`,
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `employeetypes`,
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `managepermissions`,
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'managePermission',
                    },
                },
                {
                    $unwind: {
                        path: '$managePermission',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    _id: 1,
                    compensation: {
                        _id: 1,
                    },
                    manager: {
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        employee: 1,
                        legalName: 1,
                        firstName: 1,
                        lastName: 1,
                        workEmail: 1,
                        avatar: 1,
                    },
                    company: {
                        _id: 1,
                    },
                    department: {
                        _id: 1,
                        name: 1,
                    },
                    employeeId: 1,
                    employeeType: {
                        _id: 1,
                        name: 1,
                    },
                    generalInfo: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        workEmail: 1,
                    },
                    joinDate: 1,
                    location: {
                        _id: 1,
                        name: 1,
                        headQuarterAddress: 1,
                    },
                    manageLocations: 1,
                    performanceHistory: {
                        _id: 1,
                    },
                    timeSchedule: {
                        _id: 1,
                    },
                    title: 1,
                    tenant: 1,
                    status: 1,
                    managePermission: {
                        roles: 1,
                    },
                },
            };
            aggregate.push(project);
            const employeeData = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // if (!data) {
            //   throw new AdvancedError({
            //     employeetenant: {
            //       kind: 'not.found',
            //       message: 'Employee not found',
            //     },
            //   })
            // }
            res.send(new ResponseResult_1.default({
                data: employeeData[0],
                message: 'Get successfully',
            }));
        });
    }
    listTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const data = yield EmployeeTenant_1.default.getInstance(tenantId)
                .find()
                .populate({
                path: 'generalInfo',
                model: GeneralInfoTenant_1.default.getInstance(tenantId),
            });
            res.send(new ResponseResult_1.default({
                data,
                message: 'Successfully',
            }));
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { name, id } = req.body;
            const firstName = name;
            let aggregate = [];
            let matchOne = { $match: {} };
            matchOne.$match._id = mongoose_1.Types.ObjectId(id);
            aggregate.push(matchOne);
            const lookup = [
                // {
                //   $lookup: {
                //     from: 'users',
                //     localField: '_id',
                //     foreignField: 'employee',
                //     as: 'user',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$employeeType',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    employeeId: 1,
                    status: 1,
                    generalInfo: {
                        firstName: 1,
                        lastName: 1,
                        // avatar: 1,
                        employeeId: 1,
                        _id: 1,
                    },
                },
            };
            aggregate.push(project);
            const matchTwo = { $match: {} };
            if (firstName !== '') {
                const matchAnd = {
                    $and: [],
                };
                matchAnd.$and.push({
                    'generalInfo.firstName': new RegExp(firstName, 'i'),
                });
                matchTwo.$match = matchAnd;
                aggregate.push(matchTwo);
            }
            const data = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Successfully',
            }));
        });
    }
    listEmployeeName(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            // const {
            //   body: { page = 1, limit = 5, skip = 0 },
            // } = req
            let aggregate = [];
            const match = { $match: {} };
            match.$match.status = 'ACTIVE';
            const lookup = [
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$genreralInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate.push(match);
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    generalInfo: { firstName: 1, lastName: 1 },
                },
            };
            aggregate.push(project);
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // .skip((page - 1) * limit + skip)
            // .limit(limit)
            // .exec()
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
            }));
        });
    }
    listInactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const currentUser = req.user;
            const manageTenant = currentUser.manageTenant;
            const currentManageTenant = manageTenant.find((val) => val.tenant === tenantId);
            const company = [];
            currentManageTenant.company.map((val) => {
                company.push(val._id);
            });
            const { body: { 
            // limit = 0,
            location = [], department = [], employeeType = [], name = '', }, } = req;
            const firstName = name;
            let departmentId = department.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let employeeTypeId = employeeType.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let companyId = company.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.status = 'INACTIVE';
            if (departmentId.length > 0) {
                matchOne.$match.department = {};
                matchOne.$match.department = { $in: departmentId };
            }
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (employeeTypeId.length > 0) {
                matchOne.$match.employeeType = {};
                matchOne.$match.employeeType = { $in: employeeTypeId };
            }
            if (companyId.length > 0) {
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companyId };
            }
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `employeetypes`,
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_compensations`,
                        localField: 'compensation',
                        foreignField: '_id',
                        as: 'compensation',
                    },
                },
                {
                    $unwind: {
                        path: '$compensation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const matchTwo = { $match: {} };
            if (firstName !== '') {
                const matchAnd = {
                    $and: [],
                };
                matchAnd.$and.push({
                    'generalInfo.firstName': new RegExp(firstName, 'i'),
                });
                matchTwo.$match = matchAnd;
                aggregate.push(matchTwo);
            }
            const project = {
                $project: {
                    employeeId: 1,
                    joinDate: 1,
                    status: 1,
                    department: { name: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    title: { name: 1, _id: 1 },
                    employeeType: { name: 1, _id: 1 },
                    generalInfo: {
                        firstName: 1,
                        lastName: 1,
                        skills: 1,
                        avatar: 1,
                        employeeId: 1,
                        workEmail: 1,
                        _id: 1,
                    },
                    manager: { _id: 1 },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            };
            aggregate.push(project);
            const employeeData = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
            }));
        });
    }
    listMyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            const { body: { 
            // limit = 0,
            location = [], employeeType = [], name = '', }, } = req;
            const department = [];
            if (employee.department) {
                department.push(employee.department.id.toString());
            }
            const firstName = name;
            let departmentId = department.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let employeeTypeId = employeeType.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            if (departmentId.length > 0) {
                matchOne.$match.department = {};
                matchOne.$match.department = { $in: departmentId };
            }
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (employeeTypeId.length > 0) {
                matchOne.$match.employeeType = {};
                matchOne.$match.employeeType = { $in: employeeTypeId };
            }
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employeetypes',
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'titles',
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'compensations',
                        localField: 'compensation',
                        foreignField: '_id',
                        as: 'compensation',
                    },
                },
                {
                    $unwind: {
                        path: '$compensation',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const matchTwo = { $match: {} };
            if (firstName !== '') {
                const matchAnd = {
                    $and: [],
                };
                matchAnd.$and.push({
                    'generalInfo.firstName': new RegExp(firstName, 'i'),
                });
                matchTwo.$match = matchAnd;
                aggregate.push(matchTwo);
            }
            const project = {
                $project: {
                    employeeId: 1,
                    joinDate: 1,
                    status: 1,
                    department: { name: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    title: { name: 1, _id: 1 },
                    employeeType: { name: 1, _id: 1 },
                    generalInfo: {
                        firstName: 1,
                        lastName: 1,
                        skills: 1,
                        avatar: 1,
                        employeeId: 1,
                        workEmail: 1,
                        _id: 1,
                    },
                    manager: { _id: 1 },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            };
            aggregate.push(project);
            const employeeData = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
                total: employeeData.length,
            }));
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
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
                    if (!(yield LocationTenant_1.default.getInstance(tenantId)
                        .findById(location)
                        .exec())) {
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
            const data = yield UserTenant_1.default.getInstance(tenantId)
                .find(filter)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                message: data.length > 0 ? 'Successfully find a people' : 'User list is empty',
                data,
            }));
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body: { password, id }, body, } = req;
            // const currentUser = req.user as IUser
            // const { manageLocations = [] } = currentUser
            const user = yield UserTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
            const { tenantId } = req.body;
            const currentUser = req.user;
            const { body: { id }, } = req;
            if (currentUser.email !== 'admin-sa@terralogic.com') {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission. Please login admin-sa@terralogic.com`,
                    },
                });
            }
            const employee = yield EmployeeTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!employee) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'User not found.' },
                });
            }
            yield GeneralInfoTenant_1.default.getInstance(tenantId).deleteMany({
                _id: employee.generalInfo,
            });
            yield PerformanceHistoryTenant_1.default.getInstance(tenantId).deleteMany({
                _id: employee.performanceHistory,
            });
            yield TimeScheduleTenant_1.default.getInstance(tenantId).deleteMany({
                _id: employee.timeSchedule,
            });
            yield WeI9Tenant_1.default.getInstance(tenantId).deleteMany({ _id: employee.weI9 });
            yield CompensationTenant_1.default.getInstance(tenantId).deleteMany({
                _id: employee.compensation,
            });
            yield DocumentTenant_1.default.getInstance(tenantId).deleteMany({
                _employee: employee._id,
            });
            yield UserTenant_1.default.getInstance(tenantId).deleteMany({
                employee: employee._id,
            });
            yield employee.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: employee,
            }));
        });
    }
    activeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body: { id }, } = req;
            const item = yield UserTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
            const { tenantId } = req.body;
            const { body: { id }, } = req;
            const item = yield UserTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
    importEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { employees, tenantId }, } = req;
            let { body: { company = '' }, } = req;
            const companyData = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(company)
                .exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            let empAdd = employees;
            let emailExist = lodash_1.map(empAdd, 'workEmail');
            const filterQuery = {
                email: { $in: emailExist },
            };
            let empExist = lodash_1.map(yield UserMap_1.default.find(filterQuery), 'email');
            //empExist = filter(empAdd, v => includes(empExist, v.workEmail))
            empExist = [];
            const resultCheck = yield ClientService_1.default.checkEmployee(empExist, empAdd);
            empAdd = lodash_1.filter(empAdd, (p) => {
                return lodash_1.includes(resultCheck.empAdd, p.workEmail);
            });
            empAdd = yield ClientService_1.default.syncAddTenant(empAdd, tenantId, companyData._id);
            res.send(new ResponseResult_1.default({
                message: 'sync api successfully',
                data: {
                    newList: empAdd,
                    existList: empExist,
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, tenantId } = req.body;
            const employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(id);
            employee.set(req.body);
            yield employee.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: employee,
            }));
        });
    }
    listManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { company } = body;
            const department = yield DepartmentTenant_1.default.getInstance(tenantId)
                .find({
                company,
            })
                .select('_id');
            if (!department) {
                throw new AdvancedError_1.default({
                    department: { kind: 'not.found', message: 'Department not found' },
                });
            }
            const departmentId = lodash_1.map(department, (per) => per._id);
            const match = [
                {
                    $match: {
                        department: { $in: departmentId },
                    },
                },
            ];
            let aggregate = [];
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        'generalInfo.firstName': 1,
                        'generalInfo.lastName': 1,
                        'generalInfo.workEmail': 1,
                        _id: 1,
                    },
                },
            ];
            aggregate = [...match, ...lookup, ...project];
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            if (!employees) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
            }));
        });
    }
    listByDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { department } = body;
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).find({
                department,
            });
            if (!employees) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
            }));
        });
    }
    listEmployeeForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            // const currentUser = req.user as IUser
            // let employee: any = currentUser.employee as IEmployee
            // employee = await Employee.findById(currentUser.employee)
            const { body: { 
            // limit = 0,
            roles = [], company = [], location = [], department = [], employeeType = [], name = '', status = 'ACTIVE', }, } = req;
            const firstName = name;
            let departmentId = department.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let employeeTypeId = employeeType.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let companyId = company.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.status = status;
            if (departmentId.length > 0) {
                matchOne.$match.department = {};
                matchOne.$match.department = { $in: departmentId };
            }
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (employeeTypeId.length > 0) {
                matchOne.$match.employeeType = {};
                matchOne.$match.employeeType = { $in: employeeTypeId };
            }
            if (companyId.length > 0) {
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companyId };
            }
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_companies',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: '_employeetypes',
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_titles',
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const matchTwo = { $match: {} };
            if (firstName !== '' || roles.length > 0) {
                const matchAnd = {
                    $and: [],
                };
                matchAnd.$and.push({
                    'generalInfo.firstName': new RegExp(firstName, 'i'),
                });
                if (roles.length > 0) {
                    matchAnd.$and.push({
                        'user.roles': { $in: roles },
                    });
                }
                console.log('firstName   ', matchAnd);
                matchTwo.$match = matchAnd;
                aggregate.push(matchTwo);
            }
            const project = {
                $project: {
                    employeeId: 1,
                    joinDate: 1,
                    status: 1,
                    createdAt: 1,
                    user: { roles: 1, _id: 1 },
                    company: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    title: { name: 1, _id: 1 },
                    employeeType: { name: 1, _id: 1 },
                    generalInfo: {
                        firstName: 1,
                        lastName: 1,
                        skills: 1,
                        avatar: 1,
                        employeeId: 1,
                        joinDate: 1,
                        workEmail: 1,
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            };
            aggregate.push(project);
            const employeeData = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
            }));
        });
    }
    // search employee by email, name, employee ID
    listEmployeeBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body, user } = req;
            const currentUser = user;
            const { query = '', status = 'ACTIVE' } = body;
            let aggregates = [];
            const matchOne = {
                $match: {
                    status,
                },
            };
            if (!!currentUser.employee.company._id) {
                matchOne.$match.company = currentUser.employee.company._id;
            }
            const lookups = [
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: { path: '$generalInfo', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'titles',
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: { path: '$title', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: { path: '$department', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: { path: '$location', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: { path: '$manager', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const projects = {
                $project: {
                    employeeId: 1,
                    joinDate: 1,
                    status: 1,
                    createdAt: 1,
                    user: { roles: 1, _id: 1, email: 1 },
                    company: 1,
                    title: {
                        name: 1,
                        _id: 1,
                    },
                    department: {
                        name: 1,
                        _id: 1,
                    },
                    location: {
                        name: 1,
                        _id: 1,
                    },
                    generalInfo: {
                        firstName: 1,
                        lastName: 1,
                        personalNumber: 1,
                        _id: 1,
                    },
                    manager: {
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                        },
                    },
                },
            };
            let isAdminSA = false;
            if (lodash_1.includes(lodash_1.map(currentUser.roles, (per) => per._id), 'ADMIN-SA')) {
                isAdminSA = true;
            }
            if (!isAdminSA) {
                aggregates.push(matchOne);
            }
            aggregates = [...aggregates, ...lookups, projects];
            if (query !== '') {
                const matches = {
                    $match: {
                        $or: [
                            { 'generalInfo.firstName': new RegExp(query, 'i') },
                            { employeeId: new RegExp(query, 'i') },
                            { 'user.email': new RegExp(query, 'i') },
                        ],
                    },
                };
                aggregates.push(matches);
            }
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
            }));
        });
    }
    getChartOrganisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            // await Department.find({ employee: employee.compay.id })
            const employeeCSA = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(yield this.aggregateFilter([employee.company.id], [], [], false, [
                'ADMIN-CSA',
            ]));
            const employeeCLAs = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(yield this.aggregateFilter([employee.company.id], [], [], false, [
                'ADMIN-CLA',
            ]));
            for (let i = 0; i < employeeCLAs.length; i++) {
                // console.log('employeeCLAs[i].location._id', employeeCLAs[i].location._id)
                let employeeCDAs = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [], false, ['ADMIN-CDA']));
                for (let x = 0; x < employeeCDAs.length; x++) {
                    // console.log('employeeCDAs[x].department._id ', employeeCDAs[x])
                    let emmployeeLeaders = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [employeeCDAs[x].department._id], false, ['LEADER']));
                    employeeCDAs[x].children = emmployeeLeaders;
                    let employeesOfDepartment = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [employeeCDAs[x].department._id], true, ['ADMIN-CSA', 'ADMIN-CLA', 'ADMIN-CDA', 'LEADER']));
                    employeeCDAs[x].children = [
                        ...employeeCDAs[x].children,
                        ...employeesOfDepartment,
                    ];
                }
                employeeCLAs[i].children = employeeCDAs;
            }
            employeeCSA[0].children = employeeCLAs;
            // console.log('bbbb ', JSON.parse(JSON.stringify(employeeCSA)))
            // aggregate.push(project)
            // const employeeCLA = await Employee.aggregate(aggregate)
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: { chart: employeeCSA[0] },
            }));
        });
    }
    aggregateFilter(company, location, department, notInRole, role) {
        return __awaiter(this, void 0, void 0, function* () {
            let departmentId = department.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let companyId = company.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.status = 'ACTIVE';
            if (departmentId.length > 0) {
                matchOne.$match.department = {};
                matchOne.$match.department = { $in: departmentId };
            }
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (companyId.length > 0) {
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companyId };
            }
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'titles',
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const matchTwo = { $match: {} };
            const matchAnd = {
                $and: [],
            };
            if (notInRole == false) {
                matchAnd.$and.push({
                    'user.roles': { $in: role },
                });
            }
            else {
                matchAnd.$and.push({
                    'user.roles': { $nin: role },
                });
            }
            matchTwo.$match = matchAnd;
            aggregate.push(matchTwo);
            const project = {
                // $project: {
                //   user: { roles: 1, _id: 1 },
                //   company: { name: 1, _id: 1 },
                //   department: { name: 1, _id: 1 },
                //   location: { name: 1, _id: 1 },
                //   title: { name: 1, _id: 1 },
                //   generalInfo: {
                //     firstName: 1,
                //     avatar: 1,
                //     employeeId: 1,
                //     _id: 1,
                //   },
                // },
                $project: {
                    employeeId: 1,
                    joinDate: 1,
                    status: 1,
                    user: { roles: 1 },
                    department: { name: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    title: { name: 1, _id: 1 },
                    generalInfo: {
                        firstName: 1,
                        avatar: 1,
                        employeeId: 1,
                        _id: 1,
                    },
                },
            };
            aggregate.push(project);
            return aggregate;
        });
    }
    addRoleManagerForAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            // Add role MANAGER for all reporting manager
            let aggregates = [];
            const match = [
                {
                    $match: {
                        manager: { $ne: null },
                    },
                },
            ];
            const lookup = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'manager',
                        foreignField: 'employee',
                        as: 'manager.user',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'manager.user.roles': { $nin: ['MANAGER'] },
                    },
                },
            ];
            let aggregates2 = [];
            const lookup2 = [
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        $and: [
                            { 'user.roles': { $in: ['HR-MANAGER'] } },
                            { 'user.roles': { $nin: ['MANAGER'] } },
                            { manager: { $exists: true, $ne: null } },
                        ],
                    },
                },
            ];
            aggregates = [...match, ...lookup];
            aggregates2 = [...match, ...lookup2];
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            const hrManagers = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates2);
            let result = [];
            if (employees.length > 0) {
                yield bluebird_1.default.map(employees, (employee) => __awaiter(this, void 0, void 0, function* () {
                    // if (!this.EmployeeTenantModel.manager.user) {
                    //   return
                    // }
                    const employeeItem = yield UserTenant_1.default.getInstance(tenantId).findOneAndUpdate({
                        _id: employee.manager.user._id,
                        roles: { $nin: ['MANAGER'] },
                    }, {
                        $push: { roles: 'MANAGER' },
                    });
                    result.push(employeeItem);
                }));
            }
            if (hrManagers.length > 0) {
                yield bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                    if (!hrManager.user) {
                        return;
                    }
                    const hrManagerItem = yield UserTenant_1.default.getInstance(tenantId).findOneAndUpdate({
                        _id: hrManager.user._id,
                        roles: { $nin: ['MANAGER'] },
                    }, {
                        $push: { roles: 'MANAGER' },
                    });
                    result.push(hrManagerItem);
                }));
            }
            res.send(new ResponseResult_1.default({
                message: 'Add MANAGER role for all reporting manager successfully',
                data: {
                    employees,
                    hrManagers,
                    hrManagersLength: hrManagers.length,
                    result,
                    resultLength: result.length,
                },
            }));
        });
    }
    listAdministrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            // const currentUser = user as IUser
            const { company } = body;
            let aggregate = [];
            const matchOne = {
                $match: {
                    'user.roles': { $in: ['HR-GLOBAL', 'ADMIN-CSA', 'HR-MANAGER'] },
                },
            };
            const lookups = [
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                // {
                //   $unwind: {
                //     path: '$user',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'titles',
                        localField: 'title',
                        foreignField: '_id',
                        as: 'title',
                    },
                },
                {
                    $unwind: {
                        path: '$title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employeetypes',
                        localField: 'employeeType',
                        foreignField: '_id',
                        as: 'employeeType',
                    },
                },
                {
                    $unwind: {
                        path: '$employeeType',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const projects = {
                $project: {
                    _id: 1,
                    employeeId: 1,
                    status: 1,
                    department: { name: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    title: { name: 1, _id: 1 },
                    employeeType: { name: 1, _id: 1 },
                    user: { roles: 1, _id: 1 },
                    company: { _id: 1 },
                    manager: {
                        _id: 1,
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            avatar: 1,
                            personalEmail: 1,
                            workEmail: 1,
                        },
                    },
                    generalInfo: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        personalEmail: 1,
                        workEmail: 1,
                        avatar: 1,
                    },
                },
            };
            const matchTwo = {
                $match: {
                    'company._id': mongoose_1.Types.ObjectId(company),
                },
            };
            aggregate = [...lookups, projects, matchOne, matchTwo];
            const admins = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data: admins,
                message: 'List items successfully',
            }));
        });
    }
    addRoleEmployeeForAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            // Add role EMPLOYEE for all employess
            let aggregates = [];
            const lookup = [
                // Get all reporting manager information
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'user.role': { $nin: ['EMPLOYEE'] },
                    },
                },
            ];
            aggregates = [...lookup];
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            let result = [];
            if (employees.length > 0) {
                yield bluebird_1.default.map(employees, (employee) => __awaiter(this, void 0, void 0, function* () {
                    const item = yield UserTenant_1.default.getInstance(tenantId).findOneAndUpdate({
                        _id: employee.user._id,
                        roles: { $nin: ['EMPLOYEE'] },
                    }, {
                        $push: {
                            roles: 'EMPLOYEE',
                        },
                    });
                    result.push(item);
                }));
            }
            res.send(new ResponseResult_1.default({
                message: 'Add EMPLOYEE role for all employees successfully',
                data: {
                    result,
                    resultLength: result.length,
                },
            }));
        });
    }
    addEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { workEmail, personalEmail, title, firstName, location, company, manager, employeeId = '', joinDate = '', tenantId, department, employeeType, }, } = req;
            let { body: { password = '' }, } = req;
            let { body } = req;
            if (!body.roles) {
                body.roles = ['EMPLOYEE'];
            }
            let joinDateConvert = new Date();
            if (joinDate != '') {
                joinDateConvert = new Date(joinDate);
            }
            // Validate Company:
            const companyData = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(company)
                .exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            const locationData = yield LocationTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: location,
            })
                .exec();
            if (!locationData) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found.',
                    },
                });
            }
            const departmentData = yield DepartmentTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: department,
            })
                .exec();
            if (!departmentData) {
                throw new AdvancedError_1.default({
                    department: {
                        kind: 'not.found',
                        message: 'Department not found.',
                    },
                });
            }
            let userCheck = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                email: workEmail,
                company: companyData._id,
            });
            if (userCheck) {
                throw new AdvancedError_1.default({
                    email: {
                        kind: 'existed',
                        message: 'email existed!.',
                    },
                });
            }
            userCheck = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                employeeId,
                company: companyData._id,
            });
            if (userCheck) {
                throw new AdvancedError_1.default({
                    employeeId: {
                        kind: 'not.unique',
                        message: 'employeeId not unique!.',
                    },
                });
            }
            let managerData = '';
            if (manager) {
                managerData = yield EmployeeTenant_1.default.getInstance(tenantId).findOne({
                    _id: mongoose_1.Types.ObjectId(manager),
                    company: companyData._id,
                });
                if (!managerData) {
                    throw new AdvancedError_1.default({
                        manager: {
                            kind: 'not.found',
                            message: 'manager not found!.',
                        },
                    });
                }
            }
            if (!password) {
                // password = Math.random().toString(36).slice(-8);
                password = '12345678@Tc';
            }
            let userMap = yield UserMap_1.default.findOne({ email: workEmail });
            if (!userMap) {
                // Create new userMap:
                userMap = yield UserMap_1.default.create({
                    email: workEmail,
                    firstName: firstName,
                    signInRole: ['EMPLOYEE'],
                    status: 'ACTIVE',
                    password: yield new Bcrypt_1.default(password).hash(),
                });
            }
            userMap.signInRole.push('EMPLOYEE');
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
            const employee = yield EmployeeTenant_1.default.getInstance(tenantId).create({
                title,
                company: companyData,
                location: locationData,
                department: departmentData,
                employeeId: employeeId,
                joinDate: joinDateConvert,
                employeeType,
                tenant: tenantId,
            });
            if (managerData) {
                employee.manager = managerData;
                yield employee.save();
            }
            let managePermission = yield ManagePermission_1.default.findOne({
                tenant: tenantId,
                company: companyData,
                userMap: userMap,
            });
            if (managePermission) {
                managePermission.signInRole.push('EMPLOYEE');
                managePermission.signInRole = [...new Set(managePermission.signInRole)];
                managePermission.location = locationData;
                managePermission.employee = employee;
                managePermission.save();
            }
            else {
                managePermission = yield ManagePermission_1.default.create({
                    company: companyData,
                    tenant: tenantId,
                    signInRole: ['EMPLOYEE'],
                    employee: employee,
                    location: locationData,
                    roles: ['EMPLOYEE'],
                    userMap: userMap,
                });
            }
            const generalInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).create({
                personalEmail,
                workEmail,
                legalName: firstName,
                firstName,
                employee,
                employeeId: employeeId,
                company: companyData,
            });
            const performanceHistory = yield PerformanceHistoryTenant_1.default.getInstance(tenantId).create({
                employee,
            });
            const timeSchedule = yield TimeScheduleTenant_1.default.getInstance(tenantId).create({
                employee,
            });
            const compensation = yield CompensationTenant_1.default.getInstance(tenantId).create({
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
            userMap.employee = employee;
            yield userMap.save();
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
            // sendActiveUserEmail(
            //   { email: workEmail, fullName: firstName },
            //   [],
            //   user.id,
            //   `${WEB_URL}/active-user/${user.id}`,
            // )
            res.send(new ResponseResult_1.default({
                message: 'add user successfully.',
            }));
        });
    }
}
exports.default = new EmployeeTenantController();
//# sourceMappingURL=EmployeeTenantController.js.map