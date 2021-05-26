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
const CategoryParent_1 = __importDefault(require("@/app/models/CategoryParent"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const CategoryChildren_1 = __importDefault(require("../models/CategoryChildren"));
class CategoryParentController extends AbstractController_1.default {
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
                _ref: this.getByID.bind(this),
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
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
                name: 'get-by-page',
                type: 'POST',
                _ref: this.getByPage.bind(this),
                validationSchema: {
                    page: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'page is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'page must be provided'],
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
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
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
                name: 'delete',
                type: 'POST',
                _ref: this.remove.bind(this),
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryParents = yield CategoryParent_1.default.find({})
                .sort({ order: 1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: categoryParents,
                message: 'List items successfbearully',
                total: yield CategoryParent_1.default.countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const categoryParent = yield CategoryParent_1.default.create(body);
            res.send(new ResponseResult_1.default({
                data: categoryParent,
                message: 'Add item successfully',
            }));
        });
    }
    getByID({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            const categoryParent = yield CategoryParent_1.default.findById(id);
            if (!categoryParent) {
                throw new AdvancedError_1.default({
                    categoryDocument: {
                        kind: 'not.found',
                        message: 'categoryDodument not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: categoryParent,
                message: 'Get item successfully',
            }));
        });
    }
    update({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            const categoryParent = yield CategoryParent_1.default.findById(id);
            if (!categoryParent) {
                throw new AdvancedError_1.default({
                    categoryDocument: {
                        kind: 'not.found',
                        message: 'categoryDocument not found',
                    },
                });
            }
            categoryParent.set(body);
            yield categoryParent.save();
            res.send(new ResponseResult_1.default({
                data: categoryParent,
                message: 'Update item successfully',
            }));
        });
    }
    getByPage({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = body;
            const total = yield CategoryParent_1.default.find({ page }).count();
            const list = yield CategoryParent_1.default.find({ page })
                .sort({ order: 1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: list,
                total,
                message: 'get list successfully',
            }));
        });
    }
    remove({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield CategoryParent_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield CategoryChildren_1.default.deleteMany({ categoryParent: item.id });
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
}
exports.default = new CategoryParentController();
//# sourceMappingURL=CategoryParentController.js.map