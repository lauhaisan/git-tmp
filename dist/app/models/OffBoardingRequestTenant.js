"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("@/app/utils/constant");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import ApprovalFlowTenant from './ApprovalFlowTenant'
// import CompanyTenant from './CompanyTenant'
// import DepartmentTenant from './DepartmentTenant'
// import DocumentTenant from './DocumentTenant'
// import EmployeeTenant from './EmployeeTenant'
// import LocationTenant from './LocationTenant'
// import ProjectTenant from './ProjectTenant'
// import TemplateRelievingTenant from './TemplateRelievingTenant'
class OffBoardingRequestTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const statusSchema = new mongoose_1.Schema({
            reviewerId: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            email: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                default: constant_1.TYPE_TICKET_REQUEST.statusType.inProgress,
                // enum: ['IN-PROGRESS', 'PENDING', 'INQUIRY', 'REJECT', 'APPROVAL'],
                enum: [...constant_1.TYPE_TICKET_REQUEST.status, ...constant_1.TYPE_TICKET_REQUEST.action],
            },
            message: String,
            reviewDate: { type: Date },
            position: String,
            fullName: { type: String },
            isForce: { type: Boolean },
        }, { _id: false });
        const schema = new mongoose_1.Schema({
            ticketID: {
                type: String,
                required: true,
                unique: true,
            },
            name: {
                type: String,
                default: '',
            },
            reasonForLeaving: {
                type: String,
                default: '',
            },
            requestDate: {
                type: Date,
                default: Date.now(),
            },
            lastWorkingDate: {
                type: Date,
            },
            requestLastDate: {
                type: Date,
            },
            commentRequestLastDate: {
                type: String,
            },
            statusLastDate: {
                type: String,
                default: 'ACCEPTED',
                enum: ['ACCEPTED', 'REJECTED', 'REQUESTED'],
            },
            code: {
                type: String,
                default: '',
            },
            status: {
                type: String,
                // enum: [...TYPE_TICKET_REQUEST.status, ...TYPE_TICKET_REQUEST.action],
                default: constant_1.TYPE_TICKET_REQUEST.statusType.inProgress,
            },
            reasonPutOnHold: { type: String },
            relievingStatus: {
                type: String,
                enum: ['IN-QUEUES', 'CLOSE-RECORDS', ''],
                default: '',
            },
            withDrawStatus: {
                type: String,
                enum: ['IN-PROGRESS', 'ACCEPTED', 'REJECTED', ''],
                default: '',
            },
            approvalFlow: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            approvalFlowData: { type: Object },
            approvalHistory: [{ type: statusSchema }],
            approvalInquiryHistory: [{ type: statusSchema }],
            approvalStep: { type: Number, default: 0 },
            nodeStep: { type: Number, default: 1 },
            manager: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: EmployeeTenant.getInstance(this.tenantId),
                // type: String,
                ref: 'User',
            },
            employee: {
                type: mongoose_1.default.Types.ObjectId,
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            location: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            department: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            project: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            canBeRehired: { type: Boolean, default: false },
            exitPackage: {
                isSent: { type: Boolean, default: false },
                packages: [
                    {
                        type: mongoose_1.Schema.Types.ObjectId,
                    },
                ],
                waitList: [
                    {
                        _id: false,
                        packageName: {
                            type: String,
                        },
                        settings: [
                            {
                                _id: false,
                                question: String,
                                defaultAnswers: [String],
                                employeeAnswers: [String],
                                answerType: String,
                            },
                        ],
                        templateRelieving: {
                            type: mongoose_1.Schema.Types.ObjectId,
                        },
                    },
                ],
            },
            exitInterviewFeedbacks: {
                isSent: { type: Boolean, default: false },
                packages: [
                    {
                        type: mongoose_1.Schema.Types.ObjectId,
                    },
                ],
                waitList: [
                    {
                        _id: false,
                        packageName: {
                            type: String,
                        },
                        settings: [
                            {
                                _id: false,
                                question: String,
                                defaultAnswers: [String],
                                employeeAnswers: [String],
                                answerType: String,
                            },
                        ],
                        templateRelieving: {
                            type: mongoose_1.Schema.Types.ObjectId,
                        },
                    },
                ],
            },
            closingPackage: {
                isSent: { type: Boolean, default: false },
                toEmail: String,
                packages: [
                    {
                        type: mongoose_1.Schema.Types.ObjectId,
                    },
                ],
                waitList: [
                    {
                        _id: false,
                        packageName: {
                            type: String,
                        },
                        settings: [
                            {
                                _id: false,
                                question: String,
                                defaultAnswers: [String],
                                employeeAnswers: [String],
                                answerType: String,
                            },
                        ],
                        templateRelieving: {
                            type: mongoose_1.Schema.Types.ObjectId,
                        },
                    },
                ],
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_offboardingrequest'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_offboardingrequest', schema);
        }
        return modelObject;
    }
}
exports.default = OffBoardingRequestTenant;
//# sourceMappingURL=OffBoardingRequestTenant.js.map