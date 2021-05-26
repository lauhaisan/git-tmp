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
exports.visaSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.visaSchemaDefinition = {
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    visaNumber: { type: String, maxlength: 255 },
    visaIssuedCountry: {
        type: String,
        ref: 'Country',
        required: true,
        autopopulate: {
            select: 'id name flag',
        },
    },
    visaType: [{ type: String }],
    visaEntryType: { type: String },
    visaIssuedOn: { type: Date },
    visaValidTill: { type: Date },
    visaStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    candidate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Candidate',
    },
    document: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
        autopopulate: {
            select: 'attachment',
        },
    },
};
const visaSchema = new mongoose_1.Schema(exports.visaSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
visaSchema.plugin(mongoose_beautiful_unique_validation_1.default);
visaSchema.plugin(mongoose_autopopulate_1.default);
const Visa = mongoose_1.default.model('Visa', visaSchema);
exports.default = Visa;
//# sourceMappingURL=Visa.js.map