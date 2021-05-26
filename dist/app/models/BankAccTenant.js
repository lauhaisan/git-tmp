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
// import AdhaarCard from './AdhaarCard'
// import AdhaarCardTenant from './AdhaarCardTenant'
// import EmployeeTenant from './EmployeeTenant'
class BankAccTenant {
    // constructor(tenantId: string) {
    //   tenantId = tenantId
    // }
    constructor() { }
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    static getInstance(tenantId) {
        console.log('tenantId aa', this.tenantId, tenantId);
        if (this.tenantId != tenantId) {
            // BankAccTenant.instance = new BankAccTenant();
            this.tenantId = tenantId;
        }
        const bankAccSchemaDefinition = {
            bankName: {
                type: String,
                default: '',
            },
            accountNumber: {
                type: String,
                default: '',
            },
            accountType: {
                type: String,
                default: '',
            },
            ifscCode: {
                type: String,
                default: '',
            },
            micrcCode: {
                type: String,
                default: '',
            },
            uanNumber: {
                type: String,
                default: '',
            },
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
            ahaarCard: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
        };
        const bankAccSchema = new mongoose_1.Schema(bankAccSchemaDefinition, {
            timestamps: true,
            versionKey: false,
        });
        bankAccSchema.plugin(mongoose_beautiful_unique_validation_1.default);
        bankAccSchema.plugin(mongoose_autopopulate_1.default);
        let modelObject = mongoose_1.default.models[this.tenantId + '_bankaccs'];
        // return mongoose.model<IBankAcc>(prefix + '_BankAcc', bankAccSchema)
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_bankaccs', bankAccSchema);
        }
        return modelObject;
        // return BankAccTenant.instance;
    }
    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    static getTenant() {
        return this.tenantId;
    }
    static getModel() { }
}
exports.default = BankAccTenant;
//# sourceMappingURL=BankAccTenant.js.map