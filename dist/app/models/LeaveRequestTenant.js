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
// import EmployeeTenant from './EmployeeTenant'
// import TimeoffTypeTenant from './TimeoffTypeTenant'
class LeaveRequestTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            ticketID: {
                type: String,
                required: true,
                unique: true,
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
            comment: {
                type: String,
            },
            withdraw: {
                title: {
                    type: String,
                },
                reason: {
                    type: String,
                },
            },
            type: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: TimeoffTypeTenant.getInstance(this.tenantId),
                // autopopulate: {
                //   select: 'name type typeName shortType',
                // },
                required: [true, 'Time off type is missing'],
            },
            status: {
                type: String,
                enum: [
                    'IN-PROGRESS',
                    'ON-HOLD',
                    'REJECTED',
                    'ACCEPTED',
                    'DRAFTS',
                    'DELETED',
                ],
                default: 'IN-PROGRESS',
            },
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            subject: {
                type: String,
                trim: true,
            },
            fromDate: {
                type: Date,
            },
            toDate: {
                type: Date,
            },
            leaveDates: {
                type: [
                    {
                        date: {
                            type: Date,
                        },
                        timeOfDay: {
                            type: String,
                            enum: ['WHOLE-DAY', 'MORNING', 'AFTERNOON'],
                        },
                    },
                ],
            },
            duration: {
                type: Number,
            },
            onDate: {
                type: Date,
            },
            description: {
                type: String,
            },
            approvalManager: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            cc: {
                type: [
                    {
                        type: mongoose_1.Schema.Types.ObjectId,
                    },
                ],
            },
            updated: {
                type: Boolean,
                default: false,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_leaverequest'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_leaverequest', schema);
        }
        return modelObject;
    }
}
exports.default = LeaveRequestTenant;
//# sourceMappingURL=LeaveRequestTenant.js.map