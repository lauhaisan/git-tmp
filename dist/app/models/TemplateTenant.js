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
// import EmployeeTenant from './EmployeeTenant'
class TemplateTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            title: {
                type: String,
                required: [true, 'Template title is required'],
            },
            type: {
                type: String,
                required: [true, 'The type of template is required'],
            },
            default: {
                type: Boolean,
                default: false,
            },
            htmlContent: {
                type: String,
                required: [
                    true,
                    'Template is missing HTML: PDF content cannot be changed',
                ],
            },
            attachment: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Attachment',
                autopopulate: {
                    select: 'id name url path category fileName type',
                },
                required: [true, 'Associated PDF is missing'],
            },
            settings: {
                type: [
                    {
                        _id: false,
                        key: String,
                        description: String,
                        value: String,
                        isEdited: {
                            type: Boolean,
                            default: true,
                        },
                    },
                ],
                required: true,
            },
            fullname: {
                type: String,
            },
            designation: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            signature: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: AttachmentTenant.getInstance(this.tenantId),
                autopopulate: {
                    select: '',
                },
            },
            thumbnail: {
                type: String,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_templates'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_templates', schema);
        }
        return modelObject;
    }
}
exports.default = TemplateTenant;
//# sourceMappingURL=TemplateTenant.js.map