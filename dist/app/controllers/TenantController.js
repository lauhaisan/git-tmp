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
// import AdvancedError from '@/app/declares/AdvancedError'
const Tenant_1 = __importDefault(require("@/app/models/Tenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class TenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                _ref: this.list.bind(this),
                authorized: false,
                type: 'POST',
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                },
            },
        ];
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenants = yield Tenant_1.default.find({});
            res.send(new ResponseResult_1.default({
                data: tenants,
                message: 'get tenant list successfully',
            }));
        });
    }
}
exports.default = new TenantController(Tenant_1.default);
//# sourceMappingURL=TenantController.js.map