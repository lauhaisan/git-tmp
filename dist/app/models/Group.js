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
const groupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, constant_1.VALIDATE_MSG.groupNameRequire],
        unique: constant_1.VALIDATE_MSG.groupNameUnique,
        maxlength: 255,
        minlength: 3,
    },
    total: {
        type: Number,
        default: 1,
        max: [constant_1.COMMON.groupMax, constant_1.VALIDATE_MSG.groupTotalMax],
    },
    max: {
        type: Number,
        default: 5,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: {
            select: 'email firstName lastName fullName avatarUrl',
        },
        maxDepth: 1,
    },
    requests: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                autopopulate: {
                    maxDepth: 1,
                    select: 'email firstName lastName fullName avatarUrl',
                },
            },
        ],
    },
    members: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        autopopulate: { select: 'email firstName lastName fullName avatarUrl' },
    },
    invitations: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        autopopulate: { select: 'email firstName lastName fullName avatarUrl' },
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
groupSchema.plugin(mongoose_autopopulate_1.default);
groupSchema.plugin(mongoose_beautiful_unique_validation_1.default);
const Group = mongoose_1.default.model('Group', groupSchema);
exports.default = Group;
//# sourceMappingURL=Group.js.map