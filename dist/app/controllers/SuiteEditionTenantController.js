"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
class SuiteEditionTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list,
                possiblePers: ['admin-sa'],
            },
            {
                name: 'get-by-id',
                _ref: this.getByID,
                type: 'POST',
                authorized: false,
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
                _ref: this.add,
                possiblePers: ['admin-sa'],
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
                possiblePers: ['admin-sa'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                possiblePers: ['admin-sa'],
            },
        ];
    }
}
exports.default = new SuiteEditionTenantController();
//# sourceMappingURL=SuiteEditionTenantController.js.map