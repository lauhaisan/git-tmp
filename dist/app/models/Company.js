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
exports.companySchemaDefinition = void 0;
const constant_1 = require("@/app/utils/constant");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.companySchemaDefinition = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dba: {
        type: String,
        required: true,
    },
    ein: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    headQuarterAddress: {
        address: { type: String },
        state: { type: String },
        country: {
            type: String,
        },
        zipCode: { type: String },
    },
    legalAddress: {
        address: { type: String },
        state: { type: String },
        country: {
            type: String,
        },
        zipCode: { type: String },
    },
    country: {
        type: String,
    },
    companySignature: [
        {
            name: { type: String },
            urlImage: { type: String },
            designation: { type: String },
        },
    ],
    contactEmail: {
        type: String,
        validationSchema: {
            email: {
                normalizeEmail: true,
                isEmail: {
                    errorMessage: ['isEmail', constant_1.VALIDATE_MSG.emailValid],
                },
            },
        },
    },
    website: {
        type: String,
    },
    logoUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    code: { type: String, unique: true },
    ownerFullName: { type: String },
    ownerEmail: { type: String },
    ownerPhone: { type: String },
    license: { type: String },
    paymentInfo: { type: String },
    isChildOf: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
};
const companySchema = new mongoose_1.default.Schema(exports.companySchemaDefinition, {
    versionKey: false,
    timestamps: true,
});
companySchema.plugin(mongoose_beautiful_unique_validation_1.default);
companySchema.plugin(mongoose_autopopulate_1.default);
const Company = mongoose_1.default.model('Company', companySchema);
exports.default = Company;
//# sourceMappingURL=Company.js.map