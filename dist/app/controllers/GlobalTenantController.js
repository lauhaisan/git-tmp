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
const { SESSION_SECRET, MOBILE_URL, WEB_URL } = index_1.default;
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import CompanyTenant from '@/app/models/CompanyTenant'
// import CompensationTenant from '@/app/models/CompensationTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import GeneralInfoTenant from '@/app/models/GeneralInfoTenant'
// import LocationTenant from '@/app/models/LocationTenant'
// import TypeTenant from '@/app/models/TypeTenant'
// import UserTenant from '@/app/models/UserTenant'
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SaveToFileService_1 = __importDefault(require("@/app/services/SaveToFileService"));
const SendMail_1 = require("@/app/services/SendMail");
const TokenGeneratorTenant_1 = __importDefault(require("@/app/services/TokenGeneratorTenant"));
const constant_1 = require("@/app/utils/constant");
const logger_1 = __importDefault(require("@/app/utils/logger"));
const utils_1 = require("@/app/utils/utils");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mobile_detect_1 = __importDefault(require("mobile-detect"));
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const Department_1 = __importDefault(require("../models/Department"));
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
// import CompensationTenant from '../models/CompensationTenant'
// import EmployeeTenant from '../models/EmployeeTenant'
// import GeneralInfoTenant from '../models/GeneralInfoTenant'
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const PasswordRequestTenant_1 = __importDefault(require("../models/PasswordRequestTenant"));
const SecurityCode_1 = __importDefault(require("../models/SecurityCode"));
// import PasswordRequestTenant from '../models/PasswordRequestTenant'
// import SecurityCodeTenant from '../models/SecurityCodeTenant'
const Template_1 = __importDefault(require("../models/Template"));
const TemplateTenant_1 = __importDefault(require("../models/TemplateTenant"));
const Tenant_1 = __importDefault(require("../models/Tenant"));
const TimeoffType_1 = __importDefault(require("../models/TimeoffType"));
const TimeoffTypeTenant_1 = __importDefault(require("../models/TimeoffTypeTenant"));
const Title_1 = __importDefault(require("../models/Title"));
const TitleTenant_1 = __importDefault(require("../models/TitleTenant"));
// import TypeTenant from '../models/TypeTenant'
const UserMap_1 = __importDefault(require("../models/UserMap"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
class GlobalTenantController extends AbstractController_1.default {
    constructor() {
        super();
        this.expiresIn = 60 * 60 * 8; // second * minute * hour * day
        this.tokenGenerator = new TokenGeneratorTenant_1.default(SESSION_SECRET, {
            expiresIn: this.expiresIn,
        });
        this.handleDoneLogin = this.handleDoneLogin.bind(this);
    }
    generateMethods() {
        return [
            {
                name: 'login',
                isRoot: true,
                _ref: this.loginAdmin.bind(this),
                authorized: false,
                type: 'POST',
                validationSchema: {
                    email: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: ['isEmail', constant_1.VALIDATE_MSG.emailValid],
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                    password: {
                        exists: {
                            errorMessage: ['required', constant_1.VALIDATE_MSG.passRequire],
                        },
                    },
                },
                swagger: [
                    { name: 'email', type: 'email', required: true },
                    { name: 'password', type: 'string', required: true },
                ],
            },
            {
                name: 'login-client',
                isRoot: true,
                _ref: this.loginClient.bind(this),
                authorized: false,
                type: 'POST',
                validationSchema: {
                    email: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: ['isEmail', constant_1.VALIDATE_MSG.emailValid],
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                    password: {
                        exists: {
                            errorMessage: ['required', constant_1.VALIDATE_MSG.passRequire],
                        },
                    },
                },
                swagger: [
                    { name: 'email', type: 'email', required: true },
                    { name: 'password', type: 'string', required: true },
                ],
            },
            {
                name: 'sign-in-tenant',
                isRoot: true,
                _ref: this.signIn.bind(this),
                type: 'POST',
                authorized: false,
            },
            {
                name: 'sign-in-third-party',
                isRoot: true,
                _ref: this.signInThirdParty.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    email: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: ['isEmail', constant_1.VALIDATE_MSG.emailValid],
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                },
            },
            {
                name: 'refresh-token',
                isRoot: true,
                _ref: this.routeRefreshToken.bind(this),
                type: 'POST',
                authorized: true,
                ignoreExpiration: true,
            },
            {
                name: 'sign-up',
                isRoot: true,
                _ref: this.postSignup.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    email: {
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
                    password: {
                        isString: {
                            errorMessage: ['required', constant_1.VALIDATE_MSG.passRequire],
                        },
                        isLength: {
                            options: {
                                min: 6,
                            },
                            errorMessage: ['min', 6, constant_1.VALIDATE_MSG.passMin],
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
                },
            },
            {
                name: 'security-register-tenant',
                isRoot: true,
                _ref: this.securityRegister.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    email: {
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
                },
            },
            {
                name: 'check-security-register-tenant',
                isRoot: true,
                _ref: this.checkSecurityRegister.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    codeNumber: {
                        isString: {
                            errorMessage: ['isString', 'code number not String'],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 6,
                            },
                            errorMessage: ['max', 50, 'code number max 6'],
                        },
                    },
                },
            },
            {
                name: 'resend-security-register',
                isRoot: true,
                _ref: this.resendCodeSecurityRegister.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    codeNumber: {
                        isString: {
                            errorMessage: ['isString', 'code number not String'],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 6,
                            },
                            errorMessage: ['max', 50, 'code number max 6'],
                        },
                    },
                },
            },
            {
                name: 'active-user-security-register-tenant',
                isRoot: true,
                _ref: this.activeUser.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    id: {
                        isString: {
                            errorMessage: ['isString', 'id not string'],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 100,
                            },
                            errorMessage: ['max', 50, 'id not empty string'],
                        },
                    },
                },
            },
            // {
            //   name: 'sign-up-check-email',
            //   isRoot: true,
            //   _ref: this.signUpAdminCheckEmail.bind(this),
            //   type: 'POST',
            //   authorized: false,
            //   validationSchema: {
            //     email: {
            //       in: 'body',
            //       exists: {
            //         errorMessage: ['required', 'email must be provided'],
            //       },
            //     },
            //   },
            // },
            {
                name: 'sign-up-admin-tenant',
                isRoot: true,
                _ref: this.signUpAdminTenant.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    codeNumber: {
                        isString: {
                            errorMessage: ['isString', constant_1.VALIDATE_MSG.firstNameValid],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 6,
                            },
                            errorMessage: ['max', 50, constant_1.VALIDATE_MSG.firstNameMax],
                        },
                    },
                },
            },
            {
                name: 'password/recover',
                isRoot: true,
                _ref: this.routeRecoverPassword.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    email: {
                        normalizeEmail: true,
                        isEmail: {
                            errorMessage: ['isEmail', constant_1.VALIDATE_MSG.emailValid],
                        },
                        isLength: {
                            options: {
                                max: 255,
                            },
                            errorMessage: ['max', 255, constant_1.VALIDATE_MSG.emailMax],
                        },
                    },
                },
            },
            {
                name: 'password/reset',
                isRoot: true,
                _ref: this.routeResetPassword.bind(this),
                type: 'POST',
                authorized: false,
                validationSchema: {
                    password: {
                        exists: {
                            errorMessage: ['required', constant_1.VALIDATE_MSG.passRequire],
                        },
                        isLength: {
                            options: {
                                min: 6,
                            },
                            errorMessage: ['min', 6, constant_1.VALIDATE_MSG.passMin],
                        },
                    },
                    code: {
                        exists: {
                            errorMessage: ['required', 'code must be provided'],
                        },
                    },
                },
            },
            {
                name: 'password-update',
                isRoot: true,
                _ref: this.routeUpdatePassword.bind(this),
                type: 'POST',
                authorized: true,
                validationSchema: {
                    oldPassword: {
                        isString: {
                            errorMessage: ['isString', 'id not string'],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 50,
                            },
                            errorMessage: ['max', 50, 'id not empty string'],
                        },
                    },
                    newPassword: {
                        isString: {
                            errorMessage: ['isString', 'id not string'],
                        },
                        trim: {
                            options: ' ',
                        },
                        isLength: {
                            options: {
                                max: 50,
                            },
                            errorMessage: ['max', 50, 'id not empty string'],
                        },
                    },
                },
            },
            {
                name: 'redirect/:path',
                isRoot: true,
                _ref: this.redirect,
                type: 'GET',
                authorized: false,
            },
            {
                name: 'sign-up-valid-company',
                type: 'POST',
                _ref: this.signUpValidCompany.bind(this),
                isRoot: true,
                authorized: false,
                validationSchema: {
                    name: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company Name must be provided'],
                        },
                    },
                    address: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company Address must be provided'],
                        },
                    },
                    phone: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company Phone must be provided'],
                        },
                    },
                },
            },
            {
                name: 'sign-up-valid-location',
                type: 'POST',
                _ref: this.signUpValidLocation.bind(this),
                isRoot: true,
                authorized: false,
                validationSchema: {
                    name: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Location Name must be provided'],
                        },
                    },
                },
            },
            {
                name: 'sign-up-valid-admin',
                type: 'POST',
                _ref: this.signUpValidAdmin.bind(this),
                isRoot: true,
                authorized: false,
                validationSchema: {
                    email: {
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
                },
            },
        ];
    }
    routeRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            yield this.handleDoneLogin('Refresh tokken successfully', user, res, next);
        });
    }
    loginAdmin(req, res, next) {
        const passportMethod = 'admincp';
        req.body.email = req.body.email.toLowerCase();
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
    }
    loginClient(req, res, next) {
        const passportMethod = 'local';
        req.body.email = req.body.email.toLowerCase();
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
    }
    securityRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const tenantId: any = req.header('tenantId')
            const { body } = req;
            const expiredTime = 1000 * 180;
            const { email, firstName } = body;
            const checkEmailUser = yield UserMap_1.default.findOne({
                email,
            });
            if (checkEmailUser) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'email',
                        kind: 'email.existed',
                        message: `email existed.`,
                    },
                });
            }
            /*Create Code*/
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
            SendMail_1.sendSecurityRegisterCodeEmail({ email, fullName: firstName }, [], codeNumber, `${WEB_URL}/security-code/${codeNumber}`).catch(e => logger_1.default.warn(e));
            res.send(new ResponseResult_1.default({
                message: 'send email successfully!',
                data: {
                    securityCode,
                },
            }));
        });
    }
    resendCodeSecurityRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const expiredTime = 1000 * 180;
            let { codeNumber } = body;
            let securityCode = yield SecurityCode_1.default.findOne({
                codeNumber,
            });
            if (securityCode) {
                const randomChars = '0123456789';
                codeNumber = '';
                for (let i = 0; i < 6; i++) {
                    codeNumber += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                securityCode.codeNumber = codeNumber;
                securityCode.expiredDate = new Date(Date.now() + expiredTime);
                yield securityCode.save();
            }
            else {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'securityCode',
                        kind: 'securityCode.not.existed',
                        message: `security code not existed.`,
                    },
                });
            }
            SendMail_1.sendSecurityRegisterCodeEmail({ email: securityCode.email, fullName: securityCode.firstName }, [], codeNumber, `${WEB_URL}/security-code/${codeNumber}`).catch(e => logger_1.default.warn(e));
            res.send(new ResponseResult_1.default({
                message: 'send email successfully!',
                data: {
                    securityCode,
                },
            }));
        });
    }
    checkSecurityRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { codeNumber } = body;
            let result = false;
            let message = 'Code invalid!';
            const securityCode = yield SecurityCode_1.default.findOne({
                codeNumber,
            }).sort({
                expiredDate: -1,
            });
            if (securityCode) {
                if (securityCode.expiredDate.getTime() - Date.now() > 0) {
                    result = true;
                    message = 'Check code success!';
                }
                else {
                    message = 'Code expired!';
                }
            }
            res.send(new ResponseResult_1.default({
                message,
                data: {
                    securityCode,
                    result,
                },
            }));
        });
    }
    activeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id } = body;
            let result = false;
            let message = '';
            const user = yield UserMap_1.default.findById(id);
            if (user) {
                const securityCode = yield SecurityCode_1.default.findOne({
                    email: user.email,
                });
                if (securityCode) {
                    user.status = 'ACTIVE';
                    yield user.save();
                    yield securityCode.remove();
                    result = true;
                    message = 'Account active!';
                }
                else {
                    result = false;
                    message = 'Oops, link active account is expired!';
                }
                res.send(new ResponseResult_1.default({
                    message,
                    data: {
                        result,
                    },
                }));
            }
        });
    }
    // private async signUpAdminCheckEmail(req: Request, res: Response) {
    //   // const tenantId: any = req.header('tenantId')
    //   const { body } = req
    //   const expiredTime = 1000 * 180
    //   const { email, firstName } = body
    //   const checkEmailUser = await UserMap.findOne({
    //     email,
    //   })
    //   if (checkEmailUser) {
    //     throw new AdvancedError({
    //       method: {
    //         path: 'email',
    //         kind: 'email.existed',
    //         message: `email existed.`,
    //       },
    //     })
    //   }
    //   /*Create Code*/
    //   const randomChars = '0123456789'
    //   let codeNumber = ''
    //   for (let i = 0; i < 6; i++) {
    //     codeNumber += randomChars.charAt(
    //       Math.floor(Math.random() * randomChars.length),
    //     )
    //   }
    //   let securityCode = await SecurityCode.findOne({
    //     email,
    //   })
    //   if (!securityCode) {
    //     securityCode = await SecurityCode.create({
    //       codeNumber: codeNumber,
    //       email: body.email,
    //       firstName: body.firstName,
    //       expiredDate: Date.now() + expiredTime, //(12 hour)
    //     })
    //   } else {
    //     securityCode.codeNumber = codeNumber
    //     securityCode.firstName = firstName
    //     securityCode.expiredDate = new Date(Date.now() + expiredTime)
    //     await securityCode.save()
    //   }
    //   sendSecurityRegisterCodeEmail(
    //     { email, fullName: firstName },
    //     [],
    //     codeNumber,
    //     `${WEB_URL}/security-code/${codeNumber}`,
    //   ).catch(e => logger.warn(e))
    //   res.send(
    //     new ResponseResult({
    //       message: 'send email successfully!',
    //       data: {
    //         securityCode,
    //       },
    //     }),
    //   )
    // }
    signUpAdminTenant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { codeNumber, company, user, locations = [] } = body;
            const securityCode = yield SecurityCode_1.default.findOne({ codeNumber });
            if (!securityCode) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'securityCode',
                        kind: 'securityCode.not.existed',
                        message: `security code not existed.`,
                    },
                });
            }
            /*****************************
            Data must be valid
            Step 1: Create Company
            Step 2: Create Location
            Step 3: Create User
                    Create Password
            Step 4: Create Employee (info)
                    Employee will belong default location, which create first
            Step 5: Create GeneralInfo, Compensation
            ********************************/
            // Create Tenant
            const findEmail = yield UserMap_1.default.findOne({ email: user.email });
            if (findEmail) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'existed',
                        message: 'User existed',
                    },
                });
            }
            const tenantId = '_' +
                Math.random()
                    .toString(36)
                    .substr(2, 5);
            const tenantCreate = yield Tenant_1.default.create({
                id: tenantId,
            });
            if (!tenantCreate) {
                throw new AdvancedError_1.default({
                    method: {
                        kind: 'create.tenant.failed',
                        message: `Failed to create new tenant.`,
                    },
                });
            }
            // Create Company
            // console.log('Create Company ')
            const codeCompany = yield utils_1.generateCompanyCode({ name: company.name });
            // let locationsCreate: any = []
            const companyCreate = yield CompanyTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, company), { code: codeCompany, tenant: tenantId }));
            // Create UserMap
            // console.log('Create UserMap ')
            const userCreate = yield UserMap_1.default.create({
                email: user.email,
                manageTenant: [tenantId],
                password: yield new Bcrypt_1.default(user.password).hash(),
                firstName: user.firstName,
                signInRole: ['Owner'],
                status: 'ACTIVE',
            });
            //Create ManagePermission
            // Create Location
            // console.log('Create Location ')
            yield bluebird_1.default.map(locations, (location = {}) => __awaiter(this, void 0, void 0, function* () {
                return yield LocationTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, location), { company: companyCreate, tenant: tenantId }));
            }));
            let departmentDefaults = yield Department_1.default.find({});
            departmentDefaults = departmentDefaults.map((obj) => ({
                name: obj.name,
                status: obj.status,
                tenant: tenantId,
                company: companyCreate._id,
            }));
            try {
                departmentDefaults = yield DepartmentTenant_1.default.getInstance(tenantId).insertMany(departmentDefaults);
            }
            catch (e) {
                console.log(e);
            }
            try {
                let jobTitles = [];
                let jobTitleDefaults = yield Title_1.default.find({});
                yield bluebird_1.default.map(jobTitleDefaults, (jobTitle = {}) => __awaiter(this, void 0, void 0, function* () {
                    const departmentJobTitle = departmentDefaults.filter((item) => {
                        if (jobTitle.departmentName === item.name) {
                            return item;
                        }
                    });
                    if (departmentJobTitle.length > 0) {
                        const jobTitleTenant = {
                            company: companyCreate._id,
                            department: departmentJobTitle[0]._id,
                            name: jobTitle.name,
                        };
                        jobTitles.push(jobTitleTenant);
                    }
                }));
                jobTitles = yield TitleTenant_1.default.getInstance(tenantId).insertMany(jobTitles);
            }
            catch (e) {
                console.log(e);
            }
            try {
                let listTimeOffType = [];
                let timeOffTypeDefault = yield TimeoffType_1.default.find();
                yield bluebird_1.default.map(timeOffTypeDefault, (item = {}) => {
                    listTimeOffType.push({
                        company: companyCreate._id,
                        baseAccrual: item.baseAccrual,
                        accrualSchedule: item.accrualSchedule,
                        maxBalance: item.maxBalance,
                        negativeBalance: item.negativeBalance,
                        annualReset: item.annualReset,
                        carryoverCap: item.carryoverCap,
                        waitingPeriod: item.waitingPeriod,
                        minIncrements: item.minIncrements,
                        hireProbation: item.hireProbation,
                        tenureAccrual: item.tenureAccrual,
                        name: item.name,
                        type: item.type,
                        shortType: item.shortType,
                        typeName: item.typeName,
                        description: item.description,
                    });
                    return item;
                });
                yield TimeoffTypeTenant_1.default.getInstance(tenantId).insertMany(listTimeOffType);
            }
            catch (error) {
                console.log(error);
            }
            // create template default
            const templateDefaults = yield Template_1.default.find();
            yield TemplateTenant_1.default.getInstance(tenantId).insertMany(templateDefaults);
            SendMail_1.sendActiveUserEmail({ email: user.email, fullName: user.firstName }, [], user.id, `${WEB_URL}/active-user/${user.id}`, user.password).catch(e => logger_1.default.warn(e));
            res.send(new ResponseResult_1.default({
                message: 'Sign up Admin successfully!',
                data: {
                    id: userCreate.id,
                    tenant: tenantId,
                },
            }));
        });
    }
    postSignup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            /* Not allow add "roles" and "location" */
            if ((!lodash_1.isEmpty(body.roles) || body.location) &&
                body.security !== constant_1.COMMON.security) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'role',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            yield this.handleDoneLogin('Sign up member successfully', null, res, next);
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('signIn');
            const { email } = req.body;
            let user = yield UserMap_1.default.findOne({ email }).exec();
            if (!user) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found',
                    },
                });
            }
            let passportMethod = 'localTenant';
            return passport_1.default.authenticate(passportMethod, { session: false }, (err, user, info) => {
                const errors = err || info;
                if (errors) {
                    return next({
                        statusCode: 401,
                        name: 'ValidationError',
                        errors,
                    });
                }
                req.login(user, { session: false }, (e) => __awaiter(this, void 0, void 0, function* () { return this.handleDoneLogin('Sign in successfully', user, res, next, e); }));
            })(req, res);
        });
    }
    signInThirdParty(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            req.body.email = req.body.email.toLowerCase();
            const { email } = req.body;
            let user = yield UserTenant_1.default.getInstance(tenantId)
                .findOne({ email })
                .exec();
            if (!user) {
                throw new AdvancedError_1.default({
                    user: {
                        kind: 'not.found',
                        message: 'User not found',
                    },
                });
            }
            let passportMethod = 'thirdParty';
            return passport_1.default.authenticate(passportMethod, { session: false }, (err, user, info) => {
                const errors = err || info;
                if (errors) {
                    return next({
                        statusCode: 401,
                        name: 'ValidationError',
                        errors,
                    });
                }
                req.login(user, { session: false }, (e) => __awaiter(this, void 0, void 0, function* () { return this.handleDoneLogin('Sign in successfully', user, res, next, e); }));
            })(req, res);
        });
    }
    handleDoneLogin(message, user, res, next, err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!err && user) {
                // generate a signed son web token with the contents of user object and return it in the response
                const { tokenGenerator, expiresIn } = this;
                try {
                    const token = tokenGenerator.sign({ id: user._id });
                    let listCompany = [];
                    if (user.manageTenant.length > 0) {
                        yield bluebird_1.default.map(user.manageTenant, (tenant) => __awaiter(this, void 0, void 0, function* () {
                            const data = yield CompanyTenant_1.default.getInstance(tenant)
                                .find({})
                                .select('name id status dba code tenant logoUrl')
                                .exec();
                            listCompany = [...listCompany, ...data];
                        }));
                    }
                    else {
                        const managePermission = yield ManagePermission_1.default.find({
                            userMap: user,
                        });
                        yield bluebird_1.default.map(managePermission, (item) => __awaiter(this, void 0, void 0, function* () {
                            const data = yield CompanyTenant_1.default.getInstance(item.tenant)
                                .find({ _id: item.company })
                                .select('name id status dba code tenant logoUrl')
                                .exec();
                            listCompany = [...listCompany, ...data];
                        }));
                    }
                    res.send(new ResponseResult_1.default({
                        message,
                        data: {
                            user: user,
                            listCompany,
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
    routeRecoverPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { email }, } = req;
            // Check existed email
            const user = yield UserTenant_1.default.getInstance(tenantId)
                .findOne({
                email,
            })
                .exec();
            if (!user) {
                return next({
                    statusCode: 400,
                    name: 'ValidationError',
                    errors: [
                        {
                            message: `We couldn't find an account associated with ${email}.`,
                        },
                    ],
                });
            }
            // Create password request
            const code = Math.round(Math.random() * (999999 - 100000) + 100000);
            yield PasswordRequestTenant_1.default.getInstance(tenantId).deleteMany({ code });
            const prData = {
                email,
                time: new Date().getTime() + constant_1.COMMON.expiredTime,
                code,
            };
            prData.user = user.id;
            yield PasswordRequestTenant_1.default.getInstance(tenantId).create(prData);
            SendMail_1.sendRecoverPasswordRequestEmail({ email, fullName: user.firstName }, [], code, `${WEB_URL}/reset-password/${code}`).catch(e => logger_1.default.warn(e));
            res.send(new ResponseResult_1.default({
                message: `We sent an email to ${email}.`,
                data: { email, code },
            }));
        });
    }
    routeResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { code, password }, } = req;
            // Check recover time
            const passwordRequest = yield PasswordRequestTenant_1.default.getInstance(tenantId)
                .findOne({
                code,
            })
                .exec();
            if (!passwordRequest ||
                passwordRequest.time < new Date().getTime() - constant_1.COMMON.expiredTime) {
                return next({
                    statusCode: 400,
                    name: 'ValidationError',
                    errors: [{ message: constant_1.MSG.mailExpiredLink }],
                });
            }
            // Update password
            let user;
            user = yield UserTenant_1.default.getInstance(tenantId)
                .updateOne({ _id: passwordRequest.user }, { password: yield new Bcrypt_1.default(password).hash() })
                .exec();
            // Remove Password Request
            PasswordRequestTenant_1.default.getInstance(tenantId)
                .deleteMany({
                user: passwordRequest.user,
            })
                .exec();
            res.send(new ResponseResult_1.default({
                message: 'Reset password successfully.',
                data: { user },
            }));
        });
    }
    routeUpdatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            let { body: { oldPassword, newPassword }, } = req;
            // Check current user
            const user = yield UserTenant_1.default.getInstance(tenantId)
                .findById(req.user._id)
                .exec();
            if (!user) {
                return utils_1.responseErr(next, constant_1.VALIDATE_MSG.userNotFound);
            }
            if (!(yield user.comparePassword(oldPassword))) {
                throw new AdvancedError_1.default({
                    password: {
                        kind: 'not.match',
                        message: 'Password not match',
                    },
                });
            }
            newPassword = yield new Bcrypt_1.default(newPassword).hash();
            yield UserTenant_1.default.getInstance(tenantId).findByIdAndUpdate(user._id, {
                password: newPassword,
            });
            res.send(new ResponseResult_1.default({
                message: constant_1.MSG.passUpdate,
                data: user,
            }));
        });
    }
    redirect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { params: { path = '' } = {} } = req;
            path = path.split('-').join('/');
            const mb = new mobile_detect_1.default(lodash_1.get(req, "headers['user-agent']"));
            const isMobile = mb.mobile() || mb.tablet() || mb.phone();
            if (isMobile) {
                res.redirect(`${MOBILE_URL}${path}`);
            }
            else {
                res.redirect(`${WEB_URL}/${path}`);
            }
        });
    }
    signUpValidCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { name }, } = req;
            const item = yield CompanyTenant_1.default.getInstance(tenantId)
                .find({ name })
                .exec();
            if (item.length > 0) {
                throw new AdvancedError_1.default({
                    company: { kind: 'unique.name', message: 'Company Name is existed!' },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Valid company successfully.',
            }));
        });
    }
    signUpValidLocation(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                message: 'Valid location successfully.',
            }));
        });
    }
    signUpValidAdmin(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                message: 'Valid admin successfully.',
            }));
        });
    }
}
exports.default = new GlobalTenantController();
//# sourceMappingURL=GlobalTenantController.js.map