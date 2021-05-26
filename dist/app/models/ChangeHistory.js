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
const schema = new mongoose_1.default.Schema({
    title: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
        autopopulate: {
            select: 'id name',
        },
    },
    manager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: 'id name',
        },
    },
    compensationType: String,
    currentAnnualCTC: String,
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        autopopulate: {
            select: 'id name',
        },
    },
    employeeType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'EmployeeType',
        autopopulate: {
            select: 'id name',
        },
    },
    department: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        autopopulate: {
            select: 'id name',
        },
    },
    effectiveDate: {
        type: Date,
        required: [true, 'Please pass an effective date'],
    },
    changeDate: {
        type: Date,
        required: [true, 'Please pass a change date'],
    },
    takeEffect: {
        type: String,
        enum: ['UPDATED', 'WILL_UPDATE'],
        default: 'UPDATED',
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee ID is missing'],
    },
    changedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Responsible person for changing this is missing'],
    },
}, {
    versionKey: false,
    timestamps: true,
});
schema.plugin(mongoose_autopopulate_1.default);
schema.plugin(mongoose_beautiful_unique_validation_1.default);
exports.default = mongoose_1.default.model('ChangeHistory', schema);
//# sourceMappingURL=ChangeHistory.js.map