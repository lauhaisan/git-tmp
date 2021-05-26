"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Type_1 = __importStar(require("@/app/models/Type"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class TypeController extends AbstractController_1.default {
    preInit() {
        this.fields = Type_1.typeFields;
    }
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
            const { body } = req;
            const currentUser = req.user;
            res.send(new ResponseResult_1.default({
                message: 'Get list type successfully',
                data: yield Type_1.default.find(this.processFilter(body, Object.assign({ status: 'ACTIVE' }, this.filterByRoles(currentUser))))
                    .sort({ _id: 1 })
                    .exec(),
            }));
        });
    }
    listAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const filter = this.filterByRoles(currentUser);
            res.send(new ResponseResult_1.default({
                message: 'Get list type successfully',
                data: yield Type_1.default.find(filter)
                    .sort({ _id: 1 })
                    .exec(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const currentUser = req.user;
            const employee = currentUser.employee;
            const { location, company } = employee;
            const type = yield Type_1.default.create(Object.assign(Object.assign({}, body), { location, company }));
            res.send(new ResponseResult_1.default({ message: 'Add type successfully', data: type }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id } = body;
            const type = yield Type_1.default.findById(id).exec();
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
            const { body: { id }, } = req;
            const type = yield Type_1.default.findById(id).exec();
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
exports.default = new TypeController(Type_1.default);
//# sourceMappingURL=TypeController.js.map