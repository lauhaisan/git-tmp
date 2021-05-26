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
exports.documentSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.documentSchemaDefinition = {
    key: { type: String },
    attachment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: {
            select: ' ',
        },
    },
    displayName: { type: String },
    candidate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Candidate',
    },
    candidateKey: { type: String },
    candidateGroup: { type: String },
    employer: { type: String },
    employeeKey: { type: String },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    tenant: { type: String },
    employeeGroup: { type: String },
    parentEmployeeGroup: { type: String },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    candidateDocumentStatus: {
        type: String,
        enum: ['VERIFIED', 'RE-SUBMIT', 'INELIGIBLE', 'PENDING'],
        default: 'PENDING',
    },
    expiredDate: {
        type: Date,
    },
    shareDocument: [{ type: String }],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
};
const documentSchema = new mongoose_1.Schema(exports.documentSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
documentSchema.plugin(mongoose_beautiful_unique_validation_1.default);
documentSchema.plugin(mongoose_autopopulate_1.default);
// documentSchema.pre('insertMany', preInsert)
const Document = mongoose_1.default.model('Document', documentSchema);
exports.default = Document;
// function preInsert(next: any) {
// next()
// }
//# sourceMappingURL=Document.js.map