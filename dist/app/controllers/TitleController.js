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
const Company_1 = __importDefault(require("@/app/models/Company"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Title_1 = __importDefault(require("../models/Title"));
const lodash_1 = require("lodash");
class TitleController extends AbstractController_1.default {
    constructor(model) {
        super(model);
    }
    generateMethods() {
        return [
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
            },
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompany.bind(this),
                validationSchema: {
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
                name: 'list-by-department',
                type: 'POST',
                _ref: this.listByDeparment.bind(this),
                validationSchema: {
                    department: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Department is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Department must be provided'],
                        },
                    },
                },
            },
        ];
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const title = yield Title_1.default.findById(id);
            if (!title) {
                throw new AdvancedError_1.default({
                    payslip: { kind: 'not.found', message: 'title not found' },
                });
            }
            title.set(this.filterParams(req.body, []));
            yield title.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: title,
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 0, skip = 0, company, } = req.body;
            let filter = {
                company,
            };
            filter = lodash_1.pickBy(filter, lodash_1.identity);
            const data = yield Title_1.default.find(filter)
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ name: 1 })
                .exec();
            res.send(new ResponseResult_1.default({
                message: 'Successfully find',
                data,
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, department } = req.body;
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield Employee_1.default.findById(currentUser.employee);
            const companyData = yield Company_1.default.findById(employee.company).exec();
            if (!companyData) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'company not found.',
                    },
                });
            }
            const employeeType = yield Title_1.default.create({
                company: companyData,
                name,
                department,
            });
            res.send(new ResponseResult_1.default({
                message: 'add employee type successfully.',
                data: employeeType,
            }));
        });
    }
    listByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { company }, } = req;
            const titles = yield Title_1.default.find({ company });
            res.send(new ResponseResult_1.default({
                data: titles,
                message: 'List items successfully',
            }));
        });
    }
    listByDeparment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { department }, } = req;
            const titles = yield Title_1.default.find({ department });
            res.send(new ResponseResult_1.default({
                data: titles,
                message: 'List items successfully',
            }));
        });
    }
}
exports.default = new TitleController(Title_1.default);
//# sourceMappingURL=TitleController.js.map