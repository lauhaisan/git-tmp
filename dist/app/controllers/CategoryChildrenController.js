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
const CategoryChildren_1 = __importDefault(require("@/app/models/CategoryChildren"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const CategoryParent_1 = __importDefault(require("../models/CategoryParent"));
class CategoryChildrenController extends AbstractController_1.default {
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
                        in: ['body'],
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
                        in: ['body'],
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
                        in: ['body'],
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
                name: 'get-by-parent',
                type: 'POST',
                _ref: this.getByParent,
                validationSchema: {
                    categoryParent: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
        ];
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryChild = yield CategoryChildren_1.default.find({}).exec();
            res.send(new ResponseResult_1.default({
                data: categoryChild,
                message: 'List items successfbearully',
                total: yield CategoryChildren_1.default.countDocuments(),
            }));
        });
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryParent, name, order } = body;
            const parent = yield CategoryParent_1.default.findById(categoryParent);
            if (!parent) {
                throw new AdvancedError_1.default({
                    categoryParent: {
                        kind: 'not.found',
                        message: 'categoryParent not found',
                    },
                });
            }
            const nameChilds = yield CategoryChildren_1.default.find({ categoryParent, name });
            if (nameChilds.length !== 0) {
                throw new AdvancedError_1.default({
                    categoryChild: {
                        kind: 'existed',
                        message: 'name existed',
                    },
                });
            }
            const orderChilds = yield CategoryChildren_1.default.find({ categoryParent, order });
            if (orderChilds.length !== 0) {
                throw new AdvancedError_1.default({
                    categoryChild: {
                        kind: 'existed',
                        message: 'order existed',
                    },
                });
            }
            const categoryChild = yield CategoryChildren_1.default.create(body);
            res.send(new ResponseResult_1.default({
                data: categoryChild,
                message: 'Add item successfully',
            }));
        });
    }
    getByID({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            const categoryChild = yield CategoryChildren_1.default.findById(id);
            if (!categoryChild) {
                throw new AdvancedError_1.default({
                    categoryDocument: {
                        kind: 'not.found',
                        message: 'categoryDodument not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: categoryChild,
                message: 'Get item successfully',
            }));
        });
    }
    update({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryParent, name, order, id } = body;
            const child = yield CategoryChildren_1.default.findById(id);
            if (!child) {
                throw new AdvancedError_1.default({
                    categoryParent: {
                        kind: 'not.found',
                        message: 'categoryParent not found',
                    },
                });
            }
            if (categoryParent) {
                const parent = yield CategoryParent_1.default.findById(categoryParent);
                if (!parent) {
                    throw new AdvancedError_1.default({
                        categoryParent: {
                            kind: 'not.found',
                            message: 'categoryParent not found',
                        },
                    });
                }
                if (child.name !== name) {
                    const nameChilds = yield CategoryChildren_1.default.find({ categoryParent, name });
                    if (nameChilds.length !== 0) {
                        throw new AdvancedError_1.default({
                            categoryChild: {
                                kind: 'existed',
                                message: 'name existed',
                            },
                        });
                    }
                }
                if (child.order !== order) {
                    const orderChilds = yield CategoryChildren_1.default.find({
                        categoryParent,
                        order,
                    });
                    if (orderChilds.length !== 0) {
                        throw new AdvancedError_1.default({
                            categoryChild: {
                                kind: 'existed',
                                message: 'order existed',
                            },
                        });
                    }
                }
            }
            child.set(body);
            yield child.save();
            res.send(new ResponseResult_1.default({
                data: child,
                message: 'Update item successfully',
            }));
        });
    }
    getByParent({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryParent } = body;
            const total = yield CategoryChildren_1.default.find({ categoryParent }).count();
            const list = yield CategoryChildren_1.default.find({ categoryParent })
                .sort({ order: 1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: list,
                total: total,
                message: 'get list successfully',
            }));
        });
    }
    remove({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield CategoryChildren_1.default.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
    getByPage({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = body;
            let aggregates = [];
            const lookup = [
                {
                    $lookup: {
                        from: 'categoryparents',
                        localField: 'categoryParent',
                        foreignField: '_id',
                        as: 'categoryParent',
                    },
                },
                {
                    $unwind: {
                        path: '$categoryParent',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const projects = {
                $project: {
                    _id: 1,
                    name: 1,
                    order: 1,
                    categoryParent: {
                        _id: 1,
                        name: 1,
                        categoryFor: 1,
                        page: 1,
                    },
                },
            };
            aggregates = [...aggregates, ...lookup, projects];
            const matchOne = { $match: { 'categoryParent.page': page } };
            // matchOne.$match.categoryParent.page = page
            aggregates.push(matchOne);
            let categoryDocuments = yield CategoryChildren_1.default.aggregate(aggregates).sort({
                order: 1,
            });
            res.send(new ResponseResult_1.default({
                data: categoryDocuments,
                message: 'get list successfully',
            }));
        });
    }
}
exports.default = new CategoryChildrenController();
//# sourceMappingURL=CategoryChildrenController.js.map