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
exports.offBoardingRequestHistorySchemaDefinition = void 0;
const constant_1 = require("@/app/utils/constant");
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.offBoardingRequestHistorySchemaDefinition = {
    date: {
        type: Date,
        default: '',
    },
    status: {
        type: String,
        enum: [...constant_1.TYPE_TICKET_REQUEST.status, ...constant_1.TYPE_TICKET_REQUEST.action],
    },
    action: {
        type: String,
        enum: constant_1.TYPE_TICKET_REQUEST.action,
    },
    offBoardingRequest: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'OffBoardingRequest',
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Employee',
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { select: constant_1.MODEL_POPULATE.company },
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        autopopulate: { select: constant_1.MODEL_POPULATE.location },
    },
};
const offBoardingRequestHistorySchema = new mongoose_1.Schema(exports.offBoardingRequestHistorySchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
offBoardingRequestHistorySchema.plugin(mongoose_beautiful_unique_validation_1.default);
offBoardingRequestHistorySchema.plugin(mongoose_autopopulate_1.default);
const OffBoardingRequestHistory = mongoose_1.default.model('OffBoardingRequestHistory', offBoardingRequestHistorySchema);
exports.default = OffBoardingRequestHistory;
//# sourceMappingURL=OffBoardingRequestHistory.js.map