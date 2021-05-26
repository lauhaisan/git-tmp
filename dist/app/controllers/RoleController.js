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
const Role_1 = __importDefault(require("@/app/models/Role"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const role_1 = require("@/app/utils/role");
const lodash_1 = require("lodash");
const User_1 = __importDefault(require("../models/User"));
class RoleController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                    name: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Name is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Name must be provided'],
                        },
                    },
                    description: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                    },
                },
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByIdRole.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.updateRole.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-by-employee',
                type: 'POST',
                _ref: this.updateByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompanyRole.bind(this),
                validationSchema: {
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.removeRole.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.activeRole.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactiveRole.bind(this),
                validationSchema: {
                    _id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'add-default',
                type: 'POST',
                _ref: this.addDefault.bind(this),
            },
            {
                name: 'add-default',
                type: 'POST',
                _ref: this.addDefault.bind(this),
            },
        ];
    }
    addRole({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = body;
            const existRole = yield this.model.findById(_id);
            if (existRole) {
                throw new AdvancedError_1.default({
                    role: { kind: 'exists', message: 'Role is already exist' },
                });
            }
            const role = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: role,
                message: 'Add item successfully',
            }));
        });
    }
    updateRole({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = body;
            const role = yield this.model.findById(_id);
            if (!role) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            role.set(body);
            yield role.save();
            res.send(new ResponseResult_1.default({
                message: 'Updated successfully',
                data: role,
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = req.body;
            const role = yield Role_1.default.find({ company: undefined }).populate('permissions');
            let result = [];
            if (company) {
                const companyRole = yield Role_1.default.find({ company }).populate('permissions');
                result.push(...role, ...companyRole);
            }
            else {
                result.push(...role);
            }
            result = lodash_1.filter(result, ({ _id }) => _id !== 'ADMIN-SA');
            res.send(new ResponseResult_1.default({
                data: result,
                message: 'List items successfully',
            }));
        });
    }
    listByCompanyRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = req.body;
            const companyRole = yield this.model
                .find({ company })
                .populate('permissions');
            if (!companyRole) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: companyRole,
                message: 'List items by company successfully',
            }));
        });
    }
    getByIdRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const role = yield Role_1.default.findById(_id).populate('permissions');
            if (!role) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Get role successfully',
                data: role,
            }));
        });
    }
    removeRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const role = yield this.model.findById(_id);
            if (!role) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            yield role.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
            }));
        });
    }
    activeRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const role = yield this.model.findById(_id);
            if (!role) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            role.set({ status: 'ACTIVE' });
            yield role.save();
            res.send(new ResponseResult_1.default({
                message: 'Updated role successfully',
                data: role,
            }));
        });
    }
    inactiveRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.body;
            const role = yield this.model.findById(_id);
            if (!role) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            role.set({ status: 'INACTIVE' });
            yield role.save();
            res.send(new ResponseResult_1.default({
                message: 'Updated role successfully',
                data: role,
            }));
        });
    }
    addDefault(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _role = yield this.model.create(role_1.role);
            res.send(new ResponseResult_1.default({
                data: _role,
                message: 'Add role from json file successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = req.body;
            const user = yield User_1.default.findOne({ employee });
            res.send(new ResponseResult_1.default({
                message: 'Updated role successfully',
                data: { roles: user.roles },
            }));
        });
    }
    updateByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, roles } = req.body;
            const roleCheck = yield Role_1.default.find({ _id: { $in: roles } });
            if (roleCheck.length != roles.length) {
                throw new AdvancedError_1.default({
                    role: {
                        kind: 'not.found',
                        message: 'Role not found',
                    },
                });
            }
            const user = yield User_1.default.findOne({ employee });
            user.roles = roles;
            yield user.save();
            res.send(new ResponseResult_1.default({
                message: 'Updated role successfully',
                data: user,
            }));
        });
    }
}
exports.default = new RoleController(Role_1.default);
//# sourceMappingURL=RoleController.js.map