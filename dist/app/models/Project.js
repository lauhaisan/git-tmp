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
exports.projectSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.projectSchemaDefinition = {
    name: String,
    location: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Location',
        required: true,
        autopopulate: {
            select: '_id',
        },
    },
    company: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Company',
        required: true,
        autopopulate: {
            select: '_id',
        },
    },
    resource: [
        {
            employee: {
                type: mongoose_1.default.Types.ObjectId,
                ref: 'Employee',
                required: true,
                autopopulate: {
                    select: '_id',
                },
            },
            role: {
                type: String,
                enum: [
                    'Developer',
                    'Project Manager',
                    'Team Leader',
                    'Quality Assurance',
                    'Business Analyst',
                    'Technical Architect',
                ],
                default: 'Developer',
                required: true,
            },
            effort: {
                type: Number,
                required: true,
            },
        },
    ],
    manager: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Employee',
        required: true,
        autopopulate: {
            select: '_id',
        },
    },
    projectHealth: { type: Number },
    beginDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: ['retainer', 'fixBid', 'nonBillable'],
        default: 'retainer',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    logo: {
        type: String,
    },
};
const projectSchema = new mongoose_1.Schema(exports.projectSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
projectSchema.plugin(mongoose_beautiful_unique_validation_1.default);
projectSchema.plugin(mongoose_autopopulate_1.default);
const Project = mongoose_1.default.model('Project', projectSchema);
exports.default = Project;
//# sourceMappingURL=Project.js.map