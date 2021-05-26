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
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const timeoffTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
    },
    shortType: {
        type: String,
        required: true,
    },
    typeName: {
        type: String,
        required: true,
        enum: [
            'Paid Leaves',
            'Unpaid Leaves',
            'Special Leaves',
            'Working out of office',
        ],
    },
    description: { type: String, required: true },
    policyDoc: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Document' },
    baseAccrual: {
        time: { type: Number },
        date: { type: String },
        unlimited: { type: Boolean },
    },
    tenureAccrual: [
        {
            yearOfEmployment: { type: Number },
            totalLeave: { type: Number },
            date: { type: String },
            effectiveFrom: { type: String },
        },
    ],
    accrualSchedule: {
        accrualFrequency: { type: String },
        timeOfAccrual: { type: String },
        startDate: { type: Date },
        useHireDateAnniversaries: { type: Boolean },
    },
    maxBalance: {
        notGreaterThan: {
            type: Number,
        },
        date: { type: String },
        unlimited: { type: Boolean },
    },
    negativeBalance: {
        unto: { type: Number },
        date: { type: String },
        unlimited: { type: Boolean },
    },
    annualReset: {
        resetDate: { type: Date },
        resetAnnually: { type: Boolean },
    },
    carryoverCap: {
        uptownAmount: { type: Number },
        date: { type: String },
        effectiveFrom: { type: Date },
        unlimited: { type: Boolean },
    },
    waitingPeriod: {
        afterAmount: { type: Number },
        date: { type: String },
        accrue: { type: Boolean },
    },
    minIncrements: {
        min: { type: Number },
        date: { type: String },
        notImpose: { type: Boolean },
    },
    hireProbation: {
        newHire: { type: Boolean },
    },
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    country: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Country' },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location' },
});
timeoffTypeSchema.plugin(mongoose_beautiful_unique_validation_1.default);
const TimeoffType = mongoose_1.default.model('TimeoffType', timeoffTypeSchema);
exports.default = TimeoffType;
//# sourceMappingURL=TimeoffType.js.map