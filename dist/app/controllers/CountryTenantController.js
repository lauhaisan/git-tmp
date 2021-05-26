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
// import CountryTenant from '@/app/models/CountryTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const CountryTenant_1 = __importDefault(require("../models/CountryTenant"));
class CountryTenantController extends AbstractController_1.default {
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model
            //   ? this.model
            //   : new CountryTenant(tenantId).getModel()
            // this.CountryTenantModel = this.CountryTenantModel
            //   ? this.CountryTenantModel
            //   : this.model
        });
    }
    generateMethods() {
        return [
            {
                name: 'list',
                _ref: this.list.bind(this),
                authorized: false,
                type: 'POST',
            },
            {
                name: 'get-by-id',
                _ref: this.getByID,
                type: 'POST',
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'Code of country must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-states',
                _ref: this.getStates.bind(this),
                type: 'POST',
                validationSchema: {
                    id: {
                        exists: {
                            errorMessage: ['required', 'Code of country must be provided'],
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
                            errorMessage: ['required', 'Code of country must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
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
            {
                name: 'active',
                type: 'POST',
                _ref: this.active,
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
            {
                name: 'inactive',
                type: 'POST',
                _ref: this.active,
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
            {
                name: 'update-from-api',
                type: 'POST',
                _ref: this.updateFromApi,
                possiblePers: ['admin-sa'],
            },
            {
                name: 'init-state',
                type: 'POST',
                _ref: this.initState.bind(this),
            },
        ];
    }
    initState(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            this.setInstanceModel(_req);
            const { data: { auth_token }, } = yield axios_1.default(Object.assign({}, constant_1.API_3RD.state));
            if (!auth_token) {
                throw new AdvancedError_1.default({
                    country: { kind: 'failed', message: 'Auth token failed' },
                });
            }
            const { data: getListCountriesFromAPI } = yield axios_1.default.get(`https://www.universal-tutorial.com/api/countries/`, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    Accept: 'application/json',
                },
            });
            const countries = yield CountryTenant_1.default.getInstance(tenantId)
                .find()
                .select('_id name');
            if (!countries) {
                throw new AdvancedError_1.default({
                    country: { kind: 'not.found', message: 'Countries not found' },
                });
            }
            yield bluebird_1.default.map(countries, (per) => __awaiter(this, void 0, void 0, function* () {
                const dataTmp = lodash_1.filter(getListCountriesFromAPI, tmp => {
                    return tmp.country_short_name === per._id;
                });
                if (dataTmp.length > 0) {
                    const { data } = yield axios_1.default.get(`https://www.universal-tutorial.com/api/states/${dataTmp[0].country_name}`, {
                        headers: {
                            Authorization: `Bearer ${auth_token}`,
                            Accept: 'application/json',
                        },
                    });
                    if (data.length) {
                        let temp = yield bluebird_1.default.map(data, (item) => __awaiter(this, void 0, void 0, function* () { return item.state_name; }));
                        return yield CountryTenant_1.default.getInstance(tenantId).updateOne({ _id: per._id }, { states: temp });
                    }
                }
                else {
                    yield CountryTenant_1.default.getInstance(tenantId).updateOne({ _id: per._id }, { states: [] });
                }
            }));
            res.send(new ResponseResult_1.default({
                message: 'Update countries states successfully.',
                data: {},
                total: countries.length,
            }));
        });
    }
    getStates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const { id } = body;
            const country = yield CountryTenant_1.default.getInstance(tenantId).findById(id);
            res.send(new ResponseResult_1.default({
                data: country.states,
                message: 'get compensation successfully',
            }));
        });
    }
    list(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            this.setInstanceModel(_req);
            const country = yield CountryTenant_1.default.getInstance(tenantId)
                .find({})
                .sort({
                name: 1,
            });
            res.send(new ResponseResult_1.default({
                data: country,
                message: 'get list country successfully',
            }));
        });
    }
    updateFromApi(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = _req.header('tenantId');
            this.setInstanceModel(_req);
            const countries = (yield axios_1.default(Object.assign({}, constant_1.API_3RD.country)).then((response) => {
                return response.data;
            })) || [];
            yield bluebird_1.default.map(countries, (item) => __awaiter(this, void 0, void 0, function* () {
                item._id = item.alpha2Code;
                const isExisted = yield CountryTenant_1.default.getInstance(tenantId).findById(item._id);
                if (isExisted) {
                    /* Update country data */
                    return CountryTenant_1.default.getInstance(tenantId).updateOne({ _id: item._id }, item);
                }
                else {
                    /* Create country data */
                    return CountryTenant_1.default.getInstance(tenantId).create(item);
                }
            }));
            res.send(new ResponseResult_1.default({
                message: 'Update countries information successfully.',
                data: countries,
                total: countries.length,
            }));
        });
    }
}
exports.default = new CountryTenantController();
//# sourceMappingURL=CountryTenantController.js.map