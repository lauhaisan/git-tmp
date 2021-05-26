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
exports.documentCompanySchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.documentCompanySchemaDefinition = {
    key: { type: String },
    attachment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: {
            select: ' ',
        },
    },
    documentType: {
        type: String,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: ' ',
        },
    },
    //   displayName: { type: String },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
};
const documentCompanySchema = new mongoose_1.Schema(exports.documentCompanySchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
documentCompanySchema.plugin(mongoose_beautiful_unique_validation_1.default);
documentCompanySchema.plugin(mongoose_autopopulate_1.default);
// documentSchema.pre('insertMany', preInsert)
const DocumentCompany = mongoose_1.default.model('DocumentCompany', documentCompanySchema);
exports.default = DocumentCompany;
// function preInsert(next: any) {
// next()
// }
//# sourceMappingURL=DocumentCompany.js.map