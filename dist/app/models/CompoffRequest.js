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
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// const statusSchema = new Schema(
//   {
//     reviewerId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Employee',
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       default: TYPE_COMPOFF_REQUEST.statusType.inProgress,
//       // enum: ['IN-PROGRESS', 'PENDING', 'INQUIRY', 'REJECT', 'APPROVAL'],
//       enum: [...TYPE_COMPOFF_REQUEST.status, ...TYPE_COMPOFF_REQUEST.action],
//     },
//     message: String,
//     reviewDate: { type: Date },
//     position: String,
//     fullName: { type: String },
//     isForce: { type: Boolean },
//   },
//   { _id: false },
// )
const compoffRequestSchema = new mongoose_1.Schema({
    ticketID: {
        type: String,
        required: true,
        unique: true,
    },
    employee: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: '_id',
        },
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        autopopulate: { select: '_id name beginDate endDate type' },
    },
    duration: {
        from: {
            type: String,
        },
        to: {
            type: String,
        },
    },
    extraTime: [
        {
            date: {
                type: Date,
            },
            timeSpend: {
                type: Number,
            },
        },
    ],
    description: {
        type: String,
        required: true,
    },
    cc: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            autopopulate: {
                select: '_id name',
            },
        },
    ],
    status: {
        type: String,
        enum: [
            'IN-PROGRESS',
            'IN-PROGRESS-NEXT',
            'ON-HOLD',
            'REJECTED',
            'ACCEPTED',
            'DRAFTS',
            'DELETED',
        ],
        default: constant_1.TYPE_COMPOFF_REQUEST.statusType.inProgress,
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        autopopulate: { select: constant_1.MODEL_POPULATE.location },
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { select: constant_1.MODEL_POPULATE.company },
    },
    approvalFlow: {
        type: Object,
        required: true,
    },
    currentStep: { type: Number, default: 1 },
    manager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: '-createdAt -updatedAt -company -manager',
        },
    },
    onDate: {
        type: Date,
    },
    commentPM: {
        type: String,
    },
    commentCLA: {
        type: String,
    },
    totalHours: {
        type: Number,
    },
});
compoffRequestSchema.plugin(mongoose_beautiful_unique_validation_1.default);
const CompoffRequest = mongoose_1.default.model('CompoffRequest', compoffRequestSchema);
exports.default = CompoffRequest;
//# sourceMappingURL=CompoffRequest.js.map