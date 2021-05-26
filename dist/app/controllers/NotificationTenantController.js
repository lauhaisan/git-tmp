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
// import config from '@/app/config/index';
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const NotificationTenant_1 = __importDefault(require("@/app/models/NotificationTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
class NotificationTenantController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID,
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
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Notification name is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Notification name must be provided'],
                        },
                    },
                    channel: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Notification channel is invalid'],
                        },
                        exists: {
                            errorMessage: [
                                'Required',
                                'Notification channel must be provided',
                            ],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update,
            },
            {
                name: 'remove-by-ids',
                type: 'POST',
                _ref: this.removeByIds.bind(this),
            },
            {
                name: 'push',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    name: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Notification name is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Notification name must be provided'],
                        },
                    },
                    channel: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Notification channel is invalid'],
                        },
                        exists: {
                            errorMessage: [
                                'Required',
                                'Notification channel must be provided',
                            ],
                        },
                    },
                },
            },
            {
                name: 'pull',
                type: 'POST',
                _ref: this.pull.bind(this),
                validationSchema: {},
            },
            {
                name: 'viewed',
                type: 'POST',
                _ref: this.viewed.bind(this),
                validationSchema: {},
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const tenantId = req.header('tenantId');
            const { limit = 0, page = 1, skip = 0 } = body;
            const notifications = yield NotificationTenant_1.default.getInstance(tenantId)
                .find({})
                .skip((page - 1) * limit + skip)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
            res.send(new ResponseResult_1.default({
                data: notifications,
                message: 'List items successfully',
                total: yield NotificationTenant_1.default.getInstance(tenantId).countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            const notification = yield NotificationTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: notification,
                message: 'Add item successfully',
            }));
        });
    }
    pull(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { user } = req, _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            const { item } = body;
            const currentUser = user;
            item.isView = false;
            item.viewers = { $nin: currentUser.get('id') };
            const notifications = yield NotificationTenant_1.default.getInstance(tenantId)
                .find(item)
                .exec();
            if (!notifications) {
                throw new AdvancedError_1.default({
                    notification: { kind: 'not.found', message: 'Notification not found' },
                });
            }
            lodash_1.forEach(notifications, item => {
                item.viewers.indexOf(currentUser.get('id')) < 0
                    ? item.viewers.push(currentUser.get('id'))
                    : null;
                item.save();
                item.set(this.filterParams(body, ['isView', 'viewers', 'role']));
            });
            res.send(new ResponseResult_1.default({
                message: 'Get Notification successfully',
                data: notifications,
            }));
        });
    }
    viewed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { id } = _a, body = __rest(_a, ["id"]);
            const tenantId = req.header('tenantId');
            const { itemIds } = body;
            let ids = [];
            lodash_1.forEach(itemIds, id => {
                ids.push(mongoose_1.Types.ObjectId(id));
            });
            const notifications = yield NotificationTenant_1.default.getInstance(tenantId)
                .find({
                _id: { $in: ids },
            })
                .exec();
            if (!notifications) {
                throw new AdvancedError_1.default({
                    notification: { kind: 'not.found', message: 'Notification not found' },
                });
            }
            yield lodash_1.forEach(notifications, item => {
                item.set('isView', true);
                item.save();
            });
            res.send(new ResponseResult_1.default({
                message: 'Get Notification successfully',
                data: notifications,
            }));
        });
    }
    removeByIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { itemIds }, } = req;
            let ids = [];
            lodash_1.forEach(itemIds, id => {
                ids.push(mongoose_1.Types.ObjectId(id));
            });
            const notifications = yield NotificationTenant_1.default.getInstance(tenantId)
                .find({
                _id: { $in: ids },
            })
                .exec();
            if (!notifications) {
                throw new AdvancedError_1.default({
                    notification: { kind: 'not.found', message: 'Notification not found' },
                });
            }
            yield lodash_1.forEach(notifications, item => {
                item.remove();
            });
            res.send(new ResponseResult_1.default({
                message: 'Remove Notification successfully',
                data: notifications,
            }));
        });
    }
}
exports.default = new NotificationTenantController();
//# sourceMappingURL=NotificationTenantController.js.map