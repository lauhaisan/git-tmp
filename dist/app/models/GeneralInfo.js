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
exports.generalInfoSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import { EMPLOYEE } from '@/app/utils/constant'
const addressSchemaDefinition = {
    address: String,
    country: {
        type: String,
        ref: 'Country',
        autopopulate: {
            select: 'name _id',
        },
    },
    state: { type: String },
    zipCode: { type: String },
};
const addressSchema = new mongoose_1.Schema(addressSchemaDefinition, { _id: false });
const emergencyContactDetailsSchemaDefinition = {
    emergencyContact: {
        type: String,
        default: '',
    },
    emergencyPersonName: {
        type: String,
        default: '',
    },
    emergencyRelation: {
        type: String,
        // enum: [...EMPLOYEE.relationshipEnum],
        default: '',
    },
};
const emergencyContactDetailsSchema = new mongoose_1.Schema(emergencyContactDetailsSchemaDefinition, { _id: false });
exports.generalInfoSchemaDefinition = {
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    legalName: {
        type: String,
        default: 'DefaultName',
    },
    firstName: {
        type: String,
        default: 'DefaultName',
    },
    lastName: {
        type: String,
        default: '',
    },
    DOB: {
        type: Date,
    },
    legalGender: {
        type: String,
        default: '',
    },
    workEmail: {
        type: String,
        default: '',
    },
    workNumber: {
        type: String,
        default: '',
    },
    adhaarCardNumber: {
        type: String,
        default: '',
    },
    adhaarCardDocument: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Document',
    },
    uanNumber: {
        type: String,
        default: '',
    },
    linkedIn: {
        type: String,
        default: '',
    },
    personalNumber: {
        type: String,
        default: '',
    },
    personalEmail: {
        type: String,
        default: '',
    },
    isShowPersonalNumber: {
        type: Boolean,
        default: true,
    },
    isShowPersonalEmail: {
        type: Boolean,
        default: true,
    },
    emergencyContactDetails: [emergencyContactDetailsSchema],
    Blood: {
        type: String,
        default: 'O',
    },
    maritalStatus: {
        type: String,
        default: '',
    },
    passportNo: {
        type: String,
        default: '',
    },
    passportIssueCountry: {
        type: String,
        default: '',
    },
    passportIssueOn: {
        type: String,
        default: '',
    },
    passportValidDate: {
        type: String,
    },
    residentAddress: addressSchema,
    currentAddress: addressSchema,
    preJobTitle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
    },
    preCompany: {
        type: String,
        default: '',
    },
    pastExp: {
        type: Number,
        default: 0,
    },
    totalExp: {
        type: Number,
        default: 0,
    },
    qualification: {
        type: String,
        default: '',
    },
    certification: [
        {
            type: Object,
        },
    ],
    skills: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'SkillType',
            autopopulate: {
                select: 'name id',
            },
        },
    ],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    avatar: {
        type: String,
        default: '',
    },
    employeeId: {
        type: String,
        default: '',
    },
    bioInfo: {
        type: String,
    },
};
const generalInfoSchema = new mongoose_1.Schema(exports.generalInfoSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
generalInfoSchema.plugin(mongoose_beautiful_unique_validation_1.default);
generalInfoSchema.plugin(mongoose_autopopulate_1.default);
generalInfoSchema.virtual('fullName').get(function () {
    const { firstName } = this;
    let { lastName } = this;
    if (lastName === firstName)
        lastName = undefined;
    return [firstName, lastName].filter(v => !!v).join(' ');
});
const GeneralInfo = mongoose_1.default.model('GeneralInfo', generalInfoSchema);
exports.default = GeneralInfo;
//# sourceMappingURL=GeneralInfo.js.map