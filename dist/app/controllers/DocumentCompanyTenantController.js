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
// import Candidate from '@/app/models/Candidate'
// import DocumentCompanyTenant from '@/app/models/DocumentCompanyTenant'
// import Employee from '@/app/models/Employee'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const mongoose_1 = require("mongoose");
// import User from '../models/User'
const UploadService_1 = __importDefault(require("@/app/services/UploadService"));
const DocumentCompanyTenant_1 = __importDefault(require("../models/DocumentCompanyTenant"));
class DocumentCompanyTenantController extends AbstractController_1.default {
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model ? this.model : DocumentCompanyTenant(tenantId)
            // this.DocumentCompanyTenantModel = this.DocumentCompanyTenantModel
            //   ? this.DocumentCompanyTenantModel
            //   : this.model
        });
    }
    generateMethods() {
        return [
            {
                name: 'list-by-company',
                type: 'POST',
                _ref: this.listByCompany.bind(this),
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    key: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Key is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'File name (key) must be provided'],
                        },
                    },
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Company ID (company) must be provided',
                            ],
                        },
                    },
                    attachment: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Attachment ID (attachment) must be provided',
                            ],
                        },
                    },
                    documentType: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'Document Type (documentType) must be provided',
                            ],
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
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'id is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
        ];
    }
    listByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const { company } = body;
            // const documents = await DocumentCompany.find({ company })
            let aggregates = [];
            let matchOne = { $match: { company: mongoose_1.Types.ObjectId(company) } };
            aggregates.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company',
                    },
                },
                {
                    $unwind: {
                        path: '$company',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'attachments',
                        localField: 'attachment',
                        foreignField: '_id',
                        as: 'attachment',
                    },
                },
                {
                    $unwind: {
                        path: '$attachment',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'owner',
                        foreignField: '_id',
                        as: 'owner',
                    },
                },
                {
                    $unwind: {
                        path: '$owner',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'owner.generalInfo',
                        foreignField: '_id',
                        as: 'owner.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$owner.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const projects = {
                $project: {
                    status: 1,
                    _id: 1,
                    key: 1,
                    attachment: 1,
                    documentType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'owner.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            };
            aggregates = [...aggregates, ...lookup, projects];
            let documentCompanies = yield DocumentCompanyTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            const result = [];
            for (const item of documentCompanies) {
                item.attachment.url = UploadService_1.default.getPublicUrl(item.attachment.category, item.attachment._id.toHexString(), item.attachment.name);
                result.push(item);
            }
            res.send(new ResponseResult_1.default({
                data: result,
                message: 'List documents successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body, user } = req;
            this.setInstanceModel(req);
            const currentUser = user;
            // const employee = currentUser.employee as IEmployee
            const { employee } = currentUser;
            body.owner = mongoose_1.Types.ObjectId(employee._id);
            const document = yield DocumentCompanyTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: document,
                message: 'Add document successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body } = req;
            this.setInstanceModel(req);
            const { id } = body;
            const documentData = yield DocumentCompanyTenant_1.default.getInstance(tenantId).findById(id);
            if (!documentData) {
                throw new AdvancedError_1.default({
                    document: { kind: 'not.found', message: 'Document not found' },
                });
            }
            yield documentData.set(Object.assign({}, body));
            yield documentData.save();
            res.send(new ResponseResult_1.default({
                data: documentData,
                message: 'Update item successfully',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { id }, } = req;
            this.setInstanceModel(req);
            const item = yield DocumentCompanyTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    item: { kind: 'not.found', message: 'Document not found' },
                });
            }
            yield item.remove();
            res.send(new ResponseResult_1.default({
                message: 'Remove document successfully',
                data: item,
            }));
        });
    }
}
exports.default = new DocumentCompanyTenantController();
//# sourceMappingURL=DocumentCompanyTenantController.js.map