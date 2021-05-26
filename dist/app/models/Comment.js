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
const commentSchema = new mongoose_1.default.Schema({
    report: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Report',
        required: [true, 'Report id must be provided'],
    },
    content: { type: String, required: true, maxlength: 255 },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator id must be provided'],
        autopopulate: {
            select: constant_1.MODEL_POPULATE.miniUser,
        },
    },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location' },
    syncInfo: {
        type: Object,
    },
}, { versionKey: false, timestamps: true });
commentSchema.plugin(mongoose_autopopulate_1.default);
// const Comment = mongoose.model<IComment>('Comment', commentSchema)
exports.default = Comment;
//# sourceMappingURL=Comment.js.map