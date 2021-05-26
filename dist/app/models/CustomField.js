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
const schema = new mongoose_1.Schema({
    section: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'CustomSection',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    helpText: {
        type: String,
    },
    helpMedia: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Attachment',
        autopopulate: {
            select: '',
        },
    },
    settings: {
        sensitive: { type: Boolean, default: true },
        applicant: { type: String, default: 'EMPLOYEE' },
        onboardingComplete: { type: Boolean, default: true },
        visibleToIndividual: { type: Boolean, default: true },
        visibileToManager: { type: Boolean, default: true },
    },
    filters: [
        {
            _id: false,
            department: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Department',
                autopopulate: {
                    select: '_id name',
                },
            },
            title: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Title',
                autopopulate: {
                    select: '_id name',
                },
            },
        },
    ],
}, { timestamps: true, versionKey: false });
schema.methods.toJSON = function () {
    const fieldObj = this.toObject();
    fieldObj.filters.map((item) => delete item._id);
    return fieldObj;
};
schema.plugin(mongoose_beautiful_unique_validation_1.default);
schema.plugin(mongoose_autopopulate_1.default);
exports.default = mongoose_1.default.model('CustomField', schema);
//# sourceMappingURL=CustomField.js.map