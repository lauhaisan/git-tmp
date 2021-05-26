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
const Bcrypt_1 = __importDefault(require("@/app/services/Bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
// import CandidateTenant from './CandidateTenant'
// import EmployeeTenant from './EmployeeTenant'
// import RoleTenant from './RoleTenant'
class UserTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const PrivateFields = {
            email: {
                type: String,
            },
            status: {
                type: String,
                enum: ['ACTIVE', 'INACTIVE'],
                default: 'ACTIVE',
            },
            employee: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
        };
        const schema = new mongoose_1.Schema(Object.assign(Object.assign({}, PrivateFields), { password: { type: String }, fcmToken: String }), {
            versionKey: false,
            timestamps: true,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
        });
        // Make the group unique:
        schema.index({ email: 1, company: 1 }, { unique: [1, 'Email {VALUE} already exists'] });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        // tslint:disable-next-line:prettier
        const comparePassword = function (candidatePassword) {
            return new Bcrypt_1.default(this.password).compare(candidatePassword);
        };
        schema.methods.comparePassword = comparePassword;
        // return mongoose.model<IUser>(prefix + '_User', userSchema)
        let modelObject = mongoose_1.default.models[this.tenantId + '_users'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_users', schema);
        }
        else {
            console.log('modelObject.schema 1', modelObject.schema);
            modelObject.schema.add(schema);
            console.log('modelObject.schema 2 ', modelObject.schema);
        }
        return modelObject;
    }
}
exports.default = UserTenant;
//# sourceMappingURL=UserTenant.js.map