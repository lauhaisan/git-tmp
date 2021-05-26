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
// import CandidateTenant from './CandidateTenant'
const Country_1 = __importDefault(require("./Country"));
// import DocumentTenant from './DocumentTenant'
// import CandidateTenant from './CandidateTenant'
// import CountryTenant from './CountryTenant'
// import DocumentTenant from './DocumentTenant'
// import EmployeeTenant from './EmployeeTenant'
class PassportTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            passportNumber: { type: String, maxlength: 255 },
            passportIssuedCountry: {
                type: 'String',
                //ref: CountryTenant.getInstance(this.tenantId),
                ref: Country_1.default,
                required: true,
                autopopulate: {
                    select: 'id name',
                },
            },
            passportIssuedOn: { type: Date },
            passportValidTill: { type: Date },
            passportStatus: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
                default: 'ACTIVE',
            },
            candidate: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            document: {
                type: mongoose_1.Schema.Types.ObjectId,
                // ref: DocumentTenant.getInstance(this.tenantId),
                required: true,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_passport'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_passport', schema);
        }
        return modelObject;
    }
}
exports.default = PassportTenant;
//# sourceMappingURL=PassportTenant.js.map