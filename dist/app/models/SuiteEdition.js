"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const suiteEditionSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        uppercase: true,
        enum: ['FREE', 'BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE', 'TECHPARK'],
    },
    name: { type: String, required: true, maxlength: 125, unique: true },
    locationLimit: { type: Number, required: true, default: 5 },
    employeeLimit: { type: Number, required: true, default: 20 },
    managerLimit: { type: Number, required: true, default: 10 },
    price: { type: Number, required: true, default: 5 },
    description: { type: String, maxlength: 500 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { versionKey: false, timestamps: true });
suiteEditionSchema.plugin(mongoose_beautiful_unique_validation_1.default);
suiteEditionSchema.plugin(mongoose_autopopulate_1.default);
const SuiteEdition = mongoose_1.default.model('SuiteEdition', suiteEditionSchema);
exports.default = SuiteEdition;
//# sourceMappingURL=SuiteEdition.js.map