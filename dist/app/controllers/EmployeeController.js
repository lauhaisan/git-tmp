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
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const ClientService_1 = __importDefault(require("@/app/services/ClientService"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const bluebird_1 = __importDefault(require("bluebird"));
// const { WEB_URL } = config
class EmployeeController extends AbstractController_1.default {
    constructor(model) {
        super(model);
    }
    generateMethods() {
        return [
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
                name: 'list-active',
                type: 'POST',
                _ref: this.listActive.bind(this),
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
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
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
            const { employeeId } = req.body;
            console.log('employeeId', employeeId);
            const generalInfo = yield GeneralInfo_1.default.findOne({ employeeId });
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
    listActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0,
            location = [], department = [], employeeType = [], name = '', }, } = req;
            const company = [];
            company.push(employee.company.id);
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
            matchOne.$match.status = 'ACTIVE';
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
                        from: 'users',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'user',
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
                    user: { roles: 1, _id: 1 },
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
                },
            };
            aggregate.push(project);
            const employeeData = yield Employee_1.default.aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
                total: employeeData.length,
            }));
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const data = yield Employee_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Successfully',
            }));
        });
    }
    listEmployeeName(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const employees = yield Employee_1.default.aggregate(aggregate);
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
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const { body: { 
            // limit = 0,
            location = [], department = [], employeeType = [], name = '', }, } = req;
            const company = [];
            company.push(employee.company.id);
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
            const employeeData = yield Employee_1.default.aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
            }));
        });
    }
    listMyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
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
            const employeeData = yield Employee_1.default.aggregate(aggregate);
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
            const employee = yield Employee_1.default.findById(id).exec();
            if (!employee) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'User not found.' },
                });
            }
            yield GeneralInfo_1.default.deleteMany({ _id: employee.generalInfo });
            yield PerformanceHistory_1.default.deleteMany({ _id: employee.performanceHistory });
            yield TimeSchedule_1.default.deleteMany({ _id: employee.timeSchedule });
            yield WeI9_1.default.deleteMany({ _id: employee.weI9 });
            yield Compensation_1.default.deleteMany({ _id: employee.compensation });
            yield Document_1.default.deleteMany({ _employee: employee._id });
            yield User_1.default.deleteMany({ employee: employee._id });
            yield employee.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: employee,
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
    importEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { employees }, } = req;
            let { body: { company = '' }, } = req;
            const currentUser = req.user;
            let employee = currentUser.employee;
            // Validate Company
            employee = yield Employee_1.default.findById(employee).exec();
            if (company == '') {
                company = employee.company;
            }
            const companyData = yield Company_1.default.findById(company).exec();
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
            let empExist = lodash_1.map(yield User_1.default.find(filterQuery), 'email');
            empExist = lodash_1.filter(empAdd, v => lodash_1.includes(empExist, v.workEmail));
            const resultCheck = yield ClientService_1.default.checkEmployee(empExist, empAdd);
            empAdd = lodash_1.filter(empAdd, function (p) {
                return lodash_1.includes(resultCheck.empAdd, p.workEmail);
            });
            empAdd = yield ClientService_1.default.syncAdd(empAdd, companyData._id);
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
            const { id } = req.body;
            const employee = yield Employee_1.default.findById(id);
            employee.set(this.filterParams(req.body, ['company']));
            yield employee.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: employee,
            }));
        });
    }
    listManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { company } = body;
            const department = yield Department_1.default.find({ company }).select('_id');
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
                        from: 'generalinfos',
                        localField: '_id',
                        foreignField: 'employee',
                        as: 'generalinfos',
                    },
                },
                {
                    $unwind: {
                        path: '$generalinfos',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const project = [
                {
                    $project: {
                        'generalinfos.firstName': 1,
                        'generalinfos.lastName': 1,
                        _id: 1,
                    },
                },
            ];
            aggregate = [...match, ...lookup, ...project];
            const employees = yield Employee_1.default.aggregate(aggregate);
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
    listByDepartment({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { department } = body;
            const employees = yield Employee_1.default.find({ department });
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
            const employeeData = yield Employee_1.default.aggregate(aggregate);
            // console.log("employeeData ", employeeData)
            res.send(new ResponseResult_1.default({
                message: 'Find user successfully.',
                data: employeeData,
            }));
        });
    }
    // search employee by email, name, employee ID
    listEmployeeBy({ body, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const employees = yield Employee_1.default.aggregate(aggregates);
            res.send(new ResponseResult_1.default({
                data: employees,
                message: 'List items successfully',
            }));
        });
    }
    getChartOrganisation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            // await Department.find({ employee: employee.compay.id })
            const employeeCSA = yield Employee_1.default.aggregate(yield this.aggregateFilter([employee.company.id], [], [], false, [
                'ADMIN-CSA',
            ]));
            const employeeCLAs = yield Employee_1.default.aggregate(yield this.aggregateFilter([employee.company.id], [], [], false, [
                'ADMIN-CLA',
            ]));
            for (let i = 0; i < employeeCLAs.length; i++) {
                // console.log('employeeCLAs[i].location._id', employeeCLAs[i].location._id)
                let employeeCDAs = yield Employee_1.default.aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [], false, ['ADMIN-CDA']));
                for (let x = 0; x < employeeCDAs.length; x++) {
                    // console.log('employeeCDAs[x].department._id ', employeeCDAs[x])
                    let emmployeeLeaders = yield Employee_1.default.aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [employeeCDAs[x].department._id], false, ['LEADER']));
                    employeeCDAs[x].children = emmployeeLeaders;
                    let employeesOfDepartment = yield Employee_1.default.aggregate(yield this.aggregateFilter([employee.company.id], [employeeCLAs[i].location._id], [employeeCDAs[x].department._id], true, ['ADMIN-CSA', 'ADMIN-CLA', 'ADMIN-CDA', 'LEADER']));
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
            const employees = yield Employee_1.default.aggregate(aggregates);
            const hrManagers = yield Employee_1.default.aggregate(aggregates2);
            let result = [];
            if (employees.length > 0) {
                yield bluebird_1.default.map(employees, (employee) => __awaiter(this, void 0, void 0, function* () {
                    if (!employee.manager.user) {
                        return;
                    }
                    const employeeItem = yield User_1.default.findOneAndUpdate({
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
                    const hrManagerItem = yield User_1.default.findOneAndUpdate({
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
    listAdministrator({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const admins = yield Employee_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data: admins,
                message: 'List items successfully',
            }));
        });
    }
    addRoleEmployeeForAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const employees = yield Employee_1.default.aggregate(aggregates);
            let result = [];
            if (employees.length > 0) {
                yield bluebird_1.default.map(employees, (employee) => __awaiter(this, void 0, void 0, function* () {
                    const item = yield User_1.default.findOneAndUpdate({
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
}
exports.default = new EmployeeController(Employee_1.default);
//# sourceMappingURL=EmployeeController.js.map