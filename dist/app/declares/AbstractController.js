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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const compose_middleware_1 = require("@/app/utils/compose-middleware");
const constant_1 = require("@/app/utils/constant");
const express_validator_1 = require("express-validator");
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
class AbstractController {
    constructor(model) {
        this.methods = [];
        this.subFilter = [];
        this.fields = [];
        this.processFilter = this.processFilter.bind(this);
        if (model) {
            this.model = model;
            this.isCreator = this.isCreator.bind(this);
            this.list = this.list.bind(this);
            this.add = this.add.bind(this);
            this.getByID = this.getByID.bind(this);
            this.update = this.update.bind(this);
            this.remove = this.remove.bind(this);
            this.active = this.active.bind(this);
            this.inactive = this.inactive.bind(this);
        }
        this.filterParams = this.filterParams.bind(this);
        this.generateMethods = this.generateMethods.bind(this);
        this.checkValidArguments = this.checkValidArguments.bind(this);
        this.getValidMethod = this.getValidMethod.bind(this);
        this.setControllerName = this.setControllerName.bind(this);
        this.preInit = this.preInit.bind(this);
        this.preInit();
        this.methods = this.generateMethods();
    }
    isCreator({ body: { id, _id = id }, user }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.model
                    .findOne({
                    _id,
                    user: user._id,
                })
                    .exec();
                return !!item;
            }
            catch (error) {
                return false;
            }
        });
    }
    setControllerName(req, _, next) {
        req.controllerName = this.name;
        next();
    }
    setName(name) {
        this.name = name;
    }
    checkValidArguments(req, _, next) {
        const errors = express_validator_1.validationResult(req);
        const check = !errors.isEmpty();
        if (check) {
            let objErrors = {};
            errors.array().forEach(({ param, msg }) => {
                let objParam = {
                    path: param,
                    message: msg,
                    kind: 'invalid',
                    properties: {},
                };
                if (Array.isArray(msg)) {
                    const message = msg[msg.length - 1];
                    const [kind, values] = msg;
                    objParam = Object.assign(Object.assign({}, objParam), { message, kind });
                    if (msg.length === 3) {
                        objParam = Object.assign(Object.assign({}, objParam), { properties: { [kind]: values } });
                    }
                }
                objErrors = Object.assign(Object.assign({}, objErrors), { [param]: objParam });
            });
            return next({
                errors: objErrors,
                message: 'Bad arguments',
                name: 'ValidationError',
                statusCode: 400,
            });
        }
        else
            next();
    }
    getValidMethod(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req;
            const urlArr = url.split('/');
            const methodName = urlArr[urlArr.length - 1];
            const user = req.user;
            const { methods } = this;
            const formatMethod = methods.find(method => method.name === methodName);
            if (!formatMethod) {
                throw new AdvancedError_1.default({
                    method: {
                        kind: 'not.found',
                        message: `Method {methodName} not found.`,
                        path: 'method',
                        properties: {
                            methodName,
                        },
                    },
                });
            }
            const { possiblePers, validationSchema, _ref, middleware: methodMid, } = formatMethod;
            if (Array.isArray(possiblePers) &&
                possiblePers.length > 0 &&
                !(yield this.isCreator(req)) &&
                !user.hasPermission(possiblePers)) {
                throw new AdvancedError_1.default({
                    method: {
                        path: 'method',
                        kind: 'not.permission',
                        message: `You don't have permission.`,
                    },
                });
            }
            const chain = [];
            if (validationSchema) {
                chain.push(...express_validator_1.checkSchema(validationSchema), this.checkValidArguments);
            }
            if (Array.isArray(methodMid))
                chain.push(...methodMid);
            chain.push(_ref);
            const middleware = compose_middleware_1.compose(chain);
            return middleware(req, res, next);
        });
    }
    preInit() { }
    generateMethods() {
        return [];
    }
    processFilter(args, extraFilter = {}, ignoreFields) {
        let filter = {};
        let defaultIgnoreFields = [];
        const extraKeys = Object.keys(extraFilter);
        if (Array.isArray(ignoreFields)) {
            defaultIgnoreFields = [
                ...defaultIgnoreFields,
                ...ignoreFields,
                ...extraKeys,
            ];
        }
        for (const key of Object.keys(args)) {
            const field = this.fields.find(({ name }) => !defaultIgnoreFields.includes(key) && name === key);
            if (!field)
                continue;
            const val = this.processValue(args[key], field.type);
            if (val) {
                filter = Object.assign(Object.assign({}, filter), { [key]: val });
            }
        }
        filter = Object.assign(Object.assign({}, extraFilter), filter);
        return filter;
    }
    processValue(val, requireType) {
        const adapter = {
            Boolean: (v) => Boolean(v),
            Date: (v) => new Date(v),
            Number: (v) => Number.parseFloat(v),
            ObjectId: (v) => new mongoose_1.Types.ObjectId(v),
            String: (v) => String(v),
        };
        const engine = adapter[requireType];
        if (!engine)
            return;
        let newVal;
        if (typeof val === 'object') {
            const keys = Object.keys(val);
            if (keys.length === 0)
                return;
            keys.forEach(key => {
                let childVal = val[key];
                if (!childVal)
                    return;
                if (Array.isArray(childVal)) {
                    childVal = val[key];
                    childVal = childVal.map(engine);
                }
                else
                    childVal = engine(childVal);
                newVal = Object.assign(Object.assign({}, val), { [key]: childVal });
            });
        }
        else
            newVal = engine(val);
        return newVal;
    }
    /**
     * list
     */
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { q }, } = req;
            const searchQ = { $regex: q, $options: 'i' };
            // Init filter
            const filter = q ? { name: searchQ } : {};
            const list = yield this.model
                .find(filter)
                .sort(constant_1.COMMON.sort)
                .exec();
            res.send(new ResponseResult_1.default({
                data: list,
                message: 'Get list successfully.',
                total: list.length,
            }));
        });
    }
    /**
     * getByID
     */
    getByID({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
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
    /**
     * add
     */
    add({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                data: yield this.model.create(body),
                message: 'Add item successfully',
            }));
        });
    }
    /**
     * update
     */
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            item.set(body);
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    /**
     * remove
     */
    remove({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove item successfully',
                data: item,
            }));
        });
    }
    active({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            item.set({ status: 'ACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    inactive({ body: { id } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(id).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            item.set({ status: 'INACTIVE' });
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    /*
      - Check logined user is free account or company account
    */
    isFreeAccount(user) {
        let isFreeAccount = false;
        if (user &&
            !lodash_1.isEmpty(user.roles) &&
            user.roles.length === 1 &&
            user.roles[0]._id === 'CUSTOMER') {
            isFreeAccount = true;
        }
        return isFreeAccount;
    }
    /*
      - Check admincp permissions of logined user
    */
    hasAllowPermission({ req, data } = {}) {
        let isAllow = true;
        const { body: { permission }, } = req;
        const currentUser = req.user;
        const notAllowWithUsers = {
            'admin-sa': ['admin-cga', 'admin-cla', 'employee', 'admin-cb'],
            'admin-csa': ['admin-sa', 'admin-csa', 'admin-sb'],
            'admin-cga': ['admin-sa', 'admin-csa', 'admin-sb', 'admin-cga'],
            'admin-cla': [
                'admin-sa',
                'admin-csa',
                'admin-sb',
                'admin-cga',
                'admin-cla',
                'admin-cb',
            ],
        };
        if (!currentUser.hasPermission([permission])) {
            isAllow = false;
        }
        lodash_1.forEach(notAllowWithUsers[permission], per => {
            if (data.roles.indexOf(per.toUpperCase()) > -1) {
                isAllow = false;
            }
        });
        return isAllow;
    }
    filterParams(root = {}, ignoreFields = []) {
        lodash_1.forEach(ignoreFields, v => {
            delete root[v];
        });
        return root;
    }
    filterByRoles(currentUser) {
        // Init object: { company: '', location: '' }
        const filter = {
            company: lodash_1.get(currentUser, 'employee.company.id'),
        };
        // if (currentUser.hasRoles(['ADMIN-CSA', 'ADMIN-CGA'])) {
        //   delete filter.location
        // }
        // if (currentUser.hasRoles(['ADMIN-SA'])) {
        //   delete filter.location
        //   delete filter.company
        // }
        return filter;
    }
    filterByTabType(filterData = {
        currentUser: {},
        // report: {},
        tabType: constant_1.TYPE_TICKET_REQUEST.tabType.myRequests,
        existingFilter: {},
    }) {
        let filter = filterData.existingFilter;
        switch (filterData.tabType) {
            case constant_1.TYPE_TICKET_REQUEST.tabType.teamRequests:
                filter = Object.assign(Object.assign({}, filter), { 
                    // manager: Types.ObjectId(filterData.currentUser.employee.id),
                    manager: filterData.currentUser.employee.id });
                break;
            case constant_1.TYPE_TICKET_REQUEST.tabType.drafts:
                filter = Object.assign(Object.assign({}, filter), { user: {
                        id: filterData.currentUser.id,
                    }, status: constant_1.TYPE_TICKET_REQUEST.statusType.draft });
                break;
            case constant_1.TYPE_TICKET_REQUEST.tabType.myRequests:
                filter = Object.assign(Object.assign({}, filter), { user: {
                        id: filterData.currentUser.id,
                    }, status: {
                        $ne: constant_1.TYPE_TICKET_REQUEST.statusType.draft,
                    } });
            default:
                break;
        }
        return filter;
    }
    /*
      - Return a string id array from object array
    */
    getIds({ data, isObj = false }) {
        const idArr = [];
        if (isObj) {
            idArr.push(data.id);
        }
        else {
            lodash_1.forEach(data, obj => {
                idArr.push(obj.id);
            });
        }
        return idArr;
    }
    initCode({ location = {}, type = 'offBoardingRequest' } = {}) {
        const OBJ = {
            // expense: {
            //   c: 'E',
            //   reset: 'monthlyExpenseReset',
            //   count: 'monthlyExpenseCount',
            // },
            // report: {
            //   c: 'R',
            //   reset: 'monthlyReportReset',
            //   count: 'monthlyReportCount',
            // },
            // payment: {
            //   c: 'P',
            //   reset: 'monthlyReportReset',
            //   count: 'monthlyReportCount',
            // },
            offBoardingRequest: {
                c: 'OFF',
                reset: 'monthlyOffBoardingRequestReset',
                count: 'monthlyOffBoardingRequestCount',
            },
        };
        let reset = location[OBJ[type].reset];
        const count = location[OBJ[type].count];
        const date = new Date();
        if (date.getMonth() !== reset) {
            // Update location
            reset = date.getMonth();
        }
        // tslint:disable-next-line:prettier
        const code = `${location.code}/${date.getFullYear()}/${reset + 1}/${OBJ[type].c}/${count + 1}`;
        return { reset, code };
    }
}
exports.default = AbstractController;
//# sourceMappingURL=AbstractController.js.map