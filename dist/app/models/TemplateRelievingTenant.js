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
// import CompanyTenant from './CompanyTenant'
class TemplateRelievingTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            name: {
                type: String,
                required: [true, 'Name of the template is missing'],
            },
            packageType: {
                type: String,
                enum: ['EXIT-PACKAGE', 'EXIT-INTERVIEW-FEEDBACKS', 'CLOSING-PACKAGE'],
                required: true,
            },
            settings: [
                {
                    question: {
                        type: String,
                        required: [true, 'Question is missing'],
                    },
                    defaultAnswers: [{ type: String }],
                    employeeAnswers: [{ type: String }],
                    answerType: {
                        type: String,
                        enum: ['FIELD', 'BULLET'],
                    },
                },
            ],
            content: { type: String },
            templateType: {
                type: String,
                enum: ['DEFAULT', 'CUSTOM', 'DRAFT'],
                default: 'CUSTOM',
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: CompanyTenant.getInstance(this.tenantId),
                required: [true, 'Company is missing'],
            },
        });
        schema.plugin(mongoose_autopopulate_1.default);
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_templaterelievings'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_templaterelievings', schema);
        }
        return modelObject;
    }
}
exports.default = TemplateRelievingTenant;
//# sourceMappingURL=TemplateRelievingTenant.js.map