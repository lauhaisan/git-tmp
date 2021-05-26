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
/*


    _id: mongoose.Types.ObjectId
    triggerEvent: String
    frequency: String
    subject: String
    message: String
    sendingDate: String
*/
const constant_1 = require("@/app/utils/constant");
const lodash_1 = require("lodash");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const customEmailSchemaDefinition = {
    subject: { type: String },
    message: { type: String },
    sendingDate: {
        type: {
            type: String,
            enum: [...constant_1.CUSTOM_EMAIL.SENDING_DATE_ENUM],
            default: 'now',
        },
        value: { type: Number },
    },
    triggerEvent: {
        name: { type: String },
        value: {
            type: String,
            enum: [...constant_1.CUSTOM_EMAIL.TRIGGER_EVENT_ENUM],
            default: '',
        },
    },
    applyTo: {
        type: String,
        enum: [...constant_1.CUSTOM_EMAIL.APPLY_TO_ENUM],
        default: 'any',
    },
    conditions: [
        {
            _id: false,
            key: {
                type: String,
                enum: [...lodash_1.map(constant_1.CUSTOM_EMAIL.CONDITION_TYPE, ({ name }) => name)],
            },
            value: [{ type: mongoose_1.Schema.Types.ObjectId }],
        },
    ],
    recipients: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        autopopulate: {
            select: '_id',
        },
    },
    sendToExistingWorker: { type: Boolean, default: false },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: {
            select: '_id',
        },
    },
    // variables: [{ type: String }],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
};
const customEmailSchema = new mongoose_1.Schema(customEmailSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
customEmailSchema.plugin(mongoose_beautiful_unique_validation_1.default);
customEmailSchema.plugin(mongoose_autopopulate_1.default);
// customEmailSchema.pre('save', preSave)
customEmailSchema.virtual('variables').get(function () {
    // const { message }: ICustomEmail = this
    if (this.message) {
        const reg = new RegExp(/\@(.*?)\w+/, 'g');
        const variables = this.message.match(reg);
        return variables;
    }
    return [];
});
const transform = (customEmail, ret) => {
    ret.variables = customEmail.variables;
};
customEmailSchema.set('toObject', {
    transform,
});
customEmailSchema.set('toJSON', {
    transform,
});
const CustomEmail = mongoose_1.default.model('CustomEmail', customEmailSchema);
// customEmailSchema.virtual('variables').get(function() {
//   const { message, _id }: ICustomEmail = this
//   let variables: string[] = []
//   let { id } = this
//   if (!id) {
//     id = _id.toHexString()
//   }
//   if (message) {
//     const reg: any = new RegExp(/\@(.*?)\w+/, 'g')
//     variables = this.message.match(reg)
//   }
//   return variables
// })
exports.default = CustomEmail;
// function preSave(next: any) {
//   if (this.message) {
//     const reg: any = new RegExp(/\@(.*?)\w+/, 'g')
//     const variables: string[] = this.message.match(reg)
//     this.variables = variables
//   }
//   next()
// }
//# sourceMappingURL=CustomEmail.js.map