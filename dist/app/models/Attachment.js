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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentProperties = void 0;
// import UploadService from '@/app/services/UploadService'
const mongoose_1 = __importStar(require("mongoose"));
exports.AttachmentProperties = {
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    name: { type: String, required: true },
    fileName: { type: String, unique: true, required: true },
    path: { type: String, required: true, unique: true },
    type: String,
    size: Number,
    category: { type: String, required: true },
    status: { type: Number, default: 0 },
    tenant: { type: String },
    url: { type: String },
};
const attachmentSchema = new mongoose_1.default.Schema(exports.AttachmentProperties, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// // tslint:disable-next-line:prettier
// attachmentSchema.virtual('url').get(function() {
//   const { category, _id, name }: IAttachment = this
//   let { id } = this
//   if (!id) {
//     id = _id.toHexString()
//   }
//   return UploadService.getPublicUrl(category, id, name)
// })
const transform = (attachment, ret) => {
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
    delete ret.path;
    ret.url = encodeURI(attachment.url);
};
attachmentSchema.set('toObject', {
    transform,
});
attachmentSchema.set('toJSON', {
    transform,
});
const Attachment = mongoose_1.default.model('Attachment', attachmentSchema);
exports.default = Attachment;
//# sourceMappingURL=Attachment.js.map