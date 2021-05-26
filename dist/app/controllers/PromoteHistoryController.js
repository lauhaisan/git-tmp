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
const AbstractController_1 = __importDefault(require("@/app/declares/AbstractController"));
const PromoteHistory_1 = __importDefault(require("@/app/models/PromoteHistory"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
class PromoteHistoryController extends AbstractController_1.default {
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
                    changeInfo: {
                        in: ['body'],
                        isString: {
                            errorMessage: ['isString', 'Change info is invalid'],
                        },
                        exists: {
                            errorMessage: ['Required', 'Change info must be provided'],
                        },
                    },
                },
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
                validationSchema: {
                    id: {
                        in: ['body', 'params'],
                        isString: {
                            errorMessage: ['isString', 'Id is invalid'],
                        },
                    },
                },
            },
        ];
    }
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 0, page = 1, skip = 0 } = body;
            const promoteHistories = yield this.model
                .find({})
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: promoteHistories,
                message: 'List items successfully',
                total: yield this.model.countDocuments(),
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const promoteHistory = yield this.model.create(body);
            yield promoteHistory.save();
            res.send(new ResponseResult_1.default({
                data: promoteHistory,
                message: 'Add item successfully',
            }));
        });
    }
    update(_a, res) {
        var _b = _a.body, { id } = _b, body = __rest(_b, ["id"]);
        return __awaiter(this, void 0, void 0, function* () {
            const promoteHistory = yield this.model.findById(id);
            if (!promoteHistory) {
                throw new AdvancedError_1.default({
                    bankAcc: { kind: 'not.found', message: 'Promote history not found' },
                });
            }
            promoteHistory.set(this.filterParams(body, ['company', 'employee']));
            yield promoteHistory.save();
            res.send(new ResponseResult_1.default({
                data: promoteHistory,
                message: 'Update promote history successfully',
            }));
        });
    }
}
exports.default = new PromoteHistoryController(PromoteHistory_1.default);
//# sourceMappingURL=PromoteHistoryController.js.map