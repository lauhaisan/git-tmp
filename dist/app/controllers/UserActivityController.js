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
const UserActivity_1 = __importDefault(require("@/app/models/UserActivity"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const constant_1 = require("@/app/utils/constant");
const lodash_1 = require("lodash");
class UserActivityController extends AbstractController_1.default {
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
                possiblePers: ['admin-cla'],
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
            // {
            //   name: 'add',
            //   type: 'POST',
            //   _ref: this.add,
            //   possiblePers: ['admin-cla'],
            // },
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
                swagger: [{ name: 'id', type: 'string', required: true }],
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
                possiblePers: ['admin-cla'],
            },
        ];
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { q, category = [], author = [], to, from, location }, } = req;
            const currentUser = req.user;
            const searchQ = { $regex: q, $options: 'i' };
            // Init filter
            const filter = this.filterByRoles(currentUser);
            // Filter location
            if (location) {
                filter.location = location;
            }
            // Filter by time
            filter.updatedAt = Object.assign({ $lt: to || new Date() }, (from ? { $gt: from } : {}));
            // Filter by text
            if (q) {
                filter.activity = searchQ;
            }
            // Filter by category
            if (!lodash_1.isEmpty(category)) {
                filter.category = { $in: category };
            }
            // Filter by author
            if (!lodash_1.isEmpty(author)) {
                filter.author = { $in: author };
            }
            const data = yield UserActivity_1.default.find(filter).sort(constant_1.COMMON.sort);
            res.send(new ResponseResult_1.default({
                data,
                message: 'Get list successfully.',
                total: data.length,
            }));
        });
    }
}
exports.default = new UserActivityController(UserActivity_1.default);
//# sourceMappingURL=UserActivityController.js.map