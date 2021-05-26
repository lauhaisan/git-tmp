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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import config from '@/app/config/index';
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Certification_1 = __importDefault(require("@/app/models/Certification"));
// import Employee from '@/app/models/Employee';
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class CertificationController extends AbstractController_1.default {
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
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Name is invalid'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    // name: {
                    //   in: ['body'],
                    //   isString: {
                    //     errorMessage: ['isString', 'Name is invalid'],
                    //   },
                    //   exists: {
                    //     errorMessage: ['required', 'Name must be provided'],
                    //   },
                    // },
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
                _ref: this.remove,
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
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 0, page = 1, skip = 0 } = body;
            const certifications = yield this.model
                .find({})
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: certifications,
                message: 'List items successfully',
                total: yield this.model.countDocuments(),
            }));
        });
    }
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const certification = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: certification,
                message: 'Add item successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const certification = yield this.model.findById(id);
            if (!certification) {
                throw new AdvancedError_1.default({
                    certification: {
                        kind: 'not.found',
                        message: 'Certification not found',
                    },
                });
            }
            certification.set(this.filterParams(body, ['employee', 'company']));
            yield certification.save();
            res.send(new ResponseResult_1.default({
                data: certification,
                message: 'Update item successfully',
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const list = yield Certification_1.default.find({ employee });
            res.send(new ResponseResult_1.default({
                data: list,
                message: 'get list successfully',
            }));
        });
    }
}
exports.default = new CertificationController(Certification_1.default);
//# sourceMappingURL=CertificationControler.js.map