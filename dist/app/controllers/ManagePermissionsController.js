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
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
class ManagePermissionController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'get-by-employee-tenant',
                type: 'POST',
                _ref: this.getByEmployeeTenant.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employee is missing'],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId is missing'],
                        },
                    },
                },
            },
            {
                name: 'update-by-employee-tenant',
                type: 'POST',
                _ref: this.updateByEmployeeTenant.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employee is missing'],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId is missing'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
            },
        ];
    }
    getByEmployeeTenant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, employee } = req.body;
            const data = yield ManagePermission_1.default.findOne({
                employee,
                tenant: tenantId,
            });
            res.send(new ResponseResult_1.default({
                data,
                message: 'Get permission of employee successfully',
            }));
        });
    }
    updateByEmployeeTenant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, employee } = req.body;
            let managePermission = yield ManagePermission_1.default.findOne({
                employee,
                tenant: tenantId,
            });
            // managePermission = { ...managePermission, ...req.body }
            managePermission.set(req.body);
            yield managePermission.save();
            res.send(new ResponseResult_1.default({
                data: managePermission,
                message: 'Update permission of employee successfully',
            }));
        });
    }
}
exports.default = new ManagePermissionController();
//# sourceMappingURL=ManagePermissionsController.js.map