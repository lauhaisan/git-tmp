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
const PermissionTenant_1 = __importDefault(require("@/app/models/PermissionTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const permission_1 = require("@/app/utils/permission");
class PermissionTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
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
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
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
                _ref: this.update.bind(this),
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
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
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
                _ref: this.active.bind(this),
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
                _ref: this.inactive.bind(this),
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
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { _id } = req.body;
            const existPermission = yield PermissionTenant_1.default.getInstance(tenantId).findById(_id);
            if (existPermission) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'exists',
                        message: 'Permission already existed',
                    },
                });
            }
            const permission = yield PermissionTenant_1.default.getInstance(tenantId).create(req.body);
            res.send(new ResponseResult_1.default({
                data: permission,
                message: 'Add item successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const permission = yield PermissionTenant_1.default.getInstance(tenantId).find();
            res.send(new ResponseResult_1.default({
                data: permission,
                message: 'List item successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { _id } = req.body;
            const permission = yield PermissionTenant_1.default.getInstance(tenantId).findById(_id);
            if (!permission) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'exist',
                        message: 'Permission does not exist',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: permission,
                message: 'List item by id successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { _id } = req.body;
            const permission = yield PermissionTenant_1.default.getInstance(tenantId).findById(_id);
            if (!permission) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'exist',
                        message: 'Permission does not exist',
                    },
                });
            }
            permission.set(req.body);
            yield permission.save();
            res.send(new ResponseResult_1.default({
                data: permission,
                message: 'Updated successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { _id } = req.body;
            const permission = yield PermissionTenant_1.default.getInstance(tenantId).findById(_id);
            if (!permission) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'exist',
                        message: 'Permission does not exist',
                    },
                });
            }
            yield permission.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove successfully',
            }));
        });
    }
    addDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const _permission = yield PermissionTenant_1.default.getInstance(tenantId).create(permission_1.permission);
            res.send(new ResponseResult_1.default({
                data: _permission,
                message: 'Add permission from json file successfully',
            }));
        });
    }
}
exports.default = new PermissionTenantController();
//# sourceMappingURL=PermissionTenantController.js.map