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
const TypeTenant_1 = __importDefault(require("@/app/models/TypeTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class TypeTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'GET',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-all',
                type: 'GET',
                _ref: this.listAll.bind(this),
                possiblePers: ['manage-type'],
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
                possiblePers: ['manage-type'],
                validationSchema: {
                    type: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Type title must be provided'],
                        },
                        trim: {
                            options: ' ',
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
                possiblePers: ['manage-type'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                    type: {
                        in: 'body',
                        isEmpty: {
                            errorMessage: 'Type title must be provided',
                            negated: true,
                        },
                        trim: {
                            options: ' ',
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                possiblePers: ['manage-type'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const currentUser = req.user;
            res.send(new ResponseResult_1.default({
                message: 'Get list type successfully',
                data: yield TypeTenant_1.default.getInstance(tenantId)
                    .find(this.processFilter(body, Object.assign({ status: 'ACTIVE' }, this.filterByRoles(currentUser))))
                    .sort({ _id: 1 })
                    .exec(),
            }));
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            const filter = this.filterByRoles(currentUser);
            res.send(new ResponseResult_1.default({
                message: 'Get list type successfully',
                data: yield TypeTenant_1.default.getInstance(tenantId)
                    .find(filter)
                    .sort({ _id: 1 })
                    .exec(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const { location, company } = employee;
            const type = yield TypeTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, body), { location,
                company }));
            res.send(new ResponseResult_1.default({ message: 'Add type successfully', data: type }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { id } = body;
            const type = yield TypeTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!type) {
                throw new AdvancedError_1.default({
                    type: {
                        kind: 'not.found',
                        message: 'Expense type not found!',
                    },
                });
            }
            const fields = Object.assign({}, body);
            type.set(this.processFilter(body, fields, ['type', 'thumbnailUrl', 'status']));
            yield type.save();
            res.send(new ResponseResult_1.default({ message: 'Save type successfully', data: type }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const type = yield TypeTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!type) {
                throw new AdvancedError_1.default({
                    type: {
                        kind: 'not.found',
                        message: 'Expense type not found!',
                    },
                });
            }
            res.send(new ResponseResult_1.default({ message: 'Remove type successfully' }));
        });
    }
}
exports.default = new TypeTenantController();
//# sourceMappingURL=TypeTenantController.js.map