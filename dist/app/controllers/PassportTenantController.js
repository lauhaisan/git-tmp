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
const PassportTenant_1 = __importDefault(require("@/app/models/PassportTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
class PassportTenantController extends AbstractController_1.default {
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
            // {
            //   name: 'update',
            //   type: 'POST',
            //   _ref: this.update, // update profile
            // },
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
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove,
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.updateMany.bind(this),
            },
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            res.send(new ResponseResult_1.default({
                data: yield PassportTenant_1.default.getInstance(tenantId).create(req.body),
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { id } = req.body;
            const passport = yield PassportTenant_1.default.getInstance(tenantId).findById(id);
            passport.set(this.filterParams(req.body, ['employee']));
            yield passport.save();
            res.send(new ResponseResult_1.default({
                message: 'Successfully updated information',
                data: passport,
            }));
        });
    }
    updateMany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            if (lodash_1.isArray(body)) {
                const updateItems = [];
                const insertItems = [];
                lodash_1.map(body, (per) => {
                    const { _id } = per;
                    if (!_id)
                        insertItems.push(per);
                    else {
                        updateItems.push({
                            updateOne: {
                                filter: { _id },
                                update: { $set: this.filterParams(per, ['_id', 'employee']) },
                                upsert: false,
                            },
                        });
                    }
                });
                if (updateItems.length)
                    yield PassportTenant_1.default.getInstance(tenantId).bulkWrite(updateItems);
                if (insertItems.length)
                    yield PassportTenant_1.default.getInstance(tenantId).insertMany(insertItems);
            }
            else {
                const { _id } = body;
                if (!_id) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'invalid', message: 'Id must be provided' },
                    });
                }
                const passport = (yield PassportTenant_1.default.getInstance(tenantId).findById(_id));
                if (!passport) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'not.found', message: 'Visa not found' },
                    });
                }
                passport.set(this.filterParams(body, ['employee', '_id']));
                yield passport.save();
            }
            res.send(new ResponseResult_1.default({
                data: [],
                message: 'Update items successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, employee } = req.body;
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.employee = mongoose_1.Types.ObjectId(employee);
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_documents`,
                        localField: 'document',
                        foreignField: '_id',
                        as: 'document',
                    },
                },
                {
                    $unwind: {
                        path: '$document',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'attachments',
                        localField: 'document.attachment',
                        foreignField: '_id',
                        as: 'document.attachment',
                    },
                },
                {
                    $unwind: {
                        path: '$document.attachment',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'countries',
                        localField: 'passportIssuedCountry',
                        foreignField: '_id',
                        as: 'passportIssuedCountry',
                    },
                },
                {
                    $unwind: {
                        path: '$passportIssuedCountry',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    _id: 1,
                    passportNumber: 1,
                    passportIssuedCountry: {
                        _id: 1,
                        name: 1,
                        flag: 1,
                    },
                    passportIssuedOn: 1,
                    passportValidTill: 1,
                    passportStatus: 1,
                    employee: 1,
                    document: {
                        _id: 1,
                    },
                    'document.attachment': {
                        _id: 1,
                        name: 1,
                        fileName: 1,
                        path: 1,
                        url: 1,
                    },
                },
            };
            aggregate.push(project);
            const passport = yield PassportTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Successfully found passport',
                data: passport,
            }));
        });
    }
}
exports.default = new PassportTenantController();
//# sourceMappingURL=PassportTenantController.js.map