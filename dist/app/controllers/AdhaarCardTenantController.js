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
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const mongoose_1 = require("mongoose");
const AbstractController_1 = __importDefault(require("../declares/AbstractController"));
// import AdhaarCard from '../models/AdhaarCard'
const AdhaarCardTenant_1 = __importDefault(require("../models/AdhaarCardTenant"));
// import DocumentTenant from '../models/DocumentTenant'
const ResponseResult_1 = __importDefault(require("../services/ResponseResult"));
// import UploadService from '../services/UploadService'
class AdhaarCardTenantController extends AbstractController_1.default {
    // private setInstanceModel(req: Request) {
    //   const header = req.header('tenantId')
    //   console.log('header', header)
    //   const tenantId = header ? header : ''
    //   this.tenantId = tenantId
    //   this.model = AdhaarCardTenant.getInstance(tenantId);
    // }
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
                name: 'get-by-number',
                type: 'POST',
                _ref: this.getByNumber.bind(this),
            },
            {
                name: 'update',
                type: 'POST',
                _ref: this.update.bind(this),
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
        ];
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { tenantId } = req.body;
            console.log('addd ', tenantId);
            const adhaarCard = yield AdhaarCardTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: adhaarCard,
                message: 'Add item successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const item = yield AdhaarCardTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Item not found' },
                });
            }
            item.set(req.body);
            yield item.save();
            res.send(new ResponseResult_1.default({
                message: 'Update item successfully',
                data: item,
            }));
        });
    }
    getByNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { tenantId } = req.body;
            console.log('addd ', tenantId);
            const adhaarCard = yield AdhaarCardTenant_1.default.getInstance(tenantId).find({
                adhaarNumber: body.adhaarNumber,
            });
            res.send(new ResponseResult_1.default({
                data: adhaarCard,
                message: 'get item successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, tenantId } = req.body;
            // const adhaar = await AdhaarCardTenant.getInstance(tenantId).findOne({
            //   employee,
            // })
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
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    adhaarNumber: 1,
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
                        id: 1,
                        category: 1,
                    },
                },
            };
            aggregate.push(project);
            const adhaar = yield AdhaarCardTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Successfully found adhaar card',
                data: adhaar[adhaar.length - 1],
            }));
        });
    }
}
exports.default = new AdhaarCardTenantController();
//# sourceMappingURL=AdhaarCardTenantController.js.map