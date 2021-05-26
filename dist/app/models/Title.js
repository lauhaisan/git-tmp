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
exports.titleSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.titleSchemaDefinition = {
    name: {
        type: String,
        unique: true,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    departmentName: {
        type: String,
    },
    // department: {
    //   type: Schema.Types.ObjectId,
    // },
    isDefault: {
        type: Boolean,
    },
};
const titleSchema = new mongoose_1.Schema(exports.titleSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
titleSchema.plugin(mongoose_beautiful_unique_validation_1.default);
const Title = mongoose_1.default.model('Title', titleSchema);
exports.default = Title;
//# sourceMappingURL=Title.js.map