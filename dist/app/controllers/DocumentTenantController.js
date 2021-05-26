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
// import CandidateTenant from '@/app/models/CandidateTenant'
// import DocumentTenant from '@/app/models/DocumentTenant'
// import EmployeeTenant from '@/app/models/EmployeeTenant'
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const CandidateTenant_1 = __importDefault(require("../models/CandidateTenant"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
// import UserMap from '../models/UserMap'
// import UserTenant from '../models/UserTenant'
// import DocumentCompanyTenant from '../models/DocumentCompanyTenant'
// import Attachment from '../models/Attachment'
// import GeneralInfoTenant from '../models/GeneralInfoTenant'
// import Type from '../models/Type'
// import UserTenant from '../models/UserTenant'
const SendMail_1 = require("../services/SendMail");
const constant_1 = require("../utils/constant");
class DocumentTenantController extends AbstractController_1.default {
    setInstanceModel(_req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const header = req.header('tenantId')
            // const tenantId = header ? header : ''
            // this.model = this.model
            //   ? this.model
            //   : DocumentTenant(tenantId).getModel()
            // this.DocumentTenantModel = this.DocumentTenantModel
            //   ? this.DocumentTenantModel
            //   : this.model
            // this.CandidateTenantModel = this.CandidateTenantModel
            //   ? this.CandidateTenantModel
            //   : new CandidateTenant(tenantId).getModel()
            // this.EmployeeTenantModel = this.EmployeeTenantModel
            //   ? this.EmployeeTenantModel
            //   : EmployeeTenant.getInstance(this.tenantId),
            // this.GeneralInfoTenantModel = this.GeneralInfoTenantModel
            //   ? this.GeneralInfoTenantModel
            //   : new GeneralInfoTenant(tenantId).getModel()
            // this.DocumentCompanyTenantModel = this.DocumentCompanyTenantModel
            //   ? this.DocumentCompanyTenantModel
            //   : DocumentCompanyTenant(tenantId)
            // this.UserTenantModel = this.UserTenantModel
            //   ? this.UserTenantModel
            //   : new UserTenant(tenantId).getModel()
        });
    }
    generateMethods() {
        return [
            {
                name: 'list',
                type: 'POST',
                _ref: this.list.bind(this),
            },
            {
                name: 'list-default-checklist',
                type: 'POST',
                _ref: this.defaultChecklist.bind(this),
            },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
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
                            errorMessage: ['required', 'Key must be provided'],
                        },
                    },
                    category: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'Category id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-candidate',
                type: 'POST',
                _ref: this.getByCandidate.bind(this),
                validationSchema: {
                    candidate: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Candidate is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Candidate must be provided'],
                        },
                    },
                },
            },
            {
                name: 'get-by-employee',
                type: 'POST',
                _ref: this.getByEmployee.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'employee-group',
                type: 'POST',
                _ref: this.getByEmployeeGroup.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Employee must be provided'],
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
                name: 'get-by-key',
                type: 'POST',
                _ref: this.getByKey.bind(this),
                validationSchema: {
                    employee: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Employee is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Employee must be provided'],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
            },
            {
                name: 'add-attachment',
                type: 'POST',
                _ref: this.addAttachment.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'ID is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'ID must be provided'],
                        },
                    },
                },
            },
            {
                name: 'share',
                type: 'POST',
                _ref: this.share.bind(this),
                validationSchema: {
                    shareWith: {
                        in: 'body',
                        isArray: {
                            errorMessage: ['isArray', 'Share with is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Share with must be provided'],
                        },
                    },
                    id: {
                        in: 'body',
                        isString: {
                            errorMessage: ['isString', 'Document id is invalid'],
                        },
                        exists: {
                            errorMessage: ['required', 'Document id must be provided'],
                        },
                    },
                },
            },
            {
                name: 'search-advanced',
                type: 'POST',
                _ref: this.searchDoc.bind(this),
            },
            {
                name: 'list-by-category',
                type: 'POST',
                _ref: this.listByCategory.bind(this),
            },
        ];
    }
    defaultChecklist(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setInstanceModel(_req);
            res.send(new ResponseResult_1.default({
                data: constant_1.DEFAULT_DOCUMENT_CHECKLIST,
                message: 'List items successfully',
            }));
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, user } = req;
            const { tenantId, employee } = body;
            const currentEmployee = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ employee });
            const currentUser = user;
            const emailPack = [currentUser.email, currentEmployee.workEmail];
            if (body.shareDocument) {
                body.shareDocument = [...body.shareDocument, ...emailPack];
            }
            else
                body.shareDocument = [...emailPack];
            const document = yield DocumentTenant_1.default.getInstance(tenantId).create(body);
            res.send(new ResponseResult_1.default({
                data: document,
                message: 'Add item successfully',
            }));
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { page = 1, limit = 0, skip = 0, employee, candidate, 
            // parentEmployeeGroup,
            company, key, 
            // employeeGroup,
            category, } = body;
            let filter = {
                employee,
                candidate,
                // parentEmployeeGroup,
                company,
                key,
                // employeeGroup,
                category,
            };
            filter = lodash_1.pickBy(filter, lodash_1.identity);
            const documents = yield DocumentTenant_1.default.getInstance(tenantId)
                .find(filter)
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
                total: yield DocumentTenant_1.default.getInstance(tenantId).countDocuments(filter),
            }));
        });
    }
    getByCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { candidate } = body;
            const foundCandidate = yield CandidateTenant_1.default.getInstance(tenantId).findById(candidate);
            if (!foundCandidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const documents = yield DocumentTenant_1.default.getInstance(tenantId).find({
                candidate,
            });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { employee } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const documents = yield DocumentTenant_1.default.getInstance(tenantId).find({
                employee,
            });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByEmployeeGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { employee, employeeGroup } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const documents = yield DocumentTenant_1.default.getInstance(tenantId).find({
                employee,
                employeeGroup,
            });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByKey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { employee, key } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const documents = yield DocumentTenant_1.default.getInstance(tenantId).find({
                employee,
                key,
            });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const { body } = req;
            const documentData = yield DocumentTenant_1.default.getInstance(tenantId).findById(id);
            if (!documentData) {
                throw new AdvancedError_1.default({
                    document: { kind: 'not.found', message: 'Document not found' },
                });
            }
            documentData.set(this.filterParams(body, ['candidate', 'employee']));
            yield documentData.save();
            res.send(new ResponseResult_1.default({
                data: documentData,
                message: 'Update item successfully',
            }));
        });
    }
    addAttachment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId } = req.body;
            const { body } = req;
            const { id, attachment } = body;
            yield DocumentTenant_1.default.getInstance(tenantId).updateOne({ _id: id }, { $set: { attachment } }, { $upsert: true });
            res.send(new ResponseResult_1.default({
                data: yield DocumentTenant_1.default.getInstance(tenantId).findById(id),
                message: 'Update item successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { id, tenantId, } = body;
            // let currentUser: any = user as IUser
            // currentUser = await User.findById(currentUser._id)
            // const { candidate = '', employee = '', email = '' } = currentUser
            const document = (yield DocumentTenant_1.default.getInstance(tenantId).findById(id));
            // console.log(_.includes(currentUser.roles, 'ADMIN-SA'), currentUser.roles)
            // if (
            //   !_.includes(_.map(currentUser.roles, (per: any) => per._id), 'ADMIN-SA')
            // ) {
            //   if (document.employee && !document.candidate) {
            //     if (document.employee.toString() !== employee.toString()) {
            //       if (!_.includes(document.shareDocument, email)) {
            //         throw new AdvancedError({
            //           document: {
            //             kind: 'not.permission',
            //             message: 'User does not have permission',
            //           },
            //         })
            //       }
            //     }
            //   }
            //   if (!document.employee && document.candidate) {
            //     if (document.candidate.toString() !== candidate.toString()) {
            //       if (!_.includes(document.shareDocument, email)) {
            //         throw new AdvancedError({
            //           document: {
            //             kind: 'not.permission',
            //             message: 'User does not have permission',
            //           },
            //         })
            //       }
            //     }
            //   }
            // }
            res.send(new ResponseResult_1.default({
                data: document,
                message: 'Get item successfully',
            }));
        });
    }
    share(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, body } = req;
            const { id, tenantId, shareWith = [] } = body;
            // if (!user.employee || !user.employee.generalInfo) {
            //   throw new AdvancedError({
            //     document: {
            //       kind: 'not.found',
            //       message: `User's work email not found`,
            //     },
            //   })
            // }
            const senderEmail = user.email;
            const senderName = user.firstName;
            const documentInfo = yield DocumentTenant_1.default.getInstance(tenantId).findById(id);
            if (!documentInfo) {
                throw new AdvancedError_1.default({
                    document: {
                        kind: 'not.found',
                        message: `Document not found`,
                    },
                });
            }
            // Get all shared employee info
            let shareWithInfo = [];
            yield bluebird_1.default.map(shareWith, (email) => __awaiter(this, void 0, void 0, function* () {
                const eachUser = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                    workEmail: email,
                });
                shareWithInfo.push(eachUser);
            }));
            // Send mail
            const url = documentInfo.attachment.url;
            const fileName = documentInfo.attachment.fileName;
            if (shareWithInfo.length > 0) {
                const newSharedEmails = [];
                yield bluebird_1.default.map(shareWithInfo, (employee) => __awaiter(this, void 0, void 0, function* () {
                    const fullName = `${employee.firstName} ${employee.lastName}`;
                    const email = employee.workEmail;
                    const content = `
          <p>You have been share a document from ${senderName} (${senderEmail})</p>
          <p>File name: <b>${fileName}</b></p>
          <p>Url: <a>${url}</a></p>
          `;
                    // Update document with shared employee
                    if (newSharedEmails.indexOf(email) !== -1) {
                        newSharedEmails.push(email);
                    }
                    // Send mail
                    yield SendMail_1.shareDocument({
                        email,
                        fullName,
                    }, [], 'Sharing document', content);
                }));
                yield documentInfo.set({
                    shareDocument: [...documentInfo.shareDocument, ...newSharedEmails],
                });
                yield documentInfo.save();
            }
            res.send({
                data: {
                    documentInfo,
                    shareWithInfo,
                },
                message: 'Shared document successfully',
                statusCode: 200,
            });
        });
    }
    searchDoc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type = '', dateModified = '', assigned = '', keySearch = '', tenantId, } = req.body;
            let employeeDoc = [], employees = [];
            let aggregate = [];
            if (!assigned) {
                // list generalInfo to get employee
                const existGen = yield GeneralInfoTenant_1.default.getInstance(tenantId).find({
                    $or: [
                        {
                            employeeId: new RegExp(keySearch, 'i'),
                        },
                        {
                            firstName: new RegExp(keySearch, 'i'),
                        },
                    ],
                });
                const generalInfoIds = existGen.map((item) => {
                    return item._id;
                });
                employees = yield EmployeeTenant_1.default.getInstance(tenantId).find({
                    generalInfo: { $in: generalInfoIds },
                });
                const employeeIds = employees.map((item) => item._id);
                // list doc
                const lookup = [
                    {
                        $lookup: {
                            from: `attachments`,
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
                        $match: {
                            employee: { $in: employeeIds },
                        },
                    },
                ];
                aggregate = [...lookup];
            }
            else {
                employees.push(yield EmployeeTenant_1.default.getInstance(tenantId).findById(assigned));
                // list doc
                const lookup = [
                    {
                        $lookup: {
                            from: `attachments`,
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
                ];
                aggregate = [...lookup];
            }
            const convertedStartDay = new Date(`${dateModified} 00:00:00`);
            const convertedEndDay = new Date(`${dateModified} 23:59:59`);
            if (dateModified) {
                let matchDate = {
                    $match: {
                        updatedAt: {
                            $gte: convertedStartDay,
                            $lte: convertedEndDay,
                        },
                    },
                };
                aggregate.push(matchDate);
            }
            if (type) {
                let matchOne = {
                    $match: {
                        'attachment.type': new RegExp(type, 'i'),
                    },
                };
                aggregate.push(matchOne);
                let matchType = {
                    $match: {
                        'attachment.name': new RegExp(keySearch, 'i'),
                    },
                };
                aggregate.push(matchType);
            }
            else {
                let matchName = {
                    $match: {
                        'attachment.name': new RegExp(keySearch, 'i'),
                    },
                };
                aggregate.push(matchName);
            }
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: {
                        path: '$employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            employeeDoc = yield DocumentTenant_1.default.getInstance(tenantId).aggregate([
                aggregate,
            ]);
            res.send(new ResponseResult_1.default({
                message: 'success',
                data: { employees, employeeDoc },
            }));
        });
    }
    listByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, company } = req.body;
            let aggregate = [];
            let matchOne = { $match: { company } };
            matchOne.$match.company = company;
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: {
                        path: '$employee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'employee.generalInfo',
                        foreignField: '_id',
                        as: 'employee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...lookup];
            const docCompany = yield DocumentTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            // const docGeneral = await DocumentTenant.getInstance(tenantId).aggregate()
            // let documentList = [...docCompany, ...docGeneral]
            res.send(new ResponseResult_1.default({
                data: docCompany,
                message: 'Success',
            }));
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, tenantId } = req.body;
            const item = yield DocumentTenant_1.default.getInstance(tenantId)
                .findById(id)
                .exec();
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
}
exports.default = new DocumentTenantController();
//# sourceMappingURL=DocumentTenantController.js.map