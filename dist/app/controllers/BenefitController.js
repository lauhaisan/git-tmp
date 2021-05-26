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
const Benefit_1 = __importDefault(require("@/app/models/Benefit"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class BenefitController extends AbstractController_1.default {
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
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompany.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    type: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Type is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Type must be provided'],
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
                    year: {
                        in: 'body',
                        isNumeric: {
                            errorMessage: ['isNumeric', 'Year is invalid'],
                        },
                    },
                    document: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Document is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Document must be provided'],
                        },
                    },
                    company: {
                        in: 'body',
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
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                        exists: {
                            errorMessage: ['isString', 'Id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const benefits = yield this.model.find();
            res.send(new ResponseResult_1.default({
                data: benefits,
                message: 'List items successfully',
            }));
        });
    }
    listByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const currentUser = user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const benefits = yield this.model.find({ company: employee.company });
            if (!benefits) {
                throw new AdvancedError_1.default({
                    benefit: { kind: 'not.found', message: 'Benefit not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: benefits,
                message: 'List items successfully',
            }));
        });
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const benefit = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: benefit,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id } = body;
            const benefit = yield this.model.findById(id);
            if (!benefit) {
                throw new AdvancedError_1.default({
                    benefit: { kind: 'not.found', message: 'Benefit not found' },
                });
            }
            benefit.set(this.filterParams(body, ['company']));
            yield benefit.save();
            res.send(new ResponseResult_1.default({
                data: benefit,
                message: 'Update item successfully',
            }));
        });
    }
}
exports.default = new BenefitController(Benefit_1.default);
//# sourceMappingURL=BenefitController.js.map