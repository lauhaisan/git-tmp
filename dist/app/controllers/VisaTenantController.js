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
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const AdvancedError_1 = __importDefault(require("../declares/AdvancedError"));
const VisaTenant_1 = __importDefault(require("../models/VisaTenant"));
class VisaTenantController extends AbstractController_1.default {
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
            {
                name: 'update',
                type: 'POST',
                _ref: this.updateMany.bind(this),
            },
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
                name: 'upsert',
                type: 'POST',
                _ref: this.upsert.bind(this),
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
            const { tenantId } = req.body;
            res.send(new ResponseResult_1.default({
                data: yield VisaTenant_1.default.getInstance(tenantId).create(req.body),
                message: 'Add item successfully',
            }));
        });
    }
    upsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            if (Array.isArray(req.body)) {
                const visa = yield bluebird_1.default.map(req.body, (item) => __awaiter(this, void 0, void 0, function* () {
                    const { id } = item;
                    if (!id) {
                        return yield VisaTenant_1.default.getInstance(tenantId).create(item);
                    }
                    else {
                        const visa = yield VisaTenant_1.default.getInstance(tenantId).findById(id);
                        yield visa.set(this.filterParams(item, ['employee', 'id']));
                        yield visa.save();
                        return visa;
                    }
                }));
                res.send(new ResponseResult_1.default({
                    message: 'Successfully updated information',
                    data: visa,
                }));
            }
            else {
                const { id } = req.body;
                const visa = yield VisaTenant_1.default.getInstance(tenantId).findById(id);
                visa.set(this.filterParams(req.body, ['employee']));
                yield visa.save();
                res.send(new ResponseResult_1.default({
                    message: 'Successfully updated information',
                    data: visa,
                }));
            }
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
                    yield VisaTenant_1.default.getInstance(tenantId).bulkWrite(updateItems);
                if (insertItems.length)
                    yield VisaTenant_1.default.getInstance(tenantId).insertMany(insertItems);
            }
            else {
                const { _id } = body;
                if (!_id) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'invalid', message: 'Id must be provided' },
                    });
                }
                const visa = (yield VisaTenant_1.default.getInstance(tenantId).findById(_id));
                if (!visa) {
                    throw new AdvancedError_1.default({
                        visa: { kind: 'not.found', message: 'Visa not found' },
                    });
                }
                visa.set(this.filterParams(body, ['employee', '_id']));
                yield visa.save();
            }
            res.send(new ResponseResult_1.default({
                data: [],
                message: 'Update items successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { tenantId } = req.body
            // const { body } = req
            // const { employee } = body
            // const visa = await VisaTenant.getInstance(tenantId).find({ employee })
            // // console.log('visa', visa);
            // res.send(
            //   new ResponseResult({
            //     data: visa,
            //     message: 'get passport successfully',
            //   }),
            // )
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
                        localField: 'visaIssuedCountry',
                        foreignField: '_id',
                        as: 'visaIssuedCountry',
                    },
                },
                {
                    $unwind: {
                        path: '$visaIssuedCountry',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    _id: 1,
                    visaNumber: 1,
                    visaIssuedCountry: {
                        _id: 1,
                        name: 1,
                        flag: 1,
                    },
                    visaType: 1,
                    visaEntryType: 1,
                    visaIssuedOn: 1,
                    visaValidTill: 1,
                    visaStatus: 1,
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
            const visa = yield VisaTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Successfully found visa',
                data: visa,
            }));
        });
    }
}
exports.default = new VisaTenantController();
//# sourceMappingURL=VisaTenantController.js.map