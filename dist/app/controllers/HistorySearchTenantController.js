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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const HistorySearchTenant_1 = __importDefault(require("../models/HistorySearchTenant"));
const HistorySearchTenant_2 = __importDefault(require("../models/HistorySearchTenant"));
class HistorySearchTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
            {
                name: 'add-and-update',
                type: 'POST',
                _ref: this.addAndUpdate.bind(this),
            },
        ];
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, tenantId, company } = req.body;
            const data = yield HistorySearchTenant_1.default.getInstance(tenantId).findOne({
                user: user,
                company: company,
            });
            res.send(new ResponseResult_1.default({
                data: data,
                message: 'Success',
            }));
        });
    }
    addAndUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, key, dataSearch, tenantId, company } = req.body;
            const existHistory = yield HistorySearchTenant_2.default.getInstance(tenantId).findOne({
                user: user,
                company,
            });
            if (!existHistory) {
                const data = yield HistorySearchTenant_2.default.getInstance(tenantId).create({
                    user: user,
                    key: key,
                    dataSearch: dataSearch,
                    company: company,
                });
                res.send(new ResponseResult_1.default({
                    data: data,
                    message: 'Add new successfully',
                }));
            }
            yield HistorySearchTenant_2.default.getInstance(tenantId).updateOne({ user: user }, {
                $set: {
                    key: [...key],
                    dataSearch: dataSearch,
                },
            });
            res.send(new ResponseResult_1.default({
                data: existHistory,
                message: 'Success',
            }));
        });
    }
}
exports.default = new HistorySearchTenantController();
//# sourceMappingURL=HistorySearchTenantController.js.map