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
const WorkHistoryTenant_1 = __importDefault(require("@/app/models/WorkHistoryTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
class WorkHistoryTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
            },
            {
                name: 'get-by-candidate',
                type: 'POST',
                _ref: this.getByCandidate.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                },
            },
        ];
    }
    getByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const { candidate } = body;
            const workHistory = yield WorkHistoryTenant_1.default.getInstance(tenantId).findOne({
                candidate,
            });
            if (!workHistory) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: workHistory,
                message: 'Get items successfully',
            }));
        });
    }
}
exports.default = new WorkHistoryTenantController();
//# sourceMappingURL=WorkHistoryTenantController.js.map