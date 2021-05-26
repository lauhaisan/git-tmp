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
// import Company from '@/app/models/Company
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const FAQsDefault_1 = __importDefault(require("@/app/utils/FAQsDefault"));
const FAQs_1 = __importDefault(require("../models/FAQs"));
class FAQsController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
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
            },
            {
                name: 'get-by-company',
                type: 'POST',
                _ref: this.getByCompany.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
            {
                name: 'active',
                type: 'POST',
                _ref: this.active.bind(this),
            },
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.inactive.bind(this),
            },
            {
                name: 'init-default',
                type: 'POST',
                _ref: this.initDefault.bind(this),
            },
        ];
    }
    initDefault(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const existData = yield this.model.find();
            const companyNull = yield this.model.findOne({
                company: null,
            });
            if (companyNull) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'exists',
                        message: 'FAQ default already existed',
                    },
                });
            }
            existData.map((item) => {
                if (item.company === null) {
                    throw new AdvancedError_1.default({
                        faq: {
                            kind: 'exists',
                            message: 'FAQ default already existed',
                        },
                    });
                }
            });
            const newData = new FAQs_1.default({
                faq: FAQsDefault_1.default.faq,
            });
            yield newData.save();
            res.send(new ResponseResult_1.default({
                data: newData,
                message: 'Init successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, company } = req.body;
            // get data default's id
            const data = yield this.model.findById(id);
            const existFAQ = yield this.model.findOne({ company: company });
            if (existFAQ) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'exists',
                        message: 'FAQ for this company already existed',
                    },
                });
            }
            if (!data) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'not.found',
                        message: 'FAQ default data not found',
                    },
                });
            }
            // const newData = data.toObject()
            const newFAQ = new FAQs_1.default({
                faq: data.faq,
                company: company,
            });
            // newData.set({
            //   faq: newData.faq,
            //   company: company,
            // })
            yield newFAQ.save();
            res.send(new ResponseResult_1.default({
                data: newFAQ,
                message: 'Add successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const data = yield this.model.find(id);
            if (!data) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'not.found',
                        message: 'FAQ not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'List successfully',
            }));
        });
    }
    getByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company } = req.body;
            const data = yield this.model.findOne({
                company: company,
            });
            if (!data) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'not.found',
                        message: 'FAQ not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data,
                message: 'List successfully',
            }));
        });
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: yield this.model.find(),
                message: 'Get list successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, dataNew, defaultId } = req.body;
            const data = yield this.model.findById(id);
            const defaultData = yield this.model.findById(defaultId);
            if (!data) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'not.found',
                        message: 'FAQ not found',
                    },
                });
            }
            if (!defaultData) {
                throw new AdvancedError_1.default({
                    faq: {
                        kind: 'not.found',
                        message: 'FAQ default not found',
                    },
                });
            }
            const newData = data.toObject();
            const cate = newData.faq.find((item) => item.category === dataNew.category);
            if (!cate) {
                newData.faq.push(dataNew);
                res.send(new ResponseResult_1.default({
                    data,
                    message: 'Update successfully',
                }));
            }
            cate.questionAndAnswer = [
                ...cate.questionAndAnswer,
                ...dataNew.questionAndAnswer,
            ];
            data.set({
                faq: newData.faq,
            });
            // Update default
            const newDefault = defaultData.toObject();
            const cateDefault = newDefault.faq.find((item) => item.category === dataNew.category);
            if (!cateDefault) {
                newDefault.faq.push(dataNew);
                res.send(new ResponseResult_1.default({
                    data,
                    message: 'Update successfully',
                }));
            }
            cateDefault.questionAndAnswer = [
                ...cateDefault.questionAndAnswer,
                ...dataNew.questionAndAnswer,
            ];
            data.set({
                faq: newData.faq,
            });
            defaultData.set({
                faq: newDefault.faq,
            });
            yield data.save();
            yield defaultData.save();
            res.send(new ResponseResult_1.default({
                data,
                message: 'Update Successfully',
            }));
        });
    }
}
exports.default = new FAQsController(FAQs_1.default);
//# sourceMappingURL=FAQsController.js.map