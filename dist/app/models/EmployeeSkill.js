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
exports.employeeSkillSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.employeeSkillSchemaDefinition = {
    name: String,
    type: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'SkillType',
        autopopulate: {
            select: '_id',
        },
    },
    year: {
        type: Number,
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Employee',
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
    },
};
const employeeSkillSchema = new mongoose_1.Schema(exports.employeeSkillSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
employeeSkillSchema.plugin(mongoose_beautiful_unique_validation_1.default);
employeeSkillSchema.plugin(mongoose_autopopulate_1.default);
const EmployeeSkill = mongoose_1.default.model('EmployeeSkill', employeeSkillSchema);
exports.default = EmployeeSkill;
//# sourceMappingURL=EmployeeSkill.js.map