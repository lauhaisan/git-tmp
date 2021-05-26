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
exports.notificationSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.notificationSchemaDefinition = {
    name: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    role: {
        type: [String],
        default: [],
    },
    isView: {
        type: Boolean,
        default: false,
    },
    viewers: {
        type: [String],
        default: [],
    },
    channel: {
        type: String,
        default: '',
    },
};
const notificationSchema = new mongoose_1.Schema(exports.notificationSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
notificationSchema.plugin(mongoose_beautiful_unique_validation_1.default);
notificationSchema.plugin(mongoose_autopopulate_1.default);
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = Notification;
//# sourceMappingURL=Notification.js.map