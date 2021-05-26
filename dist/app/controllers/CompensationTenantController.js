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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const CompensationTenant_1 = __importDefault(require("../models/CompensationTenant"));
// import CompensationTenant from '../models/CompensationTenant'
class CompensationTenantController extends AbstractController_1.default {
    // private async setInstanceModel(_req: Request) {
    // const header = req.header('tenantId')
    // const tenantId = header ? header : ''
    // this.model = this.model ? this.model : new CompensationTenant(tenantId).getModel()
    // this.CompensationTenantModel = this.CompensationTenantModel
    //   ? this.CompensationTenantModel
    //   : this.model
    // }
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
            },
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
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { tenantId } = body;
            const compensation = yield CompensationTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: compensation,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const compensation = yield CompensationTenant_1.default.getInstance(tenantId).findById(id);
            compensation.set(this.filterParams(req.body, ['employee', 'company']));
            yield compensation.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: compensation,
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { employee, tenantId } = body;
            const compensation = yield CompensationTenant_1.default.getInstance(tenantId).findOne({ employee });
            res.send(new ResponseResult_1.default({
                data: compensation,
                message: 'get compensation successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const item = yield CompensationTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get item successfully',
            }));
        });
    }
}
exports.default = new CompensationTenantController();
//# sourceMappingURL=CompensationTenantController.js.map