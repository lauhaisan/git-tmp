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
const utils_1 = require("@/app/utils/utils");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
const Department_1 = __importDefault(require("../models/Department"));
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const EmployeeType_1 = __importDefault(require("../models/EmployeeType"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const PerformanceHistoryTenant_1 = __importDefault(require("../models/PerformanceHistoryTenant"));
const Template_1 = __importDefault(require("../models/Template"));
const TemplateTenant_1 = __importDefault(require("../models/TemplateTenant"));
const Tenant_1 = __importDefault(require("../models/Tenant"));
const TimeoffType_1 = __importDefault(require("../models/TimeoffType"));
const TimeoffTypeTenant_1 = __importDefault(require("../models/TimeoffTypeTenant"));
const TimeScheduleTenant_1 = __importDefault(require("../models/TimeScheduleTenant"));
const Title_1 = __importDefault(require("../models/Title"));
const TitleTenant_1 = __importDefault(require("../models/TitleTenant"));
const UserMap_1 = __importDefault(require("../models/UserMap"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
const WeI9Tenant_1 = __importDefault(require("../models/WeI9Tenant"));
class CompanyTenantController extends AbstractController_1.default {
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
                name: 'list-of-user',
                type: 'POST',
                _ref: this.listOfUser,
            },
            {
                name: 'setup-complete',
                type: 'POST',
                _ref: this.setupComplete.bind(this),
            },
            {
                name: 'list-filter-parent',
                type: 'POST',
                _ref: this.listFilterParent.bind(this),
            },
        ];
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tenantId = req.header('tenantId');
            const { id } = req.body;
            try {
                const item = yield CompanyTenant_1.default.getInstance(tenantId).findById(id);
                res.send(new ResponseResult_1.default({
                    data: item || {},
                    message: 'Get item successfully',
                }));
            }
            catch (e) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: e.message },
                });
            }
        });
    }
    /**
     * add
     */
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let tenantId = req.header('tenantId');
            const { company, locations, isNewTenant, childOfCompany, parentTenantId, } = req.body;
            if (isNewTenant) {
                tenantId =
                    '_' +
                        Math.random()
                            .toString(36)
                            .substr(2, 5);
                yield Tenant_1.default.create({ id: tenantId });
                const user = yield UserMap_1.default.findById(req.user.id);
                user.manageTenant = [...user.manageTenant, tenantId];
                yield user.save();
                // create template default
                const templateDefaults = yield Template_1.default.find();
                yield TemplateTenant_1.default.getInstance(tenantId).insertMany(templateDefaults);
            }
            if (parentTenantId) {
                tenantId = parentTenantId;
            }
            const codeCompany = yield utils_1.generateCompanyCode({ name: company.name });
            const companyCreate = yield CompanyTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, company), { code: codeCompany, tenant: tenantId }));
            if (childOfCompany) {
                companyCreate.childOfCompany = childOfCompany;
                yield companyCreate.save();
            }
            // let locationsCreate: any = []
            // Create Location
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
            //INIT CONFIG
            res.send(new ResponseResult_1.default({
                data: {
                    company: companyCreate,
                    department: departmentDefaults,
                },
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const company = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!company) {
                throw new AdvancedError_1.default({
                    company: { kind: 'not.found', message: 'Company not found' },
                });
            }
            company.set(req.body);
            yield company.save();
            if (req.body.headQuarterAddress) {
                let location = yield LocationTenant_1.default.getInstance(tenantId)
                    .findOne({ company: company, isHeadQuarter: true })
                    .exec();
                if (location) {
                    location.headQuarterAddress = company.headQuarterAddress;
                    yield location.save();
                }
            }
            res.send(new ResponseResult_1.default({
                message: 'Update company successfully',
                data: company,
            }));
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
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
            const company = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
            const tenantId = req.header('tenantId');
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
            const item = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(req.body.id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield LocationTenant_1.default.getInstance(tenantId).deleteMany({ company: item._id });
            yield DepartmentTenant_1.default.getInstance(tenantId).deleteMany({
                company: item._id,
            });
            const employees = yield EmployeeTenant_1.default.getInstance(tenantId).find({
                company: item._id,
            });
            for (let i = 0; i < employees.length; i++) {
                yield UserTenant_1.default.getInstance(tenantId).deleteOne({
                    employee: employees[i]._id,
                });
                yield GeneralInfoTenant_1.default.getInstance(tenantId).deleteMany({
                    _id: employees[i].generalInfo,
                });
                yield PerformanceHistoryTenant_1.default.getInstance(tenantId).deleteMany({
                    _id: employees[i].performanceHistory,
                });
                yield TimeScheduleTenant_1.default.getInstance(tenantId).deleteMany({
                    _id: employees[i].timeSchedule,
                });
                yield WeI9Tenant_1.default.getInstance(tenantId).deleteMany({
                    _id: employees[i].weI9,
                });
                yield CompensationTenant_1.default.getInstance(tenantId).deleteMany({
                    _id: employees[i].compensation,
                });
                yield DocumentTenant_1.default.getInstance(tenantId).deleteMany({
                    employee: employees[i]._id,
                });
                yield UserTenant_1.default.getInstance(tenantId).deleteMany({
                    employee: employees[i]._id,
                });
            }
            yield EmployeeTenant_1.default.getInstance(tenantId).deleteMany({ company: item._id });
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
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const item = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const item = yield CompanyTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            // Update dependencies
            yield UserTenant_1.default.getInstance(tenantId).updateMany({ company: id }, { status: 'INACTIVE' });
            yield LocationTenant_1.default.getInstance(tenantId).updateMany({ company: id }, { status: 'INACTIVE' });
            // Update Company
            item.set({ status: 'INACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    listOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserMap_1.default.findOne({ _id: req.user._id });
            let listCompany = [];
            if (user.manageTenant.length > 0) {
                yield bluebird_1.default.map(user.manageTenant, (tenant) => __awaiter(this, void 0, void 0, function* () {
                    // const data: any = await CompanyTenant.getInstance(tenant)
                    //   .find({})
                    //   .select(
                    //     'name id status dba code tenant headQuarterAddress legalAddress logoUrl childOfCompany',
                    //   )
                    //   .exec()
                    // listCompany = [...listCompany, ...data]
                    let aggregate = [];
                    const lookup = [
                        {
                            $lookup: {
                                from: `countries`,
                                localField: 'headQuarterAddress.country',
                                foreignField: '_id',
                                as: 'headQuarterAddress.country',
                            },
                        },
                        {
                            $unwind: {
                                path: '$headQuarterAddress.country',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    aggregate = [...aggregate, ...lookup];
                    const project = {
                        $project: {
                            // name id status dba code tenant headQuarterAddress legalAddress logoUrl childOfCompany
                            name: 1,
                            _id: 1,
                            status: 1,
                            dba: 1,
                            code: 1,
                            tenant: 1,
                            headQuarterAddress: {
                                state: 1,
                                addressLine1: 1,
                                addressLine2: 1,
                                zipCode: 1,
                                country: {
                                    _id: 1,
                                    name: 1,
                                },
                            },
                            legalAddress: {
                                state: 1,
                                addressLine1: 1,
                                addressLine2: 1,
                                zipCode: 1,
                                country: {
                                    _id: 1,
                                    name: 1,
                                },
                            },
                            logoUrl: 1,
                            childOfCompany: 1,
                        },
                    };
                    aggregate.push(project);
                    const company = yield CompanyTenant_1.default.getInstance(tenant).aggregate(aggregate);
                    listCompany = [...listCompany, ...company];
                }));
            }
            else {
                const managePermission = yield ManagePermission_1.default.find({
                    userMap: user,
                });
                yield bluebird_1.default.map(managePermission, (item) => __awaiter(this, void 0, void 0, function* () {
                    // const data = await CompanyTenant.getInstance(item.tenant)
                    //   .find({ _id: item.company })
                    //   .select(
                    //     'name id status dba code tenant headQuarterAddress legalAddress logoUrl childOfCompany',
                    //   )
                    //   .exec()
                    let aggregate = [];
                    const matchOne = { $match: {} };
                    matchOne.$match._id = mongoose_1.Types.ObjectId(item.company);
                    aggregate.push(matchOne);
                    const lookup = [
                        {
                            $lookup: {
                                from: `countries`,
                                localField: 'headQuarterAddress.country',
                                foreignField: '_id',
                                as: 'headQuarterAddress.country',
                            },
                        },
                        {
                            $unwind: {
                                path: '$headQuarterAddress.country',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    aggregate = [...aggregate, ...lookup];
                    const project = {
                        $project: {
                            // name id status dba code tenant headQuarterAddress legalAddress logoUrl childOfCompany
                            name: 1,
                            _id: 1,
                            status: 1,
                            dba: 1,
                            code: 1,
                            tenant: 1,
                            headQuarterAddress: {
                                state: 1,
                                addressLine1: 1,
                                addressLine2: 1,
                                zipCode: 1,
                                country: {
                                    _id: 1,
                                    name: 1,
                                },
                            },
                            legalAddress: {
                                state: 1,
                                addressLine1: 1,
                                addressLine2: 1,
                                zipCode: 1,
                                country: {
                                    _id: 1,
                                    name: 1,
                                },
                            },
                            logoUrl: 1,
                            childOfCompany: 1,
                        },
                    };
                    aggregate.push(project);
                    const company = yield CompanyTenant_1.default.getInstance(item.tenant).aggregate(aggregate);
                    listCompany = [...listCompany, ...company];
                }));
            }
            res.send(new ResponseResult_1.default({
                message: 'get item successfully',
                data: { listCompany },
            }));
        });
    }
    setupComplete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const currentUser = user;
            currentUser.firstCreated = false;
            yield currentUser.save();
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            }));
        });
    }
    listFilterParent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, tenantId }, } = req;
            let listEmployeeType = [];
            const listCompany = [];
            let listDepartmentName = [];
            let listCountry = [];
            listEmployeeType = yield EmployeeType_1.default.find({});
            const companyParent = yield CompanyTenant_1.default.getInstance(tenantId).findById(id);
            listCompany.push({
                _id: companyParent._id,
                name: companyParent.name,
                childOfCompany: companyParent.childOfCompany,
                tenant: companyParent.tenant,
            });
            const user = yield UserMap_1.default.findById(req.user.id);
            yield bluebird_1.default.map(user.manageTenant, (tenant) => __awaiter(this, void 0, void 0, function* () {
                const companyChilds = yield CompanyTenant_1.default.getInstance(tenant).find({
                    childOfCompany: companyParent,
                });
                for (let companyChild of companyChilds) {
                    listCompany.push({
                        _id: companyChild._id,
                        name: companyChild.name,
                        tenant: companyChild.tenant,
                        childOfCompany: companyChild.childOfCompany,
                    });
                }
            }));
            yield bluebird_1.default.map(listCompany, (company) => __awaiter(this, void 0, void 0, function* () {
                const departments = yield DepartmentTenant_1.default.getInstance(company.tenant).find({
                    company: company._id,
                });
                for (let department of departments) {
                    listDepartmentName.push(department.name);
                }
                const locations = yield LocationTenant_1.default.getInstance(company.tenant).find({
                    company: company._id,
                });
                for (let location of locations) {
                    listCountry.push({
                        country: location.headQuarterAddress.country,
                        state: location.headQuarterAddress.state,
                    });
                }
            }));
            listDepartmentName = [...new Set(listDepartmentName)];
            listCountry = lodash_1.uniqBy(listCountry, 'state');
            res.send(new ResponseResult_1.default({
                message: 'item successfully',
                data: {
                    listCompany,
                    listDepartmentName,
                    listCountry,
                    listEmployeeType,
                },
            }));
        });
    }
}
exports.default = new CompanyTenantController();
//# sourceMappingURL=CompanyTenantController.js.map