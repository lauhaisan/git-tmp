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
exports.CandidateSchemaDefinition = void 0;
const constant_1 = require("@/app/utils/constant");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.CandidateSchemaDefinition = {
    ticketID: {
        type: String,
        unique: true,
        required: true,
    },
    fullName: {
        type: String,
        default: null,
    },
    privateEmail: {
        type: String,
        default: null,
    },
    workEmail: {
        type: String,
        default: null,
    },
    previousExperience: String,
    workLocation: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        // required: true,
        autopopulate: {
            select: 'id name',
        },
        default: null,
    },
    position: {
        type: String,
        enum: ['EMPLOYEE', 'CONTINGENT-WORKER'],
        default: 'EMPLOYEE',
    },
    employeeType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'EmployeeType',
        // required: true,
        autopopulate: {
            select: 'id name',
        },
        default: null,
    },
    department: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        // required: true,
        autopopulate: {
            select: 'id name',
        },
        default: null,
    },
    title: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
        // required: true,
        autopopulate: {
            select: 'id name',
        },
        default: null,
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        // required: true,
        autopopulate: {
            select: 'id name',
        },
        default: null,
    },
    processStatus: {
        type: String,
        enum: [...constant_1.CANDIDATE.enum],
        default: 'DRAFT',
    },
    noticePeriod: {
        type: Number,
        default: null,
    },
    dateOfJoining: {
        type: Date,
        default: null,
    },
    reportingManager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        // required: true,
        autopopulate: {
            select: 'id generalInfo',
        },
        default: null,
    },
    compensationType: {
        type: String,
    },
    amountIn: {
        type: String,
        default: null,
    },
    timeOffPolicy: {
        type: String,
        default: null,
    },
    documentChecklistSetting: {
        type: Array,
        default: constant_1.DEFAULT_DOCUMENT_CHECKLIST,
    },
    candidateSignature: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: null,
    },
    finalOfferCandidateSignature: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: null,
    },
    hrManagerSignature: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: null,
    },
    hrSignature: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: null,
    },
    hiringAgreements: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
        default: null,
    },
    companyHandbook: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
        default: null,
    },
    benefits: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Benefit',
            autopopulate: {
                select: 'id type subType country name',
            },
            default: null,
        },
    ],
    comments: {
        type: String,
        default: null,
    },
    generatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        autopopulate: {
            select: 'id generalInfo',
        },
    },
    salaryStructure: {
        title: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Title',
            autopopulate: {
                select: 'id name',
            },
        },
        settings: [{ type: Object }],
    },
    offerLetter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
        default: null,
        autopopulate: {
            select: '',
        },
    },
    additionalTerms: {
        type: String,
    },
    offerExpirationDate: {
        type: Date,
    },
    schedule: {
        meetingOn: { type: Date },
        meetingAt: { type: String },
        meetingWith: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee' },
    },
    currentStep: { type: Number, default: 0 },
    candidateFinalSignature: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        default: null,
    },
    staticOfferLetter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: {
            select: ' ',
        },
    },
    additionalQuestions: [{ type: Object }],
    allowAccess: [{ type: String }],
    employeeId: { type: String },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
};
const candidateSchema = new mongoose_1.Schema(exports.CandidateSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
candidateSchema.plugin(mongoose_beautiful_unique_validation_1.default);
candidateSchema.plugin(mongoose_autopopulate_1.default);
const Candidate = mongoose_1.default.model('Candidate', candidateSchema);
exports.default = Candidate;
//# sourceMappingURL=Candidate.js.map