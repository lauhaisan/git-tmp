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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const SkillTypeTenant_1 = __importDefault(require("@/app/models/SkillTypeTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class SkillTypeTenantController extends AbstractController_1.default {
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
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Name is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Name must be provided'],
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
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
        ];
    }
    // protected async list(req: Request, res: Response) {
    //   const skillTypes = await SkillTypeTenant.getInstance(tenantId).find({})
    //   res.send(
    //     new ResponseResult({
    //       data: skillTypes,
    //       message: 'List items successfully',
    //     }),
    //   )
    // }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { limit = 0, page = 1, skip = 0 } = body;
            const skillTypes = yield SkillTypeTenant_1.default.getInstance(tenantId)
                .find({})
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: skillTypes,
                message: 'List items successfully',
                total: yield SkillTypeTenant_1.default.getInstance(tenantId).countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const skillType = yield SkillTypeTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: skillType,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            const skillType = yield SkillTypeTenant_1.default.getInstance(tenantId).findById(id);
            if (!skillType) {
                throw new AdvancedError_1.default({
                    skillType: { kind: 'not.found', message: 'Skilltype not found' },
                });
            }
            skillType.set(this.filterParams(body, ['company']));
            yield skillType.save();
            res.send(new ResponseResult_1.default({
                data: skillType,
                message: 'Update item successfully',
            }));
        });
    }
}
exports.default = new SkillTypeTenantController();
//# sourceMappingURL=SkillTypeTenantController.js.map