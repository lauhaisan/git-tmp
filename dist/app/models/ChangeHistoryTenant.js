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
// import DepartmentTenant from './DepartmentTenant'
// import EmployeeTenant from './EmployeeTenant'
// import EmployeeTypeTenant from './EmployeeTypeTenant'
// import LocationTenant from './LocationTenant'
// import TitleTenant from './TitleTenant'
class ChangeHistoryTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            title: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            manager: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            compensationType: String,
            currentAnnualCTC: String,
            location: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            employeeType: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            department: {
                type: mongoose_1.Schema.Types.ObjectId,
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
                //ref: EmployeeTenant.getInstance(this.tenantId),
                required: [true, 'Employee ID is missing'],
            },
            changedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: EmployeeTenant.getInstance(this.tenantId),
                required: [true, 'Responsible person for changing this is missing'],
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_changehistory'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_changehistory', schema);
        }
        return modelObject;
    }
}
exports.default = ChangeHistoryTenant;
//# sourceMappingURL=ChangeHistoryTenant.js.map