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
// import LocationTenant from './LocationTenant'
// import UserTenant from './UserTenant'
class HistoryTenant {
    constructor() { }
    static getInstance(tenantId) {
        if (this.tenantId != tenantId) {
            this.tenantId = tenantId;
        }
        const schema = new mongoose_1.Schema({
            object: {
                type: mongoose_1.Schema.Types.ObjectId,
                refPath: 'onModel',
                required: true,
            },
            onModel: {
                type: String,
                required: true,
                default: 'Report',
            },
            action: { type: String, required: true },
            extra: mongoose_1.Schema.Types.Mixed,
            performer: {
                type: mongoose_1.Schema.Types.ObjectId,
                //ref: UserTenant.getInstance(this.tenantId),
                autopopulate: {
                    select: '-_id firstName lastName fullName avatarUrl email',
                },
            },
            company: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            location: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
        }, { timestamps: true, versionKey: false });
        schema.plugin(mongoose_beautiful_unique_validation_1.default);
        schema.plugin(mongoose_autopopulate_1.default);
        // schema.pre('find', (next: mongoose.HookNextFunction) => {
        //   this.populate([{ path: 'object.user' }])
        //   next()
        // })
        schema.set('toJSON', {
            transform: (_, ret) => {
                delete ret.__v;
                ret.id = ret._id;
                delete ret._id;
            },
        });
        let modelObject = mongoose_1.default.models[this.tenantId + '_histories'];
        if (!modelObject) {
            modelObject = mongoose_1.default.model(this.tenantId + '_histories', schema);
        }
        return modelObject;
    }
}
exports.default = HistoryTenant;
//# sourceMappingURL=HistoryTenant.js.map