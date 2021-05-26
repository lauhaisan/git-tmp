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
// import CompanyTenant from '@/app/models/CompanyTenant'
// import DepartmentTenant from '@/app/models/DepartmentTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
// import LocationTenant from '@/app/models/LocationTenant'
// import UserTenant from '@/app/models/UserTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const DepartmentTenant_1 = __importDefault(require("../models/DepartmentTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
class DepartmentTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
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
                name: 'upsert',
                type: 'POST',
                _ref: this.upsert.bind(this),
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
                name: 'list-default',
                type: 'POST',
                _ref: this.listDefault,
            },
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompany.bind(this),
                validationSchema: {
                    company: {
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
                name: 'add-default',
                type: 'POST',
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'Department id must be provided'],
                        },
                    },
                    team: {
                        isArray: {
                            errorMessage: ['isArray', 'Team is invalid, must be an array'],
                        },
                        exists: {
                            errorMessage: ['required', 'Team must be provided'],
                        },
                    },
                },
                _ref: this.addDefault.bind(this),
            },
        ];
    }
    /* Find location list of the currentUser company */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 0, skip = 0, company, 
            // status,
            tenantId, } = req.body;
            let filter = {
                company,
            };
            filter = lodash_1.pickBy(filter, lodash_1.identity);
            // if (currentUser.hasPermission(['admin-sa'])) {
            //   delete filter.company
            // }
            // if (!isEmpty(status)) {
            //   filter.status = status
            // }
            // if (q) {
            //   filter.name = searchQ
            // }
            const data = yield DepartmentTenant_1.default.getInstance(tenantId)
                .find(filter)
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ date: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                message: 'Get department list successfully',
                data,
            }));
        });
    }
    // List department by company
    listByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { company } = body;
            const departments = yield DepartmentTenant_1.default.getInstance(tenantId).find({
                company,
            });
            if (!departments) {
                throw new AdvancedError_1.default({
                    department: { kind: 'not.found', message: 'Department not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: departments,
                message: 'List items successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const department = yield DepartmentTenant_1.default.getInstance(tenantId)
                .findById(req.body.id)
                .exec();
            if (!department) {
                throw new AdvancedError_1.default({
                    department: {
                        kind: 'not.found',
                        message: 'department not found!',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Get location successfully',
                data: department,
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            req.body.tenant = tenantId;
            const department = yield DepartmentTenant_1.default.getInstance(tenantId).create(req.body);
            // const department = ''
            res.send(new ResponseResult_1.default({
                message: 'Add department successfully',
                data: department,
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { id } = body;
            // const currentUser = req.user as IUser
            // const employee = currentUser.employee as IEmployee
            const department = yield DepartmentTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!department) {
                throw new AdvancedError_1.default({
                    department: {
                        kind: 'not.found',
                        message: 'department not found!',
                    },
                });
            }
            department.set(this.filterParams(body, ['company']));
            yield department.save();
            res.send(new ResponseResult_1.default({
                message: 'Save location successfully',
                data: department,
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            const { body: { id }, } = req;
            const userRoles = lodash_1.map(currentUser.roles, ({ _id }) => _id);
            const department = (yield DepartmentTenant_1.default.getInstance(tenantId)
                .findOne({
                _id: id,
            })
                .exec());
            if (!department) {
                throw new AdvancedError_1.default({
                    department: {
                        kind: 'not.found',
                        message: 'Department not found!',
                    },
                });
            }
            // const { company}: {isDefault: boolean, company: any} = department
            if (department.company) {
                console.log(currentUser.employee.company._id, department.company);
                console.log(!lodash_1.includes(userRoles, ['HR-GLOBAL', 'ADMIN-CSA']));
                if (currentUser.employee.company._id.toString() !==
                    department.company._id.toString() ||
                    !userRoles.some(r => ['HR-GLOBAL', 'ADMIN-CSA'].includes(r))) {
                    throw new AdvancedError_1.default({
                        department: {
                            kind: 'not.permission',
                            message: 'User does not permission',
                        },
                    });
                }
                yield DepartmentTenant_1.default.getInstance(tenantId).deleteOne({
                    _id: department._id,
                });
            }
            else {
                if (!lodash_1.includes(lodash_1.map(currentUser.roles, (per) => per._id), 'ADMIN-SA')) {
                    throw new AdvancedError_1.default({
                        department: {
                            kind: 'not.permission',
                            message: 'User does not permission',
                        },
                    });
                }
                yield DepartmentTenant_1.default.getInstance(tenantId).deleteOne({
                    _id: department._id,
                });
            }
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
    listDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const departments = yield DepartmentTenant_1.default.getInstance(tenantId).find({
                isDefault: true,
            });
            res.send(new ResponseResult_1.default({
                data: departments,
                message: 'List items successfully',
            }));
        });
    }
    addDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { id, team } = req.body;
            const department = yield DepartmentTenant_1.default.getInstance(tenantId).findById(id);
            if (!department) {
                throw new AdvancedError_1.default({
                    department: { kind: 'not.found', message: 'Department not found' },
                });
            }
            department.team = [...team];
            yield department.save();
            res.send(new ResponseResult_1.default({
                data: {
                    department,
                },
                message: 'Add default department list successfully',
            }));
        });
    }
    upsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body, user } = req;
            const currentUser = user;
            const { employee: { company: { _id: companyId }, }, } = currentUser;
            if (lodash_1.isArray(body)) {
                const inserted = [];
                const updated = [];
                lodash_1.map(body, (per) => {
                    const { _id } = per;
                    if (!_id) {
                        inserted.push(Object.assign(Object.assign({}, per), { company: companyId }));
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
                // console.log(inserted, updated)
                if (updated.length)
                    yield DepartmentTenant_1.default.getInstance(tenantId).bulkWrite(updated);
                if (inserted.length)
                    yield DepartmentTenant_1.default.getInstance(tenantId).insertMany(inserted);
            }
            else {
                throw new AdvancedError_1.default({
                    department: { kind: 'invalid', message: 'Body should be array' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: {},
                message: 'Update items successfully',
            }));
        });
    }
}
exports.default = new DepartmentTenantController();
//# sourceMappingURL=DepartmentTenantController.js.map