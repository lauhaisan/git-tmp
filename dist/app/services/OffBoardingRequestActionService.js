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
exports.OffBoardingRequestActionService = void 0;
const AdvancedError_1 = __importDefault(require("@/app/declares/AdvancedError"));
const Enums_1 = require("@/app/declares/Enums");
const OffBoardingRequest_1 = __importDefault(require("@/app/models/OffBoardingRequest"));
const OffBoardingRequestComment_1 = __importDefault(require("@/app/models/OffBoardingRequestComment"));
const User_1 = __importDefault(require("@/app/models/User"));
const logger_1 = __importDefault(require("@/app/utils/logger"));
const lodash_1 = require("lodash");
const ApprovalFlowGroup_1 = __importDefault(require("../models/ApprovalFlowGroup"));
const constant_1 = require("../utils/constant");
const FcmService_1 = require("./FcmService");
class OffBoardingRequestActionService {
    constructor(reID, reviewer, data) {
        // public approve = async () => {
        this.accepted = () => __awaiter(this, void 0, void 0, function* () {
            const { report, creator, attachData, reviewer } = this;
            const { approvalStep = 0, approvalFlow = {} } = report;
            const approvalHistory = report.approvalHistory;
            this.action = constant_1.TYPE_TICKET_REQUEST.statusType.accepted.toLowerCase();
            // if (reviewer.appRole === 'FINANCE') {
            let approvalHistoryItem = {
                email: reviewer.email,
                reviewerId: reviewer.id,
                fullName: reviewer.fullName,
                status: constant_1.TYPE_TICKET_REQUEST.statusType.accepted,
                reviewDate: new Date(),
            };
            const isNextStepManager = report.approvalStep !== 0
                ? lodash_1.find(report.approvalFlowData.nodes[report.approvalStep].data.members, (obj) => {
                    return obj == reviewer.id;
                })
                : true;
            // const nextStepManager: any = find(
            //   report.approvalFlowData.nodes[report.approvalStep].data.members,
            //   (obj: any) => {
            //     return obj.id === reviewer.id
            //   },
            // )
            if (reviewer.roles.includes('FINANCE') || isNextStepManager) {
                /* Finance approve */
                approvalHistory.push(Object.assign(Object.assign({}, approvalHistoryItem), { isForce: yield this.isForcedApprove({ report, reviewer }) }));
            }
            else {
                /* Manager approve */
                // Validate the approval node:
                if (lodash_1.get(approvalFlow, `nodes.${approvalStep}.type`) !== 'none') {
                    throw new AdvancedError_1.default({
                        review: {
                            kind: 'not.permission',
                            message: `You don't have permission`,
                            reportCode: report.code,
                        },
                    });
                }
                approvalHistory.push(approvalHistoryItem);
            }
            // Update status
            if (this.isLastApprovalNode({ report })) {
                report.status = constant_1.TYPE_TICKET_REQUEST.statusType.completed;
                report.nodeStep = constant_1.TYPE_TICKET_REQUEST.statusType.completed;
            }
            else {
                report.nodeStep = lodash_1.get(approvalFlow, `nodes.${approvalStep + 1}.value`);
            }
            // Update approvalHistory
            report.approvalHistory = approvalHistory;
            // Update approvalStep
            report.approvalStep = approvalStep + 1;
            // Create a comment
            if (lodash_1.get(attachData, 'content')) {
                const { comments = new Array() } = report;
                const comment = yield OffBoardingRequestComment_1.default.create({
                    content: attachData.content,
                    offBoardingRequest: report.id,
                    user: reviewer.id,
                    company: reviewer.employee.company,
                    location: reviewer.employee.location,
                });
                comments.push(comment);
                this.extra = comment.id;
            }
            this.report = yield report.save();
            // Send mail at current node
            this.mailAfterReviewReport({
                reviewer,
                creator,
                report,
                msToCreator: 'OffBoarding Request was approved by manager.',
                msToManager: 'You approved a request.',
            });
            // Send mail to next node
            if (report.status === constant_1.TYPE_TICKET_REQUEST.statusType.inProgress) {
                const node = lodash_1.get(report, `approvalFlow.nodes.${report.approvalStep}`);
                const mamagers = node.type === 'ApprovalFlowGroup' ? node.data.members : [report.manager];
                // Send mail
                if (mamagers && mamagers[0]) {
                    lodash_1.forEach(mamagers, () => {
                        // notifyApprovalMail(
                        //   { email: m.email, fullName: m.fullName },
                        //   [],
                        //   report,
                        // ).catch(e => logger.warn(e))
                        // sendNotification({
                        //   fcmTokens: [m.fcmToken],
                        //   title: 'Report',
                        //   body: `You received a report from ${creator.fullName}`,
                        //   data: { id: report.id },
                        // }).catch(error => logger.warn(error))
                    });
                }
            }
        });
        this.rejected = () => __awaiter(this, void 0, void 0, function* () {
            const { report, creator, attachData, reviewer } = this;
            const { approvalStep, approvalFlow = {} } = report;
            const approvalHistory = report.approvalHistory;
            this.action = constant_1.TYPE_TICKET_REQUEST.statusType.rejected.toLowerCase();
            let approvalHistoryItem = {
                email: reviewer.email,
                reviewerId: reviewer.id,
                fullName: reviewer.fullName,
                status: constant_1.TYPE_TICKET_REQUEST.statusType.rejected,
                reviewDate: new Date(),
            };
            const isNextStepManager = report.approvalStep !== 0
                ? lodash_1.find(report.approvalFlowData.nodes[report.approvalStep].data.members, (obj) => {
                    return obj == reviewer.id;
                })
                : true;
            // if (reviewer.appRole === 'FINANCE') {
            if (reviewer.roles.includes('FINANCE') || isNextStepManager) {
                /* Finance approve */
                approvalHistory.push(Object.assign(Object.assign({}, approvalHistoryItem), { isForce: yield this.isForcedApprove({ report, reviewer }) }));
            }
            else {
                /* Manager approve */
                // Validate the approval node:
                if (lodash_1.get(approvalFlow, `nodes.${approvalStep}.type`) !== 'none') {
                    throw new AdvancedError_1.default({
                        review: {
                            kind: 'not.permission',
                            message: `You don't have permission`,
                            reportCode: report.code,
                        },
                    });
                }
            }
            // Update status
            report.status = constant_1.TYPE_TICKET_REQUEST.statusType.rejected;
            report.nodeStep = constant_1.TYPE_TICKET_REQUEST.statusType.rejected;
            // Update approvalHistory
            report.approvalHistory = approvalHistory;
            // Update approvalStep
            report.approvalStep = approvalStep + 1;
            // Create a comment
            if (lodash_1.get(attachData, 'content')) {
                const { comments = new Array() } = report;
                const comment = yield OffBoardingRequestComment_1.default.create({
                    content: attachData.content,
                    offBoardingRequest: report._id,
                    user: reviewer.id,
                    company: reviewer.employee.company,
                    location: reviewer.employee.location,
                });
                comments.push(comment);
                this.extra = comment._id;
            }
            this.report = yield report.save();
            // Send mail at current node
            this.mailAfterReviewReport({
                reviewer,
                creator,
                report,
                msToManager: 'You rejected a report.',
                msToCreator: 'Report was rejected by manager.',
            });
        });
        this.onHold = () => __awaiter(this, void 0, void 0, function* () {
            const { report, attachData, reviewer } = this;
            const { approvalStep, approvalFlow = {} } = report;
            const approvalHistory = report.approvalHistory;
            this.action = constant_1.TYPE_TICKET_REQUEST.statusType.onHold.toLowerCase();
            let approvalHistoryItem = {
                email: reviewer.email,
                reviewerId: reviewer.id,
                fullName: reviewer.fullName,
                status: constant_1.TYPE_TICKET_REQUEST.statusType.onHold,
                reviewDate: new Date(),
            };
            const isNextStepManager = report.approvalStep !== 0
                ? lodash_1.find(report.approvalFlowData.nodes[report.approvalStep].data.members, (obj) => {
                    return obj == reviewer.id;
                })
                : true;
            // if (reviewer.appRole === 'FINANCE') {
            if (reviewer.roles.includes('FINANCE') || isNextStepManager) {
                /* Finance approve */
                approvalHistory.push(Object.assign(Object.assign({}, approvalHistoryItem), { isForce: yield this.isForcedApprove({ report, reviewer }) }));
            }
            else {
                /* Manager approve */
                // Validate the approval node:
                if (lodash_1.get(approvalFlow, `nodes.${approvalStep}.type`) !== 'none') {
                    throw new AdvancedError_1.default({
                        review: {
                            kind: 'not.permission',
                            message: `You don't have permission`,
                            reportCode: report.code,
                        },
                    });
                }
            }
            // Update status
            report.status = constant_1.TYPE_TICKET_REQUEST.statusType.onHold;
            report.nodeStep = lodash_1.get(approvalFlow, `nodes.0.value`);
            // Update approvalHistory
            report.approvalHistory = approvalHistory;
            // Update approvalStep
            report.approvalStep = approvalStep + 1;
            // Create a comment
            if (lodash_1.get(attachData, 'content')) {
                const { comments = new Array() } = report;
                const comment = yield OffBoardingRequestComment_1.default.create({
                    content: attachData.content,
                    offBoardingRequest: report._id,
                    user: reviewer.id,
                    company: reviewer.employee.company,
                    location: reviewer.employee.location,
                });
                comments.push(comment);
                this.extra = comment._id;
            }
            this.report = yield report.save();
            // // Send mail at current node
            // this.mailAfterReviewReport({
            //   reviewer,
            //   creator,
            //   report,
            //   msToManager: 'You inquiried a report.',
            //   msToCreator: 'Report was inquiried information by manager.',
            // })
        });
        this.reID = reID;
        this.reviewer = reviewer;
        this.action = data.action;
        this.attachData = data;
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { reviewer } = this;
            const item = yield OffBoardingRequest_1.default.findById(this.reID).exec();
            if (!item) {
                throw new AdvancedError_1.default({
                    review: {
                        kind: 'not.found',
                        message: 'OffBoardingRequest not found!',
                    },
                });
            }
            const { user } = item;
            if (Enums_1.CLOSED_REIMBURSEMENT_STATUS.indexOf(item.status) > -1) {
                throw new AdvancedError_1.default({
                    review: {
                        kind: 'closed',
                        message: 'The OffBoardingRequest had been closed',
                        reportCode: item.code,
                    },
                });
            }
            // if (item.status !== 'PENDING') {
            if (item.status !== constant_1.TYPE_TICKET_REQUEST.statusType.inProgress) {
                throw new AdvancedError_1.default({
                    review: {
                        kind: 'not.pending',
                        message: `The OffBoardingRequest hadn't been assigned`,
                        reportCode: item.code,
                    },
                });
            }
            const nextStepManager = item.approvalStep !== 0
                ? lodash_1.find(item.approvalFlowData.nodes[item.approvalStep].data.members, (obj) => {
                    return obj == reviewer.id;
                })
                : true;
            if (
            // reviewer.appRole !== 'FINANCE' &&
            !reviewer.roles.includes('FINANCE') &&
                item.user.employee.manager &&
                item.user.employee.manager.id !== reviewer.employee.id &&
                !nextStepManager) {
                throw new AdvancedError_1.default({
                    review: {
                        kind: 'not.permission',
                        message: `You don't have permission`,
                        reportCode: item.code,
                    },
                });
            }
            // }
            const creator = yield User_1.default.findById(user)
                .select('location email fullName lastName firstName fcmToken')
                .exec();
            if (!creator) {
                throw new AdvancedError_1.default({
                    review: {
                        path: 'user',
                        kind: 'not.found',
                        message: 'Creator not found!',
                        reportCode: item.code,
                    },
                });
            }
            // if (creator.id === reviewer.id) {
            //   throw new AdvancedError({
            //     review: {
            //       path: 'user',
            //       kind: 'not.permission',
            //       message: VALIDATE_MSG.reportNotToCreator,
            //       reportCode: report.code,
            //     },
            //   })
            // }
            const { employee: { location }, } = creator;
            if (!location) {
                throw new AdvancedError_1.default({
                    review: {
                        path: 'location',
                        kind: 'not.found',
                        message: 'Location not found!',
                        reportCode: item.code,
                    },
                });
            }
            if (!location.status || location.status !== 'ACTIVE') {
                throw new AdvancedError_1.default({
                    review: {
                        path: 'location',
                        kind: 'inactive',
                        message: 'Location is inactive!',
                        reportCode: item.code,
                    },
                });
            }
            Object.assign(this, {
                status: item.status,
                report: item,
                creator,
                reviewer,
                action: this.action.replace(/_\w/gi, ([, firstWord]) => firstWord.toUpperCase()),
            });
            return this;
        });
    }
    /* Internal Function */
    isLastApprovalNode({ report = {} } = {}) {
        const { approvalFlow = {}, approvalStep } = report;
        return approvalStep === lodash_1.get(approvalFlow, 'nodes', []).length - 1;
    }
    isForcedApprove({ report = {}, reviewer } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let isForce = true;
            const { approvalFlow = {}, approvalStep } = report;
            const nodeValue = lodash_1.get(approvalFlow, `nodes.${approvalStep}.value`, '');
            const nodeType = lodash_1.get(approvalFlow, `nodes.${approvalStep}.type`, '');
            if (nodeType === 'ApprovalFlowGroup') {
                const member = yield ApprovalFlowGroup_1.default.find({
                    members: reviewer.id,
                    _id: nodeValue,
                });
                isForce = !member;
            }
            else {
                isForce = !(reviewer.employee.id === report.user.employee.manager.id); // reviewer is manager
            }
            return isForce;
        });
    }
    mailAfterReviewReport({ reviewer = {}, creator = {}, report = {}, msToManager = '', msToCreator = '', } = {}) {
        // Send mail at current node
        // sendApprovalMailToCreator(
        //   { email: creator.email, fullName: creator.fullName },
        //   [{ email: reviewer.email, fullName: reviewer.fullName }],
        //   report,
        //   this.action,
        // ).catch(e => logger.warn(e))
        FcmService_1.sendNotification({
            fcmTokens: [creator.fcmToken],
            title: 'Report',
            body: msToCreator,
            data: { id: report.id },
        }).catch(error => logger_1.default.warn(error));
        FcmService_1.sendNotification({
            fcmTokens: [reviewer.fcmToken],
            title: 'Report',
            body: msToManager,
            data: { id: report.id },
        }).catch(error => logger_1.default.warn(error));
    }
}
exports.OffBoardingRequestActionService = OffBoardingRequestActionService;
//# sourceMappingURL=OffBoardingRequestActionService.js.map