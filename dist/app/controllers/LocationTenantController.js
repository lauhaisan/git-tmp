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
// import LocationTenant from '@/app/models/LocationTenant'
// import UserTenant from '@/app/models/UserTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
class LocationTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
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
                name: 'list-by-company-parent',
                type: 'POST',
                _ref: this.listByCompanyParent.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
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
                name: 'add-multi',
                type: 'POST',
                _ref: this.addMulti,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
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
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
                possiblePers: ['admin-cga'],
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive,
                possiblePers: ['admin-cga'],
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-company',
                type: 'POST',
                _ref: this.getByCompany.bind(this),
                validationSchema: {
                    company: {
                        exists: {
                            errorMessage: ['required', 'Company must be provided'],
                        },
                    },
                },
            },
            // {
            //   name: 'fix',
            //   type: 'POST',
            //   _ref: this.fixAddress.bind(this)
            // }
            {
                name: 'upsert',
                type: 'POST',
                _ref: this.upsert.bind(this),
            },
        ];
    }
    /* Find location list of the currentUser company */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company, tenantId } = req.body;
            const currentUser = req.user;
            console.log('currentUser', currentUser);
            res.send(new ResponseResult_1.default({
                message: 'Get location list successfully',
                data: yield LocationTenant_1.default.getInstance(tenantId)
                    .find({ company })
                    .sort({ createdAt: -1 })
                    .exec(),
            }));
        });
    }
    getByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            // const currentUser = req.user as IUser
            // let employee: any = currentUser.employee as IEmployee
            // employee = await Employee.findById(currentUser.employee)
            const { company } = req.body;
            const filter = {
                company,
            };
            res.send(new ResponseResult_1.default({
                message: 'Get location list successfully',
                data: yield LocationTenant_1.default.getInstance(tenantId)
                    .find(filter)
                    .sort({ name: -1 })
                    .exec(),
            }));
        });
    }
    // List all location
    listAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            const locations = yield LocationTenant_1.default.getInstance(tenantId).find();
            if (!locations) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Locations not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: locations,
                message: 'List items successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const location = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(req.body.id)
                .exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Get location successfully',
                data: location,
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company, name, } = req.body;
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
            const findLocationName = yield LocationTenant_1.default.getInstance(tenantId).findOne({
                name: name,
                company: company,
            });
            if (findLocationName) {
                throw new AdvancedError_1.default({
                    name: {
                        kind: 'not.unique',
                        message: 'Location name is existed!',
                    },
                });
            }
            req.body.tenant = tenantId;
            const location = yield LocationTenant_1.default.getInstance(tenantId).create(req.body);
            res.send(new ResponseResult_1.default({
                message: 'Add location successfully',
                data: location,
            }));
        });
    }
    addMulti(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company, locations = [], } = req.body;
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
            req.body.tenant = tenantId;
            const list = yield bluebird_1.default.map(locations, (location = {}) => __awaiter(this, void 0, void 0, function* () {
                return yield LocationTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, location), { company: companyData, tenant: tenantId }));
            }));
            res.send(new ResponseResult_1.default({
                message: 'Save location successfully',
                data: list,
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, 
            // company,
            // name,
            id, } = req.body;
            const location = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            // validate company:
            // Not allow update: company, status
            location.set(this.filterParams(req.body, ['company']));
            yield location.save();
            if (location.isHeadQuarter) {
                const company = yield CompanyTenant_1.default.getInstance(tenantId)
                    .findById(location.company)
                    .exec();
                company.headQuarterAddress = location.headQuarterAddress;
                yield company.save();
            }
            res.send(new ResponseResult_1.default({
                message: 'Save location successfully',
                data: location,
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, tenantId }, } = req;
            const location = yield LocationTenant_1.default.getInstance(tenantId)
                .findOne({ _id: id })
                .exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found!',
                    },
                });
            }
            const listEmployee = yield EmployeeTenant_1.default.getInstance(tenantId)
                .findOne({
                location: id,
            })
                .exec();
            if (listEmployee) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'employee.existed',
                        message: `Can't remove because employees existed in location!`,
                    },
                });
            }
            yield location.remove();
            res.send(new ResponseResult_1.default({ message: 'Remove location successfully' }));
        });
    }
    active(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    location: { kind: 'not.found', message: 'Location not found' },
                });
            }
            // validate company:
            if (employee.company &&
                employee.company._id.toString() !== location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // Validate dependencies:
            if (lodash_1.get(location, 'company.status') === 'INACTIVE') {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'company',
                        kind: 'dependencies',
                        message: `Company is inactive.`,
                    },
                });
            }
            location.set({ status: 'ACTIVE' });
            yield location.save();
            res.send(new ResponseResult_1.default({
                message: 'Update Location successfully',
                data: location,
            }));
        });
    }
    inactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const location = yield LocationTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!location) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Location not found' },
                });
            }
            // validate company:
            if (employee.company &&
                employee.company._id.toString() !== location.company._id.toString()) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            // Update dependencies:
            yield UserTenant_1.default.getInstance(tenantId).updateMany({ location: id }, { status: 'INACTIVE' });
            location.set({ status: 'INACTIVE' });
            yield location.save();
            res.send(new ResponseResult_1.default({
                message: 'Update location successfully',
                data: location,
            }));
        });
    }
    // protected async fixAddress(req:Request, res:Response) {
    //   const locations: any = await Location.find();
    //   if(!locations ) {
    //     throw new AdvancedError({
    //       location: {kind: 'not.found', message: 'Location not found'}
    //     })
    //   }
    //   const filteredLocation = filter(locations, (item:any)=>(typeof item.address !== 'object'))
    //   console.log(filteredLocation)
    // }
    upsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user } = req;
            const tenantId = req.header('tenantId');
            const currentUser = user;
            if (lodash_1.isArray(body)) {
                const updated = [];
                const inserted = [];
                lodash_1.map(body, per => {
                    const { _id } = per;
                    if (!_id) {
                        inserted.push(Object.assign(Object.assign({}, per), { company: currentUser.employee.company._id }));
                    }
                    else {
                        updated.push({
                            updateOne: {
                                filter: { _id },
                                update: { $set: this.filterParams(per, ['_id', 'company']) },
                                upsert: false,
                            },
                        });
                    }
                });
                if (updated.length)
                    yield LocationTenant_1.default.getInstance(tenantId).bulkWrite(updated);
                if (inserted.length)
                    yield LocationTenant_1.default.getInstance(tenantId).insertMany(inserted);
            }
            else {
                throw new AdvancedError_1.default({
                    location: { kind: 'invalid', message: 'Body should be array' },
                });
            }
            const result = new ResponseResult_1.default({
                data: {},
                message: 'Update item successfully',
            });
            res.send(result);
        });
    }
    listByCompanyParent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { tenantIds = [], company } = req.body;
            company = mongoose_1.Types.ObjectId(company);
            let allLocations = [];
            yield bluebird_1.default.map(tenantIds, (tenantId) => __awaiter(this, void 0, void 0, function* () {
                let companies = [];
                companies = yield CompanyTenant_1.default.getInstance(tenantId).find({
                    $or: [{ childOfCompany: company }, { _id: company }],
                });
                companies = companies.map((item) => {
                    return item._id;
                });
                let aggregate = [];
                const matchOne = { $match: {} };
                matchOne.$match.company = {};
                matchOne.$match.company = { $in: companies };
                aggregate.push(matchOne);
                const lookup = [
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
                            from: 'countries',
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
                        name: 1,
                        accountNumber: 1,
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
                        company: {
                            _id: 1,
                            name: 1,
                            tenant: 1,
                        },
                    },
                };
                aggregate.push(project);
                const location = yield LocationTenant_1.default.getInstance(tenantId).aggregate(aggregate);
                allLocations = [...allLocations, ...location];
            }));
            // const location = await LocationTenant.getInstance(tenantId)
            //   .find({ company: { $in: companies } })
            //   .exec()
            res.send(new ResponseResult_1.default({
                message: 'Get location Child And Parent successfully',
                data: allLocations,
            }));
        });
    }
}
exports.default = new LocationTenantController();
//# sourceMappingURL=LocationTenantController.js.map