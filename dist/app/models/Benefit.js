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
exports.benefitSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.benefitSchemaDefinition = {
    type: { type: String },
    subType: { type: String },
    name: { type: String },
    year: { type: Number },
    document: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
        autopopulate: {
            select: 'url name id',
        },
        required: true,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    country: {
        type: String,
        default: 'GLOBAL',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
};
const benefitSchema = new mongoose_1.Schema(exports.benefitSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
benefitSchema.plugin(mongoose_beautiful_unique_validation_1.default);
benefitSchema.plugin(mongoose_autopopulate_1.default);
const Benefit = mongoose_1.default.model('Benefit', benefitSchema);
exports.default = Benefit;
//# sourceMappingURL=Benefit.js.map