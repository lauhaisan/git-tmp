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
const bluebird_1 = __importDefault(require("bluebird"));
const AbstractController_1 = __importDefault(require("../declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const CustomFieldTenant_1 = __importDefault(require("../models/CustomFieldTenant"));
// import CustomFieldTenant from '../models/CustomFieldTenant'
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class CustomFieldTenantController extends AbstractController_1.default {
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model ? this.model : CustomFieldTenant(tenantId)
            // this.CustomFieldTenantModel = this.CustomFieldTenantModel
            //   ? this.CustomFieldTenantModel
            //   : this.model
        });
    }
    generateMethods() {
        return [
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
            },
            {
                name: 'get-by-section',
                type: 'POST',
                _ref: this.getBySection,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
            },
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            this.setInstanceModel(req);
            const { filters } = req.body;
            if (filters.length > 0) {
                yield bluebird_1.default.map(filters, (item) => {
                    if (Object.keys(item).length < 2)
                        throw new AdvancedError_1.default({
                            filters: {
                                kind: 'not.valid',
                                message: 'Must return both department and title fields or not at all',
                            },
                        });
                });
            }
            const field = yield CustomFieldTenant_1.default.getInstance(tenantId).create(req.body);
            res.send(new ResponseResult_1.default({
                message: 'Added item successfully',
                data: field,
            }));
        });
    }
    getBySection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            this.setInstanceModel(req);
            const { section } = req.body;
            const fields = yield CustomFieldTenant_1.default.getInstance(tenantId).find({
                section,
            });
            if (fields) {
                res.send(new ResponseResult_1.default({
                    message: 'Fetched custom fields by section name successfully',
                    data: fields,
                }));
            }
            else
                res.send(new AdvancedError_1.default({
                    fields: { kind: 'not.found', message: 'Custom fields not found' },
                }));
        });
    }
}
exports.default = new CustomFieldTenantController();
//# sourceMappingURL=CustomFieldTenantController.js.map