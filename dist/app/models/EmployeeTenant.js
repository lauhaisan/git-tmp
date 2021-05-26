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
class EmployeeTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            // BankAccTenant.instance = new BankAccTenant();
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            employeeId: { type: String },
            employeeType: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            title: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            joinDate: { type: Date },
            manager: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            department: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: CompanyTenant.getInstance(this.tenantId),
                required: true,
            },
            manageLocations: [
                {
                    type: mongoose_1.Schema.Types.ObjectId,
                    //ref: LocationTenant.getInstance(this.tenantId),
                    required: true,
                },
            ],
            location: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: LocationTenant.getInstance(this.tenantId),
                required: true,
            },
            generalInfo: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            performanceHistory: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            compensation: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            timeSchedule: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            benefits: [
                {
                    type: mongoose_1.Schema.Types.ObjectId,
                },
            ],
            departmentTeam: { type: String },
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
                default: 'ACTIVE',
            },
            tenant: { type: String },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_employees'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_employees', schema);
        }
        else {
            modelObject.schema.add(schema);
        }
        return modelObject;
    }
}
exports.default = EmployeeTenant;
//# sourceMappingURL=EmployeeTenant.js.map