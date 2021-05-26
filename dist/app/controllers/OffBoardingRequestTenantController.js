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
const constant_1 = require("@/app/utils/constant");
const index_1 = __importDefault(require("@/app/config/index"));
const path_1 = __importDefault(require("path"));
const { UPLOAD } = index_1.default;
const ApprovalFlowTenant_1 = __importDefault(require("@/app/models/ApprovalFlowTenant"));
const Attachment_1 = __importDefault(require("@/app/models/Attachment"));
const EmployeeTenant_1 = __importDefault(require("@/app/models/EmployeeTenant"));
const OffBoardingRequestCommentTenant_1 = __importDefault(require("@/app/models/OffBoardingRequestCommentTenant"));
const OffBoardingRequestTenant_1 = __importDefault(require("@/app/models/OffBoardingRequestTenant"));
const ResponseResult_1 = __importDefault(require("@/app/services/ResponseResult"));
const SendMail_1 = require("@/app/services/SendMail");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const puppeteer_1 = __importDefault(require("puppeteer"));
const v4_1 = __importDefault(require("uuid/v4"));
const DocumentTenant_1 = __importDefault(require("../models/DocumentTenant"));
const GeneralInfoTenant_1 = __importDefault(require("../models/GeneralInfoTenant"));
const ManagePermission_1 = __importDefault(require("../models/ManagePermission"));
const ProjectTenant_1 = __importDefault(require("../models/ProjectTenant"));
const UserTenant_1 = __importDefault(require("../models/UserTenant"));
// import GeneralInfo from '../models/GeneralInfo'
const UploadService_1 = __importDefault(require("../services/UploadService"));
class OffBoardingRequestTenantController extends AbstractController_1.default {
    generateMethods() {
        // this.validateUpdate = this.validateUpdate.bind(this)
        return [
            {
                name: 'list-team-request',
                type: 'POST',
                _ref: this.listTeamRequest.bind(this),
            },
            {
                name: 'list-my-request',
                type: 'POST',
                _ref: this.listMyRequest.bind(this),
            },
            {
                name: 'list-relieving',
                type: 'POST',
                _ref: this.listRelieving.bind(this),
            },
            {
                name: 'search-request',
                type: 'POST',
                _ref: this.searchRequest.bind(this),
                validationSchema: {
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'company must be provide'],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId must be provide'],
                        },
                    },
                },
            },
            {
                name: 'list-assigned',
                type: 'POST',
                _ref: this.listAssigned.bind(this),
            },
            {
                name: 'list-assignee',
                type: 'POST',
                _ref: this.listAssignee.bind(this),
            },
            {
                name: 'withdraw',
                type: 'POST',
                _ref: this.withDraw.bind(this),
            },
            {
                name: 'withdraw-approval',
                type: 'POST',
                _ref: this.withDrawApproval.bind(this),
            },
            {
                name: 'request-lwd',
                type: 'POST',
                _ref: this.requestLWD.bind(this),
            },
            {
                name: 'approval-lwd',
                type: 'POST',
                _ref: this.approvalLWD.bind(this),
            },
            // {
            //   name: 'force',
            //   type: 'POST',
            //   _ref: this.force.bind(this),
            // },
            {
                name: 'get-by-id',
                type: 'POST',
                _ref: this.getByID.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId must be provide'],
                        },
                    },
                },
            },
            {
                name: 'add',
                type: 'POST',
                _ref: this.add.bind(this),
                validationSchema: {
                    company: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'company must be provide'],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId must be provide'],
                        },
                    },
                    reasonForLeaving: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'reasonForLeaving must be provide'],
                        },
                    },
                    action: {
                        isIn: {
                            options: [['saveDraft', 'submit']],
                            errorMessage: [
                                'isIn',
                                ['saveDraft', 'submit'].join(', '),
                                `Action (action) argument must be one of the words: '{isIn}'`,
                            ],
                        },
                        trim: {
                            options: ' ',
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
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                },
            },
            {
                name: 'update-relieving',
                type: 'POST',
                _ref: this.updateRelieving.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                },
            },
            {
                name: 'remove',
                type: 'POST',
                _ref: this.remove.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                },
            },
            {
                name: 'review',
                type: 'POST',
                _ref: this.review.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                    action: {
                        in: 'body',
                        isIn: {
                            // options: [['approve', 'reject', 'inquiry']],
                            options: [constant_1.TYPE_TICKET_REQUEST.action],
                            errorMessage: [
                                'isIn',
                                // ['approve', 'reject', 'inquiry'].join(', '),
                                constant_1.TYPE_TICKET_REQUEST.action.join(', '),
                                `Action (action) argument must be one of the words: '{0}'`,
                            ],
                        },
                        trim: {
                            options: ' ',
                        },
                    },
                },
            },
            {
                name: 'add-1-on-1',
                type: 'POST',
                _ref: this.addOneOnOne.bind(this),
                validationSchema: {
                    offBoardingRequest: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'offBoardingRequest must be provide'],
                        },
                    },
                    tenantId: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'tenantId must be provide'],
                        },
                    },
                    meetingDate: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'meetingDate must be provide'],
                        },
                    },
                    meetingTime: {
                        in: 'body',
                        exists: {
                            errorMessage: ['required', 'meetingTime must be provide'],
                        },
                    },
                },
            },
            {
                name: 'complete-1-on-1',
                type: 'POST',
                _ref: this.completeOneOnOne.bind(this),
                validationSchema: {
                    id: {
                        in: 'body',
                        exists: {
                            errorMessage: [
                                'required',
                                'OffBoardingRequest ID must be provide',
                            ],
                        },
                    },
                },
            },
            {
                name: 'get-1-on-1-by-off-boarding-id',
                type: 'POST',
                _ref: this.getOneOnOneByOffBoardingId,
            },
            {
                name: 'get-meeting-time',
                type: 'POST',
                _ref: this.getMeetingTime.bind(this),
            },
            {
                name: 'send-package',
                type: 'POST',
                _ref: this.sendPackage.bind(this),
            },
            {
                name: 'submit-to-hr',
                type: 'POST',
                _ref: this.submitToHR.bind(this),
            },
            {
                name: 'close-employee-record',
                type: 'POST',
                _ref: this.closeEmployeeRecord.bind(this),
            },
            {
                name: 'search-detail',
                type: 'POST',
                _ref: this.searchDetail.bind(this),
            },
            {
                name: 'save-package-draft',
                type: 'POST',
                _ref: this.saveDraft.bind(this),
            },
            {
                name: 'remove-package',
                type: 'POST',
                _ref: this.removeOffBoardingPackage.bind(this),
            },
            {
                name: 'convert-work-email',
                type: 'POST',
                _ref: this.convertWorkEmail.bind(this),
            },
            {
                name: 'terminate-hr',
                type: 'POST',
                _ref: this.terminate.bind(this),
            },
        ];
    }
    isCreator(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, reId, id = reId, _id = id }, user, } = req;
            try {
                const item = yield OffBoardingRequestTenant_1.default.getInstance(tenantId)
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
    listTeamRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { 
            // limit = 0,
            status = '', location = [], tenantId, company = '', }, } = req;
            const permission = yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                tenant: tenantId,
                company,
            })
                .select('roles employee location')
                .exec();
            const { roles, employee: employeeId, } = permission;
            // const company: any = []
            // company.push(employee.company.id)
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            // let companyId = company.map((s: string) => {
            //   return Types.ObjectId(s)
            // })
            let aggregate = [];
            let aggregateTotal = [];
            const matchOne = { $match: {} };
            if (locationId.length > 0) {
                matchOne.$match.location = { $in: locationId };
            }
            matchOne.$match.company = mongoose_1.Types.ObjectId(company);
            // if (companyId.length > 0) {
            //   matchOne.$match.company = {}
            //   matchOne.$match.company = { $in: companyId }
            // }
            if (status) {
                matchOne.$match.status = status;
            }
            aggregate.push(matchOne);
            aggregateTotal.push(matchOne);
            const lookup = [
                // {
                //   $lookup: {
                //     from: 'users',
                //     localField: 'employee',
                //     foreignField: 'employee',
                //     as: 'user',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$user',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
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
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // assignee
                {
                    $lookup: {
                        from: `${tenantId}_offboardingrequestcomments`,
                        localField: '_id',
                        foreignField: 'offBoardingRequest',
                        as: 'offBoardingRequestComments',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequestComments',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'offBoardingRequestComments.assignee',
                        foreignField: '_id',
                        as: 'offBoardingRequestComments.assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequestComments.assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'offBoardingRequestComments.assignee.generalInfo',
                        foreignField: '_id',
                        as: 'assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // assignee
                {
                    $lookup: {
                        from: `${tenantId}_projects`,
                        let: { emp_id: '$employee._id' },
                        pipeline: [{ $match: { $expr: { $in: ['$$emp_id', '$resource'] } } }],
                        as: 'project',
                    },
                },
                {
                    $unwind: { path: '$project', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'project.manager',
                        foreignField: '_id',
                        as: 'project.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'project.manager.generalInfo',
                        foreignField: '_id',
                        as: 'project.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            // aggregateTotal = [...aggregate, ...lookup]
            const matchTwo = { $match: {} };
            // matchTwo.$match.manager = Types.ObjectId(employee.id)
            // aggregateTotal.push(matchTwo)
            const matchOr = {
                $or: [],
            };
            let checkRoleHR = false;
            // tslint:disable-next-line:prettier
            roles.forEach((item) => {
                if (lodash_1.includes(['HR', 'HR-MANAGER'], item)) {
                    checkRoleHR = true;
                    return true;
                }
            });
            if (!checkRoleHR) {
                matchOr.$or.push({
                    'manager._id': mongoose_1.Types.ObjectId(employeeId),
                });
                matchOr.$or.push({
                    'project.manager': mongoose_1.Types.ObjectId(employeeId),
                });
                matchTwo.$match = matchOr;
                aggregate.push(matchTwo);
                aggregateTotal.push({
                    $match: {
                        $or: [
                            {
                                manager: mongoose_1.Types.ObjectId(employeeId),
                            },
                        ],
                    },
                });
            }
            const project = {
                $project: {
                    ticketID: 1,
                    requestDate: 1,
                    reasonForLeaving: 1,
                    lastWorkingDate: 1,
                    relievingStatus: 1,
                    approvalStep: 1,
                    status: 1,
                    nodeStep: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    assignee: { firstName: 1, lastName: 1, workEmail: 1, avatar: 1 },
                    department: { name: 1, _id: 1 },
                    project: { name: 1, _id: 1 },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                    },
                    'employee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    'project.manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                },
            };
            const group = {
                $group: {
                    _id: '$_id',
                    ticketID: { $first: '$ticketID' },
                    requestDate: { $first: '$requestDate' },
                    reasonForLeaving: { $first: '$reasonForLeaving' },
                    lastWorkingDate: { $first: '$lastWorkingDate' },
                    relievingStatus: { $first: '$relievingStatus' },
                    approvalStep: { $first: '$approvalStep' },
                    nodeStep: { $first: '$nodeStep' },
                    assignee: { $first: '$assignee' },
                    status: { $first: '$status' },
                    user: { $first: '$user' },
                    location: { $first: '$location' },
                    department: { $first: '$department' },
                    project: { $push: '$project' },
                    employee: { $first: '$employee' },
                    manager: { $first: '$manager' },
                },
            };
            aggregate.push(project);
            aggregate.push(group);
            const items = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            //Total
            const hrManager = yield ManagePermission_1.default.aggregate([
                {
                    $match: {
                        $and: [
                            { roles: { $in: ['HR-MANAGER'] } },
                            { tenant: tenantId },
                            { company: mongoose_1.Types.ObjectId(company) },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'employee.generalInfo',
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
                // {
                //   $match: {
                //     'employee.location': locationOfEmployee,
                //   },
                // },
                {
                    $project: {
                        _id: 0,
                        generalInfo: {
                            avatar: 1,
                            firstName: 1,
                            lastName: 1,
                            workEmail: 1,
                        },
                    },
                },
            ]);
            aggregateTotal[0].$match.status = {
                $in: [...constant_1.TYPE_TICKET_REQUEST.action, ...constant_1.TYPE_TICKET_REQUEST.status],
            };
            aggregateTotal.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregateTotal);
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: {
                    items,
                    total,
                    hrManager: hrManager.length ? hrManager[0] : null,
                },
            }));
            // name email avatar
        });
    }
    listMyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.user;
            const { body: { 
            // limit = 0,
            status = '', tenantId, company = '', }, } = req;
            const permission = yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                tenant: tenantId,
                company,
            })
                .select('roles employee location')
                .exec();
            const { employee: employeeId, } = permission;
            let aggregate = [];
            let aggregateTotal = [];
            const matchOne = { $match: {} };
            matchOne.$match.employee = employeeId;
            if (status) {
                matchOne.$match.status = status;
            }
            aggregate.push(matchOne);
            aggregateTotal.push(matchOne);
            const lookup = [
                // {
                //   $lookup: {
                //     from: 'users',
                //     localField: 'employee',
                //     foreignField: 'employee',
                //     as: 'user',
                //   },
                // },
                // {
                //   $unwind: {
                //     path: '$user',
                //     preserveNullAndEmptyArrays: true,
                //   },
                // },
                {
                    $lookup: {
                        from: `${tenantId}_locations`,
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
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
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // assignee
                {
                    $lookup: {
                        from: `${tenantId}_offboardingrequestcomments`,
                        localField: '_id',
                        foreignField: 'offBoardingRequest',
                        as: 'offBoardingRequestComments',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequestComments',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'offBoardingRequestComments.assignee',
                        foreignField: '_id',
                        as: 'offBoardingRequestComments.assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequestComments.assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'offBoardingRequestComments.assignee.generalInfo',
                        foreignField: '_id',
                        as: 'assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                // assignee
                {
                    $lookup: {
                        from: `${tenantId}_projects`,
                        let: { emp_id: '$employee._id' },
                        pipeline: [{ $match: { $expr: { $in: ['$$emp_id', '$resource'] } } }],
                        as: 'project',
                    },
                },
                {
                    $unwind: { path: '$project', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'project.manager',
                        foreignField: '_id',
                        as: 'project.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'project.manager.generalInfo',
                        foreignField: '_id',
                        as: 'project.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$project.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    ticketID: 1,
                    requestDate: 1,
                    reasonForLeaving: 1,
                    relievingStatus: 1,
                    approvalStep: 1,
                    nodeStep: 1,
                    lastWorkingDate: 1,
                    status: 1,
                    user: { roles: 1, _id: 1 },
                    location: { name: 1, _id: 1 },
                    department: { name: 1, _id: 1 },
                    assignee: { firstName: 1, lastName: 1, workEmail: 1, avatar: 1 },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                    },
                    manager: {
                        _id: 1,
                        employeeId: 1,
                    },
                    'employee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                    'manager.generalInfo': {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    project: {
                        _id: 1,
                        name: 1,
                        manager: {
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                            },
                        },
                    },
                },
            };
            const group = {
                $group: {
                    _id: '$_id',
                    ticketID: { $first: '$ticketID' },
                    requestDate: { $first: '$requestDate' },
                    reasonForLeaving: { $first: '$reasonForLeaving' },
                    relievingStatus: { $first: '$relievingStatus' },
                    approvalStep: { $first: '$approvalStep' },
                    nodeStep: { $first: '$nodeStep' },
                    lastWorkingDate: { $first: '$lastWorkingDate' },
                    assignee: { $first: '$assignee' },
                    status: { $first: '$status' },
                    user: { $first: '$user' },
                    location: { $first: '$location' },
                    department: { $first: '$department' },
                    project: { $push: '$project' },
                    employee: { $first: '$employee' },
                    manager: { $first: '$manager' },
                },
            };
            aggregate.push(project);
            aggregate.push(group);
            const items = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            //Total
            // aggregate.pop()
            // aggregate.pop()
            const hrManager = yield ManagePermission_1.default.aggregate([
                {
                    $match: {
                        $and: [
                            { roles: { $in: ['HR-MANAGER'] } },
                            { tenant: tenantId },
                            { company: mongoose_1.Types.ObjectId(company) },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'employee.generalInfo',
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
                // {
                //   $match: {
                //     'employee.location': locationOfEmployee,
                //   },
                // },
                {
                    $project: {
                        _id: 0,
                        generalInfo: {
                            avatar: 1,
                            firstName: 1,
                            lastName: 1,
                            workEmail: 1,
                        },
                    },
                },
            ]);
            aggregateTotal[0].$match.status = {
                $in: [...constant_1.TYPE_TICKET_REQUEST.action, ...constant_1.TYPE_TICKET_REQUEST.status],
            };
            aggregateTotal.push({ $group: { _id: '$status', count: { $sum: 1 } } });
            const total = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregateTotal);
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: {
                    items,
                    total,
                    hrManager: hrManager.length ? hrManager[0] : null,
                },
            }));
        });
    }
    searchRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { ticketID = '', // ObjectId
            employeeID = '', // ObjectId
            requesteeName = '', // String
            relievingStatus = '', // String
            tenantId = '', company = '', }, } = req;
            // if (!relievingStatus) {
            //   throw new AdvancedError({
            //     ticketID: {
            //       kind: 'required',
            //       message: 'relievingStatus must be provided',
            //     },
            //   })
            // }
            let result = [];
            if (ticketID || employeeID || requesteeName) {
                // Return list by relievingStatus and ticketID|employeeID|requesteeName
                if (ticketID) {
                    let aggregates = [];
                    const matchOne = { $match: {} };
                    matchOne.$match.company = mongoose_1.Types.ObjectId(company);
                    const lookup = [
                        {
                            $lookup: {
                                from: `${tenantId}_departments`,
                                localField: 'department',
                                foreignField: '_id',
                                as: 'department',
                            },
                        },
                        {
                            $unwind: {
                                path: '$department',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: `${tenantId}_generalinfos`,
                                localField: 'employee',
                                foreignField: 'employee',
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
                    const project = {
                        $project: {
                            employee: {
                                generalInfo: {
                                    legalName: 1,
                                    employeeId: 1,
                                },
                            },
                            department: {
                                name: 1,
                            },
                            lastWorkingDate: 1,
                            ticketID: 1,
                        },
                    };
                    matchOne.$match.ticketID = new RegExp(ticketID, 'i');
                    aggregates.push(matchOne);
                    aggregates = [
                        ...aggregates,
                        ...lookup,
                        {
                            $match: {
                                relievingStatus: relievingStatus,
                            },
                        },
                    ];
                    aggregates.push(project);
                    result = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates);
                }
                if (employeeID && result.length === 0) {
                    let aggregates = [];
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
                        {
                            $lookup: {
                                from: `${tenantId}_departments`,
                                localField: 'department',
                                foreignField: '_id',
                                as: 'department',
                            },
                        },
                        {
                            $unwind: {
                                path: '$department',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    const project = [
                        {
                            $project: {
                                ticketID: 1,
                                lastWorkingDate: 1,
                                nodeStep: 1,
                                employee: {
                                    generalInfo: {
                                        legalName: 1,
                                        employeeId: 1,
                                    },
                                },
                                department: {
                                    name: 1,
                                },
                            },
                        },
                    ];
                    aggregates = [
                        ...lookup,
                        {
                            $match: {
                                // 'employee.generalInfo.employeeId': employeeID,
                                'employee.generalInfo.employeeId': new RegExp(employeeID, 'i'),
                            },
                        },
                        {
                            $match: {
                                relievingStatus: relievingStatus,
                                company: mongoose_1.Types.ObjectId(company),
                            },
                        },
                        ...project,
                    ];
                    result = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates);
                }
                if (requesteeName && result.length === 0) {
                    let aggregates = [];
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
                        {
                            $lookup: {
                                from: `${tenantId}_departments`,
                                localField: 'employee.department',
                                foreignField: '_id',
                                as: 'employee.department',
                            },
                        },
                        {
                            $unwind: {
                                path: '$employee.department',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ];
                    const project = [
                        {
                            $project: {
                                ticketID: 1,
                                lastWorkingDate: 1,
                                nodeStep: 1,
                                employee: {
                                    generalInfo: {
                                        legalName: 1,
                                        employeeId: 1,
                                    },
                                    department: {
                                        name: 1,
                                    },
                                },
                            },
                        },
                    ];
                    //                  Working...
                    aggregates = [
                        ...lookup,
                        {
                            $match: {
                                'employee.generalInfo.legalName': new RegExp(requesteeName, 'i'),
                                relievingStatus: relievingStatus,
                                company: mongoose_1.Types.ObjectId(company),
                            },
                        },
                        ...project,
                    ];
                    result = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates);
                }
            }
            // Return list by relievingStatus
            else {
                let aggregates = [];
                const match = {
                    $match: {
                        relievingStatus: relievingStatus,
                        company: mongoose_1.Types.ObjectId(company),
                    },
                };
                const lookup = [
                    {
                        $lookup: {
                            from: `${tenantId}_departments`,
                            localField: 'department',
                            foreignField: '_id',
                            as: 'department',
                        },
                    },
                    {
                        $unwind: {
                            path: '$department',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: `${tenantId}_generalinfos`,
                            localField: 'employee',
                            foreignField: 'employee',
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
                const project = {
                    $project: {
                        employee: {
                            generalInfo: {
                                legalName: 1,
                                employeeId: 1,
                            },
                        },
                        nodeStep: 1,
                        department: {
                            name: 1,
                        },
                        lastWorkingDate: 1,
                        ticketID: 1,
                    },
                };
                aggregates = [...aggregates, match, ...lookup, project];
                result = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            }
            res.send(new ResponseResult_1.default({
                message: 'Get searched offboarding request list successfully',
                data: {
                    result,
                },
            }));
        });
    }
    listRelieving(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, 
            // limit = 0,
            status = constant_1.TYPE_TICKET_REQUEST.statusType.accepted, location = [], relievingStatus = 'IN-QUEUES', }, } = req;
            const currentUser = req.user;
            const permission = yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
            });
            const { employee: employeeId, roles } = permission;
            let locationId = location.map((s) => {
                return mongoose_1.Types.ObjectId(s);
            });
            let aggregate = [];
            const matchOne = { $match: {} };
            if (locationId.length > 0) {
                matchOne.$match.location = {};
                matchOne.$match.location = { $in: locationId };
            }
            if (status) {
                matchOne.$match.status = status;
            }
            matchOne.$match.relievingStatus = relievingStatus;
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: tenantId + '_departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: tenantId + '_employees',
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
                        from: tenantId + '_generalinfos',
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
            const matchTwo = { $match: {} };
            matchTwo.$match.manager = employeeId;
            lodash_1.map(roles, (per) => per._id).forEach(item => {
                if (lodash_1.includes(['HR', 'HR-MANAGER', 'hr', 'hr-manager'], item)) {
                    return true;
                }
            });
            const project = {
                $project: {
                    ticketID: 1,
                    requestDate: 1,
                    reasonForLeaving: 1,
                    lastWorkingDate: 1,
                    status: 1,
                    nodeStep: 1,
                    department: { name: 1, _id: 1 },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                    },
                    'employee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        _id: 1,
                    },
                },
            };
            aggregate.push(project);
            const items = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: { items },
            }));
        });
    }
    listAssigned(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.status = 'ACTIVE';
            matchOne.$match.assignee = employee._id;
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: 'offboardingrequests',
                        localField: 'offBoardingRequest',
                        foreignField: '_id',
                        as: 'offBoardingRequest',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequest',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'assignee',
                        foreignField: '_id',
                        as: 'assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'assignee.generalInfo',
                        foreignField: '_id',
                        as: 'assignee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'meetingWith',
                        foreignField: '_id',
                        as: 'meetingWith',
                    },
                },
                {
                    $unwind: {
                        path: '$meetingWith',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'meetingWith.generalInfo',
                        foreignField: '_id',
                        as: 'meetingWith.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$meetingWith.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    meetingDate: 1,
                    meetingTime: 1,
                    status: 1,
                    offBoardingRequest: {
                        ticketID: 1,
                        createdAt: 1,
                        _id: 1,
                    },
                    'assignee.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        employeeId: 1,
                        _id: 1,
                    },
                    'meetingWith.generalInfo': {
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                        employeeId: 1,
                        _id: 1,
                    },
                },
            };
            aggregate.push(project);
            const items = yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: { items },
            }));
        });
    }
    listAssignee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const currentUser = req.user;
            let employee = currentUser.employee;
            employee = yield EmployeeTenant_1.default.getInstance(tenantId).findById(currentUser.employee);
            let { offboardingrequest } = req.body;
            offboardingrequest = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offboardingrequest);
            const projects = yield ProjectTenant_1.default.getInstance(tenantId).find({ resource: { $in: [offboardingrequest.employee._id] } }, { resource: 1 }, { autopopulate: false });
            let ids = [];
            projects.forEach((project) => {
                ids = [...ids, ...project.resource];
            });
            ids = lodash_1.uniq(ids);
            const findOr = {
                $or: [{ department: employee.department }, { _id: { $in: ids } }],
            };
            const departmentIds = yield EmployeeTenant_1.default.getInstance(tenantId)
                .find(findOr, { _id: 1, generalInfo: 1 }, { autopopulate: false })
                .populate({
                path: 'generalInfo',
                select: { workEmail: 1, skills: 0 },
            });
            // .populate({
            //   path: 'generalinfos',
            //   model: 'generalInfo',
            //   options: { autopopulate: false }
            // })
            // .populate('generalInfo', { workEmail: 1, skills: -1 }, { autopopulate: false })
            // console.log(departmentIds)
            res.send(new ResponseResult_1.default({
                message: 'Get offBoarding Request list successfully.',
                data: { departmentIds, ids },
            }));
        });
    }
    updateRelieving(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, id, relievingStatus }, } = req;
            const offBoardingRequest = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(id);
            if (!offBoardingRequest) {
                throw new AdvancedError_1.default({
                    id: {
                        kind: 'not.found',
                        message: 'id not found',
                    },
                });
            }
            if (relievingStatus === 'IN-QUEUES')
                offBoardingRequest.set({
                    relievingStatus,
                    nodeStep: 5,
                });
            else
                offBoardingRequest.set({
                    relievingStatus,
                    nodeStep: 8,
                });
            yield offBoardingRequest.save();
            res.send(new ResponseResult_1.default({
                message: 'Update successfully',
                data: offBoardingRequest,
            }));
        });
    }
    closeEmployeeRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, offBoardingId }, } = req;
            const offBoardingRequest = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingId);
            if (!offBoardingRequest) {
                throw new AdvancedError_1.default({
                    offBoardingId: {
                        kind: 'not.found',
                        message: 'offBoardingId not found',
                    },
                });
            }
            offBoardingRequest.set({
                relievingStatus: 'CLOSE-RECORDS',
                nodeStep: 8,
            });
            yield offBoardingRequest.save();
            res.send(new ResponseResult_1.default({
                message: 'Close employee record successfully',
                data: offBoardingRequest,
            }));
        });
    }
    getByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const tenantId: any = req.header('tenantId')
            const { body: { id, tenantId }, } = req;
            // const item = await OffBoardingRequest.findById(id).exec()
            // item.comments = await OffBoardingRequest.findByOffBoardingRequest(id).exec()
            let aggregates = [];
            let matchOne = { $match: {} };
            matchOne.$match._id = mongoose_1.Types.ObjectId(id);
            aggregates.push(matchOne);
            const lookups = [
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'employee',
                        foreignField: '_id',
                        as: 'employee',
                    },
                },
                {
                    $unwind: { path: '$employee', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'managepermissions',
                        localField: 'employee._id',
                        foreignField: 'employee',
                        as: 'user',
                    },
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'usermaps',
                        localField: 'user.userMap',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'employee.department',
                        foreignField: '_id',
                        as: 'employee.department',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.department',
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
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'employee.title',
                        foreignField: '_id',
                        as: 'employee.title',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'manager',
                        foreignField: '_id',
                        as: 'manager',
                    },
                },
                {
                    $unwind: {
                        path: '$manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'manager.generalInfo',
                        foreignField: '_id',
                        as: 'manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_projects`,
                        localField: 'employee',
                        foreignField: 'resource',
                        as: 'project',
                    },
                },
                {
                    $unwind: {
                        path: '$project',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_projects`,
                        let: { emp_id: '$employee._id' },
                        pipeline: [{ $match: { $expr: { $in: ['$$emp_id', '$resource'] } } }],
                        as: 'projects',
                    },
                },
                {
                    $unwind: { path: '$projects', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'projects.manager',
                        foreignField: '_id',
                        as: 'projects.manager',
                    },
                },
                {
                    $unwind: {
                        path: '$projects.manager',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_titles`,
                        localField: 'manager.title',
                        foreignField: '_id',
                        as: 'manager.title',
                    },
                },
                {
                    $unwind: {
                        path: '$manager.title',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'projects.manager.generalInfo',
                        foreignField: '_id',
                        as: 'projects.manager.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$projects.manager.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_documents`,
                        localField: 'exitPackage.packages',
                        foreignField: '_id',
                        as: 'exitPackage.packages',
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_documents`,
                        localField: 'closingPackage.packages',
                        foreignField: '_id',
                        as: 'closingPackage.packages',
                    },
                },
            ];
            const projects = {
                $project: {
                    _id: 1,
                    offboardingRequestComments: 1,
                    ticketID: 1,
                    name: 1,
                    reasonForLeaving: 1,
                    requestDate: 1,
                    statusLastDate: 1,
                    code: 1,
                    status: 1,
                    approvalStep: 1,
                    nodeStep: 1,
                    lastWorkingDate: 1,
                    commentRequestLastDate: 1,
                    requestLastDate: 1,
                    relievingStatus: 1,
                    location: 1,
                    manager: {
                        _id: 1,
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            avatar: 1,
                            employeeId: 1,
                        },
                        title: 1,
                    },
                    employee: {
                        _id: 1,
                        employeeId: 1,
                        title: {
                            name: 1,
                        },
                        generalInfo: {
                            firstName: 1,
                            lastName: 1,
                            avatar: 1,
                            employeeId: 1,
                            workEmail: 1,
                        },
                        department: {
                            name: 1,
                        },
                        joinDate: 1,
                    },
                    user: {
                        email: 1,
                    },
                    projects: {
                        _id: 1,
                        name: 1,
                        manager: {
                            _id: 1,
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                                avatar: 1,
                                employeeId: 1,
                            },
                        },
                        projectHealth: 1,
                    },
                    exitPackage: {
                        isSent: 1,
                        packages: 1,
                        waitList: 1,
                    },
                    closingPackage: {
                        isSent: 1,
                        packages: 1,
                        waitList: 1,
                    },
                    exitInterviewFeedbacks: {
                        isSent: 1,
                        packages: 1,
                        waitList: 1,
                    },
                },
            };
            const group = {
                $group: {
                    _id: '$_id',
                    ticketID: { $first: '$ticketID' },
                    name: { $first: '$name' },
                    reasonForLeaving: { $first: '$reasonForLeaving' },
                    requestDate: { $first: '$requestDate' },
                    commentRequestLastDate: { $first: '$commentRequestLastDate' },
                    requestLastDate: { $first: '$requestLastDate' },
                    statusLastDate: { $first: '$statusLastDate' },
                    code: { $first: '$code' },
                    status: { $first: '$status' },
                    lastWorkingDate: { $first: '$lastWorkingDate' },
                    approvalStep: { $first: '$approvalStep' },
                    nodeStep: { $first: '$nodeStep' },
                    location: { $first: '$location' },
                    manager: { $first: '$manager' },
                    employee: { $first: '$employee' },
                    user: { $first: '$user' },
                    projects: { $push: '$projects' },
                    relievingStatus: { $first: '$relievingStatus' },
                    exitPackage: { $first: '$exitPackage' },
                    exitInterviewFeedbacks: { $first: '$exitInterviewFeedbacks' },
                    closingPackage: { $first: '$closingPackage' },
                },
            };
            aggregates = [...aggregates, ...lookups, projects, group];
            const data = (yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates));
            if (!data.length) {
                throw new AdvancedError_1.default({
                    report: {
                        kind: 'not.found',
                        message: ' OffboardingRequest not found',
                    },
                });
            }
            const hrManager = yield this.getHrManagerByLocation(data[0].location, tenantId);
            const result = new ResponseResult_1.default({
                message: 'Get OffBoardingRequest successfully.',
                data: {
                    item: data[0],
                    hrManager: hrManager.length ? hrManager[0] : null,
                },
            });
            res.send(result);
        });
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, action, name = '', reasonForLeaving, company, requestLastDate, }, } = req;
            const user = req.user;
            // console.log('user', user)
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: user._id,
                company,
                tenant: tenantId,
            }));
            const { employee, location } = managePermission;
            const employeeMap = (yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee));
            const { manager, department, generalInfo } = employeeMap;
            if (!manager) {
                throw new AdvancedError_1.default({
                    manager: {
                        kind: 'not.found',
                        message: 'manager not found',
                    },
                });
            }
            const employeeInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findById(generalInfo);
            const ticketID = '' + Math.floor(10000 + Math.random() * 90000);
            // Init report data:
            let data = {
                ticketID,
                name,
                reasonForLeaving,
                requestLastDate,
                manager,
                employee,
                location,
                company,
                department,
                status: action === 'submit'
                    ? constant_1.TYPE_TICKET_REQUEST.statusType.inProgress
                    : constant_1.TYPE_TICKET_REQUEST.statusType.draft,
                nodeStep: 2,
            };
            // Send mail
            if (action === 'submit') {
                const hrManagers = yield this.getHrManagerByLocation(location, tenantId);
                // console.log('HR-Manager', hrManagers[0])
                const match = [{ $match: { _id: manager } }];
                const lookup = [
                    {
                        $lookup: {
                            from: tenantId + '_generalinfos',
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
                const project = [
                    {
                        $project: {
                            _id: 1,
                            generalInfo: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                workEmail: 1,
                                avatar: 1,
                            },
                        },
                    },
                ];
                const aggregateTwo = [...match, ...lookup, ...project];
                const managerInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregateTwo);
                // console.log('managerInfo', managerInfo)
                let requesteeName = '';
                // Notify requestee
                if (employeeInfo) {
                    requesteeName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
                    const requesteeMailContent = `
        <p>You have requested a resignation with the reason:</p>
        <p>${reasonForLeaving}</p><br/>
        <p>A last working date (LWD) will generated after your request is approved by your manager and the HR.</p>
      `;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: employeeInfo.workEmail,
                        fullName: requesteeName,
                    }, [], 'Offboarding notification to employee', requesteeMailContent);
                }
                // Notify HR Managers
                if (hrManagers.length > 0) {
                    const hrManagerMailContent = `
        <p>${requesteeName} has requested a resignation with the reason:</p>
        <p>${reasonForLeaving}</p><br/>
      `;
                    bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                        const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                        yield SendMail_1.sendNotificationOffboarding({
                            email: hrManager.employee.generalInfo.workEmail,
                            fullName: hrManagerName,
                        }, [], 'Offboarding notification to HR Manager', hrManagerMailContent);
                    }));
                }
                // // Notify manager
                if (managerInfo.length > 0) {
                    const managerMailContent = `
        <p>${requesteeName} has requested a resignation with the reason:</p>
        <p>${reasonForLeaving}</p><br/>
      `;
                    const managerName = `${managerInfo[0].generalInfo.firstName} ${managerInfo[0].generalInfo.lastName}`;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: managerInfo[0].generalInfo.workEmail,
                        fullName: managerName,
                    }, [], 'Offboarding notification to Manager', managerMailContent);
                }
            }
            // Create report
            let item = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).create(data);
            res.send(new ResponseResult_1.default({
                message: 'Add OffBoardingRequest successfully.',
                data: item,
            }));
        });
    }
    terminate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, action = 'submit', employee = '', name = '', reasonForLeaving = '', lastWorkingDate, }, } = req;
            const user = req.user;
            const userPermission = (yield ManagePermission_1.default.findOne({
                userMap: user._id,
            }));
            if (!lodash_1.includes(lodash_1.map(userPermission.roles, (per) => per), 'HR-MANAGER')) {
                throw new AdvancedError_1.default({
                    offBoardingRequestTenant: {
                        kind: 'not.permission',
                        message: 'User does not have permission',
                    },
                });
            }
            if (!employee) {
                throw new AdvancedError_1.default({
                    offBoardingRequestTenant: {
                        kind: 'required',
                        message: 'Employee ID is required',
                    },
                });
            }
            const employeeData = (yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee));
            if (!employeeData) {
                throw new AdvancedError_1.default({
                    offBoardingRequestTenant: {
                        kind: 'not.found',
                        message: 'Employee not found',
                    },
                });
            }
            const { employeeID = employeeData._id, location = employeeData.location._id, department = employeeData.department._id, company = employeeData.company._id, manager = employeeData.manager ? employeeData.manager._id : '', } = employeeData;
            if (manager === '') {
                throw new AdvancedError_1.default({
                    manager: {
                        path: 'method',
                        kind: 'not.found',
                        message: `Manager not found.`,
                    },
                });
            }
            const ticketID = '' + Math.floor(10000 + Math.random() * 90000);
            // Init report data:
            let data = {
                ticketID,
                name,
                reasonForLeaving,
                manager,
                employee: employeeID,
                location,
                company,
                department,
                lastWorkingDate,
                relievingStatus: 'IN-QUEUES',
                status: action === 'submit'
                    ? constant_1.TYPE_TICKET_REQUEST.statusType.accepted
                    : constant_1.TYPE_TICKET_REQUEST.statusType.draft,
            };
            // Send mail
            if (action === 'submit') {
                data.date = new Date();
                // Send mail notification
                const employeeInfo = yield EmployeeTenant_1.default.getInstance(tenantId).findById(employee);
                const hrManagers = yield this.getHrManagerByLocation(employeeInfo.location.id, tenantId);
                const employeeGeneralInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                    employee,
                });
                const managerGeneralInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                    manager,
                });
                let requesteeName = '';
                // Notify requestee
                if (employeeGeneralInfo) {
                    requesteeName = `${employeeGeneralInfo.firstName} ${employeeGeneralInfo.lastName}`;
                    const requesteeMailContent = `
        <p>Your work has been terminated by the HR Manager</p>
        <p>${reasonForLeaving}</p><br/>
        <p>A last working date (LWD) will generated after your request is approved by your manager and the HR.</p>
      `;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: employeeGeneralInfo.workEmail,
                        fullName: requesteeName,
                    }, [], 'Offboarding notification to employee', requesteeMailContent);
                }
                // Notify HR Managers
                if (hrManagers) {
                    const hrManagerMailContent = `
        <p>You have terminated ${requesteeName}'s work</p>
        <p>${reasonForLeaving}</p><br/>
      `;
                    bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                        const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                        yield SendMail_1.sendNotificationOffboarding({
                            email: hrManager.employee.generalInfo.workEmail,
                            fullName: hrManagerName,
                        }, [], 'Offboarding notification to HR Manager', hrManagerMailContent);
                    }));
                }
                // Notify manager
                if (managerGeneralInfo) {
                    const managerMailContent = `
        <p>${requesteeName}'s work at company has been terminated</p>
        <p>${reasonForLeaving}</p><br/>
      `;
                    const managerName = `${managerGeneralInfo.firstName} ${managerGeneralInfo.lastName}`;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: managerGeneralInfo.workEmail,
                        fullName: managerName,
                    }, [], 'Offboarding notification to Manager', managerMailContent);
                }
            }
            // Create report
            let item = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).create(data);
            // if (!isEmpty(messages) && item) {
            //   const commentIds: any = []
            //   await Bluebird.map(messages, async (message: string) => {
            //     const comment = await OffBoardingRequestComment.create({
            //       content: message,
            //       offBoardingRequest: item._id,
            //       user: user._id,
            //       location: user.employee.location,
            //       company: user.employee.company,
            //     })
            //     commentIds.push(comment.id)
            //   })
            //   item = await item.set({ comments: commentIds }).save()
            // }
            const result = new ResponseResult_1.default({
                message: 'Add OffBoardingRequest successfully.',
                data: item,
            });
            res.send(result);
        });
    }
    review(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, id, action, reasonPutOnHold = '' }, } = req;
            const offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(id);
            if (!offBoarding) {
                throw new AdvancedError_1.default({
                    offBoardingRequest: {
                        kind: 'not.found',
                        message: 'offBoardingRequest not found',
                    },
                });
            }
            if (offBoarding.status !== constant_1.TYPE_TICKET_REQUEST.statusType.inProgress) {
                throw new AdvancedError_1.default({
                    offBoarding: {
                        kind: `is.${offBoarding.status}`,
                        message: `offBoarding is ${offBoarding.status}!`,
                    },
                });
            }
            const user = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: user._id,
                company: offBoarding.company,
            }));
            const { employee } = managePermission;
            // Check permission
            const hrManagers = yield this.getHrManagerByLocation(offBoarding.location, tenantId);
            // let permissionId = map(hrManagers, (hrManager: any) =>
            //   String(hrManager.employee._id),
            // )
            // permissionId = [...permissionId, String(offBoarding.manager)]
            if (String(employee) !== String(offBoarding.manager)) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'permission',
                        message: 'have not permission',
                    },
                });
            }
            // check offBoardingRequest co 1-on-1 hay chua
            // phai comment moi dc accepted
            const checkOneOnOneComment = yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).find({
                offBoardingRequest: offBoarding._id,
            });
            if (checkOneOnOneComment.length === 0) {
                throw new AdvancedError_1.default({
                    offboardingRequestComment: {
                        kind: 'not.complete',
                        message: 'offboardingRequest have not 1-on-1',
                    },
                });
            }
            const haveComment = lodash_1.filter(checkOneOnOneComment, (o) => {
                return o.content === '';
            });
            if (haveComment.length > 0) {
                throw new AdvancedError_1.default({
                    oneOnOne: {
                        kind: 'not.complete',
                        message: '1-on-1 not completed!',
                    },
                });
            }
            let data = {};
            switch (action) {
                case constant_1.TYPE_TICKET_REQUEST.statusType.accepted:
                    const date = new Date();
                    date.setDate(date.getDate() + 90);
                    data = {
                        status: action,
                        lastWorkingDate: date,
                        nodeStep: 3,
                    };
                    break;
                case constant_1.TYPE_TICKET_REQUEST.statusType.onHold:
                    data = {
                        status: action,
                        reasonPutOnHold,
                        nodeStep: 1,
                    };
                    break;
                case constant_1.TYPE_TICKET_REQUEST.statusType.rejected:
                    data = {
                        status: action,
                        nodeStep: 1,
                    };
                    break;
                default:
                    break;
            }
            offBoarding.set(data);
            yield offBoarding.save();
            const lookup = [
                {
                    $lookup: {
                        from: tenantId + '_generalinfos',
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
            const project = [
                {
                    $project: {
                        _id: 1,
                        generalInfo: {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            workEmail: 1,
                        },
                    },
                },
            ];
            const matchOne = {
                $match: {
                    _id: offBoarding.employee,
                },
            };
            let aggreates = [matchOne, ...lookup, ...project];
            // Send mail notification
            const employeeInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggreates);
            const matchTwo = {
                $match: {
                    _id: offBoarding.manager,
                },
            };
            aggreates = [matchTwo, ...lookup, ...project];
            const managerInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggreates);
            // Send mail notification
            let requesteeName = '';
            const status = {
                ACCEPTED: 'accepted',
                REJECTED: 'rejected',
                'ON-HOLD': 'on-hold',
            };
            let actionStr = status[action] || 'no status';
            if (employeeInfo.length > 0) {
                requesteeName = `${employeeInfo[0].generalInfo.firstName} ${employeeInfo[0].generalInfo.lastName}`;
                const requesteeMailContent = `
          <p>Your offboarding request has been ${actionStr}</p>
        `;
                yield SendMail_1.sendNotificationOffboarding({
                    email: employeeInfo[0].generalInfo.workEmail,
                    fullName: requesteeName,
                }, [], 'Offboarding review notification to employee', requesteeMailContent);
            }
            // Notify HR Managers
            if (hrManagers.length > 0) {
                const hrManagerMailContent = `
        <p>${requesteeName}'s offboarding request has been ${actionStr}</p>
        `;
                bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: hrManager.employee.generalInfo.workEmail,
                        fullName: hrManagerName,
                    }, [], 'Offboarding review notification to HR Manager', hrManagerMailContent);
                }));
            }
            // Notify manager
            if (managerInfo.length > 0) {
                const managerMailContent = `
        <p>${requesteeName}'s offboarding request has been ${actionStr}</p>
        `;
                const managerName = `${managerInfo[0].generalInfo.firstName} ${managerInfo[0].generalInfo.lastName}`;
                yield SendMail_1.sendNotificationOffboarding({
                    email: managerInfo[0].generalInfo.workEmail,
                    fullName: managerName,
                }, [], 'Offboarding review notification to Manager', managerMailContent);
            }
            // else if (nodeCurrent.type === 'ApprovalFlowGroup') {
            //   const group: any = await ApprovalFlowGroupTenant.getInstance(
            //     tenantId,
            //   ).findById(offBoarding.approvalFlowData.nodes[approvalStep].value)
            //   const checkExist = filter(group.members, v => includes(employee.id, v.id))
            //   if (checkExist.length > 0) {
            //     await OffBoardingRequestTenant.getInstance(tenantId).updateOne(
            //       { _id: offBoarding._id },
            //       {
            //         $set: {
            //           lastWorkingDate,
            //           approvalStep: approvalStep + 1,
            //         },
            //       },
            //     )
            //     // Send mail notification
            //     const employeeInfo: any = await EmployeeTenant.getInstance(
            //       tenantId,
            //     ).findById(offBoarding.employee._id)
            //     const hrManagers = await this.getHrManagerByLocation(
            //       employeeInfo.location.id,
            //       tenantId,
            //     )
            //     const managerInfo = await EmployeeTenant.getInstance(tenantId).findById(
            //       employeeInfo.manager,
            //     )
            //     let requesteeName: string = ''
            //     const formatLWD = moment(lastWorkingDate).format('MM-DD-YYYY')
            //     // Notify requestee
            //     if (employeeInfo) {
            //       requesteeName = `${employeeInfo.generalInfo.firstName} ${employeeInfo.generalInfo.lastName}`
            //       const requesteeMailContent = `
            //         <p>Your last working date is ${formatLWD}</p>
            //       `
            //       await sendNotificationOffboarding(
            //         {
            //           email: employeeInfo.generalInfo.workEmail,
            //           fullName: requesteeName,
            //         },
            //         [],
            //         'Offboarding review notification to employee',
            //         requesteeMailContent,
            //       )
            //     }
            //     // Notify HR Managers
            //     if (hrManagers) {
            //       const hrManagerMailContent = `
            //         <p>${requesteeName}'s last working date is ${formatLWD}</p>
            //       `
            //       Bluebird.map(hrManagers, async (hrManager: any) => {
            //         const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`
            //         await sendNotificationOffboarding(
            //           {
            //             email: hrManager.employee.generalInfo.workEmail,
            //             fullName: hrManagerName,
            //           },
            //           [],
            //           'Offboarding review notification to HR Manager',
            //           hrManagerMailContent,
            //         )
            //       })
            //     }
            //     // Notify manager
            //     if (managerInfo) {
            //       const managerMailContent = `
            //     <p>${requesteeName}'s last working date is ${formatLWD}</p>
            //     `
            //       const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`
            //       await sendNotificationOffboarding(
            //         {
            //           email: managerInfo.generalInfo.workEmail,
            //           fullName: managerName,
            //         },
            //         [],
            //         'Offboarding review notification to Manager',
            //         managerMailContent,
            //       )
            //     }
            //   }
            // }
            res.send(new ResponseResult_1.default({
                message: 'Review successfully',
            }));
        });
    }
    approvalLWD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { offBoardingId, company, lastWorkingDate, tenantId }, } = req;
            const currentUser = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                company,
            }));
            const { roles } = managePermission;
            const offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingId);
            if (!lodash_1.includes(roles, 'HR-MANAGER')) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'permission',
                        message: 'have not permission',
                    },
                });
            }
            if (offBoarding.nodeStep < 3) {
                throw new AdvancedError_1.default({
                    offBoarding: {
                        kind: 'not.review',
                        message: 'offBoarding not yet review!',
                    },
                });
            }
            if (offBoarding.status == 'REJECTED') {
                throw new AdvancedError_1.default({
                    offBoarding: {
                        kind: 'is.rejected',
                        message: 'offBoarding is rejected!',
                    },
                });
            }
            if (lastWorkingDate) {
                offBoarding.set({ lastWorkingDate, statusLastDate: 'ACCEPTED' });
            }
            offBoarding.set({ nodeStep: 4 });
            yield offBoarding.save();
            // Send mail notification
            const employeeInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne(offBoarding.employee);
            // const hrManagers: any = await this.getHrManagerByLocation(
            //   offBoarding.location,
            //   tenantId,
            // )
            // const managerInfo: any = await GeneralInfoTenant.getInstance(
            //   tenantId,
            // ).findOne(offBoarding.manager)
            const formatLWD = moment_1.default(offBoarding.requestLastDate).format('MM-DD-YYYY');
            let requesteeName = '';
            // Notify employee
            if (employeeInfo) {
                requesteeName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
                const requesteeMailContent = `
            <p>Your last working day is (${formatLWD}).</p>
          `;
                yield SendMail_1.sendNotificationOffboarding({
                    email: employeeInfo.workEmail,
                    fullName: requesteeName,
                }, [], 'Offboarding last working day notification to employee', requesteeMailContent);
            }
            // const managerName: any = `${managerInfo.firstName} ${managerInfo.lastName}`
            // Notify HR Managers
            // if (hrManagers) {
            //   const hrManagerMailContent = `
            //         <p>${managerName} has ${lwdStatusStr} ${formatLWD} as ${requesteeName}'s last working day.</p>
            //       `
            //   Bluebird.map(hrManagers, async (hrManager: any) => {
            //     const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`
            //     await sendNotificationOffboarding(
            //       {
            //         email: hrManager.employee.generalInfo.workEmail,
            //         fullName: hrManagerName,
            //       },
            //       [],
            //       'Offboarding last working day notification to HR Manager',
            //       hrManagerMailContent,
            //     )
            //   })
            // }
            // // Notify manager
            // if (managerInfo) {
            //   const managerMailContent = `
            //         <p>You has ${lwdStatusStr} ${formatLWD} as ${requesteeName}'s last working day.</p>
            //       `
            //   const managerName = `${managerInfo.generalInfo.firstName} ${managerInfo.generalInfo.lastName}`
            //   await sendNotificationOffboarding(
            //     {
            //       email: managerInfo.generalInfo.workEmail,
            //       fullName: managerName,
            //     },
            //     [],
            //     'Offboarding last working day notification to Manager',
            //     managerMailContent,
            //   )
            // }
            res.send(new ResponseResult_1.default({
                message: 'Review report successfully',
                data: offBoarding,
            }));
        });
    }
    requestLWD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, company, id, commentRequestLastDate, requestLastDate }, } = req;
            const currentUser = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                company,
            }));
            const { employee } = managePermission;
            const offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(id);
            if (offBoarding.status == 'REJECTED') {
                throw new AdvancedError_1.default({
                    offBoarding: {
                        kind: 'is.rejected',
                        message: 'offBoarding is rejected!',
                    },
                });
            }
            if (String(offBoarding.manager) === String(employee)) {
                offBoarding.set({
                    statusLastDate: 'REQUESTED',
                    commentRequestLastDate,
                    requestLastDate,
                });
                yield offBoarding.save();
                const lookup = [
                    {
                        $lookup: {
                            from: tenantId + '_generalinfos',
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
                const project = [
                    {
                        $project: {
                            _id: 1,
                            generalInfo: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                workEmail: 1,
                            },
                        },
                    },
                ];
                const matchOne = { $match: { _id: employee } };
                let aggreates = [matchOne, ...lookup, ...project];
                // Send mail notification
                const employeeInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggreates);
                const hrManagers = yield this.getHrManagerByLocation(offBoarding.location, tenantId);
                const matchTwo = { $match: { _id: offBoarding.manager } };
                aggreates = [matchTwo, ...lookup, ...project];
                const managerInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggreates);
                const formatLWD = moment_1.default(requestLastDate).format('MM-DD-YYYY');
                let requesteeName = '';
                const managerName = `${managerInfo[0].generalInfo.firstName} ${managerInfo[0].generalInfo.lastName}`;
                // Mail notifications
                // Notify requestee
                if (employeeInfo.length > 0) {
                    requesteeName = `${employeeInfo[0].generalInfo.firstName} ${employeeInfo[0].generalInfo.lastName}`;
                    const requesteeMailContent = `
        <p>${managerName} have requested ${formatLWD} as your last working day.</p>
        `;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: employeeInfo[0].generalInfo.workEmail,
                        fullName: requesteeName,
                    }, [], 'Offboarding last working day notification to employee', requesteeMailContent);
                }
                // Notify HR Managers
                if (hrManagers) {
                    const hrManagerMailContent = `
        <p>${managerName} has requested ${formatLWD} as ${requesteeName}'s last working day.</p>
      `;
                    bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                        const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                        yield SendMail_1.sendNotificationOffboarding({
                            email: hrManager.employee.generalInfo.workEmail,
                            fullName: hrManagerName,
                        }, [], 'Offboarding last working day notification to HR Manager', hrManagerMailContent);
                    }));
                }
                // Notify manager
                if (managerInfo) {
                    const managerMailContent = `
        <p>You has requested ${formatLWD} as ${requesteeName}'s last working day.</p>
      `;
                    const managerName = `${managerInfo[0].generalInfo.firstName} ${managerInfo[0].generalInfo.lastName}`;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: managerInfo[0].generalInfo.workEmail,
                        fullName: managerName,
                    }, [], 'Offboarding last working day notification to Manager', managerMailContent);
                }
            }
            res.send(new ResponseResult_1.default({
                message: 'request LWD successfully',
                data: offBoarding,
            }));
        });
    }
    getServiceActionName(action) {
        return __awaiter(this, void 0, void 0, function* () {
            let actionName = action.toLowerCase();
            switch (action) {
                case constant_1.TYPE_TICKET_REQUEST.statusType.onHold:
                    actionName = 'onHold';
                    break;
                default:
                    break;
            }
            return actionName;
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, id } = req.body;
            const item = yield OffBoardingRequestTenant_1.default.getInstance(tenantId)
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
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, tenantId }, } = req;
            yield OffBoardingRequestTenant_1.default.getInstance(tenantId).deleteMany({
                _id: mongoose_1.Types.ObjectId(id),
            });
            yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).deleteMany({
                offBoardingRequest: mongoose_1.Types.ObjectId(id),
            });
            const result = new ResponseResult_1.default({
                message: 'Remove OffBoardingRequest successfully.',
            });
            res.send(result);
        });
    }
    hasManager({ approvalFlow = {} } = {}) {
        let isHas = false;
        lodash_1.forEach(approvalFlow.nodes, (obj = {}) => {
            if (obj.type === 'DirectManager') {
                isHas = true;
            }
        });
        return isHas;
    }
    /* Internal Functions */
    setApprovalFlow({ employee, data } = {}, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate ApprovalFlow:
            const approvalFlow = yield ApprovalFlowTenant_1.default.getInstance(tenantId).findOne({
                status: 'ACTIVE',
                location: employee.location.id,
                company: employee.company.id,
                _id: data.approvalFlow,
            });
            if (!approvalFlow) {
                throw new AdvancedError_1.default({
                    ApprovalFlow: {
                        kind: 'not.found',
                        message: 'ApprovalFlow not found!',
                    },
                });
            }
            // Validate ApprovalFlow manager
            if (this.hasManager({ approvalFlow })) {
                if (!employee.manager) {
                    throw new AdvancedError_1.default({
                        ApprovalFlow: {
                            kind: 'not.found',
                            message: 'Manager not found. ApprovalFlow has the manager node!',
                        },
                    });
                }
                // set manager in report
                data.manager = employee.manager.id;
            }
            // set approvalFlow in report
            data.approvalFlow = approvalFlow.id;
            // set approvalFlowData in report
            data.approvalFlowData = approvalFlow;
            // set nodeStep in report
            data.nodeStep = lodash_1.get(approvalFlow, 'nodes.0.value');
            return data;
        });
    }
    addOneOnOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, offBoardingRequest, meetingDate, meetingTime, meetingWith, assignee, ownerComment, isRelieving, }, } = req;
            const offBoading = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(offBoardingRequest);
            if (!offBoading) {
                throw new AdvancedError_1.default({
                    offBoardingRequest: {
                        kind: 'not.found',
                        message: 'offBoardingRequest not found',
                    },
                });
            }
            const user = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: user._id,
                company: offBoading.company,
            }));
            const { company, employee, location } = managePermission;
            let offBoardingRequestComment = {
                offBoardingRequest,
                createdBy: employee,
                company,
                location,
                isRelieving,
            };
            // Get name & email
            let aggregates = [];
            let meetingWithInfo;
            let assigneeInfo;
            const lookup = [
                {
                    $lookup: {
                        from: tenantId + '_generalinfos',
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
            // Match with meetingWith
            const match1 = {
                $match: {
                    _id: mongoose_1.Types.ObjectId(meetingWith),
                },
            };
            // Match with assignee
            const match2 = {
                $match: {
                    _id: mongoose_1.Types.ObjectId(assignee),
                },
            };
            const project = {
                $project: {
                    generalInfo: {
                        legalName: 1,
                        workEmail: 1,
                    },
                },
            };
            aggregates = [match1, ...lookup, project];
            meetingWithInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            console.log('meetingWithInfo', meetingWithInfo);
            aggregates = [match2, ...lookup, project];
            assigneeInfo = yield EmployeeTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            console.log('assigneeInfo', assigneeInfo);
            if (meetingWithInfo.length > 0) {
                const { generalInfo: { legalName: meetingWithName = '', workEmail: meetingWithMail = '', } = {}, } = meetingWithInfo[0];
                const DATE_FORMAT = 'MMM Do YYYY';
                let content = `
      <p>You have a 1-on-1 meeting between <b></b> <b>${meetingWithName}</b> (${meetingWithMail}) on <b>${moment_1.default(meetingDate).format(DATE_FORMAT)}</b> at <b>${meetingTime}</b></p>
      `;
                if (assigneeInfo.length > 0) {
                    const { generalInfo: { legalName: assigneeName = '', workEmail: assigneeMail = '', } = {}, } = assigneeInfo[0];
                    content += `<p>Asignee: <b>${assigneeName}</b> <b>(${assigneeMail})</b></p>`;
                }
                yield SendMail_1.sendOneOnOneMail({
                    email: meetingWithMail,
                    fullName: meetingWithName,
                }, [], content);
            }
            else {
                throw new AdvancedError_1.default({
                    oneOnOne: {
                        kind: 'not.found',
                        message: ' meetingWith not found',
                    },
                });
            }
            if (meetingDate) {
                offBoardingRequestComment = Object.assign(Object.assign({}, offBoardingRequestComment), { meetingDate,
                    meetingTime,
                    meetingWith,
                    assignee,
                    ownerComment });
            }
            const comment = yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).create(offBoardingRequestComment);
            // await offBoading.set({ nodeStep: 3 }).save()
            res.send(new ResponseResult_1.default({
                message: 'Add comment successfully.',
                data: comment,
            }));
        });
    }
    getMeetingTime(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(new ResponseResult_1.default({
                message: 'get meeting time successfully.',
                data: constant_1.TYPE_TICKET_REQUEST.meetingTimeEnum,
            }));
        });
    }
    completeOneOnOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, content, tenantId, canBeRehired }, } = req;
            const oneOnOneComment = yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).findById(id);
            if (!oneOnOneComment) {
                throw new AdvancedError_1.default({
                    id: {
                        kind: 'not.found',
                        message: 'id not found',
                    },
                });
            }
            yield oneOnOneComment
                .set({ status: 'COMPLETED', content, canBeRehired })
                .save();
            res.send(new ResponseResult_1.default({
                message: 'Completed comment successfully.',
                data: oneOnOneComment,
            }));
        });
    }
    getOneOnOneByOffBoardingId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { offBoardingRequest, tenantId }, } = req;
            let aggregate = [];
            const matchOne = { $match: {} };
            matchOne.$match.offBoardingRequest = mongoose_1.Types.ObjectId(offBoardingRequest);
            aggregate.push(matchOne);
            const lookup = [
                {
                    $lookup: {
                        from: `${tenantId}_offboardingrequests`,
                        localField: 'offBoardingRequest',
                        foreignField: '_id',
                        as: 'offBoardingRequest',
                    },
                },
                {
                    $unwind: {
                        path: '$offBoardingRequest',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy',
                    },
                },
                {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'createdBy.generalInfo',
                        foreignField: '_id',
                        as: 'createdBy.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$createdBy.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_companies`,
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
                        from: `${tenantId}_employees`,
                        localField: 'meetingWith',
                        foreignField: '_id',
                        as: 'meetingWith',
                    },
                },
                {
                    $unwind: {
                        path: '$meetingWith',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'meetingWith.generalInfo',
                        foreignField: '_id',
                        as: 'meetingWith.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$meetingWith.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'ownerComment',
                        foreignField: '_id',
                        as: 'ownerComment',
                    },
                },
                {
                    $unwind: {
                        path: '$ownerComment',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'ownerComment.generalInfo',
                        foreignField: '_id',
                        as: 'ownerComment.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$ownerComment.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_employees`,
                        localField: 'assignee',
                        foreignField: '_id',
                        as: 'assignee',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_generalinfos`,
                        localField: 'assignee.generalInfo',
                        foreignField: '_id',
                        as: 'assignee.generalInfo',
                    },
                },
                {
                    $unwind: {
                        path: '$assignee.generalInfo',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            aggregate = [...aggregate, ...lookup];
            const project = {
                $project: {
                    _id: 1,
                    content: 1,
                    type: 1,
                    offBoardingRequest: 1,
                    createdBy: 1,
                    company: 1,
                    meetingDate: 1,
                    meetingTime: 1,
                    meetingWith: 1,
                    ownerComment: 1,
                    assignee: 1,
                    status: 1,
                    isRelieving: 1,
                    canBeRehired: 1,
                },
            };
            aggregate.push(project);
            const list = yield OffBoardingRequestCommentTenant_1.default.getInstance(tenantId).aggregate(aggregate);
            res.send(new ResponseResult_1.default({
                message: 'get 1 on 1 list successfully.',
                data: list,
            }));
        });
    }
    /**
     *  Send off boarding package via mail to employee with below params in request's body
     * @param packageType Name of the off boarding package
     * @param toEmail (Optional) For sending package to a different email
     * @param ticketId Id of the off boarding
     * @param toWho to HR or to Employee?
     */
    sendPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userMapId } = req.user;
            const { tenantId, company, packageType, ticketId, toEmail, toWho, } = req.body;
            const camelCase = this.toCamelCase(packageType);
            if (!packageType) {
                res.send(new AdvancedError_1.default({
                    package: {
                        kind: 'is.missing',
                        message: 'Package type is missing',
                    },
                }));
            }
            // Get the corresponding off boarding ticket
            const request = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(ticketId);
            if (!request) {
                res.send(new AdvancedError_1.default({
                    offBoardingRequest: {
                        kind: 'invalid',
                        message: 'Off boarding ticket invalid',
                    },
                }));
            }
            else {
                if (request[camelCase].isSent)
                    res.send(new AdvancedError_1.default({
                        offBoardingRequest: {
                            message: 'The packages have already been sent',
                            kind: 'invalid',
                        },
                    }));
                const { employee: employeeId } = request;
                const { waitList: packages } = request[camelCase];
                const userPermission = (yield ManagePermission_1.default.findOne({
                    userMap: userMapId,
                    company,
                }));
                const { employee: userId } = userPermission;
                const userInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                    employee: userId,
                });
                // Generate PDFs as attachments from template relieving packages
                const PDFs = yield bluebird_1.default.map(packages, (pkg) => __awaiter(this, void 0, void 0, function* () {
                    const pdf = yield this.generatePDF(`<body><h1>${pkg.packageName}</h1></body>`, pkg.settings, toWho);
                    return yield this.upload('attachments', userMapId, pdf, pkg.packageName);
                }));
                // Sort attachments for sending packages through mail
                const attachments = PDFs.map(item => ({
                    filename: item.name,
                    href: item.url,
                })).concat(yield request[camelCase].packages.map((item) => ({
                    filename: item.key,
                    href: item.attachment.url,
                })));
                // Make Documents to save in offBoardingRequest depending on the packageType
                const pdfDocs = yield bluebird_1.default.map(PDFs, (item) => __awaiter(this, void 0, void 0, function* () {
                    return yield DocumentTenant_1.default.getInstance(tenantId).create({
                        key: packageType,
                        attachment: item.id,
                    });
                })).map((item) => item._id);
                const offBoardingEmployee = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ employee: employeeId });
                if (!offBoardingEmployee) {
                    throw new AdvancedError_1.default({
                        employee: {
                            kind: 'not.found',
                            message: 'Employee is not found',
                        },
                    });
                }
                const { workEmail = '' } = offBoardingEmployee;
                let done = false;
                if (packageType === 'EXIT-PACKAGE') {
                    done = yield SendMail_1.sendOffBoardingTenantPackage(workEmail, [], packageType, offBoardingEmployee, userInfo ? userInfo.legalName || userInfo.firsName : '');
                }
                else if (packageType === 'CLOSING-PACKAGE') {
                    done = yield SendMail_1.sendOffBoardingCloseTenantPackage(toEmail || workEmail, [], packageType, userInfo, userInfo ? userInfo.legalName || userInfo.firsName : '', attachments);
                }
                if (done) {
                    switch (packageType) {
                        case 'EXIT-PACKAGE':
                            yield request.updateOne({
                                $set: {
                                    nodeStep: 6,
                                    'exitPackage.isSent': true,
                                },
                                $push: {
                                    'exitPackage.packages': pdfDocs,
                                },
                            });
                            break;
                        case 'EXIT-INTERVIEW-FEEDBACKS':
                            yield request.updateOne({
                                $set: {
                                    'exitInterviewFeedbacks.isSent': true,
                                },
                                $push: {
                                    'exitInterviewFeedbacks.packages': pdfDocs,
                                },
                            });
                            break;
                        case 'CLOSING-PACKAGE':
                            yield request.updateOne({
                                $set: {
                                    nodeStep: 7,
                                    'closingPackage.isSent': true,
                                    'closingPackage.toEmail': toEmail,
                                },
                                $push: {
                                    'closingPackage.packages': pdfDocs,
                                },
                            });
                            break;
                        default:
                            break;
                    }
                    yield request.save();
                    res.send(new ResponseResult_1.default({
                        message: 'Successfully sent packages to employee with the following packages',
                        data: done,
                    }));
                }
            }
        });
    }
    submitToHR(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userMapId } = req.user;
            const { tenantId, company } = req.body;
            const userPermission = (yield ManagePermission_1.default.findOne({
                userMap: userMapId,
                company,
            }));
            const { employee: userId, location } = userPermission;
            const userInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({
                employee: userId,
            });
            const hrManagers = yield this.getHrManagerByLocation(location, tenantId);
            const employeeName = `${userInfo.firstName} ${userInfo.lastName}`;
            if (hrManagers) {
                const hrManagerMailContent = `
        <p>${employeeName} has submit exit inerview package.</p>
      `;
                bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                    const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: hrManager.employee.generalInfo.workEmail,
                        fullName: hrManagerName,
                    }, [], 'Employee submit exit intervew package notification to HR Manager', hrManagerMailContent);
                }));
            }
            res.send(new ResponseResult_1.default({
                message: 'Submit successfully',
            }));
        });
    }
    toCamelCase(str) {
        return str
            .split('-')
            .join(' ')
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
            .replace(/\s+/g, '');
    }
    /**
     * Save relieving templates to draft in off boarding request waiting list with the following in req.body
     * @param ticketId Id of the off boarding request ticket
     * @param settings Array of settings for the specififying relieving template
     * @param packageType Type of the package ready to send via mail (e.g EXIT-PACKAGE)
     * @param templateId Id of the template to put in query selector to filter out the specific template in the package
     */
    saveDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketId, settings, packageType, templateId, tenantId } = req.body;
            if (!ticketId || !settings || !packageType || !templateId)
                res.send(new AdvancedError_1.default({
                    offBoardingRequest: {
                        kind: 'request.invalid',
                        message: 'Request does not meet the minimum criteria',
                    },
                }));
            const ticket = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(ticketId);
            if (ticket) {
                switch (packageType) {
                    case 'EXIT-PACKAGE':
                        yield ticket.updateOne({
                            $set: {
                                'exitPackage.waitList.$[package].settings': settings,
                            },
                        }, {
                            arrayFilters: [
                                {
                                    'package.templateRelieving': mongoose_1.Types.ObjectId(templateId),
                                },
                            ],
                        });
                        break;
                    case 'EXIT-INTERVIEW-FEEDBACKS':
                        yield ticket.updateOne({
                            $set: {
                                'exitInterviewFeedbacks.waitList.$[package].settings': settings,
                            },
                        }, {
                            arrayFilters: [
                                {
                                    'package.templateRelieving': mongoose_1.Types.ObjectId(templateId),
                                },
                            ],
                        });
                        break;
                    case 'CLOSING-PACKAGE':
                        yield ticket.updateOne({
                            $set: {
                                'closingPackage.waitList.$[package].settings': settings,
                            },
                        }, {
                            arrayFilters: [
                                {
                                    'package.templateRelieving': mongoose_1.Types.ObjectId(templateId),
                                },
                            ],
                        });
                        break;
                    default:
                        break;
                }
                yield ticket.save();
                res.send(new ResponseResult_1.default({
                    message: 'Successfully drafted!',
                    data: yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(ticketId),
                }));
            }
        });
    }
    /**
     * Generate PDF from relieving template settings to send via mail
     */
    generatePDF(html, settings, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch({
                headless: true,
                args: ['--disable-web-security'],
            });
            const page = yield browser.newPage();
            yield page.setContent(html, { waitUntil: 'networkidle0' });
            yield page.evaluate((settings, to) => {
                settings.map((item, index) => {
                    const answer = (to, content) => {
                        switch (to) {
                            case 'EMPLOYEE':
                                return content.employeeAnswers;
                            case 'HR':
                                return content.defaultAnswers;
                            default:
                                break;
                        }
                        return [];
                    };
                    let div = document.createElement('div');
                    (div.innerHTML = `<b style="margin: 12px 12px 12px 0">${index +
                        1}. ${item.question}</b><br/>
             ${item.answerType === 'FIELD'
                        ? `<p>${answer(to, item)[0] ? answer(to, item)[0] : ''}</p>`
                        : `<ul>${answer(to, item)
                            .map((a) => `<li>${a ? a : ''}</li>`)
                            .join('')}</ul>`}`),
                        document.body.appendChild(div);
                });
            }, settings, to);
            function imagesHaveLoaded() {
                return Array.from(document.images).every(i => i.complete);
            }
            yield page.waitForFunction(imagesHaveLoaded, { timeout: 30000 });
            const folder = UploadService_1.default.createFilePath(path_1.default.join(__dirname, '../store/pdfs'));
            const fileName = [v4_1.default(), 'pdf'].join('.');
            const filePath = [folder, fileName].join('/');
            const buffer = yield page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true,
                margin: {
                    left: '72px',
                    top: '72px',
                    right: '50px',
                    bottom: '139px',
                },
            });
            const bodyHTML = yield page.evaluate(() => document.body.innerHTML);
            yield browser.close();
            return { bodyHTML, fileName, filePath, buffer };
        });
    }
    /**
     * Save to attachment mongoose Documents
     */
    upload(type, userId, content, title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content) {
                throw new AdvancedError_1.default({
                    content: {
                        kind: 'invalid',
                        message: 'Please provide your content',
                    },
                });
            }
            try {
                const attachment = yield Attachment_1.default.create({
                    name: [title, 'pdf'].join('.'),
                    category: type,
                    fileName: content.fileName,
                    path: content.filePath.replace(UPLOAD.path.root, ''),
                    type: 'application/pdf',
                    size: content.buffer.byteLength,
                    user: userId,
                });
                attachment.url = encodeURI(UploadService_1.default.getPublicUrl(attachment.category, attachment._id.toHexString(), attachment.name));
                yield attachment.save();
                return attachment;
            }
            catch (e) {
                return e;
            }
        });
    }
    withDraw(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { id, tenantId, company }, } = req;
            const currentUser = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                company,
                tenant: tenantId,
            }));
            const { employee: employeeId, location } = managePermission;
            const offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(id);
            if (!offBoarding) {
                throw new AdvancedError_1.default({
                    id: {
                        kind: 'not.found',
                        message: 'id not found',
                    },
                });
            }
            if (employeeId.toString() === offBoarding.employee.toString()) {
                if (offBoarding.status === 'ACCEPTED') {
                    if (offBoarding.relievingStatus === 'CLOSE-RECORDS') {
                        //ko cho withdraw
                        throw new AdvancedError_1.default({
                            relievingStatus: {
                                kind: 'close.records',
                                message: 'offBoarding was close',
                            },
                        });
                    }
                    else {
                        // +++++++++++++++++++++++++++++++++++++
                        // Send mail notification
                        const hrManagers = yield this.getHrManagerByLocation(location, tenantId);
                        const managerInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findById(offBoarding.manager);
                        const employeeInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ employee: employeeId });
                        const reasonForLeaving = offBoarding.reasonForLeaving;
                        let requesteeName = '';
                        // Notify requestee
                        if (employeeInfo) {
                            requesteeName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
                            const requesteeMailContent = `
              <p>You have withdrawn the resignation:</p>
              <p>${reasonForLeaving}</p><br/>
            `;
                            yield SendMail_1.sendNotificationOffboarding({
                                email: employeeInfo.workEmail,
                                fullName: requesteeName,
                            }, [], 'Offboarding withdraw notification to employee', requesteeMailContent);
                        }
                        // Notify HR Managers
                        if (hrManagers.length > 0) {
                            const hrManagerMailContent = `
            <p>${requesteeName} has withdrawn the resignation:</p>
              <p>${reasonForLeaving}</p><br/>
            `;
                            bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                                const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                                yield SendMail_1.sendNotificationOffboarding({
                                    email: hrManager.employee.generalInfo.workEmail,
                                    fullName: hrManagerName,
                                }, [], 'Offboarding withdraw notification to HR Manager', hrManagerMailContent);
                            }));
                        }
                        // Notify manager
                        if (managerInfo) {
                            const managerMailContent = `
            <p>${requesteeName} has withdrawn the resignation:</p>
            <p>${reasonForLeaving}</p><br/>
          `;
                            const managerName = `${managerInfo.firstName} ${managerInfo.lastName}`;
                            yield SendMail_1.sendNotificationOffboarding({
                                email: managerInfo.workEmail,
                                fullName: managerName,
                            }, [], 'Offboarding withdraw notification to Manager', managerMailContent);
                        }
                        // -------------------------------------
                        yield offBoarding.set({ withDrawStatus: 'IN-PROGRESS' }).save();
                    }
                }
                else {
                    yield offBoarding
                        .set({ status: 'WITHDRAW', withDrawStatus: 'ACCEPTED' })
                        .save();
                }
            }
            else {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'not.permission',
                        message: 'have not permission',
                    },
                });
            }
            res.send(new ResponseResult_1.default({
                message: 'Withdraw comment successfully.',
                data: offBoarding,
            }));
        });
    }
    withDrawApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, company, action = 'ACCEPTED', id }, } = req;
            const currentUser = req.user;
            const managePermission = (yield ManagePermission_1.default.findOne({
                userMap: currentUser._id,
                company,
                tenant: tenantId,
            }));
            const { employee: employeeId, location } = managePermission;
            const offBoarding = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findById(id);
            if (String(employeeId) !== String(offBoarding.manager)) {
                throw new AdvancedError_1.default({
                    permission: {
                        kind: 'not.permission',
                        message: 'have not permission',
                    },
                });
            }
            if (offBoarding.withDrawStatus === 'IN-PROGRESS') {
                if (action === 'ACCEPTED') {
                    yield offBoarding
                        .set({ withDrawStatus: 'ACCEPTED', status: 'WITHDRAW' })
                        .save();
                }
                else {
                    yield offBoarding.set({ withDrawStatus: '' }).save();
                }
                const hrManagers = yield this.getHrManagerByLocation(location, tenantId);
                const managerInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ employee: offBoarding.manager });
                if (!managerInfo) {
                    throw new AdvancedError_1.default({
                        OffBoardingRequest: {
                            kind: 'not.found',
                            message: 'No managers found!',
                        },
                    });
                }
                const employeeInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).findOne({ employee: offBoarding.employee });
                // Notify requestee
                let requesteeName = '';
                const managerName = `${managerInfo.firstName} ${managerInfo.lastName}`;
                const withdrawStatusStr = action === 'ACCEPTED' ? 'accepted' : 'rejected';
                if (employeeInfo) {
                    requesteeName = `${employeeInfo.firstName} ${employeeInfo.lastName}`;
                    const requesteeMailContent = `
            <p>Your offboard withdraw request has been ${withdrawStatusStr}</p>
          `;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: employeeInfo.workEmail,
                        fullName: requesteeName,
                    }, [], 'Offboarding withdraw notification to employee', requesteeMailContent);
                }
                // Notify HR Managers
                if (hrManagers) {
                    const hrManagerMailContent = `
          <p>${requesteeName}'s withdraw request has been ${withdrawStatusStr}</p>
        `;
                    bluebird_1.default.map(hrManagers, (hrManager) => __awaiter(this, void 0, void 0, function* () {
                        const hrManagerName = `${hrManager.employee.generalInfo.firstName} ${hrManager.employee.generalInfo.lastName}`;
                        yield SendMail_1.sendNotificationOffboarding({
                            email: hrManager.employee.generalInfo.workEmail,
                            fullName: hrManagerName,
                        }, [], 'Offboarding withdraw notification to HR Manager', hrManagerMailContent);
                    }));
                }
                // Notify manager
                if (managerInfo) {
                    const managerMailContent = `
        <p>${requesteeName}'s withdraw request has been ${withdrawStatusStr}</p>
      `;
                    yield SendMail_1.sendNotificationOffboarding({
                        email: managerInfo.workEmail,
                        fullName: managerName,
                    }, [], 'Offboarding withdraw notification to Manager', managerMailContent);
                }
            }
            res.send(new ResponseResult_1.default({
                message: 'Withdraw comment successfully.',
                data: offBoarding,
            }));
        });
    }
    searchDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tenantId = req.header('tenantId');
            const { body: { fromDate = '', toDate = '', status = [] }, } = req;
            let aggregates = [];
            const match = {
                $match: {
                    $and: [],
                },
            };
            if (status.length > 0) {
                match.$match.$and.push({ status: { $in: status } });
            }
            if (fromDate) {
                match.$match.$and.push({ createdAt: { $gte: new Date(fromDate) } });
            }
            if (toDate) {
                // increase 1 day
                let toDate2 = new Date(toDate);
                toDate2.setDate(toDate2.getDate() + 1);
                match.$match.$and.push({
                    createdAt: { $lte: toDate2 },
                });
            }
            const lookup = [
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department',
                    },
                },
                {
                    $unwind: {
                        path: '$department',
                        preserveNullAndEmptyArrays: true,
                    },
                },
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
                        from: 'locations',
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'candidates',
                        localField: 'employee',
                        foreignField: 'employee',
                        as: 'candidate',
                    },
                },
                {
                    $unwind: {
                        path: '$candidate',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'generalinfos',
                        localField: 'employee',
                        foreignField: 'employee',
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
            const project = {
                $project: {
                    reasonForLeaving: 1,
                    createdAt: 1,
                    lastWorkingDate: 1,
                    status: 1,
                    department: {
                        _id: 1,
                        name: 1,
                    },
                    location: {
                        _id: 1,
                        name: 1,
                    },
                    employee: {
                        generalInfo: {
                            _id: 1,
                            legalName: 1,
                            employeeId: 1,
                        },
                    },
                    candidate: {
                        ticketID: 1,
                    },
                },
            };
            const LIMIT = 10;
            const limit = {
                $limit: LIMIT,
            };
            aggregates = [...lookup];
            if (match.$match.$and.length > 0) {
                aggregates.push(match);
            }
            aggregates = [...aggregates, project, limit];
            const result = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).aggregate(aggregates);
            res.send(new ResponseResult_1.default({
                message: 'List requests detail successfully',
                data: result,
            }));
        });
    }
    removeOffBoardingPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { tenantId, offboardRequest = '', type = '', templateRelieving = '', packageId = '', }, } = req;
            const PACKAGE_TYPE = {
                EXIT_PACKAGE: 'exitPackage',
                CLOSING_PACKAGE: 'closingPackage',
                EXIT_INTERVIEW_FEEDBACK: 'exitInterviewFeedbacks',
            };
            const { EXIT_PACKAGE, CLOSING_PACKAGE, EXIT_INTERVIEW_FEEDBACK, } = PACKAGE_TYPE;
            if (!offboardRequest) {
                throw new AdvancedError_1.default({
                    offboardingRequest: {
                        kind: 'request.invalid',
                        message: 'Missing offboardRequest id in body',
                    },
                });
            }
            if (![EXIT_PACKAGE, CLOSING_PACKAGE, EXIT_INTERVIEW_FEEDBACK].includes(type)) {
                throw new AdvancedError_1.default({
                    offBoardingRequest: {
                        kind: 'request.invalid',
                        message: 'Missing type in body',
                    },
                });
            }
            let isWaitList;
            if (templateRelieving) {
                isWaitList = true;
            }
            else {
                isWaitList = false;
            }
            let item;
            let pull = {
                $pull: {},
            };
            if (type === EXIT_PACKAGE) {
                if (isWaitList) {
                    pull.$pull = {
                        'exitPackage.waitList': { templateRelieving: templateRelieving },
                    };
                }
                else {
                    pull.$pull = {
                        'exitPackage.packages': packageId,
                    };
                }
            }
            if (type === CLOSING_PACKAGE) {
                if (isWaitList) {
                    pull.$pull = {
                        'closingPackage.waitList': { templateRelieving: templateRelieving },
                    };
                }
                else {
                    pull.$pull = {
                        'closingPackage.packages': packageId,
                    };
                }
            }
            if (type === EXIT_INTERVIEW_FEEDBACK) {
                if (isWaitList) {
                    pull.$pull = {
                        'exitInterviewFeedbacks.waitList': {
                            templateRelieving: templateRelieving,
                        },
                    };
                }
                else {
                    pull.$pull = {
                        'exitInterviewFeedbacks.packages': packageId,
                    };
                }
            }
            if (Object.keys(pull.$pull).length > 0) {
                item = yield OffBoardingRequestTenant_1.default.getInstance(tenantId).findOneAndUpdate({
                    _id: offboardRequest,
                }, pull);
            }
            res.send(new ResponseResult_1.default({
                message: 'Remove package successfully',
                data: {
                    item,
                },
            }));
        });
    }
    // protected async getHrManagerByLocation() {
    getHrManagerByLocation(location, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            let aggregate = [];
            const match = [
                {
                    $match: {
                        $and: [
                            {
                                roles: {
                                    $in: ['HR-MANAGER'],
                                },
                            },
                            {
                                location: location,
                            },
                        ],
                    },
                },
            ];
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
                        from: `${tenantId}_locations`,
                        localField: 'location',
                        foreignField: '_id',
                        as: 'location',
                    },
                },
                {
                    $unwind: {
                        path: '$location',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: `${tenantId}_departments`,
                        localField: 'employee.department',
                        foreignField: '_id',
                        as: 'employee.department',
                    },
                },
                {
                    $unwind: {
                        path: '$employee.department',
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
            const project = [
                {
                    $project: {
                        employee: {
                            _id: 1,
                            department: {
                                name: 1,
                            },
                            generalInfo: {
                                firstName: 1,
                                lastName: 1,
                                workEmail: 1,
                                avatar: 1,
                            },
                        },
                    },
                },
            ];
            aggregate = [...match, ...lookup, ...project];
            const hrManagers = yield ManagePermission_1.default.aggregate(aggregate);
            return hrManagers;
        });
    }
    convertWorkEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tenantId, from, to } = req.body;
            if (!from || !to) {
                throw new AdvancedError_1.default({
                    offboardingrequest: {
                        kind: 'required',
                        message: `'from' and 'to' must be provided`,
                    },
                });
            }
            const allInfo = yield GeneralInfoTenant_1.default.getInstance(tenantId).find({});
            let numberAffected = 0;
            bluebird_1.default.map(allInfo, (item) => __awaiter(this, void 0, void 0, function* () {
                const dataInfo = Object.assign({}, item.toObject());
                if (dataInfo.workEmail) {
                    const newEmail = dataInfo.workEmail.replace(from, to);
                    yield GeneralInfoTenant_1.default.getInstance(tenantId).updateOne({ _id: dataInfo._id }, Object.assign(Object.assign({}, dataInfo), { workEmail: newEmail }));
                    const user = yield UserTenant_1.default.getInstance(tenantId).findOne({
                        employee: dataInfo.employee,
                    });
                    if (user) {
                        const dataUser = user.toObject();
                        const newUserEmail = dataUser.email.replace(from, to);
                        yield user.update({ email: newUserEmail });
                        yield user.save();
                    }
                    numberAffected++;
                }
            }));
            const msg = `Convert mail from ${from} to ${to} successfully`;
            res.send(new ResponseResult_1.default({
                data: {
                    numberAffected,
                },
                message: msg,
            }));
        });
    }
}
exports.default = new OffBoardingRequestTenantController();
//# sourceMappingURL=OffBoardingRequestTenantController.js.map