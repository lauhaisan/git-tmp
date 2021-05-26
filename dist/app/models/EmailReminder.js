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
exports.emailReminderSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.emailReminderSchemaDefinition = {
    onEvent: {
        type: String,
        enum: ['START-WORK', 'LEAVE-WORK', 'WORK-ANNIVERSARY', 'ANNUAL'],
    },
    frequency: {
        type: String,
        enum: ['PREMIUM', 'EVERY-YEAR'],
    },
    sendingDate: {
        type: Number,
        default: 0,
    },
    // appliesTo: [
    //   {
    //     key: String,
    //     value: {
    //       type: Schema.Types.ObjectId,
    //       ref: ''
    //     }
    //   },
    // ],
    // receipients: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Employee',
    // },
    toAllCurrentWorker: {
        type: Boolean,
        default: false,
    },
    emailSubject: {
        type: String,
    },
    emailMessage: {
        type: String,
    },
};
const emailReminderSchema = new mongoose_1.Schema(exports.emailReminderSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
emailReminderSchema.plugin(mongoose_autopopulate_1.default);
emailReminderSchema.plugin(mongoose_beautiful_unique_validation_1.default);
exports.default = mongoose_1.default.model('EmailReminder', emailReminderSchema);
//# sourceMappingURL=EmailReminder.js.map