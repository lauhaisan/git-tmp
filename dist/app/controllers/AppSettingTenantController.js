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
// import AppSettingTenant from '@/app/models/AppSettingTenant'
// import CompanyTenant from '@/app/models/CompanyTenant'
// import LocationTenant from '@/app/models/LocationTenant'
const ClientService_1 = __importDefault(require("@/app/services/ClientService"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const defaultData_1 = require("@/app/utils/defaultData");
const lodash_1 = require("lodash");
const AppSettingTenant_1 = __importDefault(require("../models/AppSettingTenant"));
const CompanyTenant_1 = __importDefault(require("../models/CompanyTenant"));
const LocationTenant_1 = __importDefault(require("../models/LocationTenant"));
// import { DEFAULT_DOCUMENT_CHECKLIST } from '../utils/constant'
class AppSettingTenantController extends AbstractController_1.default {
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
                validationSchema: {
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Company id must be provided'],
                        },
                    },
                    location: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Location id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
                possiblePers: ['admin-cla'],
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
            {
                name: 'get-by-location',
                _ref: this.getByLocation,
                type: 'POST',
                validationSchema: {
                    location: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Location id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-api',
                type: 'POST',
                _ref: this.updateApi,
                possiblePers: ['admin-cla'],
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Id must be provided'],
                        },
                    },
                    authorizeApi: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'authorizeApi must be provided'],
                        },
                    },
                    employeeListApi: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employeeListApi must be provided'],
                        },
                    },
                    employeeDetailApi: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'employeeDetailApi must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update-default-settings',
                type: 'POST',
                _ref: this.updateDefaultSettings.bind(this),
                possiblePers: ['admin-sa'],
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
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body, body: { company = '', location = '' }, } = req;
            if (!(yield CompanyTenant_1.default.getInstance(tenantId).findById(company))) {
                throw new AdvancedError_1.default({
                    company: {
                        kind: 'not.found',
                        message: 'Company not found.',
                    },
                });
            }
            if (!(yield LocationTenant_1.default.getInstance(tenantId).findById(location))) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'Location not found.',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Init default items successfully',
                data: yield AppSettingTenant_1.default.getInstance(tenantId).create(Object.assign(Object.assign({}, body), defaultData_1.APP_SETTING)),
            }));
        });
    }
    getByLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { location = '' }, } = req;
            const item = yield AppSettingTenant_1.default.getInstance(tenantId)
                .findOne({ location })
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    appSetting: {
                        kind: 'not.found',
                        message: 'Application setting not found',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                data: item,
                message: 'Get Application setting successfully',
            }));
        });
    }
    updateApi(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id, authorizeApi, employeeListApi, employeeDetailApi }, } = req;
            const currentUser = req.user;
            if (currentUser.hasRoles(['ADMIN-CLA'])) {
            }
            const appSetting = yield AppSettingTenant_1.default.getInstance(tenantId).findById(id);
            if (!appSetting) {
                throw new AdvancedError_1.default({
                    location: {
                        kind: 'not.found',
                        message: 'App Setting not found.',
                    },
                });
            }
            if (!lodash_1.isEmpty(employeeListApi) ||
                !lodash_1.isEmpty(employeeDetailApi) ||
                !lodash_1.isEmpty(authorizeApi)) {
                const requiredKeys = [
                    'employeeEmail',
                    'employeeId',
                    'firstName',
                ];
                yield ClientService_1.default.checkAPI(employeeListApi, requiredKeys, true, 'Employee List API not work.');
                yield ClientService_1.default.checkAPI(employeeDetailApi, requiredKeys, false, 'Employee Detail API not work.');
                yield ClientService_1.default.checkAPI(authorizeApi, requiredKeys, false, 'Authorize API not work.');
            }
            yield appSetting.save();
            res.send(new ResponseResult_1.default({
                message: 'Update api successfully',
                data: appSetting,
            }));
        });
    }
    updateDefaultSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            const appSetting = yield AppSettingTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!appSetting) {
                throw new AdvancedError_1.default({
                    appSetting: {
                        kind: 'not.found',
                        message: 'Application setting not found',
                    },
                });
            }
            yield AppSettingTenant_1.default.getInstance(tenantId)
                .findByIdAndUpdate(id, defaultData_1.APP_SETTING)
                .exec();
            res.send(new ResponseResult_1.default({
                message: 'Application setting update successfully',
            }));
        });
    }
}
exports.default = new AppSettingTenantController();
//# sourceMappingURL=AppSettingTenantController.js.map