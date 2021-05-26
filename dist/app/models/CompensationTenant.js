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
// import CompanyTenant from './CompanyTenant'
// import EmployeeTenant from './EmployeeTenant'
class CompensationTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            // BankAccTenant.instance = new BankAccTenant();
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            compensationType: { type: String },
            // currentCTC: {
            //   type: {
            //     type: {
            //       type: String,
            //       enum: ['hourly', 'annually'],
            //       required: [true, 'Current CTC type is missing'],
            //     },
            //     amount: {
            //       type: Number,
            //       required: [true, 'The amount of CTC is missing'],
            //     },
            //   },
            // },
            timeOffPolicy: { type: String },
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: CompanyTenant.getInstance(this.tenantId),
                required: true,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        // return mongoose.model<ICompensation>(
        //   prefix + '_Compensation',
        //   compensationSchema,
        // )
        let modelObject = mongoose_1.default.models[this.tenantId + '_compensation'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_compensation', schema);
        }
        return modelObject;
    }
}
exports.default = CompensationTenant;
//# sourceMappingURL=CompensationTenant.js.map