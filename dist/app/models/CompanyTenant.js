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
const Country_1 = __importDefault(require("./Country"));
// import CountryTenant from './CountryTenant'
class CompanyTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            // BankAccTenant.instance = new BankAccTenant();
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
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
            website: {
                type: String,
            },
            phone: {
                type: String,
            },
            headQuarterAddress: {
                addressLine1: { type: String },
                addressLine2: { type: String },
                state: { type: String },
                country: {
                    type: String,
                    ref: Country_1.default,
                    autopopulate: {
                        select: 'name _id',
                    },
                },
                zipCode: { type: String },
            },
            legalAddress: {
                addressLine1: { type: String },
                addressLine2: { type: String },
                state: { type: String },
                country: {
                    type: String,
                    ref: Country_1.default,
                    autopopulate: {
                        select: 'name _id',
                    },
                },
                zipCode: { type: String },
            },
            country: {
                type: String,
                ref: Country_1.default,
                autopopulate: {
                    select: 'name _id',
                },
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
            hrContactName: { type: String },
            hrContactEmail: { type: String },
            hrContactPhone: { type: String },
            childOfCompany: { type: mongoose_1.Schema.Types.ObjectId },
            tenant: { type: String },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_companies'];
        // return mongoose.model<IBankAcc>(prefix + '_BankAcc', bankAccSchema)
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_companies', schema);
        }
        return modelObject;
    }
}
exports.default = CompanyTenant;
//# sourceMappingURL=CompanyTenant.js.map