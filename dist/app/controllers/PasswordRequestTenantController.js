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
const PasswordRequestTenant_1 = __importDefault(require("@/app/models/PasswordRequestTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
class PasswordRequestTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
                possiblePers: ['admin-sa'],
            },
            {
                name: 'get-by-code',
                _ref: this.getByCode,
                type: 'POST',
                authorized: false,
                validationSchema: {
                    code: {
                        exists: {
                            errorMessage: [
                                'required',
                                'Code of PasswordRequest must be provided',
                            ],
                        },
                    },
                },
            },
        ];
    }
    getByCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { code }, } = req;
            const item = yield PasswordRequestTenant_1.default.getInstance(tenantId)
                .findOne({
                code,
            })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: constant_1.MSG.mailExpiredLink },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get item successfully',
            }));
        });
    }
}
exports.default = new PasswordRequestTenantController();
//# sourceMappingURL=PasswordRequestTenantController.js.map