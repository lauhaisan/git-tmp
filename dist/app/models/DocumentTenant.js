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
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import AttachmentTenant from './AttachmentTenant'
// import CandidateTenant from './CandidateTenant'
// import CompanyTenant from './CompanyTenant'
// import EmployeeTenant from './EmployeeTenant'
class DocumentTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            key: { type: String },
            attachment: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Attachment',
                autopopulate: {
                    select: 'id name url path category fileName type',
                },
            },
            displayName: { type: String },
            candidate: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            candidateKey: { type: String },
            candidateGroup: { type: String },
            employer: { type: String },
            employeeKey: { type: String },
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            // employeeGroup: { type: String },
            // parentEmployeeGroup: { type: String },
            category: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'CategoryChildren',
                autopopulate: {
                    select: '_id name order categoryParent',
                },
            },
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
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_documents'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_documents', schema);
        }
        else {
            modelObject.schema.add(schema);
        }
        return modelObject;
    }
}
exports.default = DocumentTenant;
//# sourceMappingURL=DocumentTenant.js.map