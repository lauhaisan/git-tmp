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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Department from '@/app/models/Department'
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
// import CandidateTenant from '@/app/models/CandidateTenant'
// import CompanyTenant from '@/app/models/CompanyTenant'
// import CustomEmailTenant from '@/app/models/CustomEmailTenant'
// import DepartmentTenant from '@/app/models/DepartmentTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import EmployeeTypeTenant from '@/app/models/EmployeeTypeTenant'
// import LocationTenant from '@/app/models/LocationTenant'
// import TitleTenant from '@/app/models/TitleTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const CandidateTenant_1 = __importDefault(require("../models/CandidateTenant"));
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const CustomEmailTenant_1 = __importDefault(require("../models/CustomEmailTenant"));
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const EmployeeTypeTenant_1 = __importDefault(require("../models/EmployeeTypeTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const TitleTenant_1 = __importDefault(require("../models/TitleTenant"));
const CandidateTenantController_1 = __importDefault(require("./CandidateTenantController"));
// import { sendMulitpleCustomEmail } from '@/app/services/SendMail'
class CustomEmailTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list-active',
                type: 'POST',
                _ref: this.listActive.bind(this),
            },
            {
                name: 'list-trigger-event',
                type: 'POST',
                _ref: this.listTriggerEvent.bind(this),
            },
            {
                name: 'list-auto-field',
                type: 'POST',
                _ref: this.listAutoField.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getById.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
            {
                name: 'test',
                type: 'POST',
                _ref: this.test.bind(this),
            },
        ];
    }
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: yield this._getConditions([], req),
            }));
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body: { id }, } = req;
            const customEmail = (yield CustomEmailTenant_1.default.getInstance(tenantId).findById(id));
            if (!customEmail) {
                throw new AdvancedError_1.default({
                    customEmail: { kind: 'not.found', message: 'Custom email not found' },
                });
            }
            const customEmailData = Object.assign({}, customEmail.toObject());
            let { conditions, recipients } = customEmailData, excluded = __rest(customEmailData, ["conditions", "recipients"]);
            if (conditions) {
                conditions = yield this._getConditions(conditions, req);
            }
            if (recipients) {
            }
            res.send(new ResponseResult_1.default({
                data: Object.assign(Object.assign({}, excluded), { conditions }),
                message: 'List item successfully',
            }));
        });
    }
    listTriggerEvent(_req, res) {
        res.send(new ResponseResult_1.default({
            data: constant_1.CUSTOM_EMAIL.DEFAULT_TRIGGER_EVENT,
            message: 'List item successfully',
        }));
    }
    listActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const data = (yield CustomEmailTenant_1.default.getInstance(tenantId).find({
                status: 'ACTIVE',
            }));
            res.send(new ResponseResult_1.default({
                data,
                message: 'List items successfully',
            }));
        });
    }
    listAutoField(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: [...constant_1.CUSTOM_EMAIL.LIST_AUTO_FIELD],
                message: 'List items successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body: { id }, } = req;
            const customEmail = (yield CustomEmailTenant_1.default.getInstance(tenantId).findById(id));
            if (!customEmail) {
                throw new AdvancedError_1.default({
                    customEmail: { kind: 'not.found', message: 'Custom email not found' },
                });
            }
            const { _id, isDefault } = customEmail;
            if (isDefault) {
                throw new AdvancedError_1.default({
                    customEmail: {
                        kind: 'not.permission',
                        message: 'Cannot remove default custom email',
                    },
                });
            }
            yield CustomEmailTenant_1.default.getInstance(tenantId).deleteOne({ _id });
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Remove item successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            const { body } = req;
            // const requiredFields = []
            // const errors: string[] = this._isEmpty(body)
            // if (errors.length) {
            //   throw new AdvancedError({
            //     customEmail: {
            //       kind: 'invalid',
            //       message: `${_.map(errors, (per: string) => per)} are missing`,
            //     },
            //   })
            // }
            if (lodash_1.default.isEmpty(body)) {
                throw new AdvancedError_1.default({
                    customEmail: {
                        kind: 'invalid',
                        message: 'Body cannot be empty',
                    },
                });
            }
            const newCustomemail = Object.assign(Object.assign({}, body), { company: company });
            const data = (yield CustomEmailTenant_1.default.getInstance(tenantId).create(newCustomemail));
            res.send(new ResponseResult_1.default({
                data,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { _id } = body;
            const customEmail = (yield CustomEmailTenant_1.default.getInstance(tenantId).findById(_id));
            if (!customEmail) {
                throw new AdvancedError_1.default({
                    customEmail: { kind: 'not.found', message: 'Custom email not found' },
                });
            }
            customEmail.set(this.filterParams(body, ['_id', 'company', 'isDefault']));
            yield customEmail.save();
            res.send(new ResponseResult_1.default({
                data: customEmail,
                message: 'Update item successfully',
            }));
        });
    }
    generateEmails(triggerEvent, customReceiever, { employeeId = '', candidateId = '', companyId = '', titleId = '', locationId = '', departmentId = '', employeeTypeId = '', }, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const template = (yield CustomEmailTenant_1.default.getInstance(tenantId)
                .findOne({
                'triggerEvent.value': triggerEvent,
            })
                .sort({ createdAt: -1 }));
            if (!template)
                return;
            const recipients = yield CandidateTenantController_1.default.getEmail(yield this.getAllReceipents(template, req), req);
            const emails = lodash_1.default.map(recipients, ({ email }) => email);
            if (customReceiever.length) {
                let tempIds = lodash_1.default.map(customReceiever, (per) => mongoose_1.Types.ObjectId(per));
                emails.push(...lodash_1.default.map(yield CandidateTenantController_1.default.getEmail(tempIds, req), ({ email }) => email));
            }
            const { variables, message, subject } = template;
            const neccessaryInfo = yield this.getInfo({
                employeeId,
                candidateId,
                companyId,
                titleId,
                locationId,
                departmentId,
                employeeTypeId,
            }, req);
            const content = this.generateContent(variables, neccessaryInfo, message);
            console.log(subject, content, 'OKE Uncomment line below for prod mode');
            // await sendMulitpleCustomEmail(emails, [], subject, content)
            // await bluebird.map(emails, async (per: any) => {
            //   await sendCustomEmail(per, [], per.fullName, subject, content)
            // })
            return;
        });
    }
    getAllReceipents(template, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            if (!template)
                return [];
            let employeesId = [];
            let filter = {};
            const { applyTo, recipients, conditions, sendToExistingWorker } = template;
            if (sendToExistingWorker) {
                const temps = (yield EmployeeTenant_1.default.getInstance(tenantId).aggregate([
                    { $project: { _id: 1 } },
                ]));
                employeesId.push(...lodash_1.default.map(temps, (per) => per._id));
                return employeesId;
            }
            if (applyTo === 'any') {
                if (recipients) {
                    filter.$match = {};
                    filter.$match.$or = [];
                    filter.$match.$or.push({
                        department: { $eq: recipients._id ? recipients._id : recipients },
                    });
                }
            }
            if (applyTo === 'condition') {
                if (conditions.length) {
                    filter.$match = {};
                    filter.$match.$or = [];
                    lodash_1.default.map(conditions, (cond) => {
                        switch (cond.key) {
                            case 'department':
                                filter.$match.$or.push({
                                    department: { $in: cond.value },
                                });
                                break;
                            case 'location':
                                filter.$match.$or.push({
                                    location: { $in: cond.value },
                                });
                                break;
                            case 'title':
                                filter.$match.$or.push({
                                    title: { $in: cond.value },
                                });
                                break;
                            case 'employee_type':
                                filter.$match.$or.push({
                                    employeeType: { $in: cond.value },
                                });
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
            let aggregates = [];
            let temps = [];
            if (!lodash_1.default.isEmpty(filter)) {
                aggregates.push(filter);
                aggregates = [...aggregates, { $project: { _id: 1 } }];
                temps = (yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates));
            }
            // Get all employee
            employeesId.push(...lodash_1.default.map(temps, (per) => per._id));
            return employeesId;
        });
    }
    /**
     * Get neccessary info from provided object id
     * @param {String | ''} employeeId
     * @param {String | ''} candidateId
     * @param {String | ''} companyId
     * @param {String | ''} titleId
     * @param {String | ''} locationId
     * @param {String | ''} departmentId
     * @param {String | ''} employeeTypeId
     */
    getInfo({ employeeId = '', candidateId = '', companyId = '', titleId = '', locationId = '', departmentId = '', employeeTypeId = '', }, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            let returnObj = {};
            if (employeeId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(employeeId);
                const lookups = [
                    {
                        $lookup: {
                            from: 'generalinfos',
                            localField: 'generalInfo',
                            foreignField: '_id',
                            as: 'generalInfo',
                        },
                    },
                    { $unwind: { path: '$generalInfo', preserveNullAndEmptyArrays: true } },
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
                const project = {
                    $project: {
                        _id: 0,
                        employeeId: 1,
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            workNumber: 1,
                            workEmail: 1,
                            personalEmail: 1,
                        },
                        manager: {
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                                workNumber: 1,
                                workEmail: 1,
                                personalEmail: 1,
                            },
                        },
                    },
                };
                const employee = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate([
                    match,
                    ...lookups,
                    project,
                ]);
                if (employee.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ employee: employee[0] }));
                }
            }
            if (candidateId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(candidateId);
                const lookups = [
                    {
                        $lookup: {
                            from: 'employees',
                            localField: 'reportingManager',
                            foreignField: '_id',
                            as: 'reportingManager',
                        },
                    },
                    {
                        $unwind: {
                            path: '$reportingManager',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'generalinfos',
                            localField: 'reportingManager.generalInfo',
                            foreignField: '_id',
                            as: 'reportingManager.generalInfo',
                        },
                    },
                    {
                        $unwind: {
                            path: '$reportingManager.generalInfo',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ];
                const project = {
                    $project: {
                        _id: 0,
                        ticketID: 1,
                        fullName: 1,
                        privateEmail: 1,
                        workEmail: 1,
                        position: 1,
                        reportingManager: { generalInfo: { firstName: 1, lastName: 1 } },
                    },
                };
                const candidate = yield CandidateTenant_1.default.getInstance(tenantId).aggregate([
                    match,
                    ...lookups,
                    project,
                ]);
                if (candidate.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ candidate: candidate[0] }));
                }
            }
            if (companyId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(companyId);
                const project = {
                    $project: {
                        _id: 0,
                        name: 1,
                        phone: 1,
                        headQuarterAddress: {
                            address: 1,
                            state: 1,
                            country: 1,
                            zipCode: 1,
                        },
                        legalAddress: {
                            address: 1,
                            state: 1,
                            country: 1,
                            zipCode: 1,
                        },
                        dba: 1,
                        ein: 1,
                        website: 1,
                        suiteEdition: 1,
                        contactEmail: 1,
                    },
                };
                const company = yield CompanyTenant_1.default.getInstance(tenantId).aggregate([
                    match,
                    project,
                ]);
                if (company.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ company: company[0] }));
                }
            }
            if (titleId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(titleId);
                const project = {
                    $project: {
                        _id: 0,
                        name: 1,
                    },
                };
                const title = yield this.TitleTenantModel.aggregate([match, project]);
                if (title.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ title: title[0] }));
                }
            }
            if (locationId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(locationId);
                const project = {
                    $project: {
                        _id: 0,
                        name: 1,
                        address: 1,
                        country: 1,
                        state: 1,
                        zipCode: 1,
                    },
                };
                const location = yield LocationTenant_1.default.getInstance(tenantId).aggregate([
                    match,
                    project,
                ]);
                if (location.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ location: location[0] }));
                }
            }
            if (departmentId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(departmentId);
                const project = {
                    $project: {
                        _id: 0,
                        name: 1,
                    },
                };
                const department = yield DepartmentTenant_1.default.getInstance(tenantId).aggregate([match, project]);
                if (department.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ department: department[0] }));
                }
            }
            if (employeeTypeId) {
                const match = { $match: {} };
                match.$match._id = mongoose_1.Types.ObjectId(employeeTypeId);
                const project = {
                    $project: {
                        _id: 0,
                        name: 1,
                    },
                };
                const employeeType = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate([match, project]);
                if (employeeType.length) {
                    returnObj = Object.assign(Object.assign({}, returnObj), this.flattenObject({ employeeType: employeeType[0] }));
                }
            }
            return returnObj;
        });
    }
    /**
     * Replace the input string with pre-defined variables
     * @param {string[]} predefinedVars list of pre-defined variables field from CustomEmail Model. Eg: ['@company_name', '@title_name']
     * @param {any} info Generated info from @function getInfo
     * @param {any}} str The string need to be replaced
     */
    generateContent(predefinedVars, info, str) {
        let res = str;
        lodash_1.default.forEach(lodash_1.default.uniq(predefinedVars), (per) => {
            let temp = lodash_1.default.find(info, (_val, key) => per === '@' + key);
            res = res.replace(new RegExp(per, 'g'), temp);
        });
        return res;
    }
    /**
     * Fallten deep nested object
     * @param {any} ob Object need to be flatten
     */
    flattenObject(ob) {
        var toReturn = {};
        for (let i in ob) {
            if (!ob.hasOwnProperty(i))
                continue;
            if (typeof ob[i] == 'object' && ob[i] !== null) {
                let flatObject = this.flattenObject(ob[i]);
                for (let x in flatObject) {
                    if (!flatObject.hasOwnProperty(x))
                        continue;
                    toReturn[i + '_' + x] = flatObject[x];
                }
            }
            else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }
    /**
     * Check if body is empty or not
     * @param {any} obj loop through object properties
     * @returns {object} status: true || false and error stack
     */
    // private _isEmpty(obj: any) {
    //   let errors: string[] = []
    //   _.forEach(obj, (val, key) => {
    //     if (_.isEmpty(val)) errors.push(`${key}, `)
    //   })
    //   return errors
    // }
    /**
     * Aggregate conditions fields in custom email
     * @param {}
     * @return {}
     */
    _getConditions(arr, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            let departmentAgg = [];
            let locationAgg = [];
            let employeeTypeAgg = [];
            let titleAgg = [];
            let results = [];
            lodash_1.default.forEach(arr, ({ key, value }) => {
                switch (key.toLowerCase()) {
                    case 'department':
                        departmentAgg = [
                            ...departmentAgg,
                            [
                                {
                                    $match: {
                                        _id: {
                                            $in: value,
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        name: 1,
                                    },
                                },
                            ],
                        ];
                        break;
                    case 'employee_type':
                        employeeTypeAgg = [
                            ...employeeTypeAgg,
                            [
                                {
                                    $match: {
                                        _id: {
                                            $in: value,
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        name: 1,
                                    },
                                },
                            ],
                        ];
                        break;
                    case 'title':
                        titleAgg = [
                            ...titleAgg,
                            [
                                {
                                    $match: {
                                        _id: {
                                            $in: value,
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        name: 1,
                                    },
                                },
                            ],
                        ];
                        break;
                    case 'location':
                        locationAgg = [
                            ...locationAgg,
                            [
                                {
                                    $match: {
                                        _id: {
                                            $in: value,
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        name: 1,
                                    },
                                },
                            ],
                        ];
                        break;
                    default:
                        break;
                }
            });
            if (departmentAgg.length) {
                let temp = [];
                yield bluebird_1.default.map(departmentAgg, (per) => __awaiter(this, void 0, void 0, function* () {
                    const departments = yield DepartmentTenant_1.default.getInstance(tenantId).aggregate(per);
                    yield temp.push({ key: 'department', value: [...departments] });
                }));
                results = [...results, ...temp];
            }
            if (locationAgg.length) {
                let temp = [];
                yield bluebird_1.default.map(locationAgg, (per) => __awaiter(this, void 0, void 0, function* () {
                    const locations = yield LocationTenant_1.default.getInstance(tenantId).aggregate(per);
                    yield temp.push({ key: 'location', value: [...locations] });
                }));
                results = [...results, ...temp];
            }
            if (titleAgg.length) {
                let temp = [];
                yield bluebird_1.default.map(titleAgg, (per) => __awaiter(this, void 0, void 0, function* () {
                    const titles = yield TitleTenant_1.default.getInstance(tenantId).aggregate(per);
                    yield temp.push({ key: 'title', value: [...titles] });
                }));
                results = [...results, ...temp];
            }
            if (employeeTypeAgg.length) {
                let temp = [];
                yield bluebird_1.default.map(employeeTypeAgg, (per) => __awaiter(this, void 0, void 0, function* () {
                    const employeeTypes = yield EmployeeTypeTenant_1.default.getInstance(tenantId).aggregate(per);
                    yield temp.push({ key: 'employee_type', value: [...employeeTypes] });
                }));
                results = [...results, ...temp];
            }
            return results;
        });
    }
}
exports.default = new CustomEmailTenantController();
//# sourceMappingURL=CustomEmailTenantController.js.map