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
exports.promoteHistorySchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.promoteHistorySchemaDefinition = {
    changeInfo: String,
    effectiveDate: Date,
    changedDate: {
        type: Date,
        default: Date.now,
    },
    changeBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        autopopulate: {
            select: '_id',
        },
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        autopopulate: {
            select: '-department -manager -location -generalInfo',
        },
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        autopopulate: {
            select: '_id name',
        },
    },
};
const promoteHistorySchema = new mongoose_1.Schema(exports.promoteHistorySchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
promoteHistorySchema.plugin(mongoose_beautiful_unique_validation_1.default);
promoteHistorySchema.plugin(mongoose_autopopulate_1.default);
const PromoteHistory = mongoose_1.default.model('PromoteHistory', promoteHistorySchema);
exports.default = PromoteHistory;
//# sourceMappingURL=PromoteHistory.js.map