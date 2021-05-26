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
exports.employeeSchemaDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
exports.employeeSchemaDefinition = {
    employeeId: { type: String, unique: true },
    employeeType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'EmployeeType',
        autopopulate: {
            select: 'name',
        },
    },
    title: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Title',
        autopopulate: {
            select: 'name',
        },
    },
    joinDate: { type: Date },
    manager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Employee',
        autopopulate: {
            select: '-createdAt -updatedAt -company -manager',
        },
    },
    department: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        autopopulate: {
            select: '-createdAt -updatedAt -company',
        },
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        autopopulate: {
            select: '-createdAt -updatedAt',
        },
    },
    manageLocations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Location',
            required: true,
            autopopulate: {
                select: '-createdAt -updatedAt -company -country',
            },
        },
    ],
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
        autopopulate: {
            select: '-createdAt -updatedAt -company -country',
        },
    },
    generalInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'GeneralInfo',
        autopopulate: {
            select: '-createdAt -updatedAt -employee',
        },
    },
    performanceHistory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PerformanceHistory',
        autopopulate: {
            select: 'id',
        },
    },
    compensation: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Compensation',
        autopopulate: {
            select: 'id',
        },
    },
    timeSchedule: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TimeSchedule',
        autopopulate: {
            select: 'id',
        },
    },
    weI9: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'WeI9',
        autopopulate: {
            select: 'id',
        },
    },
    benefits: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Benefit',
        },
    ],
    departmentTeam: { type: String },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
};
const employeeSchema = new mongoose_1.Schema(exports.employeeSchemaDefinition, {
    timestamps: true,
    versionKey: false,
});
employeeSchema.plugin(mongoose_beautiful_unique_validation_1.default);
employeeSchema.plugin(mongoose_autopopulate_1.default);
employeeSchema.pre('find', preFindManyUser);
const Employee = mongoose_1.default.model('Employee', employeeSchema);
exports.default = Employee;
function preFindManyUser(next) {
    const populateList = [
        {
            path: 'GeneralInfo',
        },
    ];
    this.populate(populateList);
    next();
}
//# sourceMappingURL=Employee.js.map