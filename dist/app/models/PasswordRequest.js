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
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const passwordRequestSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        maxlength: 255,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, constant_1.VALIDATE_MSG.emailValid],
    },
    time: {
        type: Number,
    },
    code: {
        type: Number,
        required: true,
    },
    isClient: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: {
            select: '-createdAt -updatedAt -roles -manageLocations -password -manager -location',
        },
    },
}, { versionKey: false, timestamps: true });
passwordRequestSchema.plugin(mongoose_beautiful_unique_validation_1.default);
passwordRequestSchema.plugin(mongoose_autopopulate_1.default);
const PasswordRequest = mongoose_1.default.model('PasswordRequest', passwordRequestSchema);
exports.default = PasswordRequest;
//# sourceMappingURL=PasswordRequest.js.map