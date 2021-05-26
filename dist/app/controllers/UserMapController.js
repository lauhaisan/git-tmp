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
const index_1 = __importDefault(require("@/app/config/index"));
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const { SESSION_SECRET, WEB_URL } = index_1.default;
const UserMap_1 = __importDefault(require("@/app/models/UserMap"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SaveToFileService_1 = __importDefault(require("@/app/services/SaveToFileService"));
const SendMail_1 = require("@/app/services/SendMail");
const logger_1 = __importDefault(require("@/app/utils/logger"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const CandidateTenant_1 = __importDefault(require("../models/CandidateTenant"));
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
// import PasswordRequest from '../models/PasswordRequest'
const Permission_1 = __importDefault(require("../models/Permission"));
const Role_1 = __importDefault(require("../models/Role"));
const SecurityCode_1 = __importDefault(require("../models/SecurityCode"));
const TypeTenant_1 = __importDefault(require("../models/TypeTenant"));
const Bcrypt_1 = __importDefault(require("../services/Bcrypt"));
// import { sendActiveUserEmail } from '../services/SendMail'
const TokenGenerator_1 = __importDefault(require("../services/TokenGenerator"));
class UserMapController extends AbstractController_1.default {
    constructor() {
        super();
        this.expiresIn = 60 * 60 * 8; // second * minute * hour * day
        this.tokenGenerator = new TokenGenerator_1.default(SESSION_SECRET, {
            expiresIn: this.expiresIn,
        });
        this.handleDoneLogin = this.handleDoneLogin.bind(this);
    }
    generateMethods() {
        return [
            {
                name: 'list',
                _ref: this.list.bind(this),
                authorized: false,
                type: 'POST',
            },
            {
                name: 'sign-in',
                type: 'POST',
                _ref: this.signIn.bind(this),
            },
            {
                name: 'get-by-id',
                _ref: this.getByID,
                type: 'POST',
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-current-user',
                _ref: this.getCurrentUser,
                type: 'POST',
            },
            {
                name: 'register-admin',
                _ref: this.registerAdmin,
                type: 'POST',
            },
            {
                name: 'list-admin',
                _ref: this.listAdmin.bind(this),
                type: 'POST',
            },
            {
                name: 'list-users-of-owner',
                _ref: this.listUsersOfOwner.bind(this),
                type: 'POST',
                validationSchema: {
                    company: {
                        exists: {
                            errorMessage: ['required', 'Company must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMap = yield UserMap_1.default.find({});
            res.send(new ResponseResult_1.default({
                data: userMap,
                message: 'get user map list successfully',
            }));
        });
    }
    listAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            // const userMap: any = await UserMap.find({ signInRole: { $in: ['ADMIN'] } })
            // const data = userMap.map((user: any) => {
            //   return user._id
            // })
            // const managePermission: any = await ManagePermission.find({
            //   tenant: tenantId,
            //   company: company,
            //   userMap: { $in: data },
            // })
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.tenant = tenantId;
            matchOne.$match.company = mongoose_1.Types.ObjectId(company);
            matchOne.$match.signInRole = {};
            matchOne.$match.signInRole = { $in: ['ADMIN'] };
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `usermaps`,
                        localField: 'userMap',
                        foreignField: '_id',
                        as: 'usermap',
                    },
                },
                {
                    $unwind: {
                        path: '$usermap',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    _id: 1,
                    permissionAdmin: 1,
                    permissionEmployee: 1,
                    manageLocation: 1,
                    usermap: { email: 1, _id: 1, firstName: 1 },
                },
            };
            aggregate.push(project);
            const users = yield ManagePermission_1.default.aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                data: { users },
                message: 'get user map list successfully',
            }));
        });
    }
    listUsersOfOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = req.body;
            const userOwner = yield UserMap_1.default.findById(req.user.id);
            let listUser = [];
            if (userOwner === null || userOwner === void 0 ? void 0 : userOwner.signInRole.includes("Owner")) {
                yield bluebird_1.default.map(userOwner.manageTenant, (tenant) => __awaiter(this, void 0, void 0, function* () {
                    console.log('tenant ', tenant);
                    let aggregate = [];
                    const matchOne = { $match: {} };
                    // get array id of this company's subsidiary
                    const subCompanies = lodash_1.map(yield CompanyTenant_1.default.getInstance(tenant).find({
                        childOfCompany: company,
                    }), '_id');
                    matchOne.$match.$and = [
                        { tenant },
                        {
                            $or: [
                                // The employees of this company
                                {
                                    company: mongoose_1.Types.ObjectId(company),
                                    signInRole: {
                                        $in: ['EMPLOYEE']
                                    }
                                },
                                // or administrator of this company's subsidiary
                                {
                                    company: { $in: subCompanies },
                                    signInRole: {
                                        $in: ['ADMIN']
                                    }
                                }
                            ],
                        },
                    ];
                    aggregate.push(matchOne);
                    const lookup = [
                        {
                            $lookup: {
                                from: `usermaps`,
                                localField: 'userMap',
                                foreignField: '_id',
                                as: 'usermap',
                            },
                        },
                        {
                            $unwind: {
                                path: '$usermap',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    aggregate = [...aggregate, ...lookup];
                    const project = {
                        $project: {
                            signInRole: 1,
                            company: 1,
                            tenant: 1,
                            usermap: {
                                firstName: 1,
                                email: 1,
                            },
                        },
                    };
                    aggregate.push(project);
                    const managePermission = yield ManagePermission_1.default.aggregate(aggregate);
                    listUser = [...listUser, ...managePermission];
                }));
            }
            else {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.owner',
                        message: 'User not owner.',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: { listUser },
                message: 'get user map list successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, avatar, firstName, managePermissionId, permissionAdmin, manageLocation = [] } = req.body;
            let managePermission = {};
            if (managePermissionId) {
                managePermission = yield ManagePermission_1.default.findById(managePermissionId);
                if (permissionAdmin) {
                    managePermission.permissionAdmin = permissionAdmin;
                }
                if (manageLocation) {
                    managePermission.manageLocation = manageLocation.map((item) => mongoose_1.Types.ObjectId(item));
                }
                yield managePermission.save();
            }
            let userMap = {};
            if (id) {
                userMap = yield UserMap_1.default.findById(id);
                userMap.firstName = firstName;
                userMap.avatar = avatar; // id of attachment
                yield userMap.save();
            }
            res.send(new ResponseResult_1.default({
                data: { userMap, managePermission },
                message: 'update user map successfully',
            }));
        });
    }
    getCurrentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            let user = yield UserMap_1.default.findById(req.user.id);
            if (!user) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found.',
                    },
                });
            }
            // let listCompany: any = []
            // let managePermission: any = {}
            let permissionAdmin = [];
            let permissionEmployee = [];
            let roles = [];
            let manageLocation = [];
            let location = null;
            let employee;
            if (tenantId && company) {
                if (user.manageTenant.length > 0) {
                    yield CompanyTenant_1.default.getInstance(tenantId)
                        .find({ tenant: tenantId, company: company })
                        .select('name id status dba code tenant')
                        .exec();
                    permissionAdmin = (yield Permission_1.default.find({ type: 'ADMIN' })).map((item) => item.id);
                    permissionEmployee = (yield Permission_1.default.find({ type: 'EMPLOYEE' })).map((item) => item.id);
                }
                else {
                    const managePermission = yield ManagePermission_1.default.findOne({
                        userMap: user,
                        tenant: tenantId,
                        company: company,
                    });
                    roles = managePermission.roles;
                    permissionAdmin = managePermission.permissionAdmin;
                    const roleDefault = yield Role_1.default.find({ _id: { $in: roles } });
                    let listPermission = [];
                    for (const item of roleDefault) {
                        listPermission = [...listPermission, ...item.permissions];
                    }
                    permissionEmployee = listPermission;
                    location = yield LocationTenant_1.default.getInstance(tenantId).findOne({
                        _id: managePermission.location
                    });
                    manageLocation = managePermission.manageLocation;
                    manageLocation = manageLocation.map((item) => { return mongoose_1.Types.ObjectId(item); });
                    manageLocation = yield LocationTenant_1.default.getInstance(tenantId).find({ _id: { $in: manageLocation } });
                    if (managePermission.employee) {
                        // employee = await EmployeeTenant.getInstance(managePermission.tenant).findOne({
                        //   _id: managePermission.employee,
                        // })
                        let aggregate = [];
                        const matchOne = { $match: {} };
                        matchOne.$match._id = mongoose_1.Types.ObjectId(managePermission.employee);
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
                                    from: `${tenantId}_employeetypes`,
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
                        ];
                        aggregate = [...aggregate, ...lookup];
                        const project = {
                            $project: {
                                _id: 1,
                                employeeId: 1,
                                employeeType: 1,
                                title: {
                                    _id: 1,
                                    name: 1,
                                    department: 1,
                                },
                                joinDate: 1,
                                manager: 1,
                                company: 1,
                                manageLocation: 1,
                                location: 1,
                                generalInfo: 1,
                                performanceHistory: 1,
                                compensation: 1,
                                timeSchedule: 1,
                                benefits: 1,
                                departmentTeam: 1,
                                status: 1,
                                tenant: 1,
                                department: {
                                    _id: 1,
                                    name: 1,
                                }
                            },
                        };
                        aggregate.push(project);
                        employee = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregate);
                    }
                }
            }
            let candidateData = {};
            if (user.signInRole.includes('CANDIDATE')) {
                const managePermission = yield ManagePermission_1.default.findOne({
                    userMap: user,
                });
                candidateData = yield CandidateTenant_1.default.getInstance(managePermission.tenant).findOne({
                    _id: managePermission.candidate
                });
                candidateData.tenant = managePermission.tenant;
            }
            const formatUser = JSON.parse(JSON.stringify(user));
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: Object.assign(Object.assign({}, formatUser), { permissionAdmin: permissionAdmin || [], permissionEmployee: permissionEmployee || [], roles: roles || [], manageLocation: manageLocation || [], location: location, employee: employee && employee.length > 0 ? employee[0] : {}, 
                    // candidate: {
                    //   tenant: candidateData.tenant,
                    //   ticketID: candidateData.ticketID,
                    //   company: candidateData.company,
                    //   location: candidateData.workLocation,
                    // }
                    candidate: Object.assign(Object.assign({}, JSON.parse(JSON.stringify(candidateData))), { tenant: candidateData.tenant }) }),
            }));
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const existUser = yield UserMap_1.default.findOne({
                email: email,
            });
            if (!existUser) {
                throw new AdvancedError_1.default({
                    usermap: {
                        kind: 'not.found',
                        message: 'User not found',
                    },
                });
            }
            let passportMethod = 'local';
            return passport_1.default.authenticate(passportMethod, { session: false }, (err, user, info) => {
                const errors = err || info;
                if (errors) {
                    return next({
                        statusCode: 401,
                        name: 'ValidationError',
                        errors,
                    });
                }
                req.login(user, { session: false }, (e) => __awaiter(this, void 0, void 0, function* () { return this.handleDoneLogin('Sign-in successfully', user, res, next, e); }));
            })(req, res);
        });
    }
    registerAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { company, email, firstName, tenantId, employee, permissionAdmin = [], } = body;
            let { manageLocation = [] } = body;
            manageLocation = manageLocation.map((item) => { return mongoose_1.Types.ObjectId(item); });
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
            let { password } = body;
            if (!password) {
                // password = Math.random().toString(36).slice(-8);
                password = '12345678@Tc';
            }
            // Create Tenant
            let userMap = yield UserMap_1.default.findOne({ email: email });
            if (userMap) {
                let managePermissionCheck = yield ManagePermission_1.default.findOne({
                    userMap: userMap,
                    company: company,
                    tenant: tenantId,
                    signInRole: { $in: ['ADMIN'] }
                });
                if (managePermissionCheck) {
                    throw new AdvancedError_1.default({
                        admin: { kind: 'existed', message: 'User existed.' },
                    });
                }
                userMap.signInRole.push('ADMIN');
                userMap.signInRole = [...new Set(userMap.signInRole)];
                yield userMap.save();
            }
            else {
                userMap = yield UserMap_1.default.create({
                    email: email,
                    firstName: firstName,
                    signInRole: ['ADMIN'],
                    status: 'ACTIVE',
                    password: yield new Bcrypt_1.default(password).hash(),
                });
            }
            //Create ManagePermission
            let managePermission = yield ManagePermission_1.default.findOne({
                userMap: userMap,
                company: company,
                tenant: tenantId,
            });
            if (!managePermission) {
                managePermission = yield ManagePermission_1.default.create({
                    company: companyData,
                    tenant: tenantId,
                    signInRole: ['ADMIN'],
                    userMap: userMap,
                    permissionAdmin,
                    manageLocation
                });
            }
            else {
                managePermission.signInRole.push('ADMIN');
                managePermission.permissionAdmin = permissionAdmin;
                managePermission.manageLocation = manageLocation;
            }
            if (employee) {
                managePermission.employee = employee;
            }
            yield managePermission.save();
            // sendActiveUserEmail(
            //   { email: email, fullName: firstName },
            //   [],
            //   userMap.id,
            //   `${WEB_URL}/active-user/${userMap.id}`,
            // ).catch(e => logger.warn(e))
            /*Create Code*/
            const expiredTime = 1000 * 180;
            const randomChars = '0123456789';
            let codeNumber = '';
            for (let i = 0; i < 6; i++) {
                codeNumber += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }
            let securityCode = yield SecurityCode_1.default.findOne({
                email,
            });
            if (!securityCode) {
                securityCode = yield SecurityCode_1.default.create({
                    codeNumber: codeNumber,
                    email: body.email,
                    firstName: body.firstName,
                    expiredDate: Date.now() + expiredTime,
                });
            }
            else {
                securityCode.codeNumber = codeNumber;
                securityCode.firstName = firstName;
                securityCode.expiredDate = new Date(Date.now() + expiredTime);
                yield securityCode.save();
            }
            SendMail_1.sendActiveUserEmail({ email: userMap.email, fullName: userMap.firstName }, [], userMap.id, `${WEB_URL}/active-user/${userMap.id}`, password).catch(e => logger_1.default.warn(e));
            res.send(new ResponseResult_1.default({
                message: 'Sign up Admin successfully!',
                data: {
                    id: userMap.id,
                },
            }));
        });
    }
    handleDoneLogin(message, user, res, next, err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!err && user) {
                // generate a signed son web token with the contents of user object and return it in the response
                const { tokenGenerator, expiresIn } = this;
                try {
                    const token = tokenGenerator.sign({ id: user._id });
                    // let employee: any = await UserMap.findById(user.employee)
                    // user = {
                    //   ...JSON.parse(JSON.stringify(employee)),
                    //   ...JSON.parse(JSON.stringify(user)),
                    // }
                    res.send(new ResponseResult_1.default({
                        message,
                        data: {
                            user: user,
                            types: yield TypeTenant_1.default.getInstance(user.tenant)
                                .find({ status: 'ACTIVE' })
                                .select('type')
                                .sort({ _id: 1 })
                                .exec(),
                            token,
                            expiresIn: Date.now() + 1000 * expiresIn,
                        },
                    }));
                    try {
                        swagger_ui_express_1.default.setup(SaveToFileService_1.default.swaggerConfiguration({ token }));
                    }
                    catch (err) {
                        // todo
                    }
                }
                catch (error) {
                    next(error);
                }
            }
            else
                next(err);
        });
    }
}
exports.default = new UserMapController();
//# sourceMappingURL=UserMapController.js.map