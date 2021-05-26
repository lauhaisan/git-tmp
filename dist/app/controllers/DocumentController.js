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
const Candidate_1 = __importDefault(require("@/app/models/Candidate"));
const Document_1 = __importDefault(require("@/app/models/Document"));
const Employee_1 = __importDefault(require("@/app/models/Employee"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const lodash_2 = __importDefault(require("lodash"));
const DocumentCompany_1 = __importDefault(require("../models/DocumentCompany"));
const EmployeeTenant_1 = __importDefault(require("../models/EmployeeTenant"));
// import Attachment from '../models/Attachment'
const GeneralInfo_1 = __importDefault(require("../models/GeneralInfo"));
// import Type from '../models/Type'
const User_1 = __importDefault(require("../models/User"));
const SendMail_1 = require("../services/SendMail");
const constant_1 = require("../utils/constant");
class DocumentController extends AbstractController_1.default {
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
            res.send(new ResponseResult_1.default({
                data: constant_1.DEFAULT_DOCUMENT_CHECKLIST,
                message: 'List items successfully',
            }));
        });
    }
    add({ body, user }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = user;
            if (body.shareDocument) {
                body.shareDocument = [...body.shareDocument, currentUser.email];
            }
            else
                body.shareDocument = [currentUser.email];
            const document = yield this.model.create(body);
            res.send(new ResponseResult_1.default({
                data: document,
                message: 'Add item successfully',
            }));
        });
    }
    list({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 0, skip = 0, employee, candidate, parentEmployeeGroup, company, key, employeeGroup, } = body;
            let filter = {
                employee,
                candidate,
                parentEmployeeGroup,
                company,
                key,
                employeeGroup,
            };
            filter = lodash_1.pickBy(filter, lodash_1.identity);
            const documents = yield Document_1.default.find(filter)
                .skip((page - 1) * limit + skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
                total: yield Document_1.default.countDocuments(filter),
            }));
        });
    }
    getByCandidate({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { candidate } = body;
            const foundCandidate = yield Candidate_1.default.findById(candidate);
            if (!foundCandidate) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const documents = yield Document_1.default.find({ candidate });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByEmployee({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee } = body;
            const foundEmployee = yield Employee_1.default.findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const documents = yield Document_1.default.find({ employee });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByEmployeeGroup({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, employeeGroup, tenantId } = body;
            const foundEmployee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    candidate: { kind: 'not.found', message: 'Employee not found' },
                });
            }
            const documents = yield Document_1.default.find({ employee, employeeGroup });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    getByKey({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee, key } = body;
            const foundEmployee = yield Employee_1.default.findById(employee);
            if (!foundEmployee) {
                throw new AdvancedError_1.default({
                    employee: { kind: 'not.found', message: 'Candidate not found' },
                });
            }
            const documents = yield Document_1.default.find({ employee, key });
            res.send(new ResponseResult_1.default({
                data: documents,
                message: 'List items successfully',
            }));
        });
    }
    update({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = body;
            const documentData = yield Document_1.default.findById(id);
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
    addAttachment({ body }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, attachment } = body;
            yield Document_1.default.updateOne({ _id: id }, { $set: { attachment } }, { $upsert: true });
            res.send(new ResponseResult_1.default({
                data: yield Document_1.default.findById(id),
                message: 'Update item successfully',
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, body } = req;
            const { id } = body;
            let currentUser = user;
            currentUser = yield User_1.default.findById(currentUser._id);
            const { candidate = '', employee = '', email = '' } = currentUser;
            const document = (yield Document_1.default.findById(id));
            console.log(lodash_2.default.includes(currentUser.roles, 'ADMIN-SA'), currentUser.roles);
            if (!lodash_2.default.includes(lodash_2.default.map(currentUser.roles, (per) => per._id), 'ADMIN-SA')) {
                if (document.employee && !document.candidate) {
                    if (document.employee.toString() !== employee.toString()) {
                        if (!lodash_2.default.includes(document.shareDocument, email)) {
                            throw new AdvancedError_1.default({
                                document: {
                                    kind: 'not.permission',
                                    message: 'User does not have permission',
                                },
                            });
                        }
                    }
                }
                if (!document.employee && document.candidate) {
                    if (document.candidate.toString() !== candidate.toString()) {
                        if (!lodash_2.default.includes(document.shareDocument, email)) {
                            throw new AdvancedError_1.default({
                                document: {
                                    kind: 'not.permission',
                                    message: 'User does not have permission',
                                },
                            });
                        }
                    }
                }
            }
            res.send(new ResponseResult_1.default({
                data: document,
                message: 'Get item successfully',
            }));
        });
    }
    share(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, body } = req;
            const { shareWith, id } = body;
            if (!user.employee || !user.employee.generalInfo) {
                throw new AdvancedError_1.default({
                    document: {
                        kind: 'not.found',
                        message: `User's work email not found`,
                    },
                });
            }
            const senderEmail = user.employee.generalInfo.workEmail;
            const senderName = `${user.employee.generalInfo.firstName} ${user.employee.generalInfo.lastName}`;
            const documentInfo = yield Document_1.default.findById(id);
            if (!documentInfo) {
                throw new AdvancedError_1.default({
                    document: {
                        kind: 'not.found',
                        message: `Document not found`,
                    },
                });
            }
            // Get all shared employee info
            const shareWithInfo = yield Employee_1.default.aggregate([
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'generalInfo',
                        foreignField: '_id',
                        as: 'generalInfo',
                    },
                },
                {
                    $unwind: {
                        preserveNullAndEmptyArrays: true,
                        path: '$generalInfo',
                    },
                },
                {
                    $match: {
                        'generalInfo.workEmail': {
                            $in: shareWith,
                        },
                    },
                },
            ]);
            // Send mail
            const url = documentInfo.attachment.url;
            const fileName = documentInfo.attachment.fileName;
            if (shareWithInfo.length > 0) {
                const newSharedEmails = [];
                bluebird_1.default.map(shareWithInfo, (employee) => __awaiter(this, void 0, void 0, function* () {
                    const fullName = `${employee.generalInfo.firstName} ${employee.generalInfo.lastName}`;
                    const email = employee.generalInfo.workEmail;
                    console.log(fullName);
                    console.log(email);
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
            const { type = '', dateModified = '', assigned = '', keySearch = '', } = req.body;
            let employeeDoc = [], employees = [];
            let aggregate = [];
            if (!assigned) {
                // list generalInfo to get employee
                const existGen = yield GeneralInfo_1.default.find({
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
                employees = yield Employee_1.default.find({
                    generalInfo: { $in: generalInfoIds },
                });
                const employeeIds = employees.map((item) => item._id);
                // list doc
                const lookup = [
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
                        $match: {
                            employee: { $in: employeeIds },
                        },
                    },
                ];
                aggregate = [...lookup];
            }
            else {
                employees.push(yield Employee_1.default.findById(assigned));
                // list doc
                const lookup = [
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
                        $match: {
                            employee: new RegExp(assigned, 'i'),
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
                        from: 'employees',
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
                        from: 'generalinfos',
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
            aggregate = [...aggregate, ...lookup];
            employeeDoc = yield Document_1.default.aggregate([aggregate]);
            res.send(new ResponseResult_1.default({
                message: 'success',
                data: { employees, employeeDoc },
            }));
        });
    }
    listByCategory(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let aggregate = [];
            const lookup = [
                {
                    $lookup: {
                        from: 'employees',
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
                        from: 'generalinfos',
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
            const docCompany = yield DocumentCompany_1.default.find([aggregate]);
            const docGeneral = yield Document_1.default.find();
            let documentList = [...docCompany, ...docGeneral];
            res.send(new ResponseResult_1.default({
                data: documentList,
                message: 'Success',
            }));
        });
    }
}
exports.default = new DocumentController(Document_1.default);
//# sourceMappingURL=DocumentController.js.map