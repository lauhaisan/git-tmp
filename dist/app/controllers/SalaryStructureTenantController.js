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
const CompanyTenant_1 = __importDefault(require("@/app/models/CompanyTenant"));
const LocationTenant_1 = __importDefault(require("@/app/models/LocationTenant"));
const SalaryStructure_1 = __importDefault(require("@/app/models/SalaryStructure"));
const TitleTenant_1 = __importDefault(require("@/app/models/TitleTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const CandidateTenant_1 = __importDefault(require("../models/CandidateTenant"));
const SalaryStructureTenant_1 = __importDefault(require("../models/SalaryStructureTenant"));
class SalaryStructureTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
                validationSchema: {
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company must be provided'],
                        },
                    },
                    country: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Country must be provided'],
                        },
                    },
                    title: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Title must be provided'],
                        },
                    },
                    setting: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Setting must be provided'],
                        },
                        isArray: {
                            errorMessage: ['isArray', 'Setting is invalid'],
                        },
                    },
                },
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-title',
                type: 'POST',
                _ref: this.getByTitle.bind(this),
                validationSchema: {
                    title: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Title ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['isString', 'Title ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-salary',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                validationSchema: {
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-new-data',
                type: 'POST',
                _ref: this.updateNewData.bind(this),
            },
        ];
    }
    getByTitle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { title, country, tenantId } = body;
            const titleData = yield TitleTenant_1.default.getInstance(tenantId).findById(title);
            if (!titleData) {
                throw new AdvancedError_1.default({
                    title: { kind: 'not.found', message: 'Title not found' },
                });
            }
            const companyData = yield CompanyTenant_1.default.getInstance(tenantId).findById(titleData.company);
            const locationData = yield LocationTenant_1.default.getInstance(tenantId).find({
                company: companyData,
            });
            const countries = locationData.map(item => item.headQuarterAddress.country._id);
            if (countries.indexOf(country) === -1) {
                throw new AdvancedError_1.default({
                    country: { kind: 'not.found', message: 'Country not found' },
                });
            }
            let salaryStructure = yield SalaryStructureTenant_1.default.getInstance(tenantId).findOne({ title });
            if (!salaryStructure) {
                let data = {
                    title,
                    company: companyData._id,
                    country,
                    setting: [
                        {
                            key: 'basic',
                            title: 'Basic',
                            value: 'Rs. 12888',
                            order: 'A',
                        },
                        {
                            key: 'hra',
                            title: 'HRA',
                            value: '50% of Basic',
                            order: 'B',
                        },
                        {
                            title: 'Other allowances',
                            key: 'otherAllowances',
                            value: 'Balance amount',
                            order: 'C',
                        },
                        {
                            key: 'totalEarning',
                            title: 'Total earning (Gross)',
                            order: 'D',
                            value: 'A + B + C',
                        },
                        {
                            key: 'deduction',
                            title: 'Deduction',
                            order: 'E',
                            value: ' ',
                        },
                        {
                            key: 'employeesPF',
                            title: "Employee's PF",
                            value: '12 % of Basic',
                            order: 'G',
                        },
                        {
                            key: 'employeesESI',
                            title: "Employee's ESI",
                            value: '0.75 of Gross',
                            order: 'H',
                        },
                        {
                            key: 'professionalTax',
                            title: 'Professional Tax',
                            value: 'Rs.200',
                            order: 'I',
                        },
                        {
                            key: 'tds',
                            title: 'TDS',
                            value: 'As per IT rules',
                            order: 'J',
                        },
                        {
                            key: 'netPayment',
                            title: 'Net Payment',
                            value: 'F - (G + H + I + J)',
                            order: ' ',
                        },
                    ],
                };
                salaryStructure = yield SalaryStructureTenant_1.default.getInstance(tenantId).create(data);
            }
            res.send(new ResponseResult_1.default({
                data: salaryStructure,
                message: 'Get item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id, tenantId, setting } = body;
            const salaryStructure = yield SalaryStructureTenant_1.default.getInstance(tenantId).findById(id);
            if (!salaryStructure) {
                throw new AdvancedError_1.default({
                    salaryStructure: {
                        kind: 'not.found',
                        message: 'Salary structure not found',
                    },
                });
            }
            salaryStructure.set({
                setting,
            });
            yield salaryStructure.save();
            res.send(new ResponseResult_1.default({
                data: salaryStructure,
                message: 'Update item successfully',
            }));
        });
    }
    updateNewData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSettings = [
                {
                    key: 'basic',
                    title: 'Basic',
                    value: 'Rs. 12888',
                    order: 'A',
                    edit: true,
                },
                {
                    key: 'hra',
                    title: 'HRA',
                    value: '% of Basic',
                    order: 'B',
                    edit: true,
                    number: {
                        current: 20,
                        max: 50,
                    },
                },
                {
                    title: 'Other allowances',
                    key: 'otherAllowances',
                    value: 'Balance amount',
                    order: 'C',
                },
                {
                    key: 'totalEarning',
                    title: 'Total earning (Gross)',
                    order: 'D',
                    value: 'A + B + C',
                },
                {
                    key: 'deduction',
                    title: 'Deduction',
                    order: 'E',
                    value: ' ',
                },
                {
                    key: 'employeesPF',
                    title: "Employee's PF",
                    value: '% of Basic',
                    order: 'G',
                    edit: true,
                    number: {
                        current: 12,
                        max: 12,
                    },
                },
                {
                    key: 'employeesESI',
                    title: "Employee's ESI",
                    value: 'of Gross',
                    order: 'H',
                    edit: true,
                    number: {
                        current: 0.75,
                        max: 0.75,
                    },
                },
                {
                    key: 'professionalTax',
                    title: 'Professional Tax',
                    value: 'Rs.200',
                    order: 'I',
                },
                {
                    key: 'tds',
                    title: 'TDS',
                    value: 'As per IT rules',
                    order: 'J',
                },
                {
                    key: 'netPayment',
                    title: 'Net Payment',
                    value: 'F - (G + H + I + J)',
                    order: ' ',
                },
            ];
            const tenantId = req.header('tenantId');
            const candidates = yield CandidateTenant_1.default.getInstance(tenantId).find({
                'salaryStructure.settings': { $exists: true },
            });
            const salaryStructures = yield SalaryStructure_1.default.find();
            // Update salary structure of each candidate
            bluebird_1.default.map(candidates, (candidate) => __awaiter(this, void 0, void 0, function* () {
                yield candidate.set({ 'salaryStructure.settings': newSettings });
                yield candidate.save();
            }));
            // Update salary structure table
            bluebird_1.default.map(salaryStructures, (salaryStructure) => __awaiter(this, void 0, void 0, function* () {
                const updated = yield salaryStructure.set({
                    setting: newSettings,
                });
                console.log(updated);
                yield salaryStructure.save();
            }));
            res.send(new ResponseResult_1.default({
                data: {
                    numberOfSalaryStructureEffected: salaryStructures.length,
                    numberOfCandidateEffected: candidates.length,
                },
                message: 'Update all salary structure data succesfully',
            }));
        });
    }
}
exports.default = new SalaryStructureTenantController();
//# sourceMappingURL=SalaryStructureTenantController.js.map